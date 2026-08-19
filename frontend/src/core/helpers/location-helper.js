const getHash = () => globalThis.location.hash

const getPathname = () => globalThis.location.pathname

const getSearch = () => globalThis.location.search

const reload = () => {
  globalThis.location.reload()
}

const setHref = url => {
  globalThis.location.assign(url)
}

export const locationHelper = {
  getHash,
  getPathname,
  getSearch,
  reload,
  setHref,
}
