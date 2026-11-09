<script setup>
import { router, t } from '@/services/shortcuts/services-shortcut.js'
import DropdownComponent from '@/components/DropdownComponent.vue'
import PaginatorChapter from '@/components/paginators/PaginatorChapterComponent.vue'
import ReadingSettingsPanel from '@/views/chapters/parts/ReadingSettingsPanel.vue'
import LikeButton from '@/views/chapters/parts/LikeButton.vue'
import FollowButton from '@/views/chapters/parts/FollowButton.vue'
import { useReadingStore } from '@/core-vue/stores/chapters/reading-store.js'
import { useReadingSettingsStore } from '@/core-vue/stores/chapters/reading-settings-store.js'
import { useReport } from '@/core-vue/composables/reports/use-report.js'
import { useChapterComments } from '@/core-vue/composables/comments/use-chapter-comments.js'
import { useNovelStore } from '@/core-vue/stores/novels/novel-store.js'
import { useReadingPosition } from '@/core-vue/composables/chapters/use-reading-position.js'

const { selectedNovel } = useNovelStore()
const { position, branchLength, isMainBranch, chapterIdAt } = useReadingPosition()
const { settings, setSetting, persist } = useReadingSettingsStore()
const { chapter } = useReadingStore()
const { report } = useReport()
const { openChapterComments } = useChapterComments()

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
    <div class="reading-toolbar__support | d-flex a-center g-10">
      <LikeButton v-if="chapter" />

      <FollowButton v-if="chapter && !chapter.isDraft" />

      <button
        v-if="chapter && !chapter.isDraft"
        type="button"
        class="reading-toolbar__comments | btn btn-sm btn-primary-alt d-flex a-center g-5"
        :title="t('reading_toolbar.comments')"
        :aria-label="t('reading_toolbar.comments')"
        @click="openChapterComments(chapter)"
      >
        <i class="fa-solid fa-comments"></i>
        <span class="reading-toolbar__comment-count">
          {{ chapter.commentCount }}
        </span>
      </button>

      <button
        v-if="chapter && report.canReport(chapter)"
        type="button"
        class="reading-toolbar__report | btn btn-icon btn-sm btn-primary-alt"
        :title="t('chapter_read.report')"
        :aria-label="t('chapter_read.report')"
        @click="report.openChapterReport(chapter)"
      >
        <i class="fa-solid fa-circle-exclamation"></i>
      </button>
    </div>

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
        v-if="isMainBranch"
        class="reading-toolbar__branch-label | badge badge-primary"
      >
        {{ t('reading_toolbar.popular_branch') }}
      </span>

      <span
        v-if="!isMainBranch"
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
  &__support,
  &__tools {
    flex: 1 1 0;
  }

  &__tools {
    justify-content: flex-end;
  }
}
</style>
