<template>
  <h1 class="h1">Paginator Helper</h1>
  <p>
    Le Paginator Helper fournit des fonctions utilitaires pour gérer la pagination dans les applications.
  </p>
  <h2 class="h2">Installation</h2>
  <p>Ce helper est disponible automatiquement avec Vuemann. Il ne nécessite aucune dépendance externe.</p>
  <h2 class="h2">Importation</h2>
  <div class="div-code">
    import { paginatorHelper } from "@/helpers/paginator-helper.js"
  </div>
  <h2 class="h2">Méthodes disponibles</h2>
  
  <!-- calculTotalPage -->
  <h3 class="h4"><i class="fa-solid fa-diamond mr-5"></i>calculTotalPage</h3>
  <p>
    Permet de calculer le nombre total de pages en fonction du nombre total d'éléments et de la taille des pages.
  </p>
  <h4 class="h4">Paramètres</h4>  
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
        <td>totalItems</td>
        <td>Number</td>
        <td>oui</td>
        <td>
          Le nombre total d'éléments à paginer
        </td>
      </tr>
      <tr>
        <td>size</td>
        <td>Number</td>
        <td>oui</td>
        <td>
          Le nombre d'éléments par page
        </td>
      </tr>
    </tbody>
  </table>
  <h4 class="h4">Retour</h4>  
  <table class="t-default">
    <thead>
      <tr>
        <th>Type</th>
        <th>Description</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>Number</td>
        <td>
          Le nombre total de pages (arrondi à l'entier supérieur)
        </td>
      </tr>
    </tbody>
  </table>
  <h4 class="h4">Exemple</h4>
  <div class="div-code">
    const totalPages = paginatorHelper.calculTotalPage(45, 10)<br />    // Retour: 5 (45 éléments avec 10 par page = 5 pages)<br />    <br />    const totalPages2 = paginatorHelper.calculTotalPage(43, 10)<br />    // Retour: 5 (43 éléments avec 10 par page = 4.3 pages arrondies à 5)
  </div>
  <h2 class="h2">Utilisation pratique</h2>
  <p>
    Cette fonction est particulièrement utile pour les composants de pagination où vous devez afficher 
    le nombre total de pages disponibles.
  </p>
  <div class="div-code">
    <span class="color-green">// Exemple d'utilisation dans un composant Vue (script setup)</span><br />    &lt;script setup&gt;<br />    import { ref, computed } from 'vue'<br />    import { paginatorHelper } from "@/helpers/paginator-helper.js"<br />    <br />    const totalItems = ref(0)<br />    const itemsPerPage = ref(20)<br />    const currentPage = ref(1)<br />    <br />    const totalPages = computed(() => {<br />    &emsp;return paginatorHelper.calculTotalPage(totalItems.value, itemsPerPage.value)<br />    })<br />    &lt;/script&gt;
  </div>
</template>
