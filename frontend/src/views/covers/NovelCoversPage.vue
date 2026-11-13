<script setup>
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import Header from '@/views/layout/HeaderComponent.vue'
import ConfirmButtonComponent from '@/components/ConfirmButtonComponent.vue'
import CoverCard from '@/views/covers/parts/CoverCard.vue'
import CoverCommentsDialog from '@/views/covers/parts/CoverCommentsDialog.vue'
import CoverProposeDialog from '@/views/covers/parts/CoverProposeDialog.vue'
import { route, t } from '@/services/shortcuts/services-shortcut.js'
import { CoverController } from '@/apis/covers/controllers/cover-controller.js'
import { NovelController } from '@/apis/novels/controllers/novel-controller.js'
import { useCoverStore } from '@/core-vue/stores/covers/cover-store.js'
import { useNovelCoversHead } from '@/head/use-novel-covers-head.js'
import { ajaxHelper } from '@/core/helpers/ajax-helper.js'
import { useAuth } from '@/services/auth/src/use-auth.js'
import { useAuthStore } from '@/services/auth/src/auth-store.js'

const currentRoute = route.current()
const authStore = useAuthStore()
const { openLoginDialog } = useAuth()
const { covers, officialCoverId, myCoverId, coverStore } = useCoverStore()

const novel = ref()
const isLoaded = ref(false)
const proposeDialog = ref()
const state = { isUnmounted: false }

useNovelCoversHead(novel)

const novelSlug = computed(() => currentRoute.value.params.slug)
const myCover = computed(() => covers.value.find(cover => cover.id === myCoverId.value))

const loadNovel = async slug => {
  const response = await NovelController.getBySlug(slug)
  if (state.isUnmounted || !ajaxHelper.isSuccess(response.status)) {
    return
  }

  novel.value = response.novel
}

const loadCovers = async slug => {
  const response = await CoverController.list(slug)
  if (state.isUnmounted || !ajaxHelper.isSuccess(response.status)) {
    return
  }

  coverStore.setNovelCovers(response.novelCovers)
  isLoaded.value = true
}

const load = async slug => {
  isLoaded.value = false
  await Promise.all([loadNovel(slug), loadCovers(slug)])
}

const openProposal = () => {
  if (!authStore.isAuthenticated.value) {
    openLoginDialog()
    return
  }

  proposeDialog.value.show()
}

watch(novelSlug, load)

onMounted(() => load(novelSlug.value))

onUnmounted(() => {
  state.isUnmounted = true
  coverStore.clear()
})
</script>

<template>
  <div class="novel-covers-page | f-column">
    <Header />

    <div class="novel-covers-page__body | w-xl py-40 px-20 d-flex f-column g-20">
      <router-link
        :to="{ name: 'novel-detail', params: { slug: novelSlug } }"
        class="novel-covers-page__back | link-inline d-flex a-center g-5 fs-300"
      >
        <i class="fa-solid fa-arrow-left"></i>
        {{ t('novel_covers_page.back_to_novel') }}
      </router-link>

      <div class="novel-covers-page__heading | d-flex a-center j-between f-wrap g-15">
        <div class="d-flex f-column g-5">
          <h1 class="fs-700 fw-700">{{ t('novel_covers_page.title') }}</h1>
          <p
            v-if="novel"
            class="novel-covers-page__novel | color-neutral-700"
          >
            {{ novel.title }}
          </p>
        </div>

        <ConfirmButtonComponent
          v-if="myCover"
          :cb="openProposal"
          :question="t('novel_covers_page.replace_question', myCover.likeCount)"
          :title="t('novel_covers_page.replace')"
          buttonClasses="novel-covers-page__replace | btn btn-primary-alt"
        >
          {{ t('novel_covers_page.replace') }}
        </ConfirmButtonComponent>

        <button
          v-else
          type="button"
          class="novel-covers-page__propose | btn btn-primary"
          @click="openProposal"
        >
          {{ t('novel_covers_page.propose') }}
        </button>
      </div>

      <p class="novel-covers-page__intro | fs-300 color-neutral-700">
        {{ t('novel_covers_page.intro') }}
      </p>

      <p
        v-if="isLoaded && covers.length === 0"
        class="novel-covers-page__empty | text-center color-neutral-700 py-40"
      >
        {{ t('novel_covers_page.empty') }}
      </p>

      <ul class="novel-covers-page__grid">
        <li
          v-for="cover in covers"
          :key="cover.id"
        >
          <CoverCard
            :cover="cover"
            :isOfficial="cover.id === officialCoverId"
          />
        </li>
      </ul>
    </div>

    <CoverProposeDialog ref="proposeDialog" />
    <CoverCommentsDialog />
  </div>
</template>

<style lang="scss" scoped>
.novel-covers-page {
  min-height: 100vh;

  &__body {
    margin: 0 auto;
    max-width: 1200px;
  }

  &__grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 20px;
  }
}
</style>
