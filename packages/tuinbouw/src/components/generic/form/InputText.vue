<template>
  <label
    class="mb-1 block text-sm font-medium text-gray-900 dark:text-white"
    :for="name"
    >{{ name }}</label
  >
  <div class="relative">
    <InputText
      v-if="inputType === 'text' || inputType === 'password'"
      :id="name"
      :type="type === 'password' ? (visible ? 'text' : 'password') : type"
      :placeholder="placeholder"
      :class="{
        'border-primary-red border-1 hover:border-primary-red focus:ring-primary-red/40':
          errorMessage,
      }"
      :value="modelValue"
      @input="
        $emit('update:modelValue', ($event.target as HTMLInputElement)?.value)
      "
      @blur="$emit('blur')"
    />
    <button
      type="button"
      class="absolute inset-y-0 right-0 flex items-center px-3"
      v-if="inputType === 'password'"
      @click="visible = !visible"
    >
      <Eye class="stroke-gray-900" v-if="!visible" />
      <EyeOff class="stroke-gray-900" v-else />
    </button>
  </div>
  <small class="p-error" id="text-error">{{ errorMessage || '&nbsp;' }}</small>
</template>

<script setup lang="ts">
import { EyeOff, Eye } from 'lucide-vue-next'
import InputText from 'primevue/inputtext'
import { ref } from 'vue'

const visible = ref(false)

defineProps({
  name: String,
  type: String,
  placeholder: String,
  inputType: {
    type: String,
    default: 'text',
  },
  modelValue: String,
  errorMessage: String,
})

const emit = defineEmits(['update:modelValue', 'blur'])
</script>
