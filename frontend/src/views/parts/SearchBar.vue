<script setup>
import { ref } from 'vue'
import DropdownComponent from '@/components/DropdownComponent.vue'
import { useSearchNovels } from '@/composables/useSearchNovels.js'

const activeTab = defineModel('activeTab', {
  type: String,
  default: 'home'
})

const { selectedSort, selectedGenre, setSort, setGenre } = useSearchNovels()

const sortDropdown = ref(null)
const genreDropdown = ref(null)

const sortOptions = ['Top 10', 'Récents', 'Populaires', 'Alphabétique']
const genreOptions = ['Tous', 'Fantasy', 'Science-Fiction', 'Romance', 'Thriller', 'Horreur']

const selectSort = (option) => {
  setSort(option)
  sortDropdown.value?.hide()
}

const selectGenre = (option) => {
  setGenre(option)
  genreDropdown.value?.hide()
}
</script>

<template>
  <div class="search-bar | d-flex a-end j-center p-relative w-100">
    <!-- Partie gauche : Trier par -->
    <div class="search-bar__side | left d-flex a-center g-10">
      <span class="search-bar__label | color-neutral-100">Trier par</span>
      <DropdownComponent ref="sortDropdown" orientation="left">
        <template #button>
          <button class="search-bar__select | bg-neutral-100 bg-neutral-300-hover radius-10 d-flex a-center j-between px-5 pointer">
            <span class="search-bar__select-text | fs-300 flex-1">{{ selectedSort }}</span>
            <i class="search-bar__icon | fas fa-chevron-down d-flex a-center j-center"></i>
          </button>
        </template>
        <template #items>
          <div class="dropdown-menu">
            <button
              v-for="option in sortOptions"
              :key="option"
              class="dropdown-item | py-5 px-10 pointer"
              :class="{ 'dropdown-item--active': selectedSort === option }"
              @click="selectSort(option)"
            >
              {{ option }}
            </button>
          </div>
        </template>
      </DropdownComponent>
    </div>

    <!-- Partie centrale : Onglets + Bouton Lire -->
    <div class="search-bar__center | f-column">
      <!-- Onglets -->
      <div class="search-bar__tabs | d-flex j-center">
        <button
          class="search-bar__tab"
          :class="{ 'search-bar__tab--active' : activeTab === 'home' }"
          @click="activeTab = 'home'"
        >
          Accueil
        </button>
        <button
          class="search-bar__tab"
          :class="{ 'search-bar__tab--active' : activeTab === 'search' }"
          @click="activeTab = 'search'"
        >
          Recherche
        </button>
      </div>

      <!-- Bouton Lire -->
      <button
        class="search-bar__read | flex-1 w-100 text-center pointer color-neutral-100 fs-700 fw-400 bg-primary-700-hover bg-primary py-10"
      >
        Lire
      </button>
    </div>

    <!-- Partie droite : Genre -->
    <div class="search-bar__side | right d-flex a-center g-10">
      <span class="search-bar__label | color-neutral-100">Genre</span>
      <DropdownComponent ref="genreDropdown" orientation="right">
        <template #button>
          <button class="search-bar__select | bg-neutral-100 bg-neutral-300-hover radius-10 d-flex a-center j-between px-5 pointer">
            <span class="search-bar__select-text | fs-300 flex-1">{{ selectedGenre }}</span>
            <i class="search-bar__icon | fas fa-chevron-down d-flex a-center j-center"></i>
          </button>
        </template>
        <template #items>
          <div class="dropdown-menu">
            <button
              v-for="option in genreOptions"
              :key="option"
              class="dropdown-item | py-5 px-10 pointer"
              :class="{ 'dropdown-item--active': selectedGenre === option }"
              @click="selectGenre(option)"
            >
              {{ option }}
            </button>
          </div>
        </template>
      </DropdownComponent>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.search-bar {
  &__side {
    height: 40px;
    padding-left: 24px;
    padding-right: 12px;
    background-color: rgba(0, 0, 0, 0.8);
    
    &.left { border-radius: 10px 0 0 0;}
    &.right {border-radius: 0 10px 0 0;}
  }

  &__label {
    font-size: 16px;
    line-height: 24px;
    opacity: 0.9;
    white-space: nowrap;
  }

  &__select {
    height: 24px;
    width: 125px;
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

.dropdown-menu {
  display: flex;
  flex-direction: column;
}

.dropdown-item {
  background: white;
  border: none;
  text-align: left;
  transition: background-color 0.2s;
  white-space: nowrap;

  &:hover {
    background-color: var(--neutral-200);
  }

  &--active {
    background-color: var(--primary-100);
    color: var(--primary-700);
    font-weight: 500;
  }
}
</style>
