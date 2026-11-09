<script setup>
import { computed, onMounted, ref } from 'vue'
import Header from '@/views/layout/HeaderComponent.vue'
import ModerationDecisionForm from '@/views/moderation/parts/ModerationDecisionForm.vue'
import PassageRemovalEditor from '@/views/moderation/parts/PassageRemovalEditor.vue'
import ModerationReportList from '@/views/moderation/parts/ModerationReportList.vue'
import ModerationRestoreButton from '@/views/moderation/parts/ModerationRestoreButton.vue'
import ModerationSanctionHistory from '@/views/moderation/parts/ModerationSanctionHistory.vue'
import { route, t } from '@/services/shortcuts/services-shortcut.js'
import { ModerationController } from '@/apis/moderation/controllers/moderation-controller.js'
import { REPORTED_CONTENT_TYPES, RESOLUTIONS } from '@/constants/moderation-constants.js'
import { useModerationHead } from '@/head/use-moderation-head.js'
import { ajaxHelper } from '@/core/helpers/ajax-helper.js'

useModerationHead()

const chapterId = computed(() => Number(route.current().value.params.id))

const moderationCase = ref()
const resolution = ref()
const contentAfterRemoval = ref('')

const isRemovingPassages = computed(() => resolution.value === RESOLUTIONS.PASSAGE_REMOVED)

const isRemoved = computed(
  () => moderationCase.value.chapter.isArchived || moderationCase.value.chapter.isHidden,
)

const hasPendingReports = computed(() => moderationCase.value.reports.some(report => report.isPending))

const resolutions = computed(() => {
  if (moderationCase.value.isRemovable) {
    return Object.values(RESOLUTIONS)
  }

  return [RESOLUTIONS.DISMISSED, RESOLUTIONS.PASSAGE_REMOVED]
})

const load = async () => {
  const response = await ModerationController.showChapter(chapterId.value)
  if (!ajaxHelper.isSuccess(response.status)) {
    return
  }

  moderationCase.value = response.moderationCase
  contentAfterRemoval.value = response.moderationCase.chapter.content
}

onMounted(load)
</script>

<template>
  <div class="moderation-chapter-page | f-column">
    <Header />

    <div
      v-if="moderationCase"
      class="moderation-chapter-page__body | w-xl py-40 px-20 d-flex f-column g-30"
    >
      <div class="d-flex f-column g-5">
        <router-link
          :to="{ name: 'moderation' }"
          class="moderation-chapter-page__back | link-inline fs-300"
        >
          {{ t('moderation.back_to_queue') }}
        </router-link>
        <h1 class="moderation-chapter-page__title | fs-700 fw-700">
          {{ moderationCase.chapter.title }}
        </h1>
        <span class="fs-300 color-neutral-700">
          {{
            t('moderation.context', {
              novel: moderationCase.chapter.novel.title,
              author: moderationCase.chapter.author.username,
            })
          }}
        </span>
      </div>

      <div
        v-if="isRemoved"
        class="moderation-chapter-page__removed | d-flex a-center j-between g-20 f-wrap bg-warning-300 p-15 radius-10"
      >
        <span v-if="moderationCase.chapter.isArchived">{{ t('moderation_chapter_page.archived') }}</span>
        <span v-else>{{ t('moderation_chapter_page.hidden') }}</span>
        <ModerationRestoreButton
          :contentType="REPORTED_CONTENT_TYPES.CHAPTER"
          :contentId="moderationCase.chapter.id"
        />
      </div>

      <p
        v-if="!isRemoved && !moderationCase.isRemovable"
        class="moderation-chapter-page__continued | bg-info-300 p-15 radius-10"
      >
        {{ t('moderation_chapter_page.continued') }}
      </p>

      <div class="moderation-chapter-page__layout">
        <PassageRemovalEditor
          v-if="isRemovingPassages"
          v-model="contentAfterRemoval"
          :original="moderationCase.chapter.content"
        />
        <article
          v-else
          class="moderation-chapter-page__content | bg-neutral-200 p-20 radius-10"
        >
          {{ moderationCase.chapter.content }}
        </article>

        <aside class="moderation-chapter-page__panel | d-flex f-column g-30">
          <ModerationReportList :reports="moderationCase.reports" />

          <ModerationSanctionHistory :sanctions="moderationCase.authorSanctions" />

          <ModerationDecisionForm
            v-if="!isRemoved && hasPendingReports"
            :contentType="REPORTED_CONTENT_TYPES.CHAPTER"
            :contentId="moderationCase.chapter.id"
            v-model:resolution="resolution"
            v-model:contentAfterRemoval="contentAfterRemoval"
            :resolutions="resolutions"
          />
        </aside>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.moderation-chapter-page {
  min-height: 100vh;

  &__body {
    margin: 0 auto;
    max-width: 1400px;
  }

  &__layout {
    display: grid;
    grid-template-columns: minmax(0, 1fr);
    gap: 30px;
    align-items: start;

    @media (min-width: 1024px) {
      grid-template-columns: minmax(0, 3fr) minmax(360px, 2fr);
    }
  }

  &__content {
    line-height: 1.6;
    white-space: pre-line;
  }

  &__panel {
    @media (min-width: 1024px) {
      position: sticky;
      top: 20px;
      max-height: calc(100vh - 40px);
      overflow-y: auto;
    }
  }
}
</style>
