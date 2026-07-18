<script setup>
import { ref } from 'vue'
import CodeHtml from '@brugmann/vuemann/src/components/codeHtml/CodeHtmlComponent.vue'
import InputSearch from '@brugmann/vuemann/src/services/form/views/inputs/InputSearchComponent.vue'

const animals = ['chat', 'chien', 'lapin', 'vache', 'cheval', 'poney', 'cochon', 'renard']
const result = ref([])
const resultMinLength = ref([])
const selectedAnimal = ref(undefined)
const searchDropdown = ref('')
const searchMinLength = ref('')

const callback = value => {
  const animalsFiltered = animals.filter(animal => animal.startsWith(value))
  result.value = animalsFiltered
  return result.value
}

const selectAnimal = animal => {
  selectedAnimal.value = animal
  searchDropdown.value = animal
}

const callbackMinLength = value => {
  const animalsFiltered = animals.filter(animal => animal.startsWith(value))
  resultMinLength.value = animalsFiltered
  return resultMinLength.value
}

const selectedAnimalMinLength = ref(undefined)
const selectAnimalMinLength = animal => {
  selectedAnimalMinLength.value = animal
  searchMinLength.value = animal
}
</script>

<template>
  <h1 class="h1">Input Search Component</h1>
  <p>
    Ce component permet d'exécuter une fonction de recherche à chaque frappe de clavier avec
    debounce automatique (500ms). Il affiche les résultats dans un dropdown et gère automatiquement
    les erreurs, le chargement et la validation. Le composant possède sa liste et son état
    d'ouverture : aucune méthode impérative à appeler depuis le parent.
  </p>

  <h2 class="h2">v-model</h2>
  <p>Le composant expose deux <span class="badge-code">v-model</span> :</p>
  <table class="t-default mb-15 w-100">
    <thead>
      <tr>
        <th>Model</th>
        <th>Type</th>
        <th>Default</th>
        <th>Description</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>v-model</td>
        <td>String</td>
        <td>""</td>
        <td>
          Valeur de recherche saisie (remplace l'ancien <span class="badge-code">setSearch</span>)
        </td>
      </tr>
      <tr>
        <td>v-model:open</td>
        <td>Boolean</td>
        <td>false</td>
        <td>
          État d'ouverture du dropdown. Piloté en interne (focus, résultats, sélection, clic-dehors)
          et modifiable depuis le parent (remplace <span class="badge-code">toggleDropdown</span> et
          <span class="badge-code">setForceDropdown</span>)
        </td>
      </tr>
    </tbody>
  </table>

  <h2 class="h2">Dépendances</h2>
  <p>Ce composant utilise :</p>
  <ul>
    <li><span class="badge-code">ErrorFormComponent</span> - Affiche les erreurs de validation</li>
    <li>
      <span class="badge-code">DropdownComponent</span> - Gère l'affichage du dropdown des résultats
    </li>
    <li><span class="badge-code">formStore</span> - Stocke et gère les erreurs de validation</li>
    <li>
      <span class="badge-code">FormHelper.getInputName()</span> - Génère le nom complet de l'input
      avec préfixe de formulaire
    </li>
    <li><span class="badge-code">t()</span> - Service de traduction</li>
    <li><span class="badge-code">log</span> - Service de logging pour les erreurs en production</li>
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
        <td>Nom et id de l'input</td>
      </tr>
      <tr>
        <td>label</td>
        <td>String</td>
        <td>oui</td>
        <td>-</td>
        <td>Label flottant de l'input</td>
      </tr>
      <tr>
        <td>cb</td>
        <td>Function</td>
        <td>-</td>
        <td>undefined</td>
        <td>
          Fonction de recherche à exécuter (doit retourner un Array). Exclusive avec
          <span class="badge-code">items</span> : fournir l'une <strong>ou</strong> l'autre
          (exactement une), jamais les deux. Le composant lève une erreur au montage sinon.
        </td>
      </tr>
      <tr>
        <td>items</td>
        <td>Array</td>
        <td>-</td>
        <td>undefined</td>
        <td>
          Mode externe (store-driven) : la liste affichée vient du parent. Désactive le chemin
          <span class="badge-code">cb</span>. Le parent pilote l'ouverture via
          <span class="badge-code">v-model:open</span>.
        </td>
      </tr>
      <tr>
        <td>closeOnSelect</td>
        <td>Boolean</td>
        <td>true</td>
        <td>true</td>
        <td>
          Ferme automatiquement le dropdown après une sélection (<span class="badge-code"
            >select</span
          >
          du slot). Mettre à <span class="badge-code">false</span> pour les cas multi-ajout.
        </td>
      </tr>
      <tr>
        <td>minLenght</td>
        <td>Number</td>
        <td>-</td>
        <td>1</td>
        <td>Nombre minimum de caractères avant de déclencher la recherche</td>
      </tr>
      <tr>
        <td>minLenghtError</td>
        <td>String</td>
        <td>-</td>
        <td>undefined</td>
        <td>
          Clé de traduction pour l'erreur de longueur minimale (par défaut:
          input_search.error_min_length)
        </td>
      </tr>
      <tr>
        <td>pattern</td>
        <td>RegExp</td>
        <td>-</td>
        <td>undefined</td>
        <td>
          Permet de ne pas activer la fonction de recherche si la touche pressée ne correspond pas à
          la regexp
        </td>
      </tr>
      <tr>
        <td>displayError</td>
        <td>Boolean</td>
        <td>-</td>
        <td>true</td>
        <td>Afficher ou non les erreurs de validation</td>
      </tr>
      <tr>
        <td>form</td>
        <td>String</td>
        <td>-</td>
        <td>undefined</td>
        <td>Nom du formulaire associé (préfixe pour le nom du champ)</td>
      </tr>
      <tr>
        <td>required</td>
        <td>Boolean</td>
        <td>-</td>
        <td>false</td>
        <td>Indique si le champ est requis (affiche *)</td>
      </tr>
      <tr>
        <td>noResult</td>
        <td>String</td>
        <td>-</td>
        <td>input_search.no_result</td>
        <td>
          Clé de traduction du message à afficher lorsqu'aucun résultat n'est trouvé dans le
          dropdown
        </td>
      </tr>
    </tbody>
  </table>

  <h2 class="h2">Méthodes</h2>
  <p>
    Le composant n'expose plus qu'une seule méthode. Toute la gestion d'ouverture/fermeture est
    interne ou déclarative via <span class="badge-code">v-model:open</span>.
  </p>

  <h3 class="h3">focus</h3>
  <p>Permet de focus l'input du component.</p>

  <h2 class="h2">Événements</h2>
  <table class="t-default mb-15 w-100">
    <thead>
      <tr>
        <th>Nom</th>
        <th>Payload</th>
        <th>Description</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>focus</td>
        <td>-</td>
        <td>Émis lorsque l'input reçoit le focus</td>
      </tr>
      <tr>
        <td>select</td>
        <td>item</td>
        <td>
          Émis lorsque <span class="badge-code">select(item)</span> du slot est appelé. Ferme le
          dropdown si <span class="badge-code">closeOnSelect</span> est
          <span class="badge-code">true</span>.
        </td>
      </tr>
    </tbody>
  </table>

  <h2 class="h2">Slot Template</h2>
  <p>
    Le component expose un slot par défaut scopé pour rendre les résultats et gérer la sélection :
  </p>
  <table class="t-default">
    <thead>
      <tr>
        <th>Variable</th>
        <th>Type</th>
        <th>Description</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>items</td>
        <td>Array</td>
        <td>
          Tableau des résultats (du <span class="badge-code">cb</span> ou de la prop
          <span class="badge-code">items</span>)
        </td>
      </tr>
      <tr>
        <td>select</td>
        <td>Function</td>
        <td>
          À appeler au clic sur un résultat : <span class="badge-code">select(item)</span> émet
          <span class="badge-code">@select</span> et ferme si
          <span class="badge-code">closeOnSelect</span>
        </td>
      </tr>
      <tr>
        <td>close</td>
        <td>Function</td>
        <td>Ferme le dropdown manuellement (cas particuliers)</td>
      </tr>
    </tbody>
  </table>
  <p>
    <strong>Note :</strong> Vous pouvez renommer les variables :
    <span class="badge-code">v-slot:default="{ items: maListe, select }"</span>
  </p>

  <h2 class="h2">Fonctionnalités</h2>

  <h3 class="h3"><i class="fa-solid fa-diamond mr-5"></i>État de chargement</h3>
  <p>Pendant la recherche, le composant entre en état de chargement :</p>
  <ul>
    <li>La classe <span class="badge-code">searching</span> est appliquée au conteneur</li>
    <li>Le bouton de clear (×) du type "search" est masqué pendant la recherche</li>
    <li>L'état de chargement est automatiquement géré (début et fin de recherche)</li>
  </ul>

  <h3 class="h3"><i class="fa-solid fa-diamond mr-5"></i>Dropdown intelligent</h3>
  <p>Le dropdown gère son ouverture/fermeture lui-même :</p>
  <ul>
    <li>
      <strong>Ouverture</strong> : à l'arrivée de résultats, au focus / re-clic dans le champ s'il y
      a du contenu
    </li>
    <li>
      <strong>Fermeture</strong> : après sélection (<span class="badge-code">closeOnSelect</span>),
      au vidage du champ, sur Échap, ou au clic en dehors
    </li>
    <li>
      <strong>Pilotage externe</strong> : le parent peut forcer l'état via
      <span class="badge-code">v-model:open</span>
    </li>
  </ul>

  <h3 class="h3"><i class="fa-solid fa-diamond mr-5"></i>Navigation au clavier</h3>
  <p>Le composant supporte la navigation au clavier pour une meilleure accessibilité :</p>
  <table class="t-default mb-15 w-100">
    <thead>
      <tr>
        <th>Touche</th>
        <th>Action</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><span class="badge-code">↓</span> Arrow Down</td>
        <td>Sélectionne l'élément suivant dans la liste</td>
      </tr>
      <tr>
        <td><span class="badge-code">↑</span> Arrow Up</td>
        <td>Sélectionne l'élément précédent dans la liste</td>
      </tr>
      <tr>
        <td><span class="badge-code">Enter</span></td>
        <td>
          Dropdown ouvert : valide la sélection (click sur l'élément surligné, ou sur le premier si
          aucun n'est surligné). Dropdown fermé : l'événement remonte au
          <span class="badge-code">&lt;form&gt;</span> parent, qui peut se soumettre.
        </td>
      </tr>
      <tr>
        <td><span class="badge-code">Escape</span></td>
        <td>Ferme le dropdown et réinitialise la sélection</td>
      </tr>
    </tbody>
  </table>
  <p>
    <strong>Note :</strong> L'input conserve le focus pendant la navigation. Les éléments
    <span class="badge-code">&lt;li&gt;</span> dans le slot reçoivent la classe
    <span class="badge-code">input-search--selected</span> pour indiquer la sélection visuelle.
  </p>

  <h3 class="h3"><i class="fa-solid fa-diamond mr-5"></i>Nettoyage automatique</h3>
  <p>Le composant gère le nettoyage des ressources :</p>
  <ul>
    <li>
      Lorsque la recherche est vidée, les erreurs sont automatiquement supprimées et le dropdown se
      ferme
    </li>
    <li>Les résultats sont réinitialisés quand la recherche est vide</li>
    <li>
      Le timeout de debounce est nettoyé lors du démontage du composant (<span class="badge-code"
        >onUnmounted</span
      >)
    </li>
    <li>
      Les callbacks asynchrones résolus après démontage n'écrivent plus d'état (pas de crash sur
      composant démonté)
    </li>
  </ul>

  <h2 class="h2">Exemples</h2>

  <h3 class="h3">Input search classique</h3>
  <p>Recherche possible : {{ animals }}</p>
  <InputSearch
    name="search"
    :cb="callback"
    label="Recherche"
  />
  <p>Éléments trouvés : {{ result }}</p>

  <h3 class="h3">Input search avec Dropdown et sélection</h3>
  <p>
    Vous avez la possibilité d'afficher les résultats dans un dropdown. Votre fonction de recherche
    doit retourner les résultats trouvés, accessibles via le slot scopé. Au clic, appelez
    <span class="badge-code">select(item)</span> pour émettre
    <span class="badge-code">@select</span> et fermer le dropdown.
  </p>
  <p>
    <strong>Important :</strong> La fonction de recherche doit retourner un tableau de résultats. Si
    aucun résultat n'est trouvé, retournez un tableau vide <span class="badge-code">[]</span>.
  </p>
  <InputSearch
    name="search_dropdown"
    :cb="callback"
    label="Recherche"
    v-model="searchDropdown"
    @select="selectAnimal"
  >
    <template v-slot:default="{ items: datas, select }">
      <ul class="services-list | f-column g-5 my-5">
        <li
          v-for="data in datas"
          :key="data"
          class="px-15 pointer bg-primary-200-hover"
          @click="select(data)"
        >
          {{ data }}
        </li>
      </ul>
    </template>
  </InputSearch>
  <p v-if="selectedAnimal">
    Animal sélectionné : <strong>{{ selectedAnimal }}</strong>
  </p>

  <h3 class="h3">Input search avec minLenght</h3>
  <p>
    Exemple avec <span class="badge-code">:minLenght="2"</span> : la recherche ne se déclenche qu'à
    partir de 2 caractères. Si vous tapez un seul caractère, une erreur de longueur minimale
    s'affiche.
  </p>
  <p>Recherche possible : {{ animals }}</p>
  <InputSearch
    name="search_min_length"
    :cb="callbackMinLength"
    label="Recherche (min 2 caractères)"
    :minLenght="2"
    v-model="searchMinLength"
    @select="selectAnimalMinLength"
  >
    <template v-slot:default="{ items: datas, select }">
      <ul class="services-list | f-column g-5 my-5">
        <li
          v-for="data in datas"
          :key="data"
          class="px-15 pointer bg-primary-200-hover"
          @click="select(data)"
        >
          {{ data }}
        </li>
      </ul>
    </template>
  </InputSearch>
  <p v-if="selectedAnimalMinLength">
    Animal sélectionné : <strong>{{ selectedAnimalMinLength }}</strong>
  </p>
  <p>Éléments trouvés : {{ resultMinLength }}</p>

  <h3 class="h3">Exemple avec API et gestion d'erreurs</h3>
  <p>
    Voici un exemple plus complet avec une recherche via API, gestion des erreurs et affichage du
    nombre de résultats :
  </p>
  <CodeHtml>
    <scriptBalise v-pre>
      const interventionSearch = async () => { const result = await
      OperaController.interventionSearch({ search: searchIntervention.value, speciality_id:
      hospitalizationDatas.value.speciality.id }) if(result.status !== STATUS.SUCCESS) { return [] }
      return result.interventions }
    </scriptBalise>
    <template v-pre>
      <InputSearch
        :label="t('request-create-form-chir-component.search-intervention-label')"
        name="reason"
        v-model="searchIntervention"
        :cb="interventionSearch"
        :displayError="false"
        noResult="request-create-form-chir-component.search-intervention-no-result"
        @select="selectIntervention"
      >
        <template v-slot:default="{ items: interventions, select }">
          <p
            data-total
            class="result-total | ml-10 fw-700 color-primary-300"
          >
            {{
              t(
                interventions.length > 1
                  ? 'request-create-form-chir-component.search-interventions-total'
                  : 'request-create-form-chir-component.search-intervention-result',
                { total: interventions.length },
              )
            }}
          </p>
          <ul class="interventions-results | f-column g-5 my-5">
            <li
              v-for="intervention in interventions"
              :key="intervention"
              class="pointer bg-primary-200-hover px-10"
              v-on:click="select(intervention)"
            >
              <div class="praticien-item">
                {{ intervention.name }}
              </div>
            </li>
          </ul>
        </template>
      </InputSearch>
    </template>
  </CodeHtml>

  <h2 class="h2">Code</h2>
  <!-- eslint-disable -->
  <CodeHtml class="my-15">
    <scriptBalise v-pre>
      import InputSearch from
      "@brugmann/vuemann/src/services/form/views/inputs/InputSearchComponent.vue";
    </scriptBalise>
    <template v-pre>
      <InputSearch
        name="search"
        :cb="callback"
      />
    </template>
  </CodeHtml>
  <!-- eslint-enable -->

  <h3 class="h3">Personnalisation</h3>
  <p>
    Vous pouvez personnaliser les variables fournies par le slot de la façon suivante
    <span class="badge-code">v-slot:default="{ items : animals, select }"</span>
  </p>

  <h3 class="h3">Exemple avec v-model:open</h3>
  <p>
    Utilisez <span class="badge-code">v-model:open</span> lorsque vous voulez ouvrir le dropdown de
    l'extérieur (par ex. afficher du contenu custom comme des filtres, ou ouvrir selon une liste
    issue d'un store) :
  </p>
  <CodeHtml>
    <scriptBalise v-pre>
      import { ref, watch } from 'vue' const search = ref('') const open = ref(false) const filters
      = ref([]) // Ouvre le dropdown dès qu'il y a des filtres à montrer watch(filters, value => {
      open.value = value.length > 0 })
    </scriptBalise>
    <template v-pre>
      <InputSearch
        name="search_with_filters"
        :cb="searchCallback"
        label="Recherche"
        v-model="search"
        v-model:open="open"
      >
        <template v-slot:default="{ items, select }">
          <!-- Résultats de recherche -->
          <ul
            v-if="items.length > 0"
            class="results-list"
          >
            <li
              v-for="item in items"
              :key="item.id"
              @click="select(item)"
            >
              {{ item.name }}
            </li>
          </ul>

          <!-- Filtres affichés même sans résultats -->
          <div
            v-if="filters.length > 0"
            class="filters-section"
          >
            <h4>Filtres actifs</h4>
            <button v-on:click="open = false">Fermer</button>
          </div>
        </template>
      </InputSearch>
    </template>
  </CodeHtml>

  <h3 class="h3">Mode externe (items du store)</h3>
  <p>
    Pour une liste pilotée par un store parent, passez <span class="badge-code">:items</span> (le
    composant n'appelle plus <span class="badge-code">cb</span>) et contrôlez l'ouverture via
    <span class="badge-code">v-model:open</span> :
  </p>
  <CodeHtml>
    <template v-pre>
      <InputSearch
        name="search_store"
        label="Recherche"
        v-model="search"
        v-model:open="open"
        :items="storeItems"
      >
        <template v-slot:default="{ items, select }">
          <ul>
            <li
              v-for="item in items"
              :key="item.id"
              @click="select(item)"
            >
              {{ item.name }}
            </li>
          </ul>
        </template>
      </InputSearch>
    </template>
  </CodeHtml>

  <h3 class="h3">Bonnes pratiques</h3>
  <ul>
    <li>
      <strong>Fonction de recherche :</strong> Toujours retourner un tableau, même vide
      <span class="badge-code">[]</span> en cas d'erreur ou d'absence de résultats
    </li>
    <li>
      <strong>Sélection :</strong> Utiliser <span class="badge-code">select(item)</span> du slot
      plutôt qu'un handler maison, pour bénéficier de <span class="badge-code">@select</span> et de
      <span class="badge-code">closeOnSelect</span>
    </li>
    <li>
      <strong>Gestion d'erreurs :</strong> Vérifier le statut de la réponse API avant de retourner
      les données
    </li>
    <li>
      <strong>Accessibilité :</strong> Utiliser des clés uniques pour les éléments de la liste
      (propriété <span class="badge-code">:key</span>)
    </li>
    <li>
      <strong>Ouverture externe :</strong> Piloter l'ouverture via
      <span class="badge-code">v-model:open</span> (déclaratif), jamais via une méthode impérative
      sur une ref
    </li>
  </ul>
</template>

<style lang="scss">
.textarea-value {
  white-space: pre-wrap;
}
</style>
