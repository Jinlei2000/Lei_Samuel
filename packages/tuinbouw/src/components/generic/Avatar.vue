<template>
  <div v-bind="$attrs">
    <img
      v-if="user.url"
      :src="user.url"
      :class="`w-${imgSize} h-${imgSize} rounded-full`"
      alt="Profile picture"
    />
    <div
      v-else
      :class="`w-${imgSize} h-${imgSize} bg-primary-green flex items-center justify-center rounded-full`"
    >
      <p
        :class="[
          'font-medium text-white',
          imgSize > 12 ? 'text-4xl' : 'text-lg',
        ]"
      >
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
  imgSize: {
    type: Number,
    default: 12,
  },
})
</script>
