<script setup>
import { computed, onMounted, ref } from 'vue'
import Header from '@/views/layout/HeaderComponent.vue'
import ModerationDecisionForm from '@/views/moderation/parts/ModerationDecisionForm.vue'
import ModerationReportList from '@/views/moderation/parts/ModerationReportList.vue'
import ModerationRestoreButton from '@/views/moderation/parts/ModerationRestoreButton.vue'
import ModerationSanctionHistory from '@/views/moderation/parts/ModerationSanctionHistory.vue'
import { route, t } from '@/services/shortcuts/services-shortcut.js'
import { ModerationController } from '@/apis/moderation/controllers/moderation-controller.js'
import { REPORTED_CONTENT_TYPES, RESOLUTIONS } from '@/constants/moderation-constants.js'
import { useModerationHead } from '@/head/use-moderation-head.js'
import { ajaxHelper } from '@/core/helpers/ajax-helper.js'

useModerationHead()

const COMMENT_RESOLUTIONS = [RESOLUTIONS.DISMISSED, RESOLUTIONS.HIDDEN]

const commentId = computed(() => Number(route.current().value.params.id))

const moderationCase = ref()

const canDecide = computed(() => {
  const { comment, reports } = moderationCase.value

  return !comment.isHidden && !comment.isDeleted && reports.some(report => report.isPending)
})

const load = async () => {
  const response = await ModerationController.showComment(commentId.value)
  if (!ajaxHelper.isSuccess(response.status)) {
    return
  }

  moderationCase.value = response.moderationCase
}

onMounted(load)
</script>

<template>
  <div class="moderation-comment-page | f-column">
    <Header />

    <div
      v-if="moderationCase"
      class="moderation-comment-page__body | w-xl py-40 px-20 d-flex f-column g-30"
    >
      <div class="d-flex f-column g-5">
        <router-link
          :to="{ name: 'moderation' }"
          class="moderation-comment-page__back | link-inline fs-300"
        >
          {{ t('moderation.back_to_queue') }}
        </router-link>
        <h1 class="fs-700 fw-700">
          {{ t('moderation_comment_page.title', { author: moderationCase.comment.author.username }) }}
        </h1>
        <span
          v-if="moderationCase.comment.chapter"
          class="moderation-comment-page__target | fs-300 color-neutral-700"
        >
          {{
            t('moderation_comment_page.on_chapter', {
              chapter: moderationCase.comment.chapter.title,
              novel: moderationCase.comment.novel.title,
            })
          }}
        </span>
        <span
          v-else
          class="moderation-comment-page__target | fs-300 color-neutral-700"
        >
          {{ t('moderation_comment_page.on_novel', { novel: moderationCase.comment.novel.title }) }}
        </span>
      </div>

      <div
        v-if="moderationCase.comment.isHidden"
        class="moderation-comment-page__removed | d-flex a-center j-between g-20 f-wrap bg-warning-300 p-15 radius-10"
      >
        <span>{{ t('moderation_comment_page.hidden') }}</span>
        <ModerationRestoreButton
          :contentType="REPORTED_CONTENT_TYPES.COMMENT"
          :contentId="moderationCase.comment.id"
        />
      </div>

      <p
        v-if="moderationCase.comment.isDeleted"
        class="moderation-comment-page__deleted | bg-info-300 p-15 radius-10"
      >
        {{ t('moderation_comment_page.deleted') }}
      </p>

      <blockquote class="moderation-comment-page__content | bg-neutral-200 p-20 radius-10">
        {{ moderationCase.comment.content }}
      </blockquote>

      <ModerationReportList :reports="moderationCase.reports" />

      <ModerationSanctionHistory :sanctions="moderationCase.authorSanctions" />

      <ModerationDecisionForm
        v-if="canDecide"
        :contentType="REPORTED_CONTENT_TYPES.COMMENT"
        :contentId="moderationCase.comment.id"
        :resolutions="COMMENT_RESOLUTIONS"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.moderation-comment-page {
  min-height: 100vh;

  &__body {
    margin: 0 auto;
    max-width: 900px;
  }

  &__content {
    line-height: 1.6;
    margin: 0;
    white-space: pre-line;
  }
}
</style>
