function initialize(){
  if (typeof document !== 'undefined') {
    // In Ember 2.x, initialize is called only with `application` instead of `(container, application)`
    // See http://emberjs.com/deprecations/v2.x/#toc_initializer-arity
    var application = arguments[1] || arguments[0];
    var rootEl = document.querySelector(application.rootElement);
    var modalContainerEl = document.createElement('div');
    var modalContainerElId = 'modals';
    modalContainerEl.id = modalContainerElId;
    rootEl.appendChild(modalContainerEl);
  }
}

export default {
  name: 'add-modals-element',
  initialize: initialize
};
