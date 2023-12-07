<template>
  <div class="flex w-full flex-col">
    <div class="mb-2 flex items-center gap-3">
      <label class="block text-sm font-medium text-gray-900" :for="id">
        {{ label }}
      </label>
      <span v-if="error" class="block text-sm text-red-500">{{ error }}</span>
    </div>
    <input
      :id="id"
      :class="[
        'hover:border-primary-green-400 focus:ring-primary-green-400/40 focus:ring-3 block w-full appearance-none rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-black outline-none transition-colors duration-200',
        {
          'border-primary-red border-1 hover:border-primary-red focus:ring-primary-red/40':
            error,
        },
      ]"
      :name="name"
      :placeholder="placeholder"
      v-bind="fieldAttrs"
      type="text"
      :value="modelValue"
      @input="updateModelValue($event)"
    />
  </div>
</template>

<script setup lang="ts">
import { defineProps } from 'vue'

const props = defineProps({
  label: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  id: {
    type: String,
    required: true,
  },
  placeholder: {
    type: String,
  },
  error: {
    type: String,
  },
  fieldAttrs: {
    type: Object,
  },
  modelValue: {
    type: String,
  },
})

const updateModelValue = (event: Event) => {
  const target = event.target as HTMLInputElement
  const value = target.value
  emits('update:modelValue', value)
}

const emits = defineEmits(['update:modelValue'])
</script>
