<script setup>
    import { ref } from 'vue';
    import Header from '@/views/layout/HeaderComponent.vue';
    import SearchBar from '@/views/parts/SearchBar.vue';

    const selectedSort = ref('Top 10');
    const selectedGenre = ref('Tous');
    const activeTab = ref('home');

    const handleSortUpdate = (value) => {
        selectedSort.value = value;
    };

    const handleGenreUpdate = (value) => {
        selectedGenre.value = value;
    };

    const handleTabChange = (tab) => {
        activeTab.value = tab;
    };

    const handleReadClick = () => {
        console.log('Lire clicked');
    };
</script>

<template>
    <div class="top-container | f-column">
        <Header />
        <div class="w-xl | f-column j-center g-35 flex-1 a-start">
            <div>
                <h1 class="top-title | color-neutral-100 fw-400">Bienvenue sur GHOSTY,</h1>
                <p class="top-subtitle | color-neutral-100 fw-400">Le premier site de romans participatifs.</p>
            </div>
            <button class="btn btn-neutral-100-alt fs-700 px-50 py-10">
                Le principe
            </button>
        </div>
        <SearchBar
            :selected-sort="selectedSort"
            :selected-genre="selectedGenre"
            :active-tab="activeTab"
            @update:sort="handleSortUpdate"
            @update:genre="handleGenreUpdate"
            @tab-change="handleTabChange"
            @read-click="handleReadClick"
        />
    </div>
</template>
<style lang="scss">
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
</style>