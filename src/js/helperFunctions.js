// note: What we have done here is that we have put the fetching of the URL and its response in the getJSON function in the helperFunctions.js file. In the helperFunctions file, we have a try-catch block in the getJSON function. In the try block, we will return the data variable which will be containing the res.json.  In the catch block, we will re-throw the error because we do not want to handle the error at multiple places, we only want to handle that error in the model.js file. and that rethrowed error will be caught by the catch block of the model.js file in the loadRecipe() function.
import { async } from 'regenerator-runtime';
import { TIME_OUT } from './config';

const timeout = function (s) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error(`Request took too long! Timeout after ${s} second`));
    }, s * 1000);
  });
};

export const ajax = async function (url, uploadData = undefined) {
  try {
    const fetchPro = uploadData
      ? fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(uploadData),
        })
      : fetch(url);

    const response = await Promise.race([fetchPro, timeout(TIME_OUT)]);
    const data = await response.json();
    if (!response.ok) throw new Error(`${data.message} (${response.status})`);

    return data;
  } catch (error) {
    throw error;
  }
};

/*
export const getJSON = async function (url) {
  try {
    const fetchPro = fetch(url);
    const response = await Promise.race([fetchPro, timeout(TIME_OUT)]);
    const data = await response.json();
    if (!response.ok) throw new Error(`${data.message} (${response.status})`);

    return data;
  } catch (error) {
    throw error;
  }
};

export const setJSON = async function (url, uploadData) {
  try {
    const fetchPro = fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(uploadData),
    });
    const response = await Promise.race([fetchPro, timeout(TIME_OUT)]);
    const data = await response.json();
    if (!response.ok) throw new Error(`${data.message} (${response.status})`);

    return data;
  } catch (error) {
    throw error;
  }
};
*/
