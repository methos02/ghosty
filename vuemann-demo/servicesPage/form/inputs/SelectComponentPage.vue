<script setup>
import { ref } from 'vue'
import CodeHtml from '@brugmann/vuemann/src/components/codeHtml/CodeHtmlComponent.vue'
import Select from '@brugmann/vuemann/src/services/form/views/inputs/SelectComponent.vue'

const selectedAnimal = ref(undefined)
const selectedFilter = ref(undefined)
const animals = ['chat', 'chien', 'lapin', 'vache', 'cheval', 'poney', 'cochon', 'renard']
</script>

<template>
  <h1 class="h1">Select Component</h1>
  <p>
    Ce composant permet d'utiliser l'élément HTML natif select avec un système de label flottant et
    validation intégrée. Il supporte les objets complexes, la recherche intégrée via le slot par
    défaut, et s'intègre automatiquement avec le service de validation Form.
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
        <td>Nom et id du select (sera préfixé par form si fourni)</td>
      </tr>
      <tr>
        <td>label</td>
        <td>String</td>
        <td>non</td>
        <td>''</td>
        <td>Texte du label flottant (si vide, pas de label affiché)</td>
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
        <td>form</td>
        <td>String</td>
        <td>non</td>
        <td>undefined</td>
        <td>Préfixe pour le nom du select (ex: form='user' + name='country' = 'user.country')</td>
      </tr>
      <tr>
        <td>fixedLabel</td>
        <td>Boolean</td>
        <td>non</td>
        <td>false</td>
        <td>Force le label à rester flottant même si la valeur est undefined</td>
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

  <h2 class="h2">Slot par Défaut</h2>
  <p>
    Le composant utilise un slot par défaut pour insérer les éléments
    <span class="badge-code">&lt;option&gt;</span>. Vous pouvez utiliser des boucles v-for pour
    générer dynamiquement les options.
  </p>
  <div
    class="div-code"
    v-pre
  >
    &lt;Select name="animal" label="Animal"&gt;<br />
    &emsp;&lt;option v-for="animal in animals" :key="animal" :value="animal"&gt;<br />
    &emsp;&emsp;{{ animal }}<br />
    &emsp;&lt;/option&gt;<br />
    &lt;/Select&gt;
  </div>

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

  <h2 class="h2">Exemple avec fixedLabel</h2>
  <p>
    La propriété <code>fixedLabel</code> permet de forcer le label à rester en position flottante
    même quand la valeur est <code>undefined</code>. Ceci est utile pour des options comme "Tous"
    qui ont <code>value="undefined"</code> mais doivent afficher le label correctement.
  </p>
  <div class="d-flex g-15">
    <Select
      name="filter"
      v-model="selectedFilter"
      label="Filtre"
      :fixedLabel="true"
    >
      <option :value="undefined">Tous</option>
      <option
        v-for="animal in animals"
        :key="animal"
        :value="animal"
      >
        {{ animal }}
      </option>
    </Select>
  </div>
  <p class="textarea-value mt-15">Valeur: {{ selectedFilter }}</p>

  <h2 class="h2">Fonctionnalités Avancées</h2>

  <h3 class="h3">Label Flottant et fixedLabel</h3>
  <p>
    Le composant utilise un système de label flottant basé sur la classe CSS
    <span class="badge-code">.valid</span>. Le label flotte automatiquement lorsque
    <span class="badge-code">select !== undefined</span> ou lorsque
    <span class="badge-code">fixedLabel === true</span>.
  </p>
  <div
    class="div-code"
    v-pre
  >
    <span class="color-neutral-500">// Dans le template</span><br />
    &lt;select class="form-input input" :class="{'valid': select !== undefined ||
    props.fixedLabel}"&gt;
  </div>
  <p>
    <strong>Cas d'usage de fixedLabel :</strong> Lorsque vous avez une option "Tous" avec
    <span class="badge-code">value="undefined"</span>, le label descendrait normalement car la
    valeur serait undefined. En activant <span class="badge-code">fixedLabel</span>, le label reste
    flottant.
  </p>

  <h3 class="h3">Option vide cachée</h3>
  <p>
    Le composant insère automatiquement une option vide, cachée et désactivée pour permettre au
    label flottant de fonctionner correctement :
  </p>
  <div
    class="div-code"
    v-pre
  >
    &lt;option value="" disabled hidden&gt;&lt;/option&gt;
  </div>
  <p>
    Cette option garantit que le select peut être "vide" au chargement sans afficher de texte par
    défaut.
  </p>

  <h2 class="h2">Code</h2>

  <h3 class="h3">Exemple de base</h3>
  <!-- eslint-disable -->
  <CodeHtml class="my-15">
    <scriptBalise v-pre>
      import Select from "@brugmann/vuemann/src/services/form/views/inputs/SelectComponent.vue";
    </scriptBalise>
    <template v-pre>
      <Select
        name="animal"
        label="Animal"
      >
        <option value="chat">chat</option>
        <option value="chien">chien</option>
        <option value="lapin">lapin</option>
      </Select>
    </template>
  </CodeHtml>

  <h3 class="h3">Exemple avec fixedLabel</h3>
  <CodeHtml class="my-15">
    <scriptBalise v-pre>
      import Select from "@brugmann/vuemann/src/services/form/views/inputs/SelectComponent.vue";
    </scriptBalise>
    <template v-pre>
      <Select
        name="filter"
        label="Filtre"
        :fixedLabel="true"
      >
        <option :value="undefined">Tous</option>
        <option value="active">Actif</option>
        <option value="inactive">Inactif</option>
      </Select>
    </template>
  </CodeHtml>
  <!-- eslint-enable -->
</template>

<style lang="scss">
.textarea-value {
  white-space: pre-wrap;
}
</style>
