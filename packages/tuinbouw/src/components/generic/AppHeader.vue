<template>
  <Container class="py-12"
    ><header class="flex items-center justify-between">
      <RouterLink
        class="w-1/6 flex items-center space-x-4 focus:outline-none focus-visible:ring-4 ring-blue-400 hover:scale-105 transition-all rounded-lg"
        to="/"
      >
        <Logo />
      </RouterLink>
      <nav>
        <ul class="flex items-center justify-center">
          <li>
            <RouterLink
              class="rounded-full text-primary-green py-3 px-6 hover:text-gray-200 hover:bg-primary-green"
              active-class="text-gray-200! bg-primary-green"
              to="dashboard"
              >Dashboard</RouterLink
            >
          </li>
          <li>
            <RouterLink
              class="rounded-full text-primary-green py-3 px-6 hover:text-gray-200 hover:bg-primary-green"
              active-class="text-gray-200! bg-primary-green"
              to="/tuin"
              >Materials</RouterLink
            >
          </li>
          <!-- <li>
            <button
              class="bg-[#1A281D] rounded-full flex justify-center gap-[16px] items-center py-[16px] pl-[16px] pr-[32px] text-white"
            >
              <span class="bg-white rounded-full">
                <Plus class="h-6 w-6" color="black" />
              </span>
              Afspraak
            </button>
          </li> -->
        </ul>
      </nav>
      <div class="w-1/6 flex justify-end">
        <RouterLink class="rounded-full" to="/profile">
          <img
            class="rounded-full w-12 h-12 hover:scale-105 transition-all"
            src="https://i.pravatar.cc/300"
            alt="Profile picture"
        /></RouterLink>
      </div></header
  ></Container>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Plus } from 'lucide-vue-next'

import Container from '../wrapper/Container.vue'
import Logo from '../Logo.vue'

const user = ref<Object | null>(null)
</script>
