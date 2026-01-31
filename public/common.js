// common.js
const uiRoot = '/data/ui/dest-icons/';
const urlRoot = '';
const API_ROOT = import.meta?.env?.VITE_API_ROOT || 'https://travelfox-api.onrender.com/destination?name=Barcelona';

const STORAGE_DESTINATION = 'destinationDetails';

// Shared destination details object
export const destinationDetails = {
  name: "",
  details: {},
  imageUrl: "",
};

// Class for generating icons
export class NamedIcon {
  constructor(name, image, href, index) {
    this.name = name;
    this.image = image;
    this.href = href;
    this.index = index;
  }

  toHtml() {
    return `
      <named-icon id='named-icon-${this.index}' data-href='/destination/${this.href}'>
        <dest-icon style='background-image: url(${this.image});'></dest-icon>
        <icon-name>${this.name}</icon-name>
      </named-icon>
      <spacer id='spacer-${this.index}' style='display:none; background:red'></spacer>
    `;
  }
}

// Helper function: prompt user safely
function askForDestination() {
  const destinationName = prompt("Please enter your destination:", "Barcelona");
  if (!destinationName) {
    alert("Destination name is required");
    return null;
  }
  return destinationName.trim();
}

// Fetch destination details from server
async function getDestinationDetails(destinationName) {
  if (!destinationName) throw new Error('No destination name provided');

  console.log("Fetching destination:", destinationName);

  // Fetch main destination data
  console.log("API ROOT " + API_ROOT)
  const res =  await fetch(API_ROOT + '/destination?name=' + encodeURIComponent(destinationName));
  console.log("hhhher");
  if (!res.ok) throw new Error(`Failed to fetch destination: ${res.status}`);
  console.log("hhhher");
  const data = await res.json();

  console.log("hhhher");
  destinationDetails.name = destinationName;
  destinationDetails.details = data;

  // Fetch main banner image if available
  if (data.main_image) {
    const imgRes = await fetch(API_ROOT + '/image?id=' + encodeURIComponent(data.main_image));
    if (!imgRes.ok) throw new Error(`Failed to fetch image: ${imgRes.status}`);
    const imgData = await imgRes.json();
    destinationDetails.imageUrl = imgData.image_link || '';
  }

  // Save to localStorage
  localStorage.setItem(STORAGE_DESTINATION, JSON.stringify(destinationDetails));

  return destinationDetails;
}

// Initialize destination: load from storage or fetch
export async function initDestination() {
  const stored = localStorage.getItem(STORAGE_DESTINATION);
  console.log("initdest " + stored);

  if (stored) {
    try {
      console.log("stored " + stored);
      const parsed = JSON.parse(stored);
      Object.assign(destinationDetails, parsed);
      console.log("Loaded destination from storage:", destinationDetails);
      return destinationDetails;
    } catch (err) {
      console.warn("Failed to parse stored destination:", err);
    }
  }

  console.log("not stored");
  // Prompt user if no stored data
  const destinationName = askForDestination();
  if (!destinationName) {
    console.log("No destination provided by user.");
    return null;
  }

  try {
    const details = await getDestinationDetails(destinationName);
    console.log("Fetched destination details:", details);
    return details;
  } catch (err) {
    console.error("Error fetching destination:", err);
    return null;
  }
}

// Keydown handler for Ctrl+D: update destination dynamically
document.addEventListener('keydown', async (event) => {
  if (event.ctrlKey && event.key.toLowerCase() === 'd') {
    event.preventDefault();

    const destinationName = askForDestination();
    console.log("destination name is " + destinationName);
    if (!destinationName) return;

    try {
      await getDestinationDetails(destinationName);
      console.log("Destination updated via Ctrl+D:", destinationDetails.name);
  window.urlRoute(window.location.pathname);
    } catch (err) {
      console.error("Failed to update destination:", err);
    }
  }
});

// Optional: initialize immediately (top-level)
initDestination().then(data => {
  if (data) console.log("Destination initialized:", data);
});
