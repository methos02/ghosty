# CLAUDE.md - Frontend

This file provides guidance to Claude Code (claude.ai/code) when working with the **frontend** part of Ghosty.

## Vue d'Ensemble

**Frontend Ghosty** : Application Vue 3 avec Composition API utilisant le framework **Vuemann 4.2.0** pour la gestion des services, styles et patterns.

- **Framework** : Vue 3 (Composition API avec `<script setup>`)
- **Build Tool** : Vite 7
- **Router** : Vue Router 4
- **État Global** : Composables Vue natifs (pas Pinia)
- **Styles** : Vuemann SCSS (95%+) + CSS custom minimal
- **Tests** : Vitest avec @vue/test-utils
- **HTTP** : Axios via service Vuemann `req()`
- **i18n** : Service Vuemann `t()` (pas vue-i18n)

## Commandes de Développement

```bash
# Installation
npm install

# Développement (http://localhost:5173)
npm run dev

# Build production (vers backend/public/build)
npm run build

# Tests
npm run test              # Mode watch
npm run test:ui           # Interface UI

# Preview du build
npm run preview
```

## Architecture Frontend

### Structure des Dossiers

```
frontend/src/
├── apis/                       # Logique métier par domaine (à créer)
│   └── ghosty/
│       ├── controllers/        # Orchestration DTO + Repository
│       ├── repositories/       # SEUL endroit pour req()
│       ├── dtos/              # Transformation API ↔ Vue
│       ├── formRequest/       # Validation formulaires
│       └── services/          # Orchestration multi-controllers
├── views/                      # Pages et composants Vue
│   ├── HomePage.vue
│   ├── layout/
│   │   └── HeaderComponent.vue
│   └── parts/                 # Sous-composants spécifiques
├── composables/               # Composables globaux (état partagé)
│   ├── useAuth.js
│   ├── useNovels.js
│   └── useWorks.js
├── services/                  # Services Vuemann
│   ├── ajax/                 # Service HTTP (req)
│   ├── locale/               # Service i18n (t)
│   ├── services-manager.js   # Gestionnaire central
│   └── services-helper.js    # Helpers (t, req, error)
├── config/                    # Configuration
│   ├── routes-config.js      # Routes Vue Router
│   └── routes-api-config.js  # Endpoints API
├── assets/                    # Assets statiques
│   ├── scss/
│   │   ├── app.scss          # Point d'entrée SCSS
│   │   ├── _variables.scss   # Variables Ghosty
│   │   └── layout/           # Classes utilitaires Vuemann
│   ├── images/
│   └── fonts/
└── main.js                    # Point d'entrée application
```

### Flux de Données

```
┌─────────────────┐
│  HomePage.vue   │
│                 │
│ onMounted() {   │
│   loadNovels()  │
│ }               │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  useNovels()    │  Composable global
│                 │
│ - novels: ref() │  État partagé (stockage uniquement)
│ - setNovels()   │  Pas d'appels API
│ - addNovel()    │
└─────────────────┘
         │
         ▼
┌─────────────────┐
│ NovelController │  Controller
│                 │
│ list(filters) { │  Orchestration DTO + Repo
│   1. toList()   │
│   2. repo.list() │
│   3. fromShow()  │
│ }               │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ NovelRepository │  Repository
│                 │
│ list(filters) { │  SEUL endroit pour req()
│   return req(   │
│     'novel.list'│
│   )             │
│ }               │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│   API Laravel   │  Backend
│  /api/v1/novels │
└─────────────────┘
```

## Services Vuemann

### Initialisation dans main.js

```javascript
import { servicesM } from './services/services-manager.js'
import { localeInit } from './services/locale/locale-init.js'
import { ajaxInit } from './services/ajax/ajax-init.js'

await servicesM.initServices(app, {
  locale: localeInit,  // Doit être en premier (ajax en dépend)
  ajax: ajaxInit
})
```

### Helpers Disponibles

```javascript
import { t, req, error } from '@/services/services-helper.js'

// ✅ t() - Traductions (dans tous les fichiers)
const title = t('novels.title')

// ✅ req() - Requêtes HTTP (UNIQUEMENT dans repositories)
const response = await req('novel.list', { params: { status: 'active' } })

// ✅ error() - Afficher une erreur (dans controllers/services)
if (response.status !== STATUS.SUCCESS) {
  error(response.error)
}
```

**⚠️ RÈGLE CRITIQUE** : `req()` ne doit être utilisé QUE dans les **repositories**.

## Développement de Fonctionnalités

### 1. Configuration API (routes-api-config.js)

Déclarer les endpoints :

