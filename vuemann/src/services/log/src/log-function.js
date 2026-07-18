import { ConfigLoader } from '@brugmann/vuemann/src/config/config-loader.js'

const isLoggingEnabled = () => {
  const appLog = ConfigLoader.find('app.log')
  if (appLog === false) {
    return false
  }

  const isDevelopment = import.meta.env[`VITE_ENV`] === 'dev'
  if (isDevelopment) {
    return import.meta.env[`VITE_LOG`] === 'true'
  }

  return true
}

export const LogFunction = { isLoggingEnabled }
export const LogFunctionInternal = { isLoggingEnabled }
