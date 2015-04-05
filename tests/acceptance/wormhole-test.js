import Ember from 'ember';
import {
  module,
  test
} from 'qunit';
import startApp from 'dummy/tests/helpers/start-app';

var application;

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
  visit('/');
  andThen(function() {
    assert.equal(currentPath(), 'index');
  });
  click('button:contains(Toggle Sidebar Content)');
  andThen(function() {
    assert.equal(Ember.$('#sidebar h1').length, 1, 'content is visible in sidebar');
  });
  fillIn('.first-name', 'Ray');
  fillIn('.last-name', 'Cohen');
  andThen(function() {
    assert.equal(Ember.$('#sidebar p:contains(Ray Cohen)').length, 1, 'updated content is visible in sidebar');
  });
  click('#sidebar button');
  andThen(function() {
    assert.equal(Ember.$('#sidebar h1').length, 0, 'content is not visible in sidebar');
  });
});
