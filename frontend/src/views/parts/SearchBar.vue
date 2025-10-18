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
  <div class="search-bar">
    <!-- Partie gauche : Trier par -->
    <div class="search-bar__section">
      <div class="search-bar__container bg-neutral-900">
        <span class="search-bar__label color-neutral-100">Trier par</span>
        <button
          class="search-bar__select bg-neutral-100 radius-10 d-flex a-center j-between px-5 py-5"
          @click="toggleSortMenu"
        >
          <span class="fs-300">{{ selectedSort }}</span>
          <i class="fas fa-chevron-down fs-300"></i>
        </button>
      </div>
    </div>

    <!-- Partie centrale : Onglets + Bouton Lire -->
    <div class="search-bar__center f-column">
      <!-- Onglets -->
      <div class="search-bar__tabs d-flex j-center">
        <button
          :class="[
            'search-bar__tab',
            activeTab === 'home' ? 'search-bar__tab--active' : 'search-bar__tab--inactive'
          ]"
          @click="changeTab('home')"
        >
          Accueil
        </button>
        <button
          :class="[
            'search-bar__tab',
            activeTab === 'search' ? 'search-bar__tab--active' : 'search-bar__tab--inactive'
          ]"
          @click="changeTab('search')"
        >
          Recherche
        </button>
      </div>

      <!-- Bouton Lire -->
      <button class="search-bar__read-btn fs-700" @click="handleRead">
        Lire
      </button>
    </div>

    <!-- Partie droite : Genre -->
    <div class="search-bar__section">
      <div class="search-bar__container bg-neutral-900">
        <span class="search-bar__label color-neutral-100">Genre</span>
        <button
          class="search-bar__select bg-neutral-100 radius-10 d-flex a-center j-between px-5 py-5"
          @click="toggleGenreMenu"
        >
          <span class="fs-300">{{ selectedGenre }}</span>
          <i class="fas fa-chevron-down fs-300"></i>
        </button>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use '@/assets/scss/variables';

.search-bar {
  display: flex;
  align-items: flex-end;
  justify-content: center;
  position: relative;
  width: 100%;
  gap: 0;

  &__section {
    height: 40px;
  }

  &__container {
    display: flex;
    align-items: center;
    gap: 12px;
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
    cursor: pointer;
    transition: background-color 0.3s;

    &:hover {
      background-color: var(--neutral-300);
    }

    span {
      flex: 1;
      text-align: left;
    }

    i {
      font-size: 12px;
      width: 16px;
      height: 16px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }

  &__center {
    height: 80px;
    width: 360px;
  }

  &__tabs {
    height: 32px;
  }

  &__tab {
    height: 32px;
    border: none;
    cursor: pointer;
    font-size: 16px;
    line-height: 24px;
    padding: 4px 32px;
    transition: background-color 0.3s, color 0.3s;

    &--active {
      background-color: var(--neutral-100);
      color: #00bc7d;
      border-radius: 10px 0 0 0;
    }

    &--inactive {
      background-color: rgba(255, 255, 255, 0.75);
      color: #009966;
      border-radius: 0 10px 0 0;

      &:hover {
        background-color: rgba(255, 255, 255, 0.9);
      }
    }
  }

  &__read-btn {
    flex: 1;
    width: 100%;
    border-radius: 10px 10px 10px 10px;
    box-shadow: 0px 10px 15px -3px rgba(0, 0, 0, 0.1), 0px 4px 6px -4px rgba(0, 0, 0, 0.1);
    border: none;
    cursor: pointer;
    background-color: #00bc7d;
    color: var(--neutral-100);
    font-weight: 400;
    transition: background-color 0.3s;

    &:hover {
      background-color: #009966;
    }
  }
}
</style>
