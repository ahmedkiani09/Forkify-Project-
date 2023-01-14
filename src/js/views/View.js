import icons from 'url:../../img/icons.svg'; // svg file containing all the icons.

export default class ViewCl {
  _data;

  render(data, render = true) {
    if (!data || (Array.isArray(data) && data.length === 0))
      return this.renderError();
    this._data = data; // "this._data" here = "model.state.recipe" which is in (model.js file). "loadRecipe function" in (model.js) file assings the value to "state.recipe" object. and then "state.recipe" object can be used here as function parameter.
    const markup = this._generateMarkup(); // this._generateMarkup is unique to every child class because every view file or class will display its own markup.

    if (!render) return markup;

    this._clear(); // this render method is kept here in the parent class sop that is available in every child class. this method will clear everytime what is displayed on the screen. So, we donot need to worry about this.
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  update(data) {
    this._data = data;
    const newMarkup = this._generateMarkup();

    const newDOM = document.createRange().createContextualFragment(newMarkup);
    const newElements = Array.from(newDOM.querySelectorAll('*'));
    const curElements = Array.from(this._parentElement.querySelectorAll('*'));

    newElements.forEach((newEl, i) => {
      const curEl = curElements[i];

      // update the text content
      if (
        !newEl.isEqualNode(curEl) &&
        newEl.firstChild?.nodeValue.trim() !== ''
      ) {
        curEl.textContent = newEl.textContent;
      }

      // update the attributes
      if (!newEl.isEqualNode(curEl))
        Array.from(newEl.attributes).forEach(attr =>
          curEl.setAttribute(attr.name, attr.value)
        );
    });
  }

  renderSpinner() {
    const markup = `
      <div class="spinner">
        <svg>
          <use href="${icons}#icon-loader"></use>
        </svg>
      </div>
    `;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }
  renderError(message = this._errorMessage) {
    //in case of any error in the chain the error will be caught and afterwards rendered using this method.
    const markup = `<div class="error">
    <div>
      <svg>
        <use href="${icons}#icon-alert-triangle"></use>
      </svg>
    </div>
    <p>${message}</p>
  </div>`;

    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  renderSuccessMessage(message = this._message) {
    const markup = `<div class="message">
    <div>
      <svg>
        <use href="${icons}#icon-smile"></use>
      </svg>
    </div>
    <p>${message}</p>
  </div>`;

    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  _clear() {
    this._parentElement.innerHTML = '';
  }
}
