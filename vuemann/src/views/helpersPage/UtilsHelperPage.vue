<template>
  <h1 class="h1">Utils Helper</h1>
  <p>
    Le Utils Helper fournit un ensemble de fonctions utilitaires diverses pour simplifier les opérations courantes dans votre application.
  </p>
  <h2 class="h2">Installation</h2>
  <p>Ce helper est disponible automatiquement avec Vuemann. Il ne nécessite aucune dépendance externe.</p>
  <h2 class="h2">Importation</h2>
  <div class="div-code">
    import { utilsH } from "@/helpers/utils-helper.js"
  </div>
  <h2 class="h2">Méthodes disponibles</h2>
  
  <!-- getGenreIconClass -->
  <h3 class="h4"><i class="fa-solid fa-diamond mr-5"></i>getGenreIconClass</h3>
  <p>
    Permet d'obtenir la classe d'icône FontAwesome appropriée en fonction du genre d'une personne.
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
        <td>genre</td>
        <td>String</td>
        <td>oui</td>
        <td>
          Le genre de la personne ('M', 'F', ou autre valeur)
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
          Classe FontAwesome correspondante : 'fa-solid fa-mars' (masculin), 'fa-solid fa-venus' (féminin), 'fa-solid fa-neuter' (autre/neutre)
        </td>
      </tr>
    </tbody>
  </table>
  <h4 class="h4">Exemple</h4>
  <div class="div-code">
    const maleIcon = utilsH.getGenreIconClass('M')<br />    // Retour: 'fa-solid fa-mars'<br />    <br />    const femaleIcon = utilsH.getGenreIconClass('F')<br />    // Retour: 'fa-solid fa-venus'<br />    <br />    const neutralIcon = utilsH.getGenreIconClass('X')<br />    // Retour: 'fa-solid fa-neuter'
  </div>

  <!-- isRecursivelyIncluded -->
  <h3 class="h4"><i class="fa-solid fa-diamond mr-5"></i>isRecursivelyIncluded</h3>
  <p>
    Permet de vérifier récursivement si un sous-ensemble d'objet est inclus dans un objet plus large.
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
        <td>subset</td>
        <td>Any</td>
        <td>oui</td>
        <td>
          Le sous-ensemble à rechercher
        </td>
      </tr>
      <tr>
        <td>object</td>
        <td>Any</td>
        <td>oui</td>
        <td>
          L'objet dans lequel rechercher le sous-ensemble
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
          true si le sous-ensemble est inclus dans l'objet, false sinon
        </td>
      </tr>
    </tbody>
  </table>
  <h4 class="h4">Exemple</h4>
  <div class="div-code">
    const subset = { name: 'John', age: 30 }<br />    const object = { name: 'John', age: 30, city: 'Paris' }<br />    <br />    const isIncluded = utilsH.isRecursivelyIncluded(subset, object)<br />    // Retour: true<br />    <br />    const subset2 = { name: 'John', age: 25 }<br />    const isIncluded2 = utilsH.isRecursivelyIncluded(subset2, object)<br />    // Retour: false (âge différent)
  </div>

  <!-- copyObject -->
  <h3 class="h4"><i class="fa-solid fa-diamond mr-5"></i>copyObject</h3>
  <p>
    Permet de créer une copie profonde d'un objet en utilisant structuredClone ou JSON comme fallback.
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
        <td>object</td>
        <td>Object</td>
        <td>oui</td>
        <td>
          L'objet à copier
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
        <td>Object</td>
        <td>
          Une copie profonde de l'objet original
        </td>
      </tr>
    </tbody>
  </table>
  <h4 class="h4">Exemple</h4>
  <div class="div-code">
    const original = { user: { name: 'John', preferences: { theme: 'dark' } } }<br />    const copy = utilsH.copyObject(original)<br />    <br />    copy.user.name = 'Jane'<br />    // L'objet original reste inchangé<br />    console.log(original.user.name) // 'John'<br />    console.log(copy.user.name) // 'Jane'
  </div>

  <!-- percentOf -->
  <h3 class="h4"><i class="fa-solid fa-diamond mr-5"></i>percentOf</h3>
  <p>
    Permet de calculer le pourcentage d'une partie par rapport au total.
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
        <td>part</td>
        <td>Number</td>
        <td>oui</td>
        <td>
          La partie dont on veut calculer le pourcentage
        </td>
      </tr>
      <tr>
        <td>total</td>
        <td>Number</td>
        <td>oui</td>
        <td>
          Le total de référence
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
          Le pourcentage (entre 0 et 100)
        </td>
      </tr>
    </tbody>
  </table>
  <h4 class="h4">Exemple</h4>
  <div class="div-code">
    const percentage = utilsH.percentOf(25, 100)<br />    // Retour: 25 (25% de 100)<br />    <br />    const percentage2 = utilsH.percentOf(30, 120)<br />    // Retour: 25 (30 représente 25% de 120)
  </div>

  <!-- getNestedProperty -->
  <h3 class="h4"><i class="fa-solid fa-diamond mr-5"></i>getNestedProperty</h3>
  <p>
    Permet d'accéder à une propriété imbriquée d'un objet en utilisant une notation à points (dot notation).
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
        <td>object</td>
        <td>Object</td>
        <td>oui</td>
        <td>
          L'objet dans lequel rechercher la propriété
        </td>
      </tr>
      <tr>
        <td>key</td>
        <td>String</td>
        <td>oui</td>
        <td>
          La clé de la propriété à récupérer (supporte la notation à points pour les propriétés imbriquées)
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
        <td>Any</td>
        <td>
          La valeur de la propriété demandée, ou undefined si la propriété n'existe pas
        </td>
      </tr>
    </tbody>
  </table>
  <h4 class="h4">Exemple</h4>
  <div class="div-code">
    const user = {<br />    &nbsp;&nbsp;profile: {<br />    &nbsp;&nbsp;&nbsp;&nbsp;name: 'John',<br />    &nbsp;&nbsp;&nbsp;&nbsp;address: {<br />    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;city: 'Paris',<br />    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;country: 'France'<br />    &nbsp;&nbsp;&nbsp;&nbsp;}<br />    &nbsp;&nbsp;}<br />    }<br />    <br />    const name = utilsH.getNestedProperty(user, 'profile.name')<br />    // Retour: 'John'<br />    <br />    const city = utilsH.getNestedProperty(user, 'profile.address.city')<br />    // Retour: 'Paris'<br />    <br />    const country = utilsH.getNestedProperty(user, 'profile.address.country')<br />    // Retour: 'France'<br />    <br />    const nonExistent = utilsH.getNestedProperty(user, 'profile.age')<br />    // Retour: undefined
  </div>

  <h2 class="h2">Utilisation pratique</h2>
  <p>
    Ces fonctions utilitaires couvrent des besoins récurrents dans le développement d'applications :
  </p>
  <ul class="list ml-25">
    <li><strong>getGenreIconClass</strong> : Affichage d'icônes de genre dans les interfaces utilisateur</li>
    <li><strong>isRecursivelyIncluded</strong> : Validation de données ou filtrage d'objets complexes</li>
    <li><strong>copyObject</strong> : Duplication sûre d'objets pour éviter les mutations accidentelles</li>
    <li><strong>percentOf</strong> : Calculs de pourcentages pour graphiques, barres de progression, etc.</li>
    <li><strong>getNestedProperty</strong> : Accès sécurisé aux propriétés imbriquées d'objets complexes</li>
  </ul>
</template>
