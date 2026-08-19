<script setup>
import { computed, watch } from 'vue'
import { onKeyStroke } from '@vueuse/core'
import { auth, route, t } from '@/services/shortcuts/services-shortcut.js'

const currentRoute = route.current()

const isOpen = defineModel('open', { type: Boolean, default: false })

const label = computed(() => (isOpen.value ? t('header.menu_close') : t('header.menu_open')))

const close = () => {
  isOpen.value = false
}

const toggle = () => {
  isOpen.value = !isOpen.value
}

watch(currentRoute, close)

onKeyStroke('Escape', close)

const handleLogout = async () => {
  close()
  await auth.logout()
}
</script>

<template>
  <button
    type="button"
    @click="toggle"
    class="header-burger | pointer d-flex a-center"
    :class="{ 'header-burger--active': isOpen }"
    :aria-label="label"
    :aria-expanded="isOpen"
    aria-controls="header-side-panel"
  >
    <span class="header-burger__bars">
      <span class="header-burger__bar"></span>
    </span>
  </button>

  <div
    class="header-side"
    :class="{ 'header-side--open': isOpen }"
  >
    <div
      @click="close"
      class="header-side__backdrop"
    ></div>

    <nav
      id="header-side-panel"
      class="header-side__panel"
      :aria-hidden="!isOpen"
    >
      <ul class="header-side__items | d-flex f-column">
        <li>
          <router-link
            :to="{ name: 'novel-create' }"
            @click="close"
            class="header-create | header-side__link | d-flex a-center g-25"
          >
            <span class="header-side__label | flex-1">{{ t('header.create_novel') }}</span>
            <i class="header-side__icon | fa-regular fa-square-plus"></i>
          </router-link>
        </li>

        <li>
          <router-link
            :to="{ name: 'drafts' }"
            @click="close"
            class="header-drafts | header-side__link | d-flex a-center g-25"
          >
            <span class="header-side__label | flex-1">{{ t('header.drafts') }}</span>
            <i class="header-side__icon | fa-regular fa-file-lines"></i>
          </router-link>
        </li>

        <li>
          <router-link
            :to="{ name: 'favorites' }"
            @click="close"
            class="header-favorites | header-side__link | d-flex a-center g-25"
          >
            <span class="header-side__label | flex-1">{{ t('header.favorites') }}</span>
            <i class="header-side__icon | fa-regular fa-heart"></i>
          </router-link>
        </li>

        <li class="header-side__separator"></li>

        <li>
          <button
            type="button"
            @click="handleLogout"
            class="header-logout | header-side__link | d-flex a-center g-25"
          >
            <span class="header-side__label | flex-1">{{ t('header.logout') }}</span>
            <i class="header-side__icon | fa-solid fa-right-from-bracket"></i>
          </button>
        </li>
      </ul>
    </nav>
  </div>
</template>

<style lang="scss">
@use '@/assets/scss/variables';

$bar-height: 60px;

.header-burger {
  border: none;
  background-color: transparent;
  padding: 0 5px;

  &__bars {
    position: relative;
    display: flex;
    align-items: center;
    width: 30px;
    height: 24px;
    transition: height 300ms;
  }

  &__bar,
  &__bar::before,
  &__bar::after {
    display: block;
    width: 30px;
    height: 4px;
    border-radius: 2px;
    background-color: var(--neutral-100);
  }

  &__bar {
    transition:
      width 300ms,
      background-color 300ms;
  }

  &__bar::before,
  &__bar::after {
    content: '';
    position: absolute;
    transform-origin: 0 50%;
    transition:
      transform 300ms,
      width 300ms,
      background-color 300ms;
  }

  &__bar::before {
    top: 0;
  }
  &__bar::after {
    bottom: 0;
  }

  &:hover &__bar,
  &:hover &__bar::before,
  &:hover &__bar::after {
    background-color: var(--primary);
  }

  &--active &__bars {
    height: 30px;
  }

  &--active &__bar {
    width: 0;
  }

  &--active &__bar::before {
    width: 38px;
    transform: rotate(42deg);
    background-color: var(--primary);
  }

  &--active &__bar::after {
    width: 38px;
    transform: rotate(-42deg);
    background-color: var(--primary);
  }
}

.header-side {
  position: fixed;
  inset: $bar-height 0 0 0;
  z-index: 50;
  pointer-events: none;

  &__backdrop {
    position: absolute;
    inset: 0;
    background-color: var(--neutral-900);
    opacity: 0;
    transition: opacity 300ms;
  }

  &__panel {
    position: absolute;
    inset: 0 0 0 auto;
    width: 0;
    overflow: hidden;
    padding-block: 20px;
    background-color: var(--neutral-200);
    transition: width 300ms;
  }

  &__items {
    min-width: 275px;
  }

  &__link {
    width: 100%;
    height: 42px;
    padding: 0 25px;
    border: none;
    background-color: transparent;
    color: var(--neutral-900);
    font-size: var(--fs-600);
    cursor: pointer;
    transition: background-color 300ms;

    &:hover {
      background-color: var(--primary-100);
    }
  }

  &__label {
    text-align: left;
    white-space: nowrap;
    opacity: 0;
    transition: opacity 150ms;
  }

  &__icon {
    display: inline-flex;
    justify-content: center;
    width: 25px;
    font-size: var(--fs-icon-400);
  }

  &__separator {
    margin: 5px 25px;
    border-top: 1px solid var(--neutral-400);
  }

  &--open {
    pointer-events: auto;

    .header-side__backdrop {
      opacity: 0.3;
    }

    .header-side__panel {
      width: 275px;

      @media (max-width: variables.$sm) {
        width: 100%;
      }
    }

    .header-side__label {
      opacity: 1;
      transition: opacity 200ms 150ms;
    }
  }
}
</style>
