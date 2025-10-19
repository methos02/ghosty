import { servicesM } from "@/services/services-manager.js";

const beforeEach = async (to, from, next) => {
    if(to.name === 'error') { return next() }
    
    if(!await servicesM.service('utils:apiStatus')){ return next('/error') }

    return next()
}

const afterEach = to => {
    if (to.meta?.title === undefined) { return false }
    
    document.title = to.meta.title;  
    return true
}

export const routerFunctions = { beforeEach, afterEach }
