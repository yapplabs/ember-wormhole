import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';


moduleForComponent('ember-wormhole-targets', 'Integration | Component | ember wormhole targets', {
  integration: true
});

test('it renders', function(assert) {
  assert.expect(2);

  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{ember-wormhole-targets}}`);

  assert.equal(this.$().text(), '');

  // Template block usage:
  this.render(hbs`
    {{#ember-wormhole-targets}}
      template block text
    {{/ember-wormhole-targets}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
