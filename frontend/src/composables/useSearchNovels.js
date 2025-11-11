import { ref, readonly } from 'vue'
import { NovelController } from '@/apis/novels/controllers/novel-controller.js'
import { STATUS } from '@/services/ajax/ajax-constants.js'

const selectedSort = ref('Top 10')
const selectedGenre = ref('Tous')
const novels = ref([])
const pagination = ref({
    nextPage: 1,
    lastPage: 1
})

export const useSearchNovels = () => {
    const setSort = (value) => {
        selectedSort.value = value
    }

    const setGenre = (value) => {
        selectedGenre.value = value
    }

    const loadNovels = async (page = 1) => {
        const response = await NovelController.list(page)
        if (response.status !== STATUS.SUCCESS) {
            return response
        }

        novels.value.push(...response.novels)
        pagination.value = response.pagination
        return response
    }

    const loadMore = async () => {
        if (pagination.value.nextPage > pagination.value.lastPage) return { status: STATUS.SUCCESS }
        return await loadNovels(pagination.value.nextPage)
    }

    const hasMore = () => {
        return pagination.value.nextPage <= pagination.value.lastPage
    }

    return {
        selectedSort: readonly(selectedSort),
        selectedGenre: readonly(selectedGenre),
        novels: readonly(novels),
        pagination: readonly(pagination),
        setSort,
        setGenre,
        loadNovels,
        loadMore,
        hasMore
    }
}
