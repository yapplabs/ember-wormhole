import { computed } from '@ember/object';
import Wormhole from 'ember-wormhole/components/ember-wormhole';
import layout from '../templates/components/x-favicon';

export default Wormhole.extend({
  layout,
  destinationElement: computed.reads('_dom.head')
});
