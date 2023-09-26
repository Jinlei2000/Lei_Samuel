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
              class="py-1 focus:outline-none focus-visible:ring-4 ring-blue-400 font-semibold tracking-wide hover:text-green-400 hover:border-green-400"
              active-class="border-b-1 border-black"
              to="dashboard"
              >Home</RouterLink
            >
          </li>
          <li>
            <RouterLink
              class="py-2 rounded-md focus:outline-none focus-visible:ring-4 ring-blue-400 font-semibold tracking-wide hover:opacity-40"
              active-class="opacity-30"
              to="/tuin"
              >Mijn tuin</RouterLink
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
              class="bg-[#1A281D] rounded-full flex justify-center items-center py-3 px-6 text-white"
            >
              <span>
                <!-- lucide icon -->
                <Plus class="h-6 w-6" />
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
