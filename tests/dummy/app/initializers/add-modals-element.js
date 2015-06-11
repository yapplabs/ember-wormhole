/*globals document*/
function initialize(container, application){
  var rootEl = document.querySelector(application.rootElement);

  var existingModalsEl = document.getElementById('modals');

  if (existingModalsEl) {
    existingModalsEl.remove();
  }

  var modalContainerEl = document.createElement('div');
  var modalContainerElId = 'modals';
  modalContainerEl.id = modalContainerElId;
  rootEl.appendChild(modalContainerEl);

  var modal2ContainerEl = document.createElement('div');
  modal2ContainerEl.className = 'modal2';
  modalContainerEl.appendChild(modal2ContainerEl);
}

export default {
  name: 'add-modals-element',
  initialize: initialize
};
