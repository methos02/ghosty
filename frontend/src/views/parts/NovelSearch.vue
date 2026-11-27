<script setup>
import { ref } from 'vue'
import { t } from '@/services/shortcuts/services-shortcut.js'
import { useNovelFilterStore } from '@/core-vue/stores/novels/novel-filter-store.js'
import { useNovelSearch } from '@/core-vue/composables/novels/use-novel-search.js'

const { search } = useNovelFilterStore()
const { novelSearch } = useNovelSearch()

const term = ref(search.value)

const submit = async () => {
  await novelSearch.search(term.value)
}

const clear = async () => {
  term.value = ''
  await novelSearch.search('')
}
</script>

<template>
  <form
    @submit.prevent="submit"
    class="novel-search | d-flex g-10 w-xl px-20 pt-30"
  >
    <div class="novel-search__field | d-flex a-center flex-1 bg-neutral-200 radius-10 px-15">
      <i class="fas fa-magnifying-glass color-neutral-500"></i>
      <input
        v-model="term"
        type="search"
        name="search"
        class="novel-search__input | flex-1 px-10 py-10"
        :placeholder="t('novel_search.placeholder')"
      />
      <button
        v-if="term !== ''"
        type="button"
        @click="clear"
        class="novel-search__clear | pointer color-neutral-500"
        :title="t('novel_search.clear')"
      >
        <i class="fas fa-xmark"></i>
      </button>
    </div>

    <button
      type="submit"
      class="novel-search__submit | btn btn-primary"
    >
      {{ t('novel_search.submit') }}
    </button>
  </form>
</template>

<style lang="scss" scoped>
@use '@/assets/scss/variables';

.novel-search {
  margin: 0 auto;
  max-width: 1200px;

  &__field,
  &__input {
    min-width: 0;
  }

  &__input {
    border: none;
    background-color: transparent;
    outline: none;
  }

  @media (max-width: variables.$sm) {
    gap: 0;

    &__field {
      border-radius: 10px 0 0 10px;
    }

    &__submit {
      border-radius: 0 10px 10px 0;
    }
  }

  &__clear {
    border: none;
    background-color: transparent;
  }
}
</style>
