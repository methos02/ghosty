<script setup>
import { computed, onMounted, ref } from 'vue'
import Header from '@/views/layout/HeaderComponent.vue'
import MultiverseChapterCard from '@/views/chapters/parts/MultiverseChapterCard.vue'
import { route, t } from '@/services/shortcuts/services-shortcut.js'
import { STATUS } from '@/constants/ajax-constants.js'
import { useTreeStore } from '@/apis/chapters/stores/tree-store.js'
import { useChapterTree } from '@/apis/chapters/composables/use-chapter-tree.js'
import { useChapterBranch } from '@/apis/chapters/composables/use-chapter-branch.js'
import { useNovelStore } from '@/apis/novels/stores/novel-store.js'
import { useNovelDetail } from '@/apis/novels/composables/use-novel-detail.js'
import { useMultiverseHead } from '@/head/use-multiverse-head.js'

useMultiverseHead()

const { selectedNovel } = useNovelStore()
const { novelDetail } = useNovelDetail()
const { chapters } = useTreeStore()
const { chapterTree } = useChapterTree()
const { branch, children, lastSelected, referenceId, hasBranchOf, revealChildren } =
  useChapterBranch()

const currentRoute = route.current()
const isLoading = ref(false)
const errorMessage = ref('')

const novelSlug = computed(() => currentRoute.value.params.slug)
const lastPosition = computed(() => (lastSelected.value?.depth ?? 0) + 1)

const isAlreadyLoaded = () => {
  if (selectedNovel.value?.slug !== novelSlug.value || chapters.value.length === 0) {
    return false
  }

  if (referenceId.value === undefined) {
    return true
  }

  return hasBranchOf(referenceId.value)
}

const reveal = async chapterId => {
  const response = await revealChildren(chapterId)
  if (response.status !== STATUS.SUCCESS) {
    errorMessage.value = response.error
  }
}

const load = async () => {
  if (isAlreadyLoaded()) {
    await reveal(lastSelected.value?.id)
    return
  }

  isLoading.value = true
  errorMessage.value = ''

  const novelResponse = await novelDetail.selectBySlug(novelSlug.value)
  const treeResponse = await chapterTree.load(novelSlug.value, referenceId.value)

  if (novelResponse.status !== STATUS.SUCCESS || treeResponse.status !== STATUS.SUCCESS) {
    errorMessage.value = novelResponse.error ?? treeResponse.error
  }

  isLoading.value = false

  await reveal(lastSelected.value?.id)
}

onMounted(load)
</script>

<template>
  <div class="multiverse-page | f-column">
    <Header />

    <div class="multiverse-page__body | w-xl py-40 px-20 d-flex f-column g-20">
      <header class="multiverse-page__header | d-flex f-column g-5">
        <span class="multiverse-page__label | fs-300 color-neutral-700">
          {{ t('multiverse.label') }}
        </span>
        <h1 class="fs-700 fw-700">{{ selectedNovel?.title ?? '' }}</h1>
      </header>

      <p class="multiverse-page__intro | color-neutral-700">{{ t('multiverse.intro') }}</p>

      <div
        v-if="isLoading"
        class="d-flex j-center p-30"
      >
        <span>{{ t('multiverse.loading') }}</span>
      </div>

      <div
        v-if="errorMessage"
        class="multiverse-page__error | bg-danger-100 p-15 radius-10 color-danger"
      >
        {{ errorMessage }}
      </div>

      <p
        v-if="!isLoading && branch.length === 0"
        class="multiverse-page__empty | color-neutral-700"
      >
        {{ t('multiverse.empty') }}
      </p>

      <div class="multiverse-page__flow | d-flex f-column g-10">
        <ol class="multiverse-page__branch | d-flex f-column g-10">
          <li
            v-for="chapter in branch"
            :key="chapter.id"
          >
            <MultiverseChapterCard :chapter="chapter" />
          </li>
        </ol>

        <section
          v-if="lastSelected"
          class="multiverse-page__choices | d-flex f-column g-10"
        >
          <h2
            v-if="children.length > 0"
            class="multiverse-page__choices-title | fs-500 fw-500 color-neutral-700 ml-20"
          >
            {{ t('multiverse.choices', { number: lastPosition }) }}
          </h2>

          <h2
            v-if="children.length === 0"
            class="multiverse-page__choices-title | fs-500 fw-500 color-neutral-700 ml-20"
          >
            {{ t('multiverse.no_choice', { number: lastPosition }) }}
          </h2>

          <ul class="d-flex f-column g-10">
            <li
              v-for="child in children"
              :key="child.id"
            >
              <MultiverseChapterCard :chapter="child" />
            </li>
          </ul>

          <router-link
            :to="{ name: 'chapter-write', params: { slug: novelSlug, parentId: lastSelected.id } }"
            class="multiverse-page__write | btn btn-primary-alt"
          >
            {{ t('multiverse.write', { number: lastPosition }) }}
          </router-link>
        </section>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.multiverse-page {
  min-height: 100vh;

  &__body {
    margin: 0 auto;
    max-width: 1000px;
  }

  &__write {
    margin-right: auto;
  }

  &__branch li {
    list-style-type: none;
  }
}
</style>
