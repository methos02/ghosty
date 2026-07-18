const state = {
  serviceRoutes: {},
}

export const registerServiceRoutes = (serviceName, routes) => {
  state.serviceRoutes[serviceName] = routes
}

export const getAllRegisteredRoutes = () => {
  return Object.values(state.serviceRoutes).flatMap(routes =>
    typeof routes === 'function' ? routes() : routes,
  )
}

export const resetServiceRoutes = () => {
  state.serviceRoutes = {}
}
