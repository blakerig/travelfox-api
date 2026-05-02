import { initRestaurants } from '../common.js';

class RestaurantsPage {
  #route;
  data = [];
  selectedCuisines = [];

  constructor(route) {
    this.#route = route;
    this.onCardClick = this.onCardClick.bind(this);
  }

  /** Apply the selected cuisine filter */
  applyCuisineFilter() {
    if (this.selectedCuisines.length === 0) {
      this.renderGrid(this.data);
      return;
    }

    const filtered = this.data.filter(place =>
      this.selectedCuisines.includes(place.cuisine)
    );

    this.renderGrid(filtered);
  }

  /** Initialize page */
async init() {
    console.log("Initializing RestaurantsPage...");

  this.data = await initRestaurants();

  const grid = document.getElementById("my-grid");
  const modal = document.getElementById("cuisine-modal");
  const container = document.getElementById("cuisine-options");
  const button = document.getElementById("cuisine-button");
  const applyBtn = document.getElementById("apply-filter");
  const closeBtn = document.getElementById("close-modal");

    console.log("Modal element:", modal);
  console.log("Checkbox container:", container);
  console.log("Cuisine button:", button);
  console.log("Apply button:", applyBtn);
  console.log("Close button:", closeBtn);


  if (!grid || !modal || !container || !button || !applyBtn || !closeBtn) {
    console.error("Required elements not found in DOM!");
    return;
  }

  // Populate modal checkboxes now that container exists
  this.renderCuisineOptions();

  console.log("added event listener to button");
  // Button opens modal
  button.addEventListener("click", () => {
    console.log("click!");
    modal.classList.remove("hidden");
  });

  // Close modal
  closeBtn.addEventListener("click", () => {
    console.log("close click.");
    modal.classList.add("hidden");
  });

  // Apply filter
  applyBtn.addEventListener("click", () => {
    const checked = [...container.querySelectorAll("input:checked")].map(
      input => input.value
    );
    this.selectedCuisines = checked;
    this.applyCuisineFilter();
    modal.classList.add("hidden");
  });

  // Render grid initially
  this.renderGrid(this.data);

  // Handle card clicks
  grid.addEventListener("click", this.onCardClick);
}

  /** Populate modal with cuisine checkboxes */
  renderCuisineOptions() {
    const container = document.getElementById("cuisine-options");
    if (!container) return;

    const cuisines = [...new Set(this.data.map(r => r.cuisine))];
    cuisines.sort();

    container.innerHTML = cuisines.map(cuisine => `
      <label>
        <input type="checkbox" value="${cuisine}" />
        ${cuisine}
      </label>
    `).join("");
  }

  /** Render restaurant cards */
  renderGrid(restaurants) {
    const grid = document.getElementById("my-grid");

    grid.innerHTML = restaurants
      .map(place => `
        <div class="card" data-id="${place.id}">
          <div class="card-image">
            <img src="${place.image_link || ''}" alt="${place.name}" loading="lazy"/>
          </div>
          <div class="card-info">
            <h2>${place.name}</h2>
            <p>${'€'.repeat(place.cost_rank || 0)} · ${place.cuisine}</p>
          </div>
        </div>
      `)
      .join("");
  }

  /** Handle card click for SPA navigation */
  onCardClick(e) {
    const card = e.target.closest(".card");
    if (!card) return;

    const restaurantId = card.dataset.id;
    if (!restaurantId) return;

    const href = `/destination/restaurants/${restaurantId}/`;
    window.history.pushState({}, "", href);

    if (window.urlLocationHandler) {
      window.urlLocationHandler();
    }
  }

  onResize() {
    // Optional: handle responsive adjustments
  }
}

export { RestaurantsPage };