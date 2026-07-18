<script setup>
import { APP_STATUS } from '@brugmann/vuemann/src/constants/utils-constants.js'
import { utilsStore } from '@brugmann/vuemann/src/services/utils/src/utils-store.js'
import View from '@brugmann/vuemann/src/services/router/views/ViewComponent.vue'
import { t, routerStore } from '@brugmann/vuemann/src/shortcuts/services-shortcut.js'
import { onMounted, onUnmounted, onErrorCaptured, computed } from 'vue'
import { routerService } from '@brugmann/vuemann/src/services/router/router-service.js'
import { STATUS } from '@brugmann/vuemann/src/constants/ajax-constants.js'
import { servicesM } from '@brugmann/vuemann/src/services/services-manager.js'
import { ConfigLoader } from '@brugmann/vuemann/src/config/config-loader.js'
import { utilsService } from '@brugmann/vuemann/src/services/utils/utils-service.js'
import { locationHelper } from '@brugmann/vuemann/src/helpers/location-helper.js'

const props = defineProps({
  cb: { type: Function, default: undefined },
})

const reloadApp = () => {
  locationHelper.reload()
}

const publicRoutes = new Set(['login', 'services.utils.appComponent'])
const publicPaths = new Set(['/login'])

const isOnPublicPage = computed(() => {
  const currentRoute = routerService.currentRoute()
  return publicRoutes.has(currentRoute?.value?.name)
})

const isInitiate = computed(() => {
  return utilsStore.getAppStatus() !== APP_STATUS.INIT
})

const showLoader = computed(() => {
  const status = utilsStore.getAppStatus()
  return status === APP_STATUS.INIT || status === APP_STATUS.LOADING
})

const errorMessage = computed(() => {
  return utilsStore.getAppError() || t('app-component.error.description')
})

const validateAuthentication = async () => {
  if (ConfigLoader.find('app.auth') === false || isOnPublicPage.value) {
    return { status: STATUS.SUCCESS }
  }

  return await servicesM.service('auth:routesAuthCheck')
}

const executeCallback = async () => {
  if (props.cb === undefined) {
    utilsStore.setAppStatus(APP_STATUS.LOADED)
    return { appStatus: APP_STATUS.LOADED }
  }

  const result = await props.cb()
  if (result?.appStatus === undefined) {
    throw new Error(t('app-component.error.callback-undefined'))
  }

  utilsStore.setAppStatus(result.appStatus)
  if (result.appStatus === APP_STATUS.ERROR) {
    utilsStore.setAppError(result.error)
  }

  return result
}

const initApp = async () => {
  const apisResult = await utilsService.apiStatus()
  if (!apisResult.status) {
    utilsStore.setAppError(apisResult.error)
    utilsStore.setAppStatus(APP_STATUS.ERROR)
    return
  }

  utilsStore.setAppStatus(APP_STATUS.LOADING)

  const authResult = await validateAuthentication()
  if (authResult === false) {
    handleAuthenticationFailure()
    await servicesM.service('auth:login')
    return
  }

  if (isOnPublicPage.value) {
    return
  }

  const callbackResult = await executeCallback()
  if (callbackResult.appStatus === APP_STATUS.ERROR) {
    return
  }
}

const handleLoginSuccess = async () => {
  await initApp()
  document.removeEventListener('login-success', handleLoginSuccess)
}

const handleAuthenticationFailure = () => {
  const currentPath = locationHelper.getPathname()
  if (publicPaths.has(currentPath)) {
    return
  }
  routerStore.urlIntented.value =
    currentPath + locationHelper.getSearch() + locationHelper.getHash()
}

onMounted(async () => {
  document.addEventListener('login-success', handleLoginSuccess)
  await initApp()
})

onUnmounted(() => {
  document.removeEventListener('login-success', handleLoginSuccess)
})

onErrorCaptured(error => {
  if (!error.message?.includes('Failed to fetch dynamically imported module')) {
    return
  }

  utilsStore.setAppError(t('app-component.error.dynamic-import'))
  utilsStore.setAppStatus(APP_STATUS.ERROR)
})

defineExpose({ isInitiate })
</script>

<template>
  <div class="app-container | d-flex flex-1">
    <div
      v-if="utilsStore.getAppStatus() === APP_STATUS.LOADED || isOnPublicPage"
      id="app-container-loaded"
      class="flex-1"
    >
      <slot>
        <View />
      </slot>
    </div>

    <div
      v-if="showLoader && !isOnPublicPage"
      id="app-container-loader"
      class="f-column a-center j-center g-15 flex-1"
    >
      <span class="app-loader | loader-spin"></span>
      <p>
        {{ t(utilsStore.getLoadingSentence()) }}
      </p>
    </div>

    <div
      v-if="utilsStore.getAppStatus() === APP_STATUS.ERROR && !isOnPublicPage"
      class="f-column a-center j-center g-15 flex-1"
    >
      <div
        id="app-container-error"
        class="error-message f-column a-center g-15"
      >
        <span class="icon-error">⚠️</span>
        <h2>
          {{ t('app-component.error.title') }}
        </h2>
        <p>
          {{ errorMessage }}
        </p>
        <button
          @click="reloadApp"
          class="btn btn-primary btn-primary-400-active"
        >
          {{ t('app-component.error.retry') }}
        </button>
      </div>
    </div>
  </div>
</template>
