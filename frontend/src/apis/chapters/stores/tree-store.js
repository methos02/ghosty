import { ref, readonly, inject } from 'vue'

export const TREE_STORE_KEY = Symbol('tree-store')

const treeStore = () => {
  const chapters = ref([])
  const mainBranchIds = ref([])
  const chosenIds = ref([])

  const setTree = tree => {
    chapters.value = tree.chapters
    mainBranchIds.value = tree.mainBranchIds
  }

  const addChapters = loaded => {
    const known = new Set(chapters.value.map(chapter => chapter.id))
    chapters.value.push(...loaded.filter(chapter => !known.has(chapter.id)))
  }

  const setChosenIds = ids => {
    chosenIds.value = ids
  }

  const clear = () => {
    chapters.value = []
    mainBranchIds.value = []
    chosenIds.value = []
  }

  const serialize = () => ({
    chapters: chapters.value,
    mainBranchIds: mainBranchIds.value,
  })

  const hydrate = data => {
    if (!data) {
      return
    }
    chapters.value = data.chapters ?? []
    mainBranchIds.value = data.mainBranchIds ?? []
  }

  return {
    chapters: readonly(chapters),
    mainBranchIds: readonly(mainBranchIds),
    chosenIds: readonly(chosenIds),
    setTree,
    setChosenIds,
    addChapters,
    clear,
    serialize,
    hydrate,
  }
}

export const createTreeStore = () => treeStore()

export const useTreeStore = () => inject(TREE_STORE_KEY)
