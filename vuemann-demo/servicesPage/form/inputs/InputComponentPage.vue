<script setup>
import { ref } from 'vue'
import CodeHtml from '@brugmann/vuemann/src/components/codeHtml/CodeHtmlComponent.vue'
import Input from '@brugmann/vuemann/src/services/form/views/inputs/InputComponent.vue'

const input = ref()
</script>

<template>
  <h1 class="h1">Input Component</h1>
  <p>
    Ce composant permet d'utiliser l'élément HTML natif input avec un système de label flottant et
    validation intégrée. Il prend toute la largeur disponible et s'intègre automatiquement avec le
    service de validation Form.
  </p>

  <h2 class="h2">Caractéristiques</h2>
  <ul class="list ml-25">
    <li><strong>Label flottant</strong> - Le label s'anime automatiquement lors de la saisie</li>
    <li>
      <strong>Validation intégrée</strong> - Affichage automatique des erreurs via
      ErrorFormComponent
    </li>
    <li><strong>Toggle password</strong> - Bouton show/hide pour les inputs de type password</li>
    <li><strong>Support v-model</strong> - Liaison bidirectionnelle avec String ou Number</li>
    <li><strong>Préfixe de formulaire</strong> - Support du préfixe via la prop form</li>
    <li><strong>Readonly</strong> - Support du mode lecture seule</li>
    <li><strong>Disabled</strong> - Support du mode désactivé avec style visuel distinct</li>
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
        <td>Nom de l'input (sera préfixé par form si fourni)</td>
      </tr>
      <tr>
        <td>label</td>
        <td>String</td>
        <td>oui</td>
        <td>-</td>
        <td>Texte du label flottant</td>
      </tr>
      <tr>
        <td>type</td>
        <td>String</td>
        <td>non</td>
        <td>'text'</td>
        <td>Type HTML de l'input (text, email, password, number, etc.)</td>
      </tr>
      <tr>
        <td>required</td>
        <td>Boolean</td>
        <td>non</td>
        <td>false</td>
        <td>Affiche un astérisque (*) sur le label si true</td>
      </tr>
      <tr>
        <td>error</td>
        <td>Boolean</td>
        <td>non</td>
        <td>true</td>
        <td>Afficher ou non le composant ErrorFormComponent</td>
      </tr>
      <tr>
        <td>autocomplete</td>
        <td>String</td>
        <td>non</td>
        <td>'off'</td>
        <td>Valeur de l'attribut autocomplete HTML</td>
      </tr>
      <tr>
        <td>readonly</td>
        <td>Boolean</td>
        <td>non</td>
        <td>false</td>
        <td>Rend l'input en lecture seule</td>
      </tr>
      <tr>
        <td>disabled</td>
        <td>Boolean</td>
        <td>non</td>
        <td>false</td>
        <td>Désactive l'input (fond grisé, texte atténué, curseur interdit)</td>
      </tr>
      <tr>
        <td>form</td>
        <td>String</td>
        <td>non</td>
        <td>undefined</td>
        <td>Préfixe pour le nom de l'input (ex: form='user' + name='email' = 'user.email')</td>
      </tr>
      <tr>
        <td>containerClass</td>
        <td>String</td>
        <td>non</td>
        <td>''</td>
        <td>Classes CSS additionnelles pour le conteneur principal</td>
      </tr>
    </tbody>
  </table>

  <h2 class="h2">v-model</h2>
  <p>
    Le composant supporte v-model avec les types <span class="badge-code">String</span> et
    <span class="badge-code">Number</span>. La valeur par défaut est une chaîne vide.
  </p>
  <div class="div-code">
    const inputValue = ref('') <span class="color-neutral-500">// String</span><br />
    const ageValue = ref(0) <span class="color-neutral-500">// Number</span><br /><br />
    &lt;Input v-model="inputValue" name="username" label="Nom d'utilisateur" /&gt;<br />
    &lt;Input v-model="ageValue" name="age" label="Âge" type="number" /&gt;
  </div>

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
  <p>
    Les inputs de type password incluent automatiquement un bouton pour afficher/masquer le mot de
    passe.
  </p>
  <div class="d-flex">
    <Input
      name="password"
      type="password"
      label="Mot de passe"
    />
  </div>

  <h3 class="h3">Input avec préfixe de formulaire</h3>
  <p>
    La prop <span class="badge-code">form</span> permet de préfixer automatiquement le nom de
    l'input.
  </p>
  <div class="d-flex">
    <Input
      name="email"
      form="user"
      label="Email"
      type="email"
    />
  </div>
  <p class="mt-10">
    <small class="color-neutral-500">
      Nom généré : <span class="badge-code">user.email</span> (utilisé pour la validation)
    </small>
  </p>

  <h3 class="h3">Input readonly</h3>
  <div class="d-flex">
    <Input
      name="readonly"
      label="Champ en lecture seule"
      v-model="input"
      :readonly="true"
    />
  </div>

  <h3 class="h3">Input disabled</h3>
  <p>
    L'input désactivé a un fond plus foncé, un texte grisé et un curseur interdit. Le hover/focus ne
    change pas la bordure.
  </p>
  <div class="d-flex">
    <Input
      name="disabled"
      label="Champ désactivé"
      v-model="input"
      :disabled="true"
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
  white-space: pre-wrap;
}
</style>
