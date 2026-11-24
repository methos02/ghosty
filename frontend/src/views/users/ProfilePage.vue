<script setup>
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import Header from '@/views/layout/HeaderComponent.vue'
import ProfileBranchList from '@/views/users/parts/ProfileBranchList.vue'
import ProfileChapterList from '@/views/users/parts/ProfileChapterList.vue'
import ProfileCoverList from '@/views/users/parts/ProfileCoverList.vue'
import ProfileNovelList from '@/views/users/parts/ProfileNovelList.vue'
import ProfileStatistics from '@/views/users/parts/ProfileStatistics.vue'
import { route, router, t } from '@/services/shortcuts/services-shortcut.js'
import { STATUS } from '@/constants/ajax-constants.js'
import { PROFILE_TABS, USER_ROLES } from '@/constants/user-constants.js'
import { useProfileHead } from '@/head/use-profile-head.js'
import { useReport } from '@/core-vue/composables/reports/use-report.js'
import { useUserProfile } from '@/core-vue/composables/users/use-user-profile.js'
import { useProfileStore } from '@/core-vue/stores/users/profile-store.js'
import { useAuthStore } from '@/services/auth/src/auth-store.js'
import { ajaxHelper } from '@/core/helpers/ajax-helper.js'
import { profileSlugHelper } from '@/core/helpers/profile-slug-helper.js'

const DISPLAYED_ROLES = [
  USER_ROLES.AUTHOR,
  USER_ROLES.ILLUSTRATOR,
  USER_ROLES.MODERATOR,
  USER_ROLES.ADMIN,
]

const currentRoute = route.current()
const authStore = useAuthStore()
const profileStore = useProfileStore()
const { userProfile } = useUserProfile({ profileStore })
const { report } = useReport()

const profile = profileStore.profile
const isNotFound = ref(false)
const state = { isUnmounted: false }

const profileSlug = computed(() => currentRoute.value.params.profileSlug)

const isRenamed = computed(() => currentRoute.value.query.renamed !== undefined)

const openedTab = computed(() => currentRoute.value.query.tab ?? PROFILE_TABS.NOVELS)

const isOwnProfile = computed(() => authStore.user.value?.id === profile.value?.id)

const displayedRoles = computed(() =>
  DISPLAYED_ROLES.filter(role => profile.value.roles.includes(role)),
)

useProfileHead(profile)

const tabClasses = tab => {
  return openedTab.value === tab ? 'btn btn-primary' : 'btn btn-primary-alt'
}

const openTab = tab => {
  router.push({
    name: 'profile',
    params: { profileSlug: profileSlug.value },
    query: { tab },
  })
}

const load = async () => {
  isNotFound.value = false

  const response = await userProfile.load(profileSlug.value)
  if (state.isUnmounted) {
    return
  }

  if (response.status === STATUS.NOT_FOUND) {
    isNotFound.value = true
    return
  }

  if (!ajaxHelper.isSuccess(response.status)) {
    return
  }

  const canonicalLocation = profileSlugHelper.canonicalLocation(currentRoute.value, profile.value)
  if (canonicalLocation) {
    router.replace(canonicalLocation)
  }
}

watch(profileSlug, load)

onMounted(load)

onUnmounted(() => {
  state.isUnmounted = true
  profileStore.clear()
})
</script>

<template>
  <div class="profile-page | f-column">
    <Header />

    <div class="profile-page__body | w-xl py-40 px-20 d-flex f-column g-30">
      <p
        v-if="isNotFound"
        class="profile-page__not-found | text-center color-neutral-700 py-40"
      >
        {{ t('profile_page.not_found') }}
      </p>

      <template v-if="profile">
        <p
          v-if="isRenamed"
          class="profile-page__renamed | d-flex a-center g-10 bg-primary-100 radius-10 p-15"
          role="status"
        >
          <i class="fa-solid fa-circle-info color-primary"></i>
          {{ t('profile_page.renamed') }}
        </p>

        <div class="profile-page__identity | d-flex a-center j-between f-wrap g-20">
          <div class="d-flex a-center g-20">
            <img
              v-if="profile.avatarUrl"
              :src="profile.avatarUrl"
              :alt="profile.username"
              class="profile-page__avatar"
            />
            <div
              v-else
              class="profile-page__avatar profile-page__avatar--empty | d-flex a-center j-center"
            >
              <i class="fa-solid fa-user"></i>
            </div>

            <div class="d-flex f-column g-5">
              <h1 class="fs-700 fw-700">
                {{ profile.username }}
              </h1>
              <span class="profile-page__since | fs-300 color-neutral-700">
                {{ t('profile_page.member_since', { date: profile.createdAtFormat }) }}
              </span>
              <ul
                v-if="displayedRoles.length > 0"
                class="profile-page__roles | d-flex f-wrap g-5"
              >
                <li
                  v-for="role in displayedRoles"
                  :key="role"
                  class="profile-page__role | badge"
                >
                  {{ t(`profile_page.roles.${role}`) }}
                </li>
              </ul>
            </div>
          </div>

          <button
            v-if="!isOwnProfile"
            type="button"
            class="profile-page__report | btn btn-sm btn-primary-alt d-flex a-center g-5"
            @click="report.openUserReport(profile)"
          >
            <i class="fa-regular fa-flag"></i>
            {{ t('profile_page.report') }}
          </button>
        </div>

        <ProfileStatistics :statistics="profile.statistics" />

        <nav class="profile-page__tabs | d-flex f-wrap g-10">
          <button
            v-for="tab in PROFILE_TABS"
            :key="tab"
            type="button"
            :class="tabClasses(tab)"
            :aria-pressed="openedTab === tab"
            @click="openTab(tab)"
          >
            {{ t(`profile_page.tabs.${tab}`) }}
          </button>
        </nav>

        <ProfileNovelList v-if="openedTab === PROFILE_TABS.NOVELS" />
        <ProfileChapterList v-if="openedTab === PROFILE_TABS.CHAPTERS" />
        <ProfileBranchList v-if="openedTab === PROFILE_TABS.BRANCHES" />
        <ProfileCoverList v-if="openedTab === PROFILE_TABS.COVERS" />
      </template>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.profile-page {
  min-height: 100vh;

  &__body {
    margin: 0 auto;
    max-width: 1200px;
  }

  &__avatar {
    width: 96px;
    height: 96px;
    border-radius: 50%;
    flex-shrink: 0;
    object-fit: cover;

    &--empty {
      background-color: var(--neutral-200);
      color: var(--neutral-700);
      font-size: 36px;
    }
  }
}
</style>
