//import { log } from "console";

/// THESE PATHS STILL NEED TO WORKED OUT CORRECTLY SO THAT THE SCRIPT RUNS WITHOUT PROBLEMS
/// BOTH LOCALLY AND REMOTELY. RIGHT NOW TO GET THIS RUNNING REMOTELY WILL REQUIRE A BIT OF
/// FAFFING

// common.js
export const uiRoot = '/ui/dest-icons/';
export const urlRoot = '';
//export const API_ROOT = import.meta?.env?.VITE_API_ROOT || 'https://travelfox-api.onrender.com';
//export const API_ROOT = 'http://localhost:3000';
//export const APP_ROOT = "/";
export const API_ROOT = "https://travelfox-api.onrender.com"
export const APP_ROOT = "/travelfox/";
//window.APP_ROOT = "/";
window.APP_ROOT = "/travelfox/";

/* These are the names of the ares where we will store the various sections so that they do not need
   to be reloaded again during the same session. These will only be loaded into storage once needed
   though
*/
const DESTINATION_NAME_KEY        = 'destinationName';

const DESTINATION_DETAILS_KEY     = 'destinationDetails';
const RESTAURANTS_DETAILS_KEY     = 'restaurantsDetails';
const ESSENTIALS_DETAILS_KEY      = 'essentialsDetails';
const SIGHTSEEING_DETAILS_KEY     = 'sightseeingDetails';
const ACTIVITIES_DETAILS_KEY      = 'activitiesDetails';
const LOCAL_CUISINE_DETAILS_KEY   = 'localCuisineDetails';

/* Check if we are developing (localhost) or deploying. Especially important for whether we log
 * console messages. If we need to debug during deployment we can just hardcode the export rather
 * than autodetect, as follows:
 * 
 *    export const isDev = true;
 */
export const isDev =
  location.hostname === 'localhost' || location.hostname === '127.0.0.1';

/* This is the logger that all error messages should go through, so we have control over the display 
 * and can turn off as needed.
 */
export const logger = {
  log: (...args) => {
    if (isDev) console.log(...args);
  },
  warn: (...args) => {
    if (isDev) console.warn(...args);
  },
  error: (...args) => {
    console.error(...args); // usually you want errors even in prod
  },
};

// Keydown handler for Ctrl+D: update destination dynamically
// Keydown handler for Ctrl+R: Resets local storage
document.addEventListener('keydown', async (event) => {
  if (event.ctrlKey && event.key.toLowerCase() === 'r') {
    event.preventDefault();
    
    alert("Resetting all local storage");

    localStorage.removeItem(DESTINATION_DETAILS_KEY);
    localStorage.removeItem(RESTAURANTS_DETAILS_KEY);
    localStorage.removeItem(ESSENTIALS_DETAILS_KEY);
    localStorage.removeItem(ACTIVITIES_DETAILS_KEY);
    localStorage.removeItem(SIGHTSEEING_DETAILS_KEY);
    localStorage.removeItem(LOCAL_CUISINE_DETAILS_KEY);
  
//    fetchDestination();
    if (!destinationName) destinationName = askForDestination();
    window.urlRoute(window.location.pathname);
  }

  else if (event.ctrlKey && event.key.toLowerCase() === 'd') {
    event.preventDefault();

    destinationName = askForDestination();
    logger.log("destination name is " + destinationName);

    localStorage.removeItem(DESTINATION_DETAILS_KEY);
    localStorage.removeItem(RESTAURANTS_DETAILS_KEY);
    localStorage.removeItem(ESSENTIALS_DETAILS_KEY);
    localStorage.removeItem(ACTIVITIES_DETAILS_KEY);
    localStorage.removeItem(SIGHTSEEING_DETAILS_KEY);
    localStorage.removeItem(LOCAL_CUISINE_DETAILS_KEY);
    localStorage.removeItem(DESTINATION_NAME_KEY);
    
    if (!destinationName) return;

    try {

      /* WE'RE FETCHING EVERYTHING HERE. RATHER INEFFICIENT. EVENTUALLY THIS MUST CHANGE TO ONLY FETCH
       * FROM THE PAGE WE ARE AND RESET EVERYTHING ELSE TO NULL.
       *
       * ANOTHER POINT IS THAT IF THE DESTINATION IS HELD TO BE THE SAME AS THE CURRENT ONE, THEN WE
       * OBVIOUSLY SHOULDN'T RELOAD - THIS LOGIC HAS NOT YET BEEN WRITTEN.
       */

      destinationDetails = await fetchResource('destination', DESTINATION_DETAILS_KEY);
//      restaurantsDetails  = await fetchResource('restaurants', RESTAURANTS_DETAILS_KEY);
//      localCuisineDetails  = await fetchResource('local_cuisine', LOCAL_CUISINE_DETAILS_KEY);
//      activitiesDetails = await fetchResource('activities', ACTIVITIES_DETAILS_KEY);
//      sightseeingDetails  = await fetchResource('sightseeing', SIGHTSEEING_DETAILS_KEY);
      essentialsDetails  = await fetchResource('essentials', ESSENTIALS_DETAILS_KEY);

      logger.log("Destination updated via Ctrl+D:", destinationDetails.name);
            logger.log("Essential Details:", essentialsDetails);
      window.urlRoute(window.location.pathname);
    } catch (err) {
      logger.error("Failed to update destination:", err);
    }
  }
});

