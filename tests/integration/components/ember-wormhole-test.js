/* eslint-disable prettier/prettier, qunit/no-assert-equal */
import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, settled } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | ember wormhole', function(hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function(assert) {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.on('myAction', function(val) { ... });

    // Template block usage:
    await render(hbs`
      {{! template-lint-disable no-curly-component-invocation }}
      <div id="wormhole"></div>
      {{#ember-wormhole to="wormhole"}}
        template block text
      {{/ember-wormhole}}
    `);

    assert.equal(document.getElementById('wormhole').textContent.trim(), 'template block text');
  });

  test('if `renderInPlace` is truthy, the given `destinationElement` is ignored', async function(assert) {
    this.renderEnabled = false;
    this.renderInPlace = true;

    await render(hbs`
      {{! template-lint-disable no-curly-component-invocation }}
      <div id="wormhole-destination-element"></div>
      {{#if this.renderEnabled}}
        {{#ember-wormhole renderInPlace=this.renderInPlace destinationElement=this.destinationElement}}
          <span id="wormhole-content">template block text</span>
        {{/ember-wormhole}}
      {{/if}}
    `);

    this.set('destinationElement', document.querySelector('#wormhole-destination-element'));
    this.set('renderEnabled', true);

    await settled();

    let content = document.querySelector('#wormhole-content');
    assert.notEqual(content.parentElement.id, 'wormhole-destination-element');

    this.set('renderInPlace', false);
    await settled();

    assert.equal(content.parentElement.id, 'wormhole-destination-element');
  });

  test('can switch `renderInPlace` with `destinationElementId`', async function(assert) {
    this.renderInPlace = true;

    await render(hbs`
      {{! template-lint-disable no-curly-component-invocation }}
      <div id="wormhole-destination-element"></div>
      {{#ember-wormhole renderInPlace=this.renderInPlace destinationElementId="wormhole-destination-element"}}
        <span id="wormhole-content">template block text</span>
      {{/ember-wormhole}}
    `);

    let content = document.querySelector('#wormhole-content');
    assert.notEqual(content.parentElement.id, 'wormhole-destination-element');

    this.set('renderInPlace', false);

    await settled();

    assert.equal(content.parentElement.id, 'wormhole-destination-element');

    // switch back
    this.set('renderInPlace', true);

    await settled();

    assert.notEqual(content.parentElement.id, 'wormhole-destination-element');
  });
});
