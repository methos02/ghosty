import { describe, it, expect, afterEach, afterAll } from 'vitest'
import fs from 'node:fs'
import path from 'node:path'
import { InitApi } from '/bin/initApi/init-api.js'

const apiPath = path.join(process.cwd(), 'src', 'apis')
const apiName = 'blog'
const blogPath = path.join(apiPath, apiName)

afterAll(() => {
    if (fs.existsSync(blogPath)) { fs.rmSync(blogPath, { recursive: true, force: true }) }
})

describe('InitApi', () => {
  it('crée tous les dossiers et fichiers attendus', () => {
    InitApi(apiName)

    const expected = {
      controllers: `${apiName}-controller.js`,
      repositories: `${apiName}-repository.js`,
      dtos: `${apiName}-dto.js`,
      stores: `${apiName}-store.js`,
    }

    for (const [folder, file] of Object.entries(expected)) {
      const folderPath = path.join(blogPath, folder)
      const filePath = path.join(folderPath, file)

      expect(fs.existsSync(blogPath)).toBe(true)
      expect(fs.existsSync(folderPath)).toBe(true)
      expect(fs.existsSync(filePath)).toBe(true)
    }
  })

  it('lance une erreur si le dossier existe déjà', () => {
    const apiName = 'users'
    const target = path.join(apiPath, apiName)
    if(!fs.existsSync(target)) { fs.mkdirSync(target, { recursive: true }) }

    expect(() => InitApi(apiName)).toThrow(/existe déjà/)
  })

  it('lance une erreur si aucun nom n’est fourni', () => {
    expect(() => InitApi(undefined)).toThrow()
  })
})
