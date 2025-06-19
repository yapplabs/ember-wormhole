/* eslint-disable prettier/prettier */
import { module, test } from 'qunit';
import { setup, visit, /* mockServer */ } from 'ember-cli-fastboot-testing/test-support';

module('FastBoot | inplace', function(hooks) {
  setup(hooks);

  test('it renders a page...', async function(assert) {
    await visit('/inplace');

    assert.dom('#origin').hasText('Hello world!');
    assert.dom('#destination').hasNoText();
  });

});
