<script setup>
import { ref, computed, provide, watch } from 'vue'

const props = defineProps({
  modelValue: { type: String, default: '' },
})

const emit = defineEmits(['update:modelValue'])

const registeredTabs = ref([])
const internalActiveKey = ref(props.modelValue)

const activeKey = computed(() => {
  if (registeredTabs.value.length === 0) {
    return ''
  }

  const isValidKey = registeredTabs.value.some(tab => tab.key === internalActiveKey.value)
  if (!isValidKey) {
    return registeredTabs.value[0].key
  }

  return internalActiveKey.value
})

watch(
  () => props.modelValue,
  newValue => {
    internalActiveKey.value = newValue
  },
)

const register = tab => {
  const exists = registeredTabs.value.some(t => t.key === tab.key)
  if (exists) {
    return
  }

  registeredTabs.value.push(tab)
}

const unregister = tabKey => {
  registeredTabs.value = registeredTabs.value.filter(t => t.key !== tabKey)
}

provide('tabs', {
  activeKey,
  register,
  unregister,
})

const handleTabClick = tabKey => {
  internalActiveKey.value = tabKey
  emit('update:modelValue', tabKey)
}
</script>

<template>
  <!-- Hidden slot to allow TabItems to register -->
  <slot v-if="registeredTabs.length === 0"></slot>

  <div
    v-if="registeredTabs.length > 0"
    class="tabs"
  >
    <div
      class="tabs-header"
      role="tablist"
    >
      <button
        v-for="tab in registeredTabs"
        :key="tab.key"
        type="button"
        role="tab"
        class="tabs-header__button"
        :class="{
          'tabs-header__button--active': activeKey === tab.key,
        }"
        :aria-selected="activeKey === tab.key"
        :data-testid="`tab-${tab.key}`"
        @click="handleTabClick(tab.key)"
      >
        <i
          v-if="tab.icon"
          :class="tab.icon"
        ></i>
        {{ tab.label }}
      </button>
    </div>

    <div class="tabs-content">
      <slot></slot>
    </div>
  </div>
</template>
