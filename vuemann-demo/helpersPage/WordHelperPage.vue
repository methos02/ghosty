<template>
  <h1 class="h1">Word Helper</h1>
  <p>
    Le Word Helper fournit un ensemble de fonctions utilitaires pour manipuler et transformer des
    chaînes de caractères (nettoyage, casing, normalisation).
  </p>
  <h2 class="h2">Installation</h2>
  <p>
    Ce helper est disponible automatiquement avec Vuemann. Il ne nécessite aucune dépendance
    externe.
  </p>
  <h2 class="h2">Importation</h2>
  <div class="div-code">import { wordHelper } from "@/helpers/word-helper.js"</div>
  <h2 class="h2">Méthodes disponibles</h2>

  <!-- sanitize -->
  <h3 class="h4"><i class="fa-solid fa-diamond mr-5"></i>sanitize</h3>
  <p>
    Nettoie une chaîne en supprimant les espaces en début/fin et en réduisant les espaces multiples
    internes en un seul espace.
  </p>
  <h4 class="h4 color-danger">Paramètres</h4>
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
        <td>string</td>
        <td>String</td>
        <td>oui</td>
        <td>La chaîne à nettoyer</td>
      </tr>
    </tbody>
  </table>
  <h4 class="h4 color-danger">Retour</h4>
  <p class="mb-10">
    <span class="badge-code">String</span> : Chaîne nettoyée, ou
    <span class="badge-code">''</span> si l'entrée n'est pas une chaîne ou est vide
  </p>
  <h4 class="h4">Exemple</h4>
  <div class="div-code">
    wordHelper.sanitize(' hello world ')<br />
    // Retour: 'hello world'<br />
    <br />
    wordHelper.sanitize(null)<br />
    // Retour: ''
  </div>

  <!-- uppercase -->
  <h3 class="h4"><i class="fa-solid fa-diamond mr-5"></i>uppercase</h3>
  <p>Convertit une chaîne en majuscules. Ne sanitize pas les espaces.</p>
  <h4 class="h4 color-danger">Paramètres</h4>
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
        <td>string</td>
        <td>String</td>
        <td>oui</td>
        <td>La chaîne à convertir</td>
      </tr>
    </tbody>
  </table>
  <h4 class="h4 color-danger">Retour</h4>
  <p class="mb-10">
    <span class="badge-code">String</span> : Chaîne en majuscules, ou
    <span class="badge-code">''</span> si l'entrée n'est pas une chaîne ou est vide
  </p>
  <h4 class="h4">Exemple</h4>
  <div class="div-code">
    wordHelper.uppercase('hello')<br />
    // Retour: 'HELLO'<br />
    <br />
    wordHelper.uppercase(' hello world ')<br />
    // Retour: ' HELLO WORLD '
  </div>

  <!-- capitalize -->
  <h3 class="h4"><i class="fa-solid fa-diamond mr-5"></i>capitalize</h3>
  <p>Met la première lettre en majuscule et le reste en minuscules. Ne sanitize pas les espaces.</p>
  <h4 class="h4 color-danger">Paramètres</h4>
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
        <td>string</td>
        <td>String</td>
        <td>oui</td>
        <td>La chaîne à transformer</td>
      </tr>
    </tbody>
  </table>
  <h4 class="h4 color-danger">Retour</h4>
  <p class="mb-10">
    <span class="badge-code">String</span> : Chaîne avec la première lettre en majuscule, ou
    <span class="badge-code">''</span> si l'entrée n'est pas une chaîne ou est vide
  </p>
  <h4 class="h4">Exemple</h4>
  <div class="div-code">
    wordHelper.capitalize('tEST')<br />
    // Retour: 'Test'<br />
    <br />
    wordHelper.capitalize('a')<br />
    // Retour: 'A'
  </div>

  <!-- upperSanitize -->
  <h3 class="h4"><i class="fa-solid fa-diamond mr-5"></i>upperSanitize</h3>
  <p>
    Nettoie la chaîne (sanitize) puis la convertit en majuscules. Idéal pour les inputs utilisateur
    qui nécessitent un nettoyage + uppercase.
  </p>
  <h4 class="h4 color-danger">Paramètres</h4>
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
        <td>string</td>
        <td>String</td>
        <td>oui</td>
        <td>La chaîne à nettoyer et convertir</td>
      </tr>
    </tbody>
  </table>
  <h4 class="h4 color-danger">Retour</h4>
  <p class="mb-10">
    <span class="badge-code">String</span> : Chaîne nettoyée et en majuscules, ou
    <span class="badge-code">''</span> si l'entrée n'est pas une chaîne ou est vide
  </p>
  <h4 class="h4">Exemple</h4>
  <div class="div-code">
    wordHelper.upperSanitize(' hello world ')<br />
    // Retour: 'HELLO WORLD'<br />
    <br />
    wordHelper.upperSanitize(' Du pont ')<br />
    // Retour: 'DU PONT'
  </div>

  <!-- capiSanitize -->
  <h3 class="h4"><i class="fa-solid fa-diamond mr-5"></i>capiSanitize</h3>
  <p>
    Nettoie la chaîne (sanitize) puis applique capitalize. Idéal pour les inputs utilisateur qui
    nécessitent un nettoyage + capitalize.
  </p>
  <h4 class="h4 color-danger">Paramètres</h4>
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
        <td>string</td>
        <td>String</td>
        <td>oui</td>
        <td>La chaîne à nettoyer et transformer</td>
      </tr>
    </tbody>
  </table>
  <h4 class="h4 color-danger">Retour</h4>
  <p class="mb-10">
    <span class="badge-code">String</span> : Chaîne nettoyée et capitalisée, ou
    <span class="badge-code">''</span> si l'entrée n'est pas une chaîne ou est vide
  </p>
  <h4 class="h4">Exemple</h4>
  <div class="div-code">
    wordHelper.capiSanitize(' hello world ')<br />
    // Retour: 'Hello world'<br />
    <br />
    wordHelper.capiSanitize(' mA RIE ')<br />
    // Retour: 'Ma rie'
  </div>

  <!-- normalize -->
  <h3 class="h4"><i class="fa-solid fa-diamond mr-5"></i>normalize</h3>
  <p>
    Supprime les accents et diacritiques (décomposition NFD) et convertit en minuscules. Utile pour
    les comparaisons et recherches insensibles aux accents.
  </p>
  <h4 class="h4 color-danger">Paramètres</h4>
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
        <td>string</td>
        <td>String</td>
        <td>oui</td>
        <td>La chaîne à normaliser</td>
      </tr>
    </tbody>
  </table>
  <h4 class="h4 color-danger">Retour</h4>
  <p class="mb-10"><span class="badge-code">String</span> : Chaîne sans accents et en minuscules</p>
  <h4 class="h4">Exemple</h4>
  <div class="div-code">
    wordHelper.normalize('Éléphant')<br />
    // Retour: 'elephant'<br />
    <br />
    wordHelper.normalize('ÇaFÉ')<br />
    // Retour: 'cafe'
  </div>

  <h2 class="h2">Utilisation pratique</h2>
  <p>
    Ces fonctions couvrent les besoins de transformation de chaînes dans le contexte d'une
    application :
  </p>
  <ul class="list ml-25">
    <li>
      <strong>sanitize</strong> : Nettoyage d'inputs utilisateur (noms, prénoms) avant envoi à l'API
    </li>
    <li>
      <strong>uppercase / capitalize</strong> : Casing pur, sans nettoyage (données déjà propres)
    </li>
    <li>
      <strong>upperSanitize / capiSanitize</strong> : Nettoyage + casing combinés (inputs
      utilisateur bruts)
    </li>
    <li><strong>normalize</strong> : Recherche et comparaison insensibles aux accents</li>
  </ul>
</template>
