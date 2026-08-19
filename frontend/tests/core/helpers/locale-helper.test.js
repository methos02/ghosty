import { describe, it, expect, vi, afterEach } from 'vitest'

import fs from 'node:fs'
import path from 'node:path'

vi.mock('node:fs', async () => (await import('&/utils/mocks/fs-mock.js')).createFsMock())
vi.mock('node:path', async () => (await import('&/utils/mocks/path-mock.js')).createPathMock())

import { localeHelper } from '@/core/helpers/locale-helper.js'

afterEach(() => {
  vi.clearAllMocks()
})

describe('loadLocaleFiles', () => {
  it('should load a single JSON file from directory', () => {
    path.join.mockImplementation((...args) => args.join('/'))
    path.extname.mockReturnValue('.json')
    fs.readdirSync.mockReturnValue([{ name: 'app-fr.json', isDirectory: () => false }])
    fs.readFileSync.mockReturnValue(JSON.stringify({ app: { title: 'Mon App' } }))

    const result = localeHelper.loadLocaleFiles('/locales/fr')

    expect(result).toEqual({ app: { title: 'Mon App' } })
  })

  it('should merge multiple JSON files', () => {
    path.join.mockImplementation((...args) => args.join('/'))
    path.extname.mockReturnValue('.json')
    fs.readdirSync.mockReturnValue([
      { name: 'app-fr.json', isDirectory: () => false },
      { name: 'common-fr.json', isDirectory: () => false },
    ])
    fs.readFileSync
      .mockReturnValueOnce(JSON.stringify({ app: { title: 'Mon App' } }))
      .mockReturnValueOnce(JSON.stringify({ common: { save: 'Sauvegarder' } }))

    const result = localeHelper.loadLocaleFiles('/locales/fr')

    expect(result).toEqual({
      app: { title: 'Mon App' },
      common: { save: 'Sauvegarder' },
    })
  })

  it('should scan subdirectories recursively', () => {
    path.join.mockImplementation((...args) => args.join('/'))
    path.extname.mockReturnValue('.json')
    fs.readdirSync
      .mockReturnValueOnce([{ name: 'subdir', isDirectory: () => true }])
      .mockReturnValueOnce([{ name: 'nested.json', isDirectory: () => false }])
    fs.readFileSync.mockReturnValue(JSON.stringify({ nested: { key: 'value' } }))

    const result = localeHelper.loadLocaleFiles('/locales/fr')

    expect(result).toEqual({ nested: { key: 'value' } })
  })

  it('should skip non-json files', () => {
    path.join.mockImplementation((...args) => args.join('/'))
    path.extname.mockReturnValueOnce('.txt').mockReturnValueOnce('.json')
    fs.readdirSync.mockReturnValue([
      { name: 'readme.txt', isDirectory: () => false },
      { name: 'app-fr.json', isDirectory: () => false },
    ])
    fs.readFileSync.mockReturnValue(JSON.stringify({ key: 'value' }))

    const result = localeHelper.loadLocaleFiles('/locales/fr')

    expect(result).toEqual({ key: 'value' })
    expect(fs.readFileSync).toHaveBeenCalledTimes(1)
  })

  it('should return empty object for empty directory', () => {
    fs.readdirSync.mockReturnValue([])

    const result = localeHelper.loadLocaleFiles('/locales/fr')

    expect(result).toEqual({})
  })
})
