import { req, log } from '@brugmann/vuemann/src/shortcuts/services-shortcut.js'
import { ConfigLoader } from '@brugmann/vuemann/src/config/config-loader.js'
import { AjaxHelpers } from '@brugmann/vuemann/src/helpers/ajax-helpers.js'
import { HydrateFunctions } from '@brugmann/vuemann/src/services/utils/src/utils-hydrate.js'

const HEALTH_CHECK_TIMEOUT = 5000

const createTimeout = duration => {
  return new Promise(resolve => {
    setTimeout(() => resolve({ timedOut: true }), duration)
  })
}

const checkApi = async apiName => {
  try {
    const result = await Promise.race([
      req('api.openapi', { flash: false, api: apiName }),
      utilsServiceInternal.createTimeout(HEALTH_CHECK_TIMEOUT),
    ])

    if (result.timedOut) {
      return { apiName, success: false }
    }
    return { apiName, success: AjaxHelpers.isSuccess(result.status) }
  } catch {
    return { apiName, success: false }
  }
}

const apiStatus = async () => {
  const apis = ConfigLoader.find('app.apis', {})
  const apiNames = Object.keys(apis).filter(name => apis[name].status !== false)
  const results = await Promise.all(apiNames.map(name => utilsServiceInternal.checkApi(name)))

  const failedApis = []
  for (const { apiName, success } of results) {
    if (success) {
      continue
    }

    failedApis.push(apiName)
    log.error(`API unreachable: ${apiName}`)
  }

  if (failedApis.length > 0) {
    return {
      status: false,
      error: `app-component.error.api-unreachable:apis=${failedApis.join(', ')}`,
    }
  }

  return { status: true }
}

const isDeprecated = message => {
  log.warn(
    '%c AVERTISSEMENT : ' + message,
    'color: #1f2932; background: #e6d458; font-size: 14px; font-weight: bold; padding: 5px 25px; border-radius: 4px;',
  )
}

const needUpdate = async version => {
  const response = await fetch('/app.json', { cache: 'no-store' })
  const data = await response.json()
  return data.version !== version
}

/** @type {import('@brugmann/vuemann/src/contracts/utils-contract.js').UtilsService} */
export const utilsService = {
  apiStatus,
  hydrate: HydrateFunctions.hydrate,
  isDeprecated,
  needUpdate,
  registerController: HydrateFunctions.registerController,
}

export const utilsServiceInternal = { checkApi, createTimeout }
