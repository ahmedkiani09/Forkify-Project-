import ViewCl from './View.js';
import icons from 'url:../../img/icons.svg'; // svg file containing all the icons.
import { callbackify } from 'util';

class addRecipeViewCl extends ViewCl {
  _parentElement = document.querySelector('.upload'); // parent element of the pagination buttons.
  _message = 'Recipe was added successfully 😉';
  _window = document.querySelector('.add-recipe-window');
  _overlay = document.querySelector('.overlay');
  _btnOpen = document.querySelector('.nav__btn--add-recipe');
  _btnClose = document.querySelector('.btn--close-modal');

  constructor() {
    // we use constructor here because we want to call this function immediately after the constructor is executed.
    super();
    this._addHandlerShowWindow();
    this._addHandlerCloseWindow();
  }

  _toggleWindow() {
    this._overlay.classList.toggle('hidden');
    this._window.classList.toggle('hidden');
  }

  _addHandlerShowWindow() {
    this._btnOpen.addEventListener('click', this._toggleWindow.bind(this));
  }

  _addHandlerCloseWindow() {
    this._btnClose.addEventListener('click', this._toggleWindow.bind(this));
    this._overlay.addEventListener('click', this._toggleWindow.bind(this));
  }

  addHandlerUpload(handlerFn) {
    this._parentElement.addEventListener('submit', function (e) {
      e.preventDefault(); // this is a form element that is why we are using this.
      const dataArr = [...new FormData(this)];
      const data = Object.fromEntries(dataArr);
      handlerFn(data);
    });
  }

  _generateMarkup() {}
}

export default new addRecipeViewCl();
