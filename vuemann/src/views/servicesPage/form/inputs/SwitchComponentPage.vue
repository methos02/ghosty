<script setup>
import { ref } from "vue";
import CodeHtml from "@brugmann/vuemann/src/components/codeHtml/CodeHtmlComponent.vue"
import Switch from "@brugmann/vuemann/src/services/form/views/inputs/SwitchComponent.vue";
const switchValue = ref(false)
const externalSwitchValue = ref(false)
const customSwitchValue = ref('dev')

const toggleSwitch = () => {
  externalSwitchValue.value = !externalSwitchValue.value
}
</script>

<template>
  <h1 class="h1">Switch Component</h1>
  <p>
    Ce component permet d'utiliser un bouton de commutation (switch) stylisé pour les valeurs booléennes.
    <br /><strong>Note importante :</strong> Au moins un des deux (prefix ou suffix) doit être rempli.
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
        <td>Nom et id du switch</td>
      </tr>
      <tr>
        <td>prefix</td>
        <td>String</td>
        <td>-</td>
        <td>''</td>
        <td>Texte affiché avant le switch.</td>
      </tr>
      <tr>
        <td>suffix</td>
        <td>String</td>
        <td>-</td>
        <td>''</td>
        <td>Texte affiché après le switch.</td>
      </tr>
      <tr>
        <td>required</td>
        <td>Boolean</td>
        <td>-</td>
        <td>false</td>
        <td>Le switch est-il requis.</td>
      </tr>
      <tr>
        <td>error</td>
        <td>Boolean</td>
        <td>-</td>
        <td>true</td>
        <td>Afficher ou non les erreurs de validation.</td>
      </tr>
      <tr>
        <td>disabled</td>
        <td>Boolean</td>
        <td>-</td>
        <td>false</td>
        <td>Le switch est-il désactivé.</td>
      </tr>
      <tr>
        <td>form</td>
        <td>String</td>
        <td>-</td>
        <td>undefined</td>
        <td>Nom du formulaire associé.</td>
      </tr>
      <tr>
        <td>values</td>
        <td>Object</td>
        <td>-</td>
        <td>{ true: true, false: false }</td>
        <td>Objet définissant les valeurs de retour pour les états activé/désactivé.</td>
      </tr>
    </tbody>
  </table>
  
  <h2 class="h2">Exemples</h2>
  
  <h3 class="h3">Switch basique</h3>
  <div class="d-flex">
    <Switch
      name="notifications"
      v-model="switchValue"
      suffix="Activer les notifications"
    />
  </div>
  <p class="textarea-value mt-15">Valeur: {{ switchValue }}</p>
  
  <h3 class="h3">Switch avec prefix et suffix</h3>
  <div class="d-flex">
    <Switch
      name="prefix-suffix-switch"
      v-model="switchValue"
      prefix="Notifications"
      suffix="activées"
    />
  </div>
  
  <h3 class="h3">Switch désactivé</h3>
  <div class="d-flex">
    <Switch
      name="disabled-switch"
      :disabled="true"
      suffix="Switch désactivé"
    />
  </div>
  
  <h3 class="h3">Contrôle externe du switch</h3>
  <div class="d-flex a-center g-15">
    <Switch
      name="external-switch"
      v-model="externalSwitchValue"
      suffix="Switch contrôlé externe"
    />
    <button 
      class="btn btn-primary" 
      @click="toggleSwitch"
    >
      {{ externalSwitchValue ? 'Désactiver' : 'Activer' }} le switch
    </button>
  </div>
  <p class="textarea-value">Valeur: {{ externalSwitchValue }}</p>
  
  <h3 class="h3">Switch avec valeurs personnalisées</h3>
  <div class="d-flex">
    <Switch
      name="environment-switch"
      v-model="customSwitchValue"
      suffix="Environnement"
      :values="{ true: 'prod', false: 'dev' }"
    />
  </div>
  <p class="textarea-value mt-15">Valeur: {{ customSwitchValue }}</p>
  
  <h2 class="h2">Code</h2>
  
  <h3 class="h3">Switch basique</h3>
  <!-- eslint-disable -->
  <CodeHtml class="my-15">
      <scriptBalise v-pre>
        import Switch from "@brugmann/vuemann/src/services/form/views/inputs/SwitchComponent.vue"; 
      </scriptBalise>
      <template v-pre>
        <Switch
          name="notifications"
          suffix="Activer les notifications"
        />
      </template>
  </CodeHtml>
  <!-- eslint-enable -->
  
  <h3 class="h3">Switch avec prefix et suffix</h3>
  <!-- eslint-disable -->
  <CodeHtml class="my-15">
      <scriptBalise v-pre>
        import Switch from "@brugmann/vuemann/src/services/form/views/inputs/SwitchComponent.vue"; 
      </scriptBalise>
      <template v-pre>
        <Switch
          name="prefix-suffix-switch"
          prefix="Notifications"
          suffix="activées"
        />
      </template>
  </CodeHtml>
  <!-- eslint-enable -->
  
  <h3 class="h3">Switch avec valeurs personnalisées</h3>
  <!-- eslint-disable -->
  <CodeHtml class="my-15">
      <scriptBalise v-pre>
        import Switch from "@brugmann/vuemann/src/services/form/views/inputs/SwitchComponent.vue"; 
      </scriptBalise>
      <template v-pre>
        <Switch
          name="environment-switch"
          suffix="Environnement"
          :values="{ true: 'prod', false: 'dev' }"
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
