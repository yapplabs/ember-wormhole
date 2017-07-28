import { on } from '@ember/object/evented';
import EmberWormhole from 'ember-wormhole/components/ember-wormhole';

export default EmberWormhole.extend({
  _storeSelf: on('didInsertElement', function () {
    this.$().data('ember-wormhole', this);
  }),

  _removeSelf: on('willDestroyElement', function () {
    this.$().removeData();
  })
});
