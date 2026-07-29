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

# Développement SPA pur (Vite, http://localhost:5173) — sans SSR
npm run dev

# Développement SSR (serveur Node + Vite middleware, http://localhost:5173)
npm run dev:ssr

# Build production SSR (client → dist/client, serveur → dist/server)
npm run build             # = build:client && build:server

# Serveur SSR de production
npm run serve             # node server.js --prod

# Tests
npm run test              # Mode watch
npm run test:ui           # Interface UI

# Preview du build
npm run preview
```

> ⚠️ Le point d'entrée client est **`src/ssr/entry-client.js`** (plus `main.js`, conservé inerte). Le build ne sort plus vers `backend/public/build` : le **serveur Node SSR** (`server.js`) sert le HTML rendu + les assets, et Laravel reste une **API pure**.

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
│   └── shortcuts/            # API (t, req, flash, auth, form) via services-shortcut.js
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

## Rendu côté serveur (SSR isomorphe)

L'app est rendue côté serveur (contenu + meta/OG dans le HTML pour le SEO), puis hydratée côté client.

### Trio d'entrée + factory

L'infra SSR isomorphe est regroupée dans **`src/ssr/`** (hors `server.js`, process Node à la racine de `frontend/`).

- **`src/ssr/app.js`** — factory `createApp({ ssr })` : `createSSRApp`, router neuf par requête, `provide()` des stores request-scoped, retourne `{ app, router, stores }`. Expose aussi `serializeStores` / `hydrateStores`.
- **`src/ssr/entry-client.js`** — hydrate : `createApp()`, `hydrateStores(stores, window.__INITIAL_STATE__)`, `router.isReady()`, `mount('#app')`.
- **`src/ssr/entry-server.js`** — `render(url)` : push l'URL, exécute le prefetch, `renderToString`, renvoie `{ html, head, state, statusCode }`.
- **`server.js`** (racine `frontend/`) — serveur Express (dev = Vite middleware + `ssrLoadModule` ; prod = `dist/client` statique + `dist/server`). Injecte `<!--app-html-->`, `<!--ssr-state-->` et le head (`@unhead/vue`).
- **`src/ssr/services-boot.js`** — boot **global unique** (mémoïsé) : enregistre les services/stores + crée l'i18n. À distinguer du wiring **par requête** fait dans `ssr/app.js`.

### Règles SSR (à respecter pour tout nouveau code)

1. **Stores request-scoped** : un store consommé au SSR est une **factory** (`createXStore()`) fournie via `provide()` dans `app.js` ; `useXStore()` fait `inject(KEY, false) ?? fallback`. **JAMAIS** de `ref()` au niveau module partagé pour de la donnée rendue au serveur (fuite entre requêtes). Chaque store expose `serialize()` / `hydrate()`. Voir `apis/novels/stores/novel-store.js`.
2. **Aucun accès navigateur au module-load ou en `setup()`** : `window`, `document`, `localStorage` uniquement derrière un guard. Utiliser **`helpers/ssr-storage.js`** pour le storage. OK dans `onMounted`/handlers (non exécutés au serveur).
3. **Prefetch des données** : déclarer `meta.asyncData({ stores, route })` sur la route (voir `config/routes-config.js`). `entry-server` l'appelle avant le rendu ; l'état est sérialisé puis hydraté (pas de double fetch au 1er rendu). Prévoir le rechargement client (onMounted) pour les navigations SPA. Pour propager un vrai statut HTTP (ex. **404 sur ressource introuvable**), l'asyncData **retourne `{ statusCode }`** (retour uniforme) ; `runAsyncData` propage les statuts `< 500` à la réponse HTTP et **logue** les erreurs serveur (`≥ 500`) en gardant la coquille résiliente (le client réhydrate).
4. **Meta/SEO** : `useHead()` de `@unhead/vue` dans les composants de page.
5. **Fetch serveur** : l'URL d'API doit être **absolue** (`VITE_GHOSTY_API_URL`) et joignable depuis le process Node.

### 404 SEO

Le catch-all `/:pathMatch(.*)*` (voir `services/router/src/router-plugin.js`) rend une **page dédiée** `views/NotFoundPage.vue` (`name: 'not-found'`, `meta.statusCode = 404`, `robots: noindex`), plus de redirection vers `/`. Au SSR, `runAsyncData` seede le statut depuis `route.meta.statusCode` → **vrai HTTP 404** pour les URLs inconnues comme pour les ressources introuvables (cf. point 3 ci-dessus).

## Services Vuemann

### Initialisation dans main.js

Le bootstrap utilise le **quartet** `services-init` / `services-manager` / `services-stores` / `services-routes-registry` (voir memory *Vuemann architecture*). Les dépendances entre services sont résolues automatiquement (ordre de déclaration indifférent).

```javascript
import { servicesInit } from '@/services/services-init.js'
import { BOOT_STATUS } from '@/constants/boot-status.js'
// + imports des *Init (auth, locale, ajax, flash, form, router, utils)

