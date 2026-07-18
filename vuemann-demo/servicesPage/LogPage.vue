<script setup>
import { ref } from 'vue'
import { log } from '@brugmann/vuemann/src/shortcuts/services-shortcut.js'
import { logService } from '@brugmann/vuemann/src/services/log/log-service.js'

const logSent = ref(false)
const logTrigger = ref(false)

const triggerLog = async () => {
  logTrigger.value = true
  // eslint-disable-next-line no-undef
  nonExistentVar.value = 'test'
}

const trifferSendLog = async () => {
  await logService.send('Erreur de test déclenchée depuis la doc', { module: 'Demo' })
  logSent.value = true
}

const testError = () => {
  log.error("Test d'erreur depuis la documentation")
}

const testWarn = () => {
  log.warn("Test d'avertissement depuis la documentation")
}

const testInfo = () => {
  log.info("Test d'information depuis la documentation")
}

const testDebug = () => {
  log.debug('Test de debug depuis la documentation', { debugData: { step: 1, value: 42 } })
}
</script>

<template>
  <h1 class="h1">Service Log</h1>
  <p>
    Le service <b>log</b> permet de centraliser la gestion des erreurs dans l'application VueJS. Il
    loggue les erreurs en console et les envoie à une route API nommée
    <span class="badge-code">log</span>.
  </p>
  <p>
    <i class="fa-solid fa-triangle-exclamation color-danger mr-5"></i>
    Par défaut, ce service n'est pas activé en environnement de développement. Utilisez
    <span class="badge-code">app.log: true</span> pour l'activer.
    <i class="fa-solid fa-triangle-exclamation color-danger ml-5"></i>
  </p>
  <h2 class="h2">Installation</h2>
  <p>
    Le service log est enregistré via <span class="badge-code">logInit</span> dans la méthode
    <span class="badge-code">servicesM.initServices()</span> du fichier
    <span class="badge-code">main.js</span>. Le plugin Vue pour la capture automatique des erreurs
    est installé automatiquement avec ce service. Pour plus de détails sur l'installation des
    services, consultez la
    <router-link
      :to="{ name: 'services' }"
      class="link-underline"
      >documentation des services</router-link
    >.
  </p>
  <p class="mt-10">
    <i class="fa-solid fa-info-circle color-primary mr-5"></i>
    Déclarez la route <span class="badge-code">log</span> dans votre configuration d'API pour
    activer l'envoi des erreurs au backend.
  </p>
  <h3 class="h3">Dépendances</h3>
  <ul class="list ml-25">
    <li>auth - méthode username (pour identifier l'utilisateur dans les logs)</li>
    <li>router - méthode hasApiRoute (pour vérifier si la route log existe)</li>
    <li>
      utils - méthode needUpdate (pour vérifier si une nouvelle version est disponible en cas
      d'erreur)
    </li>
  </ul>
  <h3 class="h3">Configuration</h3>
  <p>
    Déclarez la route <span class="badge-code">log</span> dans
    <span class="badge-code">src/config/routes-api-config.js</span> :
  </p>
  <div class="div-code">
    export const routesApi = {<br />
    &emsp;log: {<br />
    &emsp;&emsp;api: 'main',<br />
    &emsp;&emsp;url: '/log',<br />
    &emsp;&emsp;method: 'post'<br />
    &emsp;}<br />
    }
  </div>
  <h3 class="h3">Activer les logs en développement</h3>
  <p>
    Par défaut, les logs ne sont pas envoyés au backend en environnement de développement (<span
      class="badge-code"
      >VITE_ENV=dev</span
    >). Pour activer l'envoi des logs en dev (utile pour tester le système), utilisez la
    configuration :
  </p>
  <div class="div-code">
    import { ConfigLoader } from '@brugmann/vuemann/src/config/config-loader.js'<br /><br />
    ConfigLoader.set('app.log', true)
  </div>
  <h2 class="h2">Fonctionnement</h2>
  <p>
    Si la route <span class="badge-code">log</span> n'est pas configurée, l'erreur est seulement
    affichée en console.<br />
    Si la route existe, l'erreur (message, stack, contexte) est envoyée en POST à
    <span class="badge-code">/log</span>.
  </p>
  <h2 class="h2">Méthodes accessibles</h2>
  <h3 class="h3"><i class="fa-solid fa-diamond mr-5"></i>send</h3>
  <p>
    Permet d'envoyer une erreur au backend et de la logguer en console. Cette méthode ne fonctionne
    qu'en production (<span class="badge-code">VITE_ENV !== 'dev'</span>) ou si
    <span class="badge-code">app.log</span> est activé.
  </p>
  <h4 class="h4">Paramètres</h4>
  <table class="t-default">
    <thead>
      <tr>
        <th>Nom</th>
        <th>Type</th>
        <th>Obligatoire</th>
        <th>Default</th>
        <th>Description</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>error</td>
        <td>String | Error | Object</td>
        <td>oui</td>
        <td>-</td>
        <td>L'erreur à logguer (convertie automatiquement en message)</td>
      </tr>
      <tr>
        <td>context</td>
        <td>Object</td>
        <td>non</td>
        <td>{}</td>
        <td>Contexte additionnel à envoyer (ex: infos utilisateur, module...)</td>
      </tr>
    </tbody>
  </table>
  <h4 class="h4">Structure envoyée au backend</h4>
  <p>Le service envoie automatiquement les données suivantes au backend :</p>
  <div class="div-code">
    {<br />
    &emsp;date: "2025-01-18T10:30:00.000Z", <span class="color-neutral-500">// ISO timestamp</span
    ><br />
    &emsp;app: "MyApp", <span class="color-neutral-500">// app.name depuis app-config.js</span
    ><br />
    &emsp;version: "1.2.0", <span class="color-neutral-500">// app.version depuis ConfigLoader</span
    ><br />
    &emsp;user: "john.doe", <span class="color-neutral-500">// auth.username()</span><br />
    &emsp;message: "Error message",
    <span class="color-neutral-500">// error.message ou error.toString()</span><br />
    &emsp;stack: "Error: ...\n at ...",
    <span class="color-neutral-500">// error.stack si disponible</span><br />
    &emsp;...context
    <span class="color-neutral-500">// Propriétés additionnelles du paramètre context</span><br />
    }
  </div>
  <p class="mt-10">
    <i class="fa-solid fa-circle-info color-primary"></i>
    La requête est envoyée avec l'option <span class="badge-code">log: false</span> pour éviter une
    boucle infinie si l'envoi du log génère lui-même une erreur.
  </p>
  <h4 class="h4">Exemple</h4>
  <div class="div-code mb-10">
    //utilisation avec le service manager<br />
    import { servicesM } from "@brugmann/vuemann/src/services/services-manager.js";<br />
    servicesM.service('log:send', [error, context]);<br />
    //utilisation avec le helper<br /><br />
    import { log } from "@brugmann/vuemann/src/shortcuts/services-shortcut.js";<br />
    log.send(error, context);
  </div>
  <div class="d-flex g-25">
    <div class="f-column flex-1 text-center">
      <button
        class="btn btn-primary btn-primary-400-active"
        @click="trifferSendLog"
      >
        Déclencher l'envoi d'un log d'erreur
      </button>
      <span
        v-if="logSent"
        class="ml-10"
        >Erreur envoyée !</span
      >
    </div>
    <div class="f-column flex-1 text-center">
      <button
        class="btn btn-primary btn-primary-400-active"
        @click="triggerLog"
      >
        Déclencher un log d'erreur
      </button>
      <span
        v-if="logTrigger"
        class="ml-10"
        >Erreur déclenchée !</span
      >
    </div>
  </div>

  <h2 class="h2 mt-30">Logger léger (Console uniquement)</h2>
  <p>
    Le service <b>log</b> fournit également des méthodes de logging légères qui affichent uniquement
    dans la console (dev + prod) sans envoyer au backend. Ces méthodes sont réutilisables dans toute
    l'application.
  </p>

  <h3 class="h3"><i class="fa-solid fa-diamond mr-5"></i>error</h3>
  <p>
    Affiche un message d'erreur dans la console avec le préfixe
    <span class="badge-code">[Error]</span>.
  </p>
  <div class="div-code mb-20">
    import { log } from "@brugmann/vuemann/src/shortcuts/services-shortcut.js";<br />
    log.error('Une erreur critique est survenue', { userId: 123 });
  </div>

  <h3 class="h3"><i class="fa-solid fa-diamond mr-5"></i>warn</h3>
  <p>
    Affiche un avertissement dans la console avec le préfixe
    <span class="badge-code">[Warning]</span>.
  </p>
  <div class="div-code mb-20">
    import { log } from "@brugmann/vuemann/src/shortcuts/services-shortcut.js";<br />
    log.warn('Attention : Valeur obsolète détectée');
  </div>

  <h3 class="h3"><i class="fa-solid fa-diamond mr-5"></i>info</h3>
  <p>
    Affiche une information dans la console avec le préfixe <span class="badge-code">[Info]</span>.
  </p>
  <div class="div-code mb-20">
    import { log } from "@brugmann/vuemann/src/shortcuts/services-shortcut.js";<br />
    log.info('Chargement des données terminé');
  </div>

  <h3 class="h3"><i class="fa-solid fa-diamond mr-5"></i>debug</h3>
  <p>
    Affiche un message de debug dans la console avec le préfixe
    <span class="badge-code">[Debug]</span>.
  </p>
  <div class="div-code mb-20">
    import { log } from "@brugmann/vuemann/src/shortcuts/services-shortcut.js";<br />
    log.debug('État actuel:', { step: 3, data: {...} });
  </div>

  <h4 class="h4 mt-20">Aperçu</h4>
  <p class="mb-20">
    <i class="fa-solid fa-circle-info color-info mr-5"></i>
    Cliquez sur les boutons ci-dessous pour tester les différents niveaux de log. Ouvrez la console
    de votre navigateur pour voir les résultats.
  </p>
  <div class="d-flex f-wrap g-15 mb-30">
    <button
      class="btn btn-danger"
      @click="testError"
    >
      <i class="fa-solid fa-circle-xmark mr-5"></i>
      Tester log.error()
    </button>
    <button
      class="btn btn-warning"
      @click="testWarn"
    >
      <i class="fa-solid fa-triangle-exclamation mr-5"></i>
      Tester log.warn()
    </button>
    <button
      class="btn btn-info"
      @click="testInfo"
    >
      <i class="fa-solid fa-circle-info mr-5"></i>
      Tester log.info()
    </button>
    <button
      class="btn btn-primary btn-primary-400-active"
      @click="testDebug"
    >
      <i class="fa-solid fa-bug mr-5"></i>
      Tester log.debug()
    </button>
  </div>

  <h4 class="h4 mt-20">Différence entre log.send() et log.error/warn/info/debug</h4>
  <table class="t-default mb-20">
    <thead>
      <tr>
        <th>Méthode</th>
        <th>Console</th>
        <th>Envoi backend</th>
        <th>Environnement</th>
        <th>Usage recommandé</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><b>log.send()</b></td>
        <td>✅ Oui</td>
        <td>✅ Oui</td>
        <td>Prod (ou dev si app.log)</td>
        <td>Erreurs critiques à tracker</td>
      </tr>
      <tr>
        <td><b>log.error()</b></td>
        <td>✅ Oui</td>
        <td>❌ Non</td>
        <td>Dev + Prod</td>
        <td>Erreurs à afficher en console</td>
      </tr>
      <tr>
        <td><b>log.warn()</b></td>
        <td>✅ Oui</td>
        <td>❌ Non</td>
        <td>Dev + Prod</td>
        <td>Avertissements</td>
      </tr>
      <tr>
        <td><b>log.info()</b></td>
        <td>✅ Oui</td>
        <td>❌ Non</td>
        <td>Dev + Prod</td>
        <td>Messages informatifs</td>
      </tr>
      <tr>
        <td><b>log.debug()</b></td>
        <td>✅ Oui</td>
        <td>❌ Non</td>
        <td>Dev + Prod</td>
        <td>Messages de débogage</td>
      </tr>
    </tbody>
  </table>

  <h2 class="h2">Raccourcis disponibles</h2>
  <p>Le service log expose un objet de raccourcis pour faciliter l'utilisation :</p>
  <div class="div-code">
    import { log } from '@brugmann/vuemann/src/shortcuts/services-shortcut.js'<br />
    <br />
    log.send(error, context) <span class="color-neutral-500">// Envoi au backend</span><br />
    log.error(message, ...args) <span class="color-neutral-500">// Console uniquement</span><br />
    log.warn(message, ...args) <span class="color-neutral-500">// Console uniquement</span><br />
    log.info(message, ...args) <span class="color-neutral-500">// Console uniquement</span><br />
    log.debug(message, ...args) <span class="color-neutral-500">// Console uniquement</span>
  </div>
  <h2 class="h2">Lire les logs en production</h2>
  <p>
    Les fichiers de l'application étant minifiés en production, vous ne pourrez pas retrouver la
    localisation des erreurs facilement. Suivez cette procédure pour lire les logs sur
    <router-link
      to="/debug"
      class="link-underline"
      >la page de debug</router-link
    >.
  </p>
</template>
