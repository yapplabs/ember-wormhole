import $ from 'jquery';
import run from 'ember-runloop';
import set from 'ember-metal/set';
import QUnit from 'qunit';
import {
  module,
  test
} from 'qunit';
import startApp from 'dummy/tests/helpers/start-app';

var application;
var assert = QUnit.assert;

assert.contentIn = function(sidebarId, content) {
  content = content || 'h1';
  this.equal(findWithAssert(`#${sidebarId} ${content}`).length, 1, `content is visible in sidebar #${sidebarId}`);
};
assert.contentNotIn = function(sidebarId, content) {
  content = content || 'h1';
  this.equal(find(`#${sidebarId} ${content}`).length, 0, `content is not visible in sidebar #${sidebarId}`);
};

module('Acceptance: Wormhole', {
  beforeEach() {
    application = startApp();
  },

  afterEach() {
    run(application, 'destroy');
  }
});

test('modal example', function(assert) {
  visit('/');
  andThen(function() {
    assert.equal(currentPath(), 'index');
  });
  click('button:contains(Toggle Modal)');
  andThen(function() {
    assert.equal($('#modals .overlay').length, 1, 'overlay is visible');
    assert.equal($('#modals .dialog').length, 1, 'dialog is visible');
  });
  click('#modals .overlay');
  andThen(function() {
    assert.equal($('#modals .overlay').length, 0, 'overlay is not visible');
    assert.equal($('#modals .dialog').length, 0, 'dialog is not visible');
  });
  fillIn('.username', 'coco');
  click('button:contains(Toggle Modal)');
  andThen(function() {
    assert.equal($('#modals .dialog p:contains(coco)').length, 1, 'up-to-date username is shown in dialog');
  });
});

test('sidebar example', function(assert) {
  var sidebarWormhole;
  var header1, header2;
  var sidebarFirstNode1, sidebarFirstNode2;

  visit('/');
  andThen(function() {
    assert.equal(currentPath(), 'index');
  });
  click('button:contains(Toggle Sidebar Content)');
  andThen(function() {
    sidebarWormhole = $('#sidebarWormhole').data('ember-wormhole');
    sidebarFirstNode1 = sidebarWormhole._wormholeHeadNode;
    header1 = $('#sidebar h1');
    assert.contentIn('sidebar');
  });
  fillIn('.first-name', 'Ray');
  fillIn('.last-name', 'Cohen');
  andThen(function() {
    assert.contentIn('sidebar', 'p:contains(Ray Cohen)');
  });
  click('#sidebar button:contains(Switch)');
  andThen(function() {
    sidebarFirstNode2 = sidebarWormhole._wormholeHeadNode;
    header2 = $('#othersidebar h1');
    assert.equal(header1.text(), header2.text(), 'same header text');
    assert.ok(header1.is(header2), 'same header elements'); // appended elsewhere
    assert.ok(sidebarFirstNode1.isSameNode(sidebarFirstNode2), 'different first nodes'); // appended elsewhere
    assert.contentNotIn('sidebar');
    assert.contentIn('othersidebar');
  });
  click('#othersidebar button:contains(Switch)');
  andThen(function() {
    assert.contentIn('sidebar');
    assert.contentNotIn('othersidebar');
  });
  click('#sidebar button:contains(Hide)');
  andThen(function() {
    assert.contentNotIn('sidebar');
    assert.contentNotIn('othersidebar');
  });
});

test('sidebar example in place', function(assert) {
  visit('/');
  click('button:contains(Toggle Sidebar Content)');
  andThen(function() {
    assert.contentIn('sidebar');
    assert.contentNotIn('othersidebar');
    assert.contentNotIn('example-sidebar');
  });
  click('button:contains(Toggle In Place)');
  andThen(function() {
    assert.contentNotIn('sidebar');
    assert.contentNotIn('othersidebar');
    assert.contentIn('example-sidebar');
  });
  click('button:contains(Switch Sidebars From Without)');
  andThen(function() {
    assert.contentNotIn('sidebar');
    assert.contentNotIn('othersidebar');
    assert.contentIn('example-sidebar');
  });
  click('button:contains(Toggle In Place)');
  andThen(function() {
    assert.contentNotIn('sidebar');
    assert.contentIn('othersidebar');
    assert.contentNotIn('example-sidebar');
  });
  click('#othersidebar button:contains(Hide)');
  andThen(function() {
    assert.contentNotIn('sidebar');
    assert.contentNotIn('othersidebar');
    assert.contentNotIn('example-sidebar');
  });
});

