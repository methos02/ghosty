<script setup>
import { t } from '@/services/shortcuts/services-shortcut.js'
import { ConfigLoader } from '@/config/config-loader.js'

defineProps({
  messageKey: {
    type: String,
    required: true,
  },
  action: {
    type: Object,
    default: undefined,
  },
})

const title = ConfigLoader.find('app.title')
const homepageUrl = ConfigLoader.find('app.homepage_url')
const logo = ConfigLoader.find('app.logo', {
  large: '/images/vuemann/brugmann-logo_white.svg',
  xs: '/images/vuemann/brugmann-logo_white-xs.png',
})
</script>

<template>
  <div class="error-layout | f-column">
    <header class="error-header | bg-primary p-25 color-neutral-100">
      <a
        :href="homepageUrl"
        class="error-header-logo"
        :title="t('app.intranet_link')"
      >
        <picture>
          <source
            :srcset="logo.large"
            media="(min-width:850px)"
          />
          <img
            :src="logo.xs"
            :alt="t('app.logo')"
          />
        </picture>
      </a>
      <h1 class="error-header-title | h1 text-center color-neutral-100">
        {{ title ? t(title) : '' }}
      </h1>
      <span></span>
    </header>

    <div class="error-screen | f-column f-center g-15 bg-neutral-200 color-neutral-800">
      <p class="text-center">{{ t(messageKey) }}</p>
      <button
        v-if="action"
        class="btn btn-primary btn-primary-400-active"
        type="button"
        @click="action.callback"
      >
        {{ t(action.labelKey) }}
      </button>
    </div>
  </div>
</template>

<style scoped lang="scss">
.error-layout {
  min-height: 100vh;
}

.error-header {
  display: grid;
  grid-template-columns: minmax(50px, 25vw) 1fr minmax(50px, 25vw);
  align-items: center;
  height: var(--header-height);

  &-logo {
    justify-self: start;
  }
  &-title {
    font-size: clamp(1.3rem, 4vw, 1.8rem);
  }
}

.error-screen {
  flex: 1;
}
</style>