/// UNSURE WHAT THESE COMMENTS ARE - POSS AN OLD TEST AND SHOULD BE DELETED
//const linkEl = document.getElementById("myCss");
//linkEl.href = window.APP_ROOT + "code/destination/destination.css";

/* An important variable that stores the name of the destination where we are. Need for correctly fetching
 * everything from the server.
 */
export let destinationName = "";

// These are the variables that store all the info from the database:
export let destinationDetails = null;
export let restaurantsDetails = null;
export let sightseeingDetails = null;
export let activitiesDetails = null;
export let essentialsDetails = null;
export let localCuisineDetails = null;

// Helper function: prompt user safely
function askForDestination() {
  let destinationName = "";
  logger.log("I'm gonna ask you ONE more time!");

  // Keep prompting until the user enters something non-empty
  while (!destinationName || !destinationName.trim()) {
    destinationName = prompt("Please enter your destination:", "Barcelona");
    
    if (!destinationName || !destinationName.trim()) {
      alert("Destination name is required");
    }
  }

  localStorage.setItem(DESTINATION_NAME_KEY, destinationName);
  return destinationName.trim();
}

async function fetchResource(endpoint, storageKey) {
  if (!destinationName) {
    throw new Error('fetchResource called without destinationName');
  }

  const stored = localStorage.getItem(storageKey);

  logger.log("Fetching ", endpoint, " with destination set as ", destinationName);

  logger.log("h1");
  if (stored) return JSON.parse(stored);
  logger.log("h2");

  const res = await fetch(`${API_ROOT}/${endpoint}?name=${encodeURIComponent(destinationName)}`);
  if (!res.ok) throw new Error(`${endpoint} failed: ${res.status}`);
  const data = await res.json();

  localStorage.setItem(storageKey, JSON.stringify(data));
  logger.log("data is ", data);
  return data;
}



/**************************/
/* THE DESTINATION MAGIC! */
/**************************/

// Initialize destination: load from storage or fetch
export async function initDestination() {
  destinationName = localStorage.getItem(DESTINATION_NAME_KEY);

  logger.log("in initdestination with ", destinationName);
  // This logic will eventually be replaced with something better
  if (!destinationName) destinationName = askForDestination();

  // Here we should assume that destinationName now has a meaningful value

  try {
    const destination = await fetchResource('destination', DESTINATION_DETAILS_KEY);
    logger.log("Fetched destination:", destination);
    return destination;
  } catch (err) {
    logger.error("Error fetching destination:", err);
    return null;
  }
}

