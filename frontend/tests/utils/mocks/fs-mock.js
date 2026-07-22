import { vi } from 'vitest'

export function createFsMock() {
  const mock = {
    existsSync: vi.fn(),
    readdirSync: vi.fn(() => []),
    readFileSync: vi.fn(),
    writeFileSync: vi.fn(),
    rmSync: vi.fn(),
    mkdirSync: vi.fn(),
    copyFileSync: vi.fn(),
    unlinkSync: vi.fn(),
  }
  return { default: mock, ...mock }
}

export async function setupFsMocks() {
  const fs = await import('node:fs')

  fs.existsSync.mockReturnValue(true)
  fs.readdirSync.mockReturnValue([])
  fs.writeFileSync.mockReturnValue(true)

  return fs
}
