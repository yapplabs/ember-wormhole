import Ember from 'ember';

var computed = Ember.computed;
var observer = Ember.observer;
var run = Ember.run;

export default Ember.Component.extend({
  to: computed.alias('destinationElementId'),
  destinationElementId: null,
  destinationElement: computed('destinationElementId', 'renderInPlace', function() {
    return this.get('renderInPlace') ? this.element : document.getElementById(this.get('destinationElementId'));
  }),
  renderInPlace: false,

  didInsertElement: function() {
    this._super(...arguments);
    this._firstNode = this.element.firstChild;
    this._lastNode = this.element.lastChild;
    this.appendToDestination();
  },

  willDestroyElement: function() {
    this._super(...arguments);
    var firstNode = this._firstNode;
    var lastNode = this._lastNode;
    run.schedule('render', () => {
      this.removeRange(firstNode, lastNode);
    });
  },

  destinationDidChange: observer('destinationElement', function() {
    var destinationElement = this.get('destinationElement');
    if (destinationElement !== this._firstNode.parentNode) {
      run.schedule('render', this, 'appendToDestination');
    }
  }),

  appendToDestination: function() {
    var destinationElement = this.get('destinationElement');
    var currentActiveElement = document.activeElement;
    if (!destinationElement) {
      var destinationElementId = this.get('destinationElementId');
      if (destinationElementId) {
        throw new Error(`ember-wormhole failed to render into '#${this.get('destinationElementId')}' because the element is not in the DOM`);
      }
      throw new Error('ember-wormhole failed to render content because the destinationElementId was set to an undefined or falsy value.');
    }

    this.appendRange(destinationElement, this._firstNode, this._lastNode);
    if (document.activeElement !== currentActiveElement) {
      currentActiveElement.focus();
    }
  },

  appendRange: function(destinationElement, firstNode, lastNode) {
    while(firstNode) {
      destinationElement.insertBefore(firstNode, null);
      firstNode = firstNode !== lastNode ? lastNode.parentNode.firstChild : null;
    }
  },

  removeRange: function(firstNode, lastNode) {
    var node = lastNode;
    do {
      var next = node.previousSibling;
      if (node.parentNode) {
        node.parentNode.removeChild(node);
        if (node === firstNode) {
          break;
        }
      }
      node = next;
    } while (node);
  }

});
