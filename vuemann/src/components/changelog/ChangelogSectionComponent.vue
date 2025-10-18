<script setup>
import { computed, onMounted } from "vue";
import { t } from "@brugmann/vuemann/src/services/services-helper.js";
import ChangelogStore from './changelog-store.js'
const store = ChangelogStore()

const props = defineProps({
  version: { type: String, required: true },
  date: { type: String, required: true },
  features: { type: Array, default: () => [] },
  bugs: { type: Array, default: () => [] },
  optimizations: { type: Array, default: () => [] },
  updates: { type: Array, default: () => [] },
  critical: { type: Array, default: () => [] }
});

onMounted(() => {
  registerItems()
})

const registerItems = () => {
  for (const item in props) {
    if (!Array.isArray(props[item]) || props[item].length === 0) { continue }
    store.registerItemType(item)
  }
}

const shouldShowSection = computed(() => {
  if (store.selectedFilter === 'all') { return true }
  return props[store.selectedFilter]?.length > 0
});
</script>

<template>
  <div v-if="shouldShowSection" class="changelog-version">
    <h3 class="h3 mb-15">{{ t('changelog-section.version', { version, date }) }}</h3>
    
    <div v-if="features.length > 0 && (store.selectedFilter === 'all' || store.selectedFilter === 'features')" class="changelog-category">
      <h4 class="color-neutral-800 fw-500">🚀 {{ t('changelog-section.categories.nouveautes') }}</h4>
      <ul class="changelog-list | list ml-25">
        <li v-for="(item, index) in features" :key="index">{{ item }}</li>
      </ul>
    </div>

    <div v-if="bugs.length > 0 && (store.selectedFilter === 'all' || store.selectedFilter === 'bugs')" class="changelog-category">
      <h4 class="color-neutral-800 fw-500">🐛 {{ t('changelog-section.categories.bugs') }}</h4>
      <ul class="changelog-list | list ml-25">
        <li v-for="(item, index) in bugs" :key="index">{{ item }}</li>
      </ul>
    </div>

    <div v-if="optimizations.length > 0 && (store.selectedFilter === 'all' || store.selectedFilter === 'optimizations')" class="changelog-category">
      <h4 class="color-neutral-800 fw-500">💡 {{ t('changelog-section.categories.optimisations') }}</h4>
      <ul class="changelog-list | list ml-25">
        <li v-for="(item, index) in optimizations" :key="index">{{ item }}</li>
      </ul>
    </div>

    <div v-if="updates.length > 0 && (store.selectedFilter === 'all' || store.selectedFilter === 'updates')" class="changelog-category">
      <h4 class="color-neutral-800 fw-500">🔄 {{ t('changelog-section.categories.updates') }}</h4>
      <ul class="changelog-list | list ml-25">
        <li v-for="(item, index) in updates" :key="index">{{ item }}</li>
      </ul>
    </div>
        
    <div v-if="critical.length > 0 && (store.selectedFilter === 'all' || store.selectedFilter === 'critical')" class="changelog-category changelog-critical">
      <h4 class="color-white fw-600">⚠️ {{ t('changelog-section.categories.critique') }}</h4>
      <ul class="changelog-list | list ml-25">
        <li v-for="(item, index) in critical" :key="index">{{ item }}</li>
      </ul>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.changelog-version {
  border-left: 4px solid #007bff;
  padding-left: 20px;
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 20px;
}

.changelog-version::before {
  content: '';
  position: absolute;
  left: -8px;
  top: 0;
  width: 12px;
  height: 12px;
  background: #007bff;
  border-radius: 50%;
}

.changelog-category {
  background: #f8f9fa;
  padding: 15px;
  border-radius: 8px;
  border: 1px solid #e9ecef;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.changelog-list li {
  margin-bottom: 5px;
}

.changelog-critical { 
  background: var(--danger-300);
  border: 1px solid var(--danger);
}
</style> 
