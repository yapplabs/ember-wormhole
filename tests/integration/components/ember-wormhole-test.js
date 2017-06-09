import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

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
