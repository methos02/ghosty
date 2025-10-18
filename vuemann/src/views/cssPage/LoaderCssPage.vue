<script setup>
  import Code from '@brugmann/vuemann/src/components/codeHtml/CodeHtmlComponent.vue'
</script>

<template>
  <h1 class="h1">Loaders</h1>
  <p>
    Vuemann intègre plusieurs classes permettant d'afficher des loaders lorsque l'application effectue des actions. C'est 
    une bonne pratique que l'utilisateur est un retour visuel de fait qu'une action est en train de s'effectuer. Cela évite qu'il ne 
    reload la page ou qu'il reclique sur le bouton action.
  </p>
  <h2 class="h2">Loader Spin</h2>
  <p>
    <span class="loader-spin"></span>
  </p>
  <Code>
    <span class="loader-spin"></span>
  </Code>
  <h2 class="h2">Loader barres</h2>
  <p>
    Le loader va s'adapter à la hauteur de son élément parent.
  </p>
  <button class="btn-loader_bars | btn btn-primary my-10">
    <span class="loader loader-bars">
      <span></span>
    </span>
  </button>
  <Code>
    <button class="btn-loader_bars | btn btn-primary">
      <span class="loader loader-bars">
        <span></span>
      </span>
    </button>
  </Code>
</template>
<style lang="scss">
.btn-loader_bars {
  height: 25px;
}
</style>
