<script setup>
import { ref, watch, onMounted } from 'vue'
import { t, route, router } from '@/services/shortcuts/services-shortcut.js'
import { STATUS } from '@/constants/ajax-constants.js'
import { ChapterController } from '@/apis/chapters/controllers/chapter-controller.js'
import { useNovelStore } from '@/apis/novels/stores/novel-store.js'
import { useNovelDetail } from '@/apis/novels/composables/use-novel-detail.js'
import { useChapterStore } from '@/apis/chapters/stores/chapter-store.js'
import { useNovelDetailHead } from '@/head/use-novel-detail-head.js'
import DialogComponent from '@/components/DialogComponent.vue'

useNovelDetailHead()

const { selectedNovel, clearSelectedNovel } = useNovelStore()
const { novelDetail } = useNovelDetail()
const { currentBranch, currentChapter, setCurrentBranch, setCurrentChapter, clear } =
  useChapterStore()

const dialog = ref()
const isLoading = ref(false)
const errorMessage = ref('')

const selectNovel = async slug => {
  const response = await novelDetail.selectBySlug(slug)
  if (response.status !== STATUS.SUCCESS) {
    errorMessage.value = response.error
  }

  return response.status
}

const showFirstChapter = () => {
  const first = currentBranch.value[0]
  if (!first) {
    return
  }

  setCurrentChapter(first)
}

const loadCurrentBranch = async () => {
  if (!selectedNovel.value) {
    return
  }

  isLoading.value = true
  errorMessage.value = ''

  const response = await ChapterController.currentBranch(selectedNovel.value.slug)

  if (response.status !== STATUS.SUCCESS) {
    errorMessage.value = response.error
    isLoading.value = false
    return
  }

  setCurrentBranch(response.chapters)
  showFirstChapter()
  isLoading.value = false
}

const openForSlug = async slug => {
  if (!slug) {
    if (dialog.value) {
      dialog.value.close()
    }
    return
  }

  errorMessage.value = ''

  if (dialog.value) {
    dialog.value.show()
  }

  const status = await selectNovel(slug)
  if (status !== STATUS.SUCCESS) {
    return
  }

  await loadCurrentBranch()
}

const readCurrentChapter = async () => {
  await router.push({
    name: 'chapter-read',
    params: { slug: selectedNovel.value.slug, id: currentChapter.value.id },
  })
}

const exploreNovel = async () => {
  await router.push({
    name: 'multiverse',
    params: { slug: selectedNovel.value.slug },
    query: { from: currentChapter.value.id },
  })
}

const handleDialogClose = () => {
  clearSelectedNovel()
  clear()
  errorMessage.value = ''

  if (route.get('slug')) {
    router.push('/')
  }
}

onMounted(() => openForSlug(route.get('slug')))

watch(() => route.get('slug'), openForSlug)
</script>

<template>
  <DialogComponent
    ref="dialog"
    :title="selectedNovel?.title || ''"
    @dialog-close="handleDialogClose"
  >
    <div class="novel-detail-dialog | w-full">
      <div
        v-if="errorMessage && !selectedNovel"
        class="novel-detail-dialog__error | bg-danger-100 p-15 radius-10 color-danger"
      >
        {{ errorMessage }}
      </div>

      <div
        v-if="selectedNovel"
        class="novel-detail-dialog__content | d-flex g-20"
      >
        <div class="novel-detail-dialog__left">
          <div class="novel-detail-dialog__cover | overflow-clip radius-4">
            <img
              v-if="selectedNovel.coverUrl"
              :src="selectedNovel.coverUrl"
              :alt="selectedNovel.title"
              class="w-full h-full"
              style="object-fit: cover; object-position: center"
            />
            <div
              v-if="!selectedNovel.coverUrl"
              class="novel-detail-dialog__cover-placeholder | d-flex a-center j-center bg-neutral-200"
            >
              <i class="fa-solid fa-book fs-700 color-neutral-500"></i>
            </div>
          </div>

          <button
            type="button"
            class="novel-detail-dialog__explore | novel-detail-dialog__link | d-flex a-center g-5 fs-300 color-primary"
            @click="exploreNovel"
          >
            <i class="fa-solid fa-code-branch"></i>
            {{ t('common.explore_novel') }}
          </button>
        </div>

        <div class="novel-detail-dialog__right | d-flex f-column g-15">
          <div
            v-if="isLoading"
            class="d-flex j-center p-30"
          >
            <span>{{ t('novel.chapter_loading') }}</span>
          </div>

          <div
            v-if="!isLoading && currentChapter"
            class="novel-detail-dialog__chapter | d-flex f-column g-15"
          >
            <h3 class="fs-500 fw-400 color-neutral-900">
              {{ t('novel.chapter_summary', { chapter: currentChapter.title }) }}
            </h3>

            <div class="novel-detail-dialog__summary | fs-400 color-neutral-700">
              {{ currentChapter.summary }}
            </div>

            <div class="novel-detail-dialog__actions | d-flex j-center">
              <button
                type="button"
                class="novel-detail-dialog__read | btn btn-primary"
                @click="readCurrentChapter"
              >
                {{ t('novel.read_chapter') }}
              </button>
            </div>
          </div>

          <div
            v-if="!isLoading && errorMessage && !currentChapter"
            class="bg-danger-100 p-15 radius-10 color-danger"
          >
            {{ errorMessage }}
          </div>
        </div>
      </div>
    </div>
  </DialogComponent>
</template>

<style lang="scss">
@use '@/assets/scss/variables' as *;

.novel-detail-dialog {
  width: 100vw;
  max-width: 700px;

  &__content {
    align-items: stretch;
  }

  &__left {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
    width: 270px;
    flex-shrink: 0;
  }

  &__cover {
    width: 270px;
    height: 152px;
    position: relative;
  }

  &__cover-placeholder {
    width: 100%;
    height: 100%;
  }

  &__right {
    flex: 1;
    min-height: 200px;
  }

  &__chapter {
    flex: 1;
  }

  &__actions {
    margin-top: auto;
  }

  &__explore {
    margin-block: auto;
  }

  &__link {
    cursor: pointer;

    &:hover,
    &:focus-visible {
      text-decoration: underline;
    }
  }

  &__summary {
    line-height: 1.6;
    max-height: 150px;
    overflow-y: auto;

    p {
      margin: 0 0 10px 0;

      &:last-child {
        margin-bottom: 0;
      }
    }
  }

  &__error {
    margin-bottom: 15px;
  }
}
</style>
