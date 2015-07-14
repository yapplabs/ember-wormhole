import Ember from 'ember';

const { computed, inject, observer, run } = Ember;

export default Ember.Component.extend({
  to: null,
  wormholeTargetService: inject.service('wormhole-target'),

  wormholeTargetName: computed.alias('to'),
  renderInPlace: false,

  wormholeTarget: computed('wormholeTargetName', 'renderInPlace', function() {
    return this.get('renderInPlace') ? this.element : this.get('wormholeTargetName');
  }),

  didInsertElement() {
    const wormholeTarget = this.get('wormholeTarget');

    this._firstNode = this.element.firstChild;
    this._lastNode = this.element.lastChild;

    this.get('wormholeTargetService').appendRange(wormholeTarget, this._firstNode, this._lastNode);
  },

  willDestroyElement() {
    const wormholeTarget = this.get('wormholeTarget');

    run.schedule('render', () => {
      this.get('wormholeTargetService').removeRange(wormholeTarget, this._firstNode, this._lastNode);
    });
  },

  destinationDidChange: observer('wormholeTarget', function() {
    const wormholeTarget = this.get('wormholeTarget');

    run.schedule('render', () => {
      this.get('wormholeTargetService').appendRange(wormholeTarget, this._firstNode, this._lastNode);
    });
  })
});
