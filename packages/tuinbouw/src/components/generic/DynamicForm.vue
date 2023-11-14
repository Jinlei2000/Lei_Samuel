<template>
  <Form
    @submit="handleForm($event)"
    v-slot="{ errors }"
    :validation-schema="validationSchema"
    :initial-values="initialValues"
    novalidate
  >
    <ul
      v-for="{ as, name, label, type, options, ...attrs } in schema.fields"
      :key="name"
    >
      <li>
        <label
          class="block mb-2 text-sm font-medium text-gray-900"
          :for="name"
          >{{ label }}</label
        >
        <!-- TODO: use toggle password & add custom date component -->
        <Field
          v-if="type !== 'date' && type !== 'select'"
          class="bg-gray-50 border outline-none border-gray-300 text-gray-900 text-sm rounded-lg transition-colors duration-200 appearance-none hover:border-primary-green-400 block w-full p-2.5 focus:ring-primary-green-400/40 focus:ring-3"
          :class="{
            'border-primary-red border-1 hover:border-primary-red focus:ring-primary-red/40':
              errors[name],
          }"
          :as="as"
          :id="name"
          :name="name"
          v-bind="attrs"
        >
        </Field>

        <Field
          v-if="type === 'select'"
          :name="name"
          v-slot="{ field, handleChange }"
        >
          <Dropdown
            :id="name"
            :placeholder="attrs.placeholder"
            :options="options"
            optionLabel="name"
            optionValue="name"
            v-model="field.value"
            @change="handleChange($event.value, false)"
            :pt="{
              // root: {
              //   class: [
              //     'bg-gray-50 border border-gray-300 text-sm text-gray-900 rounded-lg hover:border-primary-green-400 transition-colors duration-200 appearance-none focus:ring-primary-green-400/40 focus:ring-3',
              //   ],
              // },
              input: {
                class: [
                  'placeholder-gray-900 placeholder-text-sm',
                  'bg-gray-50 border border-gray-300 text-sm text-gray-900 rounded-lg hover:border-primary-green-400 transition-colors duration-200 appearance-none block w-full p-3 focus:ring-primary-green-400/40 focus:ring-3',
                  {
                    'border-primary-red border-1 hover:border-primary-red focus:ring-primary-red/40':
                      errors[name],
                  },
                ],
              },
            }"
            unstyled
          >
            <template #dropdownicon>
              <ChevronDownIcon />
            </template>
          </Dropdown>
        </Field>

        <Field
          v-if="type === 'date'"
          :name="name"
          v-slot="{ field, handleChange }"
        >
          <Calendar
            :id="name"
            :manualInput="false"
            :minDate="attrs.minDate"
            showIcon
            dateFormat="yy-mm-dd"
            :placeholder="attrs.placeholder"
            :pt="{
              input: {
                class: [
                  'placeholder-gray-900 placeholder-text-sm',
                  'bg-gray-50 border border-gray-300 text-sm text-gray-900 rounded-lg hover:border-primary-green-400 transition-colors duration-200 appearance-none hover:border-primary-green-400 block w-full p-3 focus:ring-primary-green-400/40 focus:ring-3',
                  {
                    'border-primary-red border-1 hover:border-primary-red focus:ring-primary-red/40':
                      errors[name],
                  },
                ],
              },
            }"
            unstyled
            v-model="field.value"
            @date-select="handleChange($event, false)"
          >
            <template #dropdownicon>
              <CalendarIcon class="h-5 w-5" />
            </template>
          </Calendar>
        </Field>

        <ErrorMessage class="text-red-500 block" :name="name" />
      </li>
    </ul>

    <CustomButton :loading="loading" type="submit" :name="schema.button.name" />
  </Form>
</template>

<script setup lang="ts">
import CustomButton from '@/components/generic/CustomButton.vue'
import { CalendarIcon, ChevronDownIcon } from 'lucide-vue-next'
import type { DropdownChangeEvent } from 'primevue/dropdown'
import { ErrorMessage, Form, Field, configure } from 'vee-validate'

defineProps({
  schema: {
    type: Object,
    required: true,
  },
  initialValues: {
    type: Object,
  },
  validationSchema: {
    type: Object,
    required: true,
  },
  handleForm: {
    type: Function,
    required: true,
  },
  loading: {
    type: Boolean,
    default: false,
  },
})

// Default values
configure({
  validateOnBlur: false, // controls if `blur` events should trigger validation with `handleChange` handler
  validateOnChange: false, // controls if `change` events should trigger validation with `handleChange` handler
  validateOnInput: false, // controls if `input` events should trigger validation with `handleChange` handler
  validateOnModelUpdate: false, // controls if `update:modelValue` events should trigger validation with `handleChange` handler
})

const handleType = (event: DropdownChangeEvent, handleChange: Function) => {
  // @ts-ignore
  const value = event.value
  handleChange(value, false)
}
</script>
