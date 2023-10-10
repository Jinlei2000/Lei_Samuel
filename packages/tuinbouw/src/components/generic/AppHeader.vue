<template>
  <Container class="py-12"
    ><header class="flex items-center justify-between">
      <RouterLink
        class="flex items-center space-x-4 hover:opacity-30 focus:outline-none focus-visible:ring-4 ring-blue-400 rounded-lg"
        to="/"
      >
        <Logo class="h-10" />
      </RouterLink>

      <nav>
        <ul class="flex items-center space-x-12">
          <li>
            <RouterLink
              class="rounded-full text-primary py-3 px-6 hover:text-gray-200 hover:bg-primary-green"
              active-class="text-gray-200 bg-primary-green"
              to="dashboard"
              >Dashboard</RouterLink
            >
          </li>
          <li>
            <RouterLink
              class="py-2 rounded-full focus:outline-none text-primary focus-visible:ring-4 ring-blue-400 font-semibold tracking-wide hover:opacity-40"
              active-class="opacity-30"
              to="/tuin"
              >Materials</RouterLink
            >
          </li>
          <li>
            <RouterLink
              class="py-2 rounded-md focus:outline-none focus-visible:ring-4 ring-blue-400 font-semibold tracking-wide hover:opacity-40"
              active-class="opacity-30"
              to="/profile"
              >Profile</RouterLink
            >
          </li>
          <li>
            <button
              class="bg-[#1A281D] rounded-full flex justify-center gap-[16px] items-center py-[16px] pl-[16px] pr-[32px] text-white"
            >
              <span class="bg-white rounded-full">
                <!-- lucide icon -->
                <Plus class="h-6 w-6" color="black" />
              </span>
              Afspraak
            </button>
          </li>
        </ul>
      </nav>
    </header></Container
  >
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Plus } from 'lucide-vue-next'

import Container from '../wrapper/Container.vue'
import Logo from '../Logo.vue'

const user = ref<Object | null>(null)
</script>
