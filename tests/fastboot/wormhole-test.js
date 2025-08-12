/* eslint-disable prettier/prettier */
import { module, test } from 'qunit';
import { setup, visit, /* mockServer */ } from 'ember-cli-fastboot-testing/test-support';

module('FastBoot | wormhole', function(hooks) {
  setup(hooks);

  test('it renders a page...', async function(assert) {
    await visit('/wormhole');

    assert.dom('#destination').hasText('Hello world!');
    assert.dom('#origin').hasNoText();
  });

});
