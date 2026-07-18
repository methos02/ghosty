<script setup>
import { ref } from 'vue'
import CodeHtml from '@brugmann/vuemann/src/components/codeHtml/CodeHtmlComponent.vue'
import { APP_STATUS } from '@brugmann/vuemann/src/constants/utils-constants.js'

const DELAY_INIT_MS = 100
const DELAY_STEP_MS = 500
const DELAY_AUTO_LOADED_MS = 2000
const DELAY_SLOW_MS = 3000
const DELAY_FLASH_DISMISS_MS = 5000

const currentScenario = ref(undefined)
const currentState = ref(APP_STATUS.INIT)
const logs = ref([])
const showFlashError = ref(false)
const errorMessage = ref('')

const addLog = message => {
  logs.value.push(`[${new Date().toLocaleTimeString()}] ${message}`)
}

const clearLogs = () => {
  logs.value = []
}

// Scénarios disponibles
const scenarios = {
  loaded: {
    name: 'LOADED - Chargement réussi',
    description: 'Simule un chargement réussi des données de base',
    icon: 'fa-check',
    color: 'success',
    execute: async () => {
      addLog('AppComponent monté - onMounted() appelé')
      addLog('Exécution de validateAuthentication()...')
      await delay(DELAY_STEP_MS)
      addLog('✓ Authentication OK (route publique)')
      addLog('Exécution du callback...')
      await delay(DELAY_STEP_MS)
      addLog('Chargement des données de base...')
      await delay(DELAY_STEP_MS)
      addLog('✓ Données chargées avec succès')
      addLog('Retour: { appStatus: APP_STATUS.LOADED }')
      addLog('utilsStore.setAppStatus(APP_STATUS.LOADED)')
      currentState.value = APP_STATUS.LOADED
    },
  },
  loading: {
    name: 'LOADING - Vue gère son chargement',
    description: 'Le callback retourne LOADING, la vue affiche son propre loader',
    icon: 'fa-spinner',
    color: 'primary',
    execute: async () => {
      addLog('AppComponent monté - onMounted() appelé')
      addLog('Exécution du callback...')
      await delay(DELAY_STEP_MS)
      addLog('Chargement des données critiques...')
      await delay(DELAY_STEP_MS)
      addLog('✓ Données critiques chargées')
      addLog('Retour: { appStatus: APP_STATUS.LOADING }')
      addLog('utilsStore.setAppStatus(APP_STATUS.LOADING)')
      addLog('→ Router monté mais caché (v-show=false)')
      addLog('→ La vue peut gérer son propre chargement')
      currentState.value = APP_STATUS.LOADING

      await delay(DELAY_AUTO_LOADED_MS)
      addLog('(Simulation) La vue a terminé son chargement')
      addLog('(Simulation) utilsStore.setAppStatus(APP_STATUS.LOADED)')
      currentState.value = APP_STATUS.LOADED
    },
  },
  error: {
    name: 'ERROR - Erreur serveur',
    description: 'Simule une erreur serveur avec message flash',
    icon: 'fa-exclamation-triangle',
    color: 'danger',
    execute: async () => {
      addLog('AppComponent monté - onMounted() appelé')
      addLog('Exécution du callback...')
      await delay(DELAY_STEP_MS)
      addLog('Tentative de chargement des données...')
      await delay(DELAY_STEP_MS)
      addLog('✗ Erreur serveur détectée')
      addLog('Retour: { appStatus: APP_STATUS.ERROR, error: "..." }')
      addLog('utilsStore.setAppStatus(APP_STATUS.ERROR)')
      addLog('flash.error("Erreur serveur...") appelé')
      errorMessage.value = 'Erreur serveur de démonstration - Le serveur ne répond pas'
      showFlashError.value = true
      currentState.value = APP_STATUS.ERROR

      setTimeout(() => {
        showFlashError.value = false
      }, DELAY_FLASH_DISMISS_MS)
    },
  },
  errorAuth: {
    name: 'ERROR_AUTH - Erreur authentification',
    description: "Simule une erreur d'authentification sans message flash",
    icon: 'fa-lock',
    color: 'warning',
    execute: async () => {
      addLog('AppComponent monté - onMounted() appelé')
      addLog('Exécution du callback...')
      await delay(DELAY_STEP_MS)
      addLog("Vérification de l'authentification...")
      await delay(DELAY_STEP_MS)
      addLog("✗ Erreur d'authentification (401/403)")
      addLog('Retour: { appStatus: APP_STATUS.ERROR_AUTH }')
      addLog('utilsStore.setAppStatus(APP_STATUS.ERROR_AUTH)')
      addLog('→ Aucun message flash affiché')
      addLog('→ Attente de l\'événement "login-success"')
      currentState.value = APP_STATUS.ERROR_AUTH
    },
  },
  slow: {
    name: 'LOADED - Chargement lent (3s)',
    description: 'Simule un chargement long pour voir le loader',
    icon: 'fa-hourglass-half',
    color: 'neutral',
    execute: async () => {
      addLog('AppComponent monté - onMounted() appelé')
      addLog('Exécution du callback...')
      await delay(DELAY_STEP_MS)
      addLog('Chargement lent des données (3 secondes)...')
      await delay(DELAY_SLOW_MS)
      addLog('✓ Chargement terminé')
      addLog('Retour: { appStatus: APP_STATUS.LOADED }')
      addLog('utilsStore.setAppStatus(APP_STATUS.LOADED)')
      currentState.value = APP_STATUS.LOADED
    },
  },
  dynamicImport: {
    name: 'ERROR - Dynamic Import (version)',
    description: 'Simule une erreur de module dynamique après mise à jour',
    icon: 'fa-refresh',
    color: 'danger',
    execute: async () => {
      addLog('AppComponent monté - onMounted() appelé')
      addLog('Navigation vers une nouvelle page...')
      await delay(DELAY_STEP_MS)
      addLog('Tentative de chargement du composant lazy...')
      await delay(DELAY_STEP_MS)
      addLog('✗ Failed to fetch dynamically imported module: /assets/MyComponent.3.0.0.js')
      addLog('onErrorCaptured() déclenché')
      addLog('Erreur détectée: "Failed to fetch dynamically imported module"')
      addLog('utilsStore.setAppError(t("app-component.error.dynamic-import"))')
      addLog('utilsStore.setAppStatus(APP_STATUS.ERROR)')
      errorMessage.value = "Une nouvelle version est disponible. Veuillez recharger l'application."
      showFlashError.value = true
      currentState.value = APP_STATUS.ERROR

      setTimeout(() => {
        showFlashError.value = false
      }, DELAY_FLASH_DISMISS_MS)
    },
  },
}

