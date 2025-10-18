<script setup>
import { ref } from 'vue'
import { logService } from '@brugmann/vuemann/src/services/log/init/log-service.js'

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
</script>


<template>
  <h1 class="h1">Service Log</h1>
  <p>
    Le service <b>log</b> permet de centraliser la gestion des erreurs dans l'application VueJS. Il loggue les erreurs en console et les envoie 
    à une route API nommée <span class="badge-code">log</span>.
  </p>
  <p>
    <i class="fa-solid fa-triangle-exclamation color-danger mr-5"></i>
    Ce service n'est pas activé en environnement de développement.
    <i class="fa-solid fa-triangle-exclamation color-danger ml-5"></i>
  </p>
  <h2 class="h2">Installation</h2>
  <ul class="list ml-25">
    <li>Déclarez la route <span class="badge-code">log</span> dans votre configuration d'API.</li>
    <li class="my-10">Importez et utilisez le <span class="badge-code">logPlugin</span> dans votre <span class="badge-code">main.js</span> pour capturer automatiquement les erreurs VueJS.</li>
    <li>Importez le service <span class="badge-code">logService</span> services situé dans le fichier main.js.</li>
  </ul>
  <h2 class="h2">Fonctionnement</h2>
  <p>
    Si la route <span class="badge-code">log</span> n'est pas configurée, l'erreur est seulement affichée en console.<br />
    Si la route existe, l'erreur (message, stack, contexte) est envoyée en POST à <span class="badge-code">/log</span>.
  </p>
  <h2 class="h2">Méthodes accessibles</h2>
  <h3 class="h3"><i class="fa-solid fa-diamond mr-5"></i>send</h3>
  <p>
    Permet d'envoyer une erreur au backend et de la logguer en console.
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
        <td>String | Object</td>
        <td>oui</td>
        <td>-</td>
        <td>L'erreur à logguer (string ou instance d'Error)</td>
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
  <h4 class="h4">Exemple</h4>
  <div class="div-code mb-10">
    //utilisation avec le service manager<br />
    import { servicesM } from "@brugmann/vuemann/src/services/services-manager.js";<br />
    servicesM.service('log:send', [error, context]);<br />
    //utilisation avec le helper<br /><br />
    import { log } from "@brugmann/vuemann/src/services/services-helper.js";<br />
    log.send(error, context);
  </div>
  <div class="d-flex g-25">
    <div class="f-column flex-1 text-center">
      <button class="btn btn-primary" @click="trifferSendLog">Déclencher l'envoi d'un log d'erreur</button>
      <span v-if="logSent" class="ml-10">Erreur envoyée !</span>
    </div>
    <div class="f-column flex-1 text-center">
      <button class="btn btn-primary" @click="triggerLog">Déclencher un log d'erreur</button>
      <span v-if="logTrigger" class="ml-10">Erreur déclenchée !</span>
    </div>
  </div>
  <h2 class="h2">Lire les logs en production</h2>
  <p>
    Les fichiers de l'application étant minifiés en production, vous ne pourrez pas retrouver la localisation des erreurs facilement.
    Suivez cette procédure pour lire les logs sur <router-link to="/debug" class="link-underline">la page de debug</router-link>.
  </p>
</template>
