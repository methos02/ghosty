import { describe, it, expect, afterEach } from 'vitest'
import { useWorkStore } from '@/apis/works/stores/work-store.js'

describe('work-store', () => {
  const store = useWorkStore()

  afterEach(() => {
    store.setWorks([])
    store.clearCurrentWork()
  })

  it('shares state across calls (singleton module state)', () => {
    const storeA = useWorkStore()
    const storeB = useWorkStore()

    storeA.setWorks([{ id: 1 }])

    expect(storeB.works.value).toEqual([{ id: 1 }])
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
