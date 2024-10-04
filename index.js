/* NOTE: Temporary work around for CodeSandbox 502 error is just to copy the CodeSandbox
 and paste it into the new template. Then preview will be able to work
 https://github.com/codesandbox/codesandbox-client/issues/8442 */
// ########################################################################
// # Lab 308A.4.1: Working with External Data (Fetch() version w/ Async & Await)
// # Brian Yang
// # Submit CodeSandbox Link to Canvas (dependencies not working w/ VSCode)
// ########################################################################

import * as Carousel from "./Carousel.js";
import axios from "axios"; // importing axios effects from "axios" library

// The breed selection input element.
const breedSelect = document.getElementById("breedSelect");
// The information section div element.
const infoDump = document.getElementById("infoDump");
// The progress bar div element.
const progressBar = document.getElementById("progressBar");
// The get favourites button element.
const getFavouritesBtn = document.getElementById("getFavouritesBtn");
/* --------------------------- Part 1: The API --------------------------- */
// Step 0: Store your API key here for reference and easy access.
const API_KEY =
  "live_gp1KfVCLHDsKy7JD4U1lHDNmi1xu5JQ2dcXwL2fc4gUsXajXiAWyDd4N1oMBT4LI";
/* --------------------------- Part 2: Tasks --------------------------- */
/**
 * 1. Create an async function "initialLoad" that does the following:
 * - Retrieve a list of breeds from the cat API using fetch().
 * - Create new <option> for each of these breeds, and append them to breedSelect.
 *  - Each option should have a value attribute equal to the id of the breed.
 *  - Each option should display text equal to the name of the breed.
 * This function should execute immediately.
 */
async function initialLoad() {
  // let response = await fetch(
  //   "https://api.thecatapi.com/v1/images/search?limit=11&api_key=live_gp1KfVCLHDsKy7JD4U1lHDNmi1xu5JQ2dcXwL2fc4gUsXajXiAWyDd4N1oMBT4LI"
  // );
  // list of breed objects from the cat API w/ "breeds" endpoint using fetch() -- by default the HTTP GET method is enforced
  let response = await fetch("https://api.thecatapi.com/v1/breeds", {
    method: "GET",
    headers: {
      "x-api-key": "API_KEY",
    },
  });
  // let response = await fetch("https://api.thecatapi.com/v1/breeds"); -- somewhat equivalent to above, default method is GET

  // .json() method extracts JSON body content from Response & parse out the breed data into json format
  let breeds = await response.json();
  console.log("breeds", breeds);

  // console.log(newOption);

  // iterate through the data for each breed
  breeds.forEach((breed) => {
    // create a new <option> element
    let newOption = document.createElement("option");
    // give the newOption element a value of breed.id
    newOption.value = breed.id;
    // give newOption element string contents of breed.name
    newOption.innerHTML = breed.name; // try textContent
    // add the "options" to breedSelect
    breedSelect.appendChild(newOption);
  });
  // console.log(breedSelect);
  // console.log(options);
}

// execute function "initialLoad" immediately,
initialLoad();
// other ways to immediately execute a function includes ...
// 1) IFFE (function(){})(); <-- this example is a nameless -- noted by Vishaun
// 2) arrow function (() => {})();

/**
 * 2. Create an event handler for breedSelect that does the following:
 * - Retrieve information on the selected breed from the cat API using fetch().
 *  - Make sure your request is receiving multiple array items!
 *  - Check the API documentation if you're only getting a single object.
 * - For each object in the response array, create a new element for the carousel.
 *  - Append each of these new elements to the carousel.
 * - Use the other data you have been given to create an informational section within the infoDump element.
 *  - Be creative with how you create DOM elements and HTML.
 *  - Feel free to edit index.html and styles.css to suit your needs, but be careful!
 *  - Remember that functionality comes first, but user experience and design are important.
 * - Each new selection should clear, re-populate, and restart the Carousel.
 * - Add a call to this function to the end of your initialLoad function above to create the initial carousel.
 */

// add an event listener to breedSelect for when its clicked
breedSelect.addEventListener("change", Handlerfunction);

// will need "async" keyword for "await" to work while fetching later
async function Handlerfunction(event) {
  // let breed_id = breedSelect.value;
  let breed_id = event.target.value;
  // console.log("breed id", breed_id);
  // use fetch() function alongside HTTP GET method request to retrieve data about cat pictures
  // https://developers.thecatapi.com/view-account/ylX4blBYT9FaoVd6OhvR?report=gpN-ReBkp
  let response = await fetch(
    `https://api.thecatapi.com/v1/images/search?limit=11&breed_ids=${breed_id}`,
    // "https://api.thecatapi.com/v1/images/search?limit=11&breed_ids=beng",
    {
      method: "GET",
      headers: {
        "x-api-key": "API_KEY",
      },
    }
  );
  // utilize .json() method of Response object to parse
  // & return a Promise of the full (body) content from fetched response source
  let json_data = await response.json();
  console.log("json_data", json_data);

  // empty the Carousel of any pre-existing items
  Carousel.clear();

  // createCarouselItem(imgSrc, imgAlt, imgId);
  // loop through the parsed json data --- array of objects [{},{}, ...]
  // changed from function(){} to arrow function to see if can bypass the referenceError for appendCarousel()
  json_data.forEach((cat_info) => {
    // gather specific cat info pertaining to args of createCarouselItem by accessing each cat_info obj
    let cat_src = cat_info.url;
    // let cat_alt = cat_info.alt_names; // "alt_names" alternate names for cat?
    let cat_alt = cat_info.id;
    let cat_id = cat_info.id;

    // invoke imported createCarouselItem() & appendCarousel() functions from Carousel.js
    // create new element for Carousel using previously gathered cat data from json as parameters
    let new_elem = Carousel.createCarouselItem(cat_src, cat_alt, cat_id);
    // appendCarousel(element);
    // append each new element to carousel
    Carousel.appendCarousel(new_elem);

    // create a new div container to collect all the Bootstrap cards of cats
    let card = document.createElement("div");

    // create a card for each cat in the Carousel
    // literally from Bootstrap website but altered for our case
    // https://getbootstrap.com/docs/4.0/components/card/
    // have to use innerHTML over textContent here as textContent will convert everything into string (not account for styling)
    // other styling ideas: https://stackoverflow.com/questions/35993300/horizontally-scrollable-list-of-cards-in-bootstrap
    // guess styling in .js file overrides the highest precedence inline styling in .html
    card.innerHTML = `
      <div class="card" style="width: 18rem;">
        <img class="card-img-top" src=${cat_src} alt="cat name">
        <div class="card-body">
          <h5 class="card-title"><u>Moniker</u>: ${cat_alt} </h5>
          <p class="card-text"><u>Description</u>: <em>Some quick example text to build on the card title and make up the bulk of the card's content.</em></p>
          <a href="${cat_src}" class="btn btn-secondary">Enlarge</a>
        </div>
      </div>`;

    // apply .appendChild() method to each cat card node to infoDump
    infoDump.appendChild(card);
  });

  // invoking Carousel start() function to restart Carousel upon each selection
  Carousel.start();
}

