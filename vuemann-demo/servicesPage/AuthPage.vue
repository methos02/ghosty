<template>
  <h1 class="h1 color-primary">Service Auth</h1>
  <p>Ce service permet de gérer l'authentification d'un user</p>
  <p class="color-warning">
    <i class="fa-solid fa-circle-info mr-5"></i>
    Une alternative basée sur Keycloak est également disponible :
    <span class="badge-code">auth-keycloak</span>. Elle s'enregistre sous la même clé
    <span class="badge-code">auth</span> dans le service manager. Voir la
    <router-link
      :to="{ name: 'services.auth-keycloak' }"
      class="underline link-underline"
      >page dédiée à auth-keycloak</router-link
    >
    pour l'installation et la configuration.
  </p>
  <h2 class="h2">Installation</h2>
  <p>
    Le service auth est enregistré via <span class="badge-code">authInit</span> dans la méthode
    <span class="badge-code">servicesM.initServices()</span> du fichier
    <span class="badge-code">main.js</span>. Pour plus de détails sur l'installation des services,
    consultez la
    <router-link
      :to="{ name: 'services' }"
      class="link-underline"
      >documentation des services</router-link
    >.
  </p>
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
    Le service auth intégre une page de connexion.
    <router-link
      :to="{ name: 'login' }"
      class="underline link-underline"
      target="_blank"
      >Vous pouvez la visualiser ici</router-link
    >.
  </p>
  <h3 class="h3">Configuration</h3>
  <p>L'authentification est gérée par plusieurs fichiers de configuration :</p>
  <ul class="list ml-25">
    <li>
      <span class="badge-code">src/config/app-config.js</span> - Configuration des APIs et
      authentification
    </li>
    <li>
      <span class="badge-code">src/config/auth-config.js</span> - Définition des rôles utilisateur
    </li>
    <li>
      <span class="badge-code">src/config/route-config.js</span> - Protection des routes par
      authentification/rôles
    </li>
  </ul>
  <h4 class="h4">Désactiver l'authentification globalement</h4>
  <p>
    Pour désactiver complètement l'authentification (utile en développement), définissez
    <span class="badge-code">auth: false</span> dans <span class="badge-code">app-config.js</span> :
  </p>
  <div class="div-code">
    export const app = {<br />
    &emsp;auth: false, // Désactive toutes les vérifications d'authentification<br />
    &emsp;homepage_url : "/",<br />
    &emsp;apis : { ... }<br />
    }
  </div>
  <h4 class="h4">Les apis</h4>
  <p>
    Pour rendre l'authentification requises pour une API, la clé
    <span class="badge-code">auth</span> de l'api correspondante doit être à true dans le fichier
    app-config.js.
  </p>
  <div class="div-code">
    export const app = {<br />
    &emsp;homepage_url : "/",<br />
    &emsp;apis : {<br />
    &emsp;&emsp;api1 : {<br />
    &emsp;&emsp;&emsp;url : "www.api.fr",<br />
    &emsp;&emsp;&emsp;auth : true,<br />
    &emsp;&emsp;},<br />
    &emsp;&emsp;api2 : {<br />
    &emsp;&emsp;&emsp;url : "www.api2.fr"<br />
    &emsp;&emsp;}<br />
    &emsp;}<br />
    }
  </div>
  <p>Dans l'exemple ci-dessus, l'api1 requière une authentification alors que l'api 2 non.</p>
  <h4 class="h4">Les route de l'application</h4>
  <p>
    Les routes de votre application peuvent utiliser le token d'une api pour vérifier que
    l'utilisateur courant est connecté. Pour cela rajouter la clé
    <span class="badge-code">auth</span> avec le nom de l'api dans les métas de la route dans le
    fichier route-config.js.
  </p>
  <div class="div-code">
    ...<br />
    {<br />
    &emsp;path: "/",<br />
    &emsp;name: "home",<br />
    &emsp;component: Home,<br />
    },<br />
    {<br />
    &emsp;path: "/",<br />
    &emsp;name: "profil",<br />
    &emsp;component: Profil,<br />
    &emsp;meta : {<br />
    &emsp;&emsp;auth: "api1" <br />
    &emsp;}<br />
    },<br />
    ...
  </div>
  <p>
    Dans l'exemple ci-dessus, la route home ne requière pas d'authentification contrainerment à la
    route profil qui utilisera les crédentiels de l'api1 pour la verification du token.
  </p>
  <h4 class="h4">Utiliser les crédentials de l'api pour obtenir le token</h4>
  <p>
    Par default, le service auth va utiliser les crédentials de l'utilisateur pour récupérer le
    token d'authentification. Mais dans certain cas, l'api utilise ses propres crédentials. Pour
    cela, remplissez les clés <span class="badge-code">username</span> et
    <span class="badge-code">password</span> dans l'objet de l'api dans le fichier appConfig.
  </p>
  <div class="div-code">
    export const app = {<br />
    &emsp;homepage_url : "/",<br />
    &emsp;apis : {<br />
    &emsp;&emsp;api1 : {<br />
    &emsp;&emsp;&emsp;url : "www.api.fr",<br />
    &emsp;&emsp;&emsp;auth : true,<br />
    &emsp;&emsp;&emsp;username : "api_username",<br />
    &emsp;&emsp;&emsp;password : "api_passworde",<br />
    &emsp;&emsp;}<br />
    &emsp;}<br />
    }
  </div>
  <p>
    Dans l'exemple ci-dessus, le service auth utilisera les crédentials de l'api1 pour récupérer le
    token de connection.
  </p>
  <h4 class="h4">Ignorer conditionnellement une API par utilisateur</h4>
  <p>
    Certains profils d'utilisateurs ne possèdent pas de compte sur une API donnée. La clé
    optionnelle
    <span class="badge-code">skip</span> d'une API reçoit un contexte
    <span class="badge-code">{ roles, username }</span> et, lorsqu'elle renvoie
    <span class="badge-code">true</span>, l'API est ignorée sur tout le cycle : login,
    vérification/refresh à la navigation, et garde de requête. Rétrocompatible : sans
    <span class="badge-code">skip</span>, le comportement reste inchangé.
  </p>
  <div class="div-code">
    export const app = {<br />
    &emsp;homepage_url : "/",<br />
    &emsp;apis : {<br />
    &emsp;&emsp;api1 : {<br />
    &emsp;&emsp;&emsp;url : "www.api.fr",<br />
    &emsp;&emsp;&emsp;auth : true,<br />
    &emsp;&emsp;&emsp;skip : ({ roles }) => roles.includes('some-role'),<br />
    &emsp;&emsp;}<br />
    &emsp;}<br />
    }
  </div>
  <p>
    Les <span class="badge-code">roles</span> n'étant connus qu'après authentification de l'API
    d'identité (<span class="badge-code">gums</span>, l'API des groupes utilisateur), cette API est
    toujours authentifiée en premier, puis les rôles sont reconstruits, puis
    <span class="badge-code">skip</span> est évalué sur les autres APIs. Un
    <span class="badge-code">skip</span> posé sur l'API d'identité n'a donc aucun effet. Toute
    requête visant une API ignorée renvoie un statut <span class="badge-code">FORBIDDEN</span> sans
    appel HTTP, avec un flash <span class="badge-code">api_forbidden_for_user</span> et un log
    <span class="badge-code">user_forbidden_api</span>.
  </p>
  <h4 class="h4">Mode multi-company (Active Directory)</h4>
  <p>
    Certaines applications doivent résoudre la <span class="badge-code">company</span> de
    l'utilisateur avant de l'identifier. Activez ce mode avec
    <span class="badge-code">multiCompany: true</span> dans
    <span class="badge-code">app-config.js</span>. Le service interroge alors l'API
    <span class="badge-code">active_directory</span> (route
    <span class="badge-code">user.company</span>) pour obtenir la company de l'utilisateur, puis la
    transmet en query param <span class="badge-code">company</span> à la recherche de l'utilisateur
    sur l'API d'identité (<span class="badge-code">gums</span>). Désactivé par défaut : le flux
    reste strictement inchangé.
  </p>
  <div class="div-code">
    export const app = {<br />
    &emsp;homepage_url : "/",<br />
    &emsp;multiCompany : true,<br />
    &emsp;apis : {<br />
    &emsp;&emsp;gums : {<br />
    &emsp;&emsp;&emsp;url : "www.gums.fr/",<br />
    &emsp;&emsp;&emsp;auth : true,<br />
    &emsp;&emsp;},<br />
    &emsp;&emsp;active_directory : {<br />
    &emsp;&emsp;&emsp;url : import.meta.env['VITE_API_ACTIVE_DIRECTORY_URL'],<br />
    &emsp;&emsp;&emsp;auth : true,<br />
    &emsp;&emsp;}<br />
    &emsp;}<br />
    }
  </div>
  <p>
    L'API <span class="badge-code">active_directory</span> requiert sa propre authentification
    (<span class="badge-code">auth: true</span>) et son URL doit être fournie via la variable
    d'environnement <span class="badge-code">VITE_API_ACTIVE_DIRECTORY_URL</span>. Comme la company
    est nécessaire avant la résolution des rôles, cette API est authentifiée
    <strong>en premier</strong> (juste après l'API d'identité) au login, et son token est vérifié
    avant la reconstruction des rôles au rafraîchissement de page.
  </p>
  <p>
    <i class="fa-solid fa-triangle-exclamation color-warning mr-5"></i>
    Si <span class="badge-code">multiCompany: true</span> mais que
    <span class="badge-code">VITE_API_ACTIVE_DIRECTORY_URL</span> est absente, l'application affiche
    une erreur bloquante au démarrage (<span class="badge-code">multi_company_missing_ad_url</span
    >). Si l'appel à l'API échoue ou ne retourne aucune company, le login est bloqué (aucun repli
    vers la recherche sans company).
  </p>
  <h2 class="h2">Fonctions accessibles depuis le gestionnaire de service</h2>
  <!-- currentUser -->
  <h3 class="h3"><i class="fa-solid fa-diamond mr-5"></i>currentUser</h3>
  <p>Permet de récupérer l'utilisateur connecté courant.</p>
  <h4 class="h4">Appel via le service manager</h4>
  <div class="div-code">servicesM.service('auth:currentUser')</div>
  <!-- currentUser -->
  <h3 class="h3"><i class="fa-solid fa-diamond mr-5"></i>getAccessToken</h3>
  <p>Permet de récupérer le token access de l'utilisateur courant.</p>
  <h4 class="h4">Appel via le service manager</h4>
  <div class="div-code">servicesM.service('auth:getAccessToken')</div>
  <!-- logout -->
  <h3 class="h3"><i class="fa-solid fa-diamond mr-5"></i>logout</h3>
  <p>
    Permet de déconnecter un utilisateur. Cette fonction va supprimer les clés access_token,
    refresh_token et current_user du localStorage.
  </p>
  <h4 class="h4">Appel via le service manager</h4>
  <div class="div-code">servicesM.service('auth:logout')</div>
  <h4 class="h4">Événement</h4>
  <p>Un événement logout est émis lorsque l'utilisateur est déconnecté.</p>
  <div class="div-code">
    document.addEventListener('logout', () => { console.log('Utilisateur déconnecté'); });
  </div>
  <!-- Refresh Token -->
  <h3 class="h3"><i class="fa-solid fa-diamond mr-5"></i>refreshToken</h3>
  <p>
    Permet de rafraichir un token expiré. Cette fonction va verrifier que la réponse à bien un
    status 401 et qu'elle comporte bien une clé details dans les datas content le mot 'expired'.
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
        <td>Nom de l'api</td>
      </tr>
      <tr>
        <td>response</td>
        <td>Object</td>
        <td>oui</td>
        <td>-</td>
        <td>Objet response retourné par la requête qui a échoué</td>
      </tr>
    </tbody>
  </table>
  <h4 class="h4">Appel via le service manager</h4>
  <div class="div-code">servicesM.service('auth:refreshToken', [api_name, response])</div>
  <!-- routeAuthCheck -->
  <h3 class="h3"><i class="fa-solid fa-diamond mr-5"></i>routeAuthCheck</h3>
  <p>Permet de vérifier le token d'une API et s'il est expiré, le rafraîchir.</p>
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
        <td>Nom de l'api</td>
      </tr>
    </tbody>
  </table>
  <h4 class="h4">Appel via le service manager</h4>
  <div class="div-code">servicesM.service('auth:routeAuthCheck', api_name)</div>
  <!-- routesAuthCheck -->
  <h3 class="h3"><i class="fa-solid fa-diamond mr-5"></i>routesAuthCheck</h3>
  <p>
    Permet de vérifier les tokens de plusieurs APIs en une seule fois. Utile pour les routes qui
    nécessitent plusieurs APIs.
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
        <td>apis</td>
        <td>Array</td>
        <td>non</td>
        <td>APIs avec <span class="badge-code">auth: true</span></td>
        <td>
          Tableau des noms d'APIs à vérifier. Par défaut, toutes les APIs marquées
          <span class="badge-code">auth: true</span>.
        </td>
      </tr>
    </tbody>
  </table>
  <h4 class="h4">Appel via le service manager</h4>
  <div class="div-code">
    <span class="color-neutral-500">// Toutes les APIs auth (défaut)</span><br />
    servicesM.service('auth:routesAuthCheck')<br />
    <br />
    <span class="color-neutral-500">// Sous-ensemble explicite</span><br />
    servicesM.service('auth:routesAuthCheck', [['api1', 'api2']])
  </div>
  <!-- Gestion des rôles -->
  <h3 class="h3"><i class="fa-solid fa-diamond mr-5"></i>Gestion des rôles</h3>
  <p>
    Le service auth intègre un système de gestion des rôles utilisateur basé sur les groupes et
    niveaux.
  </p>
  <h4 class="h4">Configuration des rôles</h4>
  <p>
    Les rôles sont définis dans le fichier <span class="badge-code">auth-config.js</span> et doivent
    être importés dans <span class="badge-code">main.js</span>.
  </p>
  <div class="div-code">
    export const auth = {<br />
    &emsp;roles : {<br />
    &emsp;&emsp;admin : [<br />
    &emsp;&emsp;&emsp;{<br />
    &emsp;&emsp;&emsp;&emsp;"group" : "RdvManager",<br />
    &emsp;&emsp;&emsp;&emsp;"level" : 10<br />
    &emsp;&emsp;&emsp;}<br />
    &emsp;&emsp;],<br />
    &emsp;&emsp;manager : [<br />
    &emsp;&emsp;&emsp;{<br />
    &emsp;&emsp;&emsp;&emsp;"group" : "RdvManager",<br />
    &emsp;&emsp;&emsp;&emsp;"level" : 5<br />
    &emsp;&emsp;&emsp;}<br />
    &emsp;&emsp;]<br />
    &emsp;}<br />
    }
  </div>
  <h4 class="h4">Fonctions disponibles</h4>
  <h5 class="h5">hasRole</h5>
  <p>Vérifie si l'utilisateur connecté possède un rôle spécifique.</p>
  <div class="div-code">servicesM.service('auth:hasRole', 'admin')</div>
  <p>Vous pouvez également utiliser le helper <span class="badge-code">auth.hasRole()</span> :</p>
  <div class="div-code">
    import { auth } from '@brugmann/vuemann/src/shortcuts/services-shortcut.js'<br /><br />
    if (auth.hasRole('admin')) {<br />
    &emsp;// Code pour les admins<br />
    }
  </div>
  <h4 class="h4">Groupe sans niveau requis</h4>
  <p>
    Il est possible de définir un rôle basé uniquement sur l'appartenance à un groupe, sans exigence
    de niveau minimum. Pour cela, omettez simplement la clé
    <span class="badge-code">level</span> dans la configuration du rôle.
  </p>
  <div class="div-code">
    export const auth = {<br />
    &emsp;roles : {<br />
    &emsp;&emsp;// Rôle avec niveau requis<br />
    &emsp;&emsp;admin : [<br />
    &emsp;&emsp;&emsp;{<br />
    &emsp;&emsp;&emsp;&emsp;"group" : "Pricing",<br />
    &emsp;&emsp;&emsp;&emsp;"level" : 10<br />
    &emsp;&emsp;&emsp;}<br />
    &emsp;&emsp;],<br />
    &emsp;&emsp;// Rôle sans niveau (tout membre du groupe)<br />
    &emsp;&emsp;user : [<br />
    &emsp;&emsp;&emsp;{<br />
    &emsp;&emsp;&emsp;&emsp;"group" : "RdvManager"<br />
    &emsp;&emsp;&emsp;}<br />
    &emsp;&emsp;]<br />
    &emsp;}<br />
    }
  </div>
  <h4 class="h4">Protection des routes par rôle</h4>
  <p>
    Les routes peuvent être protégées en ajoutant une liste de rôles requis dans
    <span class="badge-code">meta.roles</span>. Si l'utilisateur ne possède aucun des rôles requis,
    il sera automatiquement redirigé vers la page d'accueil ("/") avec un message d'avertissement.
  </p>
  <div class="div-code">
    export const routes = [<br />
    &emsp;{<br />
    &emsp;&emsp;path: "/admin",<br />
    &emsp;&emsp;name: "admin",<br />
    &emsp;&emsp;component: AdminPage,<br />
    &emsp;&emsp;meta: {<br />
    &emsp;&emsp;&emsp;roles: ['admin', 'super_admin'] // Au moins un de ces rôles requis<br />
    &emsp;&emsp;}<br />
    &emsp;}<br />
    ]
  </div>
  <p>
    <strong>Logique OR :</strong> L'utilisateur doit posséder AU MOINS UN des rôles spécifiés pour
    accéder à la route.
  </p>
  <p>
    <strong>Routes sans rôles :</strong> Les routes sans
    <span class="badge-code">meta.roles</span> (ou avec un tableau vide) sont accessibles à tous les
    utilisateurs.
  </p>
  <h4 class="h4">Filtrage des items du menu par rôle</h4>
  <p>
    Pour plus d'informations sur le filtrage des items du menu en fonction des rôles, consultez la
    <router-link
      :to="{ name: 'components.header' }"
      class="underline link-underline"
      >documentation du HeaderComponent</router-link
    >.
  </p>

  <h2 class="h2">Raccourcis disponibles</h2>
  <p>
    L'objet <span class="badge-code">auth</span> regroupe les raccourcis du service Auth pour un
    accès simplifié.
  </p>
  <h3 class="h3"><i class="fa-solid fa-diamond mr-5"></i>auth</h3>
  <h4 class="h4">Méthodes disponibles</h4>
  <table class="t-default">
    <thead>
      <tr>
        <th>Méthode</th>
        <th>Description</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>auth.username()</td>
        <td>
          Retourne le nom de l'utilisateur connecté (raccourci vers
          <span class="badge-code">currentUser()</span>)
        </td>
      </tr>
      <tr>
        <td>auth.hasRole(roleName)</td>
        <td>Vérifie si l'utilisateur possède un rôle spécifique</td>
      </tr>
    </tbody>
  </table>
  <h4 class="h4">Utilisation</h4>
  <div class="div-code">
    import { auth } from "@brugmann/vuemann/src/shortcuts/services-shortcut.js"<br />
    <br />
    <span class="color-neutral-500">// Récupérer l'utilisateur connecté</span><br />
    const currentUser = auth.username()<br />
    <br />
    <span class="color-neutral-500">// Vérifier un rôle</span><br />
    if (auth.hasRole('admin')) {<br />
    &emsp;// Code pour les admins<br />
    }
  </div>

  <h2 class="h2">Store Auth (État réactif)</h2>
  <p>Le service Auth utilise un store Vue réactif pour gérer l'état de l'authentification.</p>
  <h3 class="h3"><i class="fa-solid fa-diamond mr-5"></i>useAuthStore</h3>
  <p>
    Composable Vue qui retourne les refs réactives du store Auth. Utile dans les composants Vue pour
    une réactivité automatique.
  </p>
  <h4 class="h4">Refs disponibles</h4>
  <table class="t-default">
    <thead>
      <tr>
        <th>Nom</th>
        <th>Type</th>
        <th>Description</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>username</td>
        <td>Ref&lt;String&gt;</td>
        <td>Nom d'utilisateur saisi dans le formulaire de connexion</td>
      </tr>
      <tr>
        <td>password</td>
        <td>Ref&lt;String&gt;</td>
        <td>Mot de passe saisi dans le formulaire de connexion</td>
      </tr>
      <tr>
        <td>errorAuth</td>
        <td>Ref&lt;String&gt;</td>
        <td>Message d'erreur d'authentification à afficher</td>
      </tr>
      <tr>
        <td>currentUser</td>
        <td>Ref&lt;String&gt;</td>
        <td>Utilisateur actuellement connecté</td>
      </tr>
      <tr>
        <td>currentUserRoles</td>
        <td>Ref&lt;Array&gt;</td>
        <td>Liste des rôles de l'utilisateur connecté</td>
      </tr>
    </tbody>
  </table>
  <h4 class="h4">Utilisation dans un composant Vue</h4>
  <div class="div-code">
    import { useAuthStore } from "@brugmann/vuemann/src/services/auth/src/auth-store.js"<br />
    <br />
    const { currentUser, currentUserRoles } = useAuthStore()<br />
    <br />
    <span class="color-neutral-500">// Les valeurs sont automatiquement réactives</span><br />
    console.log(currentUser.value) <span class="color-neutral-500">// 'DUPONT'</span><br />
    console.log(currentUserRoles.value)
    <span class="color-neutral-500">// ['admin', 'manager']</span>
  </div>

  <h2 class="h2">Persistance localStorage</h2>
  <p>
    Le service Auth stocke automatiquement les informations d'authentification dans le localStorage
    du navigateur.
  </p>
  <h4 class="h4">Clés stockées</h4>
  <table class="t-default">
    <thead>
      <tr>
        <th>Clé</th>
        <th>Format</th>
        <th>Description</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>current_user</td>
        <td>String</td>
        <td>Nom de l'utilisateur connecté (en majuscules)</td>
      </tr>
      <tr>
        <td>current_user_roles</td>
        <td>JSON Array</td>
        <td>Liste des rôles de l'utilisateur</td>
      </tr>
      <tr>
        <td>{api}_token</td>
        <td>String</td>
        <td>
          Access token pour l'API spécifiée (ex: <span class="badge-code">patient_token</span>)
        </td>
      </tr>
      <tr>
        <td>{api}_refresh</td>
        <td>String</td>
        <td>
          Refresh token pour l'API spécifiée (ex: <span class="badge-code">patient_refresh</span>)
        </td>
      </tr>
    </tbody>
  </table>
  <p>
    <i class="fa-solid fa-info-circle color-primary mr-5"></i>
    Lors d'un <span class="badge-code">logout()</span>, toutes ces clés sont automatiquement
    supprimées du localStorage.
  </p>

  <h2 class="h2">Les vues</h2>
  <h3 class="h3">login</h3>
  <p>
    Le service auth intégre une page de connexion. Vous pouvez la visualiser
    <router-link
      :to="{ name: 'login' }"
      class="underline link-underline"
      >ici</router-link
    >.
  </p>
</template>
