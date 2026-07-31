import { vi } from 'vitest'
import { log } from '@/services/shortcuts/log-shortcut.js'

// Les niveaux locaux du logger écrivent sur la console : les taire ici garde la
// sortie des tests lisible tout en laissant les appels vérifiables via le spy.
export const logMock = () => {
  for (const level of ['debug', 'error', 'info', 'warn']) {
    vi.spyOn(log, level).mockReturnValue()
  }
}
