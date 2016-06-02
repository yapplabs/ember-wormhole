import Ember from "ember";
import Wormhole from 'ember-wormhole/components/ember-wormhole';

let [major, minor] = Ember.VERSION.split('.').map(n => parseInt(n, 10));
let needsBindAttr = major === 1 && minor < 11;

export default Wormhole.extend({
  destinationElement: Ember.computed(function () {
    return document.getElementsByTagName('head')[0];
  }),

  needsBindAttr
});
