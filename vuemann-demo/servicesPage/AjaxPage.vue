<script setup>
import { ref } from 'vue'
import { req } from '@brugmann/vuemann/src/shortcuts/services-shortcut.js'
import { STATUS } from '@brugmann/vuemann/src/constants/ajax-constants.js'
import { requestInterceptor } from '@brugmann/vuemann/src/services/ajax/src/models/request-interceptor.js'

const loading = ref(false)
const responseData = ref()
const responseStatus = ref()
const activeMethod = ref('')

const resetResponse = () => {
  responseData.value = undefined
  responseStatus.value = undefined
}

const executeRequest = async (method, routeName, options = {}) => {
  loading.value = true
  activeMethod.value = method
  resetResponse()

  const response = await req(routeName, {
    ...options,
    flash: false,
    log: false,
  })
  responseStatus.value = response.status
  responseData.value = response.data
  loading.value = false
}

const testGet = () => executeRequest('GET', 'demo.posts.show', { params: { id: 1 } })

const testPost = () =>
  executeRequest('POST', 'demo.posts.create', {
    body: {
      title: 'Test POST',
      body: 'Contenu de test',
      userId: 1,
    },
  })

const testPut = () =>
  executeRequest('PUT', 'demo.posts.update', {
    params: { id: 1 },
    body: {
      id: 1,
      title: 'Test PUT',
      body: 'Contenu modifié',
      userId: 1,
    },
  })

const testPatch = () =>
  executeRequest('PATCH', 'demo.posts.patch', {
    params: { id: 1 },
    body: { title: 'Test PATCH' },
  })

const testDelete = () => executeRequest('DELETE', 'demo.posts.delete', { params: { id: 1 } })

const interceptorHeaders = ref()
const testRequestInterceptor = () => {
  const config = requestInterceptor({})
  interceptorHeaders.value = config.headers
}

const NON_EXISTENT_POST_ID = 9999
const errorResult = ref()
const errorLoading = ref(false)
const errorLabel = ref('')

const executeErrorTest = async (label, options) => {
  errorLoading.value = true
  errorLabel.value = label
  errorResult.value = undefined

  const response = await req('demo.posts.show', {
    params: { id: NON_EXISTENT_POST_ID },
    log: false,
    ...options,
  })
  errorResult.value = { status: response.status, data: response.data }
  errorLoading.value = false
}

const testErrorDefault = () => executeErrorTest('Par défaut', {})
const testErrorEmpty404 = () => executeErrorTest('empty404', { empty404: true, flash: false })
const testErrorCustom = () =>
  executeErrorTest('errors custom', { errors: { 404: 'custom_not_found' } })
const testErrorNoFlash = () => executeErrorTest('flash: false', { flash: false })

const abortResults = ref([])
const testAbort = async () => {
  abortResults.value = []
  const first = req('demo.posts.show', {
    params: { id: 1 },
    abort: true,
    flash: false,
    log: false,
  })
  const second = req('demo.posts.show', {
    params: { id: 2 },
    abort: true,
    flash: false,
    log: false,
  })

  const [firstResponse, secondResponse] = await Promise.all([first, second])
  abortResults.value = [
    { label: 'Requête 1 (annulée)', status: firstResponse.status },
    { label: 'Requête 2 (aboutie)', status: secondResponse.status },
  ]
}
</script>

