<template>
  <!-- input -->
  <Field
    v-if="
      !['date', 'select', 'password', 'switch'].includes(field.type) && show
    "
    :id="field.name"
    class="hover:border-primary-green-400 focus:ring-primary-green-400/40 focus:ring-3 block w-full appearance-none rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 outline-none transition-colors duration-200"
    :class="{
      'border-primary-red border-1 hover:border-primary-red focus:ring-primary-red/40':
        error,
    }"
    :as="field.as"
    :name="field.name"
    :placeholder="$t(field.placeholder)"
  >
  </Field>

  <!-- dropdown -->
  <Field
    v-if="field.type === 'select' && show"
    v-slot="{ field: fieldProps, handleChange }"
    :name="field.name"
  >
    <Dropdown
      :id="field.name"
      v-model="fieldProps.value"
      :options="field.options"
      :placeholder="$t(field.placeholder)"
      :option-label="field.optionLabel ?? 'name'"
      :option-value="field.optionValue ?? 'name'"
      :editable="field.editable ?? false"
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
      @change="handleChange($event.value, false)"
    >
      <!-- <template #value="slotProps">
        <div v-if="slotProps.value">
          {{ $t(slotProps.value.name) }}
        </div>
        <span v-else>
          {{ slotProps.placeholder }}
        </span>
      </template> -->
      <template #option="slotProps">
        {{ $t(slotProps.option.name) }}
      </template>
      <template #dropdownicon>
        <ChevronDownIcon />
      </template>
    </Dropdown>
  </Field>

  <!-- date -->
  <Field
    v-if="field.type === 'date' && show"
    v-slot="{ field: fieldProps, handleChange }"
    :name="field.name"
  >
    <Calendar
      :id="field.name"
      v-model="fieldProps.value"
      :manual-input="false"
      :min-date="field.setMinEndDate ? minEndDate : field.minDate"
      show-icon
      date-format="yy-mm-dd"
      :placeholder="$t(field.placeholder)"
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
    >
      <template #dropdownicon>
        <CalendarIcon class="h-5 w-5" />
      </template>
    </Calendar>
  </Field>

  <!-- password with toggle -->
  <div v-if="field.type === 'password'" class="relative">
    <Field
      :id="field.name"
      class="hover:border-primary-green-400 focus:ring-primary-green-400/40 focus:ring-3 block w-full appearance-none rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 outline-none transition-colors duration-200"
      :class="{
        'border-primary-red border-1 hover:border-primary-red focus:ring-primary-red/40':
          error,
      }"
      :as="field.as"
      :name="field.name"
      :type="passwordVisible ? 'text' : 'password'"
      :placeholder="field.placeholder"
    >
    </Field>
    <button
      type="button"
      class="absolute inset-y-0 right-0 flex items-center px-3"
      @click="passwordVisible = !passwordVisible"
    >
      <Eye v-if="!passwordVisible" class="stroke-gray-900" />
      <EyeOff v-else class="stroke-gray-900" />
    </button>
  </div>

  <!-- switch -->
  <Field
    v-if="field.type === 'switch'"
    v-slot="{ field: fieldProps, handleChange }"
    :name="field.name"
  >
    <InputSwitch
      :id="field.name"
      v-model="fieldProps.value"
      :class="{
        'border-primary-red border-1 hover:border-primary-red focus:ring-primary-red/40':
          error,
      }"
      @input="
        $event => {
          // Set switchValue to the selected value
          handleSetSwitchValue({ name: field.name, value: $event })
          handleChange($event, false)
        }
      "
    />
  </Field>
</template>

<script setup lang="ts">
import { CalendarIcon, ChevronDownIcon, Eye, EyeOff } from 'lucide-vue-next'
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

// variables
const passwordVisible = ref(false)
</script>
