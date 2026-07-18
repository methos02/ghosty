<template>
  <h1 class="h1">Date Helper</h1>
  <p>
    Le Date Helper fournit un ensemble de fonctions utilitaires pour manipuler et formater les dates
    en utilisant la librairie dayjs.
  </p>
  <h2 class="h2">Installation</h2>
  <p>Ce helper est disponible automatiquement avec Vuemann. Il utilise dayjs comme dépendance.</p>
  <h3 class="h3">Dépendances</h3>
  <ul class="list ml-25">
    <li>dayjs</li>
    <li>dayjs/plugin/customParseFormat.js</li>
    <li>dayjs/plugin/utc.js</li>
  </ul>
  <h2 class="h2">Importation</h2>
  <div class="div-code">import { dateHelper } from "@/helpers/date-helper.js"</div>
  <h2 class="h2">Méthodes disponibles</h2>

  <!-- parseDate -->
  <h3 class="h4"><i class="fa-solid fa-diamond mr-5"></i>parseDate</h3>
  <p>Permet de parser une date selon un format spécifique et de la convertir au format ISO.</p>
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
        <td>date_string</td>
        <td>String</td>
        <td>oui</td>
        <td>La chaîne de caractères représentant la date à parser</td>
      </tr>
      <tr>
        <td>format</td>
        <td>String</td>
        <td>oui</td>
        <td>Le format de la date d'entrée (ex: 'DD/MM/YYYY', 'YYYY-MM-DD')</td>
      </tr>
    </tbody>
  </table>
  <h4 class="h4 color-danger">Retour</h4>
  <p class="mb-10">
    <span class="badge-code">String</span> : Date au format ISO 'YYYY-MM-DD[T]HH:mm:ss[Z]'
  </p>
  <h4 class="h4">Exemple</h4>
  <div class="div-code">
    const parsedDate = dateHelper.parseDate('15/01/2024', 'DD/MM/YYYY')<br />
    // Retour: '2024-01-15T00:00:00Z'
  </div>

  <!-- formatDate -->
  <h3 class="h4"><i class="fa-solid fa-diamond mr-5"></i>formatDate</h3>
  <p>Permet de formater une date selon un format spécifique.</p>
  <h4 class="h4 color-danger">Paramètres</h4>
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
        <td>La chaîne de caractères représentant la date à formater</td>
      </tr>
      <tr>
        <td>format</td>
        <td>String</td>
        <td>non</td>
        <td>'DD/MM/YYYY'</td>
        <td>Le format de sortie souhaité</td>
      </tr>
    </tbody>
  </table>
  <h4 class="h4 color-danger">Retour</h4>
  <p class="mb-10">
    <span class="badge-code">String</span> : Date formatée selon le format spécifié
  </p>
  <h4 class="h4">Exemple</h4>
  <div class="div-code">
    const formattedDate = dateHelper.formatDate('2024-01-15T10:30:00Z', 'DD/MM/YYYY HH:mm')<br />
    // Retour: '15/01/2024 10:30'
  </div>

  <!-- parseDateLocal -->
  <h3 class="h4"><i class="fa-solid fa-diamond mr-5"></i>parseDateLocal</h3>
  <p>
    Identique à parseDate mais sans conversion UTC. La date est parsée dans le fuseau horaire local.
  </p>
  <h4 class="h4 color-danger">Paramètres</h4>
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
        <td>La chaîne de caractères représentant la date à parser</td>
      </tr>
      <tr>
        <td>format</td>
        <td>String</td>
        <td>non</td>
        <td>'DD/MM/YYYY'</td>
        <td>Le format de la date d'entrée</td>
      </tr>
    </tbody>
  </table>
  <h4 class="h4 color-danger">Retour</h4>
  <p class="mb-10">
    <span class="badge-code">String</span> : Date au format ISO avec fuseau horaire local
  </p>
  <h4 class="h4">Exemple</h4>
  <div class="div-code">
    const parsedDate = dateHelper.parseDateLocal('15/01/2024 14:30', 'DD/MM/YYYY HH:mm')<br />
    // Retour: '2024-01-15T14:30:00+01:00' (selon fuseau horaire)
  </div>

  <!-- formatDateLocal -->
  <h3 class="h4"><i class="fa-solid fa-diamond mr-5"></i>formatDateLocal</h3>
  <p>
    Identique à formatDate mais sans conversion UTC. La date est formatée dans le fuseau horaire
    local.
  </p>
  <h4 class="h4 color-danger">Paramètres</h4>
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
        <td>La chaîne de caractères représentant la date à formater</td>
      </tr>
      <tr>
        <td>format</td>
        <td>String</td>
        <td>non</td>
        <td>'DD/MM/YYYY'</td>
        <td>Le format de sortie souhaité</td>
      </tr>
    </tbody>
  </table>
  <h4 class="h4 color-danger">Retour</h4>
  <p class="mb-10">
    <span class="badge-code">String</span> : Date formatée selon le format spécifié dans le fuseau
    horaire local
  </p>
  <h4 class="h4">Exemple</h4>
  <div class="div-code">
    const formattedDate = dateHelper.formatDateLocal('2024-01-15T14:30:00', 'DD/MM/YYYY HH:mm')<br />
    // Retour: '15/01/2024 14:30'
  </div>

  <!-- isBefore -->
  <h3 class="h4"><i class="fa-solid fa-diamond mr-5"></i>isBefore</h3>
  <p>Permet de vérifier si une date est antérieure à une autre.</p>
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
        <td>date1</td>
        <td>String</td>
        <td>oui</td>
        <td>Première date à comparer</td>
      </tr>
      <tr>
        <td>date2</td>
        <td>String</td>
        <td>oui</td>
        <td>Deuxième date à comparer</td>
      </tr>
    </tbody>
  </table>
  <h4 class="h4 color-danger">Retour</h4>
  <p class="mb-10">
    <span class="badge-code">Boolean</span> : true si date1 est antérieure à date2, false sinon
  </p>
  <h4 class="h4">Exemple</h4>
  <div class="div-code">
    const result = dateHelper.isBefore('2024-01-15', '2024-01-20')<br />
    // Retour: true
  </div>

  <!-- isBeforeOrEqual -->
  <h3 class="h4"><i class="fa-solid fa-diamond mr-5"></i>isBeforeOrEqual</h3>
  <p>Permet de vérifier si une date est antérieure ou égale à une autre.</p>
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
        <td>date1</td>
        <td>String</td>
        <td>oui</td>
        <td>Première date à comparer</td>
      </tr>
      <tr>
        <td>date2</td>
        <td>String</td>
        <td>non</td>
        <td>Deuxième date à comparer (par défaut: date actuelle)</td>
      </tr>
    </tbody>
  </table>
  <h4 class="h4 color-danger">Retour</h4>
  <p class="mb-10">
    <span class="badge-code">Boolean</span> : true si date1 est antérieure ou égale à date2, false
    sinon
  </p>
  <h4 class="h4">Exemple</h4>
  <div class="div-code">
    const result = dateHelper.isBeforeOrEqual('2024-01-15', '2024-01-15')<br />
    // Retour: true
  </div>

  <!-- isAfter -->
  <h3 class="h3"><i class="fa-solid fa-diamond mr-5"></i>isAfter</h3>
  <p>Permet de vérifier si une date est postérieure à une autre.</p>
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
        <td>date1</td>
        <td>String</td>
        <td>oui</td>
        <td>Première date à comparer</td>
      </tr>
      <tr>
        <td>date2</td>
        <td>String</td>
        <td>oui</td>
        <td>Deuxième date à comparer</td>
      </tr>
    </tbody>
  </table>
  <h4 class="h4 color-danger">Retour</h4>
  <p class="mb-10">
    <span class="badge-code">Boolean</span> : true si date1 est postérieure à date2, false sinon
  </p>
  <h4 class="h4">Exemple</h4>
  <div class="div-code">
    const result = dateHelper.isAfter('2024-01-20', '2024-01-15')<br />
    // Retour: true
  </div>

  <!-- isAfterOrEqual -->
  <h3 class="h3"><i class="fa-solid fa-diamond mr-5"></i>isAfterOrEqual</h3>
  <p>Permet de vérifier si une date est postérieure ou égale à une autre.</p>
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
        <td>date1</td>
        <td>String</td>
        <td>oui</td>
        <td>Première date à comparer</td>
      </tr>
      <tr>
        <td>date2</td>
        <td>String</td>
        <td>non</td>
        <td>Deuxième date à comparer (par défaut: date actuelle)</td>
      </tr>
    </tbody>
  </table>
  <h4 class="h4 color-danger">Retour</h4>
  <p class="mb-10">
    <span class="badge-code">Boolean</span> : true si date1 est postérieure ou égale à date2, false
    sinon
  </p>
  <h4 class="h4">Exemple</h4>
  <div class="div-code">
    const result = dateHelper.isAfterOrEqual('2024-01-15', '2024-01-15')<br />
    // Retour: true
  </div>

  <!-- isValidDate -->
  <h3 class="h3"><i class="fa-solid fa-diamond mr-5"></i>isValidDate</h3>
  <p>
    Permet de vérifier si une chaîne de caractères correspond à une date valide pour un format
    donné. Cette méthode parse la date, puis la reformate pour vérifier si le résultat correspond à
    la chaîne d'origine.
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
        <td>dateString</td>
        <td>String</td>
        <td>oui</td>
        <td>La chaîne de caractères à valider</td>
      </tr>
      <tr>
        <td>format</td>
        <td>String</td>
        <td>oui</td>
        <td>Le format attendu (ex: 'DD/MM/YYYY')</td>
      </tr>
    </tbody>
  </table>
  <h4 class="h4 color-danger">Retour</h4>
  <p class="mb-10">
    <span class="badge-code">Boolean</span> : true si la date est valide pour le format donné, false
    sinon
  </p>
  <h4 class="h4">Exemple</h4>
  <div class="div-code">
    const isValid = dateHelper.isValidDate('15/01/2024', 'DD/MM/YYYY')<br />
    // Retour: true<br />
    <br />
    const isInvalid = dateHelper.isValidDate('32/13/2024', 'DD/MM/YYYY')<br />
    // Retour: false
  </div>

  <!-- addToDate -->
  <h3 class="h3"><i class="fa-solid fa-diamond mr-5"></i>addToDate</h3>
  <p>
    Permet d'ajouter une quantité (jours, mois, heures, etc.) à une date et de retourner le résultat
    formaté.
  </p>
  <h4 class="h4 color-danger">Paramètres</h4>
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
        <td>dateString</td>
        <td>String</td>
        <td>oui</td>
        <td>-</td>
        <td>La chaîne de caractères représentant la date</td>
      </tr>
      <tr>
        <td>amount</td>
        <td>Number</td>
        <td>oui</td>
        <td>-</td>
        <td>La quantité à ajouter</td>
      </tr>
      <tr>
        <td>unit</td>
        <td>String</td>
        <td>oui</td>
        <td>-</td>
        <td>L'unité de temps (day, week, month, year, hour, minute, second)</td>
      </tr>
      <tr>
        <td>format</td>
        <td>String</td>
        <td>non</td>
        <td>'YYYY-MM-DD'</td>
        <td>Le format de sortie souhaité</td>
      </tr>
    </tbody>
  </table>
  <h4 class="h4 color-danger">Retour</h4>
  <p class="mb-10">
    <span class="badge-code">String</span> : Date résultante formatée selon le format spécifié
  </p>
  <h4 class="h4">Exemple</h4>
  <div class="div-code">
    const nextDay = dateHelper.addToDate('2024-01-15', 1, 'day')<br />
    // Retour: '2024-01-16'<br />
    <br />
    const nextMonth = dateHelper.addToDate('2024-01-15', 2, 'month', 'DD/MM/YYYY')<br />
    // Retour: '15/03/2024'
  </div>

  <!-- subtractFromDate -->
  <h3 class="h3"><i class="fa-solid fa-diamond mr-5"></i>subtractFromDate</h3>
  <p>
    Permet de soustraire une quantité (jours, mois, heures, etc.) d'une date et de retourner le
    résultat formaté.
  </p>
  <h4 class="h4 color-danger">Paramètres</h4>
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
        <td>dateString</td>
        <td>String</td>
        <td>oui</td>
        <td>-</td>
        <td>La chaîne de caractères représentant la date</td>
      </tr>
      <tr>
        <td>amount</td>
        <td>Number</td>
        <td>oui</td>
        <td>-</td>
        <td>La quantité à soustraire</td>
      </tr>
      <tr>
        <td>unit</td>
        <td>String</td>
        <td>oui</td>
        <td>-</td>
        <td>L'unité de temps (day, week, month, year, hour, minute, second)</td>
      </tr>
      <tr>
        <td>format</td>
        <td>String</td>
        <td>non</td>
        <td>'YYYY-MM-DD'</td>
        <td>Le format de sortie souhaité</td>
      </tr>
    </tbody>
  </table>
  <h4 class="h4 color-danger">Retour</h4>
  <p class="mb-10">
    <span class="badge-code">String</span> : Date résultante formatée selon le format spécifié
  </p>
  <h4 class="h4">Exemple</h4>
  <div class="div-code">
    const previousDay = dateHelper.subtractFromDate('2024-01-15', 1, 'day')<br />
    // Retour: '2024-01-14'<br />
    <br />
    const threeHoursAgo = dateHelper.subtractFromDate('2024-01-15T12:00:00', 3, 'hour', 'YYYY-MM-DD
    HH:mm:ss')<br />
    // Retour: '2024-01-15 09:00:00'
  </div>

  <!-- currentDatetime -->
  <h3 class="h3"><i class="fa-solid fa-diamond mr-5"></i>currentDatetime</h3>
  <p>Permet d'obtenir la date et l'heure actuelles au format français.</p>
  <h4 class="h4 color-danger">Retour</h4>
  <p class="mb-10">
    <span class="badge-code">String</span> : Date et heure actuelles au format 'DD/MM/YYYY HH:mm:ss'
  </p>
  <h4 class="h4">Exemple</h4>
  <div class="div-code">
    const now = dateHelper.currentDatetime()<br />
    // Retour: '15/01/2024 14:30:25'
  </div>

  <!-- currentDate -->
  <h3 class="h3"><i class="fa-solid fa-diamond mr-5"></i>currentDate</h3>
  <p>Permet d'obtenir la date actuelle au format souhaité.</p>
  <h4 class="h4 color-danger">Paramètres</h4>
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
        <td>format</td>
        <td>String</td>
        <td>non</td>
        <td>'DD/MM/YYYY'</td>
        <td>Le format de sortie souhaité</td>
      </tr>
    </tbody>
  </table>
  <h4 class="h4 color-danger">Retour</h4>
  <p class="mb-10">
    <span class="badge-code">String</span> : Date actuelle formatée selon le format spécifié
  </p>
  <h4 class="h4">Exemple</h4>
  <div class="div-code">
    const today = dateHelper.currentDate()<br />
    // Retour: '15/01/2024'<br />
    <br />
    const todayISO = dateHelper.currentDate('YYYY-MM-DD')<br />
    // Retour: '2024-01-15'
  </div>
</template>
