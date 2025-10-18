<template>
  <h1 class="h1">La configuration</h1>
  <p class="my-15">
    Vuemann est géré par des fichiers de configuration. Pour rendre ces fichiers accessibles partout 
    dans votre application, l'objet <router-link :to="{name: 'config.loader'}" class="link-underline"><span class="badge-code">ConfigLoader</span></router-link>
  </p>
  <h2 class="fs-700 fw-400 color-primary mb-15">Liste des fichiers</h2>
  <ul class="list ml-25">
    <li>
      <router-link :to="{name: 'config.app'}" class="link-underline">appConfig</router-link>
    </li>
  </ul>
  <p>...</p>
</template>
