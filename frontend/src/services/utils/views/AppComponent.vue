<script setup>
  import { APP_STATUS } from '@/services/utils/utils-constants.js'
  import { utilsStore } from '@/services/utils/src/utils-store.js'
  import Router from '@/services/router/views/RouterComponent.vue';
  import { t, route } from '@/services/services-helper.js'
  import { onMounted, onUnmounted, computed } from 'vue'
  import { routerService } from '@/services/router/init/router-service.js'
  import { STATUS } from '@/services/ajax/ajax-constants.js'
  import { flash } from "@/services/services-helper.js"
  import { AjaxHelpers } from '@/services/ajax/ajax-helpers.js'
  import { servicesM } from '@/services/services-manager.js'
  import { ConfigLoader } from '@/config/config-loader.js'
  import { useRouterStore } from '@/services/router/src/router-store.js'
  
  const props = defineProps({ cb: { type: Function, default: undefined } })
  
  const reloadApp = () => {
    globalThis.location.reload()
  }

  const publicRoutes = new Set(['login', 'changelog'])
  
  const isOnPublicPage = computed(() => {
    const currentRoute = routerService.currentRoute()
    return publicRoutes.has(currentRoute?.value?.name)
  })

  const validateAuthentication = async () => {
    if (ConfigLoader.get('app.auth') === false || isOnPublicPage.value ) { return { status: STATUS.SUCCESS } }

    const apis = Object.entries(ConfigLoader.get('app.apis', {}))
      .filter(api => api[1].auth === true)
      .map(([api_name]) => api_name)

    if (apis.length === 0) { return { status: STATUS.SUCCESS } }

    return await servicesM.service('auth:routesAuthCheck', apis)
  }

  const executeCallback = async () => {
    if(props.cb === undefined) {  
      utilsStore.setAppStatus(APP_STATUS.LOADED)
      return { status: STATUS.SUCCESS } 
    }

    utilsStore.setAppStatus(APP_STATUS.LOADING)

    const result = await props.cb()
    if(result?.status === undefined) {
      utilsStore.setAppStatus(APP_STATUS.ERROR)
      const errorMessage = t('app-component.error.callback-undefined')
      flash.error(errorMessage)
      return { status: STATUS.ERROR_SERVER, error: errorMessage }
    }

    if(result.status !== STATUS.SUCCESS && !AjaxHelpers.isAuthError(result.status)) { 
      utilsStore.setAppStatus(APP_STATUS.ERROR)
      flash.error(result.error) 
      return result
    }
  
    utilsStore.setAppStatus(APP_STATUS.LOADED)
    return result
  }

  const handleLoginSuccess = async () => {
    await executeCallback() 
    document.removeEventListener('login-success', handleLoginSuccess)
  }

  onMounted(async () => {
    // Ajouter l'event listener dès le montage du composant
    document.addEventListener('login-success', handleLoginSuccess)
    
    const authResult = await validateAuthentication()
    if(authResult === false) {
      const routerStore = useRouterStore()
      routerStore.urlIntented = route.current().value.fullPath
      routerService.push('login')
      return
    }

    const result = await executeCallback()

    if(!AjaxHelpers.isAuthError(result.status)) { return }
  })

  onUnmounted(() => {
    document.removeEventListener('login-success', handleLoginSuccess)
  })
</script>

<template>
    <div class="app-container | d-flex flex-1">
        <div 
          v-if="utilsStore.getAppStatus()  === APP_STATUS.LOADED || isOnPublicPage" 
          id="app-container-loaded" 
          class="flex-1"
        >
          <Router />
        </div>
    
        <div 
          v-if="utilsStore.getAppStatus() === APP_STATUS.LOADING && !isOnPublicPage"
          id="app-container-loader"
          class="f-column a-center j-center g-15 flex-1"
        >
          <span class="app-loader | loader-spin"></span>
          <p>{{ t('app-component.loading') }}</p>
        </div>
    
        <div v-if="utilsStore.getAppStatus() === APP_STATUS.ERROR && !isOnPublicPage" class="f-column a-center j-center g-15 flex-1">
          <div id="app-container-error" class="error-message f-column a-center g-15">
            <span class="icon-error">⚠️</span>
            <h2>{{ t('app-component.error.title') }}</h2>
            <p>{{ t('app-component.error.description') }}</p>
            <button @click="reloadApp" class="btn btn-primary">
              {{ t('app-component.error.retry') }}
            </button>
          </div>
        </div> 
    </div>
</template>
