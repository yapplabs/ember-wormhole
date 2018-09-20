import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import Ember from 'ember';

moduleForComponent('ember-wormhole', 'Integration | Component | ember wormhole', {
  integration: true
});

test('it renders', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  // Template block usage:
  this.render(hbs`
    <div id="wormhole"></div>
    {{#ember-wormhole to="wormhole"}}
      template block text
    {{/ember-wormhole}}
  `);

  assert.equal(this.$('#wormhole').text().trim(), 'template block text');
});

test('if `renderInPlace` is truthy, the given `destinationElement` is ignored', function(assert) {
  this.renderEnabled = false;
  this.renderInPlace = true;

  this.render(hbs`
    <div id="wormhole-destination-element"></div>
    {{#if renderEnabled}}
      {{#ember-wormhole renderInPlace=renderInPlace destinationElement=destinationElement}}
        <span id="wormhole-content">template block text</span>
      {{/ember-wormhole}}
    {{/if}}
  `);

  Ember.run(() => {
    this.set('destinationElement', document.querySelector('#wormhole-destination-element'));
    this.set('renderEnabled', true);
  });

  let content = document.querySelector('#wormhole-content');
  assert.notEqual(content.parentElement.id, 'wormhole-destination-element');

  Ember.run(() => {
    this.set('renderInPlace', false);
  });

  assert.equal(content.parentElement.id, 'wormhole-destination-element');
});

test('can switch `renderInPlace` with `destinationElementId`', function(assert) {
  this.renderInPlace = true;

  this.render(hbs`
    <div id="wormhole-destination-element"></div>
    {{#ember-wormhole renderInPlace=renderInPlace destinationElementId="wormhole-destination-element"}}
      <span id="wormhole-content">template block text</span>
    {{/ember-wormhole}}
  `);

  let content = document.querySelector('#wormhole-content');
  assert.notEqual(content.parentElement.id, 'wormhole-destination-element');

  Ember.run(() => {
    this.set('renderInPlace', false);
  });

  assert.equal(content.parentElement.id, 'wormhole-destination-element');

  Ember.run(() => {
    // switch back
    this.set('renderInPlace', true);
  });

  assert.notEqual(content.parentElement.id, 'wormhole-destination-element');
});
