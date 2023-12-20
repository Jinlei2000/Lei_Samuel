<template>
  <Form
    v-slot="{ errors, setValues }"
    :validation-schema="validationSchema"
    :initial-values="initialValues"
    novalidate
    @submit="handleForm($event)"
  >
    <ul class="space-y-4">
      <li v-for="(field, index) in schema.fields" :key="index">
        <label
          v-if="shouldDisplay(field.displayIf, switchValue, reverseSwitch)"
          class="mb-2 block text-sm font-medium text-gray-900"
          :for="field.name"
        >
          {{ $t(field.label!) }}
        </label>

        <DynamicField
          :field="field"
          :error="errors[field.name]"
          :min-end-date="minEndDate"
          :handle-set-min-end-date="
            (value: Date, link: string) => {
              minEndDate = value
              setValues({ [link]: value })
            }
          "
          :handle-set-switch-value="
            (value: Object) => {
              switchValue = { ...value }
            }
          "
          :show="shouldDisplay(field.displayIf, switchValue, reverseSwitch)"
        />
        <span
          v-if="errors[field.name]"
          class="capitalize-first block text-sm text-red-500"
        >
          {{ CapFirst($t(errors[field.name]!)) }}
        </span>
      </li>
    </ul>

    <div class="flex-end mt-3 flex justify-between">
      <CustomButton
        v-if="cancel"
        name="dynamic.form.button.cancel"
        variant="secondary"
        @click="cancel()"
      />
      <CustomButton
        class="ml-auto flex"
        :class="schema.button.class"
        :loading="loading"
        type="submit"
        :name="schema.button.name"
      />
    </div>
  </Form>
</template>

<script setup lang="ts">
import DynamicField from './DynamicField.vue'
import CustomButton from '@/components/generic/CustomButton.vue'
import { CapFirst } from '@/helpers/functions'
import { configure, Form } from 'vee-validate'
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
  cancel: {
    type: Function,
    required: false,
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
