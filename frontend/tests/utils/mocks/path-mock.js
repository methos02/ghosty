import { vi } from 'vitest'

export function createPathMock() {
  const mock = {
    resolve: vi.fn(),
    join: vi.fn(),
    dirname: vi.fn(),
    extname: vi.fn(),
    basename: vi.fn(),
    sep: '/',
  }
  return { default: mock, ...mock }
}

export function setupPathDefaults(path) {
  path.resolve.mockImplementation((...arguments_) => arguments_.join('/'))
  path.join.mockImplementation((...arguments_) => arguments_.join('/'))
  path.dirname.mockImplementation(filePath => filePath.slice(0, filePath.lastIndexOf('/')))
  path.extname.mockImplementation(filename => {
    if (!filename) {
      return ''
    }
    if (!filename.includes('.')) {
      return ''
    }
    return '.' + filename.split('.').pop()
  })
}
