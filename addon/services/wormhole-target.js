import Ember from 'ember';

export default Ember.Service.extend({
  defaultTargets: {},

  targets: Ember.A(),

  addDefaultTarget(targetName, targetId) {
    this.set(`defaultTargets.${targetName}`, targetId);
    this.get('targets').push(targetId);
  },

  appendRange(target, firstNode, lastNode) {
    let targetElement;

    if (!target) {
      throw new Error('ember-wormhole failed to render content because the target was set to an undefined or falsy value.');
    } else if (Ember.typeOf(target) === 'string') {
      targetElement = document.getElementById(target);

      if (!targetElement) {
        throw new Error(`ember-wormhole failed to render into '#${target}' because the element is not in the DOM`);
      }
    } else if (target instanceof Element) {
      targetElement = target;
    } else {
      throw new Error('ember-wormhole failed to render content because target was not a valid target. Must be a string or DOM element.');
    }

    while(firstNode) {
      targetElement.insertBefore(firstNode, null);
      firstNode = firstNode !== lastNode ? lastNode.parentNode.firstChild : null;
    }
  },

  removeRange(target, firstNode, lastNode) {
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
