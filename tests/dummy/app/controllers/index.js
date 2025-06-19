/* eslint-disable ember/no-actions-hash, ember/no-classic-classes, prettier/prettier */
import Controller from '@ember/controller';
import { set } from '@ember/object';

export default Controller.extend({
  isShowingModal: false,
  isShowingSidebarContent: false,
  sidebarId: 'sidebar',
  isInPlace: false,
  isTestingDocumentTitle: false,
  favicon: "http://emberjs.com/images/favicon.png",
  isShowingOverlay: true,
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
    },
    toggleOverlay() {
      this.toggleProperty('isShowingOverlay');
    }
  }
});