const delay = ms => new Promise(resolve => setTimeout(resolve, ms))

const initScenario = scenarioName => {
  clearLogs()
  showFlashError.value = false
  currentScenario.value = scenarioName
  currentState.value = APP_STATUS.INIT
  addLog(`═══ Scénario: ${scenarios[scenarioName].name} ═══`)
  addLog('État initial: APP_STATUS.INIT')
  addLog("Montage d'AppComponent avec callback...")
}

const runScenario = async scenarioName => {
  initScenario(scenarioName)
  await delay(DELAY_INIT_MS)
  await scenarios[scenarioName].execute()
  addLog('═══ Fin du scénario ═══')
}

const resetDemo = () => {
  clearLogs()
  showFlashError.value = false
  currentScenario.value = undefined
  currentState.value = APP_STATUS.INIT
  addLog('Démo réinitialisée')
}
</script>

<template>
  <h1 class="h1">Démo AppComponent</h1>

  <p>
    Cette page simule visuellement le comportement du composant
    <span class="badge-code">AppComponent</span>
    qui gère l'état global de l'application. Chaque scénario montre ce qui se passerait dans une
    application réelle.
  </p>

  <div class="p-15 mb-15 radius-10 bg-primary-200 border-primary-300">
    <p class="fw-500 mb-5">
      <i class="fa-solid fa-info-circle mr-5 color-primary"></i>
      Simulation visuelle
    </p>
    <p class="fs-300">
      Cette démo simule le comportement d'<span class="badge-code">AppComponent</span> sans affecter
      l'application réelle. Vous verrez exactement ce qui se passe lors du cycle de vie du
      composant, les appels au store, et les changements d'état.
    </p>
  </div>

  <h2 class="h2">Scénarios de test</h2>

  <div class="d-flex g-10 mb-15 f-wrap">
    <button
      v-for="(scenario, key) in scenarios"
      :key="key"
      :class="`btn btn-${scenario.color}`"
      @click="runScenario(key)"
    >
      <i :class="`fa-solid ${scenario.icon} mr-5`"></i>
      {{ scenario.name }}
    </button>
    <button
      class="btn btn-neutral"
      @click="resetDemo"
    >
      <i class="fa-solid fa-redo mr-5"></i>Reset
    </button>
  </div>

  <!-- Message flash simulé -->
  <transition name="fade">
    <div
      v-if="showFlashError"
      class="p-15 mb-15 radius-10 bg-danger-100 border-danger-500 d-flex a-center g-10"
    >
      <i class="fa-solid fa-exclamation-circle color-danger fs-500"></i>
      <div class="flex-1">
        <p class="fw-500 color-danger">Erreur</p>
        <p class="fs-300">{{ errorMessage }}</p>
      </div>
    </div>
  </transition>

  <div class="d-flex g-15 f-column f-row-lg">
    <!-- Zone de démonstration -->
    <div class="flex-1">
      <h3 class="h3">Zone de simulation</h3>
      <div
        class="radius-10 bg-neutral-100 border-neutral-300"
        style="min-height: 400px; position: relative; overflow: hidden"
      >
        <!-- État INIT - Loader -->
        <div
          v-if="currentState === APP_STATUS.INIT && currentScenario"
          class="d-flex a-center j-center h-100 p-20"
          style="min-height: 400px"
        >
          <div class="text-center">
            <span
              class="loader-spin mb-15"
              style="width: 50px; height: 50px"
            ></span>
            <p class="fw-500">Chargement de l'application...</p>
            <p class="fs-300 color-neutral-600 mt-5">État: <span class="badge-code">INIT</span></p>
          </div>
        </div>

        <!-- État LOADED - Contenu -->
        <div
          v-if="currentState === APP_STATUS.LOADED"
          class="p-20"
        >
          <div class="d-flex f-column g-15">
            <div class="d-flex a-center g-10">
              <i class="fa-solid fa-check-circle fs-700 color-success"></i>
              <div>
                <p class="fw-500 fs-400">Application chargée avec succès !</p>
                <p class="fs-300 color-neutral-600">
                  Le Router est maintenant visible et l'application est utilisable.
                </p>
              </div>
            </div>
            <div class="p-15 radius-5 bg-success-100 border-success-300">
              <p class="fs-300 mb-5">
                <i class="fa-solid fa-info-circle mr-5"></i>
                État actuel: <span class="badge-code">APP_STATUS.LOADED</span>
              </p>
              <p class="fs-300">
                • Router visible (v-if=true, v-show=true)<br />
                • Contenu affiché<br />
                • Application prête
              </p>
            </div>
          </div>
        </div>

        <!-- État LOADING - Router caché -->
        <div
          v-if="currentState === APP_STATUS.LOADING"
          class="p-20"
        >
          <div
            class="d-flex f-column a-center j-center g-15"
            style="min-height: 360px"
          >
            <span
              class="loader-spin"
              style="width: 40px; height: 40px"
            ></span>
            <p class="fw-500">Chargement des données de la vue...</p>
            <div class="p-15 radius-5 bg-primary-200 border-primary-300 mt-10">
              <p class="fs-300 mb-5">
                <i class="fa-solid fa-info-circle mr-5"></i>
                État actuel: <span class="badge-code">APP_STATUS.LOADING</span>
              </p>
              <p class="fs-300">
                • Router monté mais caché (v-show=false)<br />
                • La vue gère son propre loader<br />
                • Pas de loader global AppComponent
              </p>
            </div>
          </div>
        </div>

        <!-- État ERROR - Vue d'erreur -->
        <div
          v-if="currentState === APP_STATUS.ERROR"
          class="d-flex a-center j-center h-100 p-20"
          style="min-height: 400px"
        >
          <div class="text-center">
            <i class="fa-solid fa-exclamation-triangle fs-800 color-danger mb-15"></i>
            <h3 class="h3 mb-10">Une erreur est survenue</h3>
            <p class="color-neutral-600 mb-15">L'application n'a pas pu se charger correctement</p>
            <button class="btn btn-primary btn-primary-400-active">
              <i class="fa-solid fa-redo mr-5"></i>Réessayer
            </button>
            <div class="p-15 radius-5 bg-danger-100 border-danger-300 mt-20">
              <p class="fs-300 mb-5">
                <i class="fa-solid fa-info-circle mr-5"></i>
                État actuel: <span class="badge-code">APP_STATUS.ERROR</span>
              </p>
              <p class="fs-300">
                • Vue d'erreur affichée<br />
                • Message flash affiché<br />
                • Bouton "Réessayer" visible
              </p>
            </div>
          </div>
        </div>

        <!-- État ERROR_AUTH - Attente silencieuse -->
        <div
          v-if="currentState === APP_STATUS.ERROR_AUTH"
          class="d-flex a-center j-center h-100 p-20"
          style="min-height: 400px"
        >
          <div class="text-center">
            <i class="fa-solid fa-lock fs-800 color-warning mb-15"></i>
            <h3 class="h3 mb-10">Authentification requise</h3>
            <p class="color-neutral-600 mb-15">En attente de reconnexion...</p>
            <div class="p-15 radius-5 bg-warning-100 border-warning-300 mt-20">
              <p class="fs-300 mb-5">
                <i class="fa-solid fa-info-circle mr-5"></i>
                État actuel: <span class="badge-code">APP_STATUS.ERROR_AUTH</span>
              </p>
              <p class="fs-300">
                • Aucun message flash affiché<br />
                • Attente silencieuse<br />
                • En attente de l'événement "login-success"
              </p>
            </div>
          </div>
        </div>

        <!-- État initial - Aucun scénario -->
        <div
          v-if="
            currentState !== APP_STATUS.INIT &&
            currentState !== APP_STATUS.LOADED &&
            currentState !== APP_STATUS.LOADING &&
            currentState !== APP_STATUS.ERROR &&
            currentState !== APP_STATUS.ERROR_AUTH
          "
          class="d-flex a-center j-center h-100"
          style="min-height: 400px"
        >
          <div class="text-center">
            <i class="fa-solid fa-play-circle fs-800 color-neutral-400 mb-10"></i>
            <p class="color-neutral-600">Sélectionnez un scénario pour commencer</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Console de logs -->
    <div style="flex: 0 0 350px">
      <h3 class="h3">Console de logs</h3>
      <div
        class="p-10 radius-10 bg-neutral-900 border-neutral-700"
        style="
          min-height: 400px;
          max-height: 400px;
          overflow-y: auto;
          font-family: monospace;
          font-size: 0.75rem;
          line-height: 1.5;
        "
      >
        <div
          v-if="logs.length === 0"
          class="color-neutral-500"
        >
          Aucun log pour le moment...
        </div>
        <div
          v-for="(log, index) in logs"
          :key="index"
          class="color-success-300 mb-5"
          style="word-break: break-all"
        >
          {{ log }}
        </div>
      </div>
    </div>
  </div>

  <h2 class="h2 mt-20">Dépendances</h2>

  <p class="mb-10"><span class="badge-code">AppComponent</span> dépend des services suivants :</p>

  <ul class="list ml-25 mb-15">
    <li><span class="badge-code">ViewComponent</span> - Affiche les routes de l'application</li>
    <li>
      <span class="badge-code">routerService</span> - Navigation et gestion des routes
      (currentRoute, push)
    </li>
    <li>
      <span class="badge-code">servicesM.service('auth:routesAuthCheck')</span> - Validation de
      l'authentification multi-API
    </li>
    <li>
      <span class="badge-code">ConfigLoader</span> - Configuration de l'application (app.auth,
      app.apis)
    </li>
    <li>
      <span class="badge-code">useRouterStore</span> - Gestion de l'URL de destination post-login
      (urlIntented)
    </li>
    <li><span class="badge-code">utilsStore</span> - Gestion de l'état global de l'application</li>
  </ul>

  <h2 class="h2">Configuration</h2>

  <p class="mb-10">
    La configuration de <span class="badge-code">AppComponent</span> se fait via
    <span class="badge-code">ConfigLoader</span> dans
    <span class="badge-code">src/config/app-config.js</span> :
  </p>

  <div class="div-code mb-15">
    export const app = {<br />
    &emsp;auth: false,
    <span class="color-neutral-500">// Désactive la vérification d'authentification globale</span
    ><br />
    &emsp;apis: {<br />
    &emsp;&emsp;myApi: {<br />
    &emsp;&emsp;&emsp;auth: true
    <span class="color-neutral-500">// Cette API nécessite une authentification</span><br />
    &emsp;&emsp;},<br />
    &emsp;&emsp;publicApi: {<br />
    &emsp;&emsp;&emsp;auth: false
    <span class="color-neutral-500">// Cette API ne nécessite pas d'authentification</span><br />
    &emsp;&emsp;}<br />
    &emsp;}<br />
    }
  </div>

  <h3 class="h3">Options de configuration</h3>

  <table class="t-default mb-15 w-100">
    <thead>
      <tr>
        <th>Option</th>
        <th>Type</th>
        <th>Default</th>
        <th>Description</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>app.auth</td>
        <td>Boolean</td>
        <td>true</td>
        <td>Active/désactive la vérification d'authentification globale au montage</td>
      </tr>
      <tr>
        <td>app.apis.{nom}.auth</td>
        <td>Boolean</td>
        <td>false</td>
        <td>Indique si une API spécifique nécessite une authentification</td>
      </tr>
    </tbody>
  </table>

  <h2 class="h2">États disponibles</h2>

  <table class="t-default mb-15 w-100">
    <thead>
      <tr>
        <th>État</th>
        <th>Description</th>
        <th>Affichage</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><span class="badge-code">INIT</span></td>
        <td>Initialisation de l'application</td>
        <td>Loader global affiché</td>
      </tr>
      <tr>
        <td><span class="badge-code">LOADED</span></td>
        <td>Application chargée et prête</td>
        <td>Router visible, contenu affiché</td>
      </tr>
      <tr>
        <td><span class="badge-code">LOADING</span></td>
        <td>Vue en cours de chargement</td>
        <td>Router caché (v-show=false), la vue gère son loader</td>
      </tr>
      <tr>
        <td><span class="badge-code">MANAGED</span></td>
        <td>État géré manuellement par l'application</td>
        <td>Comportement personnalisé défini par l'application</td>
      </tr>
      <tr>
        <td><span class="badge-code">ERROR</span></td>
        <td>Erreur serveur/business</td>
        <td>Vue d'erreur avec message flash et bouton "Réessayer"</td>
      </tr>
      <tr>
        <td><span class="badge-code">ERROR_AUTH</span></td>
        <td>Erreur d'authentification</td>
        <td>Aucun message d'erreur, attente silencieuse de reconnexion</td>
      </tr>
    </tbody>
  </table>

  <h2 class="h2">Format de retour du callback</h2>

  <p class="mb-10">
    Le callback doit retourner un objet avec la propriété
    <span class="badge-code">appStatus</span> :
  </p>

  <table class="t-default mb-15 w-100">
    <thead>
      <tr>
        <th>Propriété</th>
        <th>Type</th>
        <th>Obligatoire</th>
        <th>Description</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>appStatus</td>
        <td>String</td>
        <td>Oui</td>
        <td>
          État de l'application : <span class="badge-code">LOADED</span>,
          <span class="badge-code">LOADING</span>, <span class="badge-code">ERROR</span>, ou
          <span class="badge-code">ERROR_AUTH</span>
        </td>
      </tr>
      <tr>
        <td>error</td>
        <td>String</td>
        <td>Non</td>
        <td>Message d'erreur (requis seulement pour <span class="badge-code">ERROR</span>)</td>
      </tr>
    </tbody>
  </table>

  <h2 class="h2">Exemples de code</h2>

  <h3 class="h3">Callback retournant LOADED</h3>
  <CodeHtml>
    <scriptBalise v-pre>
      const initApp = async () => { // Charger les données de base const result = await
      loadBaseData() if (!result.success) { return { appStatus: APP_STATUS.ERROR, error: 'Erreur
      lors du chargement' } } return { appStatus: APP_STATUS.LOADED } }
    </scriptBalise>
  </CodeHtml>

  <h3 class="h3">Message de chargement personnalisé</h3>
  <CodeHtml>
    <scriptBalise v-pre>
      // Utiliser le store pour personnaliser le message de chargement import { utilsStore } from
      '@brugmann/vuemann/src/services/utils/src/utils-store.js' // Définir le message avant le
      chargement utilsStore.setLoadingSentence('my-app.custom-loading-message') // Le message
      "my-app.custom-loading-message" sera affiché // à la place de "Chargement de l'application..."
      // Peut être changé dynamiquement en fonction de la route watch(() => route.name, (newRoute)
      => { if (newRoute === 'dashboard') { utilsStore.setLoadingSentence('dashboard.loading') } else
      { utilsStore.setLoadingSentence('app-component.loading') } })
    </scriptBalise>
  </CodeHtml>

  <h3 class="h3">Callback retournant LOADING (vue gère son chargement)</h3>
  <CodeHtml>
    <scriptBalise v-pre>
      const initApp = async () => { // Charger uniquement les données critiques await
      loadCriticalData() // Retourner LOADING - la vue va charger ses propres données return {
      appStatus: APP_STATUS.LOADING } } // Dans la vue onMounted(async () => { await loadViewData()
      utilsStore.setAppStatus(APP_STATUS.LOADED) })
    </scriptBalise>
  </CodeHtml>

  <h3 class="h3">Callback avec gestion d'erreurs d'authentification</h3>
  <CodeHtml>
    <scriptBalise v-pre>
      const initApp = async () => { const result = await apiCall() // Erreur d'authentification -
      pas de message flash if (result.status === 401 || result.status === 403) { return { appStatus:
      APP_STATUS.ERROR_AUTH } } // Erreur serveur - message flash affiché if (result.status >= 500)
      { return { appStatus: APP_STATUS.ERROR, error: 'Erreur serveur' } } return { appStatus:
      APP_STATUS.LOADED } }
    </scriptBalise>
  </CodeHtml>

  <h2 class="h2">Contrôle manuel de l'état</h2>

  <p class="mb-10">
    Les vues peuvent contrôler l'état de l'application en utilisant
    <span class="badge-code">utilsStore.setAppStatus()</span> :
  </p>

  <CodeHtml>
    <scriptBalise v-pre>
      import { utilsStore } from '@brugmann/vuemann/src/services/utils/src/utils-store.js' import {
      APP_STATUS } from '@brugmann/vuemann/src/constants/utils-constants.js' // Cacher le Router
      pendant le chargement de données utilsStore.setAppStatus(APP_STATUS.LOADING) const data =
      await loadData() // Afficher le Router une fois les données chargées
      utilsStore.setAppStatus(APP_STATUS.LOADED)
    </scriptBalise>
  </CodeHtml>

  <h2 class="h2">Personnalisation du message de chargement</h2>

  <p class="mb-10">
    Le message affiché pendant le chargement (état <span class="badge-code">INIT</span>) peut être
    personnalisé en utilisant <span class="badge-code">utilsStore.setLoadingSentence()</span>. Cela
    permet d'adapter le message en fonction de la route ou du contexte de l'application.
  </p>

  <CodeHtml>
    <scriptBalise v-pre>
      import { utilsStore } from '@brugmann/vuemann/src/services/utils/src/utils-store.js' //
      Définir un message personnalisé (clé de traduction)
      utilsStore.setLoadingSentence('my-app.custom-loading') // Le message sera affiché pendant
      l'état INIT // Par défaut: 'app-component.loading' → "Chargement de l'application..." //
      Exemple: changer le message selon la route watch(() => route.name, (routeName) => { if
      (routeName === 'dashboard') { utilsStore.setLoadingSentence('dashboard.loading-message') }
      else if (routeName === 'reports') { utilsStore.setLoadingSentence('reports.generating-report')
      } else { utilsStore.setLoadingSentence('app-component.loading') } })
    </scriptBalise>
  </CodeHtml>

  <h2 class="h2">Méthodes utilsStore</h2>

  <p class="mb-10">
    Le <span class="badge-code">utilsStore</span> expose plusieurs méthodes pour gérer l'état de
    l'application :
  </p>

  <h3 class="h3"><i class="fa-solid fa-diamond mr-5"></i>setAppStatus</h3>
  <p>
    Définit l'état actuel de l'application. Met à jour la ref réactive
    <span class="badge-code">appStatus</span>.
  </p>

  <h4 class="h4">Paramètres</h4>
  <table class="t-default mb-15">
    <thead>
      <tr>
        <th>Nom</th>
        <th>Type</th>
        <th>Required</th>
        <th>Description</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>newStatus</td>
        <td>String</td>
        <td>oui</td>
        <td>Une des valeurs de APP_STATUS (INIT, LOADED, LOADING, MANAGED, ERROR, ERROR_AUTH)</td>
      </tr>
    </tbody>
  </table>

  <h3 class="h3"><i class="fa-solid fa-diamond mr-5"></i>getAppStatus</h3>
  <p>Récupère l'état actuel de l'application (valeur non-réactive).</p>

  <h4 class="h4">Retour</h4>
  <p class="mb-15"><span class="badge-code">String</span> - L'état actuel de l'application</p>

  <h3 class="h3"><i class="fa-solid fa-diamond mr-5"></i>setLoadingSentence</h3>
  <p>Définit la clé de traduction du message de chargement affiché pendant l'état INIT.</p>

  <h4 class="h4">Paramètres</h4>
  <table class="t-default mb-15">
    <thead>
      <tr>
        <th>Nom</th>
        <th>Type</th>
        <th>Required</th>
        <th>Description</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>sentence</td>
        <td>String</td>
        <td>oui</td>
        <td>Clé de traduction du message de chargement</td>
      </tr>
    </tbody>
  </table>

  <h3 class="h3"><i class="fa-solid fa-diamond mr-5"></i>getLoadingSentence</h3>
  <p>Récupère la clé de traduction du message de chargement actuel (valeur non-réactive).</p>

  <h4 class="h4">Retour</h4>
  <p class="mb-15">
    <span class="badge-code">String</span> - La clé de traduction du message de chargement
  </p>

  <h3 class="h3"><i class="fa-solid fa-diamond mr-5"></i>resetLoadingSentence</h3>
  <p>
    Réinitialise le message de chargement à sa valeur par défaut (<span class="badge-code"
      >'app-component.loading'</span
    >).
  </p>

  <h4 class="h4">Utilisation</h4>
  <div class="div-code mb-15">
    <span class="color-neutral-500">// Réinitialiser le message</span><br />
    import { utilsStore } from '@brugmann/vuemann/src/services/utils/src/utils-store.js'<br />
    utilsStore.resetLoadingSentence()
  </div>

  <h3 class="h3"><i class="fa-solid fa-diamond mr-5"></i>setAppError</h3>
  <p>
    Définit le message d'erreur qui sera affiché lorsque l'application est en état ERROR. Ce message
    est utilisé par AppComponent pour afficher l'erreur à l'utilisateur.
  </p>

  <h4 class="h4">Paramètres</h4>
  <table class="t-default mb-15">
    <thead>
      <tr>
        <th>Nom</th>
        <th>Type</th>
        <th>Required</th>
        <th>Description</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>error</td>
        <td>String</td>
        <td>oui</td>
        <td>Message d'erreur à afficher</td>
      </tr>
    </tbody>
  </table>

  <h3 class="h3"><i class="fa-solid fa-diamond mr-5"></i>getAppError</h3>
  <p>
    Récupère le message d'erreur actuel (valeur non-réactive). Retourne
    <span class="badge-code">undefined</span> si aucune erreur n'est définie.
  </p>

  <h4 class="h4">Retour</h4>
  <p class="mb-15">
    <span class="badge-code">String | undefined</span> - Le message d'erreur actuel
  </p>

  <h2 class="h2">Store réactif (useUtilsStore)</h2>

  <p class="mb-10">
    Le composable <span class="badge-code">useUtilsStore()</span> expose des refs réactives pour une
    utilisation dans les composants Vue :
  </p>

  <table class="t-default mb-15 w-100">
    <thead>
      <tr>
        <th>Ref</th>
        <th>Type</th>
        <th>Description</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>appStatus</td>
        <td>Ref&lt;String&gt;</td>
        <td>État actuel de l'application (INIT, LOADED, LOADING, MANAGED, ERROR, ERROR_AUTH)</td>
      </tr>
      <tr>
        <td>loadingSentence</td>
        <td>Ref&lt;String&gt;</td>
        <td>Clé de traduction du message de chargement affiché pendant INIT</td>
      </tr>
      <tr>
        <td>errorGlobal</td>
        <td>Ref&lt;String&gt;</td>
        <td>Message d'erreur global de l'application</td>
      </tr>
      <tr>
        <td>errorsGlobal</td>
        <td>Ref&lt;Array&gt;</td>
        <td>Liste des erreurs globales (pour gestion multi-erreurs)</td>
      </tr>
      <tr>
        <td>needUpdate</td>
        <td>Ref&lt;Boolean&gt;</td>
        <td>Indique si une mise à jour de l'application est disponible</td>
      </tr>
    </tbody>
  </table>

  <h4 class="h4">Utilisation dans un composant</h4>
  <div class="div-code mb-15">
    import { useUtilsStore } from '@brugmann/vuemann/src/services/utils/src/utils-store.js'<br />
    <br />
    const { appStatus, needUpdate } = useUtilsStore()<br />
    <br />
    <span class="color-neutral-500">// Utilisation réactive dans le template</span><br />
    watch(appStatus, (newStatus) => {<br />
    &emsp;console.log('État changé:', newStatus)<br />
    })
  </div>

  <h2 class="h2">Props du composant</h2>

  <table class="t-default mb-15 w-100">
    <thead>
      <tr>
        <th>Prop</th>
        <th>Type</th>
        <th>Required</th>
        <th>Default</th>
        <th>Description</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>cb</td>
        <td>Function</td>
        <td>non</td>
        <td>undefined</td>
        <td>
          Callback exécuté au montage du composant. Doit retourner un objet avec
          <span class="badge-code">appStatus</span> et optionnellement
          <span class="badge-code">error</span>
        </td>
      </tr>
    </tbody>
  </table>

  <h2 class="h2">Méthodes exposées</h2>

  <p class="mb-10">
    Le composant expose les méthodes suivantes via <span class="badge-code">defineExpose</span> :
  </p>

  <h3 class="h3"><i class="fa-solid fa-diamond mr-5"></i>isInitiate</h3>
  <p class="mb-10">
    Computed qui retourne <span class="badge-code">true</span> si l'application n'est plus en état
    INIT. Utile pour savoir si l'initialisation est terminée.
  </p>

  <h4 class="h4">Retour</h4>
  <p class="mb-15">
    <span class="badge-code">Boolean</span> - <span class="badge-code">true</span> si l'état n'est
    pas INIT
  </p>

  <h2 class="h2">Système d'événements</h2>

  <h3 class="h3"><i class="fa-solid fa-diamond mr-5"></i>Événement 'login-success'</h3>

  <p class="mb-10">
    Lorsque l'application est en état <span class="badge-code">ERROR_AUTH</span>, AppComponent
    écoute l'événement <span class="badge-code">login-success</span> sur
    <span class="badge-code">document</span>. Quand cet événement est déclenché, le callback est
    réexécuté automatiquement.
  </p>

  <h4 class="h4">Utilisation</h4>
  <div class="div-code mb-15">
    <span class="color-neutral-500"
      >// Dans votre composant de login, après authentification réussie</span
    ><br />
    const loginSuccessEvent = new Event('login-success')<br />
    document.dispatchEvent(loginSuccessEvent)<br />
    <br />
    <span class="color-neutral-500">// AppComponent va automatiquement :</span><br />
    <span class="color-neutral-500">// 1. Capter l'événement</span><br />
    <span class="color-neutral-500">// 2. Réexécuter le callback</span><br />
    <span class="color-neutral-500">// 3. Supprimer l'event listener</span>
  </div>

  <p class="mb-15">
    <i class="fa-solid fa-info-circle mr-5 color-primary"></i>
    L'event listener est automatiquement nettoyé dans
    <span class="badge-code">onUnmounted</span> pour éviter les fuites mémoire.
  </p>

  <h2 class="h2">Routes publiques</h2>

  <p class="mb-10">
    Certaines routes sont considérées comme publiques et ne nécessitent pas d'authentification :
  </p>

  <ul class="list ml-25 mb-15">
    <li><span class="badge-code">login</span> - Page de connexion</li>
    <li><span class="badge-code">changelog</span> - Page de changelog</li>
    <li>
      <span class="badge-code">services.utils.appComponent</span> - Cette page de documentation
    </li>
  </ul>

  <p class="mb-15">
    Ces routes ne déclenchent pas la validation d'authentification et affichent toujours le Router
    (même si l'application est en état ERROR ou ERROR_AUTH).
  </p>

  <h2 class="h2">Validation d'authentification</h2>

  <p class="mb-10">
    Au montage du composant, <span class="badge-code">validateAuthentication()</span> est exécuté
    automatiquement. Cette fonction :
  </p>

  <ul class="list ml-25 mb-15">
    <li>
      Vérifie si <span class="badge-code">ConfigLoader.find('app.auth')</span> est
      <span class="badge-code">false</span> → bypass complet
    </li>
    <li>Vérifie si la route actuelle est publique → bypass</li>
    <li>Récupère toutes les APIs avec <span class="badge-code">auth: true</span> dans la config</li>
    <li>
      Appelle <span class="badge-code">servicesM.service('auth:routesAuthCheck', apis)</span> pour
      valider l'authentification
    </li>
    <li>
      Si l'authentification échoue, sauvegarde l'URL actuelle dans
      <span class="badge-code">urlIntented</span> et redirige vers login
    </li>
  </ul>

  <h2 class="h2">Gestion des erreurs de modules dynamiques</h2>

  <p class="mb-10">
    <span class="badge-code">AppComponent</span> gère automatiquement les erreurs de chargement de
    modules dynamiques qui surviennent après un déploiement. Cette fonctionnalité utilise
    <span class="badge-code">onErrorCaptured</span>
    de Vue pour intercepter ces erreurs globalement.
  </p>

  <div class="p-15 mb-15 radius-10 bg-warning-100 border-warning-300">
    <p class="fw-500 mb-5">
      <i class="fa-solid fa-exclamation-triangle mr-5 color-warning"></i>
      Problème résolu
    </p>
    <p class="fs-300">
      Lorsqu'une nouvelle version est déployée (ex: 3.0.0 → 3.0.1), les fichiers JS sont renommés.
      Si un utilisateur a des fichiers en cache (index.3.0.0.js) qui référencent des modules qui
      n'existent plus (MyComponent.3.0.0.js), le navigateur échoue à charger ces modules.
      <span class="badge-code">AppComponent</span> intercepte cette erreur et affiche un message
      convivial demandant à l'utilisateur de recharger l'application.
    </p>
  </div>

  <h3 class="h3">Comment ça fonctionne</h3>

  <ol class="list ml-25 mb-15">
    <li>L'utilisateur a des fichiers JS en cache de la version 3.0.0</li>
    <li>Une nouvelle version 3.0.1 est déployée sur le serveur</li>
    <li>L'utilisateur navigue vers une page avec un composant lazy-loaded</li>
    <li>
      Le navigateur tente de charger <span class="badge-code">MyComponent.3.0.0.js</span> qui
      n'existe plus
    </li>
    <li>
      <span class="badge-code">onErrorCaptured</span> intercepte l'erreur "Failed to fetch
      dynamically imported module"
    </li>
    <li>
      L'application affiche un message : "Une nouvelle version est disponible. Veuillez recharger
      l'application."
    </li>
    <li>L'utilisateur clique sur "Réessayer" pour recharger avec les nouveaux fichiers</li>
  </ol>

  <h3 class="h3">Implémentation</h3>

  <CodeHtml>
    <scriptBalise v-pre>
      // Dans AppComponent.vue import { onErrorCaptured } from 'vue' onErrorCaptured((err) => { //
      Détecter les erreurs de chargement de modules dynamiques if (err.message?.includes('Failed to
      fetch dynamically imported module')) { // Afficher un message utilisateur friendly
      utilsStore.setAppError(t('app-component.error.dynamic-import'))
      utilsStore.setAppStatus(APP_STATUS.ERROR) return false // Empêcher la propagation de l'erreur
      } })
    </scriptBalise>
  </CodeHtml>

  <h3 class="h3">Messages d'erreur</h3>

  <table class="t-default mb-15 w-100">
    <thead>
      <tr>
        <th>Langue</th>
        <th>Clé</th>
        <th>Message</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>FR</td>
        <td><span class="badge-code">app-component.error.dynamic-import</span></td>
        <td>Une nouvelle version est disponible. Veuillez recharger l'application.</td>
      </tr>
      <tr>
        <td>EN</td>
        <td><span class="badge-code">app-component.error.dynamic-import</span></td>
        <td>A new version is available. Please reload the application.</td>
      </tr>
      <tr>
        <td>NL</td>
        <td><span class="badge-code">app-component.error.dynamic-import</span></td>
        <td>Er is een nieuwe versie beschikbaar. Herlaad de applicatie.</td>
      </tr>
    </tbody>
  </table>

  <h3 class="h3">Exemple de scénario</h3>

  <div class="div-code mb-15">
    <span class="color-neutral-500">// Séquence d'événements</span><br />
    <br />
    <span class="color-neutral-500">// 1. Déploiement initial (v3.0.0)</span><br />
    assets/<br />
    &emsp;├── index.3.0.0.js<br />
    &emsp;├── HomePage.3.0.0.js<br />
    &emsp;└── DashboardPage.3.0.0.js<br />
    <br />
    <span class="color-neutral-500">// 2. Utilisateur charge l'app → fichiers mis en cache</span
    ><br />
    <br />
    <span class="color-neutral-500">// 3. Nouveau déploiement (v3.0.1)</span><br />
    assets/<br />
    &emsp;├── index.3.0.1.js <span class="color-success">← nouveau</span><br />
    &emsp;├── HomePage.3.0.1.js <span class="color-success">← nouveau</span><br />
    &emsp;└── DashboardPage.3.0.1.js <span class="color-success">← nouveau</span><br />
    <span class="color-neutral-500">// (les fichiers 3.0.0 sont supprimés)</span><br />
    <br />
    <span class="color-neutral-500">// 4. Utilisateur navigue vers Dashboard</span><br />
    <span class="color-neutral-500"
      >// → Son cache a index.3.0.0.js qui référence DashboardPage.3.0.0.js</span
    ><br />
    <span class="color-neutral-500">// → Le fichier n'existe plus → Erreur interceptée</span><br />
    <span class="color-neutral-500">// → Message: "Une nouvelle version est disponible..."</span>
  </div>

  <p class="mb-15">
    <i class="fa-solid fa-lightbulb mr-5 color-warning"></i>
    <strong>Testez ce scénario</strong> en cliquant sur le bouton
    <span class="badge badge-danger">ERROR - Dynamic Import (version)</span> dans la section
    "Scénarios de test" ci-dessus.
  </p>
</template>

<style scoped>
.h-100 {
  height: 100%;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
