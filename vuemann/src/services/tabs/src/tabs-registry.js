const STORAGE_KEY = 'vuemann.tabs'

const register = tabId => {
  const ids = tabsRegistryInternal.read()
  if (ids.includes(tabId)) {
    return
  }
  ids.push(tabId)
  tabsRegistryInternal.write(ids)
}

const unregister = tabId => {
  const ids = tabsRegistryInternal.read().filter(id => id !== tabId)
  tabsRegistryInternal.write(ids)
}

const list = () => tabsRegistryInternal.read().map(tabId => ({ tabId }))

export const tabsRegistry = {
  register,
  unregister,
  list,
}

const read = () => {
  const raw = localStorage.getItem(STORAGE_KEY)
  if (!raw) {
    return []
  }

  return JSON.parse(raw)
}

const write = ids => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(ids))
}

export const tabsRegistryInternal = {
  read,
  write,
}
