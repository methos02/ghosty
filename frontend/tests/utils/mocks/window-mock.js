import { vi } from 'vitest'

// importActual : un fichier de test qui mocke node:fs / node:path (locale-helper)
// ne doit pas voir ses mocks consommés par le chargement des traductions du setup.
const createFetchMock = () => {
  return vi.fn(async url => {
    const [{ promises: fs }, { default: path }] = await Promise.all([
      vi.importActual('node:fs'),
      vi.importActual('node:path'),
    ])
    const filePath = path.resolve('public', url.replace(/^\//, ''))
    const data = await fs.readFile(filePath, 'utf8')
    return {
      ok: true,
      json: async () => JSON.parse(data),
      text: async () => data,
    }
  })
}

export const windowMock = () => {
  globalThis.fetch = createFetchMock()

  if (globalThis.window !== undefined) {
    globalThis.window.scrollTo = vi.fn()
  }

  if (globalThis.window === undefined) {
    const mockDocument = {
      documentElement: {
        lang: 'fr',
      },
      querySelector: vi.fn(),
      querySelectorAll: vi.fn(() => []),
      getElementById: vi.fn(),
      createElement: vi.fn(() => ({
        setAttribute: vi.fn(),
        getAttribute: vi.fn(),
        removeAttribute: vi.fn(),
      })),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    }

    const mockWindow = {
      location: {
        href: 'http://localhost:3000',
        hostname: 'localhost',
        protocol: 'http:',
        port: '3000',
        pathname: '/',
        search: '',
        hash: '',
        reload: vi.fn(),
      },
      navigator: {
        language: 'fr',
        languages: ['fr', 'en'],
        userAgent: 'test',
      },
      localStorage: {
        getItem: vi.fn(),
        setItem: vi.fn(),
        removeItem: vi.fn(),
        clear: vi.fn(),
      },
      document: mockDocument,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      scrollTo: vi.fn(),
      history: {
        pushState: vi.fn(),
        replaceState: vi.fn(),
        back: vi.fn(),
        forward: vi.fn(),
        go: vi.fn(),
      },
      // Propriétés nécessaires pour vue-i18n
      Intl: globalThis.Intl || {
        DateTimeFormat: vi.fn(),
        NumberFormat: vi.fn(),
        RelativeTimeFormat: vi.fn(),
        PluralRules: vi.fn(),
        Collator: vi.fn(),
        ListFormat: vi.fn(),
        Segmenter: vi.fn(),
      },
      // Support pour les APIs d'internationalisation
      ResizeObserver: vi.fn(),
      MutationObserver: vi.fn(),
      IntersectionObserver: vi.fn(),
      fetch: globalThis.fetch,
    }

    Object.defineProperty(globalThis, 'window', {
      value: mockWindow,
      writable: true,
      configurable: true,
    })

    Object.defineProperty(globalThis, 'document', {
      value: mockDocument,
      writable: true,
      configurable: true,
    })
  }

  if (globalThis.navigator === undefined) {
    Object.defineProperty(globalThis, 'navigator', {
      value: {
        language: 'fr',
        languages: ['fr', 'en'],
        userAgent: 'test',
      },
      writable: true,
      configurable: true,
    })
  }
}
