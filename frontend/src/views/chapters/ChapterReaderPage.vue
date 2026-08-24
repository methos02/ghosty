<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import Header from '@/views/layout/HeaderComponent.vue'
import BranchBreadcrumb from '@/views/chapters/parts/BranchBreadcrumb.vue'
import ChapterEnd from '@/views/chapters/parts/ChapterEnd.vue'
import ReadingToolbar from '@/views/chapters/parts/ReadingToolbar.vue'
import { route, t } from '@/services/shortcuts/services-shortcut.js'
import { STATUS } from '@/constants/ajax-constants.js'
import { useReadingStore } from '@/apis/chapters/stores/reading-store.js'
import { useReadingSettingsStore } from '@/apis/chapters/stores/reading-settings-store.js'
import { useChapterReading } from '@/apis/chapters/composables/use-chapter-reading.js'
import { useReadingPosition } from '@/apis/chapters/composables/use-reading-position.js'
import { useWindowScrolled } from '@/core-vue/composables/use-window-scrolled.js'
import { useAuthStore } from '@/services/auth/src/auth-store.js'
import { correctionHelper } from '@/core/helpers/correction-helper.js'
import { readingSettingsHelper } from '@/core/helpers/reading-settings-helper.js'
import { useChapterHead } from '@/head/use-chapter-head.js'

useChapterHead()

const authStore = useAuthStore()
const { chapter, children } = useReadingStore()
const { settings, restore } = useReadingSettingsStore()
const { chapterReading } = useChapterReading()
const { position } = useReadingPosition()
const { isScrolled } = useWindowScrolled()

const currentRoute = route.current()
const isLoading = ref(false)
const errorMessage = ref('')

const novelSlug = computed(() => currentRoute.value.params.slug)
const chapterId = computed(() => Number(currentRoute.value.params.id))

const textStyle = computed(() => readingSettingsHelper.textStyle(settings.value))
const fontClass = computed(() => readingSettingsHelper.fontFamilyClass(settings.value.fontFamily))

const canCorrect = computed(() =>
  correctionHelper.isCorrectableBy(chapter.value, authStore.user.value?.id),
)

const load = async () => {
  if (chapter.value?.id === chapterId.value) {
    return
  }

  isLoading.value = true
  errorMessage.value = ''

  const response = await chapterReading.load(novelSlug.value, chapterId.value)
  if (response.status !== STATUS.SUCCESS) {
    errorMessage.value = response.error
  }

  isLoading.value = false
}

onMounted(() => {
  restore()

  return load()
})

watch(chapterId, load)
</script>

<template>
  <div
    class="chapter-reader-page | f-column"
    :class="{ 'reading-night': settings.nightMode }"
  >
    <div class="no-print">
      <Header />
    </div>

    <div
      class="reading-bar | no-print"
      :class="{ 'reading-bar--scrolled': isScrolled }"
    >
      <div class="chapter-reader-page__bar | px-20 d-flex f-column g-10">
        <ReadingToolbar />

        <BranchBreadcrumb />
      </div>
    </div>

    <div class="chapter-reader-page__body | pb-40 px-20 d-flex f-column g-20">
      <div
        v-if="isLoading"
        class="d-flex j-center p-30"
      >
        <span>{{ t('chapter_read.loading') }}</span>
      </div>

      <div
        v-if="errorMessage"
        class="chapter-reader-page__error | bg-danger-100 p-15 radius-10 color-danger"
      >
        {{ errorMessage }}
      </div>

      <template v-if="chapter">
        <article
          class="chapter-reader-page__chapter | reading-text d-flex f-column g-20"
          :class="fontClass"
          :style="textStyle"
        >
          <header class="d-flex f-column g-5 text-center">
            <span class="chapter-reader-page__number | fs-300 color-neutral-700">
              {{ t('chapter_read.chapter_number', { number: position }) }}
            </span>
            <h1 class="fs-700 fw-700">{{ chapter.title }}</h1>
            <span class="chapter-reader-page__author | fs-400 color-neutral-700">
              {{ t('common.by_author', { author: chapter.author.username }) }}
            </span>
            <span
              v-if="chapter.isDraft"
              class="chapter-reader-page__draft | badge badge-warning"
            >
              {{ t('chapter_read.draft') }}
            </span>
          </header>

          <p
            v-for="(paragraph, index) in chapter.paragraphs"
            :key="index"
            class="chapter-reader-page__paragraph"
          >
            {{ paragraph }}
          </p>
        </article>

        <div class="no-print">
          <ChapterEnd
            :novelSlug="novelSlug"
            :chapterId="chapter.id"
            :children="children"
            :canCorrect="canCorrect"
          />
        </div>
      </template>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.chapter-reader-page {
  min-height: 100vh;

  &__bar {
    margin: 0 auto;
    width: 100%;
    max-width: 90vw;
  }

  &__body {
    margin: 0 auto;
    width: 100%;
    max-width: 90vw;
    padding-top: 20px;
  }

  &__chapter {
    margin-inline: auto;
    width: 100%;
  }

  &__paragraph {
    line-height: 1.8;
    margin: 0;
    text-align: justify;
  }
}
</style>
