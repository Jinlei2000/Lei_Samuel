<template>
  <div class="relative flex items-center gap-3">
    <!-- Display selected field label and sorting icons -->
    <div class="flex flex-row-reverse items-center justify-center gap-1">
      <p class="hidden sm:block">
        {{ selectedFieldLabel }}
      </p>
      <div>
        <ArrowDownWideNarrow
          v-if="isDescending"
          class="h-6 w-6"
          @click="toggleSortDirection"
        />
        <ArrowUpWideNarrow
          v-else-if="isAscending"
          class="h-6 w-6"
          @click="toggleSortDirection"
        />
      </div>
    </div>
    <!-- Sort button -->
    <div class="flex items-center gap-3">
      <button
        class="border-1 flex h-12 items-center gap-[6px] rounded-2xl border-black bg-transparent p-3 text-black"
        @click="toggleSortDropdown"
      >
        <ListFilter class="m-1 h-5 w-5" />
        <p class="m-0 text-lg">Sort</p>
        <ChevronDown
          :class="[
            'h-[22px] w-[22px] transition-all',
            sort ? 'rotate-180' : '',
          ]"
        />
      </button>
    </div>
    <!-- Sort dropdown -->
    <div
      v-show="sort"
      :class="[
        'border-1 absolute right-0 top-16 z-50 flex gap-12 rounded-2xl border-black bg-gray-200 px-12 py-6',
        'transition-all duration-200',
        sort ? 'opacity-100' : 'pointer-events-none opacity-0 ',
      ]"
    >
      <div class="flex flex-col gap-3">
        <ul class="flex flex-col gap-3">
          <li
            v-for="(option, index) in options"
            :key="index"
            class="flex items-center gap-2"
          >
            <input
              :id="option.value"
              class="before:content[''] before:bg-blue-gray-500 checked:bg-primary-green checked:border-primary-green checked:before:bg-primary-green peer relative h-4 w-4 cursor-pointer appearance-none rounded-full border border-black transition-all before:absolute before:left-2/4 before:top-2/4 before:block before:h-12 before:w-12 before:-translate-x-2/4 before:-translate-y-2/4 before:rounded-full before:opacity-0 before:transition-opacity hover:before:opacity-10"
              type="radio"
              name="sort"
              :modelValue="modelValue!.field"
              :checked="modelValue!.field === option.value"
              :value="option.value"
              @change="updateSortField(option.value)"
            />
            <div
              class="pointer-events-none absolute translate-x-0.5 text-white opacity-0 transition-opacity peer-checked:opacity-100"
            >
              <Check class="h-3 w-3" />
            </div>
            <label :for="option.value">{{ option.label }}</label>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ORDER_DIRECTION } from '@/helpers/constants'
import { ArrowUpWideNarrow } from 'lucide-vue-next'
import { ChevronDown } from 'lucide-vue-next'
import { Check } from 'lucide-vue-next'
import { ListFilter } from 'lucide-vue-next'
import { ArrowDownWideNarrow } from 'lucide-vue-next'
import { computed, type PropType, ref } from 'vue'

// props
const props = defineProps({
  modelValue: {
    type: Object as PropType<{
      field: string
      direction: string
    }>,
  },
  options: {
    type: Array as PropType<
      {
        value: string
        label: string
      }[]
    >,
  },
})

// variables
// show dropdown
const sort = ref(false)
const selectedFieldLabel = computed(
  () =>
    props.modelValue!.field.charAt(0).toUpperCase() +
    props.modelValue!.field.slice(1),
)

// sorting direction
const isDescending = computed(
  () => props.modelValue!.direction === ORDER_DIRECTION.DESC,
)
const isAscending = computed(
  () => props.modelValue!.direction === ORDER_DIRECTION.ASC,
)

// toggle the sorting direction
const toggleSortDirection = () => {
  props.modelValue!.direction = isDescending.value
    ? ORDER_DIRECTION.ASC
    : ORDER_DIRECTION.DESC
}

// logics
const toggleSortDropdown = () => {
  sort.value = !sort.value
}

const updateSortField = (field: string) => {
  props.modelValue!.field = field
  toggleSortDropdown()
}
</script>
