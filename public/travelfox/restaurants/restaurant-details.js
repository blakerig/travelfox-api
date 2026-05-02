import { getRestaurantById } from '../common.js';

class RestaurantDetailsPage {
  #id;

  constructor(id) {
    this.#id = id;
  }

  /** Initialize the restaurant detail page */
  async init() {
    if (!this.#id) {
      console.error("Restaurant ID is required");
      return;
    }

    let restaurant;
    
    try {
      restaurant = await getRestaurantById(this.#id);
    } catch (err) {
      console.error("Failed to fetch restaurant:", err);
      document.querySelector("#content").innerHTML = `<p>Failed to load restaurant details.</p>`;
      return;
    }

    const app = document.querySelector("#content");
    if (!app) {
      console.error("No content container found with ID 'content'");
      return;
    }

    // Render the details page
    app.innerHTML = app.innerHTML + `
      <div class="restaurant-details">
        <button class="back-btn">← Back to Restaurants</button>

        <h1>${restaurant.name}</h1>
        <p>${restaurant.cost} · ${restaurant.cuisine}</p>

        <div class="details-section">
          <h3>Description</h3>
          <p>${restaurant.description || "No description available."}</p>
        </div>

        <div class="details-section">
          <h3>Address</h3>
          <p>${restaurant.address || "No address available."}</p>
        </div>

        <div class="details-section">
          <h3>Contact</h3>
          <p>${restaurant.phone || "N/A"} | ${restaurant.website ? `<a href="${restaurant.website}" target="_blank">${restaurant.website}</a>` : "N/A"}</p>
        </div>
      </div>
    `;

    // Handle back button
    const backBtn = document.querySelector(".back-btn");
    backBtn.addEventListener("click", () => {
      window.history.pushState({}, "", "/destination/restaurants/");
      if (window.urlLocationHandler) window.urlLocationHandler();
    });
  }
}

export { RestaurantDetailsPage };
