<template>
  <Form
    @submit="handleForm($event)"
    v-slot="{ errors, setValues }"
    :validation-schema="validationSchema"
    :initial-values="initialValues"
    novalidate
  >
    <ul class="space-y-4">
      <li v-for="(field, index) in schema.fields" :key="index">
        <label
          v-if="shouldDisplay(field.displayIf, switchValue, reverseSwitch)"
          class="block mb-2 text-sm font-medium text-gray-900"
          :for="field.name"
          >{{ field.label }}</label
        >

        <DynamicField
          :field="field"
          :error="errors[field.name]"
          :minEndDate="minEndDate"
          :handleSetMinEndDate="
            (value: Date, link: string) => {
              minEndDate = value
              setValues({ [link]: value })
            }
          "
          :handleSetSwitchValue="
            (value: Object) => {
              switchValue = { ...value }
            }
          "
          :show="shouldDisplay(field.displayIf, switchValue, reverseSwitch)"
        />

        <ErrorMessage class="text-red-500 block text-sm" :name="field.name" />
      </li>
    </ul>

    <CustomButton
      class="flex ml-auto"
      :class="schema.button.class"
      :loading="loading"
      type="submit"
      :name="schema.button.name"
    />
  </Form>
</template>

<script setup lang="ts">
import CustomButton from '@/components/generic/CustomButton.vue'
import { ErrorMessage, Form, configure } from 'vee-validate'
import { onBeforeMount, ref } from 'vue'
import DynamicField from './DynamicField.vue'

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
  reverseSwitch: {
    type: Boolean,
    default: false,
  },
})

const minEndDate = ref<Date>()
const switchValue = ref()

// Check if field should be displayed
const shouldDisplay = (
  displayIf: string,
  switchValue: any,
  reverseSwitch: Boolean,
): boolean => {
  if (!displayIf) {
    return true
  }

  if (switchValue && displayIf === switchValue.name) {
    if (switchValue.value && reverseSwitch === false) {
      return true
    }

    if (switchValue.value === false && reverseSwitch === true) {
      return true
    }
  }

  return false
}

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
