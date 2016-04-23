import Ember from 'ember';
import QUnit from 'qunit';
import {
  module,
  test
} from 'qunit';
import startApp from 'dummy/tests/helpers/start-app';

const { set } = Ember;

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
    Ember.run(application, 'destroy');
  }
});

test('modal example', function(assert) {
  visit('/');
  andThen(() => {
    assert.equal(currentPath(), 'index');
  });
  click('button:contains(Toggle Modal)');
  andThen(() => {
    assert.equal(Ember.$('#modals .overlay').length, 1, 'overlay is visible');
    assert.equal(Ember.$('#modals .dialog').length, 1, 'dialog is visible');
  });
  click('#modals .overlay');
  andThen(() => {
    assert.equal(Ember.$('#modals .overlay').length, 0, 'overlay is not visible');
    assert.equal(Ember.$('#modals .dialog').length, 0, 'dialog is not visible');
  });
  fillIn('.username', 'coco');
  click('button:contains(Toggle Modal)');
  andThen(() => {
    assert.equal(Ember.$('#modals .dialog p:contains(coco)').length, 1, 'up-to-date username is shown in dialog');
  });
});

test('sidebar example', function(assert) {
  var sidebarWormhole;
  var header1, header2;
  var sidebarFirstNode1, sidebarFirstNode2;

  visit('/');
  andThen(() => {
    assert.equal(currentPath(), 'index');
  });
  click('button:contains(Toggle Sidebar Content)');
  andThen(() => {
    sidebarWormhole = Ember.$('#sidebarWormhole').data('ember-wormhole');
    sidebarFirstNode1 = sidebarWormhole._firstNode;
    header1 = Ember.$('#sidebar h1');
    assert.contentIn('sidebar');
  });
  fillIn('.first-name', 'Ray');
  fillIn('.last-name', 'Cohen');
  andThen(() => {
    assert.contentIn('sidebar', 'p:contains(Ray Cohen)');
  });
  click('#sidebar button:contains(Switch)');
  andThen(() => {
    sidebarFirstNode2 = sidebarWormhole._firstNode;
    header2 = Ember.$('#othersidebar h1');
    assert.equal(header1.text(), header2.text(), 'same header text');
    assert.ok(header1.is(header2), 'same header elements'); // appended elsewhere
    assert.ok(sidebarFirstNode1.isSameNode(sidebarFirstNode2), 'different first nodes'); // appended elsewhere
    assert.contentNotIn('sidebar');
    assert.contentIn('othersidebar');
  });
  click('#othersidebar button:contains(Switch)');
  andThen(() => {
    assert.contentIn('sidebar');
    assert.contentNotIn('othersidebar');
  });
  click('#sidebar button:contains(Hide)');
  andThen(() => {
    assert.contentNotIn('sidebar');
    assert.contentNotIn('othersidebar');
  });
});

test('sidebar example in place', function(assert) {
  visit('/');
  click('button:contains(Toggle Sidebar Content)');
  andThen(() => {
    assert.contentIn('sidebar');
    assert.contentNotIn('othersidebar');
    assert.contentNotIn('example-sidebar');
  });
  click('button:contains(Toggle In Place)');
  andThen(() => {
    assert.contentNotIn('sidebar');
    assert.contentNotIn('othersidebar');
    assert.contentIn('example-sidebar');
  });
  click('button:contains(Switch Sidebars From Without)');
  andThen(() => {
    assert.contentNotIn('sidebar');
    assert.contentNotIn('othersidebar');
    assert.contentIn('example-sidebar');
  });
  click('button:contains(Toggle In Place)');
  andThen(() => {
    assert.contentNotIn('sidebar');
    assert.contentIn('othersidebar');
    assert.contentNotIn('example-sidebar');
  });
  click('#othersidebar button:contains(Hide)');
  andThen(() => {
    assert.contentNotIn('sidebar');
    assert.contentNotIn('othersidebar');
    assert.contentNotIn('example-sidebar');
  });
});

test('survives rerender', function(assert) {
  var sidebarWormhole;
  var header1, header2;

  visit('/');
  andThen(() => {
    assert.equal(currentPath(), 'index');
  });

  click('button:contains(Toggle Sidebar Content)');
  andThen(() => {
    sidebarWormhole = Ember.$('#sidebarWormhole').data('ember-wormhole');
    header1 = Ember.$('#sidebar h1');
    assert.contentIn('sidebar');
  });

  fillIn('.first-name', 'Ringo');
  fillIn('.last-name', 'Starr');
  andThen(() => {
    assert.contentIn('sidebar', 'p:contains(Ringo Starr)');
  });

  andThen(() => {
    sidebarWormhole.rerender();
  });

  andThen(() => {
    header2 = Ember.$('#sidebar h1');
    assert.contentIn('sidebar', 'p:contains(Ringo Starr)');
    assert.equal(header1.text(), header2.text(), 'same header text');
  });
});

test('throws if destination element not in DOM', function(assert) {
  visit('/');
  andThen(() => {
    Ember.$('#sidebar').remove();
  });
  var wormholeToMissingSidebar = function() {
    Ember.$('button:contains(Toggle Sidebar Content)').click();
  };
  andThen(() => {
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
    Ember.$('button:contains(Toggle Sidebar Content)').click();
  };
  andThen(() => {
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
  andThen(() => {
    assert.equal(currentPath(), 'index');
  });
  click('button:contains(Toggle Sidebar Content)');
  andThen(() => {
    sidebarWormhole = Ember.$('#sidebarWormhole').data('ember-wormhole');
    assert.contentIn('sidebar');
    assert.contentNotIn('othersidebar');
    Ember.$('button:contains(Hide Sidebar Content)').focus();
    focused = document.activeElement;
  });
  andThen(() => {
    set(sidebarWormhole, 'to', 'othersidebar');
  });
  andThen(() => {
    assert.contentNotIn('sidebar');
    assert.contentIn('othersidebar');
    assert.equal(document.activeElement, focused);
  });
});

test('favicon example', function(assert) {
  visit('/');
  andThen(() => {
    var favicon = $('link[rel="icon"]');
    assert.equal(favicon.attr('href'), 'http://emberjs.com/images/favicon.png');
  });

  fillIn('.favicon', 'http://handlebarsjs.com/images/favicon.png');
  andThen(() => {
    var favicon = $('link[rel="icon"]');
    assert.equal(favicon.attr('href'), 'http://handlebarsjs.com/images/favicon.png');
  });
});

test('document-title example', function(assert) {
  visit('/');
  andThen(() => {
    assert.equal(document.title, 'ember-wormhole');
  });

  click('#toggle-title');
  andThen(() => {
    assert.equal(document.title, 'ember-wormhole Testing');
  });

  click('#toggle-title');
  andThen(() => {
    assert.equal(document.title, 'ember-wormhole');
  });
});
