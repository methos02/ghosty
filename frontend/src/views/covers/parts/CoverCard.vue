<script setup>
import { t } from '@/services/shortcuts/services-shortcut.js'
import CoverLikeButton from '@/views/covers/parts/CoverLikeButton.vue'
import { useCoverComments } from '@/core-vue/composables/comments/use-cover-comments.js'
import { useReport } from '@/core-vue/composables/reports/use-report.js'

defineProps({
  cover: { type: Object, required: true },
  isOfficial: { type: Boolean, required: true },
})

const { coverComments } = useCoverComments()
const { report } = useReport()
</script>

<template>
  <article
    class="cover-card | d-flex f-column g-10 bg-neutral-200 radius-10 p-10"
    :class="{ 'cover-card--official': isOfficial }"
  >
    <div class="cover-card__frame | overflow-clip radius-5">
      <img
        :src="cover.imageUrl"
        :alt="t('cover_card.image_alt', { author: cover.author.username })"
        class="cover-card__image | w-full h-full"
      />
      <span
        v-if="isOfficial"
        class="cover-card__official | badge bg-primary color-neutral-100 fs-200 fw-700"
      >
        {{ t('cover_card.official') }}
      </span>
    </div>

    <p class="cover-card__author | fs-300 color-neutral-700">
      {{ t('common.by_author', { author: cover.author.username }) }}
    </p>

    <div class="cover-card__actions | d-flex a-center j-between g-5">
      <CoverLikeButton :cover="cover" />

      <div class="d-flex a-center g-5">
        <button
          type="button"
          class="cover-card__comments | btn btn-sm btn-primary-alt d-flex a-center g-5"
          :title="t('cover_card.comments')"
          :aria-label="t('cover_card.comments')"
          @click="coverComments.open(cover)"
        >
          <i class="fa-solid fa-comments"></i>
          <span>{{ cover.commentCount }}</span>
        </button>

        <button
          v-if="report.canReport(cover)"
          type="button"
          class="cover-card__report | btn btn-sm btn-primary-alt"
          :title="t('cover_card.report')"
          :aria-label="t('cover_card.report')"
          @click="report.openCoverReport(cover)"
        >
          <i class="fa-solid fa-flag"></i>
        </button>
      </div>
    </div>
  </article>
</template>

<style lang="scss" scoped>
.cover-card {
  height: 100%;

  &--official {
    outline: 2px solid var(--primary);
  }

  &__frame {
    position: relative;
    aspect-ratio: 16 / 9;
  }

  &__image {
    object-fit: cover;
  }

  &__official {
    position: absolute;
    top: 8px;
    left: 8px;
  }
}
</style>
