<script setup>
import ChangelogStore from './changelog-store.js'
import { t } from "@brugmann/vuemann/src/services/services-helper.js";
import { router } from "@brugmann/vuemann/src/services/services-helper.js";

const props = defineProps({
  defaultLink: { type: String, default: 'home' },
  title: { type: String, default: 'changelog.title' },
  description: { type: String, default: 'changelog.description' }
});

const store = ChangelogStore()

const HISTORY_BACK_STEP = -1
const goBack = () => {
  if (globalThis.history.length > 1) {
    globalThis.history.go(HISTORY_BACK_STEP)
    return
  }
  
  router.push({ name: props.defaultLink })
}

const itemTypes = [
  { key: 'all', label: 'changelog.filters.all', icon: '📋' },
  { key: 'features', label: 'changelog.filters.features', icon: '🚀' },
  { key: 'bugs', label: 'changelog.filters.bugs', icon: '🐛' },
  { key: 'optimizations', label: 'changelog.filters.optimizations', icon: '💡' },
  { key: 'updates', label: 'changelog.filters.updates', icon: '🔄' },
  { key: 'critical', label: 'changelog.filters.critical', icon: '⚠️' }
];
</script>

<template>
  <div class="d-flex j-between a-end my-25">
    <h2 class="h2">
      {{ t(title)}}
    </h2>
    <button 
      @click="goBack"
      class="btn btn-primary"
    >
      <i class="fa-solid fa-arrow-left mr-5"></i>
      {{ t('changelog.back') }}
    </button>
  </div>

  <p class="mb-20">
    {{ t(description) }}
  </p>
  
  <!-- Filtres -->
  <div class="changelog-filters mb-20">
    <div class="d-flex g-10 flex-wrap">
      <button
        v-for="type in itemTypes"
        :key="type.key"
        @click="store.changeFilter(type.key)"
        :class="[
          'filter-btn',
          { 'active': store.selectedFilter === type.key, 'd-none': !store.isTypeAvailable(type.key) }
        ]"
      >
        <span class="filter-icon">{{ type.icon }}</span>
        {{ t(type.label) }}
      </button>
    </div>
  </div>
  
  <div class="changelog-content | f-column g-25">
    <slot></slot>
  </div>
</template>

<style lang="scss">
.changelog-content {
  max-width: 800px;
}

.changelog-filters {
  .filter-btn {
    padding: 8px 16px;
    border: 1px solid #e9ecef;
    border-radius: 20px;
    background: #fff;
    color: #6c757d;
    cursor: pointer;
    transition: all 0.2s ease;
    font-size: 14px;
    
    &:hover:not(:disabled) {
      border-color: #007bff;
      color: #007bff;
    }
    
    &.active {
      background: #007bff;
      border-color: #007bff;
      color: #fff;
    }
    
    .filter-icon {
      font-size: 16px;
    }
  }
}
</style> 
