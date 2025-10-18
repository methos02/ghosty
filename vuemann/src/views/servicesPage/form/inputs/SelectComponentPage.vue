<script setup>
import { ref } from "vue";
import CodeHtml from "@brugmann/vuemann/src/components/codeHtml/CodeHtmlComponent.vue"
import Select from "@brugmann/vuemann/src/services/form/views/inputs/SelectComponent.vue";

const selectedAnimal = ref(undefined)
const animals = ['chat', 'chien', 'lapin', 'vache', 'cheval', 'poney', 'cochon', 'renard']
</script>

<template>
  <h1 class="h1">Select Component</h1>
  <p>
    Ce component permet d'utiliser l'élément html natif select.
  </p>
  
  <h2 class="h2">Propriétés</h2>
  <table class="t-default mb-15 w-100">
    <thead>
      <tr>
        <th>Nom</th>
        <th>Type</th>
        <th>Required</th>
        <th>Default</th>
        <th>Description</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>name</td>
        <td>String</td>
        <td>oui</td>
        <td>-</td>
        <td>Nom et id du select</td>
      </tr>
      <tr>
        <td>label</td>
        <td>String</td>
        <td>-</td>
        <td>null</td>
        <td>Label du select.</td>
      </tr>
      <tr>
        <td>required</td>
        <td>Boolean</td>
        <td>-</td>
        <td>false</td>
        <td>Le select est-il requis.</td>
      </tr>
      <tr>
        <td>error</td>
        <td>Boolean</td>
        <td>-</td>
        <td>true</td>
        <td>Afficher ou non les erreurs de validation.</td>
      </tr>
      <tr>
        <td>form</td>
        <td>String</td>
        <td>-</td>
        <td>undefined</td>
        <td>Nom du formulaire associé.</td>
      </tr>
    </tbody>
  </table>
  
  <h2 class="h2">Exemple</h2>
  <div class="d-flex">
    <Select
      name="animal"
      v-model="selectedAnimal"
      label="Animal"
    >
      <option
        v-for="animal in animals"
        :key="animal"
        :value="animal"
      >
        {{ animal }}
      </option>
    </Select>
  </div>
  <p class="textarea-value mt-15">Valeur: {{ selectedAnimal }}</p>
  
  <h2 class="h2">Code</h2>
  <!-- eslint-disable -->
  <CodeHtml class="my-15">
      <scriptBalise v-pre>
        import Select from "@brugmann/vuemann/src/services/form/views/inputs/SelectComponent.vue"; 
      </scriptBalise>
      <template v-pre>
        <Select name="animal" label="Animal">
          <option value="chat">chat</option>
          <option value="chien">chien</option>
          <option value="lapin">lapin</option>
        </Select>
      </template>
  </CodeHtml>
  <!-- eslint-enable -->
</template>

<style lang="scss">
.textarea-value {
    white-space: pre-wrap
}
</style>
