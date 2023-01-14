import { resourceUsage } from 'process';
import { async } from 'regenerator-runtime'; // so that we can use async functions.
import { API_URL, RES_PER_PAGE, KEY } from './config';
import { ajax } from './helperFunctions';
// import { getJSON, setJSON } from './helperFunctions';

export const state = {
  recipe: {},
  search: {
    query: '',
    results: [],
    resultsPerPage: RES_PER_PAGE, // declared in the config.
    page: 1, // default page number used in the getSearchResultsPages function.
  },
  bookmarks: [],
};

const getRecipeObject = function (data) {
  const { recipe } = data.data; // recipe is an object in the data array so we are using destructuring of objects.
  return {
    id: recipe.id,
    title: recipe.title,
    publisher: recipe.publisher,
    sourceUrl: recipe.source_url,
    image: recipe.image_url,
    servings: recipe.servings,
    cookingTime: recipe.cooking_time,
    ingredients: recipe.ingredients,
    ...(recipe.key && { key: recipe.key }), // this does short circuiting if recipe.key doesn't exist but if it exists then it will assign the key to the recipe
    //key: recipe.key ? recipe.key : '',
  };
};

export const loadRecipe = async function (id) {
  try {
    const data = await ajax(`${API_URL}${id}?key=${KEY}`);
    // mutating the recipe object:
    state.recipe = getRecipeObject(data);

    if (state.bookmarks.some(bookmark => bookmark.id === id))
      state.recipe.bookmarked = true;
    else state.recipe.bookmarked = false;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const loadSearchResults = async function (query) {
  try {
    state.search.query = query;

    const data = await ajax(`${API_URL}?search=${query}&key=${KEY}`);
    state.search.results = data.data.recipes.map(rec => {
      return {
        id: rec.id,
        title: rec.title,
        publisher: rec.publisher,
        image: rec.image_url,
        ...(rec.key && { key: rec.key }),
      };
    });

    // state.search.page = 1; this is also the method for ressting the page numbver back to 1.
  } catch (error) {
    throw error;
  }
};

export const getSearchResultsPages = function (page = state.search.page) {
  state.search.page = page; // this gives the current page number to the state.search.page property.
  const start = (page - 1) * state.search.resultsPerPage;
  const end = page * state.search.resultsPerPage;

  return state.search.results.slice(start, end); // this divides the results per page.
};

export const updateServings = function (newServings) {
  state.recipe.ingredients.forEach(ing => {
    ing.quantity = (ing.quantity * newServings) / state.recipe.servings;
    // newQT = oldQT * newServings / oldServings
  });
  state.recipe.servings = newServings; // we do this step here beacause if we do it in first place in this function then the old servings will not remain the same and it will modify the correct calculation.
};

const storeBookmark = function () {
  localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks));
};

export const addBookmark = function (recipe) {
  // add the bookmark:
  state.bookmarks.push(recipe);
  console.log(recipe);

  // Mark current recipe as bookmark:
  state.recipe.bookmarked = true;

  // adding to the local storage:
  storeBookmark();
};

export const deleteBookmark = function (id) {
  // for finding the index of the recipe having bookmark.
  const index = state.bookmarks.findIndex(
    bookmarkedRec => bookmarkedRec.id === id
  );

  // for deleting the element at the particular index:
  state.bookmarks.splice(index, 1);

  // mark the current recipe as Unbookmarked:
  state.recipe.bookmarked = false;

  // adding to the local storage:
  storeBookmark();
};

const init = function () {
  const storage = localStorage.getItem('bookmarks');
  if (storage) state.bookmarks = JSON.parse(storage);
};
init();

const clearBookmarks = function () {
  localStorage.clear('bookmarks');
};
clearBookmarks(); // only turn on when removing the bookmarks.

export const uploadRecipe = async function (newRecipe) {
  try {
    // this ingredients are those ingredients which we entered in uploading our own recipe.
    const ingredients = Object.entries(newRecipe) // this converts Object to array.
      .filter(entry => entry[0].startsWith('ingredient') && entry[1] !== '')
      .map(ing => {
        const ingArr = ing[1].replaceAll(' ', '').split(',');
        if (ingArr.length !== 3)
          throw new Error(
            'Wrong ingredient format! please try again with correct format'
          );
        const [quantity, unit, description] = ingArr; // destructuring the array.

        const objectIng = {
          // creating a new object from ingArr.
          quantity: quantity ? +quantity : null,
          unit,
          description,
        };

        return objectIng;
      });

    const recipe = {
      // this here is done because we want to send the data back to the API server in the correct format (format in which we recieved the data)
      title: newRecipe.title,
      source_url: newRecipe.sourceUrl,
      image_url: newRecipe.image,
      publisher: newRecipe.publisher,
      cooking_time: +newRecipe.cookingTime,
      servings: +newRecipe.servings,
      ingredients,
    };

    const data = await ajax(`${API_URL}?key=${KEY}`, recipe);
    state.recipe = getRecipeObject(data); // getRecipeObject is a function and it will update the value of the recipe.state property.
    console.log(data);
    addBookmark(state.recipe); // this add the new bookmark to our own uploaded recipe.
  } catch (error) {
    throw error;
  }
};
