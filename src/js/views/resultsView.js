import ViewCl from './View.js';
import objectPreviewView from './previewView';
import icons from 'url:../../img/icons.svg'; // svg file containing all the icons.

class ResultsViewCl extends ViewCl {
  _parentElement = document.querySelector('.results');
  _errorMessage = 'No recipes found for your query! Please try again ;)'; // default value for the renderError method.
  _message = '';

  _generateMarkup() {
    return this._data
      .map(result => objectPreviewView.render(result, false)) // the same is here after calling the render method it will in return call this method and and all of the strings get herer into one big string
      .join('');
  }
}

export default new ResultsViewCl();
