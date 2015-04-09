import Ember from "ember";
import Wormhole from 'ember-wormhole/components/ember-wormhole';

export default Wormhole.extend({
  destinationElement: Ember.computed(function () {
    return document.getElementsByTagName('head')[0];
  })
});
