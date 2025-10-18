<script setup>
import UserSearch from '@brugmann/vuemann/src/apis/users/views/UserSearchComponent.vue';
import CodeHtml from '@brugmann/vuemann/src/components/codeHtml/CodeHtmlComponent.vue';
import { ref } from 'vue';

const selectedUsers = ref([]);
const mockUsers = [
  { id: 1, username: 'marpau', fullname: 'MARTIN Paul' },
  { id: 2, username: 'marsop', fullname: 'MARTIN Sophie' },
  { id: 3, username: 'marluc', fullname: 'MARTIN Luc' },
  { id: 4, username: 'marann', fullname: 'MARTIN Anne' },
  { id: 5, username: 'marpie', fullname: 'MARTIN Pierre' },
  { id: 6, username: 'marcla', fullname: 'MARTIN Claire' },
  
  { id: 7, username: 'dubpau', fullname: 'DUBOIS Paul' }
];

const TIMEOUT = 300;
const LIMIT = 20;
const mockUserSearch = async (search, options) => {
  await new Promise(resolve => setTimeout(resolve, TIMEOUT));
  
  const { skip = 0, limit = LIMIT, typeSearch } = options;
  
  const filteredUsers = mockUsers.filter(user => 
    typeSearch === 'username'
      ? user.username.toLowerCase().includes(search.toLowerCase())
      : user.fullname.toLowerCase().includes(search.toLowerCase())
  );
  
  const paginatedUsers = filteredUsers.slice(skip, skip + limit);
  
  const users = paginatedUsers.map(user => ({
    id: user.id,
    username: user.username,
    fullname: user.fullname
  }));
  
  return {
    users,
    paginator: { skip, limit, total: filteredUsers.length }
  };
};
</script>

<template>
  <h1 class="h1">UserSearch Component - API Users</h1>
  <p class="my-10">
    Ce composant permet de rechercher des utilisateurs avec une interface de recherche interactive. 
    Il offre la possibilité de rechercher par nom complet ou nom d'utilisateur, avec pagination infinie 
    et affichage dans un dropdown. Ce composant fait partie de l'API Users de Vuemann.
  </p>

  <h2 class="h2">Propriétés</h2>
  <table class="t-default">
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
        <td>modelValue</td>
        <td>Object</td>
        <td>Oui</td>
        <td>-</td>
        <td>Valeur liée au composant (v-model), contient la liste des utilisateurs trouvés.</td>
      </tr>
      <tr>
        <td>groups</td>
        <td>Boolean</td>
        <td>Non</td>
        <td>false</td>
        <td>Indique si les groupes des utilisateurs doivent être inclus dans la recherche.</td>
      </tr>
      <tr>
        <td>count</td>
        <td>Number</td>
        <td>Non</td>
        <td>undefined</td>
        <td>Nombre maximum d'utilisateurs à retourner.</td>
      </tr>
      <tr>
        <td>callback</td>
        <td>Function</td>
        <td>Non</td>
        <td>undefined</td>
        <td>Fonction de callback personnalisée pour la recherche. Si fournie, elle remplace les appels API par défaut.</td>
      </tr>
    </tbody>
  </table>

  <h2 class="h2">Méthodes exposées</h2>
  <table class="t-default">
    <thead>
      <tr>
        <th>Nom</th>
        <th>Paramètres</th>
        <th>Description</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>toggleDropdown</td>
        <td>state (Boolean)</td>
        <td>Ouvre ou ferme le dropdown des résultats de recherche.</td>
      </tr>
      <tr>
        <td>setSearch</td>
        <td>state (String)</td>
        <td>Définit la valeur de recherche dans le champ.</td>
      </tr>
    </tbody>
  </table>

  <h2 class="h2">Fonctionnalités</h2>
  <ul class="list ml-25">
    <li>Recherche par nom complet ou nom d'utilisateur (bouton switch)</li>
    <li>Pagination infinie pour charger plus de résultats</li>
    <li>Dropdown avec affichage des résultats</li>
    <li>Slot personnalisable pour l'affichage des utilisateurs</li>
    <li>Validation avec pattern regex</li>
    <li>Gestion des erreurs intégrée</li>
    <li>Intégration avec l'API Users backend</li>
  </ul>

  <h2 class="h2">Exemples</h2>
  
  <h3 class="h3">Utilisation de base</h3>
  <div class="my-15">
    <UserSearch v-model="selectedUsers" :callback="mockUserSearch">
      <li 
        v-for="user in selectedUsers" 
        :key="user.id"
        class="p-5 bg-light border-radius-5"
      >
        {{ user.fullname }} ({{ user.username }})
      </li>
    </UserSearch>
  </div>

  <p>
    <i class="fa-solid fa-info-circle color-danger"></i>
    Dans cette page de démonstration, les données utilisateurs sont simulées. 
    Le composant utilise un callback personnalisé pour éviter d'avoir besoin des routes API protégées. Nom de famille disponible: Martin, Dubois.
  </p>

  <h2 class="h2">Code</h2>  
  <h3 class="h3">Utilisation de base</h3>
  <CodeHtml>
    <scriptBalise v-pre>
        import UserSearch from '@brugmann/vuemann/src/apis/users/views/UserSearchComponent.vue';
        import { ref } from 'vue';
        
        const selectedUsers = ref([]);
    </scriptBalise>
    <template v-pre>
      <UserSearch vmodel="selectedUsers">
        <li 
          v-for="user in selectedUsers" 
          :key="user.id"
          class="p-5 bg-light border-radius-5"
        >
          {{ user.fullname }} ({{ user.username }})
        </li>
      </UserSearch>
    </template>
  </CodeHtml>
</template> 
