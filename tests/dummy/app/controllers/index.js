/* eslint-disable ember/classic-decorator-no-classic-methods */
import Controller from '@ember/controller';
import { set, action } from '@ember/object';

export default class IndexController extends Controller {
  isShowingModal = false;
  isShowingSidebarContent = false;
  sidebarId = 'sidebar';
  isInPlace = false;
  isTestingDocumentTitle = false;
  favicon = 'http://emberjs.com/images/favicon.png';
  isShowingOverlay = true;

  @action
  toggleModal() {
    this.toggleProperty('isShowingModal');
  }

  @action
  toggleSidebarContent() {
    this.toggleProperty('isShowingSidebarContent');
  }

  @action
  switchSidebars() {
    var otherSidebarId =
      this.sidebarId === 'sidebar' ? 'othersidebar' : 'sidebar';
    set(this, 'sidebarId', otherSidebarId);
  }

  @action
  toggleInPlace() {
    this.toggleProperty('isInPlace');
  }

  @action
  toggleTitle() {
    this.toggleProperty('isTestingDocumentTitle');
  }

  @action
  toggleOverlay() {
    this.toggleProperty('isShowingOverlay');
  }
}
