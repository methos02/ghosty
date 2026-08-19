<script setup>
import { computed, onMounted, ref } from 'vue'
import Header from '@/views/layout/HeaderComponent.vue'
import ConfirmButton from '@/components/ConfirmButtonComponent.vue'
import { t } from '@/services/shortcuts/services-shortcut.js'
import { STATUS } from '@/constants/ajax-constants.js'
import { ChapterController } from '@/apis/chapters/controllers/chapter-controller.js'
import { useDraftsHead } from '@/head/use-drafts-head.js'

useDraftsHead()

const drafts = ref([])
const draftType = ref('novels')

const shown = computed(() => {
  if (draftType.value === 'novels') {
    return drafts.value.filter(draft => draft.isRoot)
  }

  return drafts.value.filter(draft => !draft.isRoot)
})

const load = async () => {
  const response = await ChapterController.drafts()
  if (response.status !== STATUS.SUCCESS) {
    return
  }

  drafts.value = response.chapters
}

const discardQuestion = draft => {
  if (draft.isRoot) {
    return t('drafts.discard_novel_question')
  }

  return t('drafts.discard_chapter_question')
}

const resumeRoute = draft => {
  if (draft.isRoot) {
    return { name: 'novel-edit', params: { id: draft.id } }
  }

  return { name: 'chapter-edit', params: { id: draft.id } }
}

const discard = async draft => {
  const response = await ChapterController.destroy(draft.id)
  if (response.status !== STATUS.SUCCESS) {
    return
  }

  await load()
}

onMounted(load)
</script>

<template>
  <div class="drafts-page | f-column">
    <Header />

    <div class="drafts-page__body | w-xl py-40 px-20">
      <div class="d-flex j-between a-center mb-20">
        <h1 class="fs-700 fw-700">{{ t('drafts.title') }}</h1>

        <div class="d-flex g-10">
          <button
            type="button"
            @click="draftType = 'chapters'"
            class="btn"
            :class="draftType === 'chapters' ? 'btn-primary' : 'btn-primary-alt'"
          >
            {{ t('drafts.chapters') }}
          </button>
          <button
            type="button"
            @click="draftType = 'novels'"
            class="btn"
            :class="draftType === 'novels' ? 'btn-primary' : 'btn-primary-alt'"
          >
            {{ t('drafts.novels') }}
          </button>
        </div>
      </div>

      <div
        v-if="shown.length === 0"
        class="drafts-page__empty | d-flex f-column a-center text-center g-20 py-40"
      >
        <p class="color-neutral-700">{{ t('drafts.empty') }}</p>
        <router-link
          :to="{ name: 'novel-create' }"
          class="drafts-page__create | btn btn-primary"
        >
          {{ t('drafts.create_novel') }}
        </router-link>
      </div>

      <ul class="drafts-page__list | d-flex f-column g-10">
        <li
          v-for="draft in shown"
          :key="draft.id"
          class="drafts-page__item | d-flex a-center j-between g-20 bg-neutral-200 radius-10 p-15"
        >
          <div class="d-flex f-column">
            <span class="fw-500">{{ draft.title }}</span>
            <span class="fs-300 color-neutral-700">{{ draft.novel.title }}</span>
          </div>

          <div class="d-flex g-10">
            <router-link
              :to="resumeRoute(draft)"
              class="drafts-page__resume | btn btn-sm btn-primary-alt"
            >
              {{ t('drafts.resume') }}
            </router-link>
            <ConfirmButton
              :cb="discard"
              :params="[draft]"
              :question="discardQuestion(draft)"
              buttonClasses="drafts-page__discard | btn btn-sm btn-danger-alt"
            >
              {{ t('drafts.discard') }}
            </ConfirmButton>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.drafts-page {
  min-height: 100vh;

  &__body {
    margin: 0 auto;
    max-width: 1200px;
  }
}
</style>
