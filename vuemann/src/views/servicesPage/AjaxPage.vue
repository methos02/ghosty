<template>
  <h1 class="h1">Service Ajax</h1>
  <p>
    Permet de réaliser des requêtes ajax de type get, post, put, patch, delete
  </p>
  <h2 class="h2">Installation</h2>
  <ul class="list ml-25">
    <li>Importer ajaxService dans l'objet services situé dans le fichier <span class="badge-code">main.js</span>.
    </li>
  </ul>
  <h3 class="h3">Dépendances</h3>
  <p>Ce service est dépedants des services :</p>
  <ul class="list ml-25">
    <li>flash - methode error</li>
    <li>locale - methode t</li>
    <li>auth - methodes refreshToken et getAccessToken</li>
  </ul>
  <h2 class="h2">Fonctionnement des routes</h2>
  <h3 class="h3">Définition des urls des apis</h3>
  <p>
    Le fonctionnement de VueJs fait qu'il n'est pas possible d'utiliser des variables d'environnement directement depuis 
    le fichier <span class="badge-code">.env</span>. Il est nécessaire d'utiliser la fonction 
    <span class="badge-code">import.meta.env</span> pour que viteJs puisse les injecter au moment de la compilation.
  </p>
  <h4 class="fs-500 fw-400 color-primary">
    .env
  </h4>
  <div class="div-code">
    VITE_API_PATIENT_URL = "http://localhost:3001/"
  </div>
  <h4 class="fs-500 fw-400 color-primary">
    config/env.js
  </h4>
  <p>
    Dans la partie apis, vous devez ajouter le nom de l'api avec sont url:
  </p>
  <div class="div-code">
    export const app = { <br />      &emsp;homepage_url : "/", <br />      &emsp;apis : {<br />      &emsp;&emsp;patient : {<br />      &emsp;&emsp;&emsp;url : import.meta.env[`VITE_API_PATIENT_URL`],<br />      &emsp;&emsp;}<br />      &emsp;}<br />    }
  </div>
  <p>
    Il est important de respecter la nomenclature de la variable d'environnement<span class="badge-code">VITE_API_{nom de l'api}_URL</span>.  
    Cela a son importance pour l'import des variable d'environnement par vitejs.
  </p>
  <h3 class="h3">Définition des routes d'api</h3>
  <p>
    Le fichier <span class="badge-code">config/routesApi.json</span> reprend l'ensemble des routes api de l'application.
    Une route doit être définie comme dans l'exemple ci-dessous.
  </p>
  <h4 class="h4">Paramètres de la route</h4>
  <table class="t-default">
    <thead>
      <tr>
        <th>Nom</th>
        <th>Description</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>url</td>
        <td>
          Url correspondant à la route.
        </td>
      </tr>
      <tr>
        <td>api</td>
        <td>
          Nom de l'api pour laquelle il faut éxécuter cette route. Se réfère à la clé apis dans le fichier app-config.js
        </td>
      </tr>
      <tr>
        <td>method</td>
        <td>
          Méthode de la route (get, post, put ou delete)
        </td>
      </tr>
    </tbody>
  </table>
  <div class="div-code">
    // exemple<br />    {<br />    &emsp;"patients.index" : {"url": "v1/patients", "method" : "get", "api": "patient"},<br />    }
  </div>
  <h4 class="h4">Paramètres dynamiques</h4>
  <p>
    Pour spécifier qu'une partie de l'url est dynamique, vous devais la mettre entre crochets <span class="badge-code">{}</span>.
  </p>
  <div class="div-code">
    // exemple<br />    {<br />    &emsp;"patients.update" : {"url": "v1/patients/{id}", "method" : "put", "api": "patient"},<br />    }
  </div>
  <p>
    Dans l'exemple si dessus la partie <span class="badge-code">id</span> est dynamique.
  </p>
  <h4 class="h4">Routes Globales</h4>
  <p>
    Dans le fichier <span class="badge-route">routeApi.js</span> du template <a class="underline link-underline" href="https://gitmann.chu-brugmann.be/apps/chu-brugmann-vue-template" target="_blank">chu-brugmann-vue-template</a>,
    vous pouvez voir la clé global. Elle reprend toutes les routes communes aux apis du chu-brugmann. Ces routes sont 
    principalement utilisées par les services.
  </p>
  <div class="div-code">
    <span class="color-neutral-500">// exemple</span><br />    {<br />    &emsp;global : {<br />    &emsp;&emsp;"api.status": {"url": "", "method" : "get"},<br />    &emsp;}<br />    }
  </div>
  <p>
    L'exemple ci-dessus permet de vérifier qu'une api est up et si elle est en prod ou en dev. A noter que les routes 
    globales ne possèdent pas la clé <span class="badge-code">api</span>.
  </p>
  <h4 class="h4">Écraser des routes Globales</h4>
  <p>
    Vous avez la possibilité dans le cas ou l'api que vous voulez utiliser n'utilise pas une route standart, écraser la route globale.
    Pour cela ajouter le nom de l'api au nom de la route globale.
  </p>
  <div class="div-code">
    <span class="color-neutral-500">// exemple</span><br />    {<br />    &emsp;global : {<br />    &emsp;&emsp;"api.status": {"url": "", "method" : "get"},<br />    &emsp;},<br />    &emsp;"patient.api.status": {"url": "v1/status", "method" : "get", "api": "patient"},<br />    }
  </div>
  <p>Dans l'exemple ci dessous, lorsque le service dédié vérifira l'état de l'api patient, l'url de la requête utilisé 
    sera <span class="badge-code">v1/status</span> et pas <span class="badge-code">/</span>
  </p>
  <h2 class="h2">Fonctions accessibles depuis le gestionnaire de service</h2>
  <!-- req -->
  <h3 class="h3"><i class="fa-solid fa-diamond mr-5"></i>req</h3>
  <p>
    Permet d'effectuer une requête ajax. La méthode de la requête sera réalisée en fonction de la définition de la route.
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
        <td>route_name</td>
        <td>String</td>
        <td>oui</td>
        <td>-</td>
        <td>
          nom de la route repris dans le fichier <span class="badge-code">config/routeApi.json</span>
        </td>
      </tr>
      <tr>
        <td>datas</td>
        <td>Object</td>
        <td>-</td>
        <td>{}</td>
        <td>
          Pour les méthodes de type post, put et patch, ce paramètre correspond aux datas envoyées lors de la requête.<br />          
          <i class="fa-solid fa-triangle-exclamation color-danger mr-5"></i>
          Pour les méthodes get et delete, le paramètre datas correspond au paramètre options.
          <i class="fa-solid fa-triangle-exclamation color-danger ml-5"></i>
        </td>
      </tr>
      <tr>
        <td>options</td>
        <td>Object</td>
        <td>-</td>
        <td>{}</td>
        <td>
          Options de la requête, utilisé uniquement pour les méthodes de type post, put et patch.
        </td>
      </tr>
    </tbody>
  </table>
  <h4 class="h4">Options possibles</h4>  
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
        <td>params</td>
        <td>Bool</td>
        <td>-</td>
        <td>false</td>
        <td>
          Permet de préciser les paramètres dynamique de la requête. L'objet est composé de clé / valeur.<br />          Si une clé n'est pas présente dans la définition de l'url de la route, elle sera ajoutée en paramètre GET.
        </td>
      </tr>
      <tr>
        <td>token</td>
        <td>String</td>
        <td>-</td>
        <td></td>
        <td>
          Permet de préciser un token bearer. Il sera utilisé plustôt que le token bearer de l'api.
        </td>
      </tr>
      <tr>
        <td>abort</td>
        <td>Bool</td>
        <td>-</td>
        <td>false</td>
        <td>
          Permet d'interrompre la requête si elle est lancée deux fois d'affilée.
        </td>
      </tr>
      <tr>
        <td>flash</td>
        <td>Bool</td>
        <td>-</td>
        <td>false</td>
        <td>
          Permet de ne pas afficher les erreurs rencontrées via le service flash.
        </td>
      </tr>
      <tr>
        <td>headers</td>
        <td>Object</td>
        <td>-</td>
        <td>{}</td>
        <td>
          Permet de rajouter des headers à la requête. L'objet est composé de clé / valeur.
        </td>
      </tr>
      <tr>
        <td>log</td>
        <td>Bool</td>
        <td>-</td>
        <td>true</td>
        <td>
          Permet de ne pas envoyer les logs au serveur de log.
        </td>
      </tr>
      <tr>
        <td>empty404</td>
        <td>Bool</td>
        <td>-</td>
        <td>false</td>
        <td>
          Permet de traiter les erreurs 404 comme des résultats vides. Retourne un tableau vide avec un statut 200 au lieu d'une erreur 404. Utile pour les recherches qui peuvent ne retourner aucun résultat.
        </td>
      </tr>
    </tbody>
  </table>
  <h4 class="h4">Utilisation</h4>
  <div class="div-code">
    import { servicesM } from "@brugmann/vuemann/src/services/services-manager.js"<br />    <br />    servicesM.service('ajax:req', ['users.show', {params: {id: 1}}])<br />    <br />    <span class="color-neutral-500">// Exemple avec empty404 pour les recherches</span><br />    servicesM.service('ajax:req', ['users.search', {params: {query: 'john'}}, {empty404: true}])
  </div>
  <!-- generateUrlFromRoute -->
  <h3 class="h3"><i class="fa-solid fa-diamond mr-5"></i>generateUrlFromRoute</h3>
  <p>
    Permet de générer une url à partir d'un nom de route et de paramètres.
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
        <td>route_name</td>
        <td>String</td>
        <td>oui</td>
        <td>-</td>
        <td>
          Nom de la route
        </td>
      </tr>
      <tr>
        <td>params</td>
        <td>Object</td>
        <td>-</td>
        <td>{}</td>
        <td>
          Paramêtres de la route clé / valeur.
        </td>
      </tr>
    </tbody>
  </table>
  <h4 class="h4">Utilisation</h4>
  <div class="div-code">
    import { servicesM } from "@brugmann/vuemann/src/services/services-manager.js"<br />    <br />    servicesM.service('ajax:generateUrlFromRoute', ['users.show', {id: 1}])
  </div>
  <h2 class="h2">Raccourcis disponibles</h2>
  <p>
    Ces fonctions sont des raccourcis vers les services Ajax. Elles permettent d'utiliser les fonctionnalités Ajax de manière simplifiée.
  </p>
  
  <!-- req -->
  <h3 class="h3"><i class="fa-solid fa-diamond mr-5"></i>req</h3>
  <p>
    Raccourci vers le service <span class="badge-code">ajax:req</span>. Permet d'effectuer une requête ajax.
  </p> 
  <div class="div-code">
    <span class="color-neutral-500">//appel via le service manager</span><br />
    import { servicesM } from "@brugmann/vuemann/src/services/services-manager.js"<br />
    <br />
    servicesM.service('ajax:req', ['users.show', {params: {id: 1}}])<br />
    <br />
    <span class="color-neutral-500">//appel avec le raccourci </span><br />   
    import { req } from "@brugmann/vuemann/src/services/services-helper.js"<br />
    <br />          
    req('users.show', {params: {id: 1}})<br />
    <br />
    <span class="color-neutral-500">// Exemple avec empty404 pour les recherches</span><br />
    req('users.search', {params: {query: 'john'}}, {empty404: true})<br />
  </div>
  
  <!-- Route Helper -->
  <h3 class="h3"><i class="fa-solid fa-diamond mr-5"></i>route</h3>
  <p>
    Raccourci vers les services router. Permet d'accéder aux informations de la route courante.
  </p>
  <h4 class="h4">Méthodes disponibles</h4>
  <table class="t-default">
    <thead>
      <tr>
        <th>Méthode</th>
        <th>Paramètres</th>
        <th>Retour</th>
        <th>Description</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>current()</td>
        <td>-</td>
        <td>Object</td>
        <td>
          Retourne l'objet de la route courante avec ses propriétés (name, params, etc.)
        </td>
      </tr>
      <tr>
        <td>get(param_name)</td>
        <td>String</td>
        <td>String</td>
        <td>
          Récupère la valeur d'un paramètre de la route courante
        </td>
      </tr>
      <tr>
        <td>has(param_name)</td>
        <td>String</td>
        <td>Boolean</td>
        <td>
          Vérifie si un paramètre existe dans la route courante
        </td>
      </tr>
    </tbody>
  </table>
  <h4 class="h4">utilisation</h4>
  <div class="div-code">
    <span class="color-neutral-500">//appel via le service manager</span><br />
    import { servicesM } from "@brugmann/vuemann/src/services/services-manager.js"<br />
    <br />
    servicesM.service('router:currentRoute')<br />
    servicesM.service('router:getCurrentRouteParam', ['id'])<br />
    servicesM.service('router:hasCurrentRouteParam', ['id'])<br />
    <br />
    <span class="color-neutral-500">//appel avec le raccourci </span><br />   
    import { route } from "@brugmann/vuemann/src/services/services-helper.js"<br />
    <br />          
    route.current()<br />
    route.get('id')<br />
    route.has('id')<br />
  </div>

  <!-- URL Helper -->
  <h3 class="h3"><i class="fa-solid fa-diamond mr-5"></i>url</h3>
  <p>
    Raccourci vers les services Ajax. Permet de générer des URLs complètes ou des sous-répertoires à partir des routes définies.
  </p>
  <h4 class="h4">Méthodes disponibles</h4>
  <table class="t-default">
    <thead>
      <tr>
        <th>Méthode</th>
        <th>Paramètres</th>
        <th>Retour</th>
        <th>Description</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>generateUrl(route_name, params, api)</td>
        <td>String, Object, String</td>
        <td>String</td>
        <td>
          Génère une URL complète (API + sous-répertoire) à partir d'une route
        </td>
      </tr>
      <tr>
        <td>generateSubdirectory(route_name, params)</td>
        <td>String, Object</td>
        <td>String</td>
        <td>
          Génère uniquement le sous-répertoire de l'URL (sans l'URL de l'API)
        </td>
      </tr>
    </tbody>
  </table>
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
        <td>route_name</td>
        <td>String</td>
        <td>oui</td>
        <td>-</td>
        <td>
          Nom de la route définie dans <span class="badge-code">config/routes-api-config.js</span>
        </td>
      </tr>
      <tr>
        <td>params</td>
        <td>Object</td>
        <td>-</td>
        <td>{}</td>
        <td>
          Paramètres dynamiques de la route (clé/valeur)
        </td>
      </tr>
      <tr>
        <td>api</td>
        <td>String</td>
        <td>-</td>
        <td>undefined</td>
        <td>
          Nom de l'API à utiliser (pour les routes globales)
        </td>
      </tr>
    </tbody>
  </table>
  <h4 class="h4">utilisation</h4>
  <div class="div-code">
    <span class="color-neutral-500">//appel via le service manager</span><br />
    import { servicesM } from "@brugmann/vuemann/src/services/services-manager.js"<br />
    <br />
    servicesM.service('ajax:generateUrlFromRouteName', ['user.show', {id: 123}, 'api'])<br />
    servicesM.service('ajax:generateSubdirectoryFromRouteName', ['user.show', {id: 123}])<br />
    <br />
    <span class="color-neutral-500">//appel avec le raccourci </span><br />   
    import { url } from "@brugmann/vuemann/src/services/services-helper.js"<br />
    <br />          
    url.generateUrl('user.show', { id: 123 }, 'api')<br />
    url.generateSubdirectory('user.show', { id: 123 })<br />
  </div>

  <h2 class="h2">AjaxHelpers</h2>
  <p>
    Les helpers AJAX fournissent des utilitaires pour faciliter la gestion des requêtes et des réponses.
  </p>
  <h3 class="h3"><i class="fa-solid fa-diamond mr-5"></i>isAuthError</h3>
  <h4 class="h4">Méthodes disponibles</h4>
  <table class="t-default">
    <thead>
      <tr>
        <th>Paramètre</th>
        <th>Retour</th>
        <th>Description</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>status (Number)</td>
        <td>Boolean</td>
        <td>
          Vérifie si un statut HTTP correspond à une erreur d'authentification (401 Unauthorized ou 403 Forbidden).
          Utile pour différencier les erreurs d'auth des autres erreurs dans la gestion des réponses.
        </td>
      </tr>
    </tbody>
  </table>
     <h4 class="h4">Utilisation</h4>
   <div class="div-code">
      import { AjaxHelpers } from "@brugmann/vuemann/src/services/ajax/ajax-helpers.js"
      <br /><br />
      // Vérifier si une erreur est liée à l'authentification<br />
      if (AjaxHelpers.isAuthError(response.status)) {<br />
      &emsp;// Gérer l'erreur d'authentification (redirection vers login, etc.)<br />
      }
   </div>

  <h3 class="h3"><i class="fa-solid fa-diamond mr-5"></i>isSuccess</h3>
  <h4 class="h4">Méthodes disponibles</h4>
  <table class="t-default">
    <thead>
      <tr>
        <th>Paramètre</th>
        <th>Retour</th>
        <th>Description</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>status (Number)</td>
        <td>Boolean</td>
        <td>
          Vérifie si un statut HTTP est un succès (commence par 20: 200, 201, 204, etc.).
          Utile pour gérer de manière uniforme tous les codes de succès HTTP.
        </td>
      </tr>
    </tbody>
  </table>
  <h4 class="h4">Utilisation</h4>
  <div class="div-code">
    import { AjaxHelpers } from "@brugmann/vuemann/src/services/ajax/ajax-helpers.js"
    <br /><br />
    // Vérifier si la requête est un succès<br />
    if (AjaxHelpers.isSuccess(response.status)) {<br />
    &emsp;// Traiter la réponse réussie (200, 201, 204, etc.)<br />
    }<br />
    <br />
    // Exemple avec différents codes de succès<br />
    AjaxHelpers.isSuccess(200) // true - OK<br />
    AjaxHelpers.isSuccess(201) // true - Created<br />
    AjaxHelpers.isSuccess(204) // true - No Content<br />
    AjaxHelpers.isSuccess(404) // false - Not Found<br />
  </div>

  <h2 class="h2">Intercepteurs</h2>
  <h3 class="h3">Requête</h3>
  <p>
    L'intercepteur de requête permet:
  </p>
  <ul class="list ml-25">
    <li>d'ajouter des headers à la requête.</li>
    <li>ajouter automatiquement le bearer token.</li>
    <li>annuler deux requêtes avec la même url si l'option abort est activée.</li>
  </ul>
  <h3 class="h3">Réponse</h3>
  <p>
    L'intercepteur de réponse permet de rafraîchir le token Bearer en cas de statut 401 lorsque le detail 
    de la réponse contient "expired".
  </p>
</template>
