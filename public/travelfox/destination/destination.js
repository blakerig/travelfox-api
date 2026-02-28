const uiRoot = 'ui/dest-icons/';
const urlRoot = '';

import { logger } from '../common.js';

class Destination {
  #destBanner;
  #myGrid;
  #headerTitle;
  #namedIcons = [];
  #route;

  constructor(route) {
    this.#route = route;
  }

  async init(destinationDetailsObj) {
    logger.log("Initializing Destination page with data: ", destinationDetailsObj);

    this.#destBanner = document.querySelector('dest-banner');
    this.#myGrid = document.querySelector('#my-grid');
    this.#headerTitle = document.getElementById('header-title');

    if (!this.#myGrid) {
      logger.error('Destination: #my-grid not found');
      return;
    }

    // Set header and banner
    this.#headerTitle.textContent = destinationDetailsObj.dest_name ?? '';
    if (this.#destBanner) {
      this.#destBanner.style.backgroundImage = `url(${destinationDetailsObj.image_link})`;
    }

    // Build icons safely using DocumentFragment
    const sectionsArray = destinationDetailsObj?.sections?.split(',') ?? [];
    const fragment = document.createDocumentFragment();
    this.#namedIcons = []; // reset

    sectionsArray
      .map(s => s.trim())
      .filter(Boolean)
      .forEach((sectionName, index) => {
        const href = `${urlRoot}${sectionName.replace(/\s+/g, '-').toLowerCase()}/`;
        const image = `${uiRoot}${sectionName.replace(/\s+/g, '-').toLowerCase()}.webp`;

        // Create named-icon
        const namedIcon = document.createElement('named-icon');
        namedIcon.id = `named-icon-${index}`;
        namedIcon.dataset.href = `/destination/${href}`;
        namedIcon.setAttribute('role', 'button');
        namedIcon.setAttribute('aria-label', sectionName);

        // Create dest-icon
        const destIcon = document.createElement('dest-icon');
        destIcon.style.backgroundImage = `url(${image})`;

        // Create icon-name
        const iconNameEl = document.createElement('icon-name');
        iconNameEl.textContent = sectionName;

        // Assemble
        namedIcon.appendChild(destIcon);
        namedIcon.appendChild(iconNameEl);

        // Optional spacer
        const spacer = document.createElement('spacer');
        spacer.id = `spacer-${index}`;
        spacer.style.display = 'none';
        fragment.appendChild(namedIcon);
        fragment.appendChild(spacer);

        // Keep reference
        this.#namedIcons.push(namedIcon);
      });

    // Clear old icons and append new
    this.#myGrid.innerHTML = '';
    this.#myGrid.appendChild(fragment);

    // Event delegation for icon clicks
    this.#myGrid.addEventListener('click', (e) => {
      const namedIcon = e.target.closest('named-icon');
      if (!namedIcon) return;
      const href = namedIcon.dataset.href;
      if (this.#route) {
        this.#route(href);
      } else if (window.urlRoute) {
        window.urlRoute(href);
      } else {
        window.location.href = href;
      }
    });

    // Resize handling
    window.addEventListener('resize', this.onResize.bind(this), true);

    // Initial layout
    this.onResize();
  }

  // Example placeholder for resize handling
  onResize() {
    // Your responsive layout logic here
    logger.log('Resizing destination page...');
  }
}

export { Destination };