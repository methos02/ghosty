import { formService } from '@/services/form/form-service.js'
import { useFormStore } from '@/services/form/src/form-store.js'

export const formInit = {
  dependencies: [],
  services: formService,
  store: useFormStore(),
}
