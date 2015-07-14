import Ember from 'ember';

const { computed, inject, observer, run } = Ember;

export default Ember.Component.extend({
  to: computed.alias('destinationName'),
  wormholeTargetService: inject.service('wormhole-target'),

  destinationName: null,
  renderInPlace: false,

  destination: computed('destinationName', 'renderInPlace', function() {
    return this.get('renderInPlace') ? this.element : this.get('destinationName');
  }),

  didInsertElement() {
    const destination = this.get('destination');

    this._firstNode = this.element.firstChild;
    this._lastNode = this.element.lastChild;

    this.get('wormholeTargetService').appendRange(destination, this._firstNode, this._lastNode);
  },

  willDestroyElement() {
    const destination = this.get('destination');

    run.schedule('render', () => {
      this.get('wormholeTargetService').removeRange(destination, this._firstNode, this._lastNode);
    });
  },

  destinationDidChange: observer('destination', function() {
    const destination = this.get('destination');

    run.schedule('render', () => {
      this.get('wormholeTargetService').appendRange(destination, this._firstNode, this._lastNode);
    });
  })
});
