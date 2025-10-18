import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { setupFsMocks } from '&/utils/mocks/fs-mock.js'
import { setupPathMocks } from '&/utils/mocks/path-mock.js'
import { localeVite } from '@brugmann/vuemann/src/services/locale/locale-vite.js'

describe('locale-vite', () => {
  let fsMocks

  beforeEach(async () => {
    fsMocks = await setupFsMocks()
    await setupPathMocks()
    
    fsMocks.readFileSync.mockReturnValue('{"version": "1.0.0"}')
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('plugin configuration', () => {
    it('should create plugin with correct configuration', () => {
      const plugin = localeVite('/test/project')
      
      expect(plugin.name).toBe('locale-multi-files')
      expect(plugin.enforce).toBe('post')
      expect(typeof plugin.buildStart).toBe('function')
      expect(typeof plugin.handleHotUpdate).toBe('function')
    })
  })

  describe('hot update functionality', () => {
    it('should handle hot update for locale files', () => {
      const projectDirectory = '/test/project'
      const mockServer = { ws: { send: vi.fn() } }

      const plugin = localeVite(projectDirectory)
      
      plugin.handleHotUpdate({ 
        file: '/test/project/src/services/auth/locales/en/auth-en.json', 
        server: mockServer 
      })
      
      expect(mockServer.ws.send).toHaveBeenCalledWith({ 
        type: 'full-reload', 
        path: '*' 
      })
    })

    it('should not handle hot update for non-locale files', () => {
      const projectDirectory = '/test/project'
      const mockServer = { ws: { send: vi.fn() } }

      const plugin = localeVite(projectDirectory)
      
      plugin.handleHotUpdate({ 
        file: '/test/project/src/components/SomeComponent.vue', 
        server: mockServer 
      })
      
      expect(mockServer.ws.send).not.toHaveBeenCalled()
    })

    it('should not handle hot update for files in public/locales directory', () => {
      const projectDirectory = '/test/project'
      const mockServer = { ws: { send: vi.fn() } }

      const plugin = localeVite(projectDirectory)
      
      plugin.handleHotUpdate({ 
        file: '/test/project/public/locales/app-translate-en-1_0_0.json', 
        server: mockServer 
      })
      
      expect(mockServer.ws.send).not.toHaveBeenCalled()
    })

    it('should not handle hot update for non-json files', () => {
      const projectDirectory = '/test/project'
      const mockServer = { ws: { send: vi.fn() } }

      const plugin = localeVite(projectDirectory)
      
      plugin.handleHotUpdate({ 
        file: '/test/project/src/services/auth/locales/en/auth-en.txt', 
        server: mockServer 
      })
      
      expect(mockServer.ws.send).not.toHaveBeenCalled()
    })
  })

  describe('translation compilation', () => {
    it('should compile translations correctly', () => {
      const projectDirectory = '/test/project'
      const translation1 = { 'key1': 'value1', 'key2': 'value2' }
      const translation2 = { 'key3': 'value3', 'key4': 'value4' }
      
      // Configuration spécifique pour ce test
      const mockPackageJson = { version: '1.0.0' }
      const mockCalls = [JSON.stringify(translation1), JSON.stringify(translation2)]
      
      fsMocks.readFileSync.mockImplementation((path) => {
        return path.includes('package.json') ? JSON.stringify(mockPackageJson) : mockCalls.shift() || JSON.stringify({})
      })
      
      // Configuration spécifique pour readdirSync
      fsMocks.readdirSync.mockImplementation((path, options) => {
        if (options?.withFileTypes) {
          return [
            { name: 'file1.json', isFile: () => true, isDirectory: () => false },
            { name: 'file2.json', isFile: () => true, isDirectory: () => false }
          ]
        }
        return [] // Pour cleanOldTranslations
      })

      const plugin = localeVite(projectDirectory)
      plugin.buildStart()

      expect(fsMocks.writeFileSync).toHaveBeenCalled()
      const writeCall = fsMocks.writeFileSync.mock.calls[0]
      const writtenData = JSON.parse(writeCall[1])
      
      expect(writtenData).toHaveProperty('key1', 'value1')
      expect(writtenData).toHaveProperty('key2', 'value2')
      expect(writtenData).toHaveProperty('key3', 'value3')
      expect(writtenData).toHaveProperty('key4', 'value4')
    })

    it('should handle nested translations correctly', () => {
      const projectDirectory = '/test/project'
      const translation1 = { 
        'level1': { 
          'key1': 'value1',
          'key2': 'value2'
        }
      }
      const translation2 = { 
        'level1': { 
          'key3': 'value3',
          'key4': 'value4'
        },
        'level2': {
          'key5': 'value5'
        }
      }
      
      // Configuration spécifique pour ce test
      const mockPackageJson = { version: '1.0.0' }
      const mockCalls = [JSON.stringify(translation1), JSON.stringify(translation2)]
      
      fsMocks.readFileSync.mockImplementation((path) => {
        return path.includes('package.json') ? JSON.stringify(mockPackageJson) : mockCalls.shift() || JSON.stringify({})
      })
      
      // Configuration spécifique pour readdirSync
      fsMocks.readdirSync.mockImplementation((path, options) => {
        if (options?.withFileTypes) {
          return [
            { name: 'file1.json', isFile: () => true, isDirectory: () => false },
            { name: 'file2.json', isFile: () => true, isDirectory: () => false }
          ]
        }
        return [] // Pour cleanOldTranslations
      })

      const plugin = localeVite(projectDirectory)
      plugin.buildStart()

      const writeCall = fsMocks.writeFileSync.mock.calls[0]
      const writtenData = JSON.parse(writeCall[1])
      
      expect(writtenData.level1).toEqual({
        key1: 'value1',
        key2: 'value2',
        key3: 'value3',
        key4: 'value4'
      })
      expect(writtenData.level2).toEqual({
        key5: 'value5'
      })
    })
  })
})
