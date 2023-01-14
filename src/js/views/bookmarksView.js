import ViewCl from './View.js';
import objectPreviewView from './previewView';
import icons from 'url:../../img/icons.svg'; // svg file containing all the icons.

class bookmarkViewCl extends ViewCl {
  _parentElement = document.querySelector('.bookmarks__list');
  _errorMessage = 'No recipe bookmarked. Find a nice recipe and bookmark it ;)'; // default value for the renderError method.
  _message = '';

  addHandlerBookmark = function (handlerFn) {
    window.addEventListener('load', handlerFn); // when the page loads the bookmark are also displayed in the bookmars container in the first place. if we have not done this then the update method will try to read the properties of the undefine because the bookmark data is not rendered to the bookmark container up until that point.
  };

  // this method loops over the bookmark array in model.state and will generate the markup for each of the bookmarked recipe.
  _generateMarkup() {
    return this._data
      .map(bookmark => objectPreviewView.render(bookmark, false)) // see in render function is view where everytime the render is false it will return the markup string  and here it will join al of the big strings and at end it will render all of them.
      .join('');
  }
}

export default new bookmarkViewCl();
