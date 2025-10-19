<script setup>
import { servicesM } from '@/services/services-manager.js'
import { useUtilsStore } from '../src/utils-store'
import { watch, ref, onMounted } from 'vue'
import { router, t } from '@/services/services-helper.js'

const props = defineProps({
  version: { type: String, required: true }
})

const utilsStore = useUtilsStore()
const isTestMode = ref(false)
const isProductionMode = ref(false)

watch(utilsStore.instances, instances => updateMode(instances))

const updateMode = instances => {
  const modes = new Set(Object.values(instances))

  if( modes.size === 1) {
    if (modes.has('test')) { isTestMode.value = true; return }
    
    isProductionMode.value = true;
    return;
  }

  // eslint-disable-next-line no-console
  console.error("Les API n'ont pas toutes le même mode :")

  for (const [api, mode] of Object.entries(instances)) {
    // eslint-disable-next-line no-console
    console.error(`${api}: ${mode}`)
  }

  isTestMode.value = isProductionMode.value = true
  isTestMode.value
}

const HOUR = 360_000
onMounted(async () => {
  utilsStore.needUpdate = await servicesM.service('utils:needUpdate', props.version)
  setInterval(async () => utilsStore.needUpdate = await servicesM.service('utils:needUpdate', props.version), HOUR)
})

const reloadPage = () => {
  globalThis.location.reload()
}

const navigateToChangelog = () => {
  router.push({ name: 'changelog' })
}
</script>

<template>
  <div class="instance-div | f-column g-5 py-10 px-20 bg-neutral-100" >
    <div v-if="utilsStore.needUpdate" class="update-banner d-flex g-10 a-center">
      <span class="color-danger fw-700">{{ t('debug_bar.new_version_available') }}</span>
      <button class="btn btn-sm btn-primary" @click="reloadPage">{{ t('debug_bar.refresh_page') }}</button>
    </div>
    <div v-if="isTestMode && !isProductionMode" class="d-flex g-10">
      <i class="fa-brands fa-dev fs-700"></i>
      <p>{{ t('debug_bar.test_mode') }}</p>
    </div>
    <p 
      v-if="isTestMode && isProductionMode" 
      class="color-danger"
    >
      {{ t('debug_bar.different_modes_detected') }} <br />
      {{ t('debug_bar.check_console_details') }}
    </p>
    <div v-if="!utilsStore.needUpdate">
      <p>{{ t('debug_bar.version') }} {{ version }}</p>
      <a 
        v-if="router.hasRoute('changelog')"
        @click="navigateToChangelog"
        class="color-neutral-500 color-primary-300-hover pointer fs-300"
      >
        {{ t('debug_bar.changelog') }}
      </a>
    </div>
  </div>
</template>

<style lang="scss">
.instance-div {
  position: fixed;
  inset: auto auto 0 0;
  border-top: 1px solid var(--neutral-500);
  border-right: 1px solid var(--neutral-500);
  border-radius: 0 5px 0 0;
  z-index: 10;
}
</style>
