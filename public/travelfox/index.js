import './common.js';
import { RestaurantsPage } from './restaurants/restaurants.js';
import { RestaurantDetailsPage } from './restaurants/restaurant-details.js';
import { SightseeingPage } from './sightseeing/sightseeing.js';
import { EssentialsPage } from './essentials/essentials.js';
import { ActivitiesPage } from './activities/activities.js';
import { LocalCuisinePage } from './local_cuisine/local_cuisine.js';
import { initDestination, initEssentials } from './common.js';
import { Destination } from './destination/destination.js';

const destinationPage = new Destination();
const urlPageTitle = "TravelFox";
const BASE_PATH = APP_ROOT.replace(/\/$/, ""); // "/travelfox"

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
      const data = await initDestination();
      if (!data) return console.warn("No destination data available.");
      await destinationPage.init(data);
    },
    description: "This is the destination page",
  },
  "/destination/essentials/": {
    template: `${APP_ROOT}essentials/essentials.html`,
    title: "Test | " + urlPageTitle,
    hook: async () => {
      const data = await initEssentials();
      if (!data) return console.warn("No essentials data available.");
      const page = new EssentialsPage();
      await page.init(data);
    },
    description: "This is the essentials page",
  },
  "/destination/restaurants/": {
    template: `${APP_ROOT}restaurants/restaurants.html`,
    title: "Test | " + urlPageTitle,
    hook: () => new RestaurantsPage('./restaurants/').init(),
    description: "This is the restaurants page",
  },
  "/destination/activities/": {
    template: `${APP_ROOT}activities/activities.html`,
    title: "Test | " + urlPageTitle,
    hook: () => new ActivitiesPage('./activities/').init(),
    description: "This is the activities page",
  },
  "/destination/local-cuisine/": {
    template: `${APP_ROOT}local_cuisine/local_cuisine.html`,
    title: "Test | " + urlPageTitle,
    hook: () => new LocalCuisinePage('./local_cuisine/').init(),
    description: "This is the local cuisine page",
  },
  "/destination/sightseeing/": {
    template: `${APP_ROOT}sightseeing/sightseeing.html`,
    title: "Test | " + urlPageTitle,
    hook: () => new SightseeingPage('./sightseeing/').init(),
    description: "This is the sightseeing page",
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

// -------------------- URL HANDLER --------------------
const urlLocationHandler = async () => {
  // Get current path relative to BASE_PATH
  let location = window.location.pathname.replace(BASE_PATH, "") || "/";
  
  // Treat / or /index.html as /destination/ internally
  let isInitialIndex = false;
  if (location === "/" || location === "/index.html") {
    location = "/destination/";
    isInitialIndex = true;
  }

  // Ensure trailing slash for SPA matching
  if (!location.endsWith("/") && !location.endsWith(".html")) {
    location += "/";
  }

  console.log("Current location:", location);

  // Try exact match
  let route = urlRoutes[location] || urlRoutes["/404/"];

  // Dynamic route matching for :id
  if (route === urlRoutes["/404/"]) {
    for (const path in urlRoutes) {
      if (path.includes(":id")) {
        const regex = new RegExp(`^${path.replace(":id", "([\\w-]+)")}$`);
        const match = location.match(regex);
        if (match) {
          route = urlRoutes[path];
          route._id = match[1]; // pass ID to hook
          break;
        }
      }
    }
  }

  // Load template
  let html = "";
  try {
    console.log("Fetching template:", route.template);
    const res = await fetch(route.template);
    if (!res.ok) throw new Error("Failed to fetch template");
    html = await res.text();
  } catch {
    const res = await fetch(urlRoutes["/404/"].template);
    html = await res.text();
    route = urlRoutes["/404/"];
  }

  // Render template
  const content = document.querySelector("#content");
  if (content) content.innerHTML = html;

  // Run hook
  if (route.hook) {
    if (route._id) {
      await route.hook(route._id);
      delete route._id;
    } else {
      await route.hook();
    }
  }

  // Update page title & meta description
  document.title = route.title;
  const meta = document.querySelector('meta[name="description"]');
  if (meta) meta.setAttribute("content", route.description);

  // Optional: clean URL on initial load
  //if (isInitialIndex) {
  //  window.history.replaceState({}, "", "/destination/");
  //}
};

// -------------------- INITIALIZATION --------------------
document.addEventListener('DOMContentLoaded', async () => {
  console.log("DOM fully loaded");

  if ('serviceWorker' in navigator) {
    try {
      const registration = await navigator.serviceWorker.register(`${BASE_PATH}/service-worker.js`);
      console.log('Service Worker registered with scope:', registration.scope);
    } catch (error) {
      console.error('Service Worker registration failed:', error);
    }
  }

  // Expose globals
  window.urlRoute = urlRoute;
  window.urlLocationHandler = urlLocationHandler;

  // Initial route handling
  urlLocationHandler();
});

// -------------------- NAVIGATION --------------------
document.addEventListener("click", (e) => {
  const icon = e.target.closest("named-icon");
  if (!icon) return;

  e.preventDefault();
  const href = icon.dataset.href;
  console.log("Navigating to:", href);

  urlRoute(href);
});

// -------------------- BACK/FORWARD --------------------
window.onpopstate = urlLocationHandler;