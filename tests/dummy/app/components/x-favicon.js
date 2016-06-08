import Ember from "ember";
import Wormhole from 'ember-wormhole/components/ember-wormhole';
import layout from '../templates/components/x-favicon';

let [major, minor] = Ember.VERSION.split('.').map(n => parseInt(n, 10));
let needsBindAttr = major === 1 && minor < 11;

export default Wormhole.extend({
  layout,
  destinationElement: Ember.computed(function () {
    return document.getElementsByTagName('head')[0];
  }),

  needsBindAttr
});
