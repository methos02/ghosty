<script setup>
import { computed, ref } from 'vue'
import { useIntersectionObserver } from '@vueuse/core'
import SelectComponent from '@/services/form/views/inputs/SelectComponent.vue'
import { route, router, t } from '@/services/shortcuts/services-shortcut.js'

defineProps({
  items: { type: Array, required: true },
  labelPath: { type: String, required: true },
})

const currentRoute = route.current()

const openedTab = computed({
  get: () => currentRoute.value.name,
  set: tab => router.push({ name: tab }),
})

const isOpened = tab => openedTab.value === tab

const select = ref()
const isStuck = ref(false)

const selectClasses = computed(() =>
  isStuck.value ? 'tabs-layout__select tabs-layout__select--stuck' : 'tabs-layout__select',
)

useIntersectionObserver(
  () => select.value?.$el,
  ([entry]) => {
    isStuck.value = entry.intersectionRatio < 1 && entry.boundingClientRect.top < 0
  },
  { threshold: [1] },
)
</script>

<template>
  <SelectComponent
    ref="select"
    v-model="openedTab"
    name="tab"
    :noLabel="true"
    :error="false"
    :containerClass="selectClasses"
  >
    <option
      v-for="item in items"
      :key="item.tab"
      :value="item.tab"
    >
      {{ t(`${labelPath}.${item.tab}`) }}
    </option>
  </SelectComponent>

  <div class="tabs-layout | d-flex a-start g-30">
    <nav class="tabs-layout__menu | bg-neutral-200 radius-10 py-10">
      <ul class="d-flex f-column">
        <li
          v-for="item in items"
          :key="item.tab"
        >
          <router-link
            :to="{ name: item.tab }"
            :aria-current="isOpened(item.tab) ? 'page' : undefined"
            class="tabs-layout__link | d-flex a-center g-15 px-20 py-10"
            :class="{ 'tabs-layout__link--current': isOpened(item.tab) }"
          >
            <i
              class="tabs-layout__icon"
              :class="item.icon"
            ></i>
            {{ t(`${labelPath}.${item.tab}`) }}
          </router-link>
        </li>
      </ul>
    </nav>

    <div class="tabs-layout__content | flex-1 d-flex f-column g-30">
      <slot></slot>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use '@/assets/scss/variables';

.tabs-layout {
  &__select {
    display: none;

    @media (max-width: variables.$sm) {
      display: block;
      position: sticky;
      top: -1px;
      z-index: 10;
      margin-inline: -20px;
      padding: 10px 20px;
      background-color: var(--neutral-100);

      &--stuck {
        background-color: var(--neutral-300);
      }

      &::after {
        top: 50%;
        right: 35px;
        transform: translateY(-50%);
        font-size: 14px;
      }

      :deep(select) {
        height: 50px;
        padding: 0 40px 0 15px;
        border-radius: 10px;
        font-size: var(--fs-600);
        font-weight: 600;
      }
    }
  }

  &__menu {
    flex-shrink: 0;
    width: 240px;

    @media (max-width: variables.$sm) {
      display: none;
    }
  }

  &__content {
    min-width: 0;
  }

  &__link {
    border-left: 3px solid transparent;
    color: var(--neutral-900);
    transition: background-color 300ms;

    &:hover {
      background-color: var(--primary-100);
    }

    &--current {
      border-left-color: var(--primary);
      background-color: var(--primary-100);
      color: var(--primary);
      font-weight: 700;
    }
  }

  &__icon {
    width: 20px;
    text-align: center;
  }
}
</style>
