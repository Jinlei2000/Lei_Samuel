<template>
  <div class="h-full w-full" id="map" ref="mapRef"></div>
</template>

<script setup lang="ts">
import useTomTomMap from '@/composables/useTomTomMap'
import { onMounted, ref, type PropType } from 'vue'
import tt from '@tomtom-international/web-sdk-maps'

// Props
const props = defineProps({
  // The locations to show on the map
  coordinates: {
    type: Array as PropType<
      {
        lat: number
        lng: number
      }[]
    >,
  },
})

const mapRef = ref('')

const { createMap, createMarker } = useTomTomMap()

onMounted(() => {
  const map = createMap(mapRef.value)

  // Show markers for each location & add to bounds
  if (props.coordinates) {
    const bounds = new tt.LngLatBounds()
    props.coordinates.forEach(c => {
      createMarker(map, {
        lat: c.lat,
        lng: c.lng,
      })

      bounds.extend(new tt.LngLat(c.lng, c.lat))
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
})
</script>
