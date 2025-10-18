<template>
  <h1 class="h1">Les services</h1>
  <p>
    Vuemann intégre un ensemble de service réutilisable ayant pour but de réduire les dépendences et simplifier votre développement.
  </p>
  <h2 class="h2">Liste des composents disponibles</h2>
  <ul class="list ml-25">
    <li>
      <router-link :to="{name: 'services.ajax'}" class="link-underline">Ajax</router-link>
    </li>
    <li>
      <router-link :to="{name: 'services.auth'}" class="link-underline">Auth</router-link>
    </li>
    <li>
      <router-link :to="{name: 'services.flash'}" class="link-underline">Flash</router-link>
    </li>
    <li>
      <router-link :to="{name: 'services.form'}" class="link-underline">Form</router-link>
    </li>
    <li>
      <router-link :to="{name: 'services.locale'}" class="link-underline">Locale</router-link>
    </li>
    <li>
      <router-link :to="{name: 'services.log'}" class="link-underline">Log</router-link>
    </li>
    <li>
      <router-link :to="{name: 'services.router'}" class="link-underline">Router</router-link>
    </li>
    <li>
      <router-link :to="{name: 'services.utils'}" class="link-underline">Utils</router-link>
    </li>
    <li>
      <router-link :to="{name: 'services.websocket'}" class="link-underline">Websocket</router-link>
    </li>
  </ul>
  <h2 class="h2">Service Manager</h2>
  <p>
    Il s'agit d'un fichier qui à pour but que les services ne dépendent pas les un des autre. Lorsqu'un service a besoin d'un autre service, 
    il fera appel au service manager et non au service directement. Cela a pour but de faciliter l'installation des services et de rendre l'application plus 
    robuste lorsqu'un service est manquant.
  </p>
  <div class="div-code">
    <span class="color-green">//Bonne pratique</span><br />    import {serviceM} from "../services-manager.js"<br />    router.beforeEach(serviceM.service('auth:routesAuthCheck'))<br />    <br />    <span class="color-danger">//Mauvaise Pratique</span><br />    import {routeAuthCheck} from '@/services/auth/auth-functions.js'<br />    router.beforeEach(routeAuthCheck)<br />  </div>
  <p>
    Dans l'exemple ci-dessus, en important directement routeAuthCheck dans le service router, si ce dernier n'est pas présent, l'application crashera. Avec la seconde solution,
    le service manager va verrifier que le service auth existe est qu'il possède bien la méthode routeAuthCheck. Si ce n'est pas le cas, il l'inscrira dans un 
    console.log. L'application continuera de fonctionner, mais les routes ne seront pas protégées.
  </p>
  <h3 class="h3">Méthodes</h3>
  <!-- initServices -->
  <h3 class="h4"><i class="fa-solid fa-diamond mr-5"></i>initServices</h3>
  <p>
    Permet d'enregistrer les services dans le fichiers <span class="badge-code">main.js</span> et <span class="badge-code">vitest.setup.js</span>.
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
        <td>services</td>
        <td>Object</td>
        <td>oui</td>
        <td>
          Objet important l'ensemble des fichiers services.
        </td>
      </tr>
    </tbody>
  </table>
  <!-- hasService -->
  <h3 class="h4"><i class="fa-solid fa-diamond mr-5"></i>hasService</h3>
  <p>
    Permet de savoir si un service est enregistré au prêt du service mananger.
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
        <td>service_name</td>
        <td>String</td>
        <td>oui</td>
        <td>
          Nom du service
        </td>
      </tr>
    </tbody>
  </table>
  <h4 class="h4">retour</h4>  
  <table class="t-default">
    <thead>
      <tr>
        <th>Type</th>
        <th>Description</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>Bool</td>
        <td>
          Présence ou non du service au sein du service manager.
        </td>
      </tr>
    </tbody>
  </table>
  <!-- getServices -->
  <h3 class="h4"><i class="fa-solid fa-diamond mr-5"></i>getServices</h3>
  <p>
    Permet de récupérer l'ensemble des noms des services enregistré dans le serviceManager.
  </p>
  <h4 class="h4">retour</h4>  
  <table class="t-default">
    <thead>
      <tr>
        <th>Type</th>
        <th>Description</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>Array(string)</td>
        <td>
          Array des noms des service
        </td>
      </tr>
    </tbody>
  </table>
  <!-- service -->
  <h3 class="h4"><i class="fa-solid fa-diamond mr-5"></i>service</h3>
  <p>
    Permet d'appler la méthode d'un service.
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
        <td>service</td>
        <td>String</td>
        <td>oui</td>
        <td>-</td>
        <td>
          Nom du service et nom de la méthode a appler. Vous devez respecter cette nomenclature :<br /> {nom du service}:{nom de la methode}
        </td>
      </tr>
      <tr>
        <td>method_params</td>
        <td>Object|Array|String</td>
        <td>non</td>
        <td>undefined</td>
        <td>
          Correspond au parmaètre de la méthode appelée. Si la méthode n'a qu'un seul paramètre vous pouvez le 
          passer simplement comme second paramètre de la méthode service. Si la méthode possède plusieurs Paramètres
          vous devez les passer dans un array.
        </td>
      </tr>
    </tbody>
  </table>
  <h4 class="h4">retour</h4>  
  <p>
    Le retour est fonction du retour de la méthode appelée.
  </p>
  <h4 class="h4">exemple</h4>
  <div class="div-code">
    <span class="color-neutral-500">//exemple avec un paramètre</span><br />    import {serviceMethod} from "../services-manager.js"<br />    router.beforeEach(serviceM.service('router:addRoute', 'route_url'))<br />    <br />    <span class="color-neutral-500">//exemple avec plusieurs paramètres</span><br />    import { servicesM } from "@brugmann/vuemann/src/services/services-manager.js"<br />    servicesM.service('ajax:req', ['users.show', {params: {id: 1}}])<br /> 
  </div>
  <h2 class="h2">Structure</h2>
  <p>
    Afin que la compréhension et la maintenance d'un service soit facile, une structure commune a été mise en place.
  </p>
  <div class="div-code">
    service<br />    &emsp;|- images<br />    &emsp;|- locales<br />    &emsp;|&emsp;|- en<br />    &emsp;|&emsp;|&emsp;|- service-en.json<br />    &emsp;|&emsp;|- fr<br />    &emsp;|&emsp;|&emsp;|- service-fr.json<br />    &emsp;|&emsp;|- nl<br />    &emsp;|&emsp;|&emsp;|- service-nl.json<br />    &emsp;|- init<br />    &emsp;|&emsp;|- service-plugin.js<br />    &emsp;|&emsp;|- service-service.js<br />    &emsp;|- src<br />    &emsp;|&emsp;|- service-functions.js<br />    &emsp;|&emsp;|- service-store.js<br />    &emsp;|&emsp;|- controllers<br />    &emsp;|&emsp;|- dtos<br />    &emsp;|&emsp;|- models<br />    &emsp;|&emsp;|- repositories<br />    &emsp;|- views<br />    &emsp;|&emsp;|- ServiceComponent.vue<br />    &emsp;|- service-init.js<br />    &emsp;|- service-routes.js<br />    &emsp;|- service-vite.js<br />  </div>
  <p>
    L'exemple ci-dessus reprends la structure générique d'un service
  </p>
  <h2 class="h2">Description des dossiers</h2>
  <h3 class="h3">Dossier images et traductions</h3>
  <p>
    Ces dossiers vont être automatiquement importé dans le dossier public de votre application.
  </p>
  <h3 class="h3">Le dossier init</h3>
  <p>
    Ce dossier contient les fichiers d'initialisation du service :
  </p>
  <ul class="list ml-25">
    <li><span class="badge-code">{service}-service.js</span> : Objet contenant les méthodes du service</li>
    <li><span class="badge-code">{service}-plugin.js</span> : Fonction retournant un objet plugin Vue.js</li>
  </ul>
  <h3 class="h3">Le dossier src</h3>
  <p>
    Ce dossier peut être vue comme un "sous-service". Il est composé de fichiers dédiés à la logique d'un thème précis.
  </p>
  <div class="div-code">
    const set = username => {<br />    
    &emsp;localStorage.setItem('current_user', username)<br />    
    }<br />    
    const get = () => {<br />    
    &emsp;return localStorage.getItem('current_user')<br />    
    }<br />    
    const remove = () => {<br />    
    &emsp;localStorage.removeItem('current_user')<br />    
    }<br />    <br />    
    export const currentUser = {set, get, remove}<br />  </div>
  <p>
    L'exemple ci-dessus reprendre le thème de l'utilisateur courant.
  </p>
  <h3 class="h3">Le dossier views</h3>
  <p>
    Ce dossier contient tous les components du services. Ces fichiers doivent avoir l'extention .vue.
  </p>
  <h2 class="h2">Description des fichiers</h2>
  <h3 class="h3">Le fichier d'initialisation</h3>
  <p>
    Ce fichier (<span class="badge-code">{service}-init.js</span>) est le point d'entrée du service. Il exporte un objet contenant :
  </p>
  <ul class="list ml-25">
    <li><span class="badge-code">dependencies</span> : Array des services dont dépend ce service</li>
    <li><span class="badge-code">services</span> : Objet contenant les méthodes du service</li>
    <li><span class="badge-code">plugin</span> : Fonction retournant un objet plugin Vue.js</li>
  </ul>
  <h3 class="h3">Le fichier de service</h3>
  <p>
    Ce fichier (<span class="badge-code">{service}-service.js</span>) comprend toutes les fonctions accessibles par d'autres services. Ces fonctions sont regroupées et 
    exportées dans l'objet <span class="badge-code">{nom du service}Service</span>.
  </p>
  <div class="div-code">
    export const authService = { <br />    &emsp;refreshToken, <br />    &emsp;routeAuthCheck, <br />    &emsp;logout, <br />    &emsp;currentUser : currentUser.get,<br />    &emsp;getAccessToken : apiToken.getAccessToken<br />    }
  </div>
  <p>
    L'exemple ci-dessus montre l'objet qui exporte les fonctions du service auth.
  </p>
  <h3 class="h3">Le fichier functions</h3>
  <p>
    Ce fichier comprend toutes les fonctions accéssibles par sein du service. Cela peut être dans un fichier src, un fichier vieww ... Ces fonctions sont 
    regroupées et exportées dans l'objet <span class="badge-code">{nom du service}Functions</span>. Tous comme le fichier de service, le fichier functions peut comporter 
    des fonctions internes permettant une meilleur compréhansion du code et utilisées uniquement dans le fichier de functions. 
    Ces fonctions sont regroupées dans l'objet <span class="badge-code">{nom du service}FunctionsInternal</span>. Elle ne sont 
    exportable que pour pouvoir être tester.
  </p>
  <div class="div-code">
    export const authFunctions = { <br />    &emsp;login, <br />    &emsp;generateError, <br />    &emsp;canRefreshToken <br />    }
  </div>
  <h3 class="h3">Le fichier plugin</h3>
  <p>
    Ce fichier est une fonction qui retourne un objet plugin Vue.js. Il permet de réaliser une action au moment de la création de l'instance de vue. 
    <a class="underline link-underline" href="https://vuejs.org/guide/reusability/plugins" target="_blank">Cliquez ici pour plus de renseignements sur les plugins de vue </a> 
  </p>
  <div class="div-code">
    import axios from 'axios'<br />    import { httpClient } from '@brugmann/vuemann/src/services/ajax/src/models/http-client.js'<br />    <br />    export const ajaxPlugin = () => ({<br />    &emsp;install() {<br />    &emsp;&emsp;httpClient.init(axios)<br />    &emsp;},<br />    })<br />  </div>
  <p>
    L'exemple ci-dessus montre le plugin du service ajax
  </p>
  <h3 class="h3">Le fichier route</h3>
  <p>
    Ce fichier permet d'ajouter automatiquement des routes à l'application au moment de l'instanciation du router. 
    <a class="underline link-underline" href="https://router.vuejs.org/guide/essentials/named-routes.html" target="_blank">Documentation des routes de vue </a> 
  </p>
  <div class="div-code">
    import Login from '@brugmann/vuemann/src/services/auth/views/LoginComponent.vue'<br />    <br />    export const authRoutes =  [<br />    &emsp;{<br />    &emsp;&emsp;path: '/login',<br />    &emsp;&emsp;name: 'login',<br />    &emsp;&emsp;component: Login,<br />    &emsp;}<br />    ]<br />  </div>
  <p>
    L'exemple ci-dessus montre le fichier de route du service auth
  </p>
  <h3 class="h3">Le fichier store</h3>
  <p>
    Ce fichier (<span class="badge-code">{service}-store.js</span>) se trouve dans le dossier <span class="badge-code">src</span> et permet d'avoir un store dédié au service.
    <a class="underline link-underline" href="https://pinia.vuejs.org/core-concepts/" target="_blank">Documentation des stores de vue </a> 
  </p>
  <h3 class="h3">Le fichier Vite</h3>
  <p>
    Ce fichier (<span class="badge-code">{service}-vite.js</span>) permet d'exécuter une fonction au moment de la compilation de viteJs. Ce fichier doit être inclus dans le fichier de configuration de viteJS. 
    <a class="underline link-underline" href="https://vite.dev/guide/api-plugin.html" target="_blank">Documentation des plugins viteJs routes de vue </a> 
  </p>
  <p>
    <i class="fa-solid fa-triangle-exclamation color-danger mr-5"></i>
    Dans un fichier Plugin de vite, vous vous trouvez dans un context node.js et non dans un context vue.js.
    <i class="fa-solid fa-triangle-exclamation color-danger ml-5"></i>
  </p>
  <h2 class="h2">Installation</h2>
  <p>
    L'installation d'un service est maintenant extrêmement simple. Un seul fichier d'initialisation doit être créé et enregistré dans le fichier <span class="badge-code">main.js</span>.
  </p>
  <h3 class="h3">Fichier d'initialisation du service</h3>
  <p>
    Chaque service doit avoir un fichier <span class="badge-code">{service}-init.js</span> qui exporte un objet contenant :
  </p>
  <ul class="list ml-25">
    <li><span class="badge-code">dependencies</span> : Array des services dont dépend ce service</li>
    <li><span class="badge-code">services</span> : Objet contenant les méthodes du service</li>
    <li><span class="badge-code">plugin</span> : Fonction retournant un objet plugin Vue.js</li>
  </ul>
  <div class="div-code">
    import { ajaxService } from '@brugmann/vuemann/src/services/ajax/init/ajax-service.js'<br />    import { ajaxPlugin } from '@brugmann/vuemann/src/services/ajax/init/ajax-plugin.js'<br />    <br />    export const ajaxInit = {<br />    &emsp;dependencies: ['locale'],<br />    &emsp;services: ajaxService,<br />    &emsp;plugin: ajaxPlugin<br />    }
  </div>
  <h3 class="h3">Enregistrement dans main.js</h3>
  <p>
    Le service doit être enregistré dans la fonction <span class="badge-code">initServices</span> du fichier <span class="badge-code">main.js</span> :
  </p>
  <div class="div-code">
    import { servicesM } from '@brugmann/vuemann/src/services/services-manager.js'<br />    import { ajaxInit } from './services/ajax/ajax-init.js'<br />    <br />    await servicesM.initServices(app, {<br />    &emsp;ajax: ajaxInit,<br />    &emsp;locale: localeInit,<br />    &emsp;// ... autres services<br />    })
  </div>
  <h3 class="h3">Fichier Vite (optionnel)</h3>
  <p>
    Si le service nécessite une configuration Vite spécifique, le fichier <span class="badge-code">{service}-vite.js</span> doit être enregistré dans <span class="badge-code">vite.config.js</span>.
  </p>
  <div class="div-code">
    export default defineConfig({<br />    &emsp;plugins: [<br />    &emsp;&emsp;localeVite(__dirname),<br />    &emsp;&emsp;vue(),<br />    &emsp;],<br />    &emsp;...<br />    })
  </div>
  <h2 class="h2">Les raccourcis</h2>
  <p>
    L'Utilisation du service manager peut être un peu lourde surtout avec des fonctions utilisé régulièrement. C'est pour cela que Vuemann intégre des raccourcis.
  </p>
  <h3 class="h3">Utilisation</h3>
  <p>
    Tous les raccourcis sont inclus dans le fichier services-helper.js situé directement dans le dossier services de Vuemann. 
  </p>
  <div class="div-code">
    import { shortcut_name } from "@brugmann/vuemann/src/services/services-helper.js"
  </div>
  <h3 class="h3">Raccourcis disponible</h3>
  <!-- t -->
  <h4 class="h4"><i class="fa-solid fa-diamond mr-5"></i>t</h4>
  <p>
    Raccourci pour la fonction de traduction. <router-link :to="{name: 'services.locale'}" class="link-underline underline" target="_blank">Service Locale</router-link> 
    <br /><strong>Note :</strong> Ce raccourci est lui-même un raccourci de <span class="badge-code">locale.t()</span>
  </p>
  <div class="div-code">
    t('key_text', {'name', 'john'})
  </div>
  <!-- req -->
  <h4 class="h4"><i class="fa-solid fa-diamond mr-5"></i>req</h4>
  <p>
    Raccourci pour la fonction qui effectue les requête ajax. <router-link :to="{name: 'services.ajax'}" class="link-underline underline" target="_blank">Service ajax</router-link> 
    <br /><strong>Note :</strong> Ce raccourci est lui-même un raccourci de <span class="badge-code">ajax.req()</span>
  </p>
  <div class="div-code">
    req('route_name')
  </div>
  <!-- locale -->
  <h4 class="h4"><i class="fa-solid fa-diamond mr-5"></i>locale</h4>
  <p>
    Objet contenant les fonctions du service locale.
  </p>
  <div class="div-code">
    locale.current()<br />    locale.t('key_text', {'name', 'john'})
  </div>
  <!-- auth -->
  <h4 class="h4"><i class="fa-solid fa-diamond mr-5"></i>auth</h4>
  <p>
    Objet contenant les fonctions du service auth.
  </p>
  <div class="div-code">
    auth.user()<br />    auth.hasRole('admin')
  </div>
  <!-- ajax -->
  <h4 class="h4"><i class="fa-solid fa-diamond mr-5"></i>ajax</h4>
  <p>
    Objet contenant les fonctions du service ajax.
  </p>
  <div class="div-code">
    ajax.req('route_name', datas, options)
  </div>
  <!-- flash -->
  <h4 class="h4"><i class="fa-solid fa-diamond mr-5"></i>flash</h4>
  <p>
    Objet contenant les fonctions du service flash.
  </p>
  <div class="div-code">
    flash.success('message')<br />    flash.error('message')<br />    flash.successT('key', params)<br />    flash.errorT('key', params)
  </div>
  <!-- form -->
  <h4 class="h4"><i class="fa-solid fa-diamond mr-5"></i>form</h4>
  <p>
    Objet contenant les fonctions du service form.
  </p>
  <div class="div-code">
    form.validate(rules, datas, options)<br />    form.getErrors()<br />    form.getError('input_name')<br />    form.hasError('input_name')<br />    form.addError('input_name', error)<br />    form.clearError('input_name')<br />    form.clearErrors()
  </div>
  <!-- log -->
  <h4 class="h4"><i class="fa-solid fa-diamond mr-5"></i>log</h4>
  <p>
    Objet contenant les fonctions du service log.
  </p>
  <div class="div-code">
    log.send(error, context)
  </div>
  <!-- ws -->
  <h4 class="h4"><i class="fa-solid fa-diamond mr-5"></i>ws</h4>
  <p>
    Le raccourci ws est un objet de fonction. Il va permettre d'utiliser les fonctions du service websocket. <router-link :to="{name: 'services.websocket'}" class="link-underline underline" target="_blank">Service websocket</router-link>.
  </p>
  <div class="div-code">
    ws.open(route_name)<br />    <br />    ws.register(route_name, event, cb)<br />    <br />    ws.close.(route_name)
  </div>
  <!-- router -->
  <h4 class="h4"><i class="fa-solid fa-diamond mr-5"></i>router</h4>
  <p>
    Objet contenant les fonctions du service router.
  </p>
  <div class="div-code">
    router.push(route)<br />    router.hasRoute(route_name)<br />    router.getRoutes()
  </div>
  <!-- route -->
  <h4 class="h4"><i class="fa-solid fa-diamond mr-5"></i>route</h4>
  <p>
    Objet contenant les fonctions pour accéder à la route courante.
  </p>
  <div class="div-code">
    route.current()<br />    route.get(param_name)<br />    route.has(param_name)
  </div>
  <!-- url -->
  <h4 class="h4"><i class="fa-solid fa-diamond mr-5"></i>url</h4>
  <p>
    Objet contenant les fonctions pour générer des URLs.
  </p>
  <div class="div-code">
    url.generateUrl(route_name, params, api)<br />    url.generateSubdirectory(route_name, params)
  </div>
</template>
