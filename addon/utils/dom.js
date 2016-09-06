/*
 * Implement some helpers methods for interacting with the DOM,
 * be it Fastboot's SimpleDOM or the browser's version.
 */

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
  let { renderer } = context;
  if (renderer._dom) { // pre glimmer2
    return renderer._dom;
  } else if (renderer._env && renderer._env.getDOM) { // glimmer2
    return renderer._env.getDOM();
  } else {
    throw new Error('ember-wormhole could not get DOM');
  }
}
