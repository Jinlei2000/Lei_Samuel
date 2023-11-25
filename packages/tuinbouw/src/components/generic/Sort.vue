<template>
  <div class="flex items-center gap-3 relative">
    <!-- Display selected field label and sorting icons -->
    <div class="flex flex-row-reverse items-center justify-center gap-1">
      <p>
        {{ selectedFieldLabel }}
      </p>
      <div>
        <ArrowDownWideNarrow
          v-if="isDescending"
          @click="toggleSortDirection"
          class="h-6 w-6"
        />
        <ArrowUpWideNarrow
          v-else-if="isAscending"
          @click="toggleSortDirection"
          class="h-6 w-6"
        />
      </div>
    </div>
    <!-- Sort button -->
    <div class="flex items-center gap-3">
      <button
        class="bg-transparent p-3 h-12 rounded-2xl flex items-center gap-[6px] border-black border-1 text-black"
        @click="toggleSortDropdown"
      >
        <ListFilter class="h-5 w-5 m-1" />
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
      :class="[
        'absolute flex gap-12 top-16 right-0 z-50 bg-gray-200 rounded-2xl border-1 border-black py-6 px-12',
        'transition-all duration-200',
        sort ? 'opacity-100' : 'opacity-0 pointer-events-none ',
      ]"
      v-show="sort"
    >
      <div class="flex flex-col gap-3">
        <ul class="flex flex-col gap-3">
          <li
            class="flex gap-2 items-center"
            v-for="(option, index) in options"
            :key="index"
          >
            <input
              class="before:content[''] peer relative h-4 w-4 cursor-pointer appearance-none rounded-full border border-black transition-all before:absolute before:top-2/4 before:left-2/4 before:block before:h-12 before:w-12 before:-translate-y-2/4 before:-translate-x-2/4 before:rounded-full before:bg-blue-gray-500 before:opacity-0 before:transition-opacity checked:bg-primary-green checked:border-primary-green checked:before:bg-primary-green hover:before:opacity-10"
              type="radio"
              name="sort"
              :modelValue="modelValue!.field"
              :checked="modelValue!.field === option.value"
              :value="option.value"
              :id="option.value"
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
import { ref, type PropType, computed } from 'vue'

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
