import Ember from 'ember';
import QUnit from 'qunit';
import {
  module,
  test
} from 'qunit';
import startApp from 'dummy/tests/helpers/start-app';

var application;
var assert = QUnit.assert;

assert.contentInSidebar = function(sidebarId, content) {
  content = content || 'h1';
  this.equal(findWithAssert(`#${sidebarId} ${content}`).length, 1, `content is visible in sidebar #${sidebarId}`);
};
assert.contentNotInSidebar = function(sidebarId, content) {
  content = content || 'h1';
  this.equal(find(`#${sidebarId} ${content}`).length, 0, `content is not visible in sidebar #${sidebarId}`);
};

module('Acceptance: Wormhole', {
  beforeEach: function() {
    application = startApp();
  },

  afterEach: function() {
    Ember.run(application, 'destroy');
  }
});

test('modal example', function(assert) {
  visit('/');
  andThen(function() {
    assert.equal(currentPath(), 'index');
  });
  click('button:contains(Toggle Modal)');
  andThen(function() {
    assert.equal(Ember.$('#modals .overlay').length, 1, 'overlay is visible');
    assert.equal(Ember.$('#modals .dialog').length, 1, 'dialog is visible');
  });
  click('#modals .overlay');
  andThen(function() {
    assert.equal(Ember.$('#modals .overlay').length, 0, 'overlay is not visible');
    assert.equal(Ember.$('#modals .dialog').length, 0, 'dialog is not visible');
  });
  fillIn('.username', 'coco');
  click('button:contains(Toggle Modal)');
  andThen(function() {
    assert.equal(Ember.$('#modals .dialog p:contains(coco)').length, 1, 'up-to-date username is shown in dialog');
  });
});

test('sidebar example', function(assert) {
  var sidebarView;
  var header1, header2;
  var sidebarFirstNode1, sidebarFirstNode2;

  visit('/');
  andThen(function() {
    assert.equal(currentPath(), 'index');
  });
  click('button:contains(Toggle Sidebar Content)');
  andThen(function() {
    sidebarView = Ember.View.views.sidebarWormhole;
    sidebarFirstNode1 = sidebarView._firstNode;
    header1 = Ember.$('#sidebar h1');
    assert.contentInSidebar('sidebar');
  });
  fillIn('.first-name', 'Ray');
  fillIn('.last-name', 'Cohen');
  andThen(function() {
    assert.contentInSidebar('sidebar', 'p:contains(Ray Cohen)');
  });
  click('#sidebar button:contains(Switch)');
  andThen(function() {
    sidebarFirstNode2 = sidebarView._firstNode;
    header2 = Ember.$('#othersidebar h1');
    assert.equal(header1.text(), header2.text(), 'same header text');
    assert.ok(header1.is(header2), 'same header elements'); // appended elsewhere
    assert.ok(sidebarFirstNode1.isSameNode(sidebarFirstNode2), 'different first nodes'); // appended elsewhere
    assert.contentNotInSidebar('sidebar');
    assert.contentInSidebar('othersidebar');
  });
  click('#othersidebar button:contains(Switch)');
  andThen(function() {
    assert.contentInSidebar('sidebar');
    assert.contentNotInSidebar('othersidebar');
  });
  click('#sidebar button:contains(Hide)');
  andThen(function() {
    assert.contentNotInSidebar('sidebar');
    assert.contentNotInSidebar('othersidebar');
  });
});

test('survives rerender', function(assert) {
  var sidebarView;
  var header1, header2;
  var sidebarFirstNode1, sidebarFirstNode2;

  visit('/');
  andThen(function() {
    assert.equal(currentPath(), 'index');
  });

  click('button:contains(Toggle Sidebar Content)');
  andThen(function() {
    sidebarView = Ember.View.views.sidebarWormhole;
    sidebarFirstNode1 = sidebarView._firstNode;
    header1 = Ember.$('#sidebar h1');
    assert.contentInSidebar('sidebar');
  });

  fillIn('.first-name', 'Ringo');
  fillIn('.last-name', 'Starr');
  andThen(function() {
    assert.contentInSidebar('sidebar', 'p:contains(Ringo Starr)');
  });

  andThen(function() {
    sidebarView.rerender();
  });

  andThen(function() {
    sidebarFirstNode2 = sidebarView._firstNode;
    header2 = Ember.$('#sidebar h1');
    assert.contentInSidebar('sidebar', 'p:contains(Ringo Starr)');
    assert.equal(header1.text(), header2.text(), 'same header text');
    assert.ok(!header1.is(header2), 'different header elements'); // rerendered
    assert.ok(!sidebarFirstNode1.isSameNode(sidebarFirstNode2), 'different first nodes'); // rerendered
  });
});
