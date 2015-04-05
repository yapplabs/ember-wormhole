/*globals document*/
function initialize(container, application){
  var rootEl = document.querySelector(application.rootElement);
  var modalContainerEl = document.createElement('div');
  var modalContainerElId = 'modals';
  modalContainerEl.id = modalContainerElId;
  rootEl.appendChild(modalContainerEl);
}

export default {
  name: 'add-modals-element',
  initialize: initialize
};
