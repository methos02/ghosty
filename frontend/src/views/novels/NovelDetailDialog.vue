<script setup>
import { ref, watch } from 'vue'
import { t } from '@/services/shortcuts/services-shortcut.js'
import { STATUS } from '@/constants/ajax-constants.js'
import { WorkController } from '@/apis/works/controllers/work-controller.js'
import { useNovelStore } from '@/apis/novels/stores/novel-store.js'
import DialogComponent from '@/components/DialogComponent.vue'
import PaginatorChapterComponent from '@/components/paginators/PaginatorChapterComponent.vue'

const { selectedNovel, currentChapter, clearSelectedNovel, setCurrentChapter } = useNovelStore()

const dialog = ref()
const currentChapterNumber = ref(1)
const isLoading = ref(false)
const errorMessage = ref('')

const loadChapter = async (chapterNumber = 1) => {
  if (!selectedNovel.value) return

  isLoading.value = true
  errorMessage.value = ''

  const response = await WorkController.getChapterByOrder(selectedNovel.value.slug, chapterNumber)

  if (response.status !== STATUS.SUCCESS) {
    errorMessage.value = response.error
    isLoading.value = false
    return
  }

  setCurrentChapter(response.work)
  currentChapterNumber.value = chapterNumber
  isLoading.value = false
}

const handleChapterChange = ({ chapter }) => {
  if (chapter === currentChapterNumber.value) return
  loadChapter(chapter)
}

const readCurrentChapter = () => {
  console.log('Lire le chapitre:', currentChapter.value)
}

const handleDialogClose = () => {
  clearSelectedNovel()
  currentChapterNumber.value = 1
  errorMessage.value = ''
}

watch(selectedNovel, async (novel) => {
  if (!novel) {
    if (dialog.value) dialog.value.close()
    return
  }

  currentChapterNumber.value = 1
  errorMessage.value = ''

  if (dialog.value) dialog.value.show()
  await loadChapter(1)
})
</script>

<template>
  <DialogComponent
    ref="dialog"
    :title="selectedNovel?.title || ''"
    @dialog-close="handleDialogClose"
  >
    <div class="novel-detail-dialog | w-full">
      <div v-if="errorMessage && !selectedNovel" class="novel-detail-dialog__error | bg-danger-100 p-15 radius-10 color-danger">
        {{ errorMessage }}
      </div>

      <div v-if="selectedNovel" class="novel-detail-dialog__content | d-flex g-20">
        <div class="novel-detail-dialog__left">
          <div class="novel-detail-dialog__cover | overflow-clip radius-4">
            <img
              v-if="selectedNovel.coverUrl"
              :src="selectedNovel.coverUrl"
              :alt="selectedNovel.title"
              class="w-full h-full"
              style="object-fit: cover; object-position: center;"
            />
            <div
              v-if="!selectedNovel.coverUrl"
              class="novel-detail-dialog__cover-placeholder | d-flex a-center j-center bg-neutral-200"
            >
              <i class="fa-solid fa-book fs-700 color-neutral-500"></i>
            </div>
          </div>

          <PaginatorChapterComponent
            v-if="selectedNovel.chaptersCount > 0"
            :current-chapter="currentChapterNumber"
            :total-chapters="selectedNovel.chaptersCount"
            @p-chapter="handleChapterChange"
          />
        </div>

        <div class="novel-detail-dialog__right | d-flex f-column g-15">
          <div v-if="isLoading" class="d-flex j-center p-30">
            <span>{{ t('common.loading') }}</span>
          </div>

          <div v-if="!isLoading && currentChapter" class="d-flex f-column g-15">
            <h3 class="fs-500 fw-400 color-neutral-900">
              Résumé - {{ currentChapterNumber }}. {{ currentChapter.title }}
            </h3>

            <div class="novel-detail-dialog__summary | fs-400 color-neutral-700" v-html="currentChapter.content"></div>

            <button
              type="button"
              class="btn btn-primary | align-self-center"
              @click="readCurrentChapter"
            >
              Lire ce chapitre
            </button>
          </div>

          <div v-if="!isLoading && errorMessage && !currentChapter" class="bg-danger-100 p-15 radius-10 color-danger">
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
