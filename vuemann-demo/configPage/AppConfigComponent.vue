<template>
  <h1 class="fs-2rem fw-400 color-primary">Fichier appConfig</h1>
  <p>
    Le fichier <span class="badge-code">app-config.js</span> contient la configuration principale de
    votre application Vuemann. Il définit les paramètres globaux de l'application ainsi que la
    configuration des APIs.
  </p>
  <h2 class="h2">Localisation</h2>
  <p>Le fichier se trouve à <span class="badge-code">src/config/app-config.js</span></p>
  <h2 class="h2">Structure de configuration</h2>
  <div class="div-code">
    export const app = {<br />
    &emsp;homepage_url: "/",<br />
    &emsp;name: 'Vuemann',<br />
    &emsp;ws: true,<br />
    &emsp;auth: true,<br />
    &emsp;apis: {<br />
    &emsp;&emsp;api: {<br />
    &emsp;&emsp;&emsp;url: "www.api.fr/",<br />
    &emsp;&emsp;&emsp;auth: true,<br />
    &emsp;&emsp;&emsp;status: false<br />
    &emsp;&emsp;}<br />
    &emsp;}<br />
    }
  </div>
  <h2 class="h2">Propriétés de configuration</h2>
  <table class="t-default mb-15">
    <thead>
      <tr>
        <th>Propriété</th>
        <th>Type</th>
        <th>Default</th>
        <th>Description</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>homepage_url</td>
        <td>String</td>
        <td>"/"</td>
        <td>URL de la page d'accueil de l'application</td>
      </tr>
      <tr>
        <td>name</td>
        <td>String</td>
        <td>"Vuemann"</td>
        <td>Nom de l'application affiché dans l'interface</td>
      </tr>
      <tr>
        <td>ws</td>
        <td>Boolean</td>
        <td>true</td>
        <td>Active ou désactive le support des WebSockets</td>
      </tr>
      <tr>
        <td>auth</td>
        <td>Boolean</td>
        <td>true</td>
        <td>
          Active ou désactive l'authentification globale de l'application. Peut être contrôlé par la
          variable d'environnement <span class="badge-code">VITE_AUTH</span>
        </td>
      </tr>
      <tr>
        <td>apis</td>
        <td>Object</td>
        <td>{}</td>
        <td>Objet contenant la configuration de toutes les APIs utilisées par l'application</td>
      </tr>
    </tbody>
  </table>
  <h2 class="h2">Configuration des APIs</h2>
  <p>
    Chaque API dans l'objet <span class="badge-code">apis</span> doit avoir la structure suivante :
  </p>
  <table class="t-default mb-15">
    <thead>
      <tr>
        <th>Propriété</th>
        <th>Type</th>
        <th>Required</th>
        <th>Default</th>
        <th>Description</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>url</td>
        <td>String</td>
        <td>oui</td>
        <td>-</td>
        <td>URL de base de l'API</td>
      </tr>
      <tr>
        <td>auth</td>
        <td>Boolean</td>
        <td>non</td>
        <td>false</td>
        <td>Indique si cette API nécessite une authentification</td>
      </tr>
      <tr>
        <td>status</td>
        <td>Boolean</td>
        <td>non</td>
        <td>false</td>
        <td>Active ou désactive la vérification du statut de l'API</td>
      </tr>
    </tbody>
  </table>
  <h2 class="h2">Exemples d'utilisation</h2>
  <h3 class="h3">Configuration de base</h3>
  <div class="div-code mb-15">
    export const app = {<br />
    &emsp;homepage_url: "/dashboard",<br />
    &emsp;name: 'Mon Application',<br />
    &emsp;ws: true,<br />
    &emsp;auth: import.meta.env[`VITE_AUTH`] !== 'false',<br />
    &emsp;apis: {<br />
    &emsp;&emsp;mainApi: {<br />
    &emsp;&emsp;&emsp;url: "https://api.example.com/",<br />
    &emsp;&emsp;&emsp;auth: true,<br />
    &emsp;&emsp;&emsp;status: true<br />
    &emsp;&emsp;},<br />
    &emsp;&emsp;publicApi: {<br />
    &emsp;&emsp;&emsp;url: "https://public-api.example.com/",<br />
    &emsp;&emsp;&emsp;auth: false,<br />
    &emsp;&emsp;&emsp;status: false<br />
    &emsp;&emsp;}<br />
    &emsp;}<br />
    }
  </div>
  <h3 class="h3">Accès à la configuration</h3>
  <p>
    Utilisez
    <router-link
      :to="{ name: 'config.loader' }"
      class="link-underline"
      >ConfigLoader</router-link
    >
    pour accéder aux valeurs de configuration :
  </p>
  <div class="div-code mb-15">
    import { ConfigLoader } from '@brugmann/vuemann/src/config/config-loader.js'<br />
    <br />
    <span class="color-neutral-600">// Récupérer le nom de l'application</span><br />
    const appName = ConfigLoader.get('app.name')<br />
    <br />
    <span class="color-neutral-600">// Récupérer l'URL d'une API</span><br />
    const apiUrl = ConfigLoader.get('app.apis.mainApi.url')<br />
    <br />
    <span class="color-neutral-600">// Vérifier si l'authentification est activée</span><br />
    const authEnabled = ConfigLoader.find('app.auth', true)
  </div>
  <h2 class="h2">Variables d'environnement</h2>
  <p>
    Vous pouvez utiliser les variables d'environnement Vite pour contrôler certains aspects de la
    configuration :
  </p>
  <div class="div-code mb-15">
    <span class="color-neutral-600">// Dans .env</span><br />
    VITE_AUTH=false<br />
    <br />
    <span class="color-neutral-600">// Dans app-config.js</span><br />
    export const app = {<br />
    &emsp;auth: import.meta.env[`VITE_AUTH`] !== 'false'<br />
    }
  </div>
  <h2 class="h2">Relation avec d'autres services</h2>
  <ul class="list ml-25">
    <li>
      <router-link
        :to="{ name: 'services.ajax' }"
        class="link-underline"
        >Service Ajax</router-link
      >
      : Utilise la configuration des APIs pour les requêtes HTTP
    </li>
    <li>
      <router-link
        :to="{ name: 'services.auth' }"
        class="link-underline"
        >Service Auth</router-link
      >
      : Utilise la propriété <span class="badge-code">auth</span> pour activer/désactiver
      l'authentification
    </li>
    <li>
      <router-link
        :to="{ name: 'services.websocket' }"
        class="link-underline"
        >Service WebSocket</router-link
      >
      : Utilise la propriété <span class="badge-code">ws</span> pour activer/désactiver les
      WebSockets
    </li>
    <li>
      <router-link
        :to="{ name: 'services.utils' }"
        class="link-underline"
        >Service Utils (AppComponent)</router-link
      >
      : Utilise la configuration pour la gestion de l'état de l'application
    </li>
  </ul>
</template>
