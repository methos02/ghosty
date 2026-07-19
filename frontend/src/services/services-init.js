import { createApp } from 'vue'
import { servicesM } from '@/services/services-manager.js'
import { servicesStores } from '@/services/services-stores.js'
import { registerServiceRoutes } from '@/services/services-routes-registry.js'
import { BOOT_STATUS } from '@/constants/boot-status.js'
import ErrorScreenComponent from '@/components/ErrorScreenComponent.vue'

const initServices = async (app, servicesConfig) => {
  servicesInitInternal.registerAllRoutes(servicesConfig)

  const context = { servicesConfig, initializing: new Set() }

  for (const serviceName of Object.keys(servicesConfig)) {
    if (servicesM.hasService(serviceName)) {
      continue
    }
    const bootStatus = await servicesInitInternal.initService(app, serviceName, context)
    if (bootStatus.status === BOOT_STATUS.ABORTED) {
      servicesInitInternal.renderBootError(bootStatus.error)
      return bootStatus
    }
  }

  return { status: BOOT_STATUS.SUCCESS }
}

export const servicesInit = { initServices }

const initService = async (app, serviceName, context) => {
  const service = context.servicesConfig[serviceName]

  if (service.dependencies?.length > 0) {
    const dependenciesStatus = await servicesInitInternal.initDependencies(
      app,
      serviceName,
      context,
    )
    if (dependenciesStatus.status === BOOT_STATUS.ABORTED) {
      return dependenciesStatus
    }
  }

  servicesInitInternal.registerService(serviceName, service)

  const bootStatus = await servicesInitInternal.runServiceSetup(service)
  if (bootStatus.status === BOOT_STATUS.ABORTED) {
    return bootStatus
  }

  if (service.plugin !== undefined) {
    app.use(await service.plugin())
  }

  context.initializing.delete(serviceName)
  return bootStatus
}

const registerService = (serviceName, service) => {
  if (service.store !== undefined) {
    servicesStores.register(serviceName, service.store)
  }

  if (service.services !== undefined) {
    servicesM.register(serviceName, service.services)
  }
}

const registerAllRoutes = servicesConfig => {
  for (const [serviceName, service] of Object.entries(servicesConfig)) {
    if (service.routes === undefined) {
      continue
    }
    registerServiceRoutes(serviceName, service.routes)
  }
}

const renderBootError = error => {
  const mountElement = document.querySelector('#app')
  if (!error || !mountElement) {
    return
  }

  createApp(ErrorScreenComponent, error).mount(mountElement)
}

const runServiceSetup = async service => {
  if (service.setup === undefined) {
    return { status: BOOT_STATUS.SUCCESS }
  }

  const bootStatus = await service.setup()
  return bootStatus ?? { status: BOOT_STATUS.SUCCESS }
}

const initDependencies = async (app, serviceName, context) => {
  if (context.initializing.has(serviceName)) {
    throw new Error(`Dépendance circulaire détectée : ${serviceName} est en cours d'initialisation`)
  }

  context.initializing.add(serviceName)

  const dependencies = context.servicesConfig[serviceName].dependencies
  for (const dependency of dependencies) {
    if (servicesM.hasService(dependency)) {
      continue
    }

    if (context.servicesConfig[dependency] === undefined) {
      throw new Error(
        `Dépendance ${dependency} non trouvée dans les services disponibles pour ${serviceName}`,
      )
    }

    if (context.initializing.has(dependency)) {
      throw new Error(
        `Dépendance circulaire détectée : ${dependency} est en cours d'initialisation`,
      )
    }

    const bootStatus = await servicesInitInternal.initService(app, dependency, context)
    if (bootStatus.status === BOOT_STATUS.ABORTED) {
      return bootStatus
    }
  }

  return { status: BOOT_STATUS.SUCCESS }
}

export const servicesInitInternal = {
  initDependencies,
  initService,
  registerAllRoutes,
  registerService,
  renderBootError,
  runServiceSetup,
}
