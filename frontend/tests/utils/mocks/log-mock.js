import { vi } from 'vitest'
import { log } from '@/services/shortcuts/log-shortcut.js'

export const logMock = () => {
  for (const level of ['debug', 'error', 'info', 'warn']) {
    vi.spyOn(log, level).mockReturnValue()
  }
}
