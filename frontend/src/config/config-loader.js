import { locales } from '@/config/locale-config.js'
import { routes } from '@/config/routes-config.js'
import { routesApi } from '@/config/routes-api-config.js'
import { app } from '@/config/app-config.js'
import { readingConfig } from '@/config/reading-config.js'

const configUser = {
  locales,
  routes,
  routesApi,
  app,
  reading: readingConfig,
}

const init = configs => {
  Object.assign(configUser, configs)
}

const set = (configName, configValue) => {
  if (!configName.includes('.')) {
    configUser[configName] = configValue
    return
  }

  const keys = configName.split('.')
  let current = configUser

  for (const [index, key] of keys.entries()) {
    if (index === keys.length - 1) {
      current[key] = configValue
      return
    }

    const child = current[key]

    if (child === undefined || child === null) {
      current[key] = {}
      current = current[key]
      continue
    }

    if (typeof child !== 'object') {
      throw new TypeError(
        `[ConfigLoader] Cannot set "${configName}": "${keys.slice(0, index + 1).join('.')}" already holds a non-object value`,
      )
    }

    current = child
  }
}

const get = configName => {
  const result = configLoaderInternal.resolveKey(configName)
  if (!result.found) {
    throw new Error(`[ConfigLoader] Key "${configName}" not found`)
  }
  return result.value
}

const find = (configName, defaultValue) => {
  const result = configLoaderInternal.resolveKey(configName)
  if (!result.found) {
    return defaultValue
  }
  return result.value
}

const has = configName => configLoaderInternal.resolveKey(configName).found

const getAll = () => configUser

export const ConfigLoader = {
  init,
  set,
  get,
  find,
  has,
  getAll,
}

const resolveKey = configName => {
  if (!configName.includes('.')) {
    const value = configUser[configName]
    if (value !== undefined) {
      return { found: true, value }
    }
    return { found: false }
  }

  const keys = configName.split('.')
  let config = configUser

  for (const key of keys) {
    if (config[key] === undefined) {
      return { found: false }
    }
    config = config[key]
  }

  return { found: true, value: config }
}

export const configLoaderInternal = {
  resolveKey,
}
