import { formService } from '@brugmann/vuemann/src/services/form/form-service.js'
import { useFormStore } from '@brugmann/vuemann/src/services/form/src/form-store.js'

export const formInit = {
  dependencies: [],
  services: formService,
  store: useFormStore(),
  vuemann: true,
}
