<script setup>
import { computed } from 'vue'
import { router, t } from '@/services/shortcuts/services-shortcut.js'
import { useChapterSummary } from '@/apis/chapters/composables/use-chapter-summary.js'
import { useNovelStore } from '@/apis/novels/stores/novel-store.js'
import { useAuthStore } from '@/services/auth/src/auth-store.js'
import { correctionHelper } from '@/core/helpers/correction-helper.js'
import { POPULARITY } from '@/constants/chapter-constants.js'

const props = defineProps({
  chapter: { type: Object, required: true },
  isSelected: { type: Boolean, default: false },
  popularity: { type: String, default: POPULARITY.NONE },
  alternativesCount: { type: Number, default: 0 },
})

defineEmits(['pick', 'alternatives'])

const { openChapterSummary } = useChapterSummary()
const { selectedNovel } = useNovelStore()
const authStore = useAuthStore()

const chapterNumber = computed(() => props.chapter.depth + 1)

const popularLabel = computed(() => {
  if (props.popularity === POPULARITY.NOVEL) {
    return t('common.most_popular')
  }

  if (props.popularity === POPULARITY.BRANCH) {
    return t('common.most_popular_from_here')
  }

  return ''
})
const canCorrect = computed(() =>
  correctionHelper.isCorrectableBy(props.chapter, authStore.user.value?.id),
)

const correct = async () => {
  await router.push({ name: 'chapter-edit', params: { id: props.chapter.id } })
}
</script>

<template>
  <article
    class="chapter-card | w-100 p-20 radius-10 bg-neutral-200 d-flex f-column g-10"
    :class="{ 'chapter-card--selected': isSelected }"
    role="button"
    tabindex="0"
    @click="$emit('pick')"
    @keydown.enter="$emit('pick')"
    @keydown.space.prevent="$emit('pick')"
  >
    <div class="chapter-card__head | d-flex f-wrap a-center j-between g-10">
      <h3 class="chapter-card__title | fs-500 fw-500">
        <span class="chapter-card__number | color-neutral-700 mr-5">
          {{ t('chapter_card.number', { number: chapterNumber }) }}
        </span>
        <span class="chapter-card__name">{{ chapter.title }}</span>
        <span class="chapter-card__author | fs-300 fw-400 color-neutral-700 ml-10">
          {{ t('common.by_author', { author: chapter.author.username }) }}
        </span>
      </h3>

      <div class="chapter-card__badges | d-flex f-wrap a-center g-10">
        <span class="chapter-card__children | badge badge-info">
          {{ t('chapter_card.children', chapter.childrenCount) }}
        </span>

        <span
          v-if="popularLabel !== ''"
          class="chapter-card__popular | badge badge-primary"
        >
          {{ popularLabel }}
        </span>
      </div>
    </div>

    <div class="chapter-card__actions | d-flex f-wrap a-center j-between g-10">
      <div class="chapter-card__buttons | d-flex f-wrap a-center g-10">
        <button
          v-if="chapter.summary"
          type="button"
          class="chapter-card__summary | btn btn-sm btn-primary-alt"
          @click.stop="openChapterSummary(chapter)"
        >
          {{ t('chapter_card.summary') }}
        </button>

        <router-link
          :to="{ name: 'chapter-read', params: { slug: selectedNovel?.slug, id: chapter.id } }"
          class="chapter-card__read | btn btn-sm btn-primary"
          @click.stop
        >
          {{ t('chapter_card.read') }}
        </router-link>

        <button
          v-if="canCorrect"
          type="button"
          class="chapter-card__correct | btn btn-sm btn-primary-alt"
          @click.stop="correct"
        >
          {{ t('chapter_card.correct') }}
        </button>
      </div>

      <button
        v-if="isSelected && alternativesCount > 1"
        type="button"
        class="chapter-card__alternatives | fs-300 color-primary"
        @click.stop="$emit('alternatives')"
      >
        {{ t('chapter_card.change', { count: alternativesCount }) }}
      </button>
    </div>
  </article>
</template>

<style lang="scss" scoped>
.chapter-card {
  border: 1px solid var(--neutral-400);
  border-left-width: 4px;
  cursor: pointer;
  transition: border-color linear 200ms;

  &:hover,
  &:focus-visible {
    border-color: var(--info);
  }

  &--selected {
    border-color: var(--primary);
  }

  &__number {
    white-space: nowrap;
  }

  &__actions .btn {
    min-width: 110px;
  }

  &__alternatives {
    margin-left: auto;
    cursor: pointer;

    &:hover,
    &:focus-visible {
      text-decoration: underline;
    }
  }
}
</style>
