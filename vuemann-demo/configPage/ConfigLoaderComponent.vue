<template>
  <h1 class="h1">ConfigLoader</h1>
  <p>
    Cet objet vous permet de gérer les configurations de votre application. Elle est notamenent
    utiliser dans les fichiers <span class="badge-code">main.js</span>.
  </p>
  <h2 class="h2">Méthodes</h2>
  <!-- init -->
  <h3 class="h3"><i class="fa-solid fa-diamond mr-5"></i>init</h3>
  <p>Permet de passer un objet de configuration pour initialiser le ConfigLoader.</p>
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
        <td>configs</td>
        <td>Object</td>
        <th>Required</th>
        <td>Initialise le ConfigLoader avec l'objet passé.</td>
      </tr>
    </tbody>
  </table>
  <!-- set -->
  <h3 class="h3"><i class="fa-solid fa-diamond mr-5"></i>set</h3>
  <p>Permet d'enregistrer ou modifier la valeur d'un configuration.</p>
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
        <td>configName</td>
        <td>string</td>
        <th>Required</th>
        <td>Nom de la configuration</td>
      </tr>
      <tr>
        <td>configValue</td>
        <td>Mixe</td>
        <th>Required</th>
        <td>Valeur de la configuration</td>
      </tr>
    </tbody>
  </table>
  <p>
    Vous pouvez ajouter un point dans <span class="badge-code">ConfigName</span> pour préciser /
    accéder plus facilement à un sous-objet.
  </p>
  <h4 class="h4">Exemple</h4>
  <div class="div-code">
    <span class="color-neutral-600">//Modifier le nom de l'application dans le sous objet app</span>
    <br />
    ConfigLoader.set('app.name', 'app-test')<br /><br />
    <span class="color-neutral-600">//Ajouter une api</span> <br />
    ConfigLoader.set(`apis.${apiName}`, {url : "www.api.fr", status: false, auth: false})
  </div>
  <!-- get -->
  <h3 class="h3"><i class="fa-solid fa-diamond mr-5"></i>get</h3>
  <p>
    Permet de récupérer une configuration en mode strict. Lance une erreur si la clé n'existe pas
    (fail-fast pour détecter les fautes de frappe).
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
        <td>configName</td>
        <td>String</td>
        <td>oui</td>
        <td>
          Nom de la configuration (supporte la notation à points pour les propriétés imbriquées)
        </td>
      </tr>
    </tbody>
  </table>
  <h4 class="h4 color-danger">Retour</h4>
  <p class="mb-10">
    <span class="badge-code">Any</span> : La valeur de la configuration. Lance une
    <span class="badge-code">Error</span> si la clé n'existe pas.
  </p>
  <h4 class="h4">Exemple</h4>
  <div class="div-code">
    <span class="color-neutral-600">//Récupérer le nom de l'application</span> <br />
    ConfigLoader.get('app.name')<br /><br />
    <span class="color-neutral-600">//Lance une erreur si la clé n'existe pas</span> <br />
    ConfigLoader.get('app.missingKey')
    <span class="color-neutral-600">// Error: [ConfigLoader] Key "app.missingKey" not found</span>
  </div>
  <!-- find -->
  <h3 class="h3"><i class="fa-solid fa-diamond mr-5"></i>find</h3>
  <p>
    Permet de récupérer une configuration avec support de valeur par défaut. Retourne
    <span class="badge-code">undefined</span> (ou la valeur par défaut) si la clé n'existe pas.
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
        <td>configName</td>
        <td>String</td>
        <td>oui</td>
        <td>-</td>
        <td>
          Nom de la configuration (supporte la notation à points pour les propriétés imbriquées)
        </td>
      </tr>
      <tr>
        <td>defaultValue</td>
        <td>Any</td>
        <td>non</td>
        <td>undefined</td>
        <td>Valeur par défaut si la configuration n'existe pas</td>
      </tr>
    </tbody>
  </table>
  <h4 class="h4 color-danger">Retour</h4>
  <p class="mb-10">
    <span class="badge-code">Any</span> : La valeur de la configuration ou la valeur par défaut si
    non trouvée
  </p>
  <h4 class="h4">Exemple</h4>
  <div class="div-code">
    <span class="color-neutral-600">//Récupérer l'url d'une api avec valeur par défaut</span> <br />
    ConfigLoader.find(`apis.${apiName}.url`, 'http://default-api.com')<br /><br />
    <span class="color-neutral-600">//Retourne undefined si la clé n'existe pas</span> <br />
    ConfigLoader.find('app.missing') <span class="color-neutral-600">// undefined</span><br /><br />
    <span class="color-neutral-600">//Retourne la valeur par défaut si la clé n'existe pas</span>
    <br />
    ConfigLoader.find('app.missing', null) <span class="color-neutral-600">// null</span>
  </div>
  <!-- has -->
  <h3 class="h3"><i class="fa-solid fa-diamond mr-5"></i>has</h3>
  <p>Vérifie si une clé de configuration existe.</p>
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
        <td>configName</td>
        <td>String</td>
        <td>oui</td>
        <td>
          Nom de la configuration (supporte la notation à points pour les propriétés imbriquées)
        </td>
      </tr>
    </tbody>
  </table>
  <h4 class="h4 color-danger">Retour</h4>
  <p class="mb-10">
    <span class="badge-code">Boolean</span> : <span class="badge-code">true</span> si la clé existe,
    <span class="badge-code">false</span> sinon
  </p>
  <h4 class="h4">Exemple</h4>
  <div class="div-code">
    ConfigLoader.has('app.name') <span class="color-neutral-600">// true</span><br />
    ConfigLoader.has('app.missing') <span class="color-neutral-600">// false</span>
  </div>
  <!-- getAll -->
  <h3 class="h3"><i class="fa-solid fa-diamond mr-5"></i>getAll</h3>
  <p>Permet de récupérer l'ensemble des configurations</p>
  <h4 class="h4 color-danger">Retour</h4>
  <p class="mb-10">
    <span class="badge-code">Object</span> : L'objet contenant toutes les configurations
  </p>
  <h4 class="h4">Exemple</h4>
  <div class="div-code">
    <span class="color-neutral-600">//Récupérer toutes les configurations</span> <br />
    const allConfigs = ConfigLoader.getAll()<br />
    console.log(allConfigs) // { app: {...}, routes: {...}, auth: {...}, ... }
  </div>
</template>
