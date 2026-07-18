<template>
  <h1 class="h1">Service Utils</h1>
  <p>Ce service regroupe l'ensemble des fonctionnalités génériques d'une application.</p>
  <h2 class="h2">Installation</h2>
  <p>
    Le service utils est enregistré via <span class="badge-code">utilsInit</span> dans la méthode
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
    <li>ajax - methode req</li>
    <li>router - methode hasRoute (pour DebugBar)</li>
  </ul>
  <h2 class="h2">Fonctions accessibles depuis le gestionnaire de service</h2>
  <!-- apiStatus -->
  <h3 class="h3"><i class="fa-solid fa-diamond mr-5"></i>apiStatus</h3>
  <p>
    Vérifie la disponibilité de toutes les APIs déclarées dans
    <router-link
      :to="{ name: 'config.app' }"
      class="link-underline underline"
      >appConfig</router-link
    >
    en tentant de récupérer leur fichier <span class="badge-code">openapi.json</span>.
  </p>
  <p>
    Toutes les APIs sont vérifiées en parallèle avec un timeout de 5 secondes par appel. Si une API
    est injoignable, une clé de traduction est ajoutée à
    <span class="badge-code">errorsGlobal</span>
    et l'API concernée est loguée dans la console.
  </p>
  <p>
    La fonction met à jour <span class="badge-code">appStatus</span> dans le store et retourne
    <span class="badge-code">{ appStatus: APP_STATUS.LOADED }</span> ou
    <span class="badge-code">{ appStatus: APP_STATUS.ERROR }</span>. Ce format est directement
    compatible avec le prop <span class="badge-code">cb</span> de
    <span class="badge-code">AppComponent</span>.
  </p>
  <h4 class="h4">utilisation</h4>
  <div class="div-code">
    <span class="color-neutral-700">// Comme callback de AppComponent</span><br />
    const initApp = async () =&gt; {<br />
    &nbsp;&nbsp;return await utilsService.apiStatus()<br />
    }<br />
  </div>

  <!-- isDeprecated -->
  <h3 class="h3"><i class="fa-solid fa-diamond mr-5"></i>isDeprecated</h3>
  <p>
    Affiche un avertissement stylisé dans la console pour indiquer qu'une fonctionnalité est
    dépréciée. Utile pour guider les développeurs lors de migrations ou mises à jour de l'API.
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
        <td>message</td>
        <td>String</td>
        <td>oui</td>
        <td>Message d'avertissement à afficher</td>
      </tr>
    </tbody>
  </table>
  <h4 class="h4">Utilisation</h4>
  <div class="div-code">
    import { servicesM } from "@brugmann/vuemann/src/services/services-manager.js"<br /><br />
    <span class="color-neutral-500">// Exemple dans une fonction dépréciée</span><br />
    const oldFunction = () => {<br />
    &emsp;servicesM.service('utils:isDeprecated', 'Cette fonction est dépréciée. Utilisez
    newFunction() à la place.')<br />
    &emsp;<span class="color-neutral-500">// ... reste du code</span><br />
    }
  </div>
  <p>
    Affiche dans la console : <span class="badge-code">⚠️ AVERTISSEMENT : [votre message]</span>
    avec un style visuel jaune pour attirer l'attention.
  </p>

  <!-- needUpdate -->
  <h3 class="h3"><i class="fa-solid fa-diamond mr-5"></i>needUpdate</h3>
  <p>
    Vérifie si une nouvelle version de l'application est disponible en comparant la version actuelle
    avec celle du fichier
    <span class="badge-code">app.json</span> sur le serveur.
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
        <td>version</td>
        <td>String</td>
        <td>oui</td>
        <td>Version actuelle de l'application (ex: '4.4.1')</td>
      </tr>
    </tbody>
  </table>
  <h4 class="h4">Retour</h4>
  <p>
    Retourne <span class="badge-code">true</span> si une mise à jour est disponible,
    <span class="badge-code">false</span> sinon.
  </p>
  <h4 class="h4">Utilisation</h4>
  <div class="div-code">
    import { servicesM } from "@brugmann/vuemann/src/services/services-manager.js"<br /><br />
    <span class="color-neutral-500">// Vérifier si une mise à jour est disponible</span><br />
    const currentVersion = '4.4.1'<br />
    const updateAvailable = await servicesM.service('utils:needUpdate', currentVersion)<br /><br />
    if (updateAvailable) {<br />
    &emsp;console.log('Une nouvelle version est disponible !')<br />
    }
  </div>
  <p>
    <i class="fa-solid fa-circle-info color-primary mr-5"></i>
    Cette méthode utilise <span class="badge-code">cache: 'no-store'</span> pour s'assurer de
    toujours récupérer la dernière version du fichier app.json.
    <i class="fa-solid fa-circle-info color-primary ml-5"></i>
  </p>

  <h2 class="h2">Composants inclus</h2>
  <!-- DebugBar -->
  <h3 class="h3"><i class="fa-solid fa-bug mr-5"></i>DebugBar</h3>
  <p>
    La barre de debug s'affiche automatiquement en bas à gauche de l'écran et fournit des
    informations utiles pour le développement :
  </p>
  <ul class="list ml-25 f-column g-5">
    <li>
      <strong>Version de l'application</strong> : Affiche la version actuelle de l'application
    </li>
    <li>
      <strong>Mode de développement</strong> : Indique si l'application est en mode test ou
      production
    </li>
    <li><strong>Mise à jour disponible</strong> : Alerte si une nouvelle version est disponible</li>
    <li>
      <strong>Lien changelog</strong> : Affiche un lien "Liste des modifications" vers la page
      changelog si la route existe
    </li>
  </ul>
  <h4 class="h4">Lien changelog conditionnel</h4>
  <p>
    Le lien vers la liste des modifications n'apparaît que si une route nommée
    <span class="badge-code">changelog</span>
    est définie dans votre configuration de routes. Cette vérification utilise la méthode
    <span class="badge-code">router.hasRoute('changelog')</span> du service router.
  </p>
  <!-- AppComponent -->
  <h3 class="h3"><i class="fa-solid fa-app-store mr-5"></i>AppComponent</h3>
  <p class="mb-10">
    <router-link
      :to="{ name: 'services.utils.appComponent' }"
      class="btn btn-primary btn-primary-400-active btn-sm"
    >
      <i class="fa-solid fa-play mr-5"></i>Voir la démo interactive
    </router-link>
  </p>
  <p>
    Composant racine chargé d'orchestrer l'état global de l'application (<span class="badge-code"
      >INIT</span
    >, <span class="badge-code">LOADING</span>, <span class="badge-code">LOADED</span>,
    <span class="badge-code">ERROR</span>, <span class="badge-code">ERROR_AUTH</span>) via le
    <span class="badge-code">utilsStore</span>. Il affiche:
  </p>
  <ul class="list ml-25 f-column g-5">
    <li><strong>Router</strong> quand l'application est <span class="badge-code">LOADED</span></li>
    <li><strong>Un loader</strong> quand l'application est <span class="badge-code">INIT</span></li>
    <li>
      <strong>Router caché (v-show)</strong> quand l'application est
      <span class="badge-code">LOADING</span> - la vue gère son propre loader
    </li>
    <li>
      <strong>Une vue d'erreur</strong> quand l'application est en
      <span class="badge-code">ERROR</span> avec un bouton "Réessayer"
    </li>
    <li>
      <strong>Attente silencieuse</strong> quand l'application est en
      <span class="badge-code">ERROR_AUTH</span> - pas de message d'erreur affiché
    </li>
  </ul>
  <h4 class="h4">Propriétés</h4>
  <table class="t-default mb-15 w-100">
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
        <td>cb</td>
        <td>Function</td>
        <td>-</td>
        <td>undefined</td>
        <td>
          Callback asynchrone exécuté au montage. Doit retourner un objet avec
          <span class="badge-code">appStatus</span> (<span class="badge-code">LOADED</span>,
          <span class="badge-code">LOADING</span>, <span class="badge-code">ERROR</span>, ou
          <span class="badge-code">ERROR_AUTH</span>).
        </td>
      </tr>
    </tbody>
  </table>
  <h4 class="h4">Exemple</h4>
  <div class="div-code">
    <span class="color-neutral-700">// App.vue</span><br />
    &lt;script setup&gt;<br />
    &nbsp;&nbsp;import AppComponent from
    '@brugmann/vuemann/src/services/utils/views/AppComponent.vue'<br />
    &nbsp;&nbsp;import { utilsService } from
    '@brugmann/vuemann/src/services/utils/utils-service.js'<br />
    &nbsp;&nbsp;import { utilsStore } from '@brugmann/vuemann/src/services/utils/utils-store.js'<br />
    &nbsp;&nbsp;import { APP_STATUS } from '@brugmann/vuemann/src/constants/utils-constants.js'<br />
    &nbsp;&nbsp;utilsStore.setAppStatus(APP_STATUS.INIT)<br />
    &nbsp;&nbsp;const initApp = async () =&gt; {<br />
    &nbsp;&nbsp;&nbsp;&nbsp;return await utilsService.apiStatus()<br />
    &nbsp;&nbsp;}<br />
    &lt;/script&gt;<br />
    &lt;template&gt;<br />
    &nbsp;&nbsp;&lt;AppComponent :cb="initApp" /&gt;<br />
    &lt;/template&gt;
  </div>
  <h4 class="h4">Exemple avec message de chargement personnalisé</h4>
  <p>
    Le message de chargement peut être personnalisé via le
    <span class="badge-code">utilsStore</span>. Cela permet de changer dynamiquement le message en
    fonction de la route ou du contexte.
  </p>
  <div class="div-code">
    <span class="color-neutral-700">// Personnaliser le message pendant le chargement</span><br />
    &lt;script setup&gt;<br />
    &nbsp;&nbsp;import { utilsStore } from
    '@brugmann/vuemann/src/services/utils/src/utils-store.js'<br />
    <br />
    &nbsp;&nbsp;<span class="color-neutral-700"
      >// Définir le message avant ou pendant le chargement</span
    ><br />
    &nbsp;&nbsp;utilsStore.setLoadingSentence('my-app.custom-loading')<br />
    <br />
    &nbsp;&nbsp;<span class="color-neutral-700"
      >// Peut être changé à tout moment, par exemple dans un watcher de route</span
    ><br />
    &nbsp;&nbsp;watch(() => route.name, (newRoute) => {<br />
    &nbsp;&nbsp;&nbsp;&nbsp;if (newRoute === 'heavy-page') {<br />
    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;utilsStore.setLoadingSentence('my-app.heavy-loading')<br />
    &nbsp;&nbsp;&nbsp;&nbsp;}<br />
    &nbsp;&nbsp;})<br />
    &lt;/script&gt;<br />
    &lt;template&gt;<br />
    &nbsp;&nbsp;&lt;AppComponent :cb="initApp" /&gt;<br />
    &lt;/template&gt;
  </div>
  <h4 class="h4">Gestion des erreurs d'authentification</h4>
  <p>
    Le composant AppComponent gère intelligemment les erreurs d'authentification grâce au statut
    <span class="badge-code">ERROR_AUTH</span> :
  </p>
  <ul class="list ml-25 f-column g-5">
    <li>
      <strong>Pages publiques</strong> : Les pages <span class="badge-code">login</span> et
      <span class="badge-code">changelog</span> restent accessibles même en cas d'erreur
      d'authentification
    </li>
    <li>
      <strong>Pas de message d'erreur</strong> : Le statut
      <span class="badge-code">ERROR_AUTH</span> n'affiche pas de message flash à l'utilisateur
    </li>
    <li>
      <strong>Réexécution automatique</strong> : Après une connexion réussie (événement
      <span class="badge-code">login-success</span>), le callback se réexécute automatiquement pour
      recharger l'application
    </li>
  </ul>
  <h4 class="h4">Format de retour attendu</h4>
  <p>Le callback doit retourner un objet avec la propriété <strong>appStatus</strong> :</p>
  <table class="t-default mb-15 w-100">
    <thead>
      <tr>
        <th>Propriété</th>
        <th>Type</th>
        <th>Obligatoire</th>
        <th>Description</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>appStatus</td>
        <td>String</td>
        <td>Oui</td>
        <td>
          État de l'application : <span class="badge-code">LOADED</span>,
          <span class="badge-code">LOADING</span>, <span class="badge-code">ERROR</span>, ou
          <span class="badge-code">ERROR_AUTH</span>
        </td>
      </tr>
      <tr>
        <td>error</td>
        <td>String</td>
        <td>Non</td>
        <td>Message d'erreur (requis uniquement pour <span class="badge-code">ERROR</span>)</td>
      </tr>
    </tbody>
  </table>
  <div class="div-code">
    <span class="color-neutral-700">// Exemple de retour pour une erreur d'authentification</span
    ><br />
    { appStatus: APP_STATUS.ERROR_AUTH }<br /><br />
    <span class="color-neutral-700">// Exemple de retour pour une erreur serveur</span><br />
    { appStatus: APP_STATUS.ERROR, error: "Internal Server Error" }<br /><br />
    <span class="color-neutral-700">// Exemple de retour pour un succès</span><br />
    { appStatus: APP_STATUS.LOADED }<br /><br />
    <span class="color-neutral-700">// Exemple de retour pour une vue qui gère son chargement</span
    ><br />
    { appStatus: APP_STATUS.LOADING }
  </div>

  <h2 class="h2">Fonctions utilitaires</h2>
  <!-- hydrate -->
  <h3 class="h3"><i class="fa-solid fa-link mr-5"></i>hydrate</h3>
  <p>
    La fonction <span class="badge-code">hydrate</span> permet de charger automatiquement les
    entités complètes associées à des références d'objets. Elle remplace les objets de référence
    simples (comme <span class="badge-code">{ id: 1 }</span>) par les entités complètes chargées
    depuis les controllers.
  </p>

  <h4 class="h4">Paramètres</h4>
  <table class="t-default mb-15 w-100">
    <thead>
      <tr>
        <th>Paramètre</th>
        <th>Type</th>
        <th>Obligatoire</th>
        <th>Description</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>data</td>
        <td>Array</td>
        <td>Oui</td>
        <td>Tableau d'objets contenant des références à hydrater</td>
      </tr>
      <tr>
        <td>keys</td>
        <td>Array&lt;string&gt;</td>
        <td>Oui</td>
        <td>Noms des clés à hydrater (ex: ['patient', 'service'])</td>
      </tr>
      <tr>
        <td>config</td>
        <td>Object</td>
        <td>Non</td>
        <td>Configuration optionnelle par clé (controller custom, filtre)</td>
      </tr>
    </tbody>
  </table>

  <h4 class="h4">Configuration par clé</h4>
  <table class="t-default mb-15 w-100">
    <thead>
      <tr>
        <th>Option</th>
        <th>Type</th>
        <th>Description</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>controller</td>
        <td>string</td>
        <td>Nom du controller à utiliser (par défaut: nom de la clé)</td>
      </tr>
      <tr>
        <td>method</td>
        <td>string</td>
        <td>
          Nom de la méthode du controller à appeler (par défaut:
          <span class="badge-code">byIds</span>)
        </td>
      </tr>
      <tr>
        <td>filter</td>
        <td>Function</td>
        <td>
          Fonction de filtrage qui retourne <span class="badge-code">true</span> pour inclure l'item
          ou <span class="badge-code">false</span> pour l'exclure.
        </td>
      </tr>
      <tr>
        <td>entityKey</td>
        <td>string</td>
        <td>
          Chemin en notation pointée pour la clé de correspondance de l'entité (par défaut:
          <span class="badge-code">'id'</span>). Utile quand l'entité retournée n'a pas de
          <span class="badge-code">id</span> de premier niveau.
        </td>
      </tr>
    </tbody>
  </table>

  <h4 class="h4">Utilisation simple</h4>
  <div class="div-code">
    import { HydrateFunctions } from '@brugmann/vuemann/src/services/utils/src/utils-hydrate.js'<br /><br />
    <span class="color-neutral-700">// Données avec références simples</span><br />
    const hospitalizations = [<br />
    &nbsp;&nbsp;{ id: 1, patient: { id: 1 }, service: { id: 2 } },<br />
    &nbsp;&nbsp;{ id: 2, patient: { id: 2 }, service: { id: 2 } }<br />
    ]<br /><br />
    <span class="color-neutral-700">// Hydratation automatique</span><br />
    const hydratedData = await HydrateFunctions.hydrate(hospitalizations, ['patient', 'service'])<br /><br />
    <span class="color-neutral-700"
      >// Résultat : les références sont remplacées par les entités complètes</span
    ><br />
    <span class="color-neutral-700"
      >// hydratedData[0].patient = { id: 1, firstname: 'John', lastname: 'Doe', ... }</span
    >
  </div>

  <h4 class="h4">Avec filtre pour exclure des items</h4>
  <div class="div-code">
    const config = {<br />
    &nbsp;&nbsp;patient: {<br />
    &nbsp;&nbsp;&nbsp;&nbsp;<span class="color-neutral-700"
      >// Ne charger que les patients des hospitalisations actives</span
    ><br />
    &nbsp;&nbsp;&nbsp;&nbsp;filter: (h) => h.status === 'active'&nbsp;&nbsp;<span
      class="color-neutral-700"
      >// Retourne true ou false</span
    ><br />
    &nbsp;&nbsp;}<br />
    }<br /><br />
    const hydratedData = await HydrateFunctions.hydrate(hospitalizations, ['patient'], config)
  </div>

  <h4 class="h4">Exemples de filtres</h4>
  <div class="div-code">
    <span class="color-success-500">// ✅ CORRECT : Retourne un boolean</span><br />
    filter: (h) => h.status === 'active'<br />
    filter: (h) => h.id > 10<br />
    filter: (h) => h.date !== null<br /><br />
    <span class="color-danger-500">// ❌ INCORRECT : Retourne un objet (transformation)</span><br />
    filter: (h) => ({ ...h, transformed: true })<br /><br />
    <span class="color-danger-500">// ❌ INCORRECT : Retourne l'item ou false</span><br />
    filter: (h) => h.status === 'active' ? h : false
  </div>

  <h4 class="h4">Avec controller personnalisé</h4>
  <div class="div-code">
    const config = {<br />
    &nbsp;&nbsp;practitioner: {<br />
    &nbsp;&nbsp;&nbsp;&nbsp;<span class="color-neutral-700"
      >// Utiliser le controller "opera" au lieu de "practitioner"</span
    ><br />
    &nbsp;&nbsp;&nbsp;&nbsp;controller: 'opera'<br />
    &nbsp;&nbsp;}<br />
    }<br /><br />
    const hydratedData = await HydrateFunctions.hydrate(surgeries, ['practitioner'], config)
  </div>

  <h4 class="h4">Avec méthode personnalisée</h4>
  <div class="div-code">
    const config = {<br />
    &nbsp;&nbsp;patient: {<br />
    &nbsp;&nbsp;&nbsp;&nbsp;<span class="color-neutral-700"
      >// Utiliser la méthode "getByIdsWithDetails" au lieu de "byIds"</span
    ><br />
    &nbsp;&nbsp;&nbsp;&nbsp;method: 'getByIdsWithDetails'<br />
    &nbsp;&nbsp;}<br />
    }<br /><br />
    const hydratedData = await HydrateFunctions.hydrate(hospitalizations, ['patient'], config)
  </div>

  <h4 class="h4">Combiner toutes les options</h4>
  <div class="div-code">
    const config = {<br />
    &nbsp;&nbsp;practitioner: {<br />
    &nbsp;&nbsp;&nbsp;&nbsp;<span class="color-neutral-700"
      >// Combiner controller, méthode et filtre personnalisés</span
    ><br />
    &nbsp;&nbsp;&nbsp;&nbsp;controller: 'opera',<br />
    &nbsp;&nbsp;&nbsp;&nbsp;method: 'getByIdsWithDetails',<br />
    &nbsp;&nbsp;&nbsp;&nbsp;filter: (surgery) => surgery.status === 'scheduled'<br />
    &nbsp;&nbsp;}<br />
    }<br /><br />
    const hydratedData = await HydrateFunctions.hydrate(surgeries, ['practitioner'], config)
  </div>

  <h4 class="h4">Avec clé d'entité personnalisée (entityKey)</h4>
  <p>
    Quand l'entité retournée par le controller n'utilise pas
    <span class="badge-code">id</span> comme identifiant de premier niveau, utilisez
    <span class="badge-code">entityKey</span> avec un chemin en notation pointée.
  </p>
  <div class="div-code">
    <span class="color-neutral-700"
      >// L'entité user utilise identifiers.samAccountName au lieu de id</span
    ><br />
    const config = {<br />
    &nbsp;&nbsp;user: {<br />
    &nbsp;&nbsp;&nbsp;&nbsp;controller: 'refidUser',<br />
    &nbsp;&nbsp;&nbsp;&nbsp;entityKey: 'identifiers.samAccountName'<br />
    &nbsp;&nbsp;}<br />
    }<br /><br />
    const hydratedData = await HydrateFunctions.hydrate(data, ['user'], config)<br /><br />
    <span class="color-neutral-700"
      >// La référence { id: 'jdoe' } est remplacée par l'entité complète</span
    ><br />
    <span class="color-neutral-700">// dont identifiers.samAccountName === 'jdoe'</span>
  </div>

  <h4 class="h4">Prérequis</h4>
  <p>
    Pour fonctionner correctement, la fonction <span class="badge-code">hydrate</span> nécessite que
    :
  </p>
  <ul class="list ml-25 f-column g-5">
    <li>
      Les <strong>controllers</strong> soient enregistrés via
      <span class="badge-code">utils.registerController()</span> au démarrage de l'application
    </li>
    <li>
      Les <strong>controllers</strong> concernés possèdent une méthode
      <span class="badge-code">byIds(ids)</span> (ou la méthode personnalisée spécifiée) qui accepte
      un tableau d'IDs et retourne les entités correspondantes
    </li>
    <li>
      Les objets de référence contiennent au minimum une propriété
      <span class="badge-code">id</span>
    </li>
  </ul>

  <!-- registerController -->
  <h3 class="h3"><i class="fa-solid fa-pen-to-square mr-5"></i>registerController</h3>
  <p>
    Enregistre un controller dans le registre utilisé par <span class="badge-code">hydrate</span>.
    Les controllers doivent être enregistrés au démarrage de l'application avant d'utiliser
    <span class="badge-code">hydrate</span>.
  </p>

  <h4 class="h4">Paramètres</h4>
  <table class="t-default mb-15 w-100">
    <thead>
      <tr>
        <th>Paramètre</th>
        <th>Type</th>
        <th>Obligatoire</th>
        <th>Description</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>name</td>
        <td>string</td>
        <td>Oui</td>
        <td>Nom du controller (utilisé comme clé dans hydrate)</td>
      </tr>
      <tr>
        <td>controller</td>
        <td>Object</td>
        <td>Oui</td>
        <td>L'objet controller contenant les méthodes (ex: byIds)</td>
      </tr>
    </tbody>
  </table>

  <h4 class="h4">Utilisation</h4>
  <div class="div-code">
    import { utils } from '@brugmann/vuemann/src/shortcuts/services-shortcut.js'<br />
    import { PatientController } from '@/apis/patient/controllers/patient-controller.js'<br />
    import { UserController } from '@/apis/user/controllers/user-controller.js'<br /><br />
    <span class="color-neutral-700">// Enregistrer les controllers au démarrage</span><br />
    utils.registerController('patient', PatientController)<br />
    utils.registerController('user', UserController)
  </div>

  <h4 class="h4">Configuration recommandée</h4>
  <p>
    Créez un fichier dédié pour l'enregistrement des controllers et appelez-le dans
    <span class="badge-code">main.js</span> :
  </p>
  <div class="div-code">
    <span class="color-neutral-700">// src/config/hydrate-controllers.js</span><br />
    import { utils } from '@brugmann/vuemann/src/shortcuts/services-shortcut.js'<br />
    import { PatientController } from '@/apis/patient/controllers/patient-controller.js'<br />
    import { UserController } from '@/apis/user/controllers/user-controller.js'<br />
    import { ServiceController } from '@/apis/service/controllers/service-controller.js'<br /><br />
    export const registerHydrateControllers = () => {<br />
    &nbsp;&nbsp;utils.registerController('patient', PatientController)<br />
    &nbsp;&nbsp;utils.registerController('user', UserController)<br />
    &nbsp;&nbsp;utils.registerController('service', ServiceController)<br />
    }
  </div>
  <div class="div-code mt-10">
    <span class="color-neutral-700">// main.js</span><br />
    import { registerHydrateControllers } from '@/config/hydrate-controllers.js'<br /><br />
    ConfigLoader.init({routes, app: appConfig, routesApi})<br />
    registerHydrateControllers()
    <span class="color-neutral-700">// Avant servicesM.initServices()</span><br /><br />
    const app = createApp(App)<br />
    await servicesM.initServices(app, { ... })
  </div>

  <h4 class="h4">Exemple de méthode byIds dans un controller</h4>
  <div class="div-code">
    <span class="color-neutral-700">// src/apis/patient/controllers/patient-controller.js</span
    ><br />
    const byIds = async (ids) => {<br />
    &nbsp;&nbsp;const response = await PatientRepository.byIds(ids)<br />
    &nbsp;&nbsp;if (response.status !== STATUS.SUCCESS) {<br />
    &nbsp;&nbsp;&nbsp;&nbsp;return { status: response.status, error: response.error }<br />
    &nbsp;&nbsp;}<br /><br />
    &nbsp;&nbsp;return {<br />
    &nbsp;&nbsp;&nbsp;&nbsp;status: STATUS.SUCCESS,<br />
    &nbsp;&nbsp;&nbsp;&nbsp;data: response.data.map((patient) => PatientDto.fromShow(patient))<br />
    &nbsp;&nbsp;}<br />
    }<br /><br />
    export const PatientController = { byIds }
  </div>

  <h4 class="h4">Avantages</h4>
  <ul class="list ml-25 f-column g-5">
    <li><strong>Performance</strong> : Dédoublonne automatiquement les IDs et charge en batch</li>
    <li><strong>Simplicité</strong> : Une seule fonction pour gérer plusieurs relations</li>
    <li><strong>Flexibilité</strong> : Filtres et controllers personnalisés</li>
    <li><strong>Immutabilité</strong> : Ne modifie pas les données originales</li>
  </ul>
</template>
