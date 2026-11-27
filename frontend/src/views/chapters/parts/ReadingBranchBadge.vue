<script setup>
import { computed } from 'vue'
import { t } from '@/services/shortcuts/services-shortcut.js'
import { useReadingPosition } from '@/core-vue/composables/chapters/use-reading-position.js'

const { branchLength, isMainBranch } = useReadingPosition()

const badgeClass = computed(() => (isMainBranch.value ? 'badge-primary' : 'badge-info'))

const labelKey = computed(() =>
  isMainBranch.value
    ? 'reading_branch_badge.main_branch'
    : 'reading_branch_badge.main_branch_from_chapter',
)
</script>

<template>
  <span
    v-if="branchLength > 1"
    class="reading-branch-badge | badge"
    :class="badgeClass"
  >
    {{ t(labelKey) }}
  </span>
</template>
