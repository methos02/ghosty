import { req } from '@/services/services-helper.js'
import { useUtilsStore } from '@/services/utils/src/utils-store.js'
import { storeToRefs } from 'pinia'
import { ConfigLoader } from '@/config/config-loader.js'
import { STATUS } from '@/services/ajax/ajax-constants.js'
import { HydrateFunctions } from '@/services/utils/src/utils-hydrate.js'

const apiStatus = async () => {
  const utilsStore = useUtilsStore()
  const { instances } = storeToRefs(utilsStore)
  const apis = Object.entries(ConfigLoader.get('app.apis', {}))
  .filter(api => api[1].status !== false)
  .map(([key]) => key);

  for (const api of apis) {
    const response = await req('api.status', { flash: false, api })
    
    if (response.status !== STATUS.SUCCESS) {
      utilsStore.errorsGlobal.push(`error_api_down:api=${api}`)
      continue
    }

    if (!['production', 'test'].includes(response.data.instance)) {
      utilsStore.errorsGlobal.push(`error_api_instance:api=${api}`)
      continue
    }
    
    instances.value[api] = response.data.instance
  }

  return utilsStore.errorsGlobal.length === 0
}

const isDeprecated = message => {
  // eslint-disable-next-line no-console
  console.log(
    "%c⚠️ AVERTISSEMENT : " + message,
    "color: #1f2932; background: #e6d458; font-size: 14px; font-weight: bold; padding: 5px 25px; border-radius: 4px;"
  );  
}

const needUpdate = async version => {
  const response = await fetch('/app.json', { cache: 'no-store' })
  const data = await response.json()
  return data.version !== version
}

export const utilsService = { 
  apiStatus, 
  isDeprecated, 
  needUpdate, 
  hydrate : HydrateFunctions.hydrate 
}
