<template>
  <div class="flex flex-col w-full">
    <div class="flex gap-3 mb-2 items-center">
      <label class="block text-sm font-medium text-gray-900" :for="name">{{
        name
      }}</label>
      <span class="text-red-500 block text-sm">
        {{ errorMessage }}
      </span>
    </div>
    <input
      class="bg-gray-50 border outline-none border-gray-300 text-black text-sm rounded-lg transition-colors duration-200 appearance-none hover:border-primary-green-400 block w-full p-2.5 focus:ring-primary-green-400/40 focus:ring-3"
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
