import { vi } from 'vitest'

vi.mock('node:path')

export async function setupPathMocks() {
  const { default: path } = await import('node:path')
  
  const mocks = {
    resolve: vi.mocked(path.resolve),
    join: vi.mocked(path.join),
    dirname: vi.mocked(path.dirname),
    extname: vi.mocked(path.extname)
  }

  // Configuration par défaut des mocks
  mocks.resolve.mockImplementation((...arguments_) => arguments_.join('/'))
  mocks.join.mockImplementation((...arguments_) => arguments_.join('/'))
  mocks.dirname.mockImplementation((filePath) => filePath.split('/').slice(0, -1).join('/'))
  mocks.extname.mockImplementation((filename) => {
    if (!filename) { return '' }
    if (!filename.includes('.')) { return '' }
    return '.' + filename.split('.').pop()
  })

  return mocks
}
