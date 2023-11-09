import type { Coordinate } from '@/interfaces/coordinate.interface'
import tt from '@tomtom-international/web-sdk-maps'

const TOMTOM_API_KEY = import.meta.env.VITE_TOMTOM_API_KEY
const baseUrl = 'https://api.tomtom.com/'

// use Fuzzy Search to find an address
const searchAddress = async (address: string): Promise<Coordinate[] | null> => {
  console.log('searchAddress', address)
  const query = encodeURIComponent(address)
  const url = `${baseUrl}search/2/search/${query}.json?limit=5&key=${TOMTOM_API_KEY}`

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
    // center: [3.689423, 50.872478],
    // zoom: 7,
    boxZoom: true,
  })
  map.addControl(new tt.FullscreenControl())
  // map.addControl(new tt.NavigationControl())

  return map
}

const createMarker = (
  map: tt.Map,
  {
    lng,
    lat,
  }: {
    lng: number
    lat: number
  },
): tt.Marker => {
  // custom marker
  const svg =
    '<svg class="fill-primary-green-400" viewBox="0 0 24 24"><path fill-rule="evenodd" d="M11.291 21.706 12 21l-.709.706zM12 21l.708.706a1 1 0 0 1-1.417 0l-.006-.007-.017-.017-.062-.063a47.708 47.708 0 0 1-1.04-1.106 49.562 49.562 0 0 1-2.456-2.908c-.892-1.15-1.804-2.45-2.497-3.734C4.535 12.612 4 11.248 4 10c0-4.539 3.592-8 8-8 4.408 0 8 3.461 8 8 0 1.248-.535 2.612-1.213 3.87-.693 1.286-1.604 2.585-2.497 3.735a49.583 49.583 0 0 1-3.496 4.014l-.062.063-.017.017-.006.006L12 21zm0-8a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" clip-rule="evenodd"/></svg>'

  const customMarker = document.createElement('div')
  customMarker.className = 'h-8 w-8'
  customMarker.innerHTML = svg

  const marker = new tt.Marker({ element: customMarker })
    .setLngLat([lng, lat])
    .addTo(map)

  return marker
}

export default () => {
  return {
    searchAddress,
    createMap,
    createMarker,
  }
}
