<script setup>
import { computed, ref } from 'vue'
import { t } from '@/services/shortcuts/services-shortcut.js'
import ChildrenSwitcher from '@/views/chapters/parts/ChildrenSwitcher.vue'
import LikeButton from '@/views/chapters/parts/LikeButton.vue'
import LoaderComponent from '@/components/LoaderComponent.vue'
import NovelCard from '@/views/parts/NovelCard.vue'
import { useLastFork } from '@/apis/chapters/composables/use-last-fork.js'
import { useNovelSuggestions } from '@/apis/novels/composables/use-novel-suggestions.js'

const props = defineProps({
  novelSlug: { type: String, required: true },
  chapter: { type: Object, required: true },
  children: { type: Array, default: () => [] },
  canCorrect: { type: Boolean, default: false },
})

const PANEL = {
  NONE: '',
  BRANCH: 'branch',
  NOVELS: 'novels',
}

const { lastFork, forkChildren, openLastFork } = useLastFork()
const { suggestions, loadSuggestions } = useNovelSuggestions()

const openedPanel = ref(PANEL.NONE)

const isAtDeadEnd = computed(() => props.children.length === 0)
const hasAlternativeBranch = computed(() => isAtDeadEnd.value && lastFork.value !== undefined)

const tabClasses = (name, panel) => {
  if (openedPanel.value === panel) {
    return `${name} | btn btn-primary-alt active`
  }

  return `${name} | btn btn-primary-alt`
}

const branchTabClasses = computed(() => tabClasses('chapter-footer__fork', PANEL.BRANCH))
const novelsTabClasses = computed(() => tabClasses('chapter-footer__suggest', PANEL.NOVELS))

const openBranchPanel = async () => {
  if (openedPanel.value === PANEL.BRANCH) {
    openedPanel.value = PANEL.NONE
    return
  }

  if (forkChildren.value.length === 0) {
    await openLastFork()
  }

  openedPanel.value = PANEL.BRANCH
}

const openNovelsPanel = async () => {
  if (openedPanel.value === PANEL.NOVELS) {
    openedPanel.value = PANEL.NONE
    return
  }

  if (suggestions.value.length === 0) {
    await loadSuggestions()
  }

  openedPanel.value = PANEL.NOVELS
}
</script>

<template>
  <section class="chapter-footer | d-flex f-column g-20">
    <p class="chapter-footer__mark | text-center fs-300 color-neutral-700">
      {{ t('chapter_read.end_of_chapter') }}
    </p>

    <div class="chapter-footer__support | d-flex f-column a-center g-5">
      <LikeButton />

      <span class="chapter-footer__support-hint | fs-300 color-neutral-700">
        {{ t('chapter_read.support_hint') }}
      </span>
    </div>

    <ChildrenSwitcher :children="children" />

    <div class="chapter-footer__actions | d-flex f-wrap j-center g-10">
      <router-link
        :to="{ name: 'chapter-write', params: { slug: novelSlug, parentId: chapter.id } }"
        class="chapter-footer__continue | btn btn-primary"
      >
        {{ t('chapter_read.continue') }}
      </router-link>

      <LoaderComponent
        v-if="hasAlternativeBranch"
        :cb="openBranchPanel"
        :buttonClasses="branchTabClasses"
        :aria-pressed="openedPanel === PANEL.BRANCH"
      >
        {{ t('chapter_read.alternative_branch') }}
      </LoaderComponent>

      <LoaderComponent
        :cb="openNovelsPanel"
        :buttonClasses="novelsTabClasses"
        :aria-pressed="openedPanel === PANEL.NOVELS"
      >
        {{ t('chapter_read.other_novel') }}
      </LoaderComponent>

      <router-link
        v-if="canCorrect"
        :to="{ name: 'chapter-edit', params: { id: chapter.id } }"
        class="chapter-footer__correct | btn btn-primary-alt"
      >
        {{ t('chapter_read.correct') }}
      </router-link>
    </div>

    <ChildrenSwitcher
      v-if="openedPanel === PANEL.BRANCH"
      :children="forkChildren"
      :title="t('chapter_read.fork_suites', { chapter: lastFork?.title })"
    />

    <section
      v-if="openedPanel === PANEL.NOVELS && suggestions.length > 0"
      class="chapter-footer__suggestions | d-flex f-column g-15"
    >
      <h2 class="chapter-footer__suggestions-title | fs-500 fw-500">
        {{ t('chapter_read.suggestions_title') }}
      </h2>

      <div class="chapter-footer__novels">
        <NovelCard
          v-for="novel in suggestions"
          :key="novel.id"
          :novel="novel"
        />
      </div>
    </section>
  </section>
</template>

<style lang="scss" scoped>
.chapter-footer {
  &__mark {
    border-top: 1px solid var(--neutral-300);
    padding-top: 20px;
  }

  &__novels {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 15px;
  }
}

@media (max-width: 700px) {
  .chapter-footer__novels {
    grid-template-columns: 1fr;
  }
}
</style>
