<template>
  <h1 class="h1">ConfigLoader</h1>
  <p>
    Cet objet vous permet de gérer les configurations de votre application. Elle est notamenent utiliser 
    dans les fichiers <span class="badge-code">main.js</span>.
  </p>
  <h2 class="h2">Méthodes</h2>
  <!-- init -->
  <h3 class="h3"><i class="fa-solid fa-diamond mr-5"></i>init</h3>
  <p>
      Permet de passer un objet de configuration pour initialiser le ConfigLoader.
  </p>
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
              <td>
                  Initialise le ConfigLoader avec l'objet passé.
              </td>
          </tr>
      </tbody>
  </table>
  <!-- set -->
  <h3 class="h3"><i class="fa-solid fa-diamond mr-5"></i>set</h3>
  <p>
      Permet d'enregistrer ou modifier la valeur d'un  configuration.
  </p>
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
              <td>
                  Nom de la configuration
              </td>
          </tr>
          <tr>
              <td>configValue</td>
              <td>Mixe</td>
              <th>Required</th>
              <td>
                  Valeur de la configuration
              </td>
          </tr>
      </tbody>
  </table>
  <p>
    Vous pouvez ajouter un point dans <span class="badge-code">ConfigName</span> pour préciser / accéder plus facilement à un sous-objet.
  </p>
  <h4 class="h4">Exemple</h4>
  <div class="div-code">
    <span class="color-neutral-600">//Modifier le nom de l'application dans le sous objet app</span> <br />
    ConfigLoader.set('app.name', 'app-test')<br /><br />
    <span class="color-neutral-600">//Ajouter une api</span> <br />
    ConfigLoader.set(`apis.${apiName}`, {url : "www.api.fr", status: false, auth: false})
  </div>
  <!-- get -->
  <h3 class="h3"><i class="fa-solid fa-diamond mr-5"></i>get</h3>
  <p>
      Permet de récupérer une configuration
  </p>
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
              <td>
                  Nom de la configuration
              </td>
          </tr>
      </tbody>
  </table>
  <p>
    Comme pour get, vous pouvez récupérer la valeur dans un sous objet en ajoutant un point.
  </p>
  <h4 class="h4">Exemple</h4>
  <div class="div-code">
    <span class="color-neutral-600">//Récupéré le nom de l'application</span> <br />
    ConfigLoader.set('app.name'')<br /><br />
    <span class="color-neutral-600">//Récupéré l'url d'une api contenu dans une variable</span> <br />
    ConfigLoader.set(`apis.${apiName}.url`)
  </div>
  <!-- getAll -->
  <h3 class="h3"><i class="fa-solid fa-diamond mr-5"></i>getAll</h3>
  <p>
      Permet de récupérer l'ensemble des configurations
  </p>
</template>
