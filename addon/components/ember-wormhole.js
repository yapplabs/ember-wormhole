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
    this._firstNode = this._ensureRangeEndpoint('first');
    this._lastNode = this._ensureRangeEndpoint('last');
    this.appendToDestination();
  },

  willDestroyElement: function() {
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
    if (!destinationElement) {
      var destinationElementId = this.get('destinationElementId');
      if (destinationElementId) {
        throw new Error(`ember-wormhole failed to render into '#${this.get('destinationElementId')}' because the element is not in the DOM`);
      }
      throw new Error('ember-wormhole failed to render content because the destinationElementId was set to an undefined or falsy value.');
    }
    this.appendRange(destinationElement, this._firstNode, this._lastNode);
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
      }
      node = next;
    } while (node !== firstNode);
  },

  _ensureRangeEndpoint(position) {
    var existingEndpoint = position === 'first' ? this.element.firstChild : this.element.lastChild;
    var valid = ((existingEndpoint.nodeType === 3) && (Ember.isEmpty(existingEndpoint.nodeValue.trim()))); // blank text node
    if (valid) {
      return existingEndpoint;
    }
    var newEndpoint = document.createTextNode('\n');
    var sibling = position === 'first' ? existingEndpoint : null;
    this.element.insertBefore(newEndpoint, sibling);
    return newEndpoint;
  }

});
