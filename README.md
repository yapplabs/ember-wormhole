# Ember Wormhole [![Build Status](https://travis-ci.org/yapplabs/ember-wormhole.svg?branch=master)](https://travis-ci.org/yapplabs/ember-wormhole) [![Ember Observer Score](http://emberobserver.com/badges/ember-wormhole.svg)](http://emberobserver.com/addons/ember-wormhole)

This ember-cli addon provides a component that allows for rendering a block 
to a DOM element somewhere else on the page. The component retains typical Ember 
context in terms of bound data and action handling.

## Live Demo

View a live demo here: [http://yapplabs.github.io/ember-wormhole/](http://yapplabs.github.io/ember-wormhole/)

## But Why?

This library is particularly useful for cases where you have UI that is the logical child of
a component but needs to render as a top-level DOM element, such as a confirmation dialog.

## And How?

This component tracks its element's child nodes. When inserted into the DOM, it appends 
its child nodes to a destination element elsewhere. When removed from the DOM, it
removes its child nodes, so as not to orphan them on the other side of the wormhole. 

Nothing else changes -- data binding  and action bubbling still flow according to 
the Ember component hierarchy. That includes usages of `yield`, so blocks provided 
to `ember-wormhole` simply appear in another part of the DOM.

## Show Me Some Code!

We thought you'd never ask...

Given the following DOM:

```html
<body class="ember-application">
  <!-- Destination must be in the same element as your ember app -->
  <!-- otherwise events/bindings will not work -->
  <div id="destination">
  </div>
  <div class="ember-view">
    <!-- rest of your Ember app's DOM... -->
  </div>
</body>
```

and a template like this:

```hbs
{{#ember-wormhole to="destination"}}
  Hello world!
{{/ember-wormhole}}
```

Then "Hello world!" would be rendered inside the `destination` div.

If the ember-wormhole is destroyed its far-off children are destroyed too.
For example, given:

```hbs
{{#if isWormholeEnabled}}
  {{#ember-wormhole to="destination"}}
    Hello world!
  {{/ember-wormhole}}
{{/if}}
```

If `isWormholeEnabled` starts off true and becomes false, then the "Hello
world!" text will be removed from the `destination` div.

Similarly, if you use `ember-wormhole` in a route's template, it will
render its children in the destination element when the route is entered
and remove them when the route is exited.

## Can I Render In Place (i.e. Unwormhole)?

Yes! Sometimes you feel like a wormhole. Sometimes you don't. Situations 
sometimes call for the same content to be rendered through the wormhole or in place.

In this example, `renderInPlace` will override `to` and cause the wormhole content to be rendered in place.

```hbs
{{#ember-wormhole to="destination" renderInPlace="true"}}
  Hello world!
{{/ember-wormhole}}
```

This technique is useful for:

- Presenting typically-wormholed content within a styleguide
- Toggling content back and forth through the wormhole
- Parlor tricks

## Development Setup

### Installation

* `git clone` this repository
* `npm install`
* `bower install`

### Running Tests

* `ember try:testall`
* `ember test`
* `ember test --server`

### Running the dummy app

* `ember server`
* Visit your app at http://localhost:4200.

For more information on using ember-cli, visit [http://www.ember-cli.com/](http://www.ember-cli.com/).

## Credits

This addon was extracted from [ember-modal-dialog](http://github.com/yapplabs/ember-modal-dialog).
Contributions from @stefanpenner, @krisselden, @chrislopresto, @lukemelia, @raycohen and
others. [Yapp Labs](http://yapplabs.com) is an Ember.js consultancy based in NYC.
