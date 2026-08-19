import { STATUS } from '@/constants/ajax-constants.js'
import { FormHelper } from '@/core/helpers/form-helper.js'
import { utilsH } from '@/core/helpers/utils-helper.js'

const controllerRegistry = new Map()

const buildEntitiesMap = results => {
  const entitiesByKey = {}

  for (const { key, entities, entityKey = 'id' } of results) {
    entitiesByKey[key] = new Map(
      entities.map(entity => [utilsH.getNestedProperty(entity, entityKey), entity]),
    )
  }

  return entitiesByKey
}

const clearControllers = () => {
  controllerRegistry.clear()
}

const extractUniqueIds = (items, key) => {
  const ids = []

  for (const item of items) {
    if (item[key] === null || item[key] === undefined) {
      throw new Error(`[utils.hydrate] Item "${key}" is required and cannot be empty`)
    }

    if (FormHelper.isEmpty(item[key].id)) {
      continue
    }

    ids.push(item[key].id)
  }

  return [...new Set(ids)]
}

const hydrate = async (data, keys, config = {}) => {
  if (!data || data.length === 0) {
    return []
  }

  const results = await Promise.all(
    keys.map(key => HydrateFunctions.hydrateKey(data, key, config[key] ?? {})),
  )
  const entitiesByKey = HydrateFunctions.buildEntitiesMap(results)

  return data.map(item => HydrateFunctions.hydrateItem(item, keys, entitiesByKey))
}

const hydrateItem = (item, keys, entitiesByKey) => {
  const hydratedItem = { ...item }

  for (const key of keys) {
    if (hydratedItem[key] === null || hydratedItem[key] === undefined) {
      continue
    }
    if (hydratedItem[key].id === undefined) {
      throw new Error(`[utils.hydrate] Item "${key}" need to have an id`)
    }

    const entity = entitiesByKey[key].get(hydratedItem[key].id)
    if (entity) {
      hydratedItem[key] = entity
    }
  }

  return hydratedItem
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

  const entityKey = config.entityKey ?? 'id'

  return {
    key,
    entities: result.data,
    entityKey,
  }
}

const loadController = async (controllerName, key, method = 'byIds') => {
  const controller = controllerRegistry.get(controllerName)

  if (!controller) {
    throw new Error(
      `[utils.hydrate] Controller "${controllerName}" not registered. Use utils.registerController('${controllerName}', YourController) in your project setup.`,
    )
  }

  const handler = controller[method]
  if (!handler || typeof handler !== 'function') {
    throw new Error(
      `[utils.hydrate] Controller "${controllerName}" does not have a "${method}" method. Available methods: ${Object.keys(controller).join(', ')}`,
    )
  }

  return controller
}

const registerController = (name, controller) => {
  controllerRegistry.set(name, controller)
}

export const HydrateFunctions = {
  buildEntitiesMap,
  clearControllers,
  extractUniqueIds,
  hydrate,
  hydrateItem,
  hydrateKey,
  loadController,
  registerController,
}
