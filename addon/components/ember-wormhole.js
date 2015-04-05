import Ember from 'ember';

var computed = Ember.computed;

export default Ember.Component.extend({
  tagName: '',

  to: computed.alias('destinationElementId'),
  destinationElementId: null,
  destinationElement: computed('destinationElementId', function() {
    return document.getElementById(this.get('destinationElementId'));
  }),

  render: function(buffer) {
    var destinationElement = this.get('destinationElement');
    if (!destinationElement) {
      var destinationElementId = this.get('destinationElementId');
      if (destinationElementId) {
        throw new Error(`ember-wormhole failed to render into '#${this.get('destinationElementId')}' because the element is not in the DOM`);
      } else {
        throw new Error('ember-wormhole failed to render content because the destinationElementId was set to an undefined or falsy value.');
      }
    }
    this._morph = buffer.dom.appendMorph(destinationElement);
    this._super.apply(this, arguments);
  },

  willClearRender: function() {
    var morph = this._morph;
    Ember.run.schedule('render', morph, morph.destroy);
    this._super.apply(this);
  }
});
