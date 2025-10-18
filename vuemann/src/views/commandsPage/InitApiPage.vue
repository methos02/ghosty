<script setup>

</script>

<template>
    <h1 class="h1">La commande "initApi"</h1>
    <p>
      Cette commande permet de créer la structure compléte lorsque vous voulez créer la logique pour une nouvelle api
    </p>
    <h2 class="h2">La commande</h2>
    <div class="div-code">npm run initApi {nom de l'api}</div>
    <h2 class="h2">Structure générée</h2>
    <p>
      La structure suivante sera générée dans le dossier src/apis.
    </p>
    <div class="div-code">
      patient<br />
      &emsp;|- controllers<br />
      &emsp;|&emsp;|- patient-controller.js<br />
      &emsp;|- dtos<br />
      &emsp;|&emsp;|- patient-dto.js<br />
      &emsp;|- repositories<br />
      &emsp;|&emsp;|- patient-repository.js<br />
      &emsp;|- stores<br />
      &emsp;|&emsp;|- patient-store.js
    </div>
    <p>
      L'exemple ci-dessus est généré par la commande <span class="badge-code">run initApi patient</span>
    </p>
</template>

<style lang="scss">

</style>
