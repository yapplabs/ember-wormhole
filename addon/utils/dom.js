/*
 * Implement some helpers methods for interacting with the DOM,
 * be it Fastboot's SimpleDOM or the browser's version.
 */

import Ember from 'ember';
let getOwner = Ember.getOwner;

export function getActiveElement() {
  if (typeof document === 'undefined') {
    return null;
  } else {
    return document.activeElement;
  }
}

function childNodesOfElement(element) {
  let children = [];
  let child = element.firstChild;
  while (child) {
    children.push(child);
    child = child.nextSibling;
  }
  return children;
}

export function findElementById(doc, id) {
  if (doc.getElementById) {
    return doc.getElementById(id);
  }

  let nodes = childNodesOfElement(doc);
  let node;

  while (nodes.length) {
    node = nodes.shift();

    if (node.getAttribute && node.getAttribute('id') === id) {
      return node;
    }

    nodes = childNodesOfElement(node).concat(nodes);
  }
}

// Private Ember API usage. Get the dom implementation used by the current
// renderer, be it native browser DOM or Fastboot SimpleDOM
export function getDOM(context) {
  let  container = getOwner ? getOwner(context) : context.container;
  let renderer = container.lookup('renderer:-dom');
  var domForAppWithGlimmer2 = container.lookup('service:-document');

  if (renderer._dom) { // pre glimmer2
    return renderer._dom;
  } else if (domForAppWithGlimmer2) { // glimmer2
    return domForAppWithGlimmer2;
  } else {
    throw new Error('ember-wormhole could not get DOM');
  }
}
