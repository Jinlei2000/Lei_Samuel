<template>
  <div>
    <label
      class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
      :for="props.label"
      >{{ props.label }}</label
    >
    <input
      class="border bg-gray-50 border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
      :id="props.label"
      :type="props.type === 'password' ? inputType : props.type"
      :placeholder="props.placeholder"
      v-model="value"
    />
    <button
      v-if="props.type === 'password'"
      class="border bg-gray-50 border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
      @click="toggle"
    >
      <Eye v-if="inputType === 'password'" />
      <EyeOff v-else />
    </button>
    <span v-if="props.error" class="text-red-600">{{ props.error }}</span>
  </div>
</template>

<script lang="ts">
import { Eye, EyeOff } from 'lucide-vue-next'
import { ref } from 'vue'

export default {
  props: {
    label: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: false,
      default: 'text',
    },
    placeholder: {
      type: String,
      required: false,
      default: '',
    },
    value: {
      type: String,
      required: true,
    },
    error: {
      type: String,
      required: false,
      default: '',
    },
  },
  setup(props) {
    const inputType = ref('password')
    const value = ref(props.value)

    const toggle = () => {
      if (inputType.value === 'password') {
        inputType.value = 'text'
      } else {
        inputType.value = 'password'
      }
    }
    return {
      props,

      inputType,
      value,
      toggle,
    }
  },
  components: {
    Eye,
    EyeOff,
  },
}
</script>
