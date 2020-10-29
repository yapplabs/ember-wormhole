const map = new WeakMap();

export function setData(el, value) {
  map.set(el, value);
}

export function getData(el) {
  return map.get(el);
}

export function removeData(el) {
  map.delete(el);
}
