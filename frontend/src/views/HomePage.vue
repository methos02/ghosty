<script setup>
import { computed } from 'vue'
import Header from '@/views/layout/HeaderComponent.vue'
import Toolbar from '@/views/parts/Toolbar.vue'
import NovelCard from '@/views/parts/NovelCard.vue'
import NovelSearch from '@/views/parts/NovelSearch.vue'
import UserSummary from '@/views/parts/UserSummary.vue'
import NovelDetailDialog from '@/views/novels/NovelDetailDialog.vue'
import PaginatorInfinite from '@/components/paginators/PaginatorInfiniteComponent.vue'
import NovelManageForm from '@/views/novels/NovelManageForm.vue'
import { useNovelStore } from '@/apis/novels/stores/novel-store.js'
import { useNovelSearch } from '@/apis/novels/composables/use-novel-search.js'
import { route, router, t } from '@/services/shortcuts/services-shortcut.js'
import { useAuthStore } from '@/services/auth/src/auth-store.js'
import { useHomeHead } from '@/head/use-home-head.js'

useHomeHead()

const authStore = useAuthStore()
const { novels, pagination } = useNovelStore()
const { novelSearch } = useNovelSearch()

const loadMore = () => novelSearch.loadMore()

const currentRoute = route.current()
const WRITING_ROUTES = new Set(['novel-create', 'novel-edit'])

const mode = computed(() => (WRITING_ROUTES.has(currentRoute.value.name) ? 'create' : 'read'))

const changeMode = async nextMode => {
  await router.push(nextMode === 'create' ? { name: 'novel-create' } : { name: 'home' })
}
</script>

<template>
  <div class="home-page | f-column">
    <div class="top-container | f-column">
      <Header :transparent="true" />
      <div class="w-xl | f-column j-center g-35 flex-1 a-start">
        <UserSummary v-if="authStore.isAuthenticated.value" />

        <div v-if="!authStore.isAuthenticated.value">
          <h1 class="top-title | color-neutral-100 fw-400">{{ t('homepage.welcome_title') }}</h1>
          <p class="top-subtitle | color-neutral-100 fw-400">
            {{ t('homepage.welcome_subtitle') }}
          </p>
        </div>
        <button
          v-if="!authStore.isAuthenticated.value"
          class="btn btn-neutral-100-alt fs-700 px-50 py-10"
        >
          {{ t('homepage.principle_button') }}
        </button>
      </div>
      <Toolbar
        :mode="mode"
        @update:mode="changeMode"
      />
    </div>

    <NovelManageForm v-if="mode === 'create'" />

    <NovelSearch v-if="mode === 'read'" />

    <PaginatorInfinite
      v-if="mode === 'read'"
      :cb="loadMore"
      :params="pagination"
      :options="{ observe: 'window' }"
    >
      <div class="novels-container | w-xl py-40 px-20">
        <div class="novels-grid">
          <NovelCard
            v-for="novel in novels"
            :key="novel.id"
            :novel="novel"
          />
        </div>
      </div>
    </PaginatorInfinite>

    <NovelDetailDialog />
  </div>
</template>

<style lang="scss">
.home-page {
  min-height: 100vh;
}

.top {
  &-container {
    height: 60vh;
    background-image: url('@/assets/images/accueil.jpg');
    background-image: image-set(
      url('@/assets/images/accueil.webp') type('image/webp') 1x,
      url('@/assets/images/accueil.jpg') type('image/jpeg') 1x
    );
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
  }

  &-title {
    font-size: clamp(2rem, 5vw, 3rem);
  }

  &-subtitle {
    font-size: clamp(1rem, 3vw, 1.5rem);
  }
}

.novels {
  &-container {
    margin: 0 auto;
    max-width: 1200px;
  }

  &-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(306px, 1fr));
    gap: 24px;
  }
}
</style>
