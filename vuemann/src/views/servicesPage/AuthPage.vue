<template>
  <h1 class="h1 color-primary">Service Auth</h1>
  <p>Ce service permet de gérer l'authentification d'un user</p>
  <h2 class="h2">Installation</h2>
  <ul class="list ml-25">
    <li>Importer authService dans l'objet services situé dans le fichier main.js.</li>
  </ul>
  <h3 class="h3">Dépendances</h3>
  <p>Ce service est dépedants des services :</p>
  <ul class="list ml-25">
    <li>router - methode redirectRouteName</li>
    <li>flash - methode success</li>
    <li>ajax - methode req</li>
    <li>form - view Input</li>
  </ul>
  <h3 class="h3">Routes</h3>
  <p>
    Le service auth intégre une page de connexion. <router-link :to="{name: 'login'}" class="underline link-underline" target="_blank">Vous pouvez la visualiser ici</router-link>.
  </p>
  <h3 class="h3">Configuration</h3>
  <p>
    L'authentification est géré par deux fichiers de config en fonction de si vous voulez sécuriser 
    les requêtes vers une API ou une route de l'application. Pour plus de détails sur les 
    <router-link :to="{name: 'config'}" class="underline link-underline">fichiers de configuration</router-link>.
  </p>
  <h4 class="h4">Les apis</h4>
  <p>
    Pour rendre l'authentification requises pour une API, la clé <span class="badge-code">auth</span> de l'api correspondante doit être à 
    true dans le fichier app-config.js.
  </p>
  <div class="div-code">
    export const app = {<br />    &emsp;homepage_url : "/",<br />    &emsp;apis : {<br />    &emsp;&emsp;api1 : {<br />    &emsp;&emsp;&emsp;url : "www.api.fr",<br />    &emsp;&emsp;&emsp;auth : true,<br />    &emsp;&emsp;},<br />    &emsp;&emsp;api2 : {<br />    &emsp;&emsp;&emsp;url : "www.api2.fr"<br />    &emsp;&emsp;}<br />    &emsp;}<br />  }
  </div>
  <p>
    Dans l'exemple ci-dessus, l'api1 requière une authentification alors que l'api 2 non.
  </p>
  <h4 class="h4">Les route de l'application</h4>
  <p>
    Les routes de votre application peuvent utiliser le token d'une api pour vérifier que l'utilisateur courant est connecté. Pour cela 
    rajouter la clé <span class="badge-code">auth</span> avec le nom de l'api dans les métas de la route dans le fichier route-config.js.
  </p>
  <div class="div-code">
    ...<br />    {<br />      &emsp;path: "/",<br />      &emsp;name: "home",<br />      &emsp;component: Home,<br />    },<br />    {<br />      &emsp;path: "/",<br />      &emsp;name: "profil",<br />      &emsp;component: Profil,<br />      &emsp;meta : {<br />      &emsp;&emsp;auth: "api1"  <br />      &emsp;}<br />    },<br />    ...
  </div>
  <p>
    Dans l'exemple ci-dessus, la route home ne requière pas d'authentification contrainerment
    à la route profil qui utilisera les crédentiels de l'api1 pour la verification du token.
  </p>
  <h4 class="h4">Utiliser les crédentials de l'api pour obtenir le token</h4>
  <p>
    Par default, le service auth va utiliser les crédentials de l'utilisateur pour récupérer le token d'authentification. Mais dans 
    certain cas, l'api utilise ses propres crédentials. Pour cela, remplissez les clés <span class="badge-code">username</span> et 
    <span class="badge-code">password</span> dans l'objet de l'api dans le fichier appConfig.
  </p>
  <div class="div-code">
    export const app = {<br />    &emsp;homepage_url : "/",<br />    &emsp;apis : {<br />    &emsp;&emsp;api1 : {<br />    &emsp;&emsp;&emsp;url : "www.api.fr",<br />    &emsp;&emsp;&emsp;auth : true,<br />    &emsp;&emsp;&emsp;username : "api_username",<br />    &emsp;&emsp;&emsp;password : "api_passworde",<br />    &emsp;&emsp;}<br />    &emsp;}<br />  }
  </div>
  <p>
    Dans l'exemple ci-dessus, le service auth utilisera les crédentials de l'api1 pour récupérer le token de connection.
  </p>
  <h2 class="h2">Fonctions accessibles depuis le gestionnaire de service</h2> 
  <!-- currentUser -->
  <h3 class="h3"><i class="fa-solid fa-diamond mr-5"></i>currentUser</h3>
  <p>
    Permet de récupérer l'utilisateur connecté courant.
  </p>
  <h4 class="h4">Appel via le service manager</h4>
  <div class="div-code">
    servicesM.serviceservice('auth:current-user.js')
  </div>
  <!-- currentUser -->
  <h3 class="h3"><i class="fa-solid fa-diamond mr-5"></i>getAccessToken</h3>
  <p>
    Permet de récupérer le token access de l'utilisateur courant.
  </p>
  <h4 class="h4">Appel via le service manager</h4>
  <div class="div-code">
    servicesM.serviceservice('auth:getAccessToken')
  </div>
  <!-- logout -->
  <h3 class="h3"><i class="fa-solid fa-diamond mr-5"></i>logout</h3>
  <p>
    Permet de déconnecter un utilisateur. Cette fonction va 
    supprimer les clés access_token, refresh_token et current_user du localStorage.
  </p>
  <h4 class="h4">Appel via le service manager</h4>
  <div class="div-code">
    servicesM.serviceservice('auth:logout')
  </div>
  <h4 class="h4">Événement</h4>
  <p>
    Un événement logout est émis lorsque l'utilisateur est déconnecté.
  </p>
  <div class="div-code">
    document.addEventListener('logout', () => {
      console.log('Utilisateur déconnecté');
    });
  </div>
  <!-- Refresh Token -->
  <h3 class="h3"><i class="fa-solid fa-diamond mr-5"></i>refreshToken</h3>
    <p>
      Permet de rafraichir un token expiré. Cette fonction va verrifier que la réponse à bien un status 401 et 
      qu'elle comporte bien une clé details dans les datas content le mot 'expired'.
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
        <td>api</td>
        <td>String</td>
        <td>oui</td>
        <td>-</td>
        <td>
          Nom de l'api
        </td>
      </tr>
      <tr>
        <td>response</td>
        <td>Object</td>
        <td>oui</td>
        <td>-</td>
        <td>
          Objet response retourné par la requête qui a échoué
        </td>
      </tr>
    </tbody>
  </table>
  <h4 class="h4">Appel via le service manager</h4>
  <div class="div-code">
    servicesM.service('auth:refreshToken', [api_name, response])
  </div>
  <!-- RouteAuthCheck -->
  <h3 class="h3"><i class="fa-solid fa-diamond mr-5"></i>RouteAuthCheck</h3>
  <p>Permet de verrifier le token d'une API et s'il est expiré, le rafraichir.</p>
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
        <td>api</td>
        <td>String</td>
        <td>oui</td>
        <td>-</td>
        <td>
          Nom de l'api
        </td>
      </tr>
    </tbody>
  </table>
  <h4 class="h4">Appel via le service manager</h4>
  <div class="div-code">
    servicesM.service('auth:routesAuthCheck', api_name)
  </div>
  <!-- Gestion des rôles -->
  <h3 class="h3"><i class="fa-solid fa-diamond mr-5"></i>Gestion des rôles</h3>
  <p>
    Le service auth intègre un système de gestion des rôles utilisateur basé sur les groupes et niveaux.
  </p>
  <h4 class="h4">Configuration des rôles</h4>
  <p>
    Les rôles sont définis dans le fichier <span class="badge-code">auth-config.js</span> et doivent être importés dans <span class="badge-code">main.js</span>.
  </p>
  <div class="div-code">
    export const auth = {<br />
    &emsp;roles : {<br />
    &emsp;&emsp;admin : [<br />
    &emsp;&emsp;&emsp;{<br />
    &emsp;&emsp;&emsp;&emsp;"groupe" : "RdvManager",<br />
    &emsp;&emsp;&emsp;&emsp;"level" : 10<br />
    &emsp;&emsp;&emsp;}<br />
    &emsp;&emsp;],<br />
    &emsp;&emsp;manager : [<br />
    &emsp;&emsp;&emsp;{<br />
    &emsp;&emsp;&emsp;&emsp;"groupe" : "RdvManager",<br />
    &emsp;&emsp;&emsp;&emsp;"level" : 5<br />
    &emsp;&emsp;&emsp;}<br />
    &emsp;&emsp;]<br />
    &emsp;}<br />
    }
  </div>
  <h4 class="h4">Fonctions disponibles</h4>
  <h5 class="h5">hasRole</h5>
  <p>Vérifie si l'utilisateur connecté possède un rôle spécifique.</p>
  <div class="div-code">
    servicesM.service('auth:hasRole', 'admin')
  </div>
  <h2 class="h2">Les vues</h2>
  <h3 class="h3">login</h3>
  <p>
    Le service auth intégre une page de connexion. Vous pouvez la visualiser <router-link :to="{name: 'login'}" class="underline link-underline">ici</router-link>.
  </p>
</template>
