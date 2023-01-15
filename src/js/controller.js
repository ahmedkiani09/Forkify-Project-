import objectRecipeView from './views/recipeView'; // an empty object created by class 'recipeViewCl'
import objectSearchView from './views/searchView'; // an empty object created by class 'searchViewCl'
import objectResultsView from './views/resultsView'; // an empty object created by class 'resultsViewCl'
import objectPaginationsView from './views/paginationView'; // an empty object created by class 'paginationsViewCl'
import objectBookmarksView from './views/bookmarksView'; // an empty object created by class 'bookmarksViewCl'
import objectAddRecipeView from './views/addRecipeView'; // an empty object created by class 'addRecipeViewCl'
import * as model from './model.js'; // importing the whole model file
import 'core-js/stable'; // package for polyfilling everything except for async await.
import 'regenerator-runtime/runtime'; // package for polyfilling for async await.
import recipeView from './views/recipeView';
import { TIME_TO_ADD } from './config';
import addRecipeView from './views/addRecipeView';

const controlRecipes = async function () {
  try {
    // 0. updating the recipe with selection class: and rendering the bookmarks view containiner:
    objectResultsView.update(model.getSearchResultsPages());
    // 0 (b). rendering the bookmarks:
    objectBookmarksView.update(model.state.bookmarks);

    //  1. fetching the recipe:
    // 1(a). getting the id of the recipe (getting corresponding recipe with id)
    const id = window.location.hash.slice(1);
    if (!id) return;

    // 1(b). spinner functionality:
    objectRecipeView.renderSpinner();

    // 1(c). loading the recipe:
    // loadRecipe is an async function so it returns a promise that we need to handle using the await keyword.
    await model.loadRecipe(id);

    //  2. rendering the recipe:
    objectRecipeView.render(model.state.recipe); // default export 😉
  } catch (error) {
    objectRecipeView.renderError();
  }
};

const controlSearchResult = async function () {
  try {
    objectResultsView.renderSpinner();

    // 1. getting the search query by calling the method in the searchView file.
    const query = objectSearchView.getQuery();

    // 2. loading the recipe with the search query by calling the method in the model file.
    await model.loadSearchResults(query);

    // 3. rendering the search results
    objectResultsView.render(model.getSearchResultsPages(1)); // this method takes parameter the inital page but (IF WE DONOT PASS IN THEN IT WILL USE THE DEAULT PAGE NUMBER) and  is used to get the (model.state.search.results) length and also the (max number of results we want on the single page).
    // 1 is passed here because we want to reset the page number back to initial so that when we search pasta and we then get onto page 3 or 4 whatsoever and we search for another recipe

    // 4. Render initial pagination buttons:
    objectPaginationsView.render(model.state.search); // this render method is in parent class that the pagination class can inherit.
  } catch (error) {
    console.error(error);
  }
};

const controlPagination = function (goToPage) {
  // 1. rendering the NEW search results
  objectResultsView.render(model.getSearchResultsPages(goToPage)); // here we just have to update the screen by adding the pages so we used same method as above. NOTE: gotoPage is the dataset property we added in the html code. (<div data--goto .....rest of the code> </div>)

  // 2. Render NEW pagination buttons:
  objectPaginationsView.render(model.state.search);
};

const controlServings = function (newServings) {
  // update the servings in recipes.state:
  model.updateServings(newServings);

  // rendering the NEW servings:
  objectRecipeView.update(model.state.recipe);
};

const controlAddDeleteBookmark = function () {
  // 1. add, delete bookmark:
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else if (model.state.recipe.bookmarked)
    model.deleteBookmark(model.state.recipe);

  // 2. updating recipe view:
  objectRecipeView.update(model.state.recipe);

  // 3. rendering the bookmarks:
  objectBookmarksView.render(model.state.bookmarks);
};

const controlBookmarksInital = function () {
  objectBookmarksView.render(model.state.bookmarks);
};

const controlAddRecipe = async function (newRecipe) {
  try {
    // render the spinner:
    addRecipeView.renderSpinner();

    // upload the new recipe:
    await model.uploadRecipe(newRecipe);

    // render the added recipe:
    objectRecipeView.render(model.state.recipe);

    // success message:
    objectAddRecipeView.renderSuccessMessage();

    // bookmark the recipe:
    objectBookmarksView.render(model.state.bookmarks);

    //change id of the url:
    window.history.pushState(null, '', `#${model.state.recipe.id}`);

    // close form window:
    setTimeout(() => {
      addRecipeView._toggleWindow();
    }, TIME_TO_ADD);
  } catch (error) {
    console.error(error);
    objectAddRecipeView.renderError(error.message);
  }
};

const init = function () {
  // all the event listening is done here and the handled in the controller but the mehod itself is included in the respective classes.
  objectBookmarksView.addHandlerBookmark(controlBookmarksInital); // this is used here for the bookmarks to load in the first place so when we compare the new and old values in the update method there should be the current data to which the new data should be compared to and then the localStorage data must be taken and then used to render the bookmarks.
  objectRecipeView.addHandlerRender(controlRecipes);
  objectRecipeView.addHandlerBookmark(controlAddDeleteBookmark);
  objectRecipeView.addHandlerUpdateServings(controlServings);
  objectSearchView.addhandlerSearch(controlSearchResult);
  objectPaginationsView.addHandlerClick(controlPagination);
  objectAddRecipeView.addHandlerUpload(controlAddRecipe);
};
init();
// We can also use the IIFE here 😉.
