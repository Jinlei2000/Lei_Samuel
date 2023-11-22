<template>
  <Form
    @submit="handleForm($event)"
    v-slot="{ errors }"
    :validation-schema="materialValidationSchema"
    :initial-values="{
      isLoan: true,
    }"
    novalidate
  >
    <ul class="space-y-4">
      <!-- name -->
      <li key="name">
        <label class="block mb-2 text-sm font-medium text-gray-900" for="name"
          >Name</label
        >
        <Field
          class="bg-gray-50 border outline-none border-gray-300 text-gray-900 text-sm rounded-lg transition-colors duration-200 appearance-none hover:border-primary-green-400 block w-full p-2.5 focus:ring-primary-green-400/40 focus:ring-3"
          :class="{
            'border-primary-red border-1 hover:border-primary-red focus:ring-primary-red/40':
              errors['name'],
          }"
          as="input"
          id="name"
          name="name"
          type="text"
          placeholder="Forklift"
        >
        </Field>
        <ErrorMessage class="text-red-500 block text-sm" name="name" />
      </li>
      <!-- serialNumber -->
      <li key="serialNumber">
        <label
          class="block mb-2 text-sm font-medium text-gray-900"
          for="serialNumber"
          >Serial Number</label
        >
        <Field
          class="bg-gray-50 border outline-none border-gray-300 text-gray-900 text-sm rounded-lg transition-colors duration-200 appearance-none hover:border-primary-green-400 block w-full p-2.5 focus:ring-primary-green-400/40 focus:ring-3"
          :class="{
            'border-primary-red border-1 hover:border-primary-red focus:ring-primary-red/40':
              errors['serialNumber'],
          }"
          as="input"
          id="serialNumber"
          name="serialNumber"
          type="text"
          placeholder="123456789"
        >
        </Field>
        <ErrorMessage class="text-red-500 block text-sm" name="serialNumber" />
      </li>
      <!-- isLoan -->
      <li key="isLoan">
        <label class="block mb-2 text-sm font-medium text-gray-900" for="isLoan"
          >Is Loan</label
        >
        <Field name="isLoan" v-slot="{ field, handleChange }">
          <InputSwitch
            id="isLoan"
            v-model="field.value"
            @input="
              $event => {
                switchInput = !$event
                handleChange($event, false)
              }
            "
            :class="{
              'border-primary-red border-1 hover:border-primary-red focus:ring-primary-red/40':
                errors['isLoan'],
            }"
          />
        </Field>
        <ErrorMessage class="text-red-500 block text-sm" name="isLoan" />
      </li>
      <!-- user -->
      <li v-if="switchInput" key="userId">
        <label class="block mb-2 text-sm font-medium text-gray-900" for="user"
          >User</label
        >
        <Field name="userId" v-slot="{ field, handleChange }">
          <Dropdown
            id="userId"
            placeholder="Select a user"
            :options="users"
            optionLabel="fullname"
            optionValue="id"
            v-model="field.value"
            editable
            @change="handleChange($event.value, false)"
            :pt="{
              input: {
                class: [
                  'placeholder-gray-900 placeholder-text-sm',
                  'bg-gray-50 border border-gray-300 text-sm text-gray-900 rounded-lg hover:border-primary-green-400 transition-colors duration-200 appearance-none block w-full p-3 focus:ring-primary-green-400/40 focus:ring-3',
                  {
                    'border-primary-red border-1 hover:border-primary-red focus:ring-primary-red/40':
                      errors['user'],
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
        <ErrorMessage class="text-red-500 block text-sm" name="user" />
      </li>
    </ul>

    <CustomButton
      class="flex ml-auto"
      :loading="loading.create"
      type="submit"
      name="Create Material"
    />
  </Form>
</template>

<script setup lang="ts">
import CustomButton from '@/components/generic/CustomButton.vue'
import { materialValidationSchema } from '@/validation/schema'
import { Eye } from 'lucide-vue-next'
import { EyeOff } from 'lucide-vue-next'
import { CalendarIcon, ChevronDownIcon } from 'lucide-vue-next'
import InputSwitch from 'primevue/inputswitch'
import { ErrorMessage, Form, Field, configure } from 'vee-validate'
import { onBeforeMount, ref } from 'vue'

const props = defineProps({
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
const switchValue = ref()

// Set switchValue before mounting
onBeforeMount(() => {
  if (props.initialValues && props.schema) {
    const name =
      props.schema.fields.find((field: any) => field.type === 'switch')?.name ||
      ''
    const value = props.initialValues[name] ?? false
    switchValue.value = {
      name: name,
      value: value,
    }
  }
})

// Default values
configure({
  validateOnBlur: false, // controls if `blur` events should trigger validation with `handleChange` handler
  validateOnChange: false, // controls if `change` events should trigger validation with `handleChange` handler
  validateOnInput: false, // controls if `input` events should trigger validation with `handleChange` handler
  validateOnModelUpdate: false, // controls if `update:modelValue` events should trigger validation with `handleChange` handler
})
</script>
