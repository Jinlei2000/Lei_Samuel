<template>
  <div
    class="flex w-full items-center justify-between rounded-2xl bg-gray-200 p-1 pl-4"
    @click="toggleChecked"
  >
    <p class="text-lg">{{ material?.name }}</p>
    <div
      v-if="!checked"
      class="h-9 w-9 rounded-xl bg-white hover:cursor-pointer"
    />
    <div
      v-if="checked"
      class="bg-primary-green flex h-9 w-9 items-center justify-center rounded-xl text-white hover:cursor-pointer"
    >
      <Check :size="24" />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Material } from '@/interfaces/material.interface'
import { Check } from 'lucide-vue-next'
import { ref, watch, type PropType } from 'vue'

const checked = ref(false)

const props = defineProps({
  material: Object as PropType<Material>,
})

watch(
  () => props.material,
  (newProp, oldProp) => {
    // Reset the ref state when props change
    checked.value = false
  },
)

const toggleChecked = () => {
  checked.value = !checked.value
  console.log(checked.value)
}
</script>
