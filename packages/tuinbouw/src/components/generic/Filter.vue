<template>
  <!-- Filter button -->
  <div class="flex items-center gap-3">
    <button
      class="border-1 group flex h-12 items-center gap-[6px] rounded-2xl border-black bg-transparent p-3 text-black"
      @click="toggleFilterDropdown"
    >
      <FilterIcon class="h-5 w-5" />
      <p class="m-0 text-lg">Filter</p>
      <ChevronDown
        :class="[
          'h-[22px] w-[22px] transition-all',
          isDropdownOpen ? 'rotate-180' : '',
        ]"
      />
    </button>
  </div>
  <!-- Filter dropdown -->
  <section
    v-show="isDropdownOpen"
    :class="[
      'border-1 absolute top-16 z-50 flex flex-col gap-3 rounded-2xl border-black bg-gray-200 px-12 py-6',
      'transition-all duration-200',
      isDropdownOpen ? 'opacity-100' : 'pointer-events-none opacity-0 ',
    ]"
  >
    <div
      v-for="(option, index) in options"
      :key="index"
      class="flex flex-col gap-3"
    >
      <!-- Title -->
      <button
        class="flex items-center justify-between gap-6 text-left text-lg"
        @click="toggleAccordion(index)"
      >
        <p>{{ option.title }}</p>
        <ChevronDown
          :class="[
            'h-[22px] w-[22px] transition-all',
            isAccordionsOpen[index - 1] ? 'rotate-180' : '',
          ]"
        />
      </button>
      <!-- Options -->
      <div v-show="isAccordionsOpen[index - 1]" class="flex flex-col gap-3">
        <div v-for="(inputOption, index) in option.options" :key="index">
          <div class="relative flex items-center gap-2">
            <!-- Radio button -->
            <template v-if="option.type === 'radio'">
              <input
                :id="inputOption.value"
                v-model="filters[option.name]"
                class="before:content[''] before:bg-blue-gray-500 checked:bg-primary-green checked:border-primary-green checked:before:bg-primary-green peer relative h-4 w-4 cursor-pointer appearance-none rounded-full border border-black transition-all before:absolute before:left-2/4 before:top-2/4 before:block before:h-12 before:w-12 before:-translate-x-2/4 before:-translate-y-2/4 before:rounded-full before:opacity-0 before:transition-opacity hover:before:opacity-10"
                type="radio"
                :value="inputOption.value"
                :name="option.name"
                @change="updateFiltersRadio(option.options)"
              />
            </template>
            <!-- Checkbox -->
            <template v-else-if="option.type === 'checkbox'">
              <input
                :id="inputOption.value"
                v-model="filters[option.name]"
                className="relative peer shrink-0 appearance-none rounded-[4px] w-4 h-4 border-1 border-black bg-transparent checked:bg-primary-green checked:border-0"
                type="checkbox"
                :value="inputOption.value"
                :name="option.name"
                @change="updateFiltersCheckbox(option.name, option.options)"
              />
            </template>
            <span
              class="pointer-events-none absolute translate-x-0.5 text-white opacity-0 transition-opacity peer-checked:opacity-100"
            >
              <Check class="h-3 w-3" />
            </span>
            <label :for="inputOption.value">
              {{ inputOption.label }}
            </label>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { Check, Filter as FilterIcon } from 'lucide-vue-next'
import { ChevronDown } from 'lucide-vue-next'
import { onBeforeMount, type PropType, ref } from 'vue'

interface FilterOption {
  title: string
  name: string
  type: string
  options: { label: string; value: string }[]
}

// props
const props = defineProps({
  modelValue: {
    type: Array as PropType<any>,
  },
  options: {
    type: Array as PropType<FilterOption[]>,
  },
})

// variables
const isDropdownOpen = ref(false)
const filters = ref()
const isAccordionsOpen = ref<boolean[]>([])

// logics
// update modelValue
onBeforeMount(() => {
  props.options!.forEach(option => {
    if (option.type === 'radio') {
      filters.value = {
        ...filters.value,
        [option.name]: '',
      }
    }
    if (option.type === 'checkbox') {
      filters.value = {
        ...filters.value,
        [option.name]: [],
      }
    }
  })
  // set all accordions to false
  isAccordionsOpen.value = props.options!.map(() => false)
})

const updateFiltersRadio = (options: { label: string; value: string }[]) => {
  // clear all filters
  options.map(option => {
    const index = props.modelValue!.indexOf(option)
    props.modelValue!.splice(index, 1)
  })

  // get all filters from filters object
  let selectedFilters = Object.values(filters.value)

  // remove empty strings
  selectedFilters = selectedFilters.filter(filter => filter !== '')

  // add filters
  selectedFilters.forEach(filter => {
    props.modelValue!.push(filter)
  })
}

const updateFiltersCheckbox = (
  name: string,
  options: { label: string; value: string }[],
) => {
  // clear all filters
  options.map(option => {
    const index = props.modelValue!.indexOf(option)
    props.modelValue!.splice(index, 1)
  })

  // add filters
  filters.value[name].forEach((filter: string) => {
    props.modelValue!.push(filter)
  })
}

const toggleAccordion = (index: number) => {
  isAccordionsOpen.value[index - 1] = !isAccordionsOpen.value[index - 1]
}

const toggleFilterDropdown = () => {
  isDropdownOpen.value = !isDropdownOpen.value
}
</script>
