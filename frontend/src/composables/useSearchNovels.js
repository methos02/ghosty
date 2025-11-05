import { ref, readonly } from 'vue'
import { NovelController } from '@/apis/novels/controllers/novel-controller.js'
import { STATUS } from '@/services/ajax/ajax-constants.js'

const selectedSort = ref('Top 10')
const selectedGenre = ref('Tous')
const novels = ref([])
const isLoading = ref(false)
const errorMessage = ref('')
const pagination = ref({
    page: 1,
    total: 0,
    size: 15,
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
        isLoading.value = true
        errorMessage.value = ''

        const response = await NovelController.list(page)
        if (response.status !== STATUS.SUCCESS) {
            errorMessage.value = response.error
            isLoading.value = false
            return
        }

        novels.value.push(...response.novels)
        pagination.value = response.pagination
        isLoading.value = false
    }

    const loadMore = async () => {
        if (pagination.value.page >= pagination.value.lastPage) return
        await loadNovels(pagination.value.page + 1)
    }

    const hasMore = () => {
        return pagination.value.page < pagination.value.lastPage
    }

    return {
        selectedSort: readonly(selectedSort),
        selectedGenre: readonly(selectedGenre),
        novels: readonly(novels),
        isLoading: readonly(isLoading),
        errorMessage: readonly(errorMessage),
        pagination: readonly(pagination),
        setSort,
        setGenre,
        loadNovels,
        loadMore,
        hasMore
    }
}
