import { locales } from '@/config/locale-config.js'
import { routes } from '@/config/routes-config.js'
import { routesApi } from '@/config/routes-api-config.js'

const configUser = {locales, routes, routesApi}

const set = (configName, configValue) => {
  if(!configName.includes('.')) { configUser[configName] = configValue; return }

  const keys = configName.split('.');
  let current = configUser;

  for (const [index, key] of keys.entries()) {
    // Dernière clé, on met à jour la valeur
    if (index === keys.length - 1) { current[key] = configValue; return }

    if (!current[key] || typeof current[key] !== 'object') { current[key] = {}; }
    // Avance dans l'objet
    current = current[key]; 
  }
}

const get = (configName, defaultValue) => {
  if(!configName.includes('.')) { return configUser[configName] ?? defaultValue }
  
  const keys = configName.split('.')
  let config = configUser
  
  for (const key of keys) {
    if (config[key] === undefined) { return defaultValue };
    config = config[key];
  }

  return config 
}

const getAll = () => configUser

export const ConfigLoader = { set, get, getAll }
