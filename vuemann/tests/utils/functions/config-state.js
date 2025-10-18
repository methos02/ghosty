import { servicesM } from '@brugmann/vuemann/src/services/services-manager.js';
import { createApp } from 'vue';
import { utilsService } from '@brugmann/vuemann/src/services/utils/init/utils-service.js';
import { authService } from '@brugmann/vuemann/src/services/auth/init/auth-service.js';
import { ajaxService } from '@brugmann/vuemann/src/services/ajax/init/ajax-service.js';
import { flashService } from '@brugmann/vuemann/src/services/flash/init/flash-service.js';
import { localeService } from '@brugmann/vuemann/src/services/locale/init/locale-service.js';
import { routerService } from '@brugmann/vuemann/src/services/router/init/router-service.js';
import { formService } from '@brugmann/vuemann/src/services/form/init/form-service.js';
import { websocketService } from '@brugmann/vuemann/src/services/websocket/init/websocket-service.js';
import { logService } from '@brugmann/vuemann/src/services/log/init/log-service.js';

export const defaultServicesConfig =  { 
    utils: { services: utilsService }, 
    auth: { services: authService }, 
    ajax: { services: ajaxService }, 
    flash: { services: flashService }, 
    locale: { services: localeService }, 
    router: { services: routerService }, 
    form: { services: formService },
    websocket: { services: websocketService },
    log: { services: logService }
};

const resetServices = (services = defaultServicesConfig) => {
  servicesM.resetServices();
  servicesM.initServices(createApp({name : 'test'}), services);
}

export const ConfigState = {
    resetServices
}
