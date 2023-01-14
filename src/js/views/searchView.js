import { parentClass } from './View.js';
class SearchViewCl {
  _parentElement = document.querySelector('.search');

  getQuery() {
    const query = this._parentElement.querySelector('.search__field').value; // the data obtained from the search field.
    if (!query) return;

    this._clearInput(); // this will clear the input field after the search.

    return query;
  }

  _clearInput() {
    this._parentElement.querySelector('.search__field').value = ''; // this is the child element of _parentElement
  }

  addhandlerSearch(handlerFn) {
    this._parentElement.addEventListener('submit', function (e) {
      // as always we listen to events in the views but handle them in the controller
      e.preventDefault();
      // state.search.page = 1; this is also the method for resetting the page numbver back to 1. but for this we need to import state here.
      handlerFn();
    });
  }
}

export default new SearchViewCl();
