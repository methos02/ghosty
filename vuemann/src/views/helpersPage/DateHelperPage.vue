<template>
  <h1 class="h1">Date Helper</h1>
  <p>
    Le Date Helper fournit un ensemble de fonctions utilitaires pour manipuler et formater les dates en utilisant la librairie dayjs.
  </p>
  <h2 class="h2">Installation</h2>
  <p>Ce helper est disponible automatiquement avec Vuemann. Il utilise dayjs comme dépendance.</p>
  <h3 class="h3">Dépendances</h3>
  <ul class="list ml-25">
    <li>dayjs</li>
    <li>dayjs/plugin/customParseFormat.js</li>
  </ul>
  <h2 class="h2">Importation</h2>
  <div class="div-code">
    import { dateHelper } from "@/helpers/date-helper.js"
  </div>
  <h2 class="h2">Méthodes disponibles</h2>
  
  <!-- parseDate -->
  <h3 class="h4"><i class="fa-solid fa-diamond mr-5"></i>parseDate</h3>
  <p>
    Permet de parser une date selon un format spécifique et de la convertir au format ISO.
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
        <td>date_string</td>
        <td>String</td>
        <td>oui</td>
        <td>
          La chaîne de caractères représentant la date à parser
        </td>
      </tr>
      <tr>
        <td>format</td>
        <td>String</td>
        <td>oui</td>
        <td>
          Le format de la date d'entrée (ex: 'DD/MM/YYYY', 'YYYY-MM-DD')
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
        <td>String</td>
        <td>
          Date au format ISO 'YYYY-MM-DD[T]HH:mm:ss[Z]'
        </td>
      </tr>
    </tbody>
  </table>
  <h4 class="h4">Exemple</h4>
  <div class="div-code">
    const parsedDate = dateHelper.parseDate('15/01/2024', 'DD/MM/YYYY')<br />    // Retour: '2024-01-15T00:00:00Z'
  </div>

  <!-- formatDate -->
  <h3 class="h4"><i class="fa-solid fa-diamond mr-5"></i>formatDate</h3>
  <p>
    Permet de formater une date selon un format spécifique.
  </p>
  <h4 class="h4">Paramètres</h4>  
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
        <td>date_string</td>
        <td>String</td>
        <td>oui</td>
        <td>-</td>
        <td>
          La chaîne de caractères représentant la date à formater
        </td>
      </tr>
      <tr>
        <td>format</td>
        <td>String</td>
        <td>non</td>
        <td>'DD/MM/YYYY'</td>
        <td>
          Le format de sortie souhaité
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
        <td>String</td>
        <td>
          Date formatée selon le format spécifié
        </td>
      </tr>
    </tbody>
  </table>
  <h4 class="h4">Exemple</h4>
  <div class="div-code">
    const formattedDate = dateHelper.formatDate('2024-01-15T10:30:00Z', 'DD/MM/YYYY HH:mm')<br />    // Retour: '15/01/2024 10:30'
  </div>

  <!-- isBefore -->
  <h3 class="h4"><i class="fa-solid fa-diamond mr-5"></i>isBefore</h3>
  <p>
    Permet de vérifier si une date est antérieure à une autre.
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
        <td>date1</td>
        <td>String</td>
        <td>oui</td>
        <td>
          Première date à comparer
        </td>
      </tr>
      <tr>
        <td>date2</td>
        <td>String</td>
        <td>oui</td>
        <td>
          Deuxième date à comparer
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
        <td>Boolean</td>
        <td>
          true si date1 est antérieure à date2, false sinon
        </td>
      </tr>
    </tbody>
  </table>
  <h4 class="h4">Exemple</h4>
  <div class="div-code">
    const result = dateHelper.isBefore('2024-01-15', '2024-01-20')<br />    // Retour: true
  </div>

  <!-- isAfter -->
  <h3 class="h3"><i class="fa-solid fa-diamond mr-5"></i>isAfter</h3>
  <p>
    Permet de vérifier si une date est postérieure à une autre.
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
        <td>date1</td>
        <td>String</td>
        <td>oui</td>
        <td>
          Première date à comparer
        </td>
      </tr>
      <tr>
        <td>date2</td>
        <td>String</td>
        <td>oui</td>
        <td>
          Deuxième date à comparer
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
        <td>Boolean</td>
        <td>
          true si date1 est postérieure à date2, false sinon
        </td>
      </tr>
    </tbody>
  </table>
  <h4 class="h4">Exemple</h4>
  <div class="div-code">
    const result = dateHelper.isAfter('2024-01-20', '2024-01-15')<br />    // Retour: true
  </div>

  <!-- currentDatetime -->
  <h3 class="h3"><i class="fa-solid fa-diamond mr-5"></i>currentDatetime</h3>
  <p>
    Permet d'obtenir la date et l'heure actuelles au format français.
  </p>
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
        <td>String</td>
        <td>
          Date et heure actuelles au format 'DD/MM/YYYY HH:mm:ss'
        </td>
      </tr>
    </tbody>
  </table>
  <h4 class="h4">Exemple</h4>
  <div class="div-code">
    const now = dateHelper.currentDatetime()<br />    // Retour: '15/01/2024 14:30:25'
  </div>

  <!-- currentDate -->
  <h3 class="h3"><i class="fa-solid fa-diamond mr-5"></i>currentDate</h3>
  <p>
    Permet d'obtenir la date actuelle au format français.
  </p>
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
        <td>String</td>
        <td>
          Date actuelle au format 'DD/MM/YYYY'
        </td>
      </tr>
    </tbody>
  </table>
  <h4 class="h4">Exemple</h4>
  <div class="div-code">
    const today = dateHelper.currentDate()<br />    // Retour: '15/01/2024'
  </div>
</template>
