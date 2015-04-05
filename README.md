# Ember Wormhole [![Build Status](https://travis-ci.org/yapplabs/ember-wormhole.svg?branch=master)](https://travis-ci.org/yapplabs/ember-wormhole)

This ember-cli addon provides a component that allows for rendering a block
in a typical Ember context in terms of bound data and action handling, but
attached to a DOM element somewhere else on the page.

## But Why?

This library is particularly useful for cases where you have UI that is the logical child of
a component but needs to render as a top-level DOM element, such as a confirmation dialog.

## And How?

This component takes advantage of a private API of HTMLBars (we're hoping to craft a public
API so we can be confident this library will continue to work in future versions of
Ember). An Ember Component has a `_morph` property which its children are attached to.
In a typical component, `_morph` is the component's element, a `div` by default.
ember-wormhole sets the component's `_morph` to an element that you point it at. As a
result, the component's children are attached to that element in the DOM. That includes
usages of `yield`, so blocks provided to `ember-wormhole` appear in another part of
the DOM. Nothing else changes -- data binding and action bubbling still flow according
to the Ember component hierarchy.

## Show Me Some Code!

We thought you'd never ask...

Given the following DOM:

```html
<body class="ember-application">
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

If the ember-wormhole is destroyed it's far-off children are destroyed too.
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
