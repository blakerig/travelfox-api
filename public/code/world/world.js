// import { database } from '/js/database.js'
// import { setRoute } from '/js/hash-router.js'
// import { getAuth, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/11.5.0/firebase-auth.js'
import { appData } from '/code/world/world-data.js'


class World {
  #cardHolder
  #goToTop
  #worldBanner

  /*
  async customizeForUser(user) {

    console.log('customizeForUser ' + !!user)

    if (!!user && user.emailVerified) {
      let userName = await database.getUserName(user.uid)
    } else {

      // this would kick unsigned users out!
      // setRoute('')

    }
  }*/

  test(el) {    
    location.assign(el.getAttribute('href'))
  }

  addGameCard(place) {
    let gameCardDiv = `<div onclick="__world.test(this)" class="dest-card" href='/'>
    <div class="card-image flex-grow" style="background-image: url('${place.thumbUrl}');" ></div>
    <div class="card-footer">${place.name}, ${place.country}</div>
    </div>`

    return gameCardDiv
  }



  #oldCardsAcross = 10
  #ruleDestCard = null
  #oldWindowWidth = -1
  #oldWindowHeight = -1
  onResize(event) {


    let ww = window.innerWidth          // window width
    let wh = window.innerHeight         // window height

    let changed = ww != this.#oldWindowWidth || wh != this.#oldWindowHeight

    this.#oldWindowWidth = ww
    this.#oldWindowHeight = wh

    if (!changed) return  // be efficient



    let ca = 999999                     // cards across

    let chm = 4 // card holder margin
    let cm = 8  // card margin
    let hh = 48 // header height
    let fh = 48 // footer height
    let ch = 172 + cm*2 // card height

    let minBannerAspect = 2/1.0
    let minBannerHeightAr = ww / minBannerAspect
    let minWindowHeight = hh + ch * 1.5
    let maxBannerHeight = wh - hh - ch - chm*2
    let bh = minBannerHeightAr // banner height

    let minBannerHeightPx = ch;
    if (bh < minBannerHeightPx) bh = minBannerHeightPx;

    let rh = wh - hh - bh - chm*2 // remaining height
    let hch = rh / (ch) // how many cards high

    let chr = hch % 1; // * cardHeightRemainder
    let gh = Math.floor(chr * ch) // growheight 

    bh += gh

    // banner too big => shrink?
    if (bh > maxBannerHeight) bh = maxBannerHeight
    
    // banner too small => grow
    if (wh < minWindowHeight) 
      bh = wh - hh + 3 // 3px is the bottom black border

    this.#worldBanner.style.height = bh + 'px'

    // set the cards accross, done by eye.
    if (ww <= 330) ca = 1       
    else if (ww <= 620) ca = 2  
    else if (ww <= 920) ca = 3
    else if (ww <= 1280) ca = 4
    else ca = 5

    // if this has changed, update the card style
    if (ca != this.#oldCardsAcross) {

      this.#oldCardsAcross = ca
      this.#ruleDestCard.style.width = 'calc(100% / ' + ca + ' - ' + cm +  'px*2)'
    }

    // this.#fadeWrapper.classList.add('fades-out')// style.animation = 'fadeOpacityOut 0.5s ease-out forwards'
  }



  #worldSearchBox


  /**
   * the init function hooks up the backend to the frontend
   */
  init() {

    //    window.onload  = this.onResize.bind(this)

    const rules = document.getElementById('myCss').sheet.cssRules
    this.#ruleDestCard = Array.from(rules).find((rule) => rule.selectorText === '.dest-card')
    this.ruleWorldBanner = Array.from(rules).find((rule) => rule.selectorText === '.world-banner')
    // this.ruleFadesIn = Array.from(rules).find((rule) => rule.selectorText === '.fades-in')
    this.#worldBanner = document.querySelector('.world-banner')
    this.#worldSearchBox = document.getElementById('world-search-box')
    this.#worldSearchBox.addEventListener('keypress', (e) => { if (e.key == 'Enter') {location='/'}}  )

    window.addEventListener('resize', this.onResize.bind(this), true)

    /*
    console.log(database.isInitialized())

    let user = database.currentUser()
    let userValidated = !!user && user.emailVerified
*/

    this.#cardHolder = document.getElementById('world-card-holder')
    //this.#worldSearchBox = document.getElementById('world-search-box')
    this.#goToTop = document.getElementById('go-to-top')
    this.#goToTop.onclick = function () {
      window.scrollTo({ top: 0, left: 0, behavior: 'smooth' })
    }

    /*
    const auth = getAuth()
    onAuthStateChanged(auth, (user) => {
      this.customizeForUser(user)
    })
      */

    let gameCardHtml = ''

    appData.getPlaces().forEach((p, i) => {
      gameCardHtml += this.addGameCard(p)
    })

    this.#cardHolder.innerHTML = gameCardHtml

    this.onResize()
  }
}

const world = (window.__world = new World())
//world.init()

export { world }
