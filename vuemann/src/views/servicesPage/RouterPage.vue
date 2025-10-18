<template>
  <h1 class="h1 color-primary">Service Router</h1>
  <p>Ce service permet de gérer les routes de l'application</p>
  <h2 class="h2">Installation</h2>
  <ul class="list ml-25 f-column g-5">
    <li>Importer <span class="badge-code">routerService</span> dans l'objet services situé dans le fichier main.js.</li>
    <li>Importer <span class="badge-code">routerPlugin</span> dans l'array plugins_synchrone dans le fichier main.js.</li>
  </ul>
  <h3 class="h3">Dépendances</h3>
  <p>
    Ce service utilise le package externe <a href="https://router.vuejs.org/guide/" class="underline link-underline" target="_blank">vue-router</a>. 
    En plus de ce package, ce service est dépedants des services :
  </p>
  <ul class="list ml-25">
    <li>auth - methodes routeAuthCheck et getAccessToken</li>
    <li>utils - methode apiStatus</li>
  </ul>
  <h3 class="h3">Configuration</h3>
  <p>
    Comme expliqué dans la documentation de vue-router, les routes sont gérées par un objet de route. Vous pouvez préciser 
    plusieurs options dans la clé <span class="badge-object">meta</span>. Voici le lien vers la documentations des
    <router-link :to="{name: 'config'}" class="underline link-underline">fichiers de configuration</router-link>.
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
        <td>auth</td>
        <td>Bool</td>
        <td>
          Si cette méta est renseignée, l'utilisateur doit être connecté pour accéder à cette route.
        </td>
      </tr>
    </tbody>
  </table>
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
        <td>
          Route représenter sous forme d'objet à ajouter au routeur.
        </td>
      </tr>
    </tbody>
  </table>
  <h4 class="h4">Utilisation</h4>  
  <div class="div-code">
    serviceM.service('routeur:addRoute', {<br />    &emsp;path: "/",<br />    &emsp;name: "home",<br />    &emsp;component: Home,<br />    })
  </div>
  <p>
    <i class="fa-solid fa-triangle-exclamation color-danger mr-5"></i>
    Votre objet dois au minimum posséder les clés <span class="badge-code">path</span> 
    et <span class="badge-code">component</span> pour être prise en compte par le router.
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
        <td>
          Route représenter sous forme d'objet ou d'url.
        </td>
      </tr>
    </tbody>
  </table>
  <h4 class="h4">Utilisation</h4>  
  <div class="div-code">
    <span class="color-neutral-700">//appel via ServiceManager</span><br />
    import { servicesM } from '@brugmann/vuemann/src/services/services-manager.js'<br />
    servicesM.service('routeur:push', 'route_url')<br /><br />
    <span class="color-neutral-700">//appel via servicesHelper</span><br />
    import { router } from '@brugmann/vuemann/src/services/services-helper.js'<br />
    router.push('route_url')
  </div>
  <!-- hasApiRoute -->
  <h3 class="h3"><i class="fa-solid fa-diamond mr-5"></i>hasApiRoute</h3>
  <p>Permet de savoir si une route api est définie dans le fichier de configuration <span class="badge-code">routes-api-config.js</span>.</p>
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
        <td>
          Nom de la route
        </td>
      </tr>
    </tbody>
  </table>
  <h4 class="h4">Utilisation</h4>  
  <div class="div-code">
    serviceM.service('routeur:hasApiRoute', 'route_name')
  </div>
  <!-- redirectAfterLogin -->
  <h3 class="h3"><i class="fa-solid fa-diamond mr-5"></i>redirectAfterLogin</h3>
  <p>Permet de rediriger l'utilisateur vers l'url qu'il a essayé d'atteindre après cette connecté.</p>
  <h4 class="h4">Utilisation</h4>  
  <div class="div-code">
    serviceM.service('routeur:redirectAfterLogin')
  </div>
  <!-- currentRoute -->
  <h3 class="h3"><i class="fa-solid fa-diamond mr-5"></i>currentRoute</h3>
  <p>Permet de récupérer la route courante.</p>
  <h4 class="h4">Utilisation</h4>  
  <div class="div-code">
    <span class="color-neutral-700">//appel via ServiceManager</span><br />
    import { servicesM } from '@brugmann/vuemann/src/services/services-manager.js'<br />
    servicesM.service('routeur:currentRoute')<br /><br />
    <span class="color-neutral-700">//appel via servicesHelper</span><br />
    import { route } from '@brugmann/vuemann/src/services/services-helper.js'<br />
    route.current()
  </div>
  <!-- getCurrentRouteParam -->
  <h3 class="h3"><i class="fa-solid fa-diamond mr-5"></i>getCurrentRouteParam</h3>
  <p>Permet de récupérer un paramètre de la route courante.</p>
  <h4 class="h4">Utilisation</h4>  
  <div class="div-code">
    <span class="color-neutral-700">//appel via ServiceManager</span><br />
    import { servicesM } from '@brugmann/vuemann/src/services/services-manager.js'<br />
    servicesM.service('routeur:getCurrentRouteParam', 'param_name')<br /><br />
    <span class="color-neutral-700">//appel via servicesHelper</span><br />
    import { route } from '@brugmann/vuemann/src/services/services-helper.js'<br />
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
  <p>Retourne <span class="badge-code">true</span> si le paramètre existe dans les params ou query de la route courante, <span class="badge-code">false</span> sinon.</p>
  <h4 class="h4">Utilisation</h4>  
  <div class="div-code">
    <span class="color-neutral-700">//appel via ServiceManager</span><br />
    import { servicesM } from '@brugmann/vuemann/src/services/services-manager.js'<br />
    servicesM.service('router:hasCurrentRouteParam', 'param_name')<br /><br />
    <span class="color-neutral-700">//appel via servicesHelper</span><br />
    import { route } from '@brugmann/vuemann/src/services/services-helper.js'<br />
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
  <p>Retourne <span class="badge-code">true</span> si la route existe, <span class="badge-code">false</span> sinon.</p>
  <h4 class="h4">Utilisation</h4>  
  <div class="div-code">
    <span class="color-neutral-700">//appel via ServiceManager</span><br />
    import { servicesM } from '@brugmann/vuemann/src/services/services-manager.js'<br />
    servicesM.service('router:hasRoute', 'route_name')<br /><br />
    <span class="color-neutral-700">//appel via servicesHelper</span><br />
    import { router } from '@brugmann/vuemann/src/services/services-helper.js'<br />
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
  <div class="div-code">
    serviceM.service('routeur:getRoute', 'route_name')
  </div>
  <!-- getRoutes -->
  <h3 class="h3"><i class="fa-solid fa-diamond mr-5"></i>getRoutes</h3>
  <p>Permet de récupérer toutes les routes enregistrées dans le router.</p>
  <h4 class="h4">Retour</h4>
  <p>Retourne un <span class="badge-code">Array</span> contenant toutes les routes configurées dans l'application.</p>
  <h4 class="h4">Utilisation</h4>  
  <div class="div-code">
    <span class="color-neutral-700">//appel via ServiceManager</span><br />
    import { servicesM } from '@brugmann/vuemann/src/services/services-manager.js'<br />
    const routes = servicesM.service('router:getRoutes')<br /><br />
    <span class="color-neutral-700">//appel via servicesHelper</span><br />
    import { router } from '@brugmann/vuemann/src/services/services-helper.js'<br />
    const routes = router.getRoutes()
  </div>
</template>
