<script setup>
import { ref } from 'vue'

// Props
const props = defineProps({
  selectedSort: {
    type: String,
    default: 'Top 10'
  },
  selectedGenre: {
    type: String,
    default: 'Tous'
  },
  activeTab: {
    type: String,
    default: 'home'
  }
})

// Emits
const emit = defineEmits(['update:sort', 'update:genre', 'tab-change', 'read-click'])

// État local
const sortMenuOpen = ref(false)
const genreMenuOpen = ref(false)

const toggleSortMenu = () => {
  sortMenuOpen.value = !sortMenuOpen.value
  genreMenuOpen.value = false
}

const toggleGenreMenu = () => {
  genreMenuOpen.value = !genreMenuOpen.value
  sortMenuOpen.value = false
}

const selectSort = (value) => {
  emit('update:sort', value)
  sortMenuOpen.value = false
}

const selectGenre = (value) => {
  emit('update:genre', value)
  genreMenuOpen.value = false
}

const changeTab = (tab) => {
  emit('tab-change', tab)
}

const handleRead = () => {
  emit('read-click')
}
</script>

<template>
  <div class="search-bar | d-flex a-end j-center p-relative w-100">
    <!-- Partie gauche : Trier par -->
    <div class="search-bar__container | d-flex a-center g-10">
      <span class="search-bar__label | color-neutral-100">Trier par</span>
      <button
        class="search-bar__select | bg-neutral-100 bg-neutral-300-hover radius-10 d-flex a-center j-between px-5 pointer"
        @click="toggleSortMenu"
      >
        <span class="search-bar__select-text | fs-300 flex-1">{{ selectedSort }}</span>
        <i class="search-bar__icon | fas fa-chevron-down d-flex a-center j-center"></i>
      </button>
    </div>

    <!-- Partie centrale : Onglets + Bouton Lire -->
    <div class="search-bar__center | f-column">
      <!-- Onglets -->
      <div class="search-bar__tabs | d-flex j-center">
        <button
          class="search-bar__tab"
          :class="{ 'search-bar__tab--active' : activeTab === 'home' }"
          @click="changeTab('home')"
        >
          Accueil
        </button>
        <button
          class="search-bar__tab"
          :class="{ 'search-bar__tab--active' : activeTab === 'search' }"
          @click="changeTab('search')"
        >
          Recherche
        </button>
      </div>

      <!-- Bouton Lire -->
      <button
        class="search-bar__read | flex-1 w-100 text-center pointer color-neutral-100 fs-700 fw-400 bg-primary-700-hover bg-primary py-10"
        @click="handleRead"
      >
        Lire
      </button>
    </div>

    <!-- Partie droite : Genre -->
    <div class="search-bar__container | d-flex a-center g-10">
      <span class="search-bar__label | color-neutral-100">Genre</span>
      <button
        class="search-bar__select | bg-neutral-100 bg-neutral-300-hover radius-10 d-flex a-center j-between px-5 pointer"
        @click="toggleGenreMenu"
      >
        <span class="fs-300 flex-1">{{ selectedGenre }}</span>
        <i class="search-bar__icon | fas fa-chevron-down d-flex a-center j-center"></i>
      </button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
// Exception Vuemann : Dimensions et styles spécifiques à la SearchBar
.search-bar {
  &__section {
    height: 40px;
  }

  &__container {
    height: 40px;
    padding-left: 24px;
    padding-right: 12px;
    background-color: rgba(0, 0, 0, 0.8);
    border-radius: 10px 10px 0 0;
  }

  &__label {
    font-size: 16px;
    line-height: 24px;
    opacity: 0.9;
    white-space: nowrap;
  }

  &__select {
    height: 24px;
    width: 100px;
    border: none;
    transition: background-color 0.3s;
  }

  &__select-text {
    text-align: left;
  }

  &__icon {
    font-size: 12px;
    width: 16px;
    height: 16px;
  }

  &__center {
    width: 360px;
  }

  &__tabs {
    > :first-child { border-radius: 5px 0 0 0; }
    > :last-child { border-radius: 0 5px 0 0; }
  }

  &__tab {
    font-size: 1rem;
    transition: background-color 0.3s, color 0.3s;
    padding: 4px 20px;
    background-color: rgba(255, 255, 255, 0.75);
    color: var(--primary-700);
    cursor: pointer;

    &--active, &:hover {
      background-color: var(--neutral-100);
    }
  }

  &__read {
    border-radius: 10px 10px 0 0;
  }
}
</style>
