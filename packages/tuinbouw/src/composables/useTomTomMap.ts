import type { Location } from '@/interfaces/location.interface'
import tt from '@tomtom-international/web-sdk-maps'

const TOMTOM_API_KEY = import.meta.env.VITE_TOMTOM_API_KEY
const BASE_URL = 'https://api.tomtom.com/'
const SEARCH_LIMIT = 5

// use Fuzzy Search to find an address
const searchAddress = async (address: string): Promise<Location[] | null> => {
  console.log('searchAddress', address)
  const query = encodeURIComponent(address)
  const url = `${BASE_URL}search/2/search/${query}.json?limit=${SEARCH_LIMIT}&key=${TOMTOM_API_KEY}`

  return new Promise((resolve, reject) => {
    fetch(url)
      .then(response => response.json())
      .then(data => {
        let addresses = []
        if (data.results.length > 0) {
          addresses = data.results.map((result: any) => {
            return {
              address: result.address.freeformAddress,
              lat: result.position.lat,
              lng: result.position.lon,
            }
          })
        }

        resolve(addresses)
      })
      .catch(error => {
        reject(error)
      })
  })
}

const createMap = (mapContainer: string): tt.Map => {
  const map = tt.map({
    key: TOMTOM_API_KEY,
    container: mapContainer,
    // style: `https://api.tomtom.com/style/2/custom/style/dG9tdG9tQEBAbTQ4V1BvM3BHR0Jmb3dsZztjODYxMWY3YS1mNGNjLTQxM2UtOGUxNC0yZmMwMTQzMDI0ZmQ=.json?key=${TOMTOM_API_KEY}`,
    center: [3.689423, 50.872478],
    zoom: 7,
    boxZoom: true,
  })
  map.addControl(new tt.FullscreenControl())
  // map.addControl(new tt.NavigationControl())

  return map
}

const createMarker = (map: tt.Map, location: Location): tt.Marker => {
  // custom marker
  const customMarker = document.createElement('img')
  customMarker.src = '/public/assets/marker.svg'
  customMarker.className = 'h-8 w-8'

  // add marker
  const marker = new tt.Marker({ element: customMarker })
    .setLngLat([location.lng!, location.lat!])
    .addTo(map)

  const popupOptions = {
    // closeButton: false,
    offset: 35,
    className: 'rounded-lg',
  }

  // add popup with toggle
  const popup = new tt.Popup(popupOptions).setHTML(
    `<p class="pt-1 text-xs font-medium">${location.address}</p>`,
  )
  marker.setPopup(popup)

  return marker
}

export default () => {
  return {
    searchAddress,
    createMap,
    createMarker,
  }
}
