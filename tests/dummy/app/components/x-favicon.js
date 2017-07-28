import { computed } from '@ember/object';
import Wormhole from 'ember-wormhole/components/ember-wormhole';
import layout from '../templates/components/x-favicon';

export default Wormhole.extend({
  layout,
  destinationElement: computed(function () {
    return document.getElementsByTagName('head')[0];
  })
});
