<script setup>
import { computed, ref, watch, onMounted } from 'vue'
import { t, route, router } from '@/services/shortcuts/services-shortcut.js'
import { STATUS } from '@/constants/ajax-constants.js'
import { NovelController } from '@/apis/novels/controllers/novel-controller.js'
import { ChapterController } from '@/apis/chapters/controllers/chapter-controller.js'
import { useNovelStore } from '@/apis/novels/stores/novel-store.js'
import { useChapterStore } from '@/apis/chapters/stores/chapter-store.js'
import { useNovelDetailHead } from '@/head/use-novel-detail-head.js'
import DialogComponent from '@/components/DialogComponent.vue'
import { useAuthStore } from '@/services/auth/src/auth-store.js'
import PaginatorChapterComponent from '@/components/paginators/PaginatorChapterComponent.vue'

useNovelDetailHead()

const authStore = useAuthStore()
const { selectedNovel, setSelectedNovel, clearSelectedNovel } = useNovelStore()
const { currentContinuity, currentChapter, setCurrentContinuity, setCurrentChapter, clear } =
  useChapterStore()

const dialog = ref()
const currentChapterNumber = ref(1)
const isLoading = ref(false)
const errorMessage = ref('')

const ensureNovel = async slug => {
  if (selectedNovel.value?.slug === slug) {
    return STATUS.SUCCESS
  }

  const response = await NovelController.getBySlug(slug)
  if (response.status !== STATUS.SUCCESS) {
    errorMessage.value = response.error
    return response.status
  }

  setSelectedNovel(response.novel)
  return STATUS.SUCCESS
}

const showChapterAt = chapterNumber => {
  const chapter = currentContinuity.value[chapterNumber - 1]
  if (!chapter) {
    return
  }

  setCurrentChapter(chapter)
  currentChapterNumber.value = chapterNumber
}

const loadCurrentContinuity = async () => {
  if (!selectedNovel.value) {
    return
  }

  isLoading.value = true
  errorMessage.value = ''

  const response = await ChapterController.currentContinuity(selectedNovel.value.slug)

  if (response.status !== STATUS.SUCCESS) {
    errorMessage.value = response.error
    isLoading.value = false
    return
  }

  setCurrentContinuity(response.chapters)
  showChapterAt(1)
  isLoading.value = false
}

const openForSlug = async slug => {
  if (!slug) {
    if (dialog.value) {
      dialog.value.close()
    }
    return
  }

  currentChapterNumber.value = 1
  errorMessage.value = ''

  if (dialog.value) {
    dialog.value.show()
  }

  const status = await ensureNovel(slug)
  if (status !== STATUS.SUCCESS) {
    return
  }

  await loadCurrentContinuity()
}

const handleChapterChange = ({ chapter }) => {
  if (chapter === currentChapterNumber.value) {
    return
  }
  showChapterAt(chapter)
}

const readCurrentChapter = () => {}

const canCorrectCurrentChapter = computed(
  () =>
    currentChapter.value?.isCorrectable === true &&
    currentChapter.value?.author?.id === authStore.user.value?.id,
)

const correctCurrentChapter = async () => {
  await router.push({ name: 'chapter-edit', params: { id: currentChapter.value.id } })
}

const continueCurrentChapter = async () => {
  await router.push({
    name: 'chapter-write',
    params: { slug: selectedNovel.value.slug, parentId: currentChapter.value.id },
  })
}

const handleDialogClose = () => {
  clearSelectedNovel()
  clear()
  currentChapterNumber.value = 1
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

          <PaginatorChapterComponent
            v-if="currentContinuity.length > 0"
            :currentChapter="currentChapterNumber"
            :totalChapters="currentContinuity.length"
            @p-chapter="handleChapterChange"
          />
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
            class="d-flex f-column g-15"
          >
            <h3 class="fs-500 fw-400 color-neutral-900">
              Résumé - {{ currentChapterNumber }}. {{ currentChapter.title }}
            </h3>

            <div class="novel-detail-dialog__summary | fs-400 color-neutral-700">
              {{ currentChapter.summary }}
            </div>

            <div class="d-flex f-wrap j-center g-10">
              <button
                type="button"
                class="btn btn-primary"
                @click="readCurrentChapter"
              >
                Lire ce chapitre
              </button>
              <button
                type="button"
                class="novel-detail-dialog__continue | btn btn-primary-alt"
                @click="continueCurrentChapter"
              >
                {{ t('novel.continue_chapter') }}
              </button>
              <button
                v-if="canCorrectCurrentChapter"
                type="button"
                class="novel-detail-dialog__correct | btn btn-primary-alt"
                @click="correctCurrentChapter"
              >
                {{ t('novel.correct_chapter') }}
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
    align-items: flex-start;
  }

  &__left {
    display: flex;
    flex-direction: column;
    gap: 16px;
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
