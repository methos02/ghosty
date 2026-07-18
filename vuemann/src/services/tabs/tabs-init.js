import { tabsService } from '@brugmann/vuemann/src/services/tabs/tabs-service.js'
import { tabsSetup } from '@brugmann/vuemann/src/services/tabs/src/tabs-setup.js'

export const tabsInit = {
  dependencies: [],
  services: tabsService,
  setup: tabsSetup.setup,
  vuemann: true,
}