/**************************/
/* THE SIGHTSEEING MAGIC! */
/**************************/

export async function initSightseeing() {
  //const destinationName = JSON.parse(localStorage.getItem(DESTINATION_DETAILS_KEY)).name;
  logger.log("destination name for sightseeing gathering " + destinationName);
  // Prompt user if no stored data

  try {
    const restaurants = await fetchResource('sightseeing', SIGHTSEEING_DETAILS_KEY);
    logger.log("Fetched sightseeing:", restaurants);
    return restaurants;
  } catch (err) {
    logger.error("Error fetching sightseeing:", err);
    return null;
  }
}

/**************************/
/* THE RESTAURANTS MAGIC! */
/**************************/

export async function initRestaurants() {
  //const destinationName = JSON.parse(localStorage.getItem(DESTINATION_DETAILS_KEY)).name;
  logger.log("destination name for restaurants gathering " + destinationName);
  // Prompt user if no stored data

  try {
    const restaurants = await fetchResource('restaurants', RESTAURANTS_DETAILS_KEY);
    logger.log("Fetched restaurants:", restaurants);
    return restaurants;
  } catch (err) {
    logger.error("Error fetching restaurants:", err);
    return null;
  }
}

export function getRestaurantById(id) {
  const stored = localStorage.getItem(RESTAURANTS_DETAILS_KEY);

  logger.log("stored ", stored);

  if (!stored) return null; // must fetch first
  const storedArray = JSON.parse(stored);
  return storedArray.find(r => r.id === id);
}

/*************************/
/* THE ACTIVITIES MAGIC! */
/*************************/

export async function initActivities() {
  //const destinationName = JSON.parse(localStorage.getItem(DESTINATION_DETAILS_KEY)).name;
  logger.log("destination name for activities gathering " + destinationName);
  // Prompt user if no stored data

  try {
    const activities = await fetchResource('activities', ACTIVITIES_DETAILS_KEY);
    logger.log("Fetched activities:", activities);
    return activities;
  } catch (err) {
    logger.error("Error fetching activities:", err);
    return null;
  }
}

/****************************/
/* THE LOCAL CUISINE MAGIC! */
/****************************/

export async function initLocalCuisine() {
  //const destinationName = JSON.parse(localStorage.getItem(DESTINATION_DETAILS_KEY)).name;
  logger.log("destination name for local cuisine gathering " + destinationName);
  // Prompt user if no stored data

  try {
    const localCuisine = await fetchResource('local_cuisine', ACTIVITIES_DETAILS_KEY);
    logger.log("Fetched local cuisine:", localCuisine);
    return localCuisine;
  } catch (err) {
    logger.error("Error fetching local cuisine:", err);
    return null;
  }
}

/*************************/
/* THE ESSENTIALS MAGIC! */
/*************************/

// Initialize destination: load from storage or fetch
export async function initEssentials() {
  destinationName = localStorage.getItem(DESTINATION_NAME_KEY);

  logger.log("in initdestination with ", destinationName);
  // This logic will eventually be replaced with something better
  if (!destinationName) destinationName = askForDestination();

  // Here we should assume that destinationName now has a meaningful value

  try {
    const essentials = await fetchResource('essentials', ESSENTIALS_DETAILS_KEY);
    logger.log("Fetched essentials:", essentials);
    return essentials;
  } catch (err) {
    logger.error("Error fetching essentials:", err);
    return null;
  }
}


/****************************/
/* THE LOCAL CUISINE MAGIC! */
/****************************/


// THIS SEEMS IN THE WRONG PLACE - NEEDS MOVING SOON, PROB TO DESTINATION.JS

// Optional: initialize immediately (top-level)
initDestination().then(data => {
  if (data) logger.log("Destination initialized:", data);
});