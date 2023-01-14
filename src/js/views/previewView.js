import ViewCl from './View.js';
import icons from 'url:../../img/icons.svg'; // svg file containing all the icons.

// this class is basically used to generate the preview markup for both the results and the bookmarks view. that it!
class previewViewCl extends ViewCl {
  _parentElement = ''; // the parent element is emty string her beacuse we only want to generate the markyp from this method and 2 of the other classes will be having their own parent element at which the data will be displayed.

  _generateMarkup() {
    const id = window.location.hash.slice(1);

    return `
    <li class="preview">
      <a class="preview__link ${
        this._data.id === id ? 'preview__link--active' : ''
      }" href="#${this._data.id}">
        <figure class="preview__fig">
          <img src="${this._data.image}" alt="Test" />
        </figure>
        <div class="preview__data">
         <h4 class="preview__title">${this._data.title}</h4>
         <p class="preview__publisher">${this._data.publisher}</p>
          <div class="preview__user-generated ${
            this._data.key ? '' : 'hidden'
          }">
             <svg>
              <use href="${icons}#icon-user"></use>
              </svg>
           </div>
         </div>
      </a>
    </li>
    `;
  }
}

export default new previewViewCl();
