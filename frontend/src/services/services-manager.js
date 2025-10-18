let services = {}
let initializedServices = new Set()
let servicesInit = {}

const initServices = async (app, servicesInit) => {
  servicesInit = servicesInit
  for (const [serviceName, serviceInit] of Object.entries(servicesInit)) {
    await initServiceWithDependencies(app, serviceName, serviceInit)
  }
}

const initServiceWithDependencies = async (app, serviceName, serviceConfig) => {
  // Vérifier et initialiser les dépendances
  if (serviceConfig.dependencies && serviceConfig.dependencies.length > 0) {
    for (const dependency of serviceConfig.dependencies) {
      if (initializedServices.has(dependency)) { continue }
      // Initialiser automatiquement la dépendance manquante
      if (servicesInit[dependency]) {
        await initServiceWithDependencies(app, dependency, servicesInit[dependency])
      } else {
        console.error(`Dépendance ${dependency} non trouvée dans les services disponibles pour ${serviceName}`)
      }
    }
  }
  
  // Initialiser le plugin s'il existe
  if (serviceConfig.plugin) {
    try {
      const plugin = await serviceConfig.plugin()
      if (plugin) {
        app.use(plugin)
      }
    } catch (error) {
      console.error(`Erreur lors de l'initialisation du plugin pour ${serviceName}:`, error)
    }
  }
  
  // Ajouter le service à la variable services
  if (serviceConfig.services) {
    services[serviceName + 'Service'] = serviceConfig.services
    initializedServices.add(serviceName)
  }
}

const hasService = service_name => {
  service_name = sericesManagerInternal.formatServiceName(service_name)
  return services[service_name] !== undefined
}

const getServices = () => {
  return Object.keys(services)
}

const service = (service, method_params)  => {
  const [service_name, service_method] = service.split(':')
  const method = sericesManagerInternal.serviceMethod(service_name, service_method)
  method_params = sericesManagerInternal.formatMethodParams(method_params)

  if( method === undefined ) { return sericesManagerInternal.serviceDefault(service_name, service_method, method_params) }

  return method_params === false 
    ? sericesManagerInternal.serviceMethod(service_name, service_method)() 
    : sericesManagerInternal.serviceMethod(service_name, service_method)(...method_params)
}

export const servicesM = { initServices, hasService, getServices, service } 

const serviceMethod = (service_name, service_method) => {
  service_name = sericesManagerInternal.formatServiceName(service_name)

  if (services[service_name] === undefined) { return sericesManagerInternal.serviceError(service_name) }
  // eslint-disable-next-line no-console
  if (services[service_name][service_method] === undefined) { return console.error( `méthode ${service_method} inconnue dans le service ${service_name}` ) }

  return services[service_name][service_method]
}

/* eslint-disable no-console */
const serviceError = service_name => {
  console.error(servicesM.getServices())
  console.trace()
  console.error(`service ${service_name} inconnu`)
}
/* eslint-enable no-console */

const serviceDefault = (service_name, service_method, method_params) =>  {
  /* eslint-disable no-console */
  if( servicesDefault[service_name] === undefined ) { return console.log(`default service ${service_name} est inconnu`) }
  if( servicesDefault[service_name][service_method] === undefined ) { return console.log(`default service ${service_name} n'a pas la méthode ${service_method}`) }
  /* eslint-enable no-console */

  return method_params === false 
    ? servicesDefault[service_name][service_method]()
    : servicesDefault[service_name][service_method](...method_params)
}

const formatServiceName = (service_name) => {
  return service_name.endsWith('Service') ? service_name :  service_name + 'Service'
}

const formatMethodParams = method_params => {
  if(method_params === undefined) { return false }
  return Array.isArray(method_params) ? method_params : [method_params]
}

export const sericesManagerInternal = { serviceMethod, serviceError, serviceDefault, formatServiceName, formatMethodParams }

/* eslint-disable no-console */
export const servicesDefault = {
  locale: { t: text_key => text_key },
  flash: {
    success: message => console.log(message),
    error: message => console.log(message),
  },
}
/* eslint-enable no-console */