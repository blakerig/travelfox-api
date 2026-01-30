class RestaurantsPage {
  #goToTop
  #fadeWrapper
  #backButton
  #data

  onResize(event) {
    
    let ww = window.innerWidth          // window width
    let wh = window.innerHeight         // window height
  }

  /**
   * the init function hooks up the backend to the frontend
   */
  async init() {
    console.log('RestaurantPage.init()')
     
    let db = await fetch('/test/full-database.json').then((response) => response.json());
    console.log(db.data.__collections__.aboutTheApp.aboutTheApp.description.length)
    //console.log(db.data.__collections__.destinations.barcelona.__collections__.restaurants)
    var restaurantsCollection = db.data.__collections__.destinations.barcelona.__collections__.restaurants

    for (let i=2; i<5; i++)
      console.log (Object.keys(restaurantsCollection)[i])

    /*restaurants._children.forEach(element => {
      console.log(element.name)
    });*/

    this.#fadeWrapper = document.querySelector('#fade-wrapper')
    this.#backButton = document.querySelector('.back-icon')
    this.#backButton.onclick = () => location.assign('/')

    window.addEventListener('resize', this.onResize.bind(this), true)

    this.#goToTop = document.getElementById('go-to-top')
    if (this.#goToTop) this.#goToTop.onclick = () => window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });

    this.onResize()
  }
}

const restaurantsPage = (window.__world = new RestaurantsPage())
restaurantsPage.init()

// export { world }
