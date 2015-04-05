import Ember from 'ember';

var User = Ember.Object.extend({
    username: null,
    firstName: null,
    lastName: null,
    fullName: Ember.computed('firstName', 'lastName', function(){
      return Ember.A([this.get('firstName'), this.get('lastName')]).compact().join(' ');
    })
});

export default Ember.Component.extend({
  user: User.create({
    username: 'krisselden',
    firstName: 'Kris',
    lastName: 'Selden'
  })
});
