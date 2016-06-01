/*
 * Implement some helpers methods for interacting with the DOM,
 * be it Fastboot's SimpleDOM or a browser's version.
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

