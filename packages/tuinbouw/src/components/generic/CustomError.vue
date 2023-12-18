<template>
  <div
    class="rounded border border-red-400 bg-red-100 p-3 text-sm text-red-600"
  >
    {{ $t(error) }}
  </div>
</template>

<script setup lang="ts">
// props
const props = defineProps({
  error: {
    type: String,
    required: true,
  },
})
</script>
