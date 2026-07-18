<script setup>
import { servicesM } from '@brugmann/vuemann/src/services/services-manager.js'
import { useUtilsStore } from '@brugmann/vuemann/src/services/utils/src/utils-store.js'
import { ConfigLoader } from '@brugmann/vuemann/src/config/config-loader.js'
import { onMounted } from 'vue'
import { router, t } from '@brugmann/vuemann/src/shortcuts/services-shortcut.js'
import { locationHelper } from '@brugmann/vuemann/src/helpers/location-helper.js'

const appVersion = ConfigLoader.get('app.version')

const { needUpdate } = useUtilsStore()

const HOUR = 360_000
onMounted(async () => {
  needUpdate.value = await servicesM.service('utils:needUpdate', appVersion)

  setInterval(async () => {
    needUpdate.value = await servicesM.service('utils:needUpdate', appVersion)
  }, HOUR)
})

const reloadPage = () => {
  locationHelper.reload()
}

const navigateToChangelog = () => {
  router.push({ name: 'changelog' })
}
</script>

<template>
  <div class="instance-div | f-column g-5">
    <div
      v-if="needUpdate"
      class="update-banner d-flex g-10 a-center"
    >
      <span>{{ t('debug_bar.new_version_available') }}</span>
      <button
        class="btn btn-sm btn-primary btn-primary-400-active"
        @click="reloadPage"
      >
        {{ t('debug_bar.refresh_page') }}
      </button>
    </div>
    <div
      v-if="!needUpdate"
      class="f-column"
    >
      <span class="version-label">{{ t('debug_bar.version') }} {{ appVersion }}</span>
      <a
        v-if="router.hasRoute('changelog')"
        @click="navigateToChangelog"
      >
        {{ t('debug_bar.changelog') }}
      </a>
    </div>
  </div>
</template>

<style lang="scss">
.instance-div {
  position: fixed;
  inset: auto auto 10px 10px;
  z-index: 10;
  color: var(--neutral-100);
  font-size: 0.7rem;
  background-color: rgba(0, 0, 0, 0.5);
  padding: 8px 12px;
  border-radius: 4px;
  backdrop-filter: blur(4px);

  .version-label {
    font-size: 0.85rem;
    line-height: 0.85rem;
    margin-bottom: 2px;
  }

  a {
    font-size: 0.7rem;
    color: var(--neutral-300);
    cursor: pointer;
    text-decoration: underline;

    &:hover {
      color: var(--neutral-100);
    }
  }
}

.update-banner {
  color: var(--danger-300);
  font-weight: 700;
}

@media print {
  .instance-div {
    display: none !important;
  }
}
</style>