<template>
  <h1 class="h1">Service Ajax</h1>
  <p>Permet de réaliser des requêtes ajax de type get, post, put, patch, delete</p>
  <h2 class="h2">Installation</h2>
  <p>
    Le service ajax est enregistré via <span class="badge-code">ajaxInit</span> dans la méthode
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
    <li>flash - methode error</li>
    <li>locale - methode t</li>
    <li>auth - methodes refreshToken et getAccessToken</li>
  </ul>
  <h2 class="h2">Configuration</h2>
  <h3 class="h3">Fichiers de configuration</h3>
  <p>Le service Ajax utilise deux fichiers de configuration principaux :</p>
  <ul class="list ml-25">
    <li>
      <span class="badge-code">src/config/routes-api-config.js</span> - Définit toutes les routes
      API disponibles
    </li>
    <li>
      <span class="badge-code">src/config/app-config.js</span> - Définit les URLs de base des APIs
      dans la propriété <span class="badge-code">apis</span>
    </li>
  </ul>
  <h2 class="h2">Fonctionnement des routes</h2>
  <h3 class="h3">Définition des urls des apis</h3>
  <p>
    Le fonctionnement de VueJs fait qu'il n'est pas possible d'utiliser des variables
    d'environnement directement depuis le fichier <span class="badge-code">.env</span>. Il est
    nécessaire d'utiliser la fonction <span class="badge-code">import.meta.env</span> pour que
    viteJs puisse les injecter au moment de la compilation.
  </p>
  <h4 class="fs-500 fw-400 color-primary">.env</h4>
  <div class="div-code">VITE_API_PATIENT_URL = "http://localhost:3001/"</div>
  <h4 class="fs-500 fw-400 color-primary">config/env.js</h4>
  <p>Dans la partie apis, vous devez ajouter le nom de l'api avec sont url:</p>
  <div class="div-code">
    export const app = { <br />
    &emsp;homepage_url : "/", <br />
    &emsp;apis : {<br />
    &emsp;&emsp;patient : {<br />
    &emsp;&emsp;&emsp;url : import.meta.env[`VITE_API_PATIENT_URL`],<br />
    &emsp;&emsp;}<br />
    &emsp;}<br />
    }
  </div>
  <p>
    Il est important de respecter la nomenclature de la variable d'environnement<span
      class="badge-code"
      >VITE_API_{nom de l'api}_URL</span
    >. Cela a son importance pour l'import des variable d'environnement par vitejs.
  </p>
  <h3 class="h3">Définition des routes d'api</h3>
  <p>
    Le fichier <span class="badge-code">config/routesApi.json</span> reprend l'ensemble des routes
    api de l'application. Une route doit être définie comme dans l'exemple ci-dessous.
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
        <td>Url correspondant à la route.</td>
      </tr>
      <tr>
        <td>api</td>
        <td>
          Nom de l'api pour laquelle il faut éxécuter cette route. Se réfère à la clé apis dans le
          fichier app-config.js
        </td>
      </tr>
      <tr>
        <td>method</td>
        <td>Méthode de la route (get, post, put ou delete)</td>
      </tr>
    </tbody>
  </table>
  <div class="div-code">
    // exemple<br />
    {<br />
    &emsp;"patients.index" : {"url": "v1/patients", "method" : "get", "api": "patient"},<br />
    }
  </div>
  <h4 class="h4">Paramètres dynamiques</h4>
  <p>
    Pour spécifier qu'une partie de l'url est dynamique, vous devais la mettre entre crochets
    <span class="badge-code">{}</span>.
  </p>
  <div class="div-code">
    // exemple<br />
    {<br />
    &emsp;"patients.update" : {"url": "v1/patients/{id}", "method" : "put", "api": "patient"},<br />
    }
  </div>
  <p>Dans l'exemple si dessus la partie <span class="badge-code">id</span> est dynamique.</p>
  <h4 class="h4">Routes Globales</h4>
  <p>
    Dans le fichier <span class="badge-route">routeApi.js</span> du template
    <a
      class="underline link-underline"
      href="https://gitmann.chu-brugmann.be/apps/chu-brugmann-vue-template"
      target="_blank"
      >chu-brugmann-vue-template</a
    >, vous pouvez voir la clé global. Elle reprend toutes les routes communes aux apis du
    chu-brugmann. Ces routes sont principalement utilisées par les services.
  </p>
  <div class="div-code">
    <span class="color-neutral-500">// exemple</span><br />
    {<br />
    &emsp;global : {<br />
    &emsp;&emsp;"api.openapi": {"url": "openapi.json", "method" : "get"},<br />
    &emsp;}<br />
    }
  </div>
  <p>
    L'exemple ci-dessus permet de vérifier qu'une API est disponible en récupérant son fichier
    <span class="badge-code">openapi.json</span>. A noter que les routes globales ne possèdent pas
    la clé <span class="badge-code">api</span>.
  </p>
  <h4 class="h4">Écraser des routes Globales</h4>
  <p>
    Vous avez la possibilité dans le cas ou l'api que vous voulez utiliser n'utilise pas une route
    standart, écraser la route globale. Pour cela ajouter le nom de l'api au nom de la route
    globale.
  </p>
  <div class="div-code">
    <span class="color-neutral-500">// exemple</span><br />
    {<br />
    &emsp;global : {<br />
    &emsp;&emsp;"api.openapi": {"url": "openapi.json", "method" : "get"},<br />
    &emsp;},<br />
    &emsp;"patient.api.openapi": {"url": "v1/openapi.json", "method" : "get", "api": "patient"},<br />
    }
  </div>
  <p>
    Dans l'exemple ci dessous, lorsque le service dédié vérifira l'état de l'api patient, l'url de
    la requête utilisé sera <span class="badge-code">v1/status</span> et pas
    <span class="badge-code">/</span>
  </p>
  <h2 class="h2">Reverse Proxy</h2>
  <p>
    Lorsque l'application est servie en HTTPS, les appels vers des APIs en HTTP simple sont bloqués
    par la politique de contenu mixte du navigateur. Vuemann peut réécrire de façon transparente les
    URLs de base absolues des APIs en chemins de même origine, routés ensuite via un reverse proxy
    (Caddy en production, middleware Vite en développement).
  </p>
  <h3 class="h3">Activation</h3>
  <p>
    Le proxy est désactivé par défaut. On l'active via deux clés dans
    <span class="badge-code">src/config/app-config.js</span> :
  </p>
  <table class="t-default">
    <thead>
      <tr>
        <th>Clé</th>
        <th>Type</th>
        <th>Default</th>
        <th>Description</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>app.proxy.enabled</td>
        <td>Boolean</td>
        <td>false</td>
        <td>
          Interrupteur principal. Lorsqu'il vaut <span class="badge-code">false</span>, aucune URL
          n'est réécrite&nbsp;: les applications existantes ne sont pas impactées.
        </td>
      </tr>
      <tr>
        <td>app.apis.{nom}.proxy</td>
        <td>Boolean</td>
        <td>true</td>
        <td>
          Mettre à <span class="badge-code">false</span> pour exclure une API du proxy (ex.
          <span class="badge-code">beid</span>, le lecteur eID local au poste de travail qui doit
          rester un appel direct).
        </td>
      </tr>
    </tbody>
  </table>
  <div class="div-code">
    export const app = {<br />
    &emsp;proxy : { enabled : true },<br />
    &emsp;apis : {<br />
    &emsp;&emsp;beid : {<br />
    &emsp;&emsp;&emsp;url : import.meta.env[`VITE_API_BEID_URL`],<br />
    &emsp;&emsp;&emsp;proxy : false,<br />
    &emsp;&emsp;}<br />
    &emsp;}<br />
    }
  </div>
  <h3 class="h3">Schéma de réécriture des URLs</h3>
  <p>
    Chaque URL de base absolue est réécrite en un chemin de même origine auto-descriptif (<span
      class="badge-code"
      >/proxy/{scheme}/{host}/{port}{path}</span
    >). La transformation a lieu dans <span class="badge-code">defineApiUrl()</span> et couvre
    toutes les requêtes construites à partir de cette base.
  </p>
  <div class="div-code">
    http://brcontdev.chu-brugmann.be:8048/&emsp;-&gt;&emsp;/proxy/http/brcontdev.chu-brugmann.be/8048/<br />
    https://host.chu-brugmann.be/&emsp;-&gt;&emsp;/proxy/https/host.chu-brugmann.be/443/
  </div>
  <h3 class="h3">Liste blanche (protection SSRF)</h3>
  <p>
    Deux familles d'hôtes sont autorisées à traverser le proxy&nbsp;: les hôtes
    <span class="badge-code">*.chu-brugmann.be</span> (et
    <span class="badge-code">chu-brugmann.be</span> lui-même), ainsi que les IP privées
    <span class="badge-code">10.0.0.0/8</span> (backends HTTP de dev sur le réseau interne). Le
    contrôle est appliqué dans le middleware Vite (<span class="badge-code"
      >proxyHelper.isHostAllowed</span
    >) et reproduit à l'identique dans la regex Caddy en production&nbsp;: les deux doivent rester
    synchronisés. Toute requête vers un autre hôte est rejetée (<span class="badge-code">403</span>
    en dev, aucune route ne matche en prod).
  </p>
  <p>
    <i class="fa-solid fa-info-circle color-primary mr-5"></i>
    Un backend qui n'est <strong>ni</strong> sur un hôte
    <span class="badge-code">chu-brugmann.be</span> <strong>ni</strong> dans
    <span class="badge-code">10.0.0.0/8</span> — par exemple le lecteur eID
    <span class="badge-code">beid</span> sur <span class="badge-code">127.0.0.1:9000</span> — doit
    être exclu via <span class="badge-code">app.apis.{nom}.proxy : false</span> et reste un appel
    direct du navigateur.
  </p>
  <h3 class="h3">Serveur de développement et production</h3>
  <p>
    Le plugin <span class="badge-code">vuemannVite</span> enregistre automatiquement un hook
    <span class="badge-code">configureServer</span>
    qui installe le middleware de proxy en développement&nbsp;: aucune configuration supplémentaire
    n'est requise dans
    <span class="badge-code">vite.config.js</span>. En production, l'application doit fournir un
    Caddyfile qui matche le même motif de chemin et restreint hôte/port à la même liste blanche.
    Voir la documentation <span class="badge-code">memory-bank/doc/services/ajax.md</span> pour le
    snippet Caddy.
  </p>
  <h2 class="h2">Fonctions accessibles depuis le gestionnaire de service</h2>
  <!-- req -->
  <h3 class="h3"><i class="fa-solid fa-diamond mr-5"></i>req</h3>
  <p>
    Permet d'effectuer une requête ajax. La méthode de la requête sera réalisée en fonction de la
    définition de la route.
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
          nom de la route repris dans le fichier
          <span class="badge-code">config/routeApi.json</span>
        </td>
      </tr>
      <tr>
        <td>datas</td>
        <td>Object</td>
        <td>-</td>
        <td>{}</td>
        <td>
          Pour les méthodes de type post, put et patch, ce paramètre correspond aux datas envoyées
          lors de la requête.<br />
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
          Permet de préciser les paramètres dynamique de la requête. L'objet est composé de clé /
          valeur.<br />
          Si une clé n'est pas présente dans la définition de l'url de la route, elle sera ajoutée
          en paramètre GET.
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
        <td>Permet d'interrompre la requête si elle est lancée deux fois d'affilée.</td>
      </tr>
      <tr>
        <td>flash</td>
        <td>Bool</td>
        <td>-</td>
        <td>false</td>
        <td>Permet de ne pas afficher les erreurs rencontrées via le service flash.</td>
      </tr>
      <tr>
        <td>no-flash</td>
        <td>Array</td>
        <td>-</td>
        <td>[]</td>
        <td>
          Tableau de codes de statut HTTP pour lesquels les messages d'erreur ne doivent pas être
          affichés via flash. Utile pour gérer certaines erreurs de manière personnalisée. Exemple:
          <span class="badge-code">[404, 409]</span> pour ne pas afficher de flash sur les erreurs
          404 et 409.
        </td>
      </tr>
      <tr>
        <td>errors</td>
        <td>Object</td>
        <td>-</td>
        <td>{}</td>
        <td>
          Permet de personnaliser les messages d'erreur flash par code de statut HTTP. L'objet est
          composé de clé (code de statut) / valeur (clé de traduction). Exemple:
          <span class="badge-code">{ 404: 'user_not_found' }</span> affichera la traduction de
          'user_not_found' au lieu du message par défaut pour les erreurs 404. Messages par défaut:
          400→<span class="badge-code">error_bad_request</span>, 403→<span class="badge-code"
            >error_forbidden</span
          >, 404→<span class="badge-code">error_not_found</span>, 422→<span class="badge-code"
            >error_unprocessable</span
          >, 500→<span class="badge-code">error_server</span>, autre→<span class="badge-code"
            >error_unknown</span
          >.
        </td>
      </tr>
      <tr>
        <td>headers</td>
        <td>Object</td>
        <td>-</td>
        <td>{}</td>
        <td>Permet de rajouter des headers à la requête. L'objet est composé de clé / valeur.</td>
      </tr>
      <tr>
        <td>log</td>
        <td>Bool</td>
        <td>-</td>
        <td>true</td>
        <td>Permet de ne pas envoyer les logs au serveur de log.</td>
      </tr>
      <tr>
        <td>empty404</td>
        <td>Bool</td>
        <td>-</td>
        <td>false</td>
        <td>
          Permet de traiter les erreurs 404 comme des résultats vides. Retourne un tableau vide avec
          un statut 200 au lieu d'une erreur 404. Utile pour les recherches qui peuvent ne retourner
          aucun résultat.
        </td>
      </tr>
    </tbody>
  </table>
  <h4 class="h4">Utilisation</h4>
  <div class="div-code">
    import { servicesM } from "@brugmann/vuemann/src/services/services-manager.js"<br />
    <br />
    servicesM.service('ajax:req', ['users.show', {params: {id: 1}}])<br />
    <br />
    <span class="color-neutral-500">// Exemple avec empty404 pour les recherches</span><br />
    servicesM.service('ajax:req', ['users.search', {params: {query: 'john'}}, {empty404: true}])<br />
    <br />
    <span class="color-neutral-500"
      >// Exemple avec no-flash pour ne pas afficher certaines erreurs</span
    ><br />
    servicesM.service('ajax:req', ['users.validate', {email: 'test@example.com'}, {'no-flash':
    [409]}])
  </div>
  <!-- generateUrlFromRouteName -->
  <h3 class="h3"><i class="fa-solid fa-diamond mr-5"></i>generateUrlFromRouteName</h3>
  <p>Permet de générer une url à partir d'un nom de route et de paramètres.</p>
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
        <td>Nom de la route</td>
      </tr>
      <tr>
        <td>params</td>
        <td>Object</td>
        <td>-</td>
        <td>{}</td>
        <td>Paramêtres de la route clé / valeur.</td>
      </tr>
    </tbody>
  </table>
  <h4 class="h4">Utilisation</h4>
  <div class="div-code">
    import { servicesM } from "@brugmann/vuemann/src/services/services-manager.js"<br />
    <br />
    servicesM.service('ajax:generateUrlFromRouteName', ['users.show', {id: 1}])
  </div>
  <h2 class="h2">Constantes HTTP</h2>
  <p>
    Le fichier <span class="badge-code">ajax-constants.js</span> exporte des constantes pour les
    codes de statut HTTP les plus courants.
  </p>
  <h3 class="h3"><i class="fa-solid fa-diamond mr-5"></i>STATUS</h3>
  <p>
    Objet contenant les codes de statut HTTP standards pour faciliter les comparaisons et la gestion
    des réponses.
  </p>
  <h4 class="h4">Constantes disponibles</h4>
  <table class="t-default">
    <thead>
      <tr>
        <th>Nom</th>
        <th>Code</th>
        <th>Description</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>SUCCESS</td>
        <td>200</td>
        <td>Requête réussie</td>
      </tr>
      <tr>
        <td>NO_CONTENT</td>
        <td>204</td>
        <td>Requête réussie sans contenu</td>
      </tr>
      <tr>
        <td>UNAUTHORIZED</td>
        <td>401</td>
        <td>Non authentifié</td>
      </tr>
      <tr>
        <td>FORBIDDEN</td>
        <td>403</td>
        <td>Accès interdit</td>
      </tr>
      <tr>
        <td>NOT_FOUND</td>
        <td>404</td>
        <td>Ressource non trouvée</td>
      </tr>
      <tr>
        <td>ERROR_SERVER</td>
        <td>500</td>
        <td>Erreur serveur</td>
      </tr>
    </tbody>
  </table>
  <h4 class="h4">Utilisation</h4>
  <div class="div-code">
    import { STATUS } from "@brugmann/vuemann/src/constants/ajax-constants.js"<br />
    <br />
    // Comparer un statut<br />
    if (response.status === STATUS.SUCCESS) {<br />
    &emsp;// Traiter le succès<br />
    }<br />
    <br />
    // Utiliser dans no-flash<br />
    req('users.list', { 'no-flash': [STATUS.NOT_FOUND, STATUS.FORBIDDEN] })
  </div>
  <h2 class="h2">Raccourcis disponibles</h2>
  <p>
    Ces fonctions sont des raccourcis vers les services Ajax. Elles permettent d'utiliser les
    fonctionnalités Ajax de manière simplifiée.
  </p>

  <!-- req -->
  <h3 class="h3"><i class="fa-solid fa-diamond mr-5"></i>req</h3>
  <p>
    Raccourci vers le service <span class="badge-code">ajax:req</span>. Permet d'effectuer une
    requête ajax.
  </p>
  <div class="div-code">
    <span class="color-neutral-500">//appel via le service manager</span><br />
    import { servicesM } from "@brugmann/vuemann/src/services/services-manager.js"<br />
    <br />
    servicesM.service('ajax:req', ['users.show', {params: {id: 1}}])<br />
    <br />
    <span class="color-neutral-500">//appel avec le raccourci </span><br />
    import { req } from "@brugmann/vuemann/src/shortcuts/services-shortcut.js"<br />
    <br />
    req('users.show', {params: {id: 1}})<br />
    <br />
    <span class="color-neutral-500">// Exemple avec empty404 pour les recherches</span><br />
    req('users.search', {params: {query: 'john'}, empty404: true})<br />
    <br />
    <span class="color-neutral-500">// Exemple avec body pour les requêtes POST</span><br />
    req('users.create', { body: {email: 'test@example.com', name: 'John'} })<br />
    <br />
    <span class="color-neutral-500"
      >// Exemple avec no-flash pour gérer certaines erreurs manuellement</span
    ><br />
    req('users.validate', { body: {email: 'test@example.com'}, 'no-flash': [409]})<br />
    <br />
    <span class="color-neutral-500"
      >// Exemple avec errors pour personnaliser le message d'erreur</span
    ><br />
    req('users.search', { params: {query: 'john'}, errors: { 404: 'user_not_found' } })<br />
  </div>

  <!-- URL Helper -->
  <h3 class="h3"><i class="fa-solid fa-diamond mr-5"></i>url</h3>
  <p>
    Raccourci vers les services Ajax. Permet de générer des URLs complètes ou des sous-répertoires à
    partir des routes définies.
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
        <td>Génère une URL complète (API + sous-répertoire) à partir d'une route</td>
      </tr>
      <tr>
        <td>generateSubdirectory(route_name, params)</td>
        <td>String, Object</td>
        <td>String</td>
        <td>Génère uniquement le sous-répertoire de l'URL (sans l'URL de l'API)</td>
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
        <td>Paramètres dynamiques de la route (clé/valeur)</td>
      </tr>
      <tr>
        <td>api</td>
        <td>String</td>
        <td>-</td>
        <td>undefined</td>
        <td>Nom de l'API à utiliser (pour les routes globales)</td>
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
    import { url } from "@brugmann/vuemann/src/shortcuts/services-shortcut.js"<br />
    <br />
    url.generateUrl('user.show', { id: 123 }, 'api')<br />
    url.generateSubdirectory('user.show', { id: 123 })<br />
  </div>

  <!-- Ajax Object -->
  <h3 class="h3"><i class="fa-solid fa-diamond mr-5"></i>ajax</h3>
  <p>
    L'objet <span class="badge-code">ajax</span> regroupe tous les raccourcis Ajax en un seul objet.
    Alternative à l'importation individuelle des raccourcis.
  </p>
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
        <td>ajax.req(route_name, options)</td>
        <td>
          Effectue une requête Ajax (identique au raccourci <span class="badge-code">req</span>)
        </td>
      </tr>
    </tbody>
  </table>
  <h4 class="h4">Utilisation</h4>
  <div class="div-code">
    import { ajax } from "@brugmann/vuemann/src/shortcuts/services-shortcut.js"<br />
    <br />
    // Effectuer une requête<br />
    ajax.req('users.list', { params: { active: true } })<br />
    <br />
    // Alternative à l'import individuel<br />
    <span class="color-neutral-500"
      >// Au lieu de: import { req } from "@brugmann/vuemann/src/views/servicesPage/..."</span
    ><br />
    <span class="color-neutral-500"
      >// Utiliser: import { ajax } from "@brugmann/vuemann/src/views/servicesPage/..."</span
    >
  </div>

  <h2 class="h2">AjaxHelpers</h2>
  <p>
    Les helpers AJAX fournissent des utilitaires pour faciliter la gestion des requêtes et des
    réponses.
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
          Vérifie si un statut HTTP correspond à une erreur d'authentification (401 Unauthorized ou
          403 Forbidden). Utile pour différencier les erreurs d'auth des autres erreurs dans la
          gestion des réponses.
        </td>
      </tr>
    </tbody>
  </table>
  <h4 class="h4">Utilisation</h4>
  <div class="div-code">
    import { AjaxHelpers } from "@brugmann/vuemann/src/helpers/ajax-helpers.js"
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
          Vérifie si un statut HTTP est un succès (commence par 20: 200, 201, 204, etc.). Utile pour
          gérer de manière uniforme tous les codes de succès HTTP.
        </td>
      </tr>
    </tbody>
  </table>
  <h4 class="h4">Utilisation</h4>
  <div class="div-code">
    import { AjaxHelpers } from "@brugmann/vuemann/src/helpers/ajax-helpers.js"
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
  <p>L'intercepteur de requête permet:</p>
  <ul class="list ml-25">
    <li>d'ajouter des headers à la requête.</li>
    <li>ajouter automatiquement le bearer token.</li>
    <li>annuler deux requêtes avec la même url si l'option abort est activée.</li>
    <li>
      attacher le <span class="badge-code">requestId</span> à la configuration pour le tracking
      interne.
    </li>
  </ul>
  <h3 class="h3">Réponse</h3>
  <p>
    L'intercepteur de réponse gère automatiquement les erreurs en tentant de rafraîchir le token
    Bearer via le service auth. Si le rafraîchissement réussit, la requête est automatiquement
    renvoyée avec le nouveau token.
  </p>
  <h3 class="h3">Gestion des erreurs</h3>
  <p>Le service Ajax gère automatiquement les erreurs de plusieurs manières :</p>
  <ul class="list ml-25">
    <li>
      <strong>Flash messages traduits</strong> - Chaque code de statut HTTP a un message d'erreur
      traduit par défaut : 400→<span class="badge-code">error_bad_request</span>, 403→<span
        class="badge-code"
        >error_forbidden</span
      >, 404→<span class="badge-code">error_not_found</span>, 422→<span class="badge-code"
        >error_unprocessable</span
      >, 500→<span class="badge-code">error_server</span>, autre→<span class="badge-code"
        >error_unknown</span
      >
      (sauf si <span class="badge-code">flash: false</span> ou
      <span class="badge-code">no-flash</span> est utilisé)
    </li>
    <li>
      <strong>Messages personnalisables</strong> - L'option
      <span class="badge-code">errors</span> permet de remplacer le message par défaut par une clé
      de traduction personnalisée par code de statut
    </li>
    <li>
      <strong>Détails API loggés</strong> - Si l'API retourne
      <span class="badge-code">error.response.data.detail</span>, ce message est loggé (non flashé)
      pour le debug
    </li>
    <li>
      <strong>Logging automatique</strong> - Les erreurs sont automatiquement envoyées au serveur de
      logs (sauf pour les codes 401, 403, 404 et si <span class="badge-code">log: false</span>)
    </li>
    <li>
      <strong>Option empty404</strong> - Les erreurs 404 peuvent être transformées en tableaux vides
      avec statut 200 (utile pour les recherches)
    </li>
  </ul>
  <h3 class="h3">Request Management System</h3>
  <p>Chaque requête reçoit un <span class="badge-code">requestId</span> unique qui permet de :</p>
  <ul class="list ml-25">
    <li>Tracker les métadonnées de la requête (URL, params, API base, options)</li>
    <li>Gérer les requêtes simultanées vers plusieurs APIs</li>
    <li>Nettoyer automatiquement les ressources après la requête</li>
    <li>Associer correctement les tokens d'authentification aux bonnes APIs</li>
  </ul>
  <p>
    <i class="fa-solid fa-info-circle color-primary mr-5"></i>
    Le système de Request est géré automatiquement par le service Ajax. Vous n'avez pas besoin de
    manipuler les requestId directement.
  </p>

  <h2 class="h2">Démo interactive</h2>
  <p>
    Testez les quatre méthodes HTTP via l'API publique
    <a
      class="link-underline"
      href="https://jsonplaceholder.typicode.com/"
      target="_blank"
      >JSONPlaceholder</a
    >.
  </p>

  <div class="d-flex g-10 my-15">
    <button
      class="btn btn-primary btn-primary-400-active"
      @click="testGet"
      :disabled="loading"
    >
      GET /posts/1
    </button>
    <button
      class="btn btn-success"
      @click="testPost"
      :disabled="loading"
    >
      POST /posts
    </button>
    <button
      class="btn btn-warning"
      @click="testPut"
      :disabled="loading"
    >
      PUT /posts/1
    </button>
    <button
      class="btn btn-warning"
      @click="testPatch"
      :disabled="loading"
    >
      PATCH /posts/1
    </button>
    <button
      class="btn btn-danger"
      @click="testDelete"
      :disabled="loading"
    >
      DELETE /posts/1
    </button>
  </div>

  <div
    v-if="loading"
    class="my-10"
  >
    <i class="fa-solid fa-spinner fa-spin mr-5"></i> Requête {{ activeMethod }} en cours...
  </div>

  <div
    v-if="responseStatus !== undefined"
    class="my-10"
  >
    <p>
      <strong>Méthode :</strong> <span class="badge-code">{{ activeMethod }}</span>
      <strong class="ml-10">Statut :</strong>
      <span
        :class="responseStatus === STATUS.SUCCESS ? 'color-success' : 'color-danger'"
        class="fw-700"
        >{{ responseStatus }}</span
      >
    </p>
    <h4 class="h4 mt-10">Réponse :</h4>
    <pre
      class="div-code"
      style="max-height: 300px; overflow: auto"
      >{{ JSON.stringify(responseData, null, 2) }}</pre>
  </div>

  <h3 class="h3 mt-25">Intercepteur de requête</h3>
  <p>
    Visualisez les headers injectés automatiquement par le
    <span class="badge-code">requestInterceptor</span>
    (X-Requested-With, Access-Control-Allow-Origin, Authorization).
  </p>
  <button
    class="btn btn-primary btn-primary-400-active my-10"
    @click="testRequestInterceptor"
  >
    Voir les headers injectés
  </button>
  <div v-if="interceptorHeaders !== undefined">
    <h4 class="h4 mt-10">Headers :</h4>
    <pre class="div-code">{{ JSON.stringify(interceptorHeaders, null, 2) }}</pre>
  </div>

  <h3 class="h3 mt-25">Gestion des erreurs (response interceptor)</h3>
  <p>
    Chaque bouton envoie une requête GET vers un post inexistant (id {{ NON_EXISTENT_POST_ID }})
    pour déclencher une erreur 404 avec une option différente.
  </p>
  <div class="d-flex g-10 my-15">
    <button
      class="btn btn-danger"
      @click="testErrorDefault"
      :disabled="errorLoading"
    >
      Par défaut
    </button>
    <button
      class="btn btn-danger"
      @click="testErrorEmpty404"
      :disabled="errorLoading"
    >
      empty404
    </button>
    <button
      class="btn btn-danger"
      @click="testErrorCustom"
      :disabled="errorLoading"
    >
      errors custom
    </button>
    <button
      class="btn btn-danger"
      @click="testErrorNoFlash"
      :disabled="errorLoading"
    >
      flash: false
    </button>
  </div>

  <div
    v-if="errorLoading"
    class="my-10"
  >
    <i class="fa-solid fa-spinner fa-spin mr-5"></i> Requête en cours...
  </div>

  <div
    v-if="errorResult !== undefined"
    class="my-10"
  >
    <p>
      <strong>Option :</strong> <span class="badge-code">{{ errorLabel }}</span>
      <strong class="ml-10">Statut :</strong>
      <span
        :class="errorResult.status === STATUS.SUCCESS ? 'color-success' : 'color-danger'"
        class="fw-700"
        >{{ errorResult.status }}</span
      >
    </p>
    <h4 class="h4 mt-10">Réponse :</h4>
    <pre
      class="div-code"
      style="max-height: 200px; overflow: auto"
      >{{ JSON.stringify(errorResult.data, null, 2) }}</pre>
  </div>

  <h3 class="h3 mt-25">Abort (annulation de requête)</h3>
  <p>
    Deux requêtes sont envoyées simultanément avec l'option
    <span class="badge-code">abort: true</span>. La première est automatiquement annulée (statut
    499), seule la seconde aboutit.
  </p>
  <button
    class="btn btn-primary btn-primary-400-active my-10"
    @click="testAbort"
  >
    Tester l'annulation
  </button>
  <div v-if="abortResults.length > 0">
    <table class="t-default mt-10">
      <thead>
        <tr>
          <th>Requête</th>
          <th>Statut</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="result in abortResults"
          :key="result.label"
        >
          <td>{{ result.label }}</td>
          <td>
            <span
              :class="result.status === STATUS.SUCCESS ? 'color-success' : 'color-danger'"
              class="fw-700"
              >{{ result.status }}</span
            >
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
