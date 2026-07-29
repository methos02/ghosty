import { describe, it, expect } from 'vitest'
import { createWorkStore } from '@/apis/works/stores/work-store.js'

describe('work-store', () => {
  it('creates isolated stores per call (request-scoped)', () => {
    const storeA = createWorkStore()
    const storeB = createWorkStore()

    storeA.setWorks([{ id: 1 }])

    expect(storeB.works.value).toEqual([])
  })

  it('setWorks replaces the works list', () => {
    const store = createWorkStore()

    store.setWorks([{ id: 1 }, { id: 2 }])

    expect(store.works.value).toHaveLength(2)
  })

  it('setCurrentWork stores the current work', () => {
    const store = createWorkStore()

    store.setCurrentWork({ id: 5, title: 'Chapitre' })

    expect(store.currentWork.value).toEqual({ id: 5, title: 'Chapitre' })
  })

  it('clearCurrentWork resets the current work', () => {
    const store = createWorkStore()
    store.setCurrentWork({ id: 5 })

    store.clearCurrentWork()

    expect(store.currentWork.value).toBeUndefined()
  })
})
