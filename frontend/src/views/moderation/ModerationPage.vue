<script setup>
import { onMounted, ref, watch } from 'vue'
import Header from '@/views/layout/HeaderComponent.vue'
import PaginatorComponent from '@/components/PaginatorComponent.vue'
import SelectComponent from '@/services/form/views/inputs/SelectComponent.vue'
import { t } from '@/services/shortcuts/services-shortcut.js'
import { ConfigLoader } from '@/config/config-loader.js'
import { ModerationController } from '@/apis/moderation/controllers/moderation-controller.js'
import { REPORT_STATUSES, REPORTED_CONTENT_TYPES } from '@/constants/moderation-constants.js'
import { useModerationHead } from '@/head/use-moderation-head.js'
import { ajaxHelper } from '@/core/helpers/ajax-helper.js'

useModerationHead()

const filters = ref({ status: REPORT_STATUSES.PENDING })
const reportedContents = ref([])
const pagination = ref({})
const isLoaded = ref(false)

const load = async (page = 1) => {
  const response = await ModerationController.listReportedContents(filters.value, page)
  if (!ajaxHelper.isSuccess(response.status)) {
    return
  }

  reportedContents.value = response.reportedContents
  pagination.value = response.pagination
  isLoaded.value = true
}

const showStatus = status => {
  filters.value = {
    ...filters.value,
    status,
  }
}

const statusClass = status => (filters.value.status === status ? 'btn-primary' : 'btn-primary-alt')

const caseRoute = reportedContent => {
  if (reportedContent.type === REPORTED_CONTENT_TYPES.CHAPTER) {
    return {
      name: 'moderation-chapter',
      params: { id: reportedContent.id },
    }
  }

  return {
    name: 'moderation-comment',
    params: { id: reportedContent.id },
  }
}

watch(filters, () => load(), { deep: true })

onMounted(() => load())
</script>

<template>
  <div class="moderation-page | f-column">
    <Header />

    <div class="moderation-page__body | w-xl py-40 px-20 d-flex f-column g-20">
      <h1 class="fs-700 fw-700">{{ t('moderation_page.title') }}</h1>

      <div class="moderation-page__filters | d-flex a-end j-between g-20 f-wrap">
        <div class="d-flex g-10">
          <button
            type="button"
            @click="showStatus(REPORT_STATUSES.PENDING)"
            class="moderation-page__status | btn"
            :class="statusClass(REPORT_STATUSES.PENDING)"
          >
            {{ t('moderation_page.pending') }}
          </button>
          <button
            type="button"
            @click="showStatus(REPORT_STATUSES.PROCESSED)"
            class="moderation-page__status | btn"
            :class="statusClass(REPORT_STATUSES.PROCESSED)"
          >
            {{ t('moderation_page.processed') }}
          </button>
        </div>

        <SelectComponent
          v-model="filters.reason"
          name="reason"
          :label="t('moderation_page.reason')"
          :fixedLabel="true"
          containerClass="moderation-page__reason"
        >
          <option :value="undefined">{{ t('moderation_page.all_reasons') }}</option>
          <option
            v-for="reason in ConfigLoader.get('report.chapterReasons')"
            :key="reason"
            :value="reason"
          >
            {{ t(`common.report_reasons.${reason}`) }}
          </option>
        </SelectComponent>
      </div>

      <p
        v-if="isLoaded && reportedContents.length === 0"
        class="moderation-page__empty | color-neutral-700 text-center py-40"
      >
        {{ t('moderation_page.empty') }}
      </p>

      <ul class="d-flex f-column g-10">
        <li
          v-for="reportedContent in reportedContents"
          :key="`${reportedContent.type}-${reportedContent.id}`"
          class="moderation-page__content | d-flex j-between a-center g-20 bg-neutral-200 radius-10 p-15"
        >
          <div class="d-flex f-column g-5">
            <span class="moderation-page__type | fs-300 fw-700 color-neutral-700">
              {{ t(`moderation_page.types.${reportedContent.type}`) }}
            </span>

            <router-link
              :to="caseRoute(reportedContent)"
              class="moderation-page__link | link-inline"
            >
              <template v-if="reportedContent.chapter">
                {{ reportedContent.chapter.title }}
              </template>
              <span
                v-else
                class="moderation-page__excerpt"
              >
                {{ reportedContent.comment.content }}
              </span>
            </router-link>

            <span
              v-if="reportedContent.chapter"
              class="moderation-page__context | fs-300 color-neutral-700"
            >
              {{
                t('moderation.context', {
                  novel: reportedContent.chapter.novel.title,
                  author: reportedContent.chapter.author.username,
                })
              }}
            </span>
            <span
              v-else
              class="moderation-page__context | fs-300 color-neutral-700"
            >
              {{
                t('moderation.context', {
                  novel: reportedContent.comment.novel.title,
                  author: reportedContent.comment.author.username,
                })
              }}
            </span>

            <span class="moderation-page__reasons | fs-300">
              <template
                v-for="(reason, index) in reportedContent.reasons"
                :key="reason"
              >
                <template v-if="index > 0">,</template>
                {{ t(`common.report_reasons.${reason}`) }}
              </template>
            </span>
          </div>

          <div class="d-flex f-column a-end fs-300 color-neutral-700 text-end">
            <span class="moderation-page__count | fw-700">
              {{ t('moderation_page.report_count', reportedContent.reportCount) }}
            </span>
            <span>
              {{
                t('moderation_page.reported_at', { date: reportedContent.firstReportedAtFormat })
              }}
            </span>
            <router-link
              :to="caseRoute(reportedContent)"
              class="moderation-page__open | btn btn-primary mt-10"
            >
              <template v-if="filters.status === REPORT_STATUSES.PENDING">
                {{ t('moderation_page.process') }}
              </template>
              <template v-else>
                {{ t('moderation_page.view') }}
              </template>
            </router-link>
          </div>
        </li>
      </ul>

      <PaginatorComponent
        :params="pagination"
        :cb="load"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.moderation-page {
  min-height: 100vh;

  &__body {
    margin: 0 auto;
    max-width: 1200px;
  }

  &__excerpt {
    display: -webkit-box;
    overflow: hidden;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
  }
}
</style>
