<template>
  <h1 class="h1">Service Websocket</h1>
  <p>
    Ce service permet de gérer les connexions websocket en enregistrant des events pour des routes.
    Un système de queue permet de gérer les messages en attente lorsque plusieurs messages sont
    envoyés. Cela évite des comportements non désirés lorsque des messages sont envoyés trop
    rapidement.
  </p>
  <h2 class="h2">Installation</h2>
  <p>
    Le service websocket n'est pas inclus par défaut dans Vuemann. Si vous souhaitez l'utiliser,
    créez un fichier
    <span class="badge-code">websocketInit</span> et enregistrez-le dans la méthode
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
  <ul class="list ml-25">
    <li>auth - methode getAccessToken</li>
    <li>flash - methode error</li>
    <li>locale - methode t</li>
    <li>log - methode send</li>
    <li>router - route.current() (lecture de meta.ws.reload de la page)</li>
  </ul>
  <h3 class="h3">Configuration</h3>
  <p>
    La configuration du service websocket se fait via
    <span class="badge-code">src/config/app-config.js</span> et
    <span class="badge-code">src/config/routes-api-config.js</span>.
  </p>
  <h4 class="h4">Désactiver les websockets</h4>
  <p>
    Dans <span class="badge-code">app-config.js</span>, vous pouvez désactiver globalement les
    connexions websocket :
  </p>
  <div class="div-code">
    export const app = {<br />
    &emsp;ws: "false" <span class="color-neutral-500">// Désactive toutes les connexions WS</span
    ><br />
    }
  </div>
  <h4 class="h4">Les routes</h4>
  <p>
    Les routes websocket sont définies dans
    <span class="badge-code">routes-api-config.js</span> avec la même structure que les routes HTTP.
    Le service convertit automatiquement le protocole HTTP en WebSocket (<span class="badge-code"
      >http → ws</span
    >, <span class="badge-code">https → wss</span>).
  </p>
  <div class="div-code">
    export const routesApi = {<br />
    &emsp;'appointment.ws': {<br />
    &emsp;&emsp;api: 'main',<br />
    &emsp;&emsp;url: '/ws/appointments'<br />
    &emsp;}<br />
    }
  </div>
  <p class="mt-10">
    Si <span class="badge-code">app.apis.main.url = 'https://api.example.com'</span>, l'URL générée
    sera <span class="badge-code">wss://api.example.com/ws/appointments</span>.
  </p>
  <h4 class="h4">Les évents</h4>
  <p>
    Pour pouvoir répondre aux messages envoyés par websocket, vous devez enregistrer un event et une
    fonction associée avec la methode <span class="badge-code">register</span>.
  </p>
  <h3 class="h3">Structure du Message</h3>
  <p>Les messages WebSocket doivent suivre une structure JSON spécifique :</p>
  <div class="div-code">
    {<br />
    &emsp;"event": "nom_de_levent",<br />
    &emsp;"data": { <span class="color-neutral-500">// Données optionnelles</span><br />
    &emsp;&emsp;"key": "value"<br />
    &emsp;}<br />
    }
  </div>
  <p class="mt-10">
    <i class="fa-solid fa-circle-info color-primary"></i>
    Les événements <span class="badge-code">ping</span> et
    <span class="badge-code">connected</span> sont gérés automatiquement et ne nécessitent pas
    d'enregistrement.
  </p>
  <h2 class="h2">Fonctionnalités avancées</h2>
  <h3 class="h3">Système de Queue</h3>
  <p>
    Le service websocket implémente un système de file d'attente pour traiter les messages de
    manière séquentielle. Cela garantit que les messages sont traités dans l'ordre et évite les
    comportements non désirés lorsque plusieurs messages arrivent rapidement.
  </p>
  <div class="div-code">
    <span class="color-neutral-500">// Les messages sont automatiquement mis en queue</span><br />
    <span class="color-neutral-500">// et traités un par un dans l'ordre d'arrivée</span><br />
    messages = [message1, message2, message3]<br />
    <span class="color-neutral-500">// Traitement séquentiel garanti</span>
  </div>
  <h3 class="h3">Reconnexion automatique</h3>
  <p>
    Lorsqu'une connexion est fermée de manière inattendue (perte réseau, redémarrage serveur), le
    service tente automatiquement de se reconnecter avec un <strong>backoff exponentiel</strong> :
    le délai double à chaque tentative (~1s, 2s, 4s…), avec du <em>jitter</em> aléatoire, et se
    plafonne à ~30s. Les tentatives se poursuivent indéfiniment jusqu'au succès.
  </p>
  <p class="mt-10">
    <i class="fa-solid fa-circle-info color-primary"></i>
    Le backoff plafonné évite qu'à un redémarrage backend, tous les clients ne martèlent le serveur
    en même temps (effet de troupeau) pile au moment où il est le plus fragile.
  </p>
  <p class="mt-10">
    <i class="fa-solid fa-circle-info color-primary"></i>
    La reconnexion automatique ne se déclenche pas si vous fermez la connexion manuellement avec
    <span class="badge-code">ws.close()</span>.
  </p>
  <div class="div-code">
    <span class="color-neutral-500">// Connexion perdue → tentatives automatiques</span><br />
    console.log('Tentative de reconnexion...')<br />
    <span class="color-neutral-500"
      >// Délai croissant (~1s → 2s → 4s …) plafonné à ~30s, jusqu'au succès</span
    ><br />
    <br />
    <span class="color-neutral-500">// Pour arrêter la reconnexion</span><br />
    ws.close('route_name')
  </div>
  <h3 class="h3">Authentification automatique</h3>
  <p>
    Dès qu'une connexion WebSocket est établie, le service envoie automatiquement le token
    d'authentification via un message de type <span class="badge-code">auth</span>.
  </p>
  <div class="div-code">
    <span class="color-neutral-500">// Message envoyé automatiquement à l'ouverture</span><br />
    {<br />
    &emsp;"type": "auth",<br />
    &emsp;"token": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."<br />
    }
  </div>
  <h3 class="h3">Gestion des erreurs</h3>
  <p>
    Le service gère automatiquement plusieurs types d'erreurs et affiche des messages flash
    appropriés :
  </p>
  <ul class="list ml-25">
    <li><span class="badge-code">ws_route_unknow</span> - Route inconnue dans la configuration</li>
    <li>
      <span class="badge-code">ws_route_already_exist</span> - Tentative d'ouverture d'une connexion
      déjà ouverte
    </li>
    <li>
      <span class="badge-code">ws_api_undefined</span> - API non définie dans la configuration
    </li>
    <li><span class="badge-code">ws_data_bad</span> - Message reçu avec un format JSON invalide</li>
    <li><span class="badge-code">ws_data_no_event</span> - Message sans propriété "event"</li>
    <li><span class="badge-code">ws_event_unknow</span> - Event non enregistré pour cette route</li>
    <li>
      <span class="badge-code">ws_event_already_exist</span> - Tentative d'enregistrement d'un event
      déjà enregistré
    </li>
  </ul>
  <p class="mt-10">
    Toutes les erreurs de traitement de messages sont automatiquement loguées via le service
    <router-link
      :to="{ name: 'services.log' }"
      class="link-underline"
      >log</router-link
    >.
  </p>
  <h3 class="h3">Gestion de la visibilité de l'onglet</h3>
  <p>
    Lorsque l'utilisateur quitte l'onglet (changement d'onglet, minimisation du navigateur), les
    événements websocket continuent d'arriver mais leur traitement est bloqué. Cela évite des appels
    API inutiles pendant l'absence de l'utilisateur.
  </p>
  <p class="mt-10">
    Au retour sur l'onglet, les messages bloqués sont
    <strong>rejoués un par un dans l'ordre</strong>, quel que soit leur nombre. Ils ont été mis en
    tampon, pas perdus : aucun bandeau n'est déclenché. La resynchronisation (bandeau) ne concerne
    que les vrais trous (reconnexion, handler en erreur).
  </p>
  <h4 class="h4">Exemple complet</h4>
  <div class="div-code">
    import { onMounted, onUnmounted } from 'vue'<br />
    import { ws } from '@brugmann/vuemann/src/shortcuts/services-shortcut.js'<br />
    <br />
    onMounted(() => {<br />
    &emsp;<span class="color-neutral-500">// Enregistrer les events (enrôle aussi la resync)</span
    ><br />
    &emsp;ws.register('appointment.ws', [<br />
    &emsp;&emsp;{ event: 'appointment_created', callback: handleCreated },<br />
    &emsp;&emsp;{ event: 'appointment_updated', callback: handleUpdated },<br />
    &emsp;])<br />
    })<br />
    <br />
    onUnmounted(() => {<br />
    &emsp;ws.close('appointment.ws')
    <span class="color-neutral-500">// ferme + désenrôle la resync</span><br />
    })
  </div>
  <p class="mt-10">
    <i class="fa-solid fa-circle-info color-primary"></i>
    Le bandeau ne s'affiche que sur un <strong>vrai problème WebSocket</strong> (reconnexion,
    handler en erreur). Un retour d'onglet n'est pas un problème : ses events sont rejoués (0-1) ou
    la page est rechargée silencieusement (2+), jamais de bandeau. Une page qui déclare
    <span class="badge-code">meta: { ws: { reload: false } }</span> (typiquement un formulaire) est
    exclue : aucun bandeau, aucun rechargement — la donnée se rafraîchira au changement de page.
  </p>
  <h4 class="h4">Démo du bandeau</h4>
  <p>Cliquez pour afficher le bandeau de resynchronisation (rendu en bas à gauche de l'écran) :</p>
  <div class="d-flex g-10 mt-10">
    <button
      class="btn btn-sm btn-danger"
      @click="demoShow"
    >
      Afficher le bandeau
    </button>
    <button
      class="btn btn-sm btn-ghost-primary"
      @click="demoReset"
    >
      Réinitialiser
    </button>
  </div>
  <p class="mt-10">
    <i class="fa-solid fa-triangle-exclamation color-warning"></i>
    Le bandeau recharge réellement la page à la fin du compte à rebours : utilisez
    <em>Retarder</em> ou <em>Réinitialiser</em> pour éviter le rechargement pendant la démo.
  </p>
  <ResyncBannerComponent />
  <p class="mt-10">
    <i class="fa-solid fa-flask color-primary"></i>
    <strong>Démo en direct</strong> : Ouvrez la console du navigateur et changez d'onglet pour
    observer les logs de détection de visibilité.
  </p>
  <h2 class="h2">Fonctions accessibles depuis le gestionnaire de service</h2>
  <!-- open -->
  <h3 class="h3"><i class="fa-solid fa-diamond mr-5"></i>open</h3>
  <p>
    Permet d'ouvrir une connection ws avec une api en utilisant une route. La connexion envoie
    automatiquement le token d'authentification dès l'ouverture.
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
        <td>Nom de la route</td>
      </tr>
    </tbody>
  </table>
  <h4 class="h4">Retour</h4>
  <p>
    Retourne <span class="badge-code">true</span> si la connexion a été ouverte avec succès,
    <span class="badge-code">false</span> si les websockets sont désactivés ou si la route n'existe
    pas.
  </p>
  <h4 class="h4">Appel</h4>
  <div class="div-code">
    <span class="color-neutral-500">// via le service manager</span><br />
    servicesM.service('websocket:open', route_name)<br /><br />
    <span class="color-neutral-500">// via le raccourci</span><br />
    ws.open('route_name')
  </div>
  <!-- register -->
  <h3 class="h3"><i class="fa-solid fa-diamond mr-5"></i>register</h3>
  <p>
    Enregistre en un seul appel tous les events d'une route (un tableau d'objets
    <span class="badge-code">{ event, callback }</span>), et
    <strong>enrôle la route pour la resynchronisation</strong>. Il n'y a pas d'appel séparé :
    enregistrer une route l'enrôle, la fermer (<span class="badge-code">close</span>) la désenrôle.
  </p>
  <p>
    <i class="fa-solid fa-triangle-exclamation color-danger"></i>
    Si la connexion n'est pas encore ouverte, le service essaiera d'abord de l'ouvrir avec la
    méthode <span class="badge-code">open</span>.
    <i class="fa-solid fa-triangle-exclamation color-danger"></i>
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
        <td>Nom de la route</td>
      </tr>
      <tr>
        <td>events</td>
        <td>Array</td>
        <td>oui</td>
        <td>-</td>
        <td>
          Tableau d'objets <span class="badge-code">{ event, callback }</span> : le nom de l'event
          et la fonction appelée à sa réception.
        </td>
      </tr>
    </tbody>
  </table>
  <p class="mt-10">
    <i class="fa-solid fa-circle-info color-primary"></i>
    Le comportement de resynchronisation (rechargement ou non) ne dépend <strong>pas</strong> de
    <span class="badge-code">register</span> mais de la <strong>page courante</strong> : voir
    <span class="badge-code">meta.ws.reload</span> dans
    <span class="badge-code">route-config.js</span>.
  </p>
  <h4 class="h4">Appel</h4>
  <div class="div-code">
    <span class="color-neutral-500">// via le raccourci</span><br />
    ws.register('appointment.ws', [<br />
    &emsp;{ event: 'appointment_updated', callback: handleUpdated },<br />
    &emsp;{ event: 'appointment_created', callback: handleCreated },<br />
    ])
  </div>
  <!-- close -->
  <h3 class="h3"><i class="fa-solid fa-diamond mr-5"></i>close</h3>
  <p>
    Permet de fermer une connexion et de supprimer tous les events enregistrés pour cette route.
    Empêche également la reconnexion automatique.
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
        <td>Nom de la route</td>
      </tr>
    </tbody>
  </table>
  <h4 class="h4">Retour</h4>
  <p>
    Retourne <span class="badge-code">'close_totaly'</span> si la connexion et les events ont été
    supprimés, <span class="badge-code">'close_partial'</span> si seuls les events ont été supprimés
    (connexion déjà fermée).
  </p>
  <h4 class="h4">Appel</h4>
  <div class="div-code">
    <span class="color-neutral-500">// via le service manager</span><br />
    servicesM.service('websocket:close', route_name)<br /><br />
    <span class="color-neutral-500">// via le raccourci</span><br />
    ws.close('route_name')
  </div>
  <!-- get -->
  <h3 class="h3"><i class="fa-solid fa-diamond mr-5"></i>get</h3>
  <p>Permet de récupérer une connexion ou toutes les connexions.</p>
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
        <td>route_name</td>
        <td>String</td>
        <td>non</td>
        <td>
          Nom de la route, si aucun paramètre est passé, toutes les connexions seront renvoyées.
        </td>
      </tr>
    </tbody>
  </table>
  <h4 class="h4">Appel</h4>
  <div class="div-code">
    <span class="color-neutral-500">// via le service manager</span><br />
    servicesM.service('websocket:get', route_name)<br /><br />
    <span class="color-neutral-500">// via le raccourci</span><br />
    ws.get('route_name')
  </div>
  <!-- exist -->
  <h3 class="h3"><i class="fa-solid fa-diamond mr-5"></i>exist</h3>
  <p>Permet de savoir si une connexion existe pour une route.</p>
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
        <td>route_name</td>
        <td>String</td>
        <td>oui</td>
        <td>Nom de la route</td>
      </tr>
    </tbody>
  </table>
  <h4 class="h4">Appel</h4>
  <div class="div-code">
    <span class="color-neutral-500">// via le service manager</span><br />
    servicesM.service('websocket:exist', route_name)<br /><br />
    <span class="color-neutral-500">// via le raccourci</span><br />
    ws.exist('route_name')
  </div>
  <!-- isActive -->
  <h3 class="h3"><i class="fa-solid fa-diamond mr-5"></i>isActive</h3>
  <p>
    Permet de vérifier si une connexion est active (en cours de connexion ou ouverte). Contrairement
    à <span class="badge-code">exist</span>, cette méthode vérifie l'état réel de la connexion
    WebSocket.
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
        <td>route_name</td>
        <td>String</td>
        <td>oui</td>
        <td>Nom de la route</td>
      </tr>
    </tbody>
  </table>
  <h4 class="h4">Retour</h4>
  <p>
    Retourne <span class="badge-code">true</span> si la connexion est dans l'état
    <span class="badge-code">CONNECTING</span> ou <span class="badge-code">OPEN</span>,
    <span class="badge-code">false</span> sinon.
  </p>
  <h4 class="h4">Appel</h4>
  <div class="div-code">
    <span class="color-neutral-500">// Uniquement via Socket (non exposé dans service)</span><br />
    import { Socket } from
    '@brugmann/vuemann/src/services/websocket/src/models/websocket-socket.js'<br /><br />
    Socket.isActive('route_name')
  </div>
  <!-- clear -->
  <h3 class="h3"><i class="fa-solid fa-diamond mr-5"></i>clear</h3>
  <p>
    Permet de nettoyer tous les events enregistrés pour toutes les routes. Cette méthode
    réinitialise complètement le système d'événements websocket.
  </p>
  <p>
    <i class="fa-solid fa-triangle-exclamation color-danger"></i>
    Attention : cette méthode supprime TOUS les events de TOUTES les routes. Utilisez-la avec
    précaution.
    <i class="fa-solid fa-triangle-exclamation color-danger"></i>
  </p>
  <h4 class="h4">Appel</h4>
  <div class="div-code">
    <span class="color-neutral-500">// via le service manager</span><br />
    servicesM.service('websocket:clear')<br /><br />
    <span class="color-neutral-500">// via le raccourci</span><br />
    ws.clear()
  </div>
  <!-- clearQueue -->
  <h3 class="h3"><i class="fa-solid fa-diamond mr-5"></i>clearQueue</h3>
  <p>
    Permet de vider la file d'attente des messages websocket pour une route spécifique. Les messages
    des autres routes ne sont pas affectés.
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
        <td>route_name</td>
        <td>String</td>
        <td>oui</td>
        <td>Nom de la route dont on veut vider la queue</td>
      </tr>
    </tbody>
  </table>
  <h4 class="h4">Appel</h4>
  <div class="div-code">
    <span class="color-neutral-500">// via le raccourci</span><br />
    ws.clearQueue('appointment.ws')
  </div>
  <h2 class="h2">Raccourcis</h2>
  <p>Ce service dispose d'un objet de raccourcis pour faciliter le développement.</p>
  <div class="div-code">
    import { ws } from '@brugmann/vuemann/src/shortcuts/services-shortcut.js'<br />
    <br />
    ws.open('route_name')<br />
    ws.register('route_name', [{ event, callback }])<br />
    ws.close('route_name')<br />
    ws.clear()<br />
    ws.clearQueue('route_name')
  </div>
  <h2 class="h2">Bonne pratique</h2>
  <h3 class="h3">Fermer la connexion au démontage</h3>
  <p>
    Si votre connexion websocket n'est active que sur une page, il est important de fermer cette
    connexion lorsque l'on quitte la page. Pour cela utiliser la fonction
    <span class="badge-code">onUnmounted</span>
  </p>
  <div class="div-code">
    import { onUnmounted } from 'vue';<br />
    import { ws } from '@brugmann/vuemann/src/shortcuts/services-shortcut.js'<br />
    <br />
    onUnmounted(() => {<br />
    &emsp;ws.close('appointment.ws')
    <span class="color-neutral-500">// ferme + désenrôle la resync</span><br />
    });
  </div>
  <h3 class="h3">Utiliser les events websocket pour les mises à jour</h3>
  <p>
    Lorsqu'une ressource est modifiée via une requête API (création, mise à jour, suppression), la
    mise à jour de l'interface doit être effectuée
    <strong>uniquement via l'event websocket</strong>, et non dans le callback de la requête API.
  </p>
  <p class="mt-10">
    <i class="fa-solid fa-check color-success"></i> <strong>Bonne approche</strong> : Le serveur
    envoie un event websocket après la modification, et c'est cet event qui déclenche la mise à jour
    de l'interface.
  </p>
  <div class="div-code">
    <span class="color-neutral-500">// Enregistrement de l'event</span><br />
    ws.register('appointment.ws', [{<br />
    &emsp;event: 'appointment_updated',<br />
    &emsp;callback: (data) => updateAppointmentInList(data.appointment),<br />
    }])<br />
    <br />
    <span class="color-neutral-500">// Requête API - pas de mise à jour de l'UI ici</span><br />
    const updateAppointment = async (id, payload) => {<br />
    &emsp;await appointmentController.update(id, payload)<br />
    &emsp;<span class="color-neutral-500">// L'event websocket se chargera de la mise à jour</span
    ><br />
    }
  </div>
  <p class="mt-10">
    <i class="fa-solid fa-xmark color-danger"></i> <strong>Mauvaise approche</strong> : Mettre à
    jour l'interface dans le callback de la requête API.
  </p>
  <div class="div-code">
    <span class="color-neutral-500">// ❌ À éviter</span><br />
    const updateAppointment = async (id, payload) => {<br />
    &emsp;const response = await appointmentController.update(id, payload)<br />
    &emsp;updateAppointmentInList(response.data)
    <span class="color-neutral-500">// ❌ Doublon avec l'event websocket</span><br />
    }
  </div>
  <p class="mt-10">
    <i class="fa-solid fa-circle-info color-primary"></i>
    Cette approche garantit une source unique de vérité et évite les doublons de mise à jour lorsque
    l'utilisateur qui a effectué l'action reçoit également l'event websocket.
  </p>
</template>

<script setup>
import { onMounted, onUnmounted } from 'vue'
import { log } from '@brugmann/vuemann/src/shortcuts/services-shortcut.js'
import ResyncBannerComponent from '@brugmann/vuemann/src/services/websocket/views/ResyncBannerComponent.vue'
import { websocketStore } from '@brugmann/vuemann/src/services/websocket/src/websocket-store.js'

const demoShow = () => {
  websocketStore.request('demo.ws')
}
const demoReset = () => {
  websocketStore.dismiss()
}

const handleVisibilityChange = () => {
  if (document.hidden) {
    log.info('WebsocketPage - Onglet quitté')
    return
  }
  log.info("WebsocketPage - Retour sur l'onglet")
}

onMounted(() => {
  document.addEventListener('visibilitychange', handleVisibilityChange)
})

onUnmounted(() => {
  document.removeEventListener('visibilitychange', handleVisibilityChange)
})
</script>
