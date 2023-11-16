<template>
  <Form
    @submit="handleForm($event)"
    v-slot="{ errors }"
    :validation-schema="validationSchema"
    :initial-values="initialValues"
    novalidate
  >
    <ul class="space-y-4">
      <li
        v-for="{ as, name, label, type, options, ...attrs } in schema.fields"
        :key="name"
      >
        <label
          class="block mb-2 text-sm font-medium text-gray-900"
          :for="name"
          >{{ label }}</label
        >
        <!-- input -->
        <Field
          v-if="!['date', 'select', 'password', 'date-range'].includes(type)"
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

        <!-- dropdown -->
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
          >
            <template #dropdownicon>
              <ChevronDownIcon />
            </template>
          </Dropdown>
        </Field>

        <!-- date -->
        <Field
          v-if="type === 'date'"
          :name="name"
          v-slot="{ field, handleChange }"
        >
          <!-- :minDate="attrs.minDate" -->
          <Calendar
            :id="name"
            :manualInput="false"
            :minDate="attrs.setMinEndDate ? minEndDate : attrs.minDate"
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
            v-model="field.value"
            @date-select="
              $event => {
                // Set minEndDate to the selected date if setMinEndDate is true
                // This is used to set the minEndDate of the end date field
                if (!attrs.setMinEndDate) minEndDate = $event
                handleChange($event, false)
              }
            "
          >
            <template #dropdownicon>
              <CalendarIcon class="h-5 w-5" />
            </template>
          </Calendar>
        </Field>

        <!-- password with toggle -->
        <div v-if="type === 'password'" class="relative">
          <Field
            class="bg-gray-50 border outline-none border-gray-300 text-gray-900 text-sm rounded-lg transition-colors duration-200 appearance-none hover:border-primary-green-400 block w-full p-2.5 focus:ring-primary-green-400/40 focus:ring-3"
            :class="{
              'border-primary-red border-1 hover:border-primary-red focus:ring-primary-red/40':
                errors[name],
            }"
            :as="as"
            :id="name"
            :name="name"
            :type="passwordVisible ? 'text' : 'password'"
            v-bind="attrs"
          >
          </Field>
          <button
            type="button"
            class="absolute inset-y-0 right-0 flex items-center px-3"
            @click="passwordVisible = !passwordVisible"
          >
            <Eye class="stroke-gray-900" v-if="!passwordVisible" />
            <EyeOff class="stroke-gray-900" v-else />
          </button>
        </div>

        <ErrorMessage class="text-red-500 block text-sm" :name="name" />
      </li>
    </ul>

    <CustomButton
      class="flex ml-auto"
      :loading="loading"
      type="submit"
      :name="schema.button.name"
    />
  </Form>
</template>

<script setup lang="ts">
import CustomButton from '@/components/generic/CustomButton.vue'
import { Eye } from 'lucide-vue-next'
import { EyeOff } from 'lucide-vue-next'
import { CalendarIcon, ChevronDownIcon } from 'lucide-vue-next'
import { ErrorMessage, Form, Field, configure } from 'vee-validate'
import { ref } from 'vue'

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

const passwordVisible = ref(false)
const minEndDate = ref()

// Default values
configure({
  validateOnBlur: false, // controls if `blur` events should trigger validation with `handleChange` handler
  validateOnChange: false, // controls if `change` events should trigger validation with `handleChange` handler
  validateOnInput: false, // controls if `input` events should trigger validation with `handleChange` handler
  validateOnModelUpdate: false, // controls if `update:modelValue` events should trigger validation with `handleChange` handler
})
</script>