test('survives rerender', function(assert) {
  var sidebarWormhole;
  var header1, header2;

  visit('/');
  andThen(function() {
    assert.equal(currentPath(), 'index');
  });

  click('button:contains(Toggle Sidebar Content)');
  andThen(function() {
    sidebarWormhole = $('#sidebarWormhole').data('ember-wormhole');
    header1 = $('#sidebar h1');
    assert.contentIn('sidebar');
  });

  fillIn('.first-name', 'Ringo');
  fillIn('.last-name', 'Starr');
  andThen(function() {
    assert.contentIn('sidebar', 'p:contains(Ringo Starr)');
  });

  andThen(function() {
    sidebarWormhole.rerender();
  });

  andThen(function() {
    header2 = $('#sidebar h1');
    assert.contentIn('sidebar', 'p:contains(Ringo Starr)');
    assert.equal(header1.text(), header2.text(), 'same header text');
  });
});

test('throws if destination element not in DOM', function(assert) {
  visit('/');
  andThen(function() {
    $('#sidebar').remove();
  });
  var wormholeToMissingSidebar = function() {
    $('button:contains(Toggle Sidebar Content)').click();
  };
  andThen(function() {
    assert.throws(
      wormholeToMissingSidebar,
      /ember-wormhole failed to render into/,
      'throws on missing destination element'
    );
  });
});

test('throws if destination element id falsy', function(assert) {
  visit('/');
  var wormholeToNowhere = function() {
    application.__container__.lookup('controller:application').set('sidebarId', null);
    $('button:contains(Toggle Sidebar Content)').click();
  };
  andThen(function() {
    assert.throws(
      wormholeToNowhere,
      /ember-wormhole failed to render content because the destinationElementId/,
      'throws on missing destination element id'
    );
  });
});

test('preserves focus', function (assert) {
  var sidebarWormhole;
  var focused;
  visit('/');
  andThen(function() {
    assert.equal(currentPath(), 'index');
  });
  click('button:contains(Toggle Sidebar Content)');
  andThen(function() {
    sidebarWormhole = $('#sidebarWormhole').data('ember-wormhole');
    assert.contentIn('sidebar');
    assert.contentNotIn('othersidebar');
    $('button:contains(Hide Sidebar Content)').focus();
    focused = document.activeElement;
  });
  andThen(function() {
    set(sidebarWormhole, 'to', 'othersidebar');
  });
  andThen(function() {
    assert.contentNotIn('sidebar');
    assert.contentIn('othersidebar');
    assert.equal(document.activeElement, focused);
  });
});

test('favicon example', function(assert) {
  visit('/');
  andThen(function () {
    var favicon = $('link[rel="icon"]');
    assert.equal(favicon.attr('href'), 'http://emberjs.com/images/favicon.png');
  });

  fillIn('.favicon', 'http://handlebarsjs.com/images/favicon.png');
  andThen(function () {
    var favicon = $('link[rel="icon"]');
    assert.equal(favicon.attr('href'), 'http://handlebarsjs.com/images/favicon.png');
  });
});

test('document-title example', function(assert) {
  visit('/');
  andThen(function () {
    assert.equal(document.title, 'ember-wormhole');
  });

  click('#toggle-title');
  andThen(function () {
    assert.equal(document.title, 'ember-wormhole Testing');
  });

  click('#toggle-title');
  andThen(function () {
    assert.equal(document.title, 'ember-wormhole');
  });
});

// tests for dynamic content updates inside wormhole, which is failing with Glimmer2, see https://github.com/yapplabs/ember-wormhole/issues/66
test('toggle modal overlay', function(assert) {
  visit('/');
  andThen(function() {
    assert.equal(currentPath(), 'index');
  });
  click('button:contains(Toggle Modal)');
  andThen(function() {
    assert.equal($('#modals .overlay').length, 1, 'overlay is visible');
    assert.equal($('#modals .dialog').length, 1, 'dialog is visible');
  });
  click('button:contains(Toggle Overlay)');
  andThen(function() {
    assert.equal($('#modals .overlay').length, 0, 'overlay is not visible');
    assert.equal($('#modals .dialog').length, 1, 'dialog is still visible');
  });
});
