<script setup>
import { ref } from "vue";
import CodeHtml from "@brugmann/vuemann/src/components/codeHtml/CodeHtmlComponent.vue"
import InputSearch from "@brugmann/vuemann/src/services/form/views/inputs/InputSearchComponent.vue";

const animals = ['chat', 'chien', 'lapin', 'vache', 'cheval', 'poney', 'cochon', 'renard']
const result = ref([])
const callback = value => {
    const animalsFiltered = animals.filter(animal => animal.startsWith(value))
    result.value = animalsFiltered
    return result.value
}
</script>

<template>
  <h1 class="h1">Input Search Component</h1>
  <p>
    Ce component permet d'exécuter une fonction de recherche à chaque frappe de clavier. 
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
        <td>placeholder</td>
        <td>String</td>
        <td>-</td>
        <td>null</td>
        <td>Placeholder de l'input.</td>
      </tr>
      <tr>
        <td>cb</td>
        <td>Function</td>
        <td>oui</td>
        <td>-</td>
        <td>Fonction de recherche a exécuter</td>
      </tr>
      <tr>
        <td>pattern</td>
        <td>Regexp</td>
        <td>-</td>
        <td>null</td>
        <td>
          Permet de ne pas activer la fonction de recherche si la touche pressée ne correspond 
          à la regexp.
        </td>
      </tr>
      <tr>
        <td>displayError</td>
        <td>Boolean</td>
        <td>-</td>
        <td>true</td>
        <td>Afficher ou non les erreurs de validation.</td>
      </tr>
      <tr>
        <td>noResult</td>
        <td>String</td>
        <td>-</td>
        <td>null</td>
        <td>Message à afficher lorsqu'aucun résultat n'est trouvé dans le dropdown.</td>
      </tr>
    </tbody>
  </table>
  
  <h2 class="h2">Méthodes</h2>
  
  <h3 class="h3">runCallBack</h3>
  <p>Permet d'exécuter le callback fourni au component.</p>
  
  <h3 class="h3">toggleDropdown</h3>
  <p>Permet d'ouvrir / fermer le dropdown. Si aucun état n'est passé en paramètre, la fonction va inverser l'état du dropdown.</p>
  <table class="t-default">
      <thead>
          <tr>
              <th>Nom</th>
              <th>Type</th>
              <th>Required</th>
              <th>Description</th>
          </tr>
      </thead>
      <tbody>
          <tr>
              <td>state</td>
              <td>Boolean</td>
              <th>-</th>
              <td>True pour afficher et False pour le masquer</td>
          </tr>
      </tbody>
  </table>
  
  <h3 class="h3">setItems</h3>
  <p>Permet de modifier la valeur d'items.</p>
  <table class="t-default">
    <thead>
      <tr>
        <th>Nom</th>
        <th>Type</th>
        <th>Required</th>
        <th>Description</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>value</td>
        <td>Mix</td>
        <th>oui</th>
        <td>Valeur que prendre la variable items.</td>
      </tr>
    </tbody>
  </table>
  
  <h3 class="h3">setSearch</h3>
  <p>Permet de modifier la valeur de la recherche.</p>
  <table class="t-default">
    <thead>
      <tr>
        <th>Nom</th>
        <th>Type</th>
        <th>Required</th>
        <th>Description</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>value</td>
        <td>Mix</td>
        <th>oui</th>
        <td>Valeur que prendre la variable search.</td>
      </tr>
    </tbody>
  </table>
  
  <h3 class="h3">focus</h3>
  <p>Permet de focus l'input du component.</p>
  
  <h2 class="h2">Slot Template</h2>
  <p>
    Le component expose un slot par défaut qui permet d'accéder aux résultats de recherche via la variable <span class="badge-code">items</span>.
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
        <td>Tableau des résultats retournés par la fonction de recherche</td>
      </tr>
    </tbody>
  </table>
  <p>
    <strong>Note :</strong> Vous pouvez renommer la variable <span class="badge-code">items</span> lors de l'utilisation du slot : 
    <span class="badge-code">v-slot:default="{ items : maVariable }"</span>
  </p>
  
  <h2 class="h2">Exemples</h2>
  
  <h3 class="h3">Input search classique</h3>
  <p>Recherche possible : {{ animals }}</p>
  <InputSearch name="search" :cb="callback" label="Recherche" />
  <p>Éléments trouvés : {{ result }}</p>
  
  <h3 class="h3">Input search avec Dropdown</h3>
  <p>
    Vous avez la possibilité d'afficher les résultats dans un dropdown. Pour cela votre fonction de recherche doit retourner 
    les résultats trouvés. Ces résultats seront automatiquement accessibles via le template slot.
  </p>
  <p>
    <strong>Important :</strong> La fonction de recherche doit retourner un tableau de résultats. Si aucun résultat n'est trouvé, 
    retournez un tableau vide <span class="badge-code">[]</span>.
  </p>
  <InputSearch name="search_dropdown" :cb="callback" label="Recherche">
    <template v-slot:default="{ items : datas  }">
      <ul class="services-list | f-column g-5 my-5">
        <li
          v-for="data in datas"
          :key="data"
          class="px-15"
        >
          {{ data }}
        </li>
      </ul>
    </template>
  </InputSearch>
  
  <h3 class="h3">Exemple avec API et gestion d'erreurs</h3>
  <p>
    Voici un exemple plus complet avec une recherche via API, gestion des erreurs et affichage du nombre de résultats :
  </p>
  <CodeHtml>
    <scriptBalise v-pre>
      const interventionSearch = async () => {
        const result = await OperaController.interventionSearch({
          search: searchIntervention.value, 
          speciality_id: hospitalizationDatas.value.speciality.id
        })
        if(result.status !== STATUS.SUCCESS) { 
          return []
        }
        return result.interventions  
      }
    </scriptBalise>
    <template v-pre>
      <InputSearch    
        :label="t('request-create-form-chir-component.search-intervention-label')"
        name="reason"
        ref="inputSearchIntervention"
        :modelValue="searchIntervention"
        :cb="interventionSearch"
        :displayError="false"
        noResult="request-create-form-chir-component.search-intervention-no-result"
      >
        <template v-slot:default="{ items : interventions  }">
          <p data-total class="result-total | ml-10 fw-700 color-primary-300">
            {{ t(interventions.length > 1 ? 'request-create-form-chir-component.search-interventions-total' : 'request-create-form-chir-component.search-intervention-result', { total: interventions.length }) }}
          </p>
          <ul class="interventions-results | f-column g-5 my-5">
            <li 
              v-for="intervention in interventions" 
              :key="intervention"
              class="pointer bg-primary-100-hover px-10"
              v-on:click="selectIntervention(intervention)"
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
      import InputSearch from "@brugmann/vuemann/src/services/form/views/inputs/InputSearchComponent.vue"; 
    </scriptBalise>
    <template v-pre>
      <InputSearch name="search" :cb="callback"/>
    </template>
  </CodeHtml>
  <!-- eslint-enable -->
  
  <h3 class="h3">Personnalisation</h3>
  <p>
    Vous pouvez personnaliser la variable items fourni par le component de la façon suivante <span class="badge-code">v-slot:default="{ items : animals }"</span>
  </p>
  
  <h3 class="h3">Bonnes pratiques</h3>
  <ul>
    <li>
      <strong>Fonction de recherche :</strong> Toujours retourner un tableau, même vide <span class="badge-code">[]</span> en cas d'erreur ou d'absence de résultats
    </li>
    <li>
      <strong>Gestion d'erreurs :</strong> Vérifier le statut de la réponse API avant de retourner les données
    </li>
    <li>
      <strong>Performance :</strong> Implémenter un debounce dans votre fonction de recherche pour éviter trop d'appels API
    </li>
    <li>
      <strong>Accessibilité :</strong> Utiliser des clés uniques pour les éléments de la liste (propriété <span class="badge-code">:key</span>)
    </li>
    <li>
      <strong>UX :</strong> Afficher le nombre de résultats trouvés et un message quand aucun résultat n'est disponible
    </li>
  </ul>
</template>

<style lang="scss">
.textarea-value {
    white-space: pre-wrap
}
</style>
