// The point of this class is to provide some basic data
// for the application, like a list of places.

class Place {
  constructor(name, country, continent) {
    this.id = -1
    this.name = name
    this.country = country
    this.continent = continent
    this.folder = `/${this.continent}/${this.country}/${this.name}/`
    this.folder = this.folder.replaceAll(' ', '-').toLowerCase();
    this.thumbUrl = this.folder + 'thumb.webp'
    this.thumbUrl = `/data/ui/world-thumbs/${this.name}-${this.country}.webp`
    this.thumbUrl = this.thumbUrl.toLowerCase().replaceAll(' ', '-');
    this.bannerUrl = this.folder + 'banner.webp'
  }
}


class AppData {
 
  #places = null
  #initialized = false

  init() {
    if (!this.#initialized) {
      // console.log('db-init')
      // Initialize Firebase
 
      this.#places = [
        // in order of popularity (visitors per year) according to
        // https://www.enjoytravel.com/au/travel-news/places-to-visit/50-most-visited-cities-in-the-world
        // Continents: AF AI EU NA SA AA OC
        new Place("Los Angeles", "USA", "North America"),
        new Place("Paris", "France", "Europe"),
        new Place("Las Vegas", "USA", "North America"),
        new Place("Rome", "Italy", "Europe"),
        new Place("Hong Kong", "China", "Asia"),
        new Place("Miami", "USA", "North America"),
        new Place("Pattaya", "Thailand", "Asia"),
        new Place("Bangkok", "Thailand", "Asia"),
        new Place("Hanoi", "Vietnam", "Asia"),
        new Place("Cancún", "Mexico", "North America"),
        new Place("London", "UK", "Europe"),
        new Place("Riyadh", "Saudi Arabia", "Asia"),
/*
        new Place("Tokyo", "Japan", "Asia"),
        new Place("Macau", "China", "Asia"),
        new Place("Delhi", "India", "Asia"),
        new Place("Istanbul", "Turkey", "Europe"),
        new Place("Vienna", "Austria", "Europe"),
        new Place("Dubai", "UAE", "xxx"),
        new Place("Johor Bahru", "Malaysia", "xxx"),
        new Place("Osaka", "Japan", "Asia"),
        new Place("Cairo", "Egypt", "xxx"),
        new Place("Antalya", "Turkey", "Europe"),
        new Place("Malagar", "Spain", "Europe"),
        new Place("Singapore", "ROS", "Asia"),
        new Place("Ho Chi Minh City", "Vietnam", "xxx"),
        new Place("Barcelona", "Spain", "Europe"),
        new Place("Berlin", "Germany", "Europe"),
        new Place("Mecca", "Saudi Arabia", "Asia"),
        new Place("Madrid", "Spain", "Europe"),
        new Place("Florence", "Italy", "Europe"),
        new Place("Amsterdam", "Netherlands", "Europe"),
        new Place("Milan", "Italy", "Europe"),
        new Place("Moscow", "Russia", "Europe"),
        new Place("Phuket", "Thailand", "Asia"),
*/
      ]; 

      // assign unique ids (just their index)
      this.#places.forEach((p,i) => p.id = i)

      this.#initialized = true
    }
  }

  isInitialized() {
    return this.#initialized
  }

  getPlaces() {
    return this.#places;
  }
}

let appData = new AppData()
appData.init()

export { appData }
