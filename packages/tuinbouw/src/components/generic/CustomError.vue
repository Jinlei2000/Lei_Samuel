<template>
  <div
    v-bind="$attrs"
    class="rounded border border-red-400 bg-red-100 p-3 text-sm text-red-600"
  >
    {{ CapFirst($t(error)) }}
  </div>
</template>

<script setup lang="ts">
import { CapFirst } from '@/helpers/functions'

// props
const props = defineProps({
  error: {
    type: String,
    required: true,
  },
})
</script>
