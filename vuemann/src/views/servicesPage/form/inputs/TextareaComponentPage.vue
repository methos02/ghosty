<script setup>
import { ref } from "vue";
import CodeHtml from "@brugmann/vuemann/src/components/codeHtml/CodeHtmlComponent.vue"
import Textarea from "@brugmann/vuemann/src/services/form/views/inputs/TextareaComponent.vue";

const textarea = ref()
</script>

<template>
  <h1 class="h1">Textarea Component</h1>
  <p>
    Ce component permet de pouvoir utiliser l'élément html natif Textarea de manière standard.
    Lorsque la prop <code>label</code> est fournie, le composant affiche un <strong>label flottant</strong> sur le même principe que l'Input : le label 
    se place dans le champ et remonte au focus/saisie.
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
        <td>Nom et id du textarea</td>
      </tr>
      <tr>
        <td>placeholder</td>
        <td>String</td>
        <td>-</td>
        <td>null</td>
        <td>Placeholder du textarea.</td>
      </tr>
      <tr>
        <td>label</td>
        <td>String</td>
        <td>-</td>
        <td>null</td>
        <td>Label du textarea.</td>
      </tr>
      <tr>
        <td>required</td>
        <td>Boolean</td>
        <td>-</td>
        <td>false</td>
        <td>Le textarea est-il requis.</td>
      </tr>
      <tr>
        <td>autogrow</td>
        <td>Boolean</td>
        <td>-</td>
        <td>false</td>
        <td>La hauteur du textarea doit-elle s'adapter au texte.</td>
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
      <tr>
        <td>maxLength</td>
        <td>Number</td>
        <td>-</td>
        <td>undefined</td>
        <td>Nombre maximum de caractères autorisés. Affiche un compteur de caractères.</td>
      </tr>
    </tbody>
  </table>
  
  <h2 class="h2">Exemples</h2>
  
  <h3 class="h3">Textarea basique</h3>
  <Textarea
      name="comment"
      :autogrow="true"
      v-model="textarea"
      label="Commentaire"
  />
  <p class="textarea-value mt-15">Valeur: {{ textarea }}</p>
  
  <h3 class="h3">Textarea avec limite de caractères</h3>
  <Textarea
      name="comment-limited"
      :autogrow="true"
      v-model="textarea"
      label="Commentaire limité"
      :maxLength="100"
  />
  
  <h2 class="h2">Code</h2>
  <!-- eslint-disable -->
  <CodeHtml class="my-15">
      <scriptBalise v-pre>
        import Textarea from "@brugmann/vuemann/src/services/form/views/inputs/TextareaComponent.vue"; 
      </scriptBalise>
      <template v-pre>
        <!-- Textarea basique -->
        <Textarea
          name="comment"
          label="Commentaire"
          :autogrow="true"
        />
        
        <!-- Avec limite de caractères -->
        <Textarea
          name="comment-limited"
          label="Commentaire limité"
          :autogrow="true"
          :maxLength="100"
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
