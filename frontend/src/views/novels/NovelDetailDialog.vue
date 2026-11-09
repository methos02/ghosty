<script setup>
import { computed, ref, watch, onMounted } from 'vue'
import { t, route, router } from '@/services/shortcuts/services-shortcut.js'
import { ChapterController } from '@/apis/chapters/controllers/chapter-controller.js'
import { useNovelStore } from '@/core-vue/stores/novels/novel-store.js'
import { useNovelDetail } from '@/core-vue/composables/novels/use-novel-detail.js'
import { useChapterStore } from '@/core-vue/stores/chapters/chapter-store.js'
import { useNovelDetailHead } from '@/head/use-novel-detail-head.js'
import DialogComponent from '@/components/DialogComponent.vue'
import CommentThread from '@/views/comments/CommentThread.vue'
import { useCommentStore } from '@/core-vue/stores/comments/comment-store.js'
import { COMMENT_TARGETS } from '@/constants/comment-constants.js'
import { NOVEL_DETAIL_VIEWS } from '@/constants/novel-constants.js'
import { ajaxHelper } from '@/core/helpers/ajax-helper.js'

useNovelDetailHead()

const { selectedNovel, clearSelectedNovel, setSelectedNovelCommentCount } = useNovelStore()
const { commentCount } = useCommentStore()
const { novelDetail } = useNovelDetail()
const { mainBranch, currentChapter, setMainBranch, setCurrentChapter, clear } = useChapterStore()

const dialog = ref()
const isLoading = ref(false)
const errorMessage = ref('')
const currentView = ref(NOVEL_DETAIL_VIEWS.NOVEL)

const commentTarget = computed(() => ({
  type: COMMENT_TARGETS.NOVEL,
  novelSlug: selectedNovel.value.slug,
}))

watch(commentCount, count => {
  if (count === undefined || !selectedNovel.value) {
    return
  }

  setSelectedNovelCommentCount(count)
})

const showComments = () => {
  currentView.value = NOVEL_DETAIL_VIEWS.COMMENTS
}

const showNovel = () => {
  currentView.value = NOVEL_DETAIL_VIEWS.NOVEL
}

const selectNovel = async slug => {
  const response = await novelDetail.selectBySlug(slug)
  if (!ajaxHelper.isSuccess(response.status)) {
    errorMessage.value = response.error
  }

  return response.status
}

const showFirstChapter = () => {
  const first = mainBranch.value[0]
  if (!first) {
    return
  }

  setCurrentChapter(first)
}

const loadMainBranch = async () => {
  if (!selectedNovel.value) {
    return
  }

  isLoading.value = true
  errorMessage.value = ''

  const response = await ChapterController.mainBranch(selectedNovel.value.slug)

  if (!ajaxHelper.isSuccess(response.status)) {
    errorMessage.value = response.error
    isLoading.value = false
    return
  }

  setMainBranch(response.chapters)
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
  showNovel()

  if (dialog.value) {
    dialog.value.show()
  }

  const status = await selectNovel(slug)
  if (!ajaxHelper.isSuccess(status)) {
    return
  }

  await loadMainBranch()
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
  showNovel()

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
        v-if="selectedNovel && currentView === NOVEL_DETAIL_VIEWS.NOVEL"
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

          <div class="novel-detail-dialog__toolbar | d-flex a-center g-10">
            <button
              type="button"
              class="novel-detail-dialog__comments | btn btn-sm btn-primary-alt d-flex a-center g-5"
              :title="t('novel.comments')"
              :aria-label="t('novel.comments')"
              @click="showComments"
            >
              <i class="fa-solid fa-comments"></i>
              <span class="novel-detail-dialog__comment-count">
                {{ selectedNovel.commentCount }}
              </span>
            </button>
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

      <div
        v-if="selectedNovel && currentView === NOVEL_DETAIL_VIEWS.COMMENTS"
        class="novel-detail-dialog__comments-view | d-flex f-column g-15"
      >
        <button
          type="button"
          class="novel-detail-dialog__back | novel-detail-dialog__link | d-flex a-center g-5 fs-300 color-primary"
          @click="showNovel"
        >
          <i class="fa-solid fa-arrow-left"></i>
          {{ t('novel.back_to_novel') }}
        </button>

        <CommentThread
          :key="selectedNovel.slug"
          :target="commentTarget"
        />
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

  &__comments-view {
    max-height: calc(100dvh - 150px);
    overflow-y: auto;
    padding-right: 10px;
  }
}
</style>