```javascript
export const routesApi = {
  novel: {
    list: { url: 'v1/novels', method: 'get', api: 'ghosty' },
    show: { url: 'v1/novels/{id}', method: 'get', api: 'ghosty' },
    create: { url: 'v1/novels', method: 'post', api: 'ghosty' },
    update: { url: 'v1/novels/{id}', method: 'put', api: 'ghosty' },
    destroy: { url: 'v1/novels/{id}', method: 'delete', api: 'ghosty' }
  }
}
```

### 2. DTO (Data Transfer Object)

Transformer données API ↔ format Vue :

```javascript
// src/apis/ghosty/dtos/novel-dto.js

const fromShow = (novel) => ({
  id: novel.nov_id,
  title: novel.nov_title,
  status: novel.nov_status,
  author: {
    id: novel.nov_id_author,
    pseudo: novel.author_pseudo
  },
  genre: {
    id: novel.nov_id_genre,
    label: novel.genre_label
  },
  createdAt: dateHelper.formatDate(novel.nov_date_publi, 'DD/MM/YYYY')
})

const toList = (filters) => ({
  id_genre: filters.genre,
  id_author: filters.author,
  status: filters.status
})

export const NovelDto = { fromShow, toList }
```

### 3. Repository

SEUL endroit pour appels API :

```javascript
// src/apis/ghosty/repositories/novel-repository.js
import { req } from '@/services/services-helper.js'

const list = async (filters = {}) => {
  return await req('novel.list', { params: filters })
}

const getById = async (id) => {
  return await req('novel.show', { params: { id } })
}

const create = async (data) => {
  return await req('novel.create', { data })
}

const update = async (id, data) => {
  return await req('novel.update', { params: { id }, data })
}

const destroy = async (id) => {
  return await req('novel.destroy', { params: { id } })
}

export const NovelRepository = { list, getById, create, update, destroy }
```

### 4. Controller

Orchestrer Repository + DTO :

```javascript
// src/apis/ghosty/controllers/novel-controller.js
import { NovelRepository } from '@/apis/ghosty/repositories/novel-repository.js'
import { NovelDto } from '@/apis/ghosty/dtos/novel-dto.js'
import { STATUS } from '@/config/constants.js'

const list = async (filters = {}) => {
  // 1. Transformation filtres
  const apiFilters = NovelDto.toList(filters)

  // 2. Appel repository
  const response = await NovelRepository.list(apiFilters)
  if (response.status !== STATUS.SUCCESS) {
    return response
  }

  // 3. Transformation données
  return {
    novels: response.data.map(novel => NovelDto.fromShow(novel)),
    status: STATUS.SUCCESS
  }
}

const getById = async (id) => {
  const response = await NovelRepository.getById(id)
  if (response.status !== STATUS.SUCCESS) {
    return response
  }

  return {
    novel: NovelDto.fromShow(response.data),
    status: STATUS.SUCCESS
  }
}

export const NovelController = { list, getById }
```

### 5. Composable Global

Stockage d'état partagé uniquement :

```javascript
// src/composables/useNovels.js
import { ref, computed, readonly } from 'vue'

// ⚠️ État global (hors fonction = partagé)
const novels = ref([])
const isLoading = ref(false)

export const useNovels = () => {
  // Getters
  const novelsCount = computed(() => novels.value.length)

  // Setters
  const setNovels = (newNovels) => {
    novels.value = newNovels
  }

  const addNovel = (novel) => {
    novels.value.push(novel)
  }

  const clearNovels = () => {
    novels.value = []
  }

  const setLoading = (loading) => {
    isLoading.value = loading
  }

  return {
    // État (readonly)
    novels: readonly(novels),
    isLoading: readonly(isLoading),

    // Computed
    novelsCount,

    // Actions
    setNovels,
    addNovel,
    clearNovels,
    setLoading
  }
}
```

**❌ INTERDIT dans les composables** :
- Appels API (`req()`)
- Logique métier complexe
- Validation de données

### 6. Composant Vue

Présentation et interaction utilisateur :

```vue
<!-- src/views/HomePage.vue -->
<script setup>
import { ref, onMounted } from 'vue'
import { t } from '@/services/services-helper.js'
import { useNovels } from '@/composables/useNovels.js'
import { NovelController } from '@/apis/ghosty/controllers/novel-controller.js'
import { STATUS } from '@/config/constants.js'

const { novels, isLoading, setNovels, setLoading } = useNovels()
const errorMessage = ref('')

const loadNovels = async () => {
  setLoading(true)
  errorMessage.value = ''

  const response = await NovelController.list()

  if (response.status !== STATUS.SUCCESS) {
    errorMessage.value = response.error
    setLoading(false)
    return
  }

  setNovels(response.novels)
  setLoading(false)
}

onMounted(async () => {
  if (novels.value.length > 0) return  // Déjà chargé
  await loadNovels()
})
</script>

<template>
  <div class="d-flex f-column g-20 p-20">
    <h1 class="fs-700 fw-700 color-primary">
      {{ t('novels.title') }}
    </h1>

    <div v-if="isLoading" class="d-flex j-center p-30">
      <span>{{ t('common.loading') }}</span>
    </div>

    <div v-else-if="errorMessage" class="bg-danger-100 p-15 radius-10">
      {{ errorMessage }}
    </div>

    <div v-else class="d-flex f-wrap g-15">
      <div
        v-for="novel in novels"
        :key="novel.id"
        class="bg-white p-20 radius-10 pointer"
      >
        <h3 class="fs-500 fw-500 mb-10">{{ novel.title }}</h3>
        <p class="fs-400 color-neutral-700">{{ novel.author.pseudo }}</p>
      </div>
    </div>
  </div>
</template>
```

