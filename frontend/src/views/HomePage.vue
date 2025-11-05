<script setup>
    import { ref, onMounted } from 'vue'
    import Header from '@/views/layout/HeaderComponent.vue'
    import SearchBar from '@/views/parts/SearchBar.vue'
    import NovelCard from '@/views/parts/NovelCard.vue'
    import { useSearchNovels } from '@/composables/useSearchNovels.js'
    import { t } from '@/services/services-helper.js'

    const activeTab = ref('home')
    const { novels, isLoading, errorMessage, loadNovels } = useSearchNovels()

    onMounted(async () => {
        if (novels.value.length > 0) return
        await loadNovels()
    })
</script>

<template>
    <div class="home-page | f-column">
        <div class="top-container | f-column">
            <Header />
            <div class="w-xl | f-column j-center g-35 flex-1 a-start">
                <div>
                    <h1 class="top-title | color-neutral-100 fw-400">{{ t('homepage.welcome_title') }}</h1>
                    <p class="top-subtitle | color-neutral-100 fw-400">{{ t('homepage.welcome_subtitle') }}</p>
                </div>
                <button class="btn btn-neutral-100-alt fs-700 px-50 py-10">{{ t('homepage.principle_button') }}</button>
            </div>
            <SearchBar v-model:activeTab="activeTab" />
        </div>

        <div class="novels-container | w-xl py-40 px-20">
            <div v-if="isLoading" class="d-flex j-center p-30">
                <span class="fs-500 color-neutral-700">{{ t('novel.loading') }}</span>
            </div>

            <div v-if="errorMessage" class="bg-danger-100 p-15 radius-10">
                <span class="color-danger fs-500">{{ errorMessage }}</span>
            </div>

            <div v-if="novels.length > 0" class="novels-grid">
                <NovelCard v-for="novel in novels" :key="novel.id" :novel="novel" />
            </div>
        </div>
    </div>
</template>
<style lang="scss">
.home-page {
    min-height: 100vh;
}

.top {
    &-container {
        height: 60vh;
        background-image: url("@/assets/images/accueil.jpg");
        background-image: image-set(
            url("@/assets/images/accueil.webp") type("image/webp") 1x,
            url("@/assets/images/accueil.jpg") type("image/jpeg") 1x
        );
        background-size: cover;
        background-position: center;
        background-repeat: no-repeat;
    }

    &-title {
        font-size: clamp(2rem, 5vw, 3rem);
    }

    &-subtitle {
        font-size: clamp(1rem, 3vw, 1.5rem);
    }
}

.novels {
    &-container {
        margin: 0 auto;
        max-width: 1200px;
    }

    &-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(306px, 1fr));
        gap: 24px;
    }
}
</style>