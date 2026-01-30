const uiRoot = '/data/ui/dest-icons/';
const urlRoot = '';

class NamedIcon {
  constructor(name, image, href, index) {
    this.name = name;
    this.image = image;
    this.href = href;
    this.index = index;
  }

  toHtml() {
    // The spacer is used to help arrange the grid aesthetically
    return `
      <named-icon id='named-icon-${this.index}' data-href='/destination/${this.href}'>
        <dest-icon style='background-image: url(${this.image});'></dest-icon>
        <icon-name>${this.name}</icon-name>
      </named-icon>
      <spacer id='spacer-${this.index}' style='display:none; background:red'></spacer>
    `;
  }
}

class Destination {
  #destBanner;
  #myGrid;
  #headerTitle;
  #namedIcons = [];
  #route;

  constructor(route) {
    this.#route = route;
  }

  /** 
   * Initializes the page after destination data is ready 
   * @param {Object} destinationDetailsObj - The object returned by initDestination
   */
  async init(destinationDetailsObj) {
    console.log("Initializing Destination page with data", destinationDetailsObj);

    this.#destBanner = document.querySelector('dest-banner');
    this.#myGrid = document.querySelector('#my-grid');
    this.#headerTitle = document.getElementById('header-title');
    this.#destBanner = document.querySelector('dest-banner');

    if (!this.#myGrid) {
      console.error('Destination: #my-grid not found');
      return;
    }

    const details = destinationDetailsObj.details;
    const imageUrl = destinationDetailsObj.imageUrl
    const destinationName = destinationDetailsObj.name;

    this.#headerTitle.textContent = destinationName ?? '';
    console.log("bi " + JSON.stringify(imageUrl));
    console.log("banner " + this.#destBanner);
this.#destBanner.style.backgroundImage = `url(${imageUrl})`;

    let html = '';
    let namedIcons = [];

    const sectionsArray = details?.sections?.split(',') ?? [];
    let index = 0;

    for (const section of sectionsArray) {
      const s = section.trim();
      if (!s) continue;

      namedIcons.push(
        new NamedIcon(
          s,
          uiRoot + s.replace(/\s+/g, '-') + '.webp',
          urlRoot + s.toLowerCase() + '/',
          index++
        )
      );
    }

    for (const icon of namedIcons) {
      html += icon.toHtml();
    }

    this.#myGrid.innerHTML = html;
    this.#namedIcons = namedIcons;

    // Attach click listeners
    this.#namedIcons.forEach(icon => {
      const el = document.querySelector(`#named-icon-${icon.index}`);
      if (el) {
        el.addEventListener('click', () => {
          // Use route function if defined, otherwise fallback to direct navigation
          if (window.urlRoute) {
            window.urlRoute(icon.href);
          } else {
            window.location.href = icon.href;
          }
        });
      }
    });

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

export { Destination };
