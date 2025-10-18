import { servicesM } from '@brugmann/vuemann/src/services/services-manager.js';
import { req, auth } from '@brugmann/vuemann/src/services/services-helper.js';
import { ConfigLoader } from '@brugmann/vuemann/src/config/config-loader.js';
 
const send = async (error, context = {}) => {
  if(import.meta.env[`VITE_ENV`] === 'dev') { return }

  if(!servicesM.service('router:hasApiRoute', 'log')) {
    // eslint-disable-next-line no-console
    console.error(error, context)
    // eslint-disable-next-line no-console
    console.error('La route "log" n\'est pas configurée pour les API routes')
    return
  }

  await req('log',  {
    date: new Date().toISOString(),
    app: ConfigLoader.get('app.name'),	
    version: __APP_VERSION__,
    user: auth.user(),
    message: typeof error === 'string' ? error : (error.message || JSON.stringify(error)),
    ...context,
    stack: error && error.stack ? error.stack : undefined
  }, {log: false});
} 

export const logService = { send }