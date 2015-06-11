import Ember from 'ember';

var set = Ember.set;

export default Ember.Controller.extend({
  isShowingModal: false,
  isShowingModal2: false,
  isShowingSidebarContent: false,
  sidebarId: 'sidebar',
  isInPlace: false,
  actions: {
    toggleModal() {
      this.toggleProperty('isShowingModal');
    },
    toggleModal2() {
      this.toggleProperty('isShowingModal2');
    },
    toggleSidebarContent() {
      this.toggleProperty('isShowingSidebarContent');
    },
    switchSidebars() {
      var otherSidebarId = this.sidebarId === 'sidebar' ? 'othersidebar' : 'sidebar';
      set(this, 'sidebarId', otherSidebarId);
    },
    toggleInPlace() {
      this.toggleProperty('isInPlace');
    }
  }
});
