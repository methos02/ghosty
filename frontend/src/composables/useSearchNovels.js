import { ref, readonly } from 'vue'
import { NovelController } from '@/apis/novels/controllers/novel-controller.js'
import { STATUS } from '@/services/ajax/ajax-constants.js'

const selectedSort = ref('Top 10')
const selectedGenre = ref('Tous')
const novels = ref([])
const isLoading = ref(false)
const errorMessage = ref('')

export const useSearchNovels = () => {
    const setSort = (value) => {
        selectedSort.value = value
    }

    const setGenre = (value) => {
        selectedGenre.value = value
    }

    const loadNovels = async () => {
        isLoading.value = true
        errorMessage.value = ''

        const response = await NovelController.list()

        if (response.status !== STATUS.SUCCESS) {
            errorMessage.value = response.error
            isLoading.value = false
            return
        }

        novels.value = response.novels
        isLoading.value = false
    }

    return {
        selectedSort: readonly(selectedSort),
        selectedGenre: readonly(selectedGenre),
        novels: readonly(novels),
        isLoading: readonly(isLoading),
        errorMessage: readonly(errorMessage),
        setSort,
        setGenre,
        loadNovels
    }
}
