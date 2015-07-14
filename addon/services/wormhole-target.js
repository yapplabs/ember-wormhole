import Ember from 'ember';

export default Ember.Service.extend({
  appendRange(destination, firstNode, lastNode) {
    let destinationElement;

    if (!destination) {
      throw new Error('ember-wormhole failed to render content because the destination was set to an undefined or falsy value.');
    } else if (Ember.typeOf(destination) === 'string') {
      destinationElement = document.getElementById(destination);

      if (!destinationElement) {
        throw new Error(`ember-wormhole failed to render into '#${this.get('destination')}' because the element is not in the DOM`);
      }
    } else if (destination instanceof Element) {
      destinationElement = destination;
    } else {
      throw new Error('ember-wormhole failed to render content because destination was not a valid target. Must be a string or DOM element.');
    }

    while(firstNode) {
      destinationElement.insertBefore(firstNode, null);
      firstNode = firstNode !== lastNode ? lastNode.parentNode.firstChild : null;
    }
  },

  removeRange(destination, firstNode, lastNode) {
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
