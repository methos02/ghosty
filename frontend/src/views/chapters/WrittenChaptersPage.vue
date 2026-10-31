<script setup>
import { onMounted, ref } from 'vue'
import Header from '@/views/layout/HeaderComponent.vue'
import { t } from '@/services/shortcuts/services-shortcut.js'
import { ChapterController } from '@/apis/chapters/controllers/chapter-controller.js'
import { useWrittenChaptersHead } from '@/head/use-written-chapters-head.js'
import { ajaxHelper } from '@/core/helpers/ajax-helper.js'

useWrittenChaptersHead()

const novels = ref([])
const isLoaded = ref(false)

const load = async () => {
  const response = await ChapterController.published()
  if (!ajaxHelper.isSuccess(response.status)) {
    return
  }

  novels.value = response.novels
  isLoaded.value = true
}

onMounted(load)
</script>

<template>
  <div class="written-chapters-page | f-column">
    <Header />

    <div class="written-chapters-page__body | w-xl py-40 px-20">
      <h1 class="fs-700 fw-700 mb-20">{{ t('written_chapters.title') }}</h1>

      <div
        v-if="isLoaded && novels.length === 0"
        class="written-chapters-page__empty | d-flex f-column a-center text-center g-20 py-40"
      >
        <p class="color-neutral-700">{{ t('written_chapters.empty') }}</p>
        <router-link
          :to="{ name: 'novel-create' }"
          class="written-chapters-page__create | btn btn-primary"
        >
          {{ t('written_chapters.create_novel') }}
        </router-link>
      </div>

      <div class="d-flex f-column g-30">
        <section
          v-for="group in novels"
          :key="group.novel.id"
          class="written-chapters-page__novel | d-flex f-column g-10"
        >
          <router-link
            :to="{ name: 'novel-detail', params: { slug: group.novel.slug } }"
            class="written-chapters-page__novel-title | link-inline fs-600 fw-700"
          >
            {{ group.novel.title }}
          </router-link>

          <ol class="d-flex f-column g-10">
            <li
              v-for="chapter in group.chapters"
              :key="chapter.id"
              class="written-chapters-page__chapter | d-flex a-center j-between g-20 bg-neutral-200 radius-10 p-15"
            >
              <div class="d-flex f-column">
                <router-link
                  :to="{
                    name: 'chapter-read',
                    params: { slug: group.novel.slug, id: chapter.id },
                  }"
                  class="written-chapters-page__chapter-title | link-inline fw-500"
                >
                  {{ chapter.title }}
                </router-link>
                <span class="fs-300 color-neutral-700">
                  {{ t('written_chapters.published_at', { date: chapter.publishedAtFormat }) }}
                </span>
              </div>

              <div class="d-flex f-column a-end fs-300 color-neutral-700">
                <span>{{ t('common.chapter_likes', chapter.likeCount) }}</span>
                <span>{{ t('common.chapter_children', chapter.childrenCount) }}</span>
              </div>
            </li>
          </ol>
        </section>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.written-chapters-page {
  min-height: 100vh;

  &__body {
    margin: 0 auto;
    max-width: 1200px;
  }
}
</style>
