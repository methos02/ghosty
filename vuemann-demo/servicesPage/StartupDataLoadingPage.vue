<script setup></script>

<template>
  <h1 class="h1">Charger des donnees au demarrage</h1>

  <p class="mb-15">
    Guide complet pour charger des donnees depuis une API au demarrage de l'application. Ce guide
    couvre le cas simple (une seule API) et le cas avance (multiple APIs avec AppService).
  </p>

  <h2 class="h2">Checklist</h2>

  <ol class="list ml-25 mb-20">
    <li><strong>.env</strong> - Ajouter l'URL de l'API</li>
    <li><strong>app-config.js</strong> - Declarer l'API (URL, auth)</li>
    <li><strong>routes-api-config.js</strong> - Ajouter les routes API</li>
    <li><strong>Architecture</strong> - Creer DTO, Repository, Controller, Service</li>
    <li><strong>AppService</strong> - (optionnel) Orchestrer le chargement de plusieurs APIs</li>
    <li>
      <strong>App.vue</strong> - Utiliser le callback
      <span class="badge-code">cb</span> d'AppComponent
    </li>
  </ol>

  <!-- ==================== EXEMPLE 1 : UNE SEULE API ==================== -->
  <h2 class="h2">Exemple 1 : Une seule API</h2>

  <p class="mb-15">Cas simple ou l'application charge une seule source de donnees au demarrage.</p>

  <h3 class="h3">Etape 1 : .env</h3>

  <div class="div-code mb-15">VITE_API_ITEMS_URL=http://localhost:8000</div>

  <h3 class="h3">Etape 2 : app-config.js</h3>

  <div class="p-15 mb-10 radius-10 bg-warning-100 border-warning-500">
    <p class="fw-500 fs-300">
      <i class="fa-solid fa-exclamation-circle mr-5 color-warning"></i>
      Cette etape est souvent oubliee ! L'API doit etre declaree ici AVANT d'etre utilisee dans
      routes-api-config.js.
    </p>
  </div>

  <div class="div-code mb-15">
    <span class="color-neutral-500">// src/config/app-config.js</span><br />
    export const app = {<br />
    &emsp;homepage_url: "/",<br />
    &emsp;name: 'Mon Application',<br />
    &emsp;auth: true,<br />
    &emsp;apis: {<br />
    &emsp;&emsp;items: {
    <span class="color-neutral-500">// DOIT correspondre au 'api' dans routes-api-config.js</span
    ><br />
    &emsp;&emsp;&emsp;url: import.meta.env.VITE_API_ITEMS_URL,<br />
    &emsp;&emsp;&emsp;auth: false,<br />
    &emsp;&emsp;&emsp;status: false<br />
    &emsp;&emsp;}<br />
    &emsp;}<br />
    }
  </div>

  <h3 class="h3">Etape 3 : routes-api-config.js</h3>

  <div class="div-code mb-15">
    <span class="color-neutral-500">// src/config/routes-api-config.js</span><br />
    export const routesApi = {<br />
    &emsp;"item.index": { url: "items/", method: "get", api: "items" }<br />
    &emsp;<span class="color-neutral-500"
      >//
      &emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;^
      Doit correspondre a app-config.js !</span
    ><br />
    }
  </div>

  <h3 class="h3">Etape 4 : Architecture</h3>

  <div class="div-code mb-15">
    src/apis/items/<br />
    ├── controllers/item-controller.js<br />
    ├── dtos/item-dto.js<br />
    ├── repositories/item-repository.js<br />
    └── services/item-service.js
  </div>

  <h4 class="h4">item-dto.js</h4>
  <div class="div-code mb-15">
    <span class="color-neutral-500">// src/apis/items/dtos/item-dto.js</span><br />
    const fromShow = (data) => ({<br />
    &emsp;id: data.id,<br />
    &emsp;name: data.name,<br />
    &emsp;description: data.description,<br />
    &emsp;createdAt: data.created_at<br />
    })<br />
    <br />
    const fromList = (dataList) => dataList.map(fromShow)<br />
    <br />
    export const ItemDto = { fromShow, fromList }
  </div>

  <h4 class="h4">item-repository.js</h4>
  <div class="div-code mb-15">
    <span class="color-neutral-500">// src/apis/items/repositories/item-repository.js</span><br />
    import { req } from '@brugmann/vuemann/src/shortcuts/services-shortcut.js'<br />
    <br />
    const index = async (options = {}) => {<br />
    &emsp;return await req('item.index', options)<br />
    }<br />
    <br />
    export const ItemRepository = { index }
  </div>

  <h4 class="h4">item-service.js</h4>
  <div class="div-code mb-15">
    <span class="color-neutral-500">// src/apis/items/services/item-service.js</span><br />
    let items = []<br />
    <br />
    const get = (itemId) => items.find(item => item.id === itemId)<br />
    const cacheAll = (itemsDto) => { items = itemsDto }<br />
    const getAll = () => items<br />
    <br />
    export const ItemService = { get, cacheAll, getAll }
  </div>

  <h4 class="h4">item-controller.js</h4>
  <div class="div-code mb-15">
    <span class="color-neutral-500">// src/apis/items/controllers/item-controller.js</span><br />
    import { STATUS } from '@brugmann/vuemann/src/constants/ajax-constants.js'<br />
    import { ItemRepository } from '@brugmann/vuemann/src/views/repositories/item-repository.js'<br />
    import { ItemDto } from '@brugmann/vuemann/src/views/dtos/item-dto.js'<br />
    import { ItemService } from '@brugmann/vuemann/src/views/services/item-service.js'<br />
    <br />
    const cache = async () => {<br />
    &emsp;const response = await ItemRepository.index()<br />
    &emsp;if (response.status !== STATUS.SUCCESS) {<br />
    &emsp;&emsp;return response<br />
    &emsp;}<br />
    &emsp;ItemService.cacheAll(ItemDto.fromList(response.data))<br />
    &emsp;return { status: STATUS.SUCCESS }<br />
    }<br />
    <br />
    export const ItemController = { cache }
  </div>

  <h3 class="h3">Etape 5 : App.vue</h3>
  <div class="div-code mb-15">
    <span class="color-neutral-500">&lt;!-- src/App.vue --&gt;</span><br />
    &lt;script setup&gt;<br />
    import App from '@brugmann/vuemann/src/services/utils/views/AppComponent.vue'<br />
    import { APP_STATUS } from '@brugmann/vuemann'<br />
    import { STATUS } from '@brugmann/vuemann/src/constants/ajax-constants.js'<br />
    import { ItemController } from '@/apis/items/controllers/item-controller.js'<br />
    <br />
    const initApp = async () => {<br />
    &emsp;const response = await ItemController.cache()<br />
    &emsp;if (response.status !== STATUS.SUCCESS) {<br />
    &emsp;&emsp;return { appStatus: APP_STATUS.ERROR, error: 'Erreur chargement' }<br />
    &emsp;}<br />
    &emsp;return { appStatus: APP_STATUS.LOADED }<br />
    }<br />
    &lt;/script&gt;<br />
    <br />
    &lt;template&gt;<br />
    &emsp;&lt;App :cb="initApp" /&gt;<br />
    &lt;/template&gt;
  </div>

  <!-- ==================== EXEMPLE 2 : MULTIPLE APIS ==================== -->
  <h2 class="h2 mt-30">Exemple 2 : Multiple APIs avec AppService</h2>

  <p class="mb-15">
    Pattern recommande pour les applications qui chargent plusieurs sources de donnees au demarrage.
    Utilise <span class="badge-code">Promise.all()</span> pour charger toutes les donnees en
    parallele.
  </p>

  <div class="p-15 mb-15 radius-10 bg-primary-200 border-primary-400">
    <p class="fw-500 mb-5">
      <i class="fa-solid fa-info-circle mr-5 color-primary"></i>
      Pattern utilise dans hospitalisation-request-frontend
    </p>
    <p class="fs-300">
      Ce pattern centralise toute la logique d'initialisation dans un fichier
      <span class="badge-code">app-service.js</span>, ce qui rend App.vue plus simple et facilite la
      maintenance.
    </p>
  </div>

  <h3 class="h3">Structure des fichiers</h3>

  <div class="div-code mb-15">
    src/<br />
    ├── services/<br />
    │ └── app-service.js &larr; Orchestrateur principal<br />
    ├── apis/<br />
    │ ├── items/<br />
    │ │ └── controllers/item-controller.js<br />
    │ ├── categories/<br />
    │ │ └── controllers/category-controller.js<br />
    │ └── users/<br />
    │ └── controllers/user-controller.js<br />
    └── App.vue
  </div>

  <h3 class="h3">app-service.js (Orchestrateur)</h3>
  <div class="div-code mb-15">
    <span class="color-neutral-500">// src/services/app-service.js</span><br />
    import { STATUS } from '@brugmann/vuemann/src/constants/ajax-constants.js'<br />
    import { APP_STATUS } from '@brugmann/vuemann/src/constants/utils-constants.js'<br />
    import { ItemController } from '@/apis/items/controllers/item-controller.js'<br />
    import { CategoryController } from '@/apis/categories/controllers/category-controller.js'<br />
    import { UserController } from '@/apis/users/controllers/user-controller.js'<br />
    <br />
    const init = async () => {<br />
    &emsp;<span class="color-neutral-500"
      >// Chargement parallele de toutes les donnees de base</span
    ><br />
    &emsp;const results = await Promise.all([<br />
    &emsp;&emsp;ItemController.cache(),<br />
    &emsp;&emsp;CategoryController.cache(),<br />
    &emsp;&emsp;UserController.rolesCache()<br />
    &emsp;])<br />
    <br />
    &emsp;<span class="color-neutral-500">// Verifie si une requete a echoue</span><br />
    &emsp;const failed = results.find(r => r.status !== STATUS.SUCCESS)<br />
    &emsp;if (failed) {<br />
    &emsp;&emsp;return { appStatus: APP_STATUS.ERROR, error: failed.error }<br />
    &emsp;}<br />
    <br />
    &emsp;return { appStatus: APP_STATUS.LOADED }<br />
    }<br />
    <br />
    export const AppService = {<br />
    &emsp;init<br />
    }
  </div>

  <h3 class="h3">App.vue (utilise AppService)</h3>
  <div class="div-code mb-15">
    <span class="color-neutral-500">&lt;!-- src/App.vue --&gt;</span><br />
    &lt;script setup&gt;<br />
    import Header from '@brugmann/vuemann/src/components/HeaderComponent.vue'<br />
    import App from '@brugmann/vuemann/src/services/utils/views/AppComponent.vue'<br />
    import { AppService } from '@/services/app-service.js'<br />
    &lt;/script&gt;<br />
    <br />
    &lt;template&gt;<br />
    &emsp;&lt;div class="container-body | f-column"&gt;<br />
    &emsp;&emsp;&lt;Header title="Mon Application" /&gt;<br />
    &emsp;&emsp;&lt;App :cb="AppService.init" /&gt;<br />
    &emsp;&lt;/div&gt;<br />
    &lt;/template&gt;
  </div>
</template>
