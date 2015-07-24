import EmberWormhole from 'ember-wormhole/components/ember-wormhole';
import Ember from 'ember';

const on = Ember.on;

export default EmberWormhole.extend({
  _storeSelf: on('didInsertElement', function () {
    this.$().data('ember-wormhole', this);
  }),

  _removeSelf: on('willDestroyElement', function () {
    this.$().removeData();
  })
});
