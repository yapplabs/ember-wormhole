import Ember from "ember";
import Wormhole from 'ember-wormhole/components/ember-wormhole';

var titles = Ember.A([]);
export default Wormhole.extend({
  init: function () {
    this._super();

    if (titles.length === 0) {
      document.title = '';
    }
    titles.push(this);
  },

  destinationElement: Ember.computed(function () {
    return document.getElementsByTagName('title')[0];
  }),

  willClearRender: function () {
    titles.removeObject(this);
    this._super.apply(this, arguments);
  }
});
