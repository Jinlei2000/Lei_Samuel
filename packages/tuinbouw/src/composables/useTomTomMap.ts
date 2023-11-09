import type { Coordinate } from '@/interfaces/coordinate.interface'

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

// make a marker

// show map
const showMap = () => {
  
}

export default () => {
  return {
    searchAddress,
  }
}
