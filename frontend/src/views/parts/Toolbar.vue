<script setup>
import { computed, onMounted, ref } from 'vue'
import DropdownComponent from '@/components/DropdownComponent.vue'
import { useNovelFilterStore } from '@/apis/novels/stores/novel-filter-store.js'
import { useNovelSearch } from '@/apis/novels/composables/use-novel-search.js'
import { GenreController } from '@/apis/genres/controllers/genre-controller.js'
import { STATUS } from '@/constants/ajax-constants.js'
import { t } from '@/services/shortcuts/services-shortcut.js'

const mode = defineModel('mode', {
  type: String,
  default: 'read',
})

const { genreId } = useNovelFilterStore()
const { novelSearch } = useNovelSearch()

const genreDropdown = ref()
const genres = ref([])

const genreItems = computed(() => [
  { id: undefined, label: t('toolbar.all_genres') },
  ...genres.value,
])

const currentGenreLabel = computed(
  () =>
    genreItems.value.find(genre => genre.id === genreId.value)?.label ?? t('toolbar.all_genres'),
)

const pickGenre = async genre => {
  genreDropdown.value?.hide()
  await novelSearch.filterByGenre(genre.id)
}

onMounted(async () => {
  const response = await GenreController.list()
  if (response.status !== STATUS.SUCCESS) {
    return
  }

  genres.value = response.genres
})
</script>

<template>
  <div class="toolbar | d-flex a-end j-center p-relative w-100">
    <div
      v-if="mode === 'read'"
      class="toolbar__side | left d-flex a-center g-10"
    >
      <span class="toolbar__label | color-neutral-100">
        {{ t('toolbar.sort') }}
      </span>
      <button
        type="button"
        disabled
        class="toolbar__dropdown toolbar__dropdown--disabled | bg-neutral-100 radius-10 d-flex a-center j-between px-5"
        :title="t('toolbar.sort_unavailable')"
      >
        <span class="toolbar__dropdown-text | fs-300 flex-1">
          {{ t('toolbar.sort_top') }}
        </span>
        <i class="toolbar__icon | fas fa-chevron-down d-flex a-center j-center"></i>
      </button>
    </div>

    <div class="toolbar__center | f-column">
      <div class="toolbar__modes | d-flex">
        <button
          class="toolbar__mode | flex-1 text-center pointer color-neutral-100 fs-600 fw-400 py-10"
          :class="{ 'toolbar__mode--active': mode === 'create' }"
          @click="mode = 'create'"
        >
          {{ t('toolbar.new_novel') }}
        </button>
        <button
          class="toolbar__mode | flex-1 text-center pointer color-neutral-100 fs-600 fw-400 py-10"
          :class="{ 'toolbar__mode--active': mode === 'read' }"
          @click="mode = 'read'"
        >
          {{ t('toolbar.read_continue') }}
        </button>
      </div>
    </div>

    <div
      v-if="mode === 'read'"
      class="toolbar__side | right d-flex a-center g-10"
    >
      <span class="toolbar__label | color-neutral-100">
        {{ t('toolbar.genre') }}
      </span>
      <DropdownComponent
        ref="genreDropdown"
        orientation="right"
      >
        <template #button>
          <button
            class="toolbar__dropdown | bg-neutral-100 bg-neutral-300-hover radius-10 d-flex a-center j-between px-5 pointer"
          >
            <span class="toolbar__dropdown-text | fs-300 flex-1">
              {{ currentGenreLabel }}
            </span>
            <i class="toolbar__icon | fas fa-chevron-down d-flex a-center j-center"></i>
          </button>
        </template>
        <template #items>
          <div class="dropdown-menu">
            <button
              v-for="genre in genreItems"
              :key="genre.label"
              class="dropdown-item | py-5 px-10 pointer"
              :class="{ 'dropdown-item--active': genreId === genre.id }"
              @click="pickGenre(genre)"
            >
              {{ genre.label }}
            </button>
          </div>
        </template>
      </DropdownComponent>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.toolbar {
  &__side {
    height: 40px;
    width: 232px;
    padding-inline: 16px;
    background-color: rgba(0, 0, 0, 0.8);

    &.left {
      border-radius: 10px 0 0 0;
      justify-content: flex-end;
    }
    &.right {
      border-radius: 0 10px 0 0;
      justify-content: flex-start;
    }
  }

  &__label {
    font-size: 16px;
    line-height: 24px;
    opacity: 0.9;
    white-space: nowrap;
  }

  &__dropdown {
    height: 24px;
    width: 125px;
    border: none;
    transition: background-color 0.3s;

    &--disabled {
      opacity: 0.55;
      cursor: not-allowed;
    }
  }

  &__dropdown-text {
    text-align: left;
  }

  &__icon {
    font-size: 12px;
    width: 16px;
    height: 16px;
  }

  &__center {
    width: 420px;
  }

  &__modes {
    height: 56px;
    border-radius: 10px 10px 0 0;
    overflow: hidden;
  }

  &__mode {
    border: none;
    background-color: var(--primary-700);
    color: rgba(255, 255, 255, 0.7);
    transition:
      background-color 0.3s,
      color 0.3s;

    &:hover {
      color: var(--neutral-100);
    }

    &--active,
    &--active:hover {
      background-color: var(--primary);
      color: var(--neutral-100);
    }
  }
}

.dropdown-menu {
  display: flex;
  flex-direction: column;
}

.dropdown-item {
  background: white;
  border: none;
  text-align: left;
  transition: background-color 0.2s;
  white-space: nowrap;

  &:hover {
    background-color: var(--neutral-200);
  }

  &--active {
    background-color: var(--primary-100);
    color: var(--primary-700);
    font-weight: 500;
  }
}
</style>
