<script setup>
import Dropdown from '@brugmann/vuemann/src/components/DropdownComponent.vue'
import { locales } from '@brugmann/vuemann/src/config/locale-config.js'
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { t } from '@brugmann/vuemann/src/services/services-helper.js'
import { localeFunctions } from '@brugmann/vuemann/src/services/locale/locale-functions.js'

const dropdown = ref()
const { locale } = useI18n({ useScope: 'global' })

const changeLocale = async new_locale => {
  localStorage.setItem('locale', new_locale)
  globalThis.dispatchEvent(new CustomEvent('locale-changed', { detail: new_locale }))

  await localeFunctions.loadLocaleMessages(new_locale)
  locale.value = new_locale
  dropdown.value.hide()
}
</script>

<template>
  <Dropdown
    ref="dropdown"
    orientation="right"
    class="locale-dropdown"
  >
    <template v-slot:button>
      <button id="locale-dropdown-button" type="button" class="p-10 radius-5 bg-primary-300-hover pointer color-neutral-100 fw-2rem">
        {{ locale.toUpperCase() }} 
        <i class="fa-solid fa-chevron-down ml-10"></i>
      </button>
    </template>
    <template v-slot:items>
      <ul class="f-column g-5">
        <li v-for="(lang, initial) in locales" :key="initial">
          <button
            :id="`local-change-${initial}`"
            type="button"
            @click="changeLocale(initial)"
            class="pointer d-flex a-center g-10 w-100 link-bg py-5 px-10"
          >
            <img :src="`/images/vuemann/${initial}.png`" :alt="t('locale.lang_change', {lang})" />
            <span>{{ lang }}</span>
          </button>
        </li>
      </ul>
    </template>
  </Dropdown>
</template>

<style lang="scss">
.locale-dropdown [data-items] {
  width: max-content;
  padding-block: 3px;
}
</style>