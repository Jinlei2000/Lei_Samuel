<template>
  <label class="block mb-2 text-sm font-medium text-gray-900" :for="name">{{
    name
  }}</label>
  <input
    class="bg-gray-50 border outline-none border-gray-300 text-gray-900 text-sm rounded-lg transition-colors duration-200 appearance-none hover:border-primary-green-400 block w-full p-2.5 focus:ring-primary-green-400/40 focus:ring-3"
    :class="{
      'border-primary-red border-1 hover:border-primary-red focus:ring-primary-red/40':
        errorMessage,
    }"
    :id="name"
    :name="name"
    :placeholder="placeholder"
    :value="modelValue"
    :type="type"
    @input="
      $emit('update:modelValue', ($event.target as HTMLInputElement)?.value)
    "
  />
  <span class="text-red-500 block text-sm">
    {{ errorMessage }}
  </span>
</template>

<script setup lang="ts">
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
    type: String,
    required: true,
  },
})

const emit = defineEmits(['update:modelValue', 'blur'])
</script>
