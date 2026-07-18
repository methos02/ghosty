<script setup>
import { ref } from 'vue'
import CodeHtml from '@brugmann/vuemann/src/components/codeHtml/CodeHtmlComponent.vue'
import Switch from '@brugmann/vuemann/src/services/form/views/inputs/SwitchComponent.vue'
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
    Ce component permet d'utiliser un bouton de commutation (switch) stylisé pour les valeurs
    booléennes ou personnalisées.
    <br /><strong>Note importante :</strong> Au moins un des deux (prefix ou suffix) doit être
    rempli, sinon le composant lancera une erreur.
  </p>

  <h2 class="h2">v-model</h2>
  <p>
    Le composant utilise <span class="badge-code">v-model</span> pour la liaison bidirectionnelle
    des données.
  </p>
  <table class="t-default mb-15 w-100">
    <thead>
      <tr>
        <th>Type</th>
        <th>Default</th>
        <th>Description</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>Boolean | String | Number</td>
        <td>false</td>
        <td>Valeur du switch. Le type dépend de la prop <span class="badge-code">values</span></td>
      </tr>
    </tbody>
  </table>

  <h2 class="h2">Dépendances</h2>
  <p>Ce composant utilise :</p>
  <ul>
    <li><span class="badge-code">ErrorFormComponent</span> - Affiche les erreurs de validation</li>
    <li>
      <span class="badge-code">FormHelper.getInputName()</span> - Génère le nom complet de l'input
      avec préfixe de formulaire
    </li>
  </ul>

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

  <h2 class="h2">Fonctionnalités</h2>

  <h3 class="h3"><i class="fa-solid fa-diamond mr-5"></i>Validation automatique</h3>
  <p>
    Le composant utilise <span class="badge-code">watchEffect</span> pour valider que au moins un
    des deux (prefix ou suffix) est fourni :
  </p>
  <ul>
    <li>Si les deux sont vides, le composant lance une <span class="badge-code">Error</span></li>
    <li>L'erreur indique le nom du composant concerné pour faciliter le débogage</li>
    <li>Cette validation s'exécute automatiquement à chaque modification des props</li>
  </ul>

  <h3 class="h3"><i class="fa-solid fa-diamond mr-5"></i>Transformation des valeurs</h3>
  <p>
    Le composant utilise un computed <span class="badge-code">internalValue</span> pour gérer la
    transformation entre v-model et l'input checkbox :
  </p>
  <ul>
    <li>
      <strong>get()</strong> : Compare la valeur du v-model avec
      <span class="badge-code">values.true</span> pour retourner un boolean
    </li>
    <li>
      <strong>set()</strong> : Convertit le boolean de la checkbox en utilisant
      <span class="badge-code">values.true</span> ou <span class="badge-code">values.false</span>
    </li>
    <li>
      Permet d'utiliser des valeurs personnalisées (ex: 'prod'/'dev', 1/0) tout en gardant un
      checkbox natif
    </li>
  </ul>

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
      class="btn btn-primary btn-primary-400-active"
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
  white-space: pre-wrap;
}
</style>
