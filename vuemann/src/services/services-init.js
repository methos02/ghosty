import { createApp } from 'vue'
import { servicesM } from '@brugmann/vuemann/src/services/services-manager.js'
import { servicesStores } from '@brugmann/vuemann/src/services/services-stores.js'
import { registerServiceRoutes } from '@brugmann/vuemann/src/services/services-routes-registry.js'
import { BOOT_STATUS } from '@brugmann/vuemann/src/constants/boot-status.js'
import ErrorScreenComponent from '@brugmann/vuemann/src/components/ErrorScreenComponent.vue'

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

const SERVICE_SOURCES = import.meta.glob('/src/services/*/*-service.js', {
  eager: true,
  query: '?raw',
  import: 'default',
})

const VUEMANN_CONTRACTS = new Set([
  'ajax',
  'auth',
  'form',
  'locale',
  'log',
  'router',
  'tabs',
  'utils',
  'websocket',
])

const buildAnnotationPattern = serviceName =>
  new RegExp(
    String.raw`@type\s+\{import\(['"][^'"]*contracts/${serviceName}-contract\.js['"]\)\.\w+\s*\}\s*\*/\s*export\s+const`,
  )

const checkContractAnnotation = (serviceName, service) => {
  const { folder, vuemann, sources = SERVICE_SOURCES } = service
  const path = `/src/services/${folder ?? serviceName}/${serviceName}-service.js`
  const source = sources[path]

  if (source === undefined) {
    if (vuemann === true) {
      return
    }
    throw new Error(
      `service ${serviceName}: no impl at ${path}. ` +
        `If your impl lives in a non-conventional folder, declare folder: "<folder-name>" in the init.`,
    )
  }

  if (!buildAnnotationPattern(serviceName).test(source)) {
    throw new Error(`${path}: missing @type annotation referencing ${serviceName}-contract.js`)
  }
}

const initService = async (app, serviceName, context) => {
  const service = context.servicesConfig[serviceName]

  if (VUEMANN_CONTRACTS.has(serviceName)) {
    servicesInitInternal.checkContractAnnotation(serviceName, service)
  }

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
  checkContractAnnotation,
  initDependencies,
  initService,
  registerAllRoutes,
  registerService,
  renderBootError,
  runServiceSetup,
  VUEMANN_CONTRACTS,
}
