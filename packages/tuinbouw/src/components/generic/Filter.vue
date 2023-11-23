<template>
  <!-- Filter button -->
  <div class="flex items-center gap-3">
    <button
      class="group bg-transparent p-3 h-12 rounded-2xl flex items-center gap-[6px] border-black border-1 text-black"
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
    :class="[
      'absolute flex flex-col gap-3 top-16 z-50 bg-gray-200 rounded-2xl border-1 border-black py-6 px-12',
      'transition-all duration-200',
      isDropdownOpen ? 'opacity-100' : 'opacity-0 pointer-events-none ',
    ]"
    v-show="isDropdownOpen"
  >
    <div
      class="flex flex-col gap-3"
      v-for="(option, index) in options"
      :key="index"
    >
      <button class="text-left text-lg" @click="toggleAccordion(index)">
        {{ option.title }}
      </button>
      <div class="flex flex-col gap-3" v-show="isAccordionsOpen[index - 1]">
        <div v-for="(inputOption, index) in option.options" :key="index">
          <!-- Radio button -->
          <label
            class="flex gap-2 items-center relative"
            v-if="option.type === 'radio'"
          >
            <input
              class="before:content[''] peer relative h-4 w-4 cursor-pointer appearance-none rounded-full border border-black transition-all before:absolute before:top-2/4 before:left-2/4 before:block before:h-12 before:w-12 before:-translate-y-2/4 before:-translate-x-2/4 before:rounded-full before:bg-blue-gray-500 before:opacity-0 before:transition-opacity checked:bg-primary-green checked:border-primary-green checked:before:bg-primary-green hover:before:opacity-10"
              type="radio"
              :value="inputOption.value"
              :name="option.name"
              :id="inputOption.value"
              v-model="filters[option.name]"
              @change="updateFiltersRadio(inputOption.value, option.options)"
            />
            <span
              class="pointer-events-none absolute translate-x-0.5 text-white opacity-0 transition-opacity peer-checked:opacity-100"
            >
              <Check class="h-3 w-3" />
            </span>
            {{ inputOption.label }}
          </label>
          <!-- TODO: ADD Checkbox -->
          <div v-if="option.type === 'checkbox'">CHECK</div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { Filter as FilterIcon, Check } from 'lucide-vue-next'
import { ChevronDown } from 'lucide-vue-next'
import { ref, type PropType, onBeforeMount } from 'vue'

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
  })
  // set all accordions to false
  isAccordionsOpen.value = props.options!.map(() => false)
})

const updateFiltersRadio = (
  value: string,
  options: { label: string; value: string }[],
) => {
  // clear all filters
  options.map(option => {
    const index = props.modelValue!.indexOf(option)
    props.modelValue!.splice(index, 1)
  })

  // check if value is empty
  if (value === '') {
    return
  }

  // add filter
  props.modelValue!.push(value)
}

const updateFiltersCheckbox = (value: string) => {}

const toggleAccordion = (index: number) => {
  isAccordionsOpen.value[index - 1] = !isAccordionsOpen.value[index - 1]
}

const toggleFilterDropdown = () => {
  isDropdownOpen.value = !isDropdownOpen.value
}
</script>
