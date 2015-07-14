import Ember from 'ember';
import layout from '../templates/components/ember-wormhole-targets';

const { computed, inject } = Ember;

export default Ember.Component.extend({
  layout: layout,

  wormholeTargetService: inject.service('wormhole-target'),

  targets: computed.reads('wormholeTargetService.targets')
});
