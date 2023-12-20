<template>
  <div
    class="mb-3 flex w-full items-center justify-center gap-6 sm:gap-24 lg:gap-0"
  >
    <p>Lei Jin & Samuel Vanhaecke {{ $t('footer.for') }} MCT</p>
    <div class="py-2 lg:hidden">
      <select
        id="language"
        v-model="locale"
        class="block bg-transparent hover:cursor-pointer"
        name="language"
        @change="setLanguage"
      >
        <option
          v-for="(value, key) in SUPPORTED_LOCALES"
          :key="key"
          :value="key"
          @change="setLanguage"
        >
          {{
            value == 'Nederlands'
              ? 'NL'
              : value == 'Français'
                ? 'FR'
                : value == 'English'
                  ? 'EN'
                  : ''
          }}
        </option>
      </select>
    </div>
  </div>
</template>

<script setup lang="ts">
import { SUPPORTED_LOCALES } from '@/bootstrap/i18n'
import useLanguage from '@/composables/useLanguage'

const { setLocale, locale } = useLanguage()

const setLanguage = (e: Event): void => {
  const target = e.target as HTMLSelectElement
  setLocale(target.value)
  // console.log(target.value)
}
</script>
