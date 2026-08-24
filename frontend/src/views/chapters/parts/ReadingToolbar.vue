<script setup>
import { router, t } from '@/services/shortcuts/services-shortcut.js'
import DropdownComponent from '@/components/DropdownComponent.vue'
import PaginatorChapter from '@/components/paginators/PaginatorChapterComponent.vue'
import ReadingSettingsPanel from '@/views/chapters/parts/ReadingSettingsPanel.vue'
import { useReadingSettingsStore } from '@/apis/chapters/stores/reading-settings-store.js'
import { useNovelStore } from '@/apis/novels/stores/novel-store.js'
import { useReadingPosition } from '@/apis/chapters/composables/use-reading-position.js'

const { selectedNovel } = useNovelStore()
const { position, branchLength, isCurrentBranch, chapterIdAt } = useReadingPosition()
const { settings, setSetting, persist } = useReadingSettingsStore()

const goToPosition = async requestedPosition => {
  const targetId = chapterIdAt(requestedPosition)
  if (targetId === undefined) {
    return
  }

  await router.push({
    name: 'chapter-read',
    params: { slug: selectedNovel.value?.slug, id: targetId },
  })
}

const toggleNightMode = () => {
  setSetting('nightMode', !settings.value.nightMode)
  persist()
}

const print = () => {
  globalThis.print()
}
</script>

<template>
  <div class="reading-toolbar | d-flex f-wrap a-center j-between g-15">
    <router-link
      :to="{ name: 'novel-detail', params: { slug: selectedNovel?.slug } }"
      class="reading-toolbar__novel | d-flex a-center g-5 fs-300 color-neutral-700"
    >
      <i class="fa-solid fa-arrow-left"></i>
      {{ selectedNovel?.title }}
    </router-link>

    <div
      v-if="branchLength > 1"
      class="reading-toolbar__branch | d-flex f-column a-center g-5"
    >
      <PaginatorChapter
        :currentChapter="position"
        :totalChapters="branchLength"
        @p-chapter="goToPosition($event.chapter)"
      />

      <span
        v-if="isCurrentBranch"
        class="reading-toolbar__branch-label | badge badge-primary"
      >
        {{ t('reading_toolbar.popular_branch') }}
      </span>

      <span
        v-if="!isCurrentBranch"
        class="reading-toolbar__branch-label | badge badge-info"
      >
        {{ t('reading_toolbar.popular_branch_from_chapter') }}
      </span>
    </div>

    <div class="reading-toolbar__tools | d-flex a-center g-10">
      <DropdownComponent
        orientation="right"
        classes="overflow"
      >
        <template #button>
          <button
            type="button"
            class="reading-toolbar__settings | btn btn-icon btn-sm btn-primary-alt"
            :title="t('reading_settings.toggle')"
            :aria-label="t('reading_settings.toggle')"
          >
            <i class="fa-solid fa-font"></i>
          </button>
        </template>
        <template #items>
          <ReadingSettingsPanel />
        </template>
      </DropdownComponent>

      <button
        type="button"
        class="reading-toolbar__night | btn btn-icon btn-sm btn-primary-alt"
        :title="t('reading_settings.night_mode')"
        :aria-label="t('reading_settings.night_mode')"
        @click="toggleNightMode"
      >
        <i
          class="fa-solid"
          :class="settings.nightMode ? 'fa-sun' : 'fa-moon'"
        ></i>
      </button>

      <button
        type="button"
        class="reading-toolbar__print | btn btn-icon btn-sm btn-primary-alt"
        :title="t('reading_settings.print')"
        :aria-label="t('reading_settings.print')"
        @click="print"
      >
        <i class="fa-solid fa-print"></i>
      </button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.reading-toolbar {
  &__novel {
    text-decoration: none;
  }
}
</style>
