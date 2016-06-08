import Ember from "ember";
import Wormhole from 'ember-wormhole/components/ember-wormhole';
import layout from '../templates/components/x-favicon';

export default Wormhole.extend({
  layout,
  destinationElement: Ember.computed(function () {
    return document.getElementsByTagName('head')[0];
  })
});
