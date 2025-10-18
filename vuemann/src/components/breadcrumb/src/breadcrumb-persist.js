const save = (links, routeName) => {
    sessionStorage.setItem('breadcrumb', JSON.stringify(links))
    if(routeName !== undefined) { sessionStorage.setItem('breadcrumb_page', routeName) }
}

const get = () => {
    return JSON.parse(sessionStorage.getItem('breadcrumb') ?? '[]')
}

const clean = () => {
    sessionStorage.removeItem('breadcrumb')
    sessionStorage.removeItem('breadcrumb_page')
}

const isCurrentRoute = currentRouteName => {
    return currentRouteName === routeName()
}

const setRouteName = routeName => {
    sessionStorage.setItem('breadcrumb_page', routeName)
}

const routeName = () => {
    return sessionStorage.getItem('breadcrumb_page')
}

export const breadcrumbPersist = { save, get ,clean, isCurrentRoute, routeName, setRouteName }
