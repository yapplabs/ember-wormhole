/* eslint-disable prettier/prettier */
import Wormhole from 'ember-wormhole/components/ember-wormhole';

export default class XFavicon extends Wormhole {
  get destinationElement() {
    return this._dom.head;
  }
};
