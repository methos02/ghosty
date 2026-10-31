<script setup>
import { computed, onMounted, ref } from 'vue'
import { t } from '@/services/shortcuts/services-shortcut.js'
import LoaderComponent from '@/components/LoaderComponent.vue'
import { ChapterReadController } from '@/apis/chapter-reads/controllers/chapter-read-controller.js'
import { ajaxHelper } from '@/core/helpers/ajax-helper.js'

const reads = ref([])
const pagination = ref()

const hasMore = computed(
  () => pagination.value !== undefined && pagination.value.page < pagination.value.lastPage,
)

const load = async (page = 1) => {
  const response = await ChapterReadController.list(page)
  if (!ajaxHelper.isSuccess(response.status)) {
    return
  }

  reads.value = [...reads.value, ...response.reads]
  pagination.value = response.pagination
}

onMounted(() => load())
</script>

<template>
  <section class="reading-history-list | d-flex f-column g-10">
    <p
      v-if="pagination && reads.length === 0"
      class="reading-history-list__empty | text-center color-neutral-700 py-40"
    >
      {{ t('reading_history_list.empty') }}
    </p>

    <ol class="reading-history-list__items | d-flex f-column g-10">
      <li
        v-for="read in reads"
        :key="read.chapter.id"
        class="reading-history-list__item | d-flex a-center j-between g-20 bg-neutral-200 radius-10 p-15"
      >
        <div class="d-flex f-column">
          <router-link
            :to="{
              name: 'chapter-read',
              params: { slug: read.chapter.novel.slug, id: read.chapter.id },
            }"
            class="reading-history-list__chapter | link-inline"
          >
            {{ read.chapter.title }}
          </router-link>
          <span class="fs-300 color-neutral-700">
            {{ t('reading_history_list.novel', { novel: read.chapter.novel.title }) }}
          </span>
        </div>

        <span class="reading-history-list__date | fs-300 color-neutral-700">
          {{ read.readAtFormat }}
        </span>
      </li>
    </ol>

    <div
      v-if="hasMore"
      class="d-flex j-center"
    >
      <LoaderComponent
        :cb="load"
        :params="[pagination.nextPage]"
        buttonClasses="reading-history-list__more | btn btn-primary-alt"
      >
        {{ t('common.see_more') }}
      </LoaderComponent>
    </div>
  </section>
</template>
