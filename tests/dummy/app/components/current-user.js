/* eslint-disable ember/no-classic-classes, ember/no-classic-components, ember/require-tagless-components, prettier/prettier */
import Component from '@ember/component';
import { A } from '@ember/array';
import EmberObject, { computed } from '@ember/object';

var User = EmberObject.extend({
    username: null,
    firstName: null,
    lastName: null,
    fullName: computed('firstName', 'lastName', function(){
      return A([this.get('firstName'), this.get('lastName')]).compact().join(' ');
    })
});

export default Component.extend({
  user: User.create({
    username: 'krisselden',
    firstName: 'Kris',
    lastName: 'Selden'
  })
});
