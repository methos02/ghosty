<script setup>
import Locale from "@brugmann/vuemann/src/services/locale/views/LocaleComponent.vue";
import { t } from "@brugmann/vuemann/src/services/services-helper";
import { ref, onMounted, onUnmounted, watch } from 'vue';
import { ConfigLoader } from "@brugmann/vuemann/src/config/config-loader.js";
import { servicesM } from "@brugmann/vuemann/src/services/services-manager.js";
import { authStore } from "@brugmann/vuemann/src/services/auth/auth-store.js";
import { route as routeH, router } from "@brugmann/vuemann/src/services/services-helper.js";
import { storeToRefs } from "pinia";

defineProps({
  title: {type: String, default: ''},
  documentation: {type: String, default: undefined}
})

const routeCurrent = routeH.current()
const routes = router.getRoutes().filter(route => route.meta.sidebar).toSorted((a, b) => a.meta.sidebar.order - b.meta.sidebar.order)
const sidebarShow = ref(routeCurrent.meta?.sidebarShow !== false)
watch(routeCurrent, newRoute => { sidebarShow.value = newRoute.meta?.sidebarShow !== false })

const headerHeight = 100
const iconTranslateY = ref(`translateY(${headerHeight}px)`);
const handleScroll = () => {
  const translate = Math.max(headerHeight - window.scrollY, 0);
  iconTranslateY.value = translate >= 0 ? `translateY(${translate}px)` : `translateY(${headerHeight}px)`
};

onMounted(() => window.addEventListener('scroll', handleScroll));
onUnmounted(() => window.removeEventListener('scroll', handleScroll));

const activeHamburger = ref(false)
const sidebarOpen = ref(false)

const toggleSidebar = () => {
  sidebarOpen.value = !sidebarOpen.value
  activeHamburger.value = !activeHamburger.value
}
const closeSidebar = () => {
  sidebarOpen.value = false
  activeHamburger.value = false
}

const logout = () => {
  servicesM.service('auth:logout')
}

const { currentUser } = storeToRefs(authStore.get())
</script>

<template>
  <header class="header | bg-primary p-25">
    <nav class="d-flex a-center g-20">
      <button 
        v-if="routes.length > 0 && sidebarShow && routeCurrent.meta.sidebar !== false"
        id="hamburger-button"
        type="button"
        @click="toggleSidebar()"
        class="div-hamburger | bg-primary-700-hover p-10 pointer radius-5"
        :title="t(sidebarOpen ? 'sidebar.hide' : 'sidebar.show')"
         :class="{active: activeHamburger}"
      >
        <div class="hamburger">
          <span class="hamburger-center"></span>
        </div>
      </button>
      <a :href="ConfigLoader.get('app.homepage_url')" class="header-logo_link" :title="t('app.intranet_link')">
        <picture class="header-logo">
          <source :srcset="`/images/vuemann/brugmann-logo_white.svg`" media="(min-width:850px)" />
          <img :src="`/images/vuemann/brugmann-logo_white-xs.png`" :alt="t('app.logo')" />
        </picture>
      </a>
    </nav>
    <h1 class="header-h1 | h1 f-center text-center color-neutral-100">{{ title }} </h1>
    <nav class="d-flex j-end a-center g-5">
      <Locale />
      <a 
        v-if="documentation && currentUser !== undefined"
        :href="documentation" 
        class="p-10 radius-5 bg-primary-300-hover pointer color-neutral-100 fw-2rem"
        target="_blank"
        :title="t('app.documentation_link')"
      >
        <i class="fa-solid fa-book"></i>
      </a>
      <button
        v-if="currentUser !== undefined"
        id="logout_button"
        @click="logout"
        type="button"
        title="Logout"
        class="p-10 radius-5 bg-primary-300-hover pointer color-neutral-100 fw-2rem"
      >
        <i class="fa-solid fa-right-from-bracket"></i>
      </button>
    </nav>
  </header>
  <div
    id="sidebar"
    v-if="routes.length > 0 && sidebarShow && routeCurrent.meta.sidebar !== false"
    class="sidebar | p-15" 
    :class="{ open : sidebarOpen}" 
  >
    <nav>
      <ul class="sidebar-lu" :style="{'transform': iconTranslateY}">
        <li 
          v-for="route in routes" :key="route.name"
          class="sidebar-li"
        >
          <router-link 
            :id="`link-${route.name}`"
            :to="{ name: route.name}" 
            class="sidebar-button" 
            activeClass="active"
          >
            <i class="sidebar-icon" :class="route.meta.sidebar.icon"></i>
            <span class="sidebar-label">{{ t(route.meta.sidebar.label) }}</span>
          </router-link>
        </li>
      </ul>
    </nav>
 </div>
 <div class="sidebar-bg" :class="{ open : sidebarOpen}" @click="closeSidebar()"></div>
