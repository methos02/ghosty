import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { vuemannVite } from '@brugmann/vuemann/src/vuemann-vite' // adapte ton chemin

import fs from 'node:fs'
import path from 'node:path'

vi.mock('node:fs')
vi.mock('node:path')

describe('vuemannVite', () => {
  const projectDir = '/fake/project'

  beforeEach(() => {
    vi.spyOn(console, 'log').mockImplementation(() => {});
    path.resolve.mockImplementation((...args) => {
      return args.filter(arg => arg !== undefined)
      .map(arg => arg.replace('./', ''))
      .join('/')
    })

    path.join.mockImplementation((...args) => args.join('/'))
    fs.existsSync.mockReturnValue(true)
    fs.readdirSync.mockReturnValue([])
    fs.rmSync.mockImplementation(() => {})
    fs.mkdirSync.mockImplementation(() => {})
    fs.copyFileSync.mockImplementation(() => {})
  })

  afterEach(() => {
    vi.resetAllMocks()
  })

  it('should setup the publicDirectory and copy images', async () => {
    const plugin = vuemannVite(projectDir)

    await plugin.buildStart()

    expect(fs.rmSync).toHaveBeenCalledWith('/fake/project/public/images/vuemann', { recursive: true, force: true })
    expect(fs.mkdirSync).toHaveBeenCalledWith('/fake/project/public/images/vuemann', { recursive: true })

    expect(fs.existsSync).toHaveBeenCalled()
    expect(fs.readdirSync).toHaveBeenCalled()
  })

  it('should skip service folders if not directories', async () => {
    fs.existsSync.mockReturnValue(false)
    fs.readdirSync.mockReturnValue([
      { name: 'service1', isDirectory: () => true },
      { name: 'service2', isDirectory: () => true },
    ])

    const plugin = vuemannVite(projectDir)

    await plugin.buildStart()

    expect(fs.copyFileSync).not.toHaveBeenCalled()
  })

  it('should copy images from service folders if directories with images exist', async () => {
    fs.readdirSync
      .mockImplementationOnce(() => [
        { name: 'service1', isDirectory: () => true }
      ]) // services folder
      .mockImplementationOnce(() => [
        { name: 'image1.png', isDirectory: () => false }
      ]) // service1/images folder

    fs.existsSync
    .mockImplementation(path => !path.includes('assets/images'))

    const plugin = vuemannVite(projectDir)

    await plugin.buildStart()

    expect(fs.copyFileSync).toHaveBeenCalledWith(
      'services/service1/images/image1.png',
      '/fake/project/public/images/vuemann/image1.png'
    )
  })
})
