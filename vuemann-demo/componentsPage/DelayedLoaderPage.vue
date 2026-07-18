<script setup>
import { ref } from 'vue'
import CodeHtml from '@brugmann/vuemann/src/components/codeHtml/CodeHtmlComponent.vue'
import DelayedLoader from '@brugmann/vuemann/src/components/DelayedLoaderComponent.vue'

const DEMO_DELAY_MS = 1500
const loading = ref(false)

const simulateLoading = () => {
  loading.value = true
  setTimeout(() => {
    loading.value = false
  }, DEMO_DELAY_MS)
}
</script>

<template>
  <h1 class="h1">DelayedLoaderComponent</h1>

  <p class="my-10">
    Composant de chargement avec délai intégré. Affiche son contenu uniquement si le chargement dure
    plus de <span class="badge-code">delay</span> millisecondes, évitant le scintillement pour les
    chargements rapides.
  </p>

  <h2 class="h2">Propriétés</h2>

  <table class="t-default mb-15 w-100">
    <thead>
      <tr>
        <th>Nom</th>
        <th>Type</th>
        <th>Default</th>
        <th>Description</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>loading</td>
        <td>Boolean</td>
        <td>false</td>
        <td>
          État de chargement. Le contenu s'affiche après le délai si toujours
          <span class="badge-code">true</span>
        </td>
      </tr>
      <tr>
        <td>delay</td>
        <td>Number</td>
        <td>200</td>
        <td>Délai en millisecondes avant d'afficher le loader</td>
      </tr>
    </tbody>
  </table>

  <h2 class="h2">Slot par défaut</h2>

  <p class="mb-10">
    Le slot par défaut permet de personnaliser le contenu du loader. Si aucun slot n'est fourni, un
    spinner FontAwesome est affiché.
  </p>

  <h2 class="h2">Exemple</h2>

  <div class="d-flex j-start a-center g-15 mb-15">
    <button
      class="btn btn-primary btn-primary-400-active"
      @click="simulateLoading"
    >
      Simuler un chargement (1.5s)
    </button>
  </div>

  <DelayedLoader :loading="loading">
    <p>Chargement en cours...</p>
    <i class="fa-solid fa-spinner fa-spin fs-600"></i>
  </DelayedLoader>

  <p
    v-if="!loading"
    class="mb-15"
  >
    Contenu chargé.
  </p>

  <h2 class="h2">Code</h2>

  <CodeHtml
    language="html"
    :code="`<!-- Utilisation simple avec spinner par défaut -->
<DelayedLoaderComponent :loading='loading' />

<!-- Avec message personnalisé -->
<DelayedLoaderComponent :loading='loading'>
  <p>Chargement du collaborateur...</p>
  <i class='fa-solid fa-spinner fa-spin fs-600'></i>
</DelayedLoaderComponent>

<!-- Avec délai custom -->
<DelayedLoaderComponent :loading='loading' :delay='500'>
  <p>Chargement en cours...</p>
</DelayedLoaderComponent>`"
  />
</template>