## Styles avec Vuemann

### Règle d'Or : Utiliser les Classes Existantes

**AVANT d'écrire du CSS custom**, consulter :
- `src/assets/scss/layout/` (classes utilitaires)
- `src/assets/scss/_variables.scss` (variables couleurs, espacements)
- `vuemann/src/assets/scss/` (documentation complète)

### Classes Utilitaires Principales

```scss
// Layout & Flexbox
.d-flex              // display: flex
.f-column            // flex-direction: column
.f-wrap              // flex-wrap: wrap
.j-between           // justify-content: space-between
.j-center            // justify-content: center
.a-center            // align-items: center
.g-10, .g-15, .g-20  // gap

// Spacing (0-50px par pas de 5)
.p-10, .p-15, .p-20  // padding
.m-10, .m-15, .m-20  // margin
.px-15, .py-10       // padding horizontal/vertical
.mt-10, .mb-20       // margin-top/bottom

// Typographie
.fs-400, .fs-500, .fs-600, .fs-700  // font-size
.fw-400, .fw-500, .fw-700           // font-weight
.text-center, .text-end             // text-align

// Couleurs
.color-primary         // Couleur texte
.bg-primary-100        // Couleur fond
.bg-neutral-200
.border-primary        // Couleur bordure

// Dimensions
.w-100, .w-50          // width: 100%, 50%
.h-100                 // height: 100%
.radius-5, .radius-10  // border-radius

// Interactions
.pointer               // cursor: pointer
.underline-hover:hover
```

### Variables SCSS Ghosty

```scss
// src/assets/scss/_variables.scss

// Couleurs principales (à définir selon design)
$primary: #02b875      // Vert Ghosty
$primary-100: #e6f9f2
$primary-300: #66d9af
$primary-600: #018a5c

$neutral-100: #fdfffd  // Blanc Ghosty
$neutral-200: #f5f5f5
$neutral-700: #4a4a4a
$neutral-900: #1a1a1a

$danger: #e74c3c
$success: #27ae60
$warning: #f39c12
$info: #3498db

// Espacements
$spacing-5: 5px
$spacing-10: 10px
$spacing-15: 15px
$spacing-20: 20px
```

### CSS Custom (Exceptions)

Documenter chaque exception :

```vue
<style lang="scss">
// Exception Vuemann : Grid 3 colonnes responsive
.novel-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: var(--spacing-20);
}

// Exception Vuemann : Animation custom
@keyframes voteAnimation {
  0% { transform: scale(1); }
  50% { transform: scale(1.2); }
  100% { transform: scale(1); }
}

.vote-button:active {
  animation: voteAnimation 0.3s ease;
}
</style>
```

## Traductions (i18n)

### Système t() de Vuemann

```javascript
import { t } from '@/services/services-helper.js'

// Utilisation dans composants
const title = t('novels.title')
const error = t('errors.not_found')
```

```vue
<template>
  <h1>{{ t('novels.title') }}</h1>
  <button>{{ t('common.submit') }}</button>
</template>
```

### Organisation des Traductions

```
src/services/locale/locales/
├── fr/
│   ├── locale-fr.json              # Traductions globales
│   └── locale-component.json       # Composant locale
└── en/
    └── ...

// À créer pour Ghosty
src/locales/
├── fr/
│   ├── global-fr.json              # Messages communs
│   ├── errors-fr.json              # Messages d'erreur
│   └── views/
│       └── HomePage-fr.json        # Traductions page
```

**Exemple de fichier de traduction** :

```json
// src/locales/fr/views/HomePage-fr.json
{
  "novels": {
    "title": "Tous les romans",
    "create_new": "Créer un nouveau roman",
    "no_results": "Aucun roman trouvé"
  }
}
```

## Tests

### Structure Mirror

```
src/apis/ghosty/controllers/novel-controller.js
tests/apis/ghosty/controllers/novel-controller.test.js

src/views/HomePage.vue
tests/views/HomePage.test.js
```

### Exemple de Test Controller

