<script setup>
import { computed, onMounted, ref } from 'vue'
import Header from '@/views/layout/HeaderComponent.vue'
import ModerationDecisionForm from '@/views/moderation/parts/ModerationDecisionForm.vue'
import ModerationReportList from '@/views/moderation/parts/ModerationReportList.vue'
import ModerationSanctionHistory from '@/views/moderation/parts/ModerationSanctionHistory.vue'
import ProfileStatistics from '@/views/users/parts/ProfileStatistics.vue'
import UserLink from '@/views/parts/UserLink.vue'
import { route, t } from '@/services/shortcuts/services-shortcut.js'
import { ModerationController } from '@/apis/moderation/controllers/moderation-controller.js'
import { REPORTED_CONTENT_TYPES, RESOLUTIONS } from '@/constants/moderation-constants.js'
import { useModerationHead } from '@/head/use-moderation-head.js'
import { ajaxHelper } from '@/core/helpers/ajax-helper.js'

useModerationHead()

const USER_RESOLUTIONS = [RESOLUTIONS.DISMISSED, RESOLUTIONS.SANCTIONED]

const userId = computed(() => Number(route.current().value.params.id))

const moderationCase = ref()

const canDecide = computed(() => moderationCase.value.reports.some(report => report.isPending))

const load = async () => {
  const response = await ModerationController.showUser(userId.value)
  if (!ajaxHelper.isSuccess(response.status)) {
    return
  }

  moderationCase.value = response.moderationCase
}

onMounted(load)
</script>

<template>
  <div class="moderation-user-page | f-column">
    <Header />

    <div
      v-if="moderationCase"
      class="moderation-user-page__body | w-xl py-40 px-20 d-flex f-column g-30"
    >
      <div class="d-flex f-column g-5">
        <router-link
          :to="{ name: 'moderation' }"
          class="moderation-user-page__back | link-inline fs-300"
        >
          {{ t('moderation.back_to_queue') }}
        </router-link>
        <h1 class="fs-700 fw-700">
          {{ t('moderation_user_page.title', { username: moderationCase.user.username }) }}
        </h1>
        <span class="moderation-user-page__since | fs-300 color-neutral-700">
          {{
            t('moderation_user_page.member_since', { date: moderationCase.user.createdAtFormat })
          }}
          ·
          <UserLink :username="moderationCase.user.username" />
        </span>
      </div>

      <ProfileStatistics :statistics="moderationCase.user.statistics" />

      <ModerationReportList :reports="moderationCase.reports" />

      <ModerationSanctionHistory :sanctions="moderationCase.authorSanctions" />

      <ModerationDecisionForm
        v-if="canDecide"
        :contentType="REPORTED_CONTENT_TYPES.USER"
        :contentId="moderationCase.user.id"
        :resolutions="USER_RESOLUTIONS"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.moderation-user-page {
  min-height: 100vh;

  &__body {
    margin: 0 auto;
    max-width: 900px;
  }
}
</style>
