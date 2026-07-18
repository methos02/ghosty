import { tabsHelper } from '@brugmann/vuemann/src/helpers/tabs-helper.js'
import { tabsRegistry } from '@brugmann/vuemann/src/services/tabs/src/tabs-registry.js'
import { BOOT_STATUS } from '@brugmann/vuemann/src/constants/boot-status.js'

const setup = () => {
  tabsRegistry.register(tabsHelper.tabSessionId())
  globalThis.addEventListener('pagehide', tabsSetupInternal.handlePageHide)
  return { status: BOOT_STATUS.SUCCESS }
}

const stop = () => {
  tabsRegistry.unregister(tabsHelper.tabSessionId())
  globalThis.removeEventListener('pagehide', tabsSetupInternal.handlePageHide)
}

const handlePageHide = () => {
  tabsSetupInternal.stop()
}

export const tabsSetup = { setup }

export const tabsSetupInternal = {
  stop,
  handlePageHide,
}
