import Ember from 'ember';
import layout from '../templates/components/ember-wormhole';
import {
  getActiveElement,
  findElementById,
  getDOM
} from '../utils/dom';

const { Component, computed, observer, run } = Ember;

export default Component.extend({
  layout,

  /*
   * Attrs
   */
  to: computed.alias('destinationElementId'),
  destinationElementId: null,
  destinationElement: computed('destinationElementId', 'renderInPlace', function() {
    let renderInPlace = this.get('renderInPlace');
    if (renderInPlace) {
      return this._element;
    }
    let id = this.get('destinationElementId');
    if (!id) {
      return null;
    }
    return findElementById(this._dom, id);
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

    // A prop to help in the mocking of didInsertElement timing for Fastboot
    this._didInsert = false;
  },

  /*
   * didInsertElement does not fire in Fastboot. Here we use willRender and
   * a _didInsert property to approximate the timing. Importantly we want
   * to run appendToDestination after the child nodes have rendered.
   */
  willRender() {
    this._super(...arguments);
    if (!this._didInsert) {
      this._didInsert = true;
      run.schedule('afterRender', () => {
        if (this.isDestroyed) { return; }
        this._element = this._wormholeHeadNode.parentNode;
        if (!this._element) {
          throw new Error('The head node of a wormhole must be attached to the DOM');
        }
        this._appendToDestination();
      });
    }
  },

  willDestroyElement: function() {
    // not called in fastboot
    this._super(...arguments);
    this._didInsert = false;
    let { _wormholeHeadNode, _wormholeTailNode } = this;
    run.schedule('render', () => {
      this._removeRange(_wormholeHeadNode, _wormholeTailNode);
    });
  },

  _destinationDidChange: observer('destinationElement', function() {
    var destinationElement = this.get('destinationElement');
    if (destinationElement !== this._wormholeHeadNode.parentNode) {
      run.schedule('render', this, '_appendToDestination');
    }
  }),

  _appendToDestination() {
    var destinationElement = this.get('destinationElement');
    if (!destinationElement) {
      var destinationElementId = this.get('destinationElementId');
      if (destinationElementId) {
        throw new Error(`ember-wormhole failed to render into '#${this.get('destinationElementId')}' because the element is not in the DOM`);
      }
      throw new Error('ember-wormhole failed to render content because the destinationElementId was set to an undefined or falsy value.');
    }

    var currentActiveElement = getActiveElement();
    this._appendRange(destinationElement, this._wormholeHeadNode, this._wormholeTailNode);
    if (currentActiveElement && getActiveElement() !== currentActiveElement) {
      currentActiveElement.focus();
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
  }

});
