<script setup>
import { ref } from 'vue'
import Header from '@/views/layout/HeaderComponent.vue'
import ResumeReadingList from '@/views/readings/parts/ResumeReadingList.vue'
import FollowedBranchList from '@/views/readings/parts/FollowedBranchList.vue'
import ReadingHistoryList from '@/views/readings/parts/ReadingHistoryList.vue'
import { t } from '@/services/shortcuts/services-shortcut.js'
import { useReadingsHead } from '@/head/use-readings-head.js'

useReadingsHead()

const TAB = {
  RESUME: 'resume',
  FOLLOWED: 'followed',
  HISTORY: 'history',
}

const openedTab = ref(TAB.RESUME)

const tabClasses = tab => (openedTab.value === tab ? 'btn btn-primary' : 'btn btn-primary-alt')
</script>

<template>
  <div class="readings-page | f-column">
    <Header />

    <div class="readings-page__body | w-xl py-40 px-20">
      <div class="d-flex f-wrap j-between a-center g-15 mb-20">
        <h1 class="fs-700 fw-700">{{ t('readings.title') }}</h1>

        <div class="d-flex f-wrap g-10">
          <button
            type="button"
            class="readings-page__tab-resume"
            :class="tabClasses(TAB.RESUME)"
            :aria-pressed="openedTab === TAB.RESUME"
            @click="openedTab = TAB.RESUME"
          >
            {{ t('readings.tab_resume') }}
          </button>
          <button
            type="button"
            class="readings-page__tab-followed"
            :class="tabClasses(TAB.FOLLOWED)"
            :aria-pressed="openedTab === TAB.FOLLOWED"
            @click="openedTab = TAB.FOLLOWED"
          >
            {{ t('readings.tab_followed') }}
          </button>
          <button
            type="button"
            class="readings-page__tab-history"
            :class="tabClasses(TAB.HISTORY)"
            :aria-pressed="openedTab === TAB.HISTORY"
            @click="openedTab = TAB.HISTORY"
          >
            {{ t('readings.tab_history') }}
          </button>
        </div>
      </div>

      <ResumeReadingList v-if="openedTab === TAB.RESUME" />
      <FollowedBranchList v-if="openedTab === TAB.FOLLOWED" />
      <ReadingHistoryList v-if="openedTab === TAB.HISTORY" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.readings-page {
  min-height: 100vh;

  &__body {
    margin: 0 auto;
    max-width: 1200px;
  }
}
</style>
