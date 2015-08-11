import Ember from 'ember';

const { get, set, computed } = Ember;

export default Ember.Controller.extend({
  isShowingModal: false,
  isShowingSidebarContent: false,
  sidebarId: 'sidebar',
  isInPlace: false,
  wormholeDestination: computed('isInPlace', 'sidebarId', function() {
    let inPlace = get(this, 'isInPlace');
    let id = get(this, 'sidebarId');
    return inPlace ? null : id;
  }),
  isTestingDocumentTitle: false,
  favicon: "http://emberjs.com/images/favicon.png",
  actions: {
    toggleModal() {
      this.toggleProperty('isShowingModal');
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
    },
    toggleTitle() {
      this.toggleProperty('isTestingDocumentTitle');
    }
  }
});
