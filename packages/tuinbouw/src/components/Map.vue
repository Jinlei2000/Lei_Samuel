<template>
  <div
    :class="{
      'pointer-events-none': !props.controls,
    }"
    v-bind="$attrs"
  >
    <div id="map" ref="mapRef" class="h-full w-full"></div>
  </div>
</template>

<script setup lang="ts">
import useTomTomMap from '@/composables/useTomTomMap'
import type { Location } from '@/interfaces/location.interface'
import tt from '@tomtom-international/web-sdk-maps'
import LogRocket from 'logrocket'
import { watch } from 'vue'
import { onMounted, type PropType, ref } from 'vue'

// Props
const props = defineProps({
  // The locations to show on the map
  locations: Array as PropType<Location[]>,
  controls: Boolean,
})

const { createMap, createMarker } = useTomTomMap()

const mapRef = ref('')
let map: tt.Map

// Logics
onMounted(() => {
  setMap()
  setMarkers()
})

const setMap = () => {
  try {
    // Create map
    map = createMap(mapRef.value)

    // Add controls
    if (props.controls) {
      map.addControl(new tt.FullscreenControl())
      map.addControl(new tt.GeolocateControl())
      // map.addControl(new tt.NavigationControl())
      // map.addControl(new tt.ScaleControl())
    }
  } catch (error) {
    // console.log(error)
    LogRocket.captureException(error as Error)
  }
}

const setMarkers = () => {
  try {
    // Show markers for each location & add to bounds
    if (props.locations && props.locations.length > 0) {
      const bounds = new tt.LngLatBounds()
      props.locations.forEach(l => {
        createMarker(map, l)
        bounds.extend(new tt.LngLat(l.lng, l.lat))
      })

      // Get center of bounds
      const centerBounds = bounds.getCenter()

      if (centerBounds) {
        // Center map
        map.setCenter({
          lat: centerBounds.lat,
          lng: centerBounds.lng,
        })
        // Zoom to fit all markers
        map.fitBounds(bounds, {
          padding: 50,
          maxZoom: 13,
        })
      }
    } else {
      // No locations, center map on Belgium
      setMap()
    }
  } catch (error) {
    // console.log(error)
    LogRocket.captureException(error as Error)
  }
}

// watch props
watch(() => props.locations, setMarkers)
</script>
