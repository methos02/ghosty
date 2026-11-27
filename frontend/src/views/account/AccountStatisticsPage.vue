<script setup>
import { onMounted, onUnmounted } from 'vue'
import ProfileStatistics from '@/views/users/parts/ProfileStatistics.vue'
import { useUserProfile } from '@/core-vue/composables/users/use-user-profile.js'
import { useProfileStore } from '@/core-vue/stores/users/profile-store.js'
import { useAuthStore } from '@/services/auth/src/auth-store.js'

const authStore = useAuthStore()
const profileStore = useProfileStore()
const { userProfile } = useUserProfile({ profileStore })

const profile = profileStore.profile

onMounted(() => userProfile.load(authStore.user.value.profileSlug))

onUnmounted(() => profileStore.clear())
</script>

<template>
  <ProfileStatistics
    v-if="profile"
    :statistics="profile.statistics"
  />
</template>
