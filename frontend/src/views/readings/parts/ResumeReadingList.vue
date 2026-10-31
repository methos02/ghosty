<script setup>
import { onMounted, ref } from 'vue'
import { t } from '@/services/shortcuts/services-shortcut.js'
import { ReadingProgressController } from '@/apis/reading-progress/controllers/reading-progress-controller.js'
import { ajaxHelper } from '@/core/helpers/ajax-helper.js'

const progresses = ref([])
const isLoaded = ref(false)

const load = async () => {
  const response = await ReadingProgressController.list()
  if (!ajaxHelper.isSuccess(response.status)) {
    return
  }

  progresses.value = response.progresses
  isLoaded.value = true
}

onMounted(load)
</script>

<template>
  <section class="resume-reading-list | d-flex f-column g-10">
    <p
      v-if="isLoaded && progresses.length === 0"
      class="resume-reading-list__empty | text-center color-neutral-700 py-40"
    >
      {{ t('resume_reading_list.empty') }}
    </p>

    <ul class="resume-reading-list__items | d-flex f-column g-10">
      <li
        v-for="progress in progresses"
        :key="progress.chapter.id"
        class="resume-reading-list__item | d-flex a-center j-between g-20 bg-neutral-200 radius-10 p-15"
      >
        <div class="d-flex f-column">
          <span class="fw-500">{{ progress.chapter.novel.title }}</span>
          <span class="fs-300 color-neutral-700">
            {{
              t('resume_reading_list.stopped_at', {
                title: progress.chapter.title,
                date: progress.readAtFormat,
              })
            }}
          </span>
        </div>

        <router-link
          :to="{
            name: 'chapter-read',
            params: { slug: progress.chapter.novel.slug, id: progress.chapter.id },
          }"
          class="resume-reading-list__resume | btn btn-sm btn-primary"
        >
          {{ t('resume_reading_list.resume') }}
        </router-link>
      </li>
    </ul>
  </section>
</template>
