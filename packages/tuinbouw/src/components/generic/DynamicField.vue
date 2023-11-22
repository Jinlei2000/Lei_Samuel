<template>
  <!-- input -->
  <Field
    v-if="
      !['date', 'select', 'password', 'switch'].includes(field.type) && show
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
    v-if="field.type === 'select' && show"
    :name="field.name"
    v-slot="{ field: fieldProps, handleChange }"
  >
    <Dropdown
      :id="field.name"
      :placeholder="field.placeholder"
      :options="field.options"
      :optionLabel="field.optionLabel ?? 'name'"
      :optionValue="field.optionValue ?? 'name'"
      v-model="fieldProps.value"
      :editable="field.editable ?? false"
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

  <!-- date -->
  <Field
    v-if="field.type === 'date' && show"
    :name="field.name"
    v-slot="{ field: fieldProps, handleChange }"
  >
    <Calendar
      :id="field.name"
      :manualInput="false"
      :minDate="field.setMinEndDate ? minEndDate : field.minDate"
      showIcon
      dateFormat="yy-mm-dd"
      :placeholder="field.placeholder"
      :pt="{
        root: {
          class: ['w-full'],
        },
        input: {
          class: [
            'placeholder-gray-900 placeholder-text-sm',
            'bg-gray-50 border border-gray-300 text-sm text-gray-900 rounded-lg hover:border-primary-green-400 transition-colors duration-200 appearance-none hover:border-primary-green-400 focus:ring-primary-green-400/40 focus:ring-3',
            {
              'border-primary-red border-1 hover:border-primary-red focus:ring-primary-red/40':
                error,
            },
          ],
        },
      }"
      v-model="fieldProps.value"
      @date-select="
        $event => {
          // Set minEndDate to the selected date if setMinEndDate is true
          // This is used to set the minEndDate of the end date field
          if (!field.setMinEndDate) {
            handleSetMinEndDate($event, field.linkName)
          }

          handleChange($event, false)
        }
      "
      v-bind="field"
    >
      <template #dropdownicon>
        <CalendarIcon class="h-5 w-5" />
      </template>
    </Calendar>
  </Field>

  <!-- password with toggle -->
  <div v-if="field.type === 'password'" class="relative">
    <Field
      class="bg-gray-50 border outline-none border-gray-300 text-gray-900 text-sm rounded-lg transition-colors duration-200 appearance-none hover:border-primary-green-400 block w-full p-2.5 focus:ring-primary-green-400/40 focus:ring-3"
      :class="{
        'border-primary-red border-1 hover:border-primary-red focus:ring-primary-red/40':
          error,
      }"
      :as="field.as"
      :id="field.name"
      :name="field.name"
      :type="passwordVisible ? 'text' : 'password'"
      v-bind="field"
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

  <!-- switch -->
  <Field
    v-if="field.type === 'switch'"
    :name="field.name"
    v-slot="{ field: fieldProps, handleChange }"
  >
    <InputSwitch
      :id="field.name"
      v-model="fieldProps.value"
      @input="
        $event => {
          // Set switchValue to the selected value
          handleSetSwitchValue({ name: field.name, value: $event })
          handleChange($event, false)
        }
      "
      :class="{
        'border-primary-red border-1 hover:border-primary-red focus:ring-primary-red/40':
          error,
      }"
    />
  </Field>
</template>

<script setup lang="ts">
import { CalendarIcon } from 'lucide-vue-next'
import { Eye } from 'lucide-vue-next'
import { EyeOff } from 'lucide-vue-next'
import { ChevronDownIcon } from 'lucide-vue-next'
import { Field } from 'vee-validate'
import { ref } from 'vue'

const props = defineProps({
  field: {
    type: Object,
    required: true,
  },
  error: {
    type: String,
  },

  minEndDate: {
    type: Date,
  },
  handleSetMinEndDate: {
    type: Function,
    required: true,
  },

  handleSetSwitchValue: {
    type: Function,
    required: true,
  },
  show: {
    type: Boolean,
    required: true,
  },
})

const passwordVisible = ref(false)
</script>
