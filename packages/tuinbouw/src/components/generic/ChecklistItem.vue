<template>
  <div
    class="w-full p-1 pl-4 bg-gray-200 rounded-2xl flex justify-between items-center"
    @click="toggleChecked"
  >
    <p class="text-lg">{{ material?.name }}</p>
    <div
      class="bg-white rounded-xl h-9 w-9 hover:cursor-pointer"
      v-if="!checked"
    />
    <div
      class="bg-primary-green flex items-center justify-center rounded-xl h-9 w-9 hover:cursor-pointer text-white"
      v-if="checked"
    >
      <Check :size="24" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, type PropType, watch } from 'vue'
import { Check } from 'lucide-vue-next'
import type { Material } from '@/interfaces/material.interface';

const checked = ref(false)

const props = defineProps({
  material: Object as PropType<Material>,
})

watch(() => props.material, (newProp, oldProp) => {
      // Reset the ref state when props change
      checked.value = false;
    });

const toggleChecked = () => {
  checked.value = !checked.value
  console.log(checked.value)
}
</script>
