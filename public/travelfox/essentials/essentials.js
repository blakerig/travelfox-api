const uiRoot = '/ui/dest-icons/';
const urlRoot = '';

import { logger } from '../common.js';

function truncateWords(text, maxWords) {
  if (!text) return '';

  const words = text.trim().split(/\s+/);

  if (words.length <= maxWords) {
    return text;
  }

  return words.slice(0, maxWords).join(' ') + '...';
}

class EssentialsPage {
  #destBanner;
  #myGrid;
  #headerTitle;
  #namedIcons = [];
  #route;

  constructor(route) {
    this.#route = route;
  }

  async init(details) {
    logger.log("Initializing essentials page with data: ", details);
    logger.log("frug");

// Clear existing grid content
this.#myGrid = document.getElementById('my-grid');
this.#myGrid.innerHTML = '';

// Render cards
details.forEach(item => {
  const card = document.createElement('div');
  card.classList.add('card');

  // Image
  const img = document.createElement('img');
  img.src = item.image_link;
  img.alt = item.name;
  card.appendChild(img);

  // Content container
  const content = document.createElement('div');
  content.classList.add('card-content');

  // Title
  const title = document.createElement('div');
  title.classList.add('card-title');
  title.textContent = item.name;
  content.appendChild(title);

  // Description
const description = document.createElement('div');
description.classList.add('card-description');
description.textContent = truncateWords(item.description, 25);
content.appendChild(description);

  card.appendChild(content);
  this.#myGrid.appendChild(card);
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

export { EssentialsPage };