/**
 * 3. Fork your own sandbox, creating a new one named "JavaScript Axios Lab."
 */
/**
 * 4. Change all of your fetch() functions to axios!
 * - axios has already been imported for you within index.js.
 * - If you've done everything correctly up to this point, this should be simple.
 * - If it is not simple, take a moment to re-evaluate your original code.
 * - Hint: Axios has the ability to set default headers. Use this to your advantage
 *   by setting a default header with your API key so that you do not have to
 *   send it manually with all of your requests! You can also set a default base URL!
 */
/**
 * 5. Add axios interceptors to log the time between request and response to the console.
 * - Hint: you already have access to code that does this!
 * - Add a console.log statement to indicate when requests begin.
 * - As an added challenge, try to do this on your own without referencing the lesson material.
 */
// axios.interceptors.request.use((request) => {
//   console.log("Request sent.");
//   return request;
// });

// axios.interceptors.response.use((response) => {
//   console.log("Response received.");
//   return response;
// });

// axios.interceptors.request.use((request) => {
//   request.metadata = request.metadata || {};
//   request.metadata.startTime = new Date().getTime();
//   return request;
// });

// axios.interceptors.response.use(
//   (response) => {
//     response.config.metadata.endTime = new Date().getTime();
//     response.config.metadata.durationInMS =
//       response.config.metadata.endTime - response.config.metadata.startTime;

//     console.log(
//       `Request took ${response.config.metadata.durationInMS} milliseconds.`
//     );
//     return response;
//   },
//   (error) => {
//     error.config.metadata.endTime = new Date().getTime();
//     error.config.metadata.durationInMS =
//       error.config.metadata.endTime - error.config.metadata.startTime;

//     console.log(
//       `Request took ${error.config.metadata.durationInMS} milliseconds.`
//     );
//     throw error;
//   }
// );
/**
 * 6. Next, we'll create a progress bar to indicate the request is in progress.
 * - The progressBar element has already been created for you.
 *  - You need only to modify its "width" style property to align with the request progress.
 * - In your request interceptor, set the width of the progressBar element to 0%.
 *  - This is to reset the progress with each request.
 * - Research the axios onDownloadProgress config option.
 * - Create a function "updateProgress" that receives a ProgressEvent object.
 *  - Pass this function to the axios onDownloadProgress config option in your event handler.
 * - console.log your ProgressEvent object within updateProgess, and familiarize yourself with its structure.
 *  - Update the progress of the request using the properties you are given.
 * - Note that we are not downloading a lot of data, so onDownloadProgress will likely only fire
 *   once or twice per request to this API. This is still a concept worth familiarizing yourself
 *   with for future projects.
 */

/**
 * 7. As a final element of progress indication, add the following to your axios interceptors:
 * - In your request interceptor, set the body element's cursor style to "progress."
 * - In your response interceptor, remove the progress cursor style from the body element.
 */
/**
 * 8. To practice posting data, we'll create a system to "favourite" certain images.
 * - The skeleton of this function has already been created for you.
 * - This function is used within Carousel.js to add the event listener as items are created.
 *  - This is why we use the export keyword for this function.
 * - Post to the cat API's favourites endpoint with the given ID.
 * - The API documentation gives examples of this functionality using fetch(); use Axios!
 * - Add additional logic to this function such that if the image is already favourited,
 *   you delete that favourite using the API, giving this function "toggle" functionality.
 * - You can call this function by clicking on the heart at the top right of any image.
 */
export async function favourite(imgId) {
  // your code here
}

/**
 * 9. Test your favourite() function by creating a getFavourites() function.
 * - Use Axios to get all of your favourites from the cat API.
 * - Clear the carousel and display your favourites when the button is clicked.
 *  - You will have to bind this event listener to getFavouritesBtn yourself.
 *  - Hint: you already have all of the logic built for building a carousel.
 *    If that isn't in its own function, maybe it should be so you don't have to
 *    repeat yourself in this section.
 */

/**
 * 10. Test your site, thoroughly!
 * - What happens when you try to load the Malayan breed?
 *  - If this is working, good job! If not, look for the reason why and fix it!
 * - Test other breeds as well. Not every breed has the same data available, so
 *   your code should account for this.
 */
