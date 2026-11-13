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

const COVER_RESOLUTIONS = [RESOLUTIONS.DISMISSED, RESOLUTIONS.HIDDEN]

const coverId = computed(() => Number(route.current().value.params.id))

const moderationCase = ref()

const canDecide = computed(() => {
  const { cover, reports } = moderationCase.value

  return !cover.isHidden && reports.some(report => report.isPending)
})

const load = async () => {
  const response = await ModerationController.showCover(coverId.value)
  if (!ajaxHelper.isSuccess(response.status)) {
    return
  }

  moderationCase.value = response.moderationCase
}

onMounted(load)
</script>

<template>
  <div class="moderation-cover-page | f-column">
    <Header />

    <div
      v-if="moderationCase"
      class="moderation-cover-page__body | w-xl py-40 px-20 d-flex f-column g-30"
    >
      <div class="d-flex f-column g-5">
        <router-link
          :to="{ name: 'moderation' }"
          class="moderation-cover-page__back | link-inline fs-300"
        >
          {{ t('moderation.back_to_queue') }}
        </router-link>
        <h1 class="fs-700 fw-700">
          {{ t('moderation_cover_page.title', { author: moderationCase.cover.author.username }) }}
        </h1>
        <span class="moderation-cover-page__target | fs-300 color-neutral-700">
          {{ t('moderation_cover_page.on_novel', { novel: moderationCase.cover.novel.title }) }}
        </span>
      </div>

      <div
        v-if="moderationCase.cover.isHidden"
        class="moderation-cover-page__removed | d-flex a-center j-between g-20 f-wrap bg-warning-300 p-15 radius-10"
      >
        <span>{{ t('moderation_cover_page.hidden') }}</span>
        <ModerationRestoreButton
          :contentType="REPORTED_CONTENT_TYPES.COVER"
          :contentId="moderationCase.cover.id"
        />
      </div>

      <figure class="moderation-cover-page__figure | d-flex f-column a-start g-10">
        <img
          :src="moderationCase.cover.imageUrl"
          :alt="
            t('moderation_cover_page.image_alt', {
              author: moderationCase.cover.author.username,
              novel: moderationCase.cover.novel.title,
            })
          "
          class="moderation-cover-page__image | radius-10"
        />
        <figcaption class="fs-300 color-neutral-700">
          {{ t('moderation_cover_page.like_count', moderationCase.cover.likeCount) }}
        </figcaption>
      </figure>

      <ModerationReportList :reports="moderationCase.reports" />

      <ModerationSanctionHistory :sanctions="moderationCase.authorSanctions" />

      <ModerationDecisionForm
        v-if="canDecide"
        :contentType="REPORTED_CONTENT_TYPES.COVER"
        :contentId="moderationCase.cover.id"
        :resolutions="COVER_RESOLUTIONS"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.moderation-cover-page {
  min-height: 100vh;

  &__body {
    margin: 0 auto;
    max-width: 900px;
  }

  &__figure {
    margin: 0;
  }

  &__image {
    width: 100%;
    max-width: 320px;
    aspect-ratio: 16 / 9;
    object-fit: cover;
  }
}
</style>
