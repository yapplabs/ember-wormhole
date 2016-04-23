import Ember from 'ember';

const {
  Component,
  computed,
  observer,
  run,
  get,
  set
} = Ember;

export default Component.extend({
  to: computed.alias('destinationElementId'),
  destinationElementId: null,
  destinationElement: computed('destinationElementId', 'renderInPlace', function() {
    return get(this, 'renderInPlace') ? this.element : document.getElementById(get(this, 'destinationElementId'));
  }),
  renderInPlace: false,

  didInsertElement() {
    this._super(...arguments);
    set(this, '_firstNode', get(this, 'element.firstChild'));
    set(this, '_lastNode', get(this, 'element.lastChild'));
    this.appendToDestination();
  },

  willDestroyElement() {
    this._super(...arguments);
    var firstNode = get(this, '_firstNode');
    var lastNode = get(this, '_lastNode');
    run.schedule('render', () => {
      this.removeRange(firstNode, lastNode);
    });
  },

  destinationDidChange: observer('destinationElement', function() {
    var destinationElement = get(this, 'destinationElement');
    if (destinationElement !== get(this, '_firstNode.parentNode')) {
      run.schedule('render', this, 'appendToDestination');
    }
  }),

  appendToDestination() {
    var destinationElement = get(this, 'destinationElement');
    var currentActiveElement = document.activeElement;
    if (!destinationElement) {
      var destinationElementId = get(this, 'destinationElementId');
      if (destinationElementId) {
        throw new Error(`ember-wormhole failed to render into '#${get(this, 'destinationElementId')}' because the element is not in the DOM`);
      }
      throw new Error('ember-wormhole failed to render content because the destinationElementId was set to an undefined or falsy value.');
    }

    this.appendRange(destinationElement, get(this, '_firstNode'), get(this, '_lastNode'));
    if (document.activeElement !== currentActiveElement) {
      currentActiveElement.focus();
    }
  },

  appendRange(destinationElement, firstNode, lastNode) {
    while(firstNode) {
      destinationElement.insertBefore(firstNode, null);
      firstNode = firstNode !== lastNode ? lastNode.parentNode.firstChild : null;
    }
  },

  removeRange(firstNode, lastNode) {
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
