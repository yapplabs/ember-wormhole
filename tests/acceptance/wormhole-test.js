import { set } from '@ember/object';
import QUnit, { module, test } from 'qunit';
import { setupApplicationTest } from 'ember-qunit';
import { click, fillIn, currentRouteName, visit, settled, setupOnerror } from '@ember/test-helpers';
import { getData } from 'dummy/utils/data';

function query(sel) {
  let match = /:contains\(([^)]+)\)/.exec(sel);
  let contains = null;
  if (match !== null) {
    contains = match[1];
    sel = sel.slice(0, match.index);
  }

  let elems = Array.from(document.querySelectorAll(sel));
  if (contains !== null) {
    elems = elems.filter((el) => el.textContent.includes(contains));
  }
  return elems;
}

QUnit.assert.contentIn = function(sidebarId, content) {
  content = content || 'h1';
  this.equal(query(`#${sidebarId} ${content}`).length, 1, `content is visible in sidebar #${sidebarId}`);
};

QUnit.assert.contentNotIn = function(sidebarId, content) {
  content = content || 'h1';
  this.equal(query(`#${sidebarId} ${content}`).length, 0, `content is not visible in sidebar #${sidebarId}`);
};

module('Acceptance: Wormhole', function(hooks) {
  setupApplicationTest(hooks);

  test('modal example', async function(assert) {
    await visit('/');
    assert.equal(currentRouteName(), 'index');
    await click(query('button:contains(Toggle Modal)')[0]);
    assert.equal(query('#modals .overlay').length, 1, 'overlay is visible');
    assert.equal(query('#modals .dialog').length, 1, 'dialog is visible');
    await click('#modals .overlay');
    assert.equal(query('#modals .overlay').length, 0, 'overlay is not visible');
    assert.equal(query('#modals .dialog').length, 0, 'dialog is not visible');
    await fillIn('.username', 'coco');
    await click(query('button:contains(Toggle Modal)')[0]);
    assert.equal(query('#modals .dialog p:contains(coco)').length, 1, 'up-to-date username is shown in dialog');
  });

  test('sidebar example', async function(assert) {
    let sidebarWormhole;
    let header1, header2;
    let sidebarFirstNode1, sidebarFirstNode2;

    await visit('/');
    assert.equal(currentRouteName(), 'index');
    await click(query('button:contains(Toggle Sidebar Content)')[0]);
    sidebarWormhole = getData(document.getElementById('sidebarWormhole'));
    sidebarFirstNode1 = sidebarWormhole._wormholeHeadNode;
    header1 = query('#sidebar h1');
    assert.contentIn('sidebar');
    await fillIn('.first-name', 'Ray');
    await fillIn('.last-name', 'Cohen');
    assert.contentIn('sidebar', 'p:contains(Ray Cohen)');
    await click(query('#sidebar button:contains(Switch)')[0]);
    sidebarFirstNode2 = sidebarWormhole._wormholeHeadNode;
    header2 = query('#othersidebar h1');
    assert.equal(header1.textContent, header2.textContent, 'same header text');
    assert.ok(header1[0] === header2[0], 'same header elements'); // appended elsewhere
    assert.ok(sidebarFirstNode1 === sidebarFirstNode2, 'different first nodes'); // appended elsewhere
    assert.contentNotIn('sidebar');
    assert.contentIn('othersidebar');
    await click(query('#othersidebar button:contains(Switch)')[0]);
    assert.contentIn('sidebar');
    assert.contentNotIn('othersidebar');
    await click(query('#sidebar button:contains(Hide)')[0]);
    assert.contentNotIn('sidebar');
    assert.contentNotIn('othersidebar');
  });

  test('sidebar example in place', async function(assert) {
    await visit('/');
    await click(query('button:contains(Toggle Sidebar Content)')[0]);
    assert.contentIn('sidebar');
    assert.contentNotIn('othersidebar');
    assert.contentNotIn('example-sidebar');
    await click(query('button:contains(Toggle In Place)')[0]);
    assert.contentNotIn('sidebar');
    assert.contentNotIn('othersidebar');
    assert.contentIn('example-sidebar');
    await click(query('button:contains(Switch Sidebars From Without)')[0]);
    assert.contentNotIn('sidebar');
    assert.contentNotIn('othersidebar');
    assert.contentIn('example-sidebar');
    await click(query('button:contains(Toggle In Place)')[0]);
    assert.contentNotIn('sidebar');
    assert.contentIn('othersidebar');
    assert.contentNotIn('example-sidebar');
    await click(query('button:contains(Hide)')[0]);
    assert.contentNotIn('sidebar');
    assert.contentNotIn('othersidebar');
    assert.contentNotIn('example-sidebar');
  });

  test('survives rerender', async function(assert) {
    let sidebarWormhole;
    let header1, header2;

    await visit('/');
    assert.equal(currentRouteName(), 'index');

    await click(query('button:contains(Toggle Sidebar Content)')[0]);
    sidebarWormhole = getData(document.getElementById('sidebarWormhole'));
    header1 = query('#sidebar h1');
    assert.contentIn('sidebar');

    await fillIn('.first-name', 'Ringo');
    await fillIn('.last-name', 'Starr');
    assert.contentIn('sidebar', 'p:contains(Ringo Starr)');
    sidebarWormhole.rerender();
    header2 = query('#sidebar h1');
    assert.contentIn('sidebar', 'p:contains(Ringo Starr)');
    assert.equal(header1.textContent, header2.textContent, 'same header text');
  });

  test('throws if destination element not in DOM', async function(assert) {
    await visit('/');

    let lastError;
    setupOnerror((error) => lastError = error);

    let sidebar = document.getElementById('sidebar');
    sidebar.parentNode.removeChild(sidebar);

    await click(query('button:contains(Toggle Sidebar Content)')[0]);

    assert.equal(lastError && lastError.message, "ember-wormhole failed to render into '#sidebar' because the element is not in the DOM");
  });

  test('throws if destination element id falsy', async function(assert) {
    await visit('/');

    let lastError;
    setupOnerror((error) => lastError = error);

    this.owner.lookup('controller:index').set('sidebarId', null);
    await click(query('button:contains(Toggle Sidebar Content)')[0]);

    assert.equal(lastError && lastError.message, 'ember-wormhole failed to render content because the destinationElementId was set to an undefined or falsy value.');
  });

  test('preserves focus', async function(assert) {
    let sidebarWormhole;
    let focused;
    await visit('/');
    assert.equal(currentRouteName(), 'index');
    await click(query('button:contains(Toggle Sidebar Content)')[0]);
    sidebarWormhole = getData(query('#sidebarWormhole')[0]);
    assert.contentIn('sidebar');
    assert.contentNotIn('othersidebar');
    query('button:contains(Hide Sidebar Content)')[0].focus();
    focused = document.activeElement;
    set(sidebarWormhole, 'to', 'othersidebar');
    await settled();
    assert.contentNotIn('sidebar');
    assert.contentIn('othersidebar');
    assert.equal(document.activeElement, focused);
  });

  test('favicon example', async function(assert) {
    await visit('/');
    let favicon = query('link[rel="icon"]')[0];
    assert.equal(favicon.getAttribute('href'), 'http://emberjs.com/images/favicon.png');

    await fillIn('.favicon', 'http://handlebarsjs.com/images/favicon.png');
    let favicon2 = query('link[rel="icon"]')[0];
    assert.equal(favicon2.getAttribute('href'), 'http://handlebarsjs.com/images/favicon.png');
  });

  test('document-title example', async function(assert) {
    await visit('/');
    assert.equal(document.title, 'ember-wormhole');

    await click('#toggle-title');
    assert.equal(document.title, 'ember-wormhole Testing');

    await click('#toggle-title');
    assert.equal(document.title, 'ember-wormhole');
  });
});
