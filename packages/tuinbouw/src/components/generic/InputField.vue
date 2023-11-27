<template>
  <div class="flex w-full flex-col">
    <div class="mb-2 flex items-center gap-3">
      <label class="block text-sm font-medium text-gray-900" :for="name">{{
        name
      }}</label>
      <span class="block text-sm text-red-500">
        {{ errorMessage }}
      </span>
    </div>
    <input
      :id="name"
      class="hover:border-primary-green-400 focus:ring-primary-green-400/40 focus:ring-3 block w-full appearance-none rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-black outline-none transition-colors duration-200"
      :class="{
        'border-primary-red border-1 hover:border-primary-red focus:ring-primary-red/40':
          errorMessage,
      }"
      :name="name"
      :placeholder="placeholder"
      :value="modelValue"
      :type="type"
      @input="
        $emit('update:modelValue', ($event.target as HTMLInputElement)?.value)
      "
    />
  </div>
</template>

<script setup lang="ts">
// props
const props = defineProps({
  name: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  placeholder: {
    type: String,
  },
  errorMessage: {
    type: String,
  },
  modelValue: {
    type: Object,
  },
})

// emits
const emits = defineEmits(['update:modelValue'])
</script>