const boot = await servicesInit.initServices(app, {
  auth: authInit, locale: localeInit, ajax: ajaxInit,
  flash: flashInit, form: formInit, router: routerInit, utils: utilsInit,
})

if (boot.status === BOOT_STATUS.SUCCESS) {
  app.mount('#app')
}
```

> ⚠️ Le système de **contrats** Vuemann est volontairement retiré. Les services `log`/`websocket`/`auth-keycloak` sont exclus (stubs no-op côté shortcuts).

### Helpers Disponibles (shortcuts)

L'API (`t`, `req`, `flash`, `auth`, `form`, …) est fournie par les **shortcuts**. Importer directement depuis `@/services/shortcuts/services-shortcut.js`.

```javascript
import { t, req, flash } from '@/services/shortcuts/services-shortcut.js'

// ✅ t() - Traductions (dans tous les fichiers)
const title = t('novels.title')

// ✅ req(routeName, options) - Requêtes HTTP (UNIQUEMENT dans repositories)
//    params d'URL -> options.params ; corps -> options.body
const response = await req('novel.list', { params: { status: 'active' } })

// ✅ flash.error() / flash.errorT() - message d'erreur
if (response.status !== STATUS.SUCCESS) {
  flash.errorT('errors.load_failed')
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

**⚠️ RÈGLE CRITIQUE : AUCUNE LOGIQUE DANS LE REPOSITORY**

Le repository a **UN SEUL rôle** : faire l'appel API et retourner la réponse brute. Point final.

**❌ INTERDIT dans le repository** :
- Try/catch
- Vérification de `response.status`
- Transformation de données (même pas `{ page }` → créer un objet)
- Gestion d'erreurs
- Logique métier
- Conditions if/else
- Valeurs par défaut sur les paramètres

**✅ AUTORISÉ UNIQUEMENT** :
- Appel à `req()`
- Retour direct de la réponse
- Passage transparent des paramètres reçus

**⚠️ IMPORTANT** : Les paramètres doivent être passés TELS QUELS au `req()`, sans transformation. C'est le **controller** qui crée l'objet de paramètres, pas le repository.

```javascript
// src/apis/ghosty/repositories/novel-repository.js
import { req } from '@/services/shortcuts/services-shortcut.js'

// ✅ CORRECT - Paramètres passés tels quels
const list = async (params) => {
  return await req('novel.list', params)
}

// ❌ INCORRECT - Ne pas créer d'objet { page } ici
const list = async (page = 1) => {
  return await req('novel.list', { page })  // ❌ Transformation interdite
}

const getById = async (id) => {
  return await req('novel.show', { id })
}

const create = async (data) => {
  return await req('novel.create', data)
}

const update = async (id, data) => {
  return await req('novel.update', { id, ...data })
}

const destroy = async (id) => {
  return await req('novel.destroy', { id })
}

export const NovelRepository = { list, getById, create, update, destroy }
```

**❌ MAUVAIS EXEMPLE (NE PAS FAIRE)** :
```javascript
// ❌ PAS DE LOGIQUE ICI !
const list = async (filters = {}) => {
  try {  // ❌ Pas de try/catch
    const response = await req('novel.list', filters)

    if (response.status !== STATUS.SUCCESS) {  // ❌ Pas de vérification
      return { status: STATUS.ERROR, error: '...' }  // ❌ Pas de gestion d'erreur
    }

    return {  // ❌ Pas de transformation
      data: response.data?.data || response.data
    }
  } catch (error) {  // ❌ Pas de catch
    return { status: STATUS.ERROR }
  }
}
```

### 4. Controller

**✅ TOUTE LA LOGIQUE EST ICI**

Le controller contient **TOUTE la logique** :
- Vérification du statut de la réponse
- Gestion des erreurs
- Extraction et transformation des données (response.data?.data)
- Transformation via DTOs
- Construction de la réponse finale

```javascript
// src/apis/ghosty/controllers/novel-controller.js
import { NovelRepository } from '@/apis/ghosty/repositories/novel-repository.js'
import { NovelDto } from '@/apis/ghosty/dtos/novel-dto.js'
import { STATUS } from '@/services/ajax/ajax-constants.js'

const list = async (filters = {}) => {
  // 1. Transformation filtres (si nécessaire)
  const apiFilters = NovelDto.toList(filters)

  // 2. Appel repository (qui retourne la réponse brute)
  const response = await NovelRepository.list(apiFilters)

  // 3. Vérification du statut (LOGIQUE ICI, PAS DANS LE REPO)
  if (response.status !== STATUS.SUCCESS) {
    return {
      status: STATUS.ERROR,
      error: response.error || 'Erreur lors du chargement'
    }
  }

  // 4. Extraction des données (Laravel retourne { data: [...], meta: {...} })
  const data = response.data?.data || response.data
  const meta = response.data?.meta || response.meta

  // 5. Transformation via DTO
  return {
    status: STATUS.SUCCESS,
    novels: NovelDto.fromList(data),
    pagination: {
      page: meta.current_page,
      total: meta.total,
      size: meta.per_page,
      lastPage: meta.last_page
    }
  }
}

const getById = async (id) => {
  const response = await NovelRepository.getById(id)

  if (response.status !== STATUS.SUCCESS) {
    return {
      status: STATUS.ERROR,
      error: response.error || 'Erreur lors du chargement'
    }
  }

  return {
    status: STATUS.SUCCESS,
    novel: NovelDto.fromShow(response.data)
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
- **États temporaires UI** (loading, error) - à gérer localement dans les composants

### 📦 Composables de Services (Pattern Alternatif)

Pour les services infrastructure (form, flash, utils, router), le pattern est légèrement différent :

```javascript
// src/services/flash/src/flash-store.js
import { ref } from 'vue'

// État global (hors fonction = partagé)
const flashes = ref([])

const addMessage = (content, type = 'error') => {
  flashes.value.push({ content, type, id: generateId() })
}

const removeFlash = (flash_id) => {
  const index = flashes.value.findIndex(f => f.id === flash_id)
  flashes.value.splice(index, 1)
}

// Export objet helper (pas de fonction use{Name})
export const flashStore = {
  addMessage,
  removeFlash,
  flashes
}
```

**Différences avec composables classiques** :
- ✅ Fichiers `*-store.js` dans `services/`
- ✅ Export objet helper (ex: `flashStore`, `formStore`)
- ✅ Pas de wrapper `use{Name}()`
- ✅ Utilisation : `import { flashStore } from '@/services/flash/src/flash-store.js'`
- ✅ **Pas de Pinia** : Pattern Vue natif avec `ref()` hors fonction

**⚠️ IMPORTANT - États de Session vs États Temporaires** :

Les stores (composables/services) doivent **UNIQUEMENT** contenir des **états de session persistants** :
- ✅ **user** - L'utilisateur connecté
- ✅ **token** - Le token d'authentification
- ✅ **novels** - Liste des romans chargés
- ✅ **flashes** - Messages flash globaux
- ✅ **isAuthenticated** - Computed basé sur user/token

Les stores ne doivent **JAMAIS** contenir des **états temporaires UI** liés à une action spécifique :
- ❌ **loading** - État de chargement d'une action (login, register, etc.)
- ❌ **error** - Message d'erreur d'une action spécifique
- ❌ **isSubmitting** - État de soumission d'un formulaire

**Pourquoi ?**
- États temporaires sont liés au **cycle de vie d'une action**, pas à la session
- Doivent être gérés **localement** dans les composants qui les déclenchent
- Les fonctions retournent `{ status, error }` pour que le composant gère l'UI

**Exemple correct** :

```javascript
// ✅ Store : État de session uniquement
const user = ref(null)
const token = ref(null)

export const authStore = {
  user: readonly(user),
  token: readonly(token),
  setUser: (userData) => { user.value = userData },
  clear: () => { user.value = null; token.value = null }
}

// ✅ Fonction : Retourne status/error
const login = async (email, password) => {
  const response = await AuthController.login(email, password)

  if (response.status !== STATUS.SUCCESS) {
    return { status: STATUS.ERROR, error: response.error }
  }

  authStore.setUser(response.user)
  return { status: STATUS.SUCCESS }
}

// ✅ Composant : Gère loading/error localement
const isLoading = ref(false)
const errorMessage = ref('')

const handleLogin = async () => {
  isLoading.value = true
  errorMessage.value = ''

  const result = await auth.login(email.value, password.value)

  if (result.status !== STATUS.SUCCESS) {
    errorMessage.value = result.error
  }

  isLoading.value = false
}
```

### 6. Composant Vue

Présentation et interaction utilisateur :

```vue
<!-- src/views/HomePage.vue -->
<script setup>
import { ref, onMounted } from 'vue'
import { t } from '@/services/shortcuts/services-shortcut.js'
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
import { t } from '@/services/shortcuts/services-shortcut.js'

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
import { t } from '@/services/shortcuts/services-shortcut.js'
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
- **Utiliser classes SCSS Vuemann au MAXIMUM (95%+)** - Toujours vérifier si une classe existe avant d'écrire du CSS custom
- Utiliser les classes de boutons Vuemann (`btn`, `btn-primary`, `btn-primary-alt`, etc.) plutôt que créer des styles custom
- Early return dans toutes les fonctions
- Props typées dans composants Vue
- Logique métier en fichiers `.js` natifs
- `req()` UNIQUEMENT dans repositories
- Composables pour état partagé uniquement
- Tests avec mock minimal (repositories seulement)
- **Convention classes CSS** : Classes BEM spécifiques avant `|`, puis classes utilitaires après

### ❌ À ÉVITER
- `req()` hors des repositories
- Logique métier dans composants Vue
- Logique métier dans composables
- **États temporaires dans les stores** (loading, error) - doivent être gérés localement dans les composants
- CSS custom sans vérifier classes Vuemann
- Strings hardcodés (utiliser `t()`)
- **`else` ou `else if` en JavaScript** (voir section ci-dessous)
- `vi.mock()` (utiliser `vi.spyOn()`)
- Tester les repositories directement

### 🚫 JAMAIS de `else` ou `else if` - Utiliser Early Return

**RÈGLE ABSOLUE** : En JavaScript/Vue, **JAMAIS** utiliser `else` ou `else if`. Toujours utiliser des **guard clauses** avec **early return**.

**Pourquoi ?**
- Code plus lisible et linéaire
- Moins d'indentation
- Logique plus claire (cas d'erreur en premier)
- Facilite la maintenance

**❌ MAUVAIS - Avec else** :
```javascript
const loadNovels = async (append = false) => {
  const response = await NovelController.list()

  if (append) {
    novels.value = [...novels.value, ...response.novels]
  } else {
    novels.value = response.novels
  }

  isLoading.value = false
}
```

**✅ CORRECT - Avec early return** :
```javascript
const loadNovels = async (append = false) => {
  const response = await NovelController.list()

  if (append) {
    novels.value = [...novels.value, ...response.novels]
    isLoading.value = false
    return
  }

  novels.value = response.novels
  isLoading.value = false
}
```

**Autres exemples** :

```javascript
// ❌ MAUVAIS
if (user.isAdmin) {
  return 'Admin'
} else if (user.isModerator) {
  return 'Moderator'
} else {
  return 'User'
}

// ✅ CORRECT
if (user.isAdmin) return 'Admin'
if (user.isModerator) return 'Moderator'
return 'User'
```

```javascript
// ❌ MAUVAIS
if (response.status !== STATUS.SUCCESS) {
  return { error: response.error }
} else {
  return { data: response.data }
}

// ✅ CORRECT
if (response.status !== STATUS.SUCCESS) {
  return { error: response.error }
}

return { data: response.data }
```

```javascript
// ❌ MAUVAIS - Setter avec else
setUser: (userData) => {
  user.value = userData
  if (userData) {
    localStorage.setItem('auth_user', JSON.stringify(userData))
  } else {
    localStorage.removeItem('auth_user')
  }
}

// ✅ CORRECT - Méthodes séparées (plus explicite)
setUser: (userData) => {
  user.value = userData
  localStorage.setItem('auth_user', JSON.stringify(userData))
},

unsetUser: () => {
  user.value = null
  localStorage.removeItem('auth_user')
}
```

**⚠️ TEMPLATES VUE** : Cette règle s'applique aussi aux templates Vue.

**❌ MAUVAIS - Avec v-else** :
```vue
<div v-if="errorMessage" class="error">{{ errorMessage }}</div>
<div v-else class="content">{{ content }}</div>
```

**✅ CORRECT - Avec v-if explicite** :
```vue
<div v-if="errorMessage" class="error">{{ errorMessage }}</div>
<div v-if="!errorMessage" class="content">{{ content }}</div>
```

**Pourquoi ?**
- Plus explicite et facile à comprendre
- Condition visible directement
- Pas de dépendance implicite à l'ordre des éléments
- Cohérent avec le JavaScript

### 📐 Convention de Nommage des Classes CSS

Pour améliorer la lisibilité, séparer les classes BEM spécifiques des classes utilitaires avec le pipe `|` :

```vue
<!-- ✅ CORRECT : Classes BEM avant | puis utilitaires après -->
<div class="search-bar__container | d-flex a-center g-10 bg-neutral-900">
<button class="search-bar__tab | pointer fs-600 color-primary">

<!-- ❌ INCORRECT : Classes mélangées -->
<div class="d-flex search-bar__container a-center g-10">
<button class="pointer search-bar__tab fs-600">
```

**Avantages :**
- Identification rapide des classes spécifiques au composant
- Séparation visuelle claire entre logique métier et utilitaires
- Facilite la maintenance et la compréhension du code

## Liens Utiles

- **[../CLAUDE.md](../CLAUDE.md)** : Vue d'ensemble du projet
- **[../CLAUDE_BEST_PRACTICES.md](../CLAUDE_BEST_PRACTICES.md)** : Bonnes pratiques complètes
- **[../vuemann/CLAUDE.md](../vuemann/CLAUDE.md)** : Documentation Vuemann
- **[../AUDIT_MIGRATION.md](../AUDIT_MIGRATION.md)** : Audit et plan migration

---

**Version** : 1.0
**Date** : 2025-10-18
**Frontend** : Vue 3 + Vuemann 4.2.0
