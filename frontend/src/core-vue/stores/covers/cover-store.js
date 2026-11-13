import { ref, readonly } from 'vue'

const covers = ref([])
const officialCoverId = ref()
const myCoverId = ref()

const addCover = cover => {
  covers.value = [...covers.value, cover]
  myCoverId.value = cover.id
}

const clear = () => {
  covers.value = []
  officialCoverId.value = undefined
  myCoverId.value = undefined
}

const replaceCovers = replacedCovers => {
  covers.value = covers.value.map(
    cover => replacedCovers.find(replaced => replaced.id === cover.id) ?? cover,
  )
}

const setCommentCount = (coverId, commentCount) => {
  covers.value = covers.value.map(cover =>
    cover.id === coverId ? { ...cover, commentCount } : cover,
  )
}

const setNovelCovers = novelCovers => {
  covers.value = novelCovers.covers
  officialCoverId.value = novelCovers.officialCoverId
  myCoverId.value = novelCovers.myCoverId
}

const setOfficialCoverId = coverId => {
  officialCoverId.value = coverId
}

export const useCoverStore = () => {
  return {
    covers: readonly(covers),
    officialCoverId: readonly(officialCoverId),
    myCoverId: readonly(myCoverId),
    coverStore: {
      addCover,
      clear,
      replaceCovers,
      setCommentCount,
      setNovelCovers,
      setOfficialCoverId,
    },
  }
}
