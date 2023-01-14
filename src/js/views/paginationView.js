import ViewCl from './View.js';
import icons from 'url:../../img/icons.svg'; // svg file containing all the icons.
import { callbackify } from 'util';

class PaginationViewCl extends ViewCl {
  _parentElement = document.querySelector('.pagination'); // parent element of the pagination buttons.

  addHandlerClick(handlerFn) {
    this._parentElement.addEventListener('click', function (e) {
      const btn = e.target.closest('.btn--inline'); // We used event Delegation here to slect the buttons (previous and next)
      if (!btn) return; // this is because of event Delegation if we did not click on the button it will return null so we return here immediately.
      const goToPage = +btn.dataset.goto; // we convert the dataset.goto property to number which was previously string by using (+)

      handlerFn(goToPage);
    }); // this here listens fot the click event and call the handler function to do the rest of the work.
  }

  _generateMarkup() {
    const curPage = this._data.page; // this is stored in the (model.state.search.page) and resultsPerPage is stored in the (model.state.search.resultsPerPage)
    const numPages = Math.ceil(
      this._data.results.length / this._data.resultsPerPage
    );

    // 1. when on page 1 and there are other pages:

    // Note: we added the data-goto property here ourselves in the html code to basically store the next and previous page numbers so that the javaScript will know which page to GO and it will also change the page buttons accordingly.
    if (curPage === 1 && numPages > 1) {
      return `
      <button data-goto="${
        curPage + 1
      }" class="btn--inline pagination__btn--next"> 
            <span>page ${curPage + 1}</span>
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-right"></use>
            </svg>
          </button>
      `;
    }

    // 2. when on last page:
    if (curPage === numPages && numPages > 1) {
      return `
      <button data-goto="${
        curPage - 1
      }" class="btn--inline pagination__btn--prev">
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-left"></use>
            </svg>
            <span>page ${numPages - 1}</span>
            </button>
            `;
    }

    // 3. when on others pages:
    if (curPage < numPages) {
      return `
          <button data-goto="${
            curPage - 1
          }" class="btn--inline pagination__btn--prev">
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-left"></use>
            </svg>
            <span>page ${curPage - 1}</span>
         </button>
            <button data-goto="${
              curPage + 1
            }" class="btn--inline pagination__btn--next">
            <span>page ${curPage + 1}</span>
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-right"></use>
            </svg>
          </button>
      `;
    }

    // 4. when on page 1 and there are no other pages:
    return '';
  }
}

export default new PaginationViewCl();
