<template>
  <!-- input -->
  <Field
    v-if="
      !['date', 'select', 'password', 'switch'].includes(field.type) &&
      !field.displayIf
    "
    class="bg-gray-50 border outline-none border-gray-300 text-gray-900 text-sm rounded-lg transition-colors duration-200 appearance-none hover:border-primary-green-400 block w-full p-2.5 focus:ring-primary-green-400/40 focus:ring-3"
    :class="{
      'border-primary-red border-1 hover:border-primary-red focus:ring-primary-red/40':
        error,
    }"
    :as="field.as"
    :id="field.name"
    :name="field.name"
    v-bind="field"
  >
  </Field>

  <!-- dropdown -->
  <Field
    v-if="field.type === 'select' && !field.displayIf"
    :name="field.name"
    v-slot="{ field:fieldProps, handleChange }"
  >
    <Dropdown
      :id="field.name"
      v-model="fieldProps.value"
      @change="handleChange($event.value, false)"
      :pt="{
        input: {
          class: [
            'placeholder-gray-900 placeholder-text-sm',
            'bg-gray-50 border border-gray-300 text-sm text-gray-900 rounded-lg hover:border-primary-green-400 transition-colors duration-200 appearance-none block w-full p-3 focus:ring-primary-green-400/40 focus:ring-3',
            {
              'border-primary-red border-1 hover:border-primary-red focus:ring-primary-red/40':
                error,
            },
          ],
        },
      }"
      v-bind="field"
    >
      <template #dropdownicon>
        <ChevronDownIcon />
      </template>
    </Dropdown>
  </Field>
</template>

<script setup lang="ts">
import { ChevronDownIcon } from 'lucide-vue-next'
import { Field } from 'vee-validate'

const props = defineProps({
  field: {
    type: Object,
    required: true,
  },
  error: {
    type: String,
  },
})
</script>
