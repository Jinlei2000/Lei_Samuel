// use Fuzzy Search to find an address
const searchAddress = async (address: string): Promise<any> => {
  const query = encodeURIComponent(address)
  const url = `https://api.tomtom.com/search/2/search/${query}.json?minFuzzyLevel=1&maxFuzzyLevel=2&view=Unified&relatedPois=off&key=${
    import.meta.env.VITE_TOMTOM_API_KEY
  }`

  return new Promise((resolve, reject) => {
    fetch(url)
      .then(response => response.json())
      .then(data => {
        console.log(data)
        const addresses = data.results.map((result: any) => {
          return {
            address: result.address.freeformAddress,
            position: {
              lat: result.position.lat,
              lng: result.position.lon,
            },
          }
        })

        resolve(addresses)
      })
      .catch(error => {
        reject(error)
      })
  })
}

export default () => {
  return {
    searchAddress,
  }
}
