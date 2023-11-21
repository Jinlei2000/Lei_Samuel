<template>
  <div class="h-full w-full" id="map" ref="mapRef"></div>
</template>

<script setup lang="ts">
import useTomTomMap from '@/composables/useTomTomMap'
import { onMounted, ref, type PropType } from 'vue'
import tt from '@tomtom-international/web-sdk-maps'
import type { Location } from '@/interfaces/location.interface'

// Props
const props = defineProps({
  // The locations to show on the map
  locations: Array as PropType<Location[]>,
  controls: Boolean,
})

const mapRef = ref('')

const { createMap, createMarker } = useTomTomMap()

onMounted(() => {
  const map = createMap(mapRef.value)

  // Show markers for each location & add to bounds
  if (props.locations && props.locations.length > 0) {
    const bounds = new tt.LngLatBounds()
    props.locations.forEach(l => {
      createMarker(map, l)
      bounds.extend(new tt.LngLat(l.lng, l.lat))
    })

    // Get center of bounds
    const centerBounds = bounds.getCenter()
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

  // Add controls
  console.log(props.controls)
  if (props.controls) {
    map.addControl(new tt.FullscreenControl())
    map.addControl(new tt.GeolocateControl())
    // map.addControl(new tt.NavigationControl())
    // map.addControl(new tt.ScaleControl())
  }
})
</script>
