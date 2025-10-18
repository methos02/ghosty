import { vi } from 'vitest'

vi.mock('node:fs')

export async function setupFsMocks() {
  const fs = await import('node:fs')
  
  const mocks = {
    existsSync: vi.mocked(fs.existsSync),
    readdirSync: vi.mocked(fs.readdirSync),
    readFileSync: vi.mocked(fs.readFileSync),
    writeFileSync: vi.mocked(fs.writeFileSync)
  }

  mocks.existsSync.mockReturnValue(true)
  mocks.readdirSync.mockReturnValue([])
  mocks.writeFileSync.mockReturnValue(true)

  return mocks
}