</template>

<style lang="scss">
  @use "../assets/scss/variables";

.header {
  display: grid;
  grid-template-columns: minmax(50px,25vw) 1fr minmax(50px,25vw);
  height: var(--header-height);
  z-index: 10;

  &-logo {
    &_link { justify-self: start; }
  }

  &-h1 {
    font-size : clamp(1.3rem, 4vw, 1.8rem);
    color: var(--neutral-100)
  }
}

.div-hamburger {
  display: flex;
  align-items: center;
  position: relative;

  .hamburger {
    position: relative;
    display: flex;
    align-items: center;
    height: 24px;
    width: 30px;
    transition: height 0.3s;

    &-center, &-center::after, &-center::before {
        width: 30px;
        height: 4px;
        display: block;
        background-color: var(--neutral-100);
        border-radius: 2px;
    }

    &-center { transition: width 0.3s, background-color 0.3s; }
    &-center::after, &-center::before {
        content: '';
        transition: transform 0.3s, width 0.3s, background-color 0.3s;
        transform-origin: 0 50%;
        position: absolute;
    }

    &-center::before { top: 0; }
    &-center::after { bottom: 0; }
  }

  &.active .hamburger { height: 30px; }
  &.active .hamburger-center { width: 0; }
  &.active .hamburger-center::before {
      transform: rotate( 42deg );
      width: 38px;
  }
  &.active .hamburger-center::after {
      transform: rotate( -42deg );
      width: 38px;
  }
}

.sidebar {
  position: fixed;
  inset: 0 auto 0 0;
  border-right: 2px solid var(--neutral-300);
  background-color: var(--neutral-100);
  z-index: 5;
  transition: transform 300ms;

  @media (max-width: variables.$xxl) {
    transform: translateX(-100px);
  }

  &-lu {
    display: flex;
    flex-direction: column;
    gap: 2px
  }

  &-button {
    display: flex;
    align-items: center;
    gap: 10px;
    max-width: 50px;
    padding: 10px;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 300ms, max-width 300ms;

    &.active, &:hover {
      background-color: var(--neutral-300);
    }
  }

  &-icon {
    width: 30px;
    color: var(--primary);
    font-size: 1.4rem;
    text-align: center;
    flex-shrink: 0;
  }

  &-label {
    color: var(--neutral-800);
    opacity: 0;
    transition: opacity 250ms;
    flex-shrink: 0;
    pointer-events: none;
  }

  &-bg {
    position: fixed;
    inset: 0;
    z-index: 4;
    background-color: var(--neutral-900);
    opacity: 0;
    pointer-events: none;
    transition: opacity 300ms;

    @media (max-width: variables.$xxl) {
      &.open { 
        opacity: 0.5; 
        pointer-events: inherit; 
      }
    }
  }

  &.open {
    @media (max-width: variables.$xxl) {
      transform: translateX(0);
    }

    .sidebar-button { max-width: 500px; }
    .sidebar-label { 
      opacity: 1; 
      pointer-events: auto;
    }
  }
}
</style>
