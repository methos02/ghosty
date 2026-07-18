<template>
  <h1 class="h1 color-primary">Service Router</h1>
  <p>Ce service permet de gérer les routes de l'application</p>
  <h2 class="h2">Installation</h2>
  <p>
    Le service router est enregistré via <span class="badge-code">routerInit</span> dans la méthode
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
  <p>
    Ce service utilise le package externe
    <a
      href="https://router.vuejs.org/guide/"
      class="underline link-underline"
      target="_blank"
      >vue-router</a
    >. En plus de ce package, ce service est dépedants des services :
  </p>
  <ul class="list ml-25">
    <li>auth - methodes routeAuthCheck et getAccessToken</li>
    <li>utils - methode apiStatus (health check OpenAPI)</li>
  </ul>
  <h3 class="h3">Configuration</h3>
  <p>
    Les routes sont définies dans le fichier
    <span class="badge-code">src/config/route-config.js</span>. Comme expliqué dans la documentation
    de vue-router, les routes sont gérées par un objet de route. Vous pouvez préciser plusieurs
    options dans la clé <span class="badge-object">meta</span>. Voici le lien vers la documentations
    des
    <router-link
      :to="{ name: 'config' }"
      class="underline link-underline"
      >fichiers de configuration</router-link
    >.
  </p>
  <h4 class="h4">Métas possibles</h4>
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
        <td>roles</td>
        <td>Array</td>
        <td>
          Liste des rôles autorisés à accéder à cette route. Si l'utilisateur n'a
          <strong>aucun</strong> des rôles requis (logique OR), il est redirigé vers "/" avec un
          message d'avertissement. Voir la
          <router-link
            :to="{ name: 'services.auth' }"
            class="link-underline"
            >documentation Auth</router-link
          >
          pour la configuration des rôles.
        </td>
      </tr>
      <tr>
        <td>title</td>
        <td>String</td>
        <td>
          Titre de la page qui sera défini dans <span class="badge-code">document.title</span> lors
          de la navigation vers cette route. Mis à jour automatiquement par le guard
          <span class="badge-code">afterEach</span>.
        </td>
      </tr>
      <tr>
        <td>breadcrumb</td>
        <td>Array</td>
        <td>
          Fil d'Ariane (breadcrumb) pour la navigation. Tableau d'objets
          <span class="badge-code">{ name: String, to: String }</span>
          représentant le chemin de navigation hiérarchique.
        </td>
      </tr>
    </tbody>
  </table>
  <h4 class="h4">Exemple de configuration</h4>
  <div class="div-code">
    <span class="color-neutral-500">// src/config/route-config.js</span><br />
    export const routes = [<br />
    &emsp;{<br />
    &emsp;&emsp;path: "/admin",<br />
    &emsp;&emsp;name: "admin",<br />
    &emsp;&emsp;component: AdminPage,<br />
    &emsp;&emsp;meta: {<br />
    &emsp;&emsp;&emsp;roles: ['admin', 'super_admin'],
    <span class="color-neutral-500">// OR logic</span><br />
    &emsp;&emsp;&emsp;title: 'Administration',<br />
    &emsp;&emsp;&emsp;breadcrumb: [<br />
    &emsp;&emsp;&emsp;&emsp;{ name: 'Accueil', to: '/' },<br />
    &emsp;&emsp;&emsp;&emsp;{ name: 'Administration', to: '/admin' }<br />
    &emsp;&emsp;&emsp;]<br />
    &emsp;&emsp;}<br />
    &emsp;}<br />
    ]
  </div>

  <h3 class="h3">ScrollBehavior</h3>
  <p>Le routeur est configuré avec un comportement de défilement automatique :</p>
  <ul class="list ml-25">
    <li>
      <strong>Ancres</strong> - Si l'URL contient un hash (#section), défilement fluide vers
      l'élément
    </li>
    <li>
      <strong>Position sauvegardée</strong> - Restaure la position de scroll lors de la navigation
      arrière/avant
    </li>
    <li><strong>Défilement en haut</strong> - Par défaut, scroll en haut de la page (top: 0)</li>
  </ul>
  <div class="div-code">
    <span class="color-neutral-500">// Exemple d'utilisation des ancres</span><br />
    router.push({ name: 'documentation', hash: '#api-section' })
  </div>
  <h2 class="h2">Fonctions accessibles depuis le gestionnaire de service</h2>
  <!-- addRoute -->
  <h3 class="h3"><i class="fa-solid fa-diamond mr-5"></i>addRoute</h3>
  <p>Permet d'ajouter une route au router.</p>
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
        <td>route</td>
        <td>Object</td>
        <td>oui</td>
        <td>-</td>
        <td>Route représenter sous forme d'objet à ajouter au routeur.</td>
      </tr>
    </tbody>
  </table>
  <h4 class="h4">Utilisation</h4>
  <div class="div-code">
    servicesM.service('router:addRoute', {<br />
    &emsp;path: "/",<br />
    &emsp;name: "home",<br />
    &emsp;component: Home,<br />
    })
  </div>
  <p>
    <i class="fa-solid fa-triangle-exclamation color-danger mr-5"></i>
    Votre objet dois au minimum posséder les clés <span class="badge-code">path</span> et
    <span class="badge-code">component</span> pour être prise en compte par le router.
    <i class="fa-solid fa-triangle-exclamation color-danger ml-5"></i>
  </p>
  <!-- push -->
  <h3 class="h3"><i class="fa-solid fa-diamond mr-5"></i>push</h3>
  <p>Permet de rediriger l'utilisateur vers une autre route via son url.</p>
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
        <td>route</td>
        <td>String / Object</td>
        <td>oui</td>
        <td>-</td>
        <td>Route représenter sous forme d'objet ou d'url.</td>
      </tr>
    </tbody>
  </table>
  <h4 class="h4">Utilisation</h4>
  <div class="div-code">
    <span class="color-neutral-700">//appel via ServiceManager</span><br />
    import { servicesM } from '@brugmann/vuemann/src/services/services-manager.js'<br />
    servicesM.service('router:push', 'route_url')<br /><br />
    <span class="color-neutral-700">//appel via servicesHelper</span><br />
    import { router } from '@brugmann/vuemann/src/shortcuts/services-shortcut.js'<br />
    router.push('route_url')
  </div>
  <!-- hasApiRoute -->
  <h3 class="h3"><i class="fa-solid fa-diamond mr-5"></i>hasApiRoute</h3>
  <p>
    Permet de savoir si une route api est définie dans le fichier de configuration
    <span class="badge-code">routes-api-config.js</span>.
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
        <td>name</td>
        <td>String</td>
        <td>oui</td>
        <td>-</td>
        <td>Nom de la route</td>
      </tr>
    </tbody>
  </table>
  <h4 class="h4">Utilisation</h4>
  <div class="div-code">servicesM.service('router:hasApiRoute', 'route_name')</div>
  <!-- redirectAfterLogin -->
  <h3 class="h3"><i class="fa-solid fa-diamond mr-5"></i>redirectAfterLogin</h3>
  <p>
    Permet de rediriger l'utilisateur vers l'url qu'il a essayé d'atteindre après cette connecté.
  </p>
  <h4 class="h4">Utilisation</h4>
  <div class="div-code">servicesM.service('router:redirectAfterLogin')</div>
  <!-- currentRoute -->
  <h3 class="h3"><i class="fa-solid fa-diamond mr-5"></i>currentRoute</h3>
  <p>Permet de récupérer la route courante.</p>
  <h4 class="h4">Utilisation</h4>
  <div class="div-code">
    <span class="color-neutral-700">//appel via ServiceManager</span><br />
    import { servicesM } from '@brugmann/vuemann/src/services/services-manager.js'<br />
    servicesM.service('router:currentRoute')<br /><br />
    <span class="color-neutral-700">//appel via servicesHelper</span><br />
    import { route } from '@brugmann/vuemann/src/shortcuts/services-shortcut.js'<br />
    route.current()
  </div>
  <!-- getCurrentRouteParam -->
  <h3 class="h3"><i class="fa-solid fa-diamond mr-5"></i>getCurrentRouteParam</h3>
  <p>
    Permet de récupérer un paramètre de la route courante. Retourne <code>undefined</code> si la
    valeur est vide (paramètre optionnel <code>:id?</code> accédé sans valeur).
  </p>
  <h4 class="h4">Utilisation</h4>
  <div class="div-code">
    <span class="color-neutral-700">//appel via ServiceManager</span><br />
    import { servicesM } from '@brugmann/vuemann/src/services/services-manager.js'<br />
    servicesM.service('router:getCurrentRouteParam', 'param_name')<br /><br />
    <span class="color-neutral-700">//appel via servicesHelper</span><br />
    import { route } from '@brugmann/vuemann/src/shortcuts/services-shortcut.js'<br />
    route.get('param_name')
  </div>
  <!-- hasCurrentRouteParam -->
  <h3 class="h3"><i class="fa-solid fa-diamond mr-5"></i>hasCurrentRouteParam</h3>
  <p>Permet de vérifier si un paramètre existe dans la route courante (params ou query).</p>
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
        <td>param_name</td>
        <td>String</td>
        <td>oui</td>
        <td>-</td>
        <td>Nom du paramètre à vérifier</td>
      </tr>
    </tbody>
  </table>
  <h4 class="h4">Retour</h4>
  <p>
    Retourne <span class="badge-code">true</span> si le paramètre existe dans les params ou query de
    la route courante, <span class="badge-code">false</span> sinon.
  </p>
  <h4 class="h4">Utilisation</h4>
  <div class="div-code">
    <span class="color-neutral-700">//appel via ServiceManager</span><br />
    import { servicesM } from '@brugmann/vuemann/src/services/services-manager.js'<br />
    servicesM.service('router:hasCurrentRouteParam', 'param_name')<br /><br />
    <span class="color-neutral-700">//appel via servicesHelper</span><br />
    import { route } from '@brugmann/vuemann/src/shortcuts/services-shortcut.js'<br />
    route.has('param_name')
  </div>
  <!-- hasRoute -->
  <h3 class="h3"><i class="fa-solid fa-diamond mr-5"></i>hasRoute</h3>
  <p>Permet de vérifier si une route existe dans le router.</p>
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
        <td>routeName</td>
        <td>String</td>
        <td>oui</td>
        <td>-</td>
        <td>Nom de la route à vérifier</td>
      </tr>
    </tbody>
  </table>
  <h4 class="h4">Retour</h4>
  <p>
    Retourne <span class="badge-code">true</span> si la route existe,
    <span class="badge-code">false</span> sinon.
  </p>
  <h4 class="h4">Utilisation</h4>
  <div class="div-code">
    <span class="color-neutral-700">//appel via ServiceManager</span><br />
    import { servicesM } from '@brugmann/vuemann/src/services/services-manager.js'<br />
    servicesM.service('router:hasRoute', 'route_name')<br /><br />
    <span class="color-neutral-700">//appel via servicesHelper</span><br />
    import { router } from '@brugmann/vuemann/src/shortcuts/services-shortcut.js'<br />
    router.hasRoute('route_name')
  </div>
  <!-- getRoute -->
  <h3 class="h3"><i class="fa-solid fa-diamond mr-5"></i>getRoute</h3>
  <p>Permet de récupérer une route via son nom.</p>
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
        <td>routeName</td>
        <td>String</td>
        <td>oui</td>
        <td>-</td>
        <td>Nom de la route</td>
      </tr>
    </tbody>
  </table>
  <h4 class="h4">Utilisation</h4>
  <div class="div-code">servicesM.service('router:getRoute', 'route_name')</div>
  <!-- getRoutes -->
  <h3 class="h3"><i class="fa-solid fa-diamond mr-5"></i>getRoutes</h3>
  <p>Permet de récupérer toutes les routes enregistrées dans le router.</p>
  <h4 class="h4">Retour</h4>
  <p>
    Retourne un <span class="badge-code">Array</span> contenant toutes les routes configurées dans
    l'application.
  </p>
  <h4 class="h4">Utilisation</h4>
  <div class="div-code">
    <span class="color-neutral-700">//appel via ServiceManager</span><br />
    import { servicesM } from '@brugmann/vuemann/src/services/services-manager.js'<br />
    const routes = servicesM.service('router:getRoutes')<br /><br />
    <span class="color-neutral-700">//appel via servicesHelper</span><br />
    import { router } from '@brugmann/vuemann/src/shortcuts/services-shortcut.js'<br />
    const routes = router.getRoutes()
  </div>

  <!-- resolve -->
  <h3 class="h3"><i class="fa-solid fa-diamond mr-5"></i>resolve</h3>
  <p>
    Résout un emplacement de route complet (<span class="badge-code">RouteLocationRaw</span> : name
    + params + query) sans naviguer, et retourne l'objet route résolu. Utile pour récupérer le
    <span class="badge-code">.href</span> et ouvrir une route dans un nouvel onglet via
    <span class="badge-code">window.open</span>.
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
        <td>route</td>
        <td>RouteLocationRaw</td>
        <td>oui</td>
        <td>-</td>
        <td>Emplacement de route à résoudre (String ou Object name/params/query)</td>
      </tr>
    </tbody>
  </table>
  <h4 class="h4">Utilisation</h4>
  <div class="div-code">
    <span class="color-neutral-700">//appel via ServiceManager</span><br />
    import { servicesM } from '@brugmann/vuemann/src/services/services-manager.js'<br />
    const resolved = servicesM.service('router:resolve', { name: 'users', query: { id: 123 } })<br /><br />
    <span class="color-neutral-700">//appel via servicesHelper</span><br />
    import { router } from '@brugmann/vuemann/src/shortcuts/services-shortcut.js'<br />
    window.open(router.resolve({ name: 'users', query: { id: 123 } }).href, '_blank')
  </div>

  <h2 class="h2">Raccourcis disponibles</h2>
  <p>
    Ces raccourcis permettent d'accéder aux fonctionnalités du router de manière simplifiée via
    <span class="badge-code">services-shortcut.js</span>.
  </p>

  <h3 class="h3"><i class="fa-solid fa-diamond mr-5"></i>router</h3>
  <p>Objet regroupant les méthodes principales de navigation et de gestion des routes.</p>
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
        <td>router.push(route)</td>
        <td>Navigue vers une route (String ou Object)</td>
      </tr>
      <tr>
        <td>router.replace(route)</td>
        <td>Navigue vers une route sans ajouter d'entrée dans l'historique (String ou Object)</td>
      </tr>
      <tr>
        <td>router.hasRoute(route_name)</td>
        <td>Vérifie si une route existe</td>
      </tr>
      <tr>
        <td>router.getRoutes()</td>
        <td>Retourne toutes les routes enregistrées</td>
      </tr>
      <tr>
        <td>router.resolve(route)</td>
        <td>
          Résout un emplacement de route complet et retourne l'objet route (avec
          <span class="badge-code">.href</span>)
        </td>
      </tr>
    </tbody>
  </table>
  <h4 class="h4">Utilisation</h4>
  <div class="div-code">
    import { router } from "@brugmann/vuemann/src/shortcuts/services-shortcut.js"<br />
    <br />
    <span class="color-neutral-500">// Navigation (ajoute une entrée dans l'historique)</span><br />
    router.push('/admin')<br />
    router.push({ name: 'users', params: { id: 123 } })<br />
    <br />
    <span class="color-neutral-500"
      >// Navigation sans historique (le bouton Retour n'est pas pollué)</span
    ><br />
    router.replace('/admin')<br />
    router.replace({ name: 'users', params: { id: 123 } })<br />
    <br />
    <span class="color-neutral-500">// Vérifications</span><br />
    if (router.hasRoute('admin')) {<br />
    &emsp;// La route existe<br />
    }<br />
    <br />
    <span class="color-neutral-500">// Liste des routes</span><br />
    const allRoutes = router.getRoutes()<br />
    <br />
    <span class="color-neutral-500"
      >// Résolution d'une route (ex. ouvrir dans un nouvel onglet)</span
    ><br />
    window.open(router.resolve({ name: 'users', query: { id: 123 } }).href, '_blank')
  </div>

  <h3 class="h3"><i class="fa-solid fa-diamond mr-5"></i>route</h3>
  <p>Objet pour accéder aux informations de la route courante et ses paramètres.</p>
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
        <td>route.current()</td>
        <td>Retourne l'objet de la route courante</td>
      </tr>
      <tr>
        <td>route.get(param_name)</td>
        <td>Récupère un paramètre de la route (params ou query)</td>
      </tr>
      <tr>
        <td>route.has(param_name)</td>
        <td>Vérifie si un paramètre existe dans la route</td>
      </tr>
    </tbody>
  </table>
  <h4 class="h4">Utilisation</h4>
  <div class="div-code">
    import { route } from "@brugmann/vuemann/src/shortcuts/services-shortcut.js"<br />
    <br />
    <span class="color-neutral-500">// Route courante</span><br />
    const currentRoute = route.current()<br />
    console.log(currentRoute.name, currentRoute.path)<br />
    <br />
    <span class="color-neutral-500">// Récupérer un paramètre</span><br />
    const userId = route.get('id')
    <span class="color-neutral-500">// Cherche dans params puis query</span><br />
    <br />
    <span class="color-neutral-500">// Vérifier l'existence d'un paramètre</span><br />
    if (route.has('filter')) {<br />
    &emsp;const filter = route.get('filter')<br />
    }
  </div>

  <h2 class="h2">Store Router (État réactif)</h2>
  <p>
    Le store router gère l'état réactif lié à la navigation, notamment pour la redirection après
    authentification.
  </p>

  <h3 class="h3"><i class="fa-solid fa-diamond mr-5"></i>useRouterStore</h3>
  <p>Composable Vue 3 qui retourne les références réactives du store router.</p>
  <h4 class="h4">Retour</h4>
  <table class="t-default">
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
        <td>urlIntented</td>
        <td>Ref&lt;String&gt;</td>
        <td>'/'</td>
        <td>
          URL que l'utilisateur tentait d'accéder avant d'être redirigé (utilisée par
          <span class="badge-code">redirectAfterLogin</span>)
        </td>
      </tr>
    </tbody>
  </table>
  <h4 class="h4">Utilisation</h4>
  <div class="div-code">
    import { useRouterStore } from "@brugmann/vuemann/src/services/router/src/router-store.js"<br />
    <br />
    const { urlIntented } = useRouterStore()<br />
    <br />
    <span class="color-neutral-500">// Sauvegarder l'URL tentée avant redirection vers login</span
    ><br />
    urlIntented.value = '/admin/users'<br />
    <br />
    <span class="color-neutral-500"
      >// Après login, redirection automatique via redirectAfterLogin()</span
    >
  </div>

  <h2 class="h2">Navigation Guards</h2>
  <p>
    Le routeur utilise des guards de navigation pour gérer la sécurité et le comportement
    automatique.
  </p>

  <h3 class="h3">beforeEach (Guard de navigation)</h3>
  <p>Exécuté avant chaque navigation. Vérifie plusieurs conditions de sécurité et d'accès.</p>
  <h4 class="h4">Vérifications effectuées</h4>
  <table class="t-default">
    <thead>
      <tr>
        <th>Ordre</th>
        <th>Vérification</th>
        <th>Action si échec</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>1</td>
        <td>Route 'error' ?</td>
        <td>Autorise sans vérifications (évite boucle infinie)</td>
      </tr>
      <tr>
        <td>2</td>
        <td>API Status OK ?</td>
        <td>Redirige vers '/error' si API indisponible</td>
      </tr>
      <tr>
        <td>3</td>
        <td>Route protégée par rôles ?</td>
        <td>Vérifie si l'utilisateur a au moins un des rôles requis</td>
      </tr>
      <tr>
        <td>4</td>
        <td>Utilisateur a un rôle requis ?</td>
        <td>Redirige vers '/' avec message d'avertissement si aucun rôle valide</td>
      </tr>
    </tbody>
  </table>
  <h4 class="h4">Fonctionnement de la protection par rôles</h4>
  <div class="div-code">
    <span class="color-neutral-500">// Dans router-functions.js</span><br />
    if (to.meta?.roles === undefined || to.meta.roles.length === 0) {<br />
    &emsp;return next() <span class="color-neutral-500">// Pas de protection</span><br />
    }<br />
    <br />
    <span class="color-neutral-500">// Logique OR : au moins UN rôle requis</span><br />
    const hasAccess = to.meta.roles.some(role => auth.hasRole(role))<br />
    if (!hasAccess) {<br />
    &emsp;flash.warningT('access_denied')<br />
    &emsp;return next('/') <span class="color-neutral-500">// Redirection homepage</span><br />
    }
  </div>

  <h3 class="h3">afterEach (Guard post-navigation)</h3>
  <p>Exécuté après chaque navigation réussie. Met à jour automatiquement le titre de la page.</p>

  <h2 class="h2">Fonctionnalités avancées</h2>
  <h3 class="h3">Service Routes</h3>
  <p>
    En plus des routes de l'application, le routeur charge automatiquement les routes déclarées par
    chaque service (champ <span class="badge-code">routes</span> de son init), agrégées via
    <span class="badge-code">getAllRegisteredRoutes()</span>. Ces routes sont utilisées par les
    services Vuemann (pages de debug, error, login, etc.).
  </p>

  <h3 class="h3">Catch-all (URL inconnue)</h3>
  <p>
    Une route catch-all nommée <span class="badge-code">not-found</span> est ajoutée automatiquement
    comme dernière entrée du router. Lorsque l'utilisateur navigue vers une URL qui ne correspond à
    aucune route enregistrée (ni applicative, ni service), il est redirigé vers
    <span class="badge-code">/</span> et un flash d'erreur traduit
    <span class="badge-code">error_url_unknown</span>
    est affiché avec l'URL demandée. Aucune configuration n'est requise dans les applications
    enfant.
  </p>
  <p>
    <i class="fa-solid fa-triangle-exclamation color-warning mr-5"></i>
    Si une application enfant définit sa propre route catch-all, elle sera appliquée en priorité
    (les routes applicatives sont déclarées avant le catch-all Vuemann).
  </p>

  <h3 class="h3">Validation des routes</h3>
  <p>
    La méthode <span class="badge-code">addRoute()</span> et
    <span class="badge-code">push()</span> effectuent des validations automatiques :
  </p>
  <ul class="list ml-25">
    <li>
      <strong>addRoute</strong> - Vérifie la présence de <span class="badge-code">path</span> et
      <span class="badge-code">component</span>, affiche un message d'erreur traduit si manquant
    </li>
    <li>
      <strong>push</strong> - Vérifie l'existence de la route (par nom ou path), affiche un message
      d'erreur traduit si non trouvée
    </li>
    <li>
      <strong>replace</strong> - Même validation que <span class="badge-code">push</span>, mais
      navigue sans ajouter d'entrée dans l'historique du navigateur
    </li>
  </ul>

  <h3 class="h3">Intégration avec Auth</h3>
  <p>Le router travaille en étroite collaboration avec le service Auth pour :</p>
  <ul class="list ml-25">
    <li>Vérifier les rôles via <span class="badge-code">auth.hasRole()</span></li>
    <li>
      Gérer la redirection après login via <span class="badge-code">redirectAfterLogin()</span>
    </li>
    <li>
      Stocker l'URL tentée dans <span class="badge-code">urlIntented</span> pour redirection
      post-authentification
    </li>
  </ul>
</template>
