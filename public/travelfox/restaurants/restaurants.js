import { initRestaurants, getRestaurantById } from '../common.js';

class RestaurantsPage {
  #route;

  constructor(route) {
    this.#route = route;
    // Bind the click handler once so we can attach/remove safely
    this.onCardClick = this.onCardClick.bind(this);
  }

  /** 
   * Initializes the Restaurants page 
   */
  async init() {
    const data = await initRestaurants();

    console.log("Initializing Restaurants page with data", data);

    const grid = document.getElementById("my-grid");
    if (!grid) {
      console.error("No grid element found with ID 'my-grid'");
      return;
    }

    // Render restaurant cards
grid.innerHTML = data
  .map(
    place => `
      <div class="card" data-id="${place.id}">
        <div class="card-image">
          <img 
            src="${place.image_link || ''}" 
            alt="${place.name}" 
            loading="lazy"
          />
        </div>
        <div class="card-info">
          <h2>${place.name}</h2>
          <p>
            ${'€'.repeat(place.cost_rank || 0)} 
            · ${place.cuisine}
          </p>
        </div>
      </div>
    `
  )
  .join("");

    // Add click listener to grid (event delegation)
    grid.removeEventListener("click", this.onCardClick); // prevent duplicates
    grid.addEventListener("click", this.onCardClick);

    // Handle window resize (optional)
    window.addEventListener('resize', this.onResize.bind(this));
    this.onResize();
  }

  /** Handle card clicks for SPA navigation */
  onCardClick(e) {
    const card = e.target.closest(".card");
    if (!card) return;

    const restaurantId = card.dataset.id;
    if (!restaurantId) return;

    // Navigate to restaurant details using SPA router
    const href = `/destination/restaurants/${restaurantId}/`;
    window.history.pushState({}, "", href);

    // Trigger the router
    if (window.urlLocationHandler) {
      window.urlLocationHandler();
    } else {
      console.warn("urlLocationHandler is not defined.");
    }
  }

  /** Optional resize handler */
  onResize() {
    // Add responsive adjustments here if needed
  }
}

export { RestaurantsPage };
