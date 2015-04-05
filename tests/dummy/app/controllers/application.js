import Ember from 'ember';

export default Ember.Controller.extend({
  isShowingModal: false,
  isShowingSidebarContent: false,
  actions: {
    toggleModal() {
      this.toggleProperty('isShowingModal');
    },
    toggleSidebarContent() {
      this.toggleProperty('isShowingSidebarContent');
    }
  }
});
