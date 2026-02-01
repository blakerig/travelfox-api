import './common.js';
import { RestaurantsPage } from './restaurants/restaurants.js';
import { APP_ROOT, initDestination } from './common.js';
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
  "/destination/restaurants/": {
    template: `${APP_ROOT}restaurants/restaurants.html`,
    title: "Test | " + urlPageTitle,
    hook: () => { new RestaurantsPage('./restaurants/').init() },
    description: "This is the restaurants page",
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
  //let location = window.location.pathname;
  const location = window.location.hash.slice(1) || "/destination/";

  // Redirect / or /index.html → /destination/
  if (location === "/" || location === "/index.html") {
    window.history.replaceState({}, "", "#/destination/");
    location = "/destination/";
  }

  // Normalize trailing slash
  if (!location.endsWith("/") && urlRoutes[location + "/"]) {
    window.history.replaceState({}, "", location + "/");
    location = location + "/";
  }
  console.log("urlRoutes[location]:", urlRoutes[location]);
  console.log("Current route:", location);

  const route = urlRoutes[location] || urlRoutes["/404/"];

  console.log(route);
  // Load template safely
  let html = "";
  try {
    console.log("route template " + route.template);
    const res = await fetch(route.template);
    if (!res.ok) throw new Error(`Failed to load ${route.template}`);
    html = await res.text();
  } catch {
    html = await fetch(urlRoutes["/404/"].template).then(r => r.text());
  }

  // Render template
  document.querySelector("#content").innerHTML = html;

  // Run hook if exists
  if (route.hook) route.hook();

  // Update page title and meta description
  document.title = route.title;
  const meta = document.querySelector('meta[name="description"]');
  if (meta) meta.setAttribute("content", route.description);
};

// Handle browser back/forward buttons
window.onpopstate = urlLocationHandler;

