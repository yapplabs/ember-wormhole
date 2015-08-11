import Ember from 'ember';

const { computed, observer, run } = Ember;

export default Ember.Component.extend({
  to: computed.alias('destinationElementId'),
  destinationElementId: null,
  destinationElement: computed('destinationElementId', function() {
    let id = this.get('destinationElementId');
    return id ? document.getElementById(id) : this.element;
  }),

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
    if (destinationElement) {
      this.appendRange(destinationElement, this._firstNode, this._lastNode);
      if (document.activeElement !== currentActiveElement) {
        currentActiveElement.focus();
      }
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
