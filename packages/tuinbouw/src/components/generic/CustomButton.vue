<template>
  <button
    :type="type"
    class="relative rounded-md px-4 py-2"
    :class="
      [loading ? 'cursor-not-allowed opacity-50' : ''] && variant === 'primary'
        ? 'bg-primary-green text-white'
        : variant === 'secondary'
          ? 'bg-transparent border border-primary-green text-primary-green'
          : variant === 'warning'
            ? 'bg-primary-red text-white'
            : ''
    "
    :disabled="loading"
    v-bind="$attrs"
  >
    <span :class="loading ? 'invisible' : ''">
      {{ $t(name!) }}
    </span>
    <span
      v-if="loading"
      class="rotate absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
    >
      <Loader2 class="animate-spin" />
    </span>
  </button>
</template>

<script setup lang="ts">
import { Loader2 } from 'lucide-vue-next'
import type { PropType } from 'vue'

const props = defineProps({
  loading: Boolean,
  name: String,
  type: {
    type: String as PropType<'button' | 'submit' | 'reset'>,
    default: 'button',
  },
  variant: {
    type: String as PropType<'primary' | 'secondary' | 'warning'>,
    default: 'primary',
  },
})
</script>
