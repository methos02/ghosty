<script setup>
  import CodeHtml from "@brugmann/vuemann/src/components/codeHtml/CodeHtmlComponent.vue"
</script>
<template>
  <h1 class="h1">Titre</h1>
  <p>
    Vuemann intègre un ensemble de class pour armoniser les titres de votre application.
  </p>
  <div class="h1">Titre h1</div>
  <div class="h2">Titre h2</div>
  <div class="h3">Titre h3</div>
  <div class="h4">Titre h4</div>
  <CodeHtml>
    <h1 class="h1">Titre h1</h1>
    <h1 class="h2">Titre h2</h1>
    <h1 class="h3">Titre h3</h1>
    <h1 class="h4">Titre h4</h1>
  </CodeHtml>
</template>
