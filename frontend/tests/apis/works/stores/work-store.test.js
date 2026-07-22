import { describe, it, expect, beforeEach } from 'vitest'
import { useWorkStore } from '@/apis/works/stores/work-store.js'

describe('work-store', () => {
  let store

  beforeEach(() => {
    store = useWorkStore()
    store.setWorks([])
    store.clearCurrentWork()
  })

  it('shares state across calls (singleton module state)', () => {
    const a = useWorkStore()
    const b = useWorkStore()

    a.setWorks([{ id: 1 }])

    expect(b.works.value).toEqual([{ id: 1 }])
  })

  it('setWorks replaces the works list', () => {
    store.setWorks([{ id: 1 }, { id: 2 }])

    expect(store.works.value).toHaveLength(2)
  })

  it('setCurrentWork stores the current work', () => {
    store.setCurrentWork({ id: 5, title: 'Chapitre' })

    expect(store.currentWork.value).toEqual({ id: 5, title: 'Chapitre' })
  })

  it('clearCurrentWork resets the current work', () => {
    store.setCurrentWork({ id: 5 })

    store.clearCurrentWork()

    expect(store.currentWork.value).toBeUndefined()
  })
})
