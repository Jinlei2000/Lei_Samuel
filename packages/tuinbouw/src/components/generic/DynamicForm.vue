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
          class="bg-gray-50 border outline-none border-gray-300 text-gray-900 text-sm rounded-lg hover:border-primary-green-400 transition-colors duration-200 appearance-none hover:border-primary-green-400 block w-full p-2.5 focus:ring-primary-green-400/40 focus:ring-3"
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
            @change="handleType($event, handleChange)"
          >
            <template #dropdownicon>
              <ChevronDownIcon />
            </template>
          </Dropdown>
        </Field>

        <ErrorMessage class="block text-red-500" :name="name" />
      </li>
    </ul>

    <CustomButton :loading="loading" type="submit" :name="schema.button.name" />
  </Form>
</template>

<script setup lang="ts">
import CustomButton from '@/components/generic/CustomButton.vue'
import { ChevronDownIcon } from 'lucide-vue-next'
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
  console.log(value)
  handleChange(value, false)
}
</script>