```javascript
// tests/apis/ghosty/controllers/novel-controller.test.js
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { NovelController } from '@/apis/ghosty/controllers/novel-controller.js'
import { NovelRepository } from '@/apis/ghosty/repositories/novel-repository.js'
import { NovelDto } from '@/apis/ghosty/dtos/novel-dto.js'
import { STATUS } from '@/config/constants.js'

describe('NovelController', () => {
  beforeEach(() => {
    // Mock repository (seul mock autorisé)
    const mockNovels = [
      { nov_id: 1, nov_title: 'Test Novel', nov_status: 'active' }
    ]

    vi.spyOn(NovelRepository, 'list').mockResolvedValue({
      status: STATUS.SUCCESS,
      data: mockNovels
    })

    // Spy sur DTO SANS mock (garde vraie logique)
    vi.spyOn(NovelDto, 'toList')
    vi.spyOn(NovelDto, 'fromShow')
  })

  it('should transform filters and return novels on success', async () => {
    const filters = { genre: 1, status: 'active' }

    const result = await NovelController.list(filters)

    // Vérifier le flow
    expect(NovelDto.toList).toHaveBeenCalledWith(filters)
    expect(NovelRepository.list).toHaveBeenCalled()
    expect(NovelDto.fromShow).toHaveBeenCalled()

    // Vérifier résultat
    expect(result.status).toBe(STATUS.SUCCESS)
    expect(result.novels).toHaveLength(1)
    expect(result.novels[0].title).toBe('Test Novel')
  })
})
```

### Exemple de Test Composant

```javascript
// tests/views/HomePage.test.js
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { t } from '@/services/services-helper.js'
import HomePage from '@/views/HomePage.vue'
import { NovelController } from '@/apis/ghosty/controllers/novel-controller.js'
import { STATUS } from '@/config/constants.js'

describe('HomePage', () => {
  let wrapper

  beforeEach(() => {
    vi.spyOn(NovelController, 'list').mockResolvedValue({
      status: STATUS.SUCCESS,
      novels: [
        { id: 1, title: 'Novel 1', author: { pseudo: 'Author 1' } }
      ]
    })
  })

  afterEach(async () => {
    await flushPromises()
    await new Promise(resolve => setTimeout(resolve, 50))
    if (wrapper) {
      wrapper.unmount()
      wrapper = null
    }
  })

  it('should load and display novels on mount', async () => {
    wrapper = mount(HomePage)

    await flushPromises()

    expect(NovelController.list).toHaveBeenCalled()
    expect(wrapper.find('h1').text()).toBe(t('novels.title'))
    expect(wrapper.text()).toContain('Novel 1')
  })
})
```

## Configuration

### Routes Vue Router

```javascript
// src/config/routes-config.js
export const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import('@/views/HomePage.vue')
  },
  {
    path: '/novels/:id',
    name: 'novel-detail',
    component: () => import('@/views/NovelDetailPage.vue')
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/LoginPage.vue')
  }
]
```

### Routes API

```javascript
// src/config/routes-api-config.js
export const routesApi = {
  novel: {
    list: { url: 'v1/novels', method: 'get', api: 'ghosty' },
    show: { url: 'v1/novels/{id}', method: 'get', api: 'ghosty' }
  },
  work: {
    list: { url: 'v1/works', method: 'get', api: 'ghosty' },
    show: { url: 'v1/works/{id}', method: 'get', api: 'ghosty' }
  }
}

export const apis = {
  ghosty: {
    base_url: import.meta.env.VITE_API_URL || 'http://localhost:8000/api'
  }
}
```

## Bonnes Pratiques

### ✅ À FAIRE
- Utiliser `t()` pour TOUS les textes affichés
- Utiliser classes SCSS Vuemann au maximum (95%+)
- Early return dans toutes les fonctions
- Props typées dans composants Vue
- Logique métier en fichiers `.js` natifs
- `req()` UNIQUEMENT dans repositories
- Composables pour état partagé uniquement
- Tests avec mock minimal (repositories seulement)

### ❌ À ÉVITER
- `req()` hors des repositories
- Logique métier dans composants Vue
- Logique métier dans composables
- CSS custom sans vérifier classes Vuemann
- Strings hardcodés (utiliser `t()`)
- `else` ou `else if` en JavaScript
- `vi.mock()` (utiliser `vi.spyOn()`)
- Tester les repositories directement

## Liens Utiles

- **[../CLAUDE.md](../CLAUDE.md)** : Vue d'ensemble du projet
- **[../CLAUDE_BEST_PRACTICES.md](../CLAUDE_BEST_PRACTICES.md)** : Bonnes pratiques complètes
- **[../vuemann/CLAUDE.md](../vuemann/CLAUDE.md)** : Documentation Vuemann
- **[../AUDIT_MIGRATION.md](../AUDIT_MIGRATION.md)** : Audit et plan migration

---

**Version** : 1.0
**Date** : 2025-10-18
**Frontend** : Vue 3 + Vuemann 4.2.0
