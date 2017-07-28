import { computed } from '@ember/object';
import { A } from '@ember/array';
import Wormhole from 'ember-wormhole/components/ember-wormhole';

var titles = A([]);
export default Wormhole.extend({
  init: function () {
    this._super();

    if (titles.length === 0) {
      document.title = '';
    }
    titles.push(this);
  },

  destinationElement: computed(function () {
    return document.getElementsByTagName('title')[0];
  }),

  willDestroyElement: function () {
    titles.removeObject(this);
    this._super.apply(this, arguments);
  }
});
