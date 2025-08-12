/* eslint-disable ember/no-classic-classes, ember/no-classic-components, ember/no-component-lifecycle-hooks, ember/no-runloop, ember/require-tagless-components, prettier/prettier */
import { alias } from '@ember/object/computed';
import Component from '@ember/component';
import { observer, computed } from '@ember/object';
import { schedule } from '@ember/runloop';
import layout from '../templates/components/ember-wormhole';
import {
  getActiveElement,
  findElementById,
  getDOM
} from '../utils/dom';

export default Component.extend({
  layout,

  /*
   * Attrs
   */
  to: alias('destinationElementId'),
  destinationElementId: null,
  destinationElement: null,

  _destination: computed('destinationElement', 'destinationElementId', 'renderInPlace', function() {
    let renderInPlace = this.get('renderInPlace');
    if (renderInPlace) {
      return this._element;
    }

    let destinationElement = this.get('destinationElement');
    if (destinationElement) {
      return destinationElement;
    }
    let destinationElementId = this.get('destinationElementId');
    if (destinationElementId) {
      return findElementById(this._dom, destinationElementId);
    }
    // no element found
    return null;
  }),

  renderInPlace: false,

  /*
   * Lifecycle
   */
  init() {
    this._super(...arguments);

    this._dom = getDOM(this);

    // Create text nodes used for the head, tail
    this._wormholeHeadNode = this._dom.createTextNode('');
    this._wormholeTailNode = this._dom.createTextNode('');

    /*
     * didInsertElement does not fire in Fastboot, so we schedule this in
     * init to be run after render. Importantly, we want to run
     * appendToDestination after the child nodes have rendered.
     */
    schedule('afterRender', () => {
      if (this.isDestroyed) { return; }
      this._element = this._wormholeHeadNode.parentNode;
      if (!this._element) {
        throw new Error('The head node of a wormhole must be attached to the DOM');
      }
      this._appendToDestination();
    });
  },

  willDestroyElement: function() {
    // not called in fastboot
    this._super(...arguments);
    let { _wormholeHeadNode, _wormholeTailNode } = this;
    schedule('render', () => {
      this._removeRange(_wormholeHeadNode, _wormholeTailNode);
    });
  },

  _destinationDidChange: observer('_destination', function() {
    var destinationElement = this.get('_destination');
    if (destinationElement !== this._wormholeHeadNode.parentNode) {
      schedule('render', this, '_appendToDestination');
    }
  }),

  _appendToDestination() {
    var destinationElement = this.get('_destination');
    if (!destinationElement) {
      var destinationElementId = this.get('destinationElementId');
      if (destinationElementId) {
        throw new Error(`ember-wormhole failed to render into '#${destinationElementId}' because the element is not in the DOM`);
      }
      throw new Error('ember-wormhole failed to render content because the destinationElementId was set to an undefined or falsy value.');
    }

    let startingActiveElement = getActiveElement();
    this._appendRange(destinationElement, this._wormholeHeadNode, this._wormholeTailNode);
    let resultingActiveElement = getActiveElement();
    if (startingActiveElement && resultingActiveElement !== startingActiveElement) {
      startingActiveElement.focus();
    }
  },

  _appendRange(destinationElement, firstNode, lastNode) {
    while(firstNode) {
      destinationElement.insertBefore(firstNode, null);
      firstNode = firstNode !== lastNode ? lastNode.parentNode.firstChild : null;
    }
  },

  _removeRange(firstNode, lastNode) {
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
  },
});
