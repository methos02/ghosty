const stores = {}

const register = (serviceName, store) => {
  stores[serviceName] = store
}

const get = serviceName => {
  if (stores[serviceName] === undefined) {
    stores[serviceName] = {}
  }
  return stores[serviceName]
}

const reset = () => {
  for (const serviceName of Object.keys(stores)) {
    delete stores[serviceName]
  }
}

export const servicesStores = {
  get,
  register,
  reset,
}
