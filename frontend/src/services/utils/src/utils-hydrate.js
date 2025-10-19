import { STATUS } from '@/services/ajax/ajax-constants.js'
import { FormHelper } from '@/services/form/form-helper.js'

const hydrate = async (data, keys, config = {}) => {
  if (!data || data.length === 0) {
    throw new Error('[utils.hydrate] Data is required and cannot be empty')
  }

  const results = await Promise.all(keys.map((key) => HydrateFunctions.hydrateKey(data, key, config[key] ?? {})))
  const entitiesByKey = HydrateFunctions.buildEntitiesMap(results)

  return data.map((item) => HydrateFunctions.hydrateItem(item, keys, entitiesByKey))
}

const hydrateKey = async (data, key, config) => {
  const controllerName = config.controller ?? key
  const method = config.method ?? 'byIds'
  const filterFunction = config.filter ?? (() => true)

  const items = data.filter(item => filterFunction(item) !== false)
  const ids = HydrateFunctions.extractUniqueIds(items, key)
  if (ids.length === 0) {
    return { key, entities: [] }
  }

  const controller = await HydrateFunctions.loadController(controllerName, key, method)

  const result = await controller[method](ids)
  if (result.status !== STATUS.SUCCESS) {
    return { key, entities: [] }
  }

  return { key, entities: result.data }
}

const extractUniqueIds = (items, key) => {
  const ids = []

  for (const item of items) {
    if (FormHelper.isEmpty(item[key])) {
      throw new Error(`[utils.hydrate] Item "${key}" is required and cannot be empty`)
    }

    const id = item[key].id
    if (FormHelper.isEmpty(id)) { continue }

    ids.push(id)
  }

  return [...new Set(ids)]
}

const loadController = async (controllerName, key, method = 'byIds') => {
  const controllers = import.meta.glob('/src/apis/*/controllers/*-controller.js')
  const controllerPath = `/src/apis/${controllerName}/controllers/${controllerName}-controller.js`

  const loadControllerModule = controllers[controllerPath]
  if (!loadControllerModule) {
    throw new Error(`[utils.hydrate] Controller not found at path "${controllerPath}". Available controllers: ${Object.keys(controllers).join(', ')}`)
  }

  const controllerModule = await loadControllerModule()
  const controllerKey = Object.keys(controllerModule).find((k) => k.toLowerCase().includes('controller'))
  if (!controllerKey) {
    throw new Error(`[utils.hydrate] Controller not found in module for key "${key}". Controller name: "${controllerName}". Available exports: ${Object.keys(controllerModule).join(', ')}`)
  }

  const controller = controllerModule[controllerKey]
  if (!controller[method] || typeof controller[method] !== 'function') {
    throw new Error(`[utils.hydrate] Controller "${controllerKey}" does not have a "${method}" method. Available methods: ${Object.keys(controller).join(', ')}`)
  }

  return controller
}

const buildEntitiesMap = (results) => {
  const entitiesByKey = {}

  for (const { key, entities } of results) {
    entitiesByKey[key] = new Map(entities.map((entity) => [entity.id, entity]))
  }

  return entitiesByKey
}

const hydrateItem = (item, keys, entitiesByKey) => {
  const hydratedItem = { ...item }

  for (const key of keys) {
    const entity = entitiesByKey[key].get(hydratedItem[key].id)

    if (entity) {
      hydratedItem[key] = entity
    }
  }

  return hydratedItem
}

export const HydrateFunctions = {
  hydrate,
  hydrateKey,
  extractUniqueIds,
  loadController,
  buildEntitiesMap,
  hydrateItem
}
