<template>
  <div v-bind="$attrs">
    <img
      v-if="user.url"
      :src="user.url"
      class="object-cover"
      alt="user avatar"
    />
    <div
      v-else
      class="bg-primary-green flex h-full w-full items-center justify-center"
    >
      <p class="font-medium text-white">
        {{ user.firstname[0].toUpperCase() }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { CustomUser } from '@/interfaces/custom.user.interface'
import type { PropType } from 'vue'

// props
const props = defineProps({
  user: {
    type: Object as PropType<CustomUser>,
    required: true,
  },
})
</script>
