import { tabsRegistry } from '@brugmann/vuemann/src/services/tabs/src/tabs-registry.js'

/** @type {import('@brugmann/vuemann/src/contracts/tabs-contract.js').TabsService} */
export const tabsService = {
  list: tabsRegistry.list,
}
