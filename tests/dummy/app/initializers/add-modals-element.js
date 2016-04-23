/*globals document*/

function initialize(container, application) {
  var rootEl = document.querySelector(application.rootElement);
  var modalContainerEl = document.createElement('div');
  modalContainerEl.id = 'modals';
  rootEl.appendChild(modalContainerEl);
}

export default {
  name: 'add-modals-element',
  initialize: initialize
};
