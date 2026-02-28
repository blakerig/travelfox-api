const uiRoot = '/ui/dest-icons/';
const urlRoot = '';
import '../common.js';
import { initLocalCuisine } from '../common.js';

class LocalCuisinePage {
  #route;

  constructor(route) {
    this.#route = route;
  }

  /** 
   * Initializes the page after destination data is ready 
   * @param {Object} restaurantDetailsObj - The object returned by initDestination
   */
  async init() {
    const data = await initLocalCuisine();

    console.log("Initializing local cuisine page with data", data);

const grid = document.getElementById("my-grid");

grid.innerHTML = data
  .map(
    place => `
      <div class="card">
        <div class="card-image">
          <img src="${place.image_link || ''}" alt="${place.name}" />
        </div>
        <div class="card-info">
          <h2>${place.name}</h2>
        </div>
      </div>
    `
  )
  .join("");

    // Resize handling
    window.addEventListener('resize', this.onResize.bind(this), true);

    // Initial layout
    this.onResize();
  }

  onResize(event) {
    // Placeholder for responsive logic
    // You can use this.#myGrid or this.#destBanner to adjust layout dynamically
  }
}

export { LocalCuisinePage };
