import { describe, it, expect } from 'vitest'
import { stateScript } from '@/ssr/engine/state-script.js'
import { createApp } from '@/ssr/app.js'
import { storeRegistry } from '@/ssr/store-registry.js'
import { novelSeeder } from '&/utils/seeders/novel-seeder.js'
import { userSeeder } from '&/utils/seeders/user-seeder.js'

const SCRIPT_START = '<script>window.__INITIAL_STATE__ = '
const SCRIPT_END = '</script>'

const runScript = script =>
  new Function(`return ${script.slice(SCRIPT_START.length, -SCRIPT_END.length)}`)()

describe('state-script', () => {
  describe('build', () => {
    it('gives the browser back the state rendered by the server', () => {
      const state = { novel: { selectedNovel: novelSeeder.getNovel() } }

      expect(runScript(stateScript.build(state))).toEqual(state)
    })

    it('keeps a closing script tag written in the state from ending the script', () => {
      const state = {
        novel: { selectedNovel: novelSeeder.getNovel({ title: '</script><script>alert(1)' }) },
      }

      const script = stateScript.build(state)

      expect(script.indexOf(SCRIPT_END)).toBe(script.length - SCRIPT_END.length)
      expect(runScript(script)).toEqual(state)
    })

    it('keeps the dates of the state as dates', () => {
      const state = { reading: { readAt: new Date('2026-11-06T10:00:00Z') } }

      expect(runScript(stateScript.build(state)).reading.readAt).toEqual(state.reading.readAt)
    })

    it('accepts the state of every store of the app', async () => {
      const { stores } = await createApp({
        ssr: true,
        initialState: {
          auth: { user: userSeeder.getUser() },
          novel: { selectedNovel: novelSeeder.getNovel() },
        },
      })
      const state = storeRegistry.serializeStores(stores)

      expect(runScript(stateScript.build(state))).toEqual(state)
    })

    it('sends an empty state when the server rendered none', () => {
      expect(runScript(stateScript.build(undefined))).toEqual({})
    })
  })
})
