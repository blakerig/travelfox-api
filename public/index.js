import './common.js';
import { RestaurantsPage } from './restaurants/restaurants.js';
import { RestaurantDetailsPage } from './restaurants/restaurant-details.js';
import { SightseeingPage } from './sightseeing/sightseeing.js';
import { EssentialsPage } from './essentials/essentials.js';
import { ActivitiesPage } from './activities/activities.js';
import { LocalCuisinePage } from './local_cuisine/local_cuisine.js';
import { APP_ROOT, initDestination, initEssentials } from './common.js';
import { Destination } from './destination/destination.js';

const destinationPage = new Destination();
const urlPageTitle = "TravelFox";

// Global urlRoute function
const urlRoute = (href) => {
  window.history.pushState({}, "", href);
  urlLocationHandler();
};

// URL route mapping
const urlRoutes = {
  "/404/": {
    template: `${APP_ROOT}404/404.html`,
    title: "404 | " + urlPageTitle,
    hook: undefined,
    description: "Page not found",
  },
"/destination/": {
  template: `${APP_ROOT}destination/destination.html`,
  title: "Test | " + urlPageTitle,
  hook: async () => {
    const destinationData = await initDestination();
    if (!destinationData) {
      console.warn("No destination data available. Cannot initialize Destination page.");
      return;
    }
    const page = new Destination();
    await page.init(destinationData);
  },
  description: "This is the destination page",
},
  "/destination/essentials/": {
    template: `${APP_ROOT}essentials/essentials.html`,
    title: "Test | " + urlPageTitle,
  hook: async () => {
    const essentialsData = await initEssentials();
    if (!essentialsData) {
      console.warn("No destination data available. Cannot initialize Destination page.");
      return;
    }
    const page = new EssentialsPage();
    await page.init(essentialsData);
  },
    description: "This is the restaurants page",
  },
  "/destination/restaurants/": {
    template: `${APP_ROOT}restaurants/restaurants.html`,
    title: "Test | " + urlPageTitle,
    hook: () => { new RestaurantsPage('./restaurants/').init() },
    description: "This is the restaurants page",
  },
  "/destination/activities/": {
    template: `${APP_ROOT}activities/activities.html`,
    title: "Test | " + urlPageTitle,
    hook: () => { new ActivitiesPage('./activities/').init() },
    description: "This is the restaurants page",
  },
  "/destination/local-cuisine/": {
    template: `${APP_ROOT}local_cuisine/local_cuisine.html`,
    title: "Test | " + urlPageTitle,
    hook: () => { new LocalCuisinePage('./local_cuisine/').init() },
    description: "This is the local cuisine page",
  },
  "/destination/sightseeing/": {
    template: `${APP_ROOT}sightseeing/sightseeing.html`,
    title: "Test | " + urlPageTitle,
    hook: () => { new SightseeingPage('./sightseeing/').init() },
    description: "This is the restaurants page",
  },
  "/destination/restaurants/:id/": {
  template: `${APP_ROOT}restaurants/restaurant_details.html`,
  title: "Restaurant Details | " + urlPageTitle,
  hook: async (id) => {
    const page = new RestaurantDetailsPage(id);
    await page.init();
  },
  description: "This is the restaurant detail page",
},
  "/about/": {
    template: `${APP_ROOT}information/about.html`,
    title: "About Us | " + urlPageTitle,
    hook: undefined,
    description: "This is the about page",
  }
};

document.addEventListener('DOMContentLoaded', async () => {
  console.log("DOM fully loaded");
console.log(APP_ROOT);
  // Load or fetch destination data
  const data = await initDestination();
  console.log("Destination data loaded:", data);

  if (!data) {
    console.warn("No destination data available. Cannot initialize page.");
    return;
  }

  // Now that the DOM exists, initialize the Destination page
  await destinationPage.init(data);
  console.log("Destination page initialized");

  // You can now safely attach global click listeners, etc.
// Expose urlRoute globally
window.urlRoute = urlRoute;
window.urlLocationHandler = urlLocationHandler;

// Initialize page routing
urlLocationHandler();

});

// Global click handler for nav links (named-icon)
document.addEventListener("click", (e) => {
  const icon = e.target.closest("named-icon");
  if (!icon) return;

  e.preventDefault();
  const href = icon.dataset.href;
  console.log("Navigating to:", href);

  urlRoute(href);
});




// URL location handler
const urlLocationHandler = async () => {
  let location = window.location.pathname;

  // Redirect / or /index.html → /destination/
  if (location === "/" || location === "/index.html") {
    window.history.replaceState({}, "", "/destination/");
    location = "/destination/";
  }

  // Normalize trailing slash
  if (!location.endsWith("/")) location += "/";

  // Try exact match first
  let route = urlRoutes[location] || urlRoutes["/404/"];

  // If no exact match, check dynamic routes (like /destination/restaurants/:id/)
  if (route === urlRoutes["/404/"]) {
    for (const path in urlRoutes) {
      if (path.includes(":id")) {
        const regex = new RegExp(`^${path.replace(":id", "(\\w+)")}$`);
        const match = location.match(regex);
        if (match) {
          route = urlRoutes[path];
          // Pass ID to hook
          route._id = match[1];
          break;
        }
      }
    }
  }

  // Load template
  let html = "";
  try {
    const res = await fetch(route.template);
    if (!res.ok) throw new Error(`Failed to load ${route.template}`);
    html = await res.text();
  } catch {
    html = await fetch(urlRoutes["/404/"].template).then(r => r.text());
  }

  // Render template
  document.querySelector("#content").innerHTML = html;

  // Run hook with ID if needed
  if (route.hook) {
    if (route._id) {
      await route.hook(route._id);
      delete route._id; // cleanup
    } else {
      await route.hook();
    }
  }

  // Update page title & meta
  document.title = route.title;
  const meta = document.querySelector('meta[name="description"]');
  if (meta) meta.setAttribute("content", route.description);
};

// Handle browser back/forward buttons
window.onpopstate = urlLocationHandler;

