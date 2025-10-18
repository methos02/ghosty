<template>
  <h1 class="h1"> Service Websocket </h1>
  <p>
    Ce service permet de gérer les connexions websocket en enregistrant des events pour des routes. Un système de queue permet de gérer les messages 
    en attente lorsque plusieurs messages sont envoyés. Cela évite des comportements non désirés lorsque des messages sont envoyés trop rapidement.
  </p>
  <h2 class="h2">Installation</h2>
  <ul class="list ml-25 f-column g-5">
    <li>Importer <span class="badge-code">websocketService</span> dans l'objet services situé dans le fichier main.js.</li>
  </ul>
  <h3 class="h3">Dépendances</h3>
  <ul class="list ml-25">
    <li>auth - methode getAccessToken</li>
    <li>flash - methode error</li>
    <li>locale - methode t</li>
    <li>log - methode send</li>
  </ul>
  <h3 class="h3">Configuration</h3>
  <p>
    Vous avez la possibilité de désactiver les connections websocket dans le fichier de config 
    <router-link :to="{name: 'config.app'}" class="underline link-underline">app-config.js</router-link>.
    Pour cela utiliser une variable d'environement et importée là à la racine de la config avec la clé <span class="badge-code">ws</span>.
  </p>
  <h4 class="h4">Les routes</h4>
  <p>
    Tous comme les routes classique, le service websocket ira lire le fichier de config pour récupérer l'url de l'api. Si cette dernière commence par 
    https, il changera le protocole en ws.
  </p>
  <h4 class="h4">Les évents</h4>
  <p>
    Pour pouvoir répondre aux messages envoyés par websocket, vous devez enregistrer un event et une fonction associée avec 
    la methode <span class="badge-code">register</span>.  
  </p>
  <h2 class="h2">Fonctions accessibles depuis le gestionnaire de service</h2> 
  <!-- open -->
  <h3 class="h3"><i class="fa-solid fa-diamond mr-5"></i>open</h3>
    <p>
      Permet d'ouvrir une connection ws avec une api en utilisant une route. 
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
          Nom de la route
        </td>
      </tr>
    </tbody>
  </table>
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
      Permet d'enregistrer des events au près d'une route. 
    </p>
    <p>
      <i class="fa-solid fa-triangle-exclamation color-danger"></i>
      Si la connexion n'est pas encore ouverte, le service essaiera d'abord de l'ouvrir avec la méthode <span class="badge-code">open</span>.
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
        <td>
          Nom de la route
        </td>
      </tr>
      <tr>
        <td>event</td>
        <td>String</td>
        <td>oui</td>
        <td>-</td>
        <td>
          Nom de l'event
        </td>
      </tr>
      <tr>
        <td>cb</td>
        <td>Function</td>
        <td>oui</td>
        <td>-</td>
        <td>
          fonction callback a appeler lorsque l'on reçoit un message websoket avec cet évent.
        </td>
      </tr>
    </tbody>
  </table>
  <h4 class="h4">Appel</h4>
  <div class="div-code">
    <span class="color-neutral-500">// via le service manager</span><br />
    servicesM.service('websocket:register', [route_name, event, cb])<br /><br />
    <span class="color-neutral-500">// via le raccourci</span><br />
    ws.register('route_name', 'event', cb)
  </div>
  <!-- close -->
  <h3 class="h3"><i class="fa-solid fa-diamond mr-5"></i>close</h3>
    <p>
      Permet de fermer une connexion et de supprimer tous les events enregistrés pour cette route.
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
          Nom de la route
        </td>
      </tr>
    </tbody>
  </table>
  <h4 class="h4">Appel</h4>
  <div class="div-code">
    <span class="color-neutral-500">// via le service manager</span><br />
    servicesM.service('websocket:close', route_name)<br /><br />
    <span class="color-neutral-500">// via le raccourci</span><br />
    ws.close('route_name')
  </div>
  <!-- get -->
  <h3 class="h3"><i class="fa-solid fa-diamond mr-5"></i>get</h3>
  <p>
    Permet de récupérer une connexion ou toutes les connexions.
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
  <p>
    Permet de savoir si une connexion existe pour une route.
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
        <td>
          Nom de la route
        </td>
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
  <!-- registerPrevent -->
  <h3 class="h3"><i class="fa-solid fa-diamond mr-5"></i>registerPrevent</h3>
    <p>
      Cette méthode permet d'ignorer un event websoket en fonction des données transmises. La régle de prévention sera supprimer lorsque l'event ciblé sera reçu.
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
        <td>
          Nom de la route
        </td>
      </tr>
      <tr>
        <td>event</td>
        <td>String</td>
        <td>oui</td>
        <td>
          Nom de l'évent
        </td>
      </tr>
      <tr>
        <td>event_datas</td>
        <td>Object</td>
        <td>oui</td>
        <td>
          Données que doit contenir l'event pour être ignoré.
        </td>
      </tr>
    </tbody>
  </table>
  <h4 class="h4">Appel</h4>
  <div class="div-code">
    <span class="color-neutral-500">// via le service manager</span><br />
    servicesM.service('websocket:registerPrevent', [route_name, event, event_datas])<br /><br />
    <span class="color-neutral-500">// via le raccourci</span><br />
    ws.registerPrevent('route_name', 'event', 'event_datas')
  </div>
  <h4 class="h4">Exemple</h4>
  <div class="div-code">
    servicesM.service('websocket:registerPrevent', ['ws.appointment', 'rdv_lock', {id:1}])   
  </div>
  <p>
    Dans l'exemple ci-dessus, aucun traitement ne sera fait pour le prochain event rdv_lock dont l'id est égale à 1
  </p>
  <!-- hasPrevent -->
  <h3 class="h3"><i class="fa-solid fa-diamond mr-5"></i>hasPrevent</h3>
    <p>
      Permet de savoir si un event est ignoré pour une route.
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
        <tr>
          <td>event</td>
          <td>String</td>
          <td>oui</td>
          <td>Nom de l'event</td>
        </tr>
      </tbody>
    </table>
    <h4 class="h4">Appel</h4>
    <div class="div-code">
      <span class="color-neutral-500">// via le service manager</span><br />
      servicesM.service('websocket:hasPrevent', [route_name, event])<br /><br />
      <span class="color-neutral-500">// via le raccourci</span><br />
      ws.hasPrevent('route_name', 'event')
    </div>
  <!-- getPrevent -->
  <h3 class="h3"><i class="fa-solid fa-diamond mr-5"></i>getPrevent</h3>
    <p>
      Permet de récupérer les données d'un event ignoré pour une route.
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
        <tr>
          <td>event</td>
          <td>String</td>
          <td>oui</td>
          <td>Nom de l'event</td>
        </tr>
      </tbody>
    </table>
    <h4 class="h4">Appel</h4>
    <div class="div-code">
      <span class="color-neutral-500">// via le service manager</span><br />
      servicesM.service('websocket:getPrevent', [route_name, event])<br /><br />
      <span class="color-neutral-500">// via le raccourci</span><br />
      ws.getPrevent('route_name', 'event')
    </div>
  <h2 class="h2">Raccourcis</h2>
  <p>
    Ce service dispose d'un objet de raccourcis pour faciliter le développement.
  </p>
  <div class="div-code">
    import { ws } from '@brugmann/vuemann/src/services/services-helper.js'<br />    <br />    ws.open('route_name')<br />    ws.register('route_name', 'event', cb)<br />    ws.registerPrevent('route_name', 'event', 'event_datas')   
    ws.close('route_name')   
  </div>
  <h2 class="h2">Bonne pratique</h2>
  <p>
    Si votre connexion websocket n'est active que sur une page, il est important de fermer cette connexion lorsque l'on quitte la page. 
    Pour cela utiliser la fonction <span class="badge-code">onUnmounted</span>
  </p>
  <div class="div-code">
    import { onUnmounted } from 'vue';<br />    import { ws } from '@brugmann/vuemann/src/services/services-helper.js'<br />    <br />    onUnmounted(() => {<br />    &emsp;ws.close('appointment.ws')<br />    });

  </div>
</template>
