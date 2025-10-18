<script setup>
import { ref } from "vue";
import CodeHtml from "@brugmann/vuemann/src/components/codeHtml/CodeHtmlComponent.vue"
import Input from "@brugmann/vuemann/src/services/form/views/inputs/InputComponent.vue";

const input = ref()
</script>

<template>
  <h1 class="h1">Input Component</h1>
  <p>
    Ce component permet de pouvoir utiliser l'élément html natif input de manière standard. Il va prendre toute la 
    largeur disponible.
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
        <td>Nom et id de l'input</td>
      </tr>
      <tr>
        <td>type</td>
        <td>String</td>
        <td>-</td>
        <td>'text'</td>
        <td>Type de l'input.</td>
      </tr>
      <tr>
        <td>placeholder</td>
        <td>String</td>
        <td>-</td>
        <td>null</td>
        <td>Placeholder de l'input.</td>
      </tr>
      <tr>
        <td>label</td>
        <td>String</td>
        <td>-</td>
        <td>null</td>
        <td>Label de l'input.</td>
      </tr>
      <tr>
        <td>required</td>
        <td>Boolean</td>
        <td>-</td>
        <td>false</td>
        <td>L'input est-il requis.</td>
      </tr>
      <tr>
        <td>error</td>
        <td>Boolean</td>
        <td>-</td>
        <td>true</td>
        <td>Afficher ou non les erreurs de validation.</td>
      </tr>
      <tr>
        <td>autocomplete</td>
        <td>String</td>
        <td>-</td>
        <td>'off'</td>
        <td>Activer ou non l'option autocomplete des navigateurs.</td>
      </tr>
    </tbody>
  </table>
  
  <h2 class="h2">Exemples</h2>
  
  <h3 class="h3">Input Text</h3>
  <div class="d-flex">
    <Input
      name="input"
      v-model="input"
      label="Nom de l'utilisateur"
    />
  </div>
  <p class="textarea-value mt-15">Valeur: {{ input }}</p>
  
  <h3 class="h3">Input Password</h3>
  <div class="d-flex">
    <Input
      name="password"
      type="password"
      label="Mot de passe"
    />
  </div>
  
  <h2 class="h2">Code</h2>
  <!-- eslint-disable -->
  <CodeHtml class="my-15">
      <scriptBalise v-pre>
        import Input from "@brugmann/vuemann/src/services/form/views/inputs/InputComponent.vue"; 
      </scriptBalise>
      <template v-pre>
        <Input
          name="input"
          label="Nom de l'utilisateur"
        />
      </template>
  </CodeHtml>
  <!-- eslint-enable -->
</template>

<style lang="scss">
.textarea-value {
    white-space: pre-wrap
}
</style>
