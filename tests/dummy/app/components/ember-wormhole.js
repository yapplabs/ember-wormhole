/* eslint-disable prettier/prettier */
import { on } from '@ember/object/evented';
import EmberWormhole from 'ember-wormhole/components/ember-wormhole';
import { setData, removeData } from 'dummy/utils/data';

export default EmberWormhole.extend({
  _storeSelf: on('didInsertElement', function () {
    setData(this.element, this);
  }),

  _removeSelf: on('willDestroyElement', function () {
    removeData(this.element);
  })
});
