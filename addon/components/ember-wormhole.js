import Ember from 'ember';

var computed = Ember.computed;
var observer = Ember.observer;
var run = Ember.run;

export default Ember.Component.extend({
  to: computed.alias('destinationElementId'),
  destinationElementId: null,
  destinationElementSelector: computed('destinationElementId', function() {
    var destinationId = this.get('destinationElementId');
    return destinationId ? `#${destinationId}` : null;
  }),
  destinationElement: computed('destinationElementSelector', 'renderInPlace', function() {
    if (this.get('renderInPlace')) {
      return this.element;
    } else {
      var sel = this.get('destinationElementSelector');
      var results =  document.querySelectorAll(sel);
      if (results.length > 1) {
        throw new Error(`Selector ${sel} resulted in more than one element being found`);
      }
      else {
        if (results.length === 0) {
          return null;
        }
        else {
          return results[0];
        }
      }
    }
  }),
  renderInPlace: false,

  didInsertElement: function() {
    this._firstNode = this.element.firstChild;
    this._lastNode = this.element.lastChild;
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
      var destinationElementSelector = this.get('destinationElementSelector');
      if (destinationElementSelector) {
        throw new Error(`ember-wormhole failed to render into '${this.get('destinationElementSelector')}' because the element is not in the DOM`);
      }
      throw new Error('ember-wormhole failed to render content because the destinationElementSelector was set to an undefined or falsy value.');
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
        if (node === firstNode) {
          break;
        }
      }
      node = next;
    } while (node);
  }

});
