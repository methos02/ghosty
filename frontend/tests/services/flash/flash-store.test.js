import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { flashStore } from '@/services/flash/src/flash-store.js'

describe('flash-store', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    flashStore.clearFlashes()
    vi.clearAllTimers()
    vi.useRealTimers()
  })

  it('addFlash appends a flash with the given type', () => {
    flashStore.addFlash('Hello', 'success')

    const flashes = flashStore.getFlashes()
    expect(flashes).toHaveLength(1)
    expect(flashes[0]).toMatchObject({ content: 'Hello', type: 'success', autodelete: true })
  })

  it('error adds an error flash and returns false', () => {
    const result = flashStore.error('Boom')

    expect(result).toBe(false)
    expect(flashStore.getFlashes()[0].type).toBe('error')
  })

  it('success and warning add their respective types', () => {
    flashStore.success('ok')
    flashStore.warning('careful')

    const types = flashStore.getFlashes().map(flash => flash.type)
    expect(types).toEqual(['success', 'warning'])
  })

  it('hasFlash / getFlash locate a flash by id', () => {
    flashStore.addFlash('Hello')
    const { id } = flashStore.getFlashes()[0]

    expect(flashStore.hasFlash(id)).toBe(true)
    expect(flashStore.getFlash(id).content).toBe('Hello')
  })

  it('getFlash returns undefined for an unknown id', () => {
    expect(flashStore.getFlash('unknown-id')).toBeUndefined()
    expect(flashStore.hasFlash('unknown-id')).toBe(false)
  })

  it('removeFlash hides then splices the flash after the animation delay', () => {
    flashStore.addFlash('Hello')
    const { id } = flashStore.getFlashes()[0]

    flashStore.removeFlash(id)
    expect(flashStore.getFlashes()[0].hide).toBe(true)

    vi.advanceTimersByTime(350)
    expect(flashStore.hasFlash(id)).toBe(false)
  })

  it('clearFlashes empties the list', () => {
    flashStore.addFlash('a')
    flashStore.addFlash('b')

    flashStore.clearFlashes()

    expect(flashStore.getFlashes()).toEqual([])
  })
})
