<template>
  <h1 class="h1">Service Utils</h1>
  <p>
    Ce service regroupe l'ensemble des fonctionnalités génériques d'une application.
  </p>
  <h2 class="h2">Installation</h2>
  <ul class="list ml-25">
    <li>Importer utilsService dans l'objet services situé dans le fichier main.js.</li>
    <li>Importer utilsPlugin dans l'array plugins_synchrone dans le fichier main.js.</li>
  </ul>
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
    Permet de récupérer le status des apis utilisées par l'application.
  </p>
  <h4 class="h4">configuration</h4>
  <p>
    Le service utils va automatiquement récupérer les apis renseignées dans le fichier de config <router-link :to="{name: 'config.app'}" class="link-underline underline">appConfig</router-link>.
  </p>
  <p>
    Vous pouvez desactiver la vérification du status d'une api en ajouter à sa clé dans le fichier appConfig l'option <span class="badge-code">status:false</span>
  </p>
  <h4 class="h4">utilisation</h4>
  <div class="div-code">
    import { servicesM } from "@brugmann/vuemann/src/services/services-manager.js"<br />    <br />    servicesM.service('utilis:apiStatus')<br />  </div>
  
  <h2 class="h2">Composants inclus</h2>
  <!-- DebugBar -->
  <h3 class="h3"><i class="fa-solid fa-bug mr-5"></i>DebugBar</h3>
  <p>
    La barre de debug s'affiche automatiquement en bas à gauche de l'écran et fournit des informations utiles pour le développement :
  </p>
  <ul class="list ml-25 f-column g-5">
    <li><strong>Version de l'application</strong> : Affiche la version actuelle de l'application</li>
    <li><strong>Mode de développement</strong> : Indique si l'application est en mode test ou production</li>
    <li><strong>Mise à jour disponible</strong> : Alerte si une nouvelle version est disponible</li>
    <li><strong>Lien changelog</strong> : Affiche un lien "Liste des modifications" vers la page changelog si la route existe</li>
  </ul>
  <h4 class="h4">Lien changelog conditionnel</h4>
  <p>
    Le lien vers la liste des modifications n'apparaît que si une route nommée <span class="badge-code">changelog</span> 
    est définie dans votre configuration de routes. Cette vérification utilise la méthode 
    <span class="badge-code">router.hasRoute('changelog')</span> du service router.
  </p>
  <!-- AppComponent -->
  <h3 class="h3"><i class="fa-solid fa-app-store mr-5"></i>AppComponent</h3>
  <p>
    Composant racine chargé d'orchestrer l'état global de l'application (<span class="badge-code">INIT</span>, <span class="badge-code">LOADING</span>, <span class="badge-code">LOADED</span>, <span class="badge-code">ERROR</span>)
    via le <span class="badge-code">utilsStore</span>. Il affiche:
  </p>
  <ul class="list ml-25 f-column g-5">
    <li><strong>Router</strong> quand l'application est <span class="badge-code">LOADED</span></li>
    <li><strong>Un loader</strong> quand l'application est <span class="badge-code">INIT</span> ou <span class="badge-code">LOADING</span></li>
    <li><strong>Une vue d'erreur</strong> quand l'application est en <span class="badge-code">ERROR</span> avec un bouton "Réessayer"</li>
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
        <td>Callback asynchrone exécuté au montage. Si retourne false, l'app passe en état ERROR.</td>
      </tr>
    </tbody>
  </table>
  <h4 class="h4">Exemple</h4>
  <div class="div-code">
    <span class="color-neutral-700">// App.vue</span><br />
    &lt;script setup&gt;<br />
    &nbsp;&nbsp;import AppComponent from '@brugmann/vuemann/src/services/utils/views/AppComponent.vue'<br />
    &nbsp;&nbsp;import { utilsService } from '@brugmann/vuemann/src/services/utils/utils-service.js'<br />
    &nbsp;&nbsp;import { utilsStore } from '@brugmann/vuemann/src/services/utils/utils-store.js'<br />
    &nbsp;&nbsp;import { APP_STATUS } from '@brugmann/vuemann/src/services/utils/utils-constants.js'<br />
    &nbsp;&nbsp;utilsStore.setAppStatus(APP_STATUS.INIT)<br />
    &nbsp;&nbsp;const initApp = async () =&gt; {<br />
    &nbsp;&nbsp;&nbsp;&nbsp;return await utilsService.apiStatus()<br />
    &nbsp;&nbsp;}<br />
    &lt;/script&gt;<br />
    &lt;template&gt;<br />
    &nbsp;&nbsp;&lt;AppComponent :cb="initApp" /&gt;<br />
    &lt;/template&gt;
  </div>
  <h4 class="h4">Gestion des erreurs d'authentification</h4>
  <p>
    Le composant AppComponent gère intelligemment les erreurs d'authentification (401 Unauthorized, 403 Forbidden) :
  </p>
  <ul class="list ml-25 f-column g-5">
    <li><strong>Pages publiques</strong> : Les pages <span class="badge-code">login</span> et <span class="badge-code">changelog</span> restent accessibles même en cas d'erreur d'authentification</li>
    <li><strong>Pas de message d'erreur</strong> : Les erreurs 401/403 n'affichent pas de message d'erreur à l'utilisateur car il sera automatiquement redirigé vers la page de login</li>
    <li><strong>Réexécution automatique</strong> : Après une connexion réussie, le callback se réexécute automatiquement pour recharger l'application</li>
  </ul>
  <h4 class="h4">Format de retour attendu</h4>
  <p>
    Le callback doit retourner un objet avec les propriétés suivantes :
  </p>
  <table class="t-default mb-15 w-100">
    <thead>
      <tr>
        <th>Propriété</th>
        <th>Type</th>
        <th>Description</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>status</td>
        <td>Number</td>
        <td>Statut HTTP de la réponse (200 pour succès, 401/403 pour erreurs d'auth, etc.)</td>
      </tr>
      <tr>
        <td>error</td>
        <td>String</td>
        <td>Message d'erreur (optionnel, utilisé pour les erreurs non-authentification)</td>
      </tr>
    </tbody>
  </table>
  <div class="div-code">
    <span class="color-neutral-700">// Exemple de retour pour une erreur d'authentification</span><br />
    { status: 401, error: "Unauthorized" }<br /><br />
    <span class="color-neutral-700">// Exemple de retour pour une erreur serveur</span><br />
    { status: 500, error: "Internal Server Error" }<br /><br />
    <span class="color-neutral-700">// Exemple de retour pour un succès</span><br />
    { status: 200 }
  </div>

  <h2 class="h2">Fonctions utilitaires</h2>
  <!-- hydrate -->
  <h3 class="h3"><i class="fa-solid fa-link mr-5"></i>hydrate</h3>
  <p>
    La fonction <span class="badge-code">hydrate</span> permet de charger automatiquement les entités complètes associées à des références d'objets.
    Elle remplace les objets de référence simples (comme <span class="badge-code">{ id: 1 }</span>) par les entités complètes chargées depuis les controllers.
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
        <td>Nom de la méthode du controller à appeler (par défaut: <span class="badge-code">byIds</span>)</td>
      </tr>
      <tr>
        <td>filter</td>
        <td>Function</td>
        <td>Fonction de filtrage qui retourne <span class="badge-code">true</span> pour inclure l'item ou <span class="badge-code">false</span> pour l'exclure.</td>
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
    <span class="color-neutral-700">// Résultat : les références sont remplacées par les entités complètes</span><br />
    <span class="color-neutral-700">// hydratedData[0].patient = { id: 1, firstname: 'John', lastname: 'Doe', ... }</span>
  </div>

  <h4 class="h4">Avec filtre pour exclure des items</h4>
  <div class="div-code">
    const config = {<br />
    &nbsp;&nbsp;patient: {<br />
    &nbsp;&nbsp;&nbsp;&nbsp;<span class="color-neutral-700">// Ne charger que les patients des hospitalisations actives</span><br />
    &nbsp;&nbsp;&nbsp;&nbsp;filter: (h) => h.status === 'active'&nbsp;&nbsp;<span class="color-neutral-700">// Retourne true ou false</span><br />
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
    &nbsp;&nbsp;&nbsp;&nbsp;<span class="color-neutral-700">// Utiliser le controller "opera" au lieu de "practitioner"</span><br />
    &nbsp;&nbsp;&nbsp;&nbsp;controller: 'opera'<br />
    &nbsp;&nbsp;}<br />
    }<br /><br />
    const hydratedData = await HydrateFunctions.hydrate(surgeries, ['practitioner'], config)
  </div>

  <h4 class="h4">Avec méthode personnalisée</h4>
  <div class="div-code">
    const config = {<br />
    &nbsp;&nbsp;patient: {<br />
    &nbsp;&nbsp;&nbsp;&nbsp;<span class="color-neutral-700">// Utiliser la méthode "getByIdsWithDetails" au lieu de "byIds"</span><br />
    &nbsp;&nbsp;&nbsp;&nbsp;method: 'getByIdsWithDetails'<br />
    &nbsp;&nbsp;}<br />
    }<br /><br />
    const hydratedData = await HydrateFunctions.hydrate(hospitalizations, ['patient'], config)
  </div>

  <h4 class="h4">Combiner toutes les options</h4>
  <div class="div-code">
    const config = {<br />
    &nbsp;&nbsp;practitioner: {<br />
    &nbsp;&nbsp;&nbsp;&nbsp;<span class="color-neutral-700">// Combiner controller, méthode et filtre personnalisés</span><br />
    &nbsp;&nbsp;&nbsp;&nbsp;controller: 'opera',<br />
    &nbsp;&nbsp;&nbsp;&nbsp;method: 'getByIdsWithDetails',<br />
    &nbsp;&nbsp;&nbsp;&nbsp;filter: (surgery) => surgery.status === 'scheduled'<br />
    &nbsp;&nbsp;}<br />
    }<br /><br />
    const hydratedData = await HydrateFunctions.hydrate(surgeries, ['practitioner'], config)
  </div>

  <h4 class="h4">Prérequis</h4>
  <p>
    Pour fonctionner correctement, la fonction <span class="badge-code">hydrate</span> nécessite que :
  </p>
  <ul class="list ml-25 f-column g-5">
    <li>Les <strong>controllers</strong> concernés possèdent une méthode <span class="badge-code">byIds(ids)</span> (ou la méthode personnalisée spécifiée) qui accepte un tableau d'IDs et retourne les entités correspondantes</li>
    <li>Les objets de référence contiennent au minimum une propriété <span class="badge-code">id</span></li>
    <li>Les controllers suivent la convention de nommage <span class="badge-code">{name}Controller</span> et sont situés dans <span class="badge-code">/src/apis/{name}/controllers/{name}-controller.js</span></li>
  </ul>

  <h4 class="h4">Exemple de méthode byIds dans un controller</h4>
  <div class="div-code">
    <span class="color-neutral-700">// src/apis/patient/controllers/patient-controller.js</span><br />
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
