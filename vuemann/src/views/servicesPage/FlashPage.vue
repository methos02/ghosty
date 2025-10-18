<template>
  <h1 class="h1"> Service Flash </h1>
  <p>
    Permet de faire apparaître des messages flash sur le côté droit de l'écran. Les messages flash sont gérés dans le fichier flashStore.
  </p>
  <h2 class="h2">Installation</h2>
  <ul class="list ml-25">
    <li>Importer flashService dans l'objet services situé dans le fichier main.js.</li>
    <li>Importer flashPlugin dans l'array plugins_synchrone dans le fichier main.js.</li>
  </ul>
  <h2 class="h2">Fonctions accessibles depuis le gestionnaire de service</h2> 
  <!-- success -->
  <h3 class="h3"><i class="fa-solid fa-diamond mr-5"></i>success</h3>
  <p>
    Permet d'afficher un message de succès (couleur vert) sur le côté droit de l'écran.
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
      <td>
        message à afficher
      </td>
    </tr>
  </tbody>
</table>
  <h4 class="h4">utilisation</h4>
  <div class="div-code">
    <span class="color-neutral-500">//appel via le service manager</span><br />    import { servicesM } from "@brugmann/vuemann/src/services/services-manager.js"<br />    <br />    servicesM.service('flash', 'success', 'message')<br />    <br />    <span class="color-neutral-500">//appel avec le raccourci </span><br />   
    import { success } from "@brugmann/vuemann/src/services/services-helper.js"<br />    <br />          
    success('message')<br />  </div>
  <!-- error -->
  <h3 class="h3"><i class="fa-solid fa-diamond mr-5"></i>error</h3>
    <p>
      Permet d'afficher un message de succès (couleur rouge) sur le côté droit de l'écran. Cette fonction affiche aussi le message 
      en console avec la fonction <span class="badge-code">console.flash.error()</span>.
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
        <td>
          message à afficher
        </td>
      </tr>
    </tbody>
  </table>
  <h4 class="h4">utilisation</h4>
  <div class="div-code">
    <span class="color-neutral-500">//appel via le service manager</span><br />    import { servicesM } from "@brugmann/vuemann/src/services/services-manager.js"<br />    <br />    servicesM.service('error', 'success', 'message')<br />    <br />    <span class="color-neutral-500">//appel avec le raccourci </span><br />   
    import { flash } from "@brugmann/vuemann/src/services/services-helper.js""<br />    <br />          
    flash.error('message')<br />  </div>
  <!-- warning -->
  <h3 class="h3"><i class="fa-solid fa-diamond mr-5"></i>warning</h3>
    <p>
      Permet d'afficher un message de succès (couleur jaune / orange) sur le côté droit de l'écran.
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
        <td>
          message à afficher
        </td>
      </tr>
    </tbody>
  </table>
  <h4 class="h4">utilisation</h4>
  <div class="div-code">
    <span class="color-neutral-500">//appel via le service manager</span><br />    import { servicesM } from "@brugmann/vuemann/src/services/services-manager.js"<br />    <br />    servicesM.service('warning', 'success', 'message')<br />    <br />    <span class="color-neutral-500">//appel avec le raccourci </span><br />   
    import { warning } from "@brugmann/vuemann/src/services/services-helper.js"<br />    <br />          
    warning('message')<br />  </div>
</template>
