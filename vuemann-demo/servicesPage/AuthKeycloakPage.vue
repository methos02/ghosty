<template>
  <h1 class="h1 color-primary">Service Auth Keycloak</h1>
  <p>
    <span class="badge-code">auth-keycloak</span> est une alternative au service
    <router-link
      :to="{ name: 'services.auth' }"
      class="link-underline"
      >auth</router-link
    >
    basée sur
    <a
      href="https://www.keycloak.org/"
      target="_blank"
      class="underline link-underline"
      >Keycloak</a
    >. Il s'enregistre sous la même clé <span class="badge-code">auth</span> dans le service manager
    : tous les appels <span class="badge-code">auth.login()</span>,
    <span class="badge-code">auth.hasRole()</span>, etc. fonctionnent sans changement de code
    appelant.
  </p>
  <p class="color-warning">
    <i class="fa-solid fa-triangle-exclamation mr-5"></i>
    Une seule implémentation d'authentification peut être active par application. On utilise
    <strong>soit</strong> <span class="badge-code">auth</span> (GUMS) <strong>soit</strong>
    <span class="badge-code">auth-keycloak</span>, jamais les deux.
  </p>

  <h3 class="h3">Dépendances</h3>
  <ul class="list ml-25">
    <li>Aucune dépendance de service (contrairement à <span class="badge-code">auth</span>).</li>
    <li>
      Dépendance runtime : <span class="badge-code">keycloak-js</span> (embarquée dans vuemann).
    </li>
  </ul>

  <h2 class="h2">Installation</h2>
  <p>
    Le service s'enregistre sous la clé <span class="badge-code">auth</span> dans
    <span class="badge-code">main.js</span>. Pour migrer depuis le service
    <span class="badge-code">auth</span>, il suffit de remplacer l'import
    <span class="badge-code">authInit</span> par <span class="badge-code">authKeycloakInit</span> :
  </p>
  <div class="div-code">
    import authKeycloakInit from '@brugmann/vuemann/src/services/auth-keycloak/auth-init.js'<br />
    import { servicesInit } from '@brugmann/vuemann/src/services/services-init.js'<br />
    <br />
    await servicesInit.initServices(app, {<br />
    &emsp;auth: authKeycloakInit,<br />
    &emsp;// ... autres services<br />
    })
  </div>
  <p>
    Aucun autre changement n'est nécessaire dans les composants : les raccourcis
    <span class="badge-code">auth</span> et le store restent identiques.
  </p>

  <h2 class="h2">Configuration</h2>
  <p>
    La configuration vit dans <span class="badge-code">auth-config.js</span> de l'application enfant
    (vuemann n'en fournit pas) :
  </p>
  <div class="div-code">
    export const auth = {<br />
    &emsp;enabled: true,<br />
    &emsp;keycloak: { url, realm, clientId },<br />
    &emsp;roles: { user: 'app-user', admin: 'app-admin' },<br />
    }
  </div>
  <table class="t-default">
    <thead>
      <tr>
        <th>Clé</th>
        <th>Rôle</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><span class="badge-code">enabled</span></td>
        <td>
          Si <span class="badge-code">false</span>, l'authentification est court-circuitée
          (utilisateur considéré comme connecté). Utile en développement.
        </td>
      </tr>
      <tr>
        <td><span class="badge-code">keycloak.url / realm / clientId</span></td>
        <td>
          Paramètres de connexion au serveur Keycloak. Les trois sont requis, sinon le démarrage
          lève une erreur explicite.
        </td>
      </tr>
      <tr>
        <td><span class="badge-code">roles.user</span></td>
        <td>
          Rôle client requis pour accéder à l'application. Un utilisateur authentifié sans ce rôle
          est bloqué (voir « Écran d'accès refusé »).
        </td>
      </tr>
    </tbody>
  </table>

  <h2 class="h2">Rôles</h2>
  <p>
    Les rôles proviennent du token Keycloak, dans
    <span class="badge-code">resource_access[clientId].roles</span>. La fonction
    <span class="badge-code">hasRole(roleName)</span> résout
    <span class="badge-code">auth.roles.{roleName}</span> dans la configuration puis compare au
    tableau des rôles du token.
  </p>
  <div class="div-code">
    import { auth } from '@brugmann/vuemann/src/shortcuts/services-shortcut.js'<br />
    <br />
    if (auth.hasRole('admin')) {<br />
    &emsp;// l'utilisateur possède le rôle configuré dans auth.roles.admin<br />
    }
  </div>

  <h2 class="h2">Méthodes accessibles depuis le service manager</h2>
  <p>
    Le service expose uniquement des <strong>wrappers d'action</strong>. Les données (utilisateur
    courant, rôles, état de connexion) se lisent sur le <span class="badge-code">authStore</span>,
    jamais sur <span class="badge-code">auth</span>.
  </p>
  <table class="t-default">
    <thead>
      <tr>
        <th>Méthode</th>
        <th>Description</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>
          <span class="badge-code">auth.login()</span> /
          <span class="badge-code">auth.logout()</span>
        </td>
        <td>Redirection Keycloak de connexion / déconnexion.</td>
      </tr>
      <tr>
        <td><span class="badge-code">auth.getAccessToken()</span></td>
        <td>Token d'accès Keycloak courant.</td>
      </tr>
      <tr>
        <td><span class="badge-code">auth.refreshToken()</span></td>
        <td>Rafraîchit le token Keycloak.</td>
      </tr>
      <tr>
        <td><span class="badge-code">auth.requiresAuth()</span></td>
        <td>
          <span class="badge-code">true</span> si <span class="badge-code">app.auth</span> n'est pas
          <span class="badge-code">false</span> ou si une API a
          <span class="badge-code">auth: true</span>.
        </td>
      </tr>
      <tr>
        <td>
          <span class="badge-code">auth.routeAuthCheck()</span> /
          <span class="badge-code">auth.routesAuthCheck()</span>
        </td>
        <td>
          Gardes de router : lisent <span class="badge-code">authClient.isAuthenticated()</span>.
        </td>
      </tr>
      <tr>
        <td>
          <span class="badge-code">auth.hasRole()</span> /
          <span class="badge-code">auth.isAuthenticated()</span> /
          <span class="badge-code">auth.username()</span>
        </td>
        <td>Raccourcis de lecture sur le store actif.</td>
      </tr>
    </tbody>
  </table>

  <h2 class="h2">Store</h2>
  <p>
    Le store est auto-suffisant et ne délègue pas à l'ancien service
    <span class="badge-code">auth</span>.
  </p>
  <div class="div-code">
    import { useAuthStore } from '@brugmann/vuemann/src/services/auth-keycloak/auth-store.js'<br />
    <br />
    const { currentUser, currentUserRoles, isAuthenticated } = useAuthStore()
  </div>

  <h2 class="h2">Écran d'accès refusé</h2>
  <p>
    Lorsqu'un utilisateur s'authentifie sur Keycloak <strong>mais ne possède pas</strong> le rôle
    <span class="badge-code">auth.roles.user</span>, l'application n'est
    <strong>jamais montée</strong>. Le démarrage est interrompu et un écran d'accès refusé s'affiche
    à la place.
  </p>
  <p>
    Le message est explicite : l'utilisateur est connecté mais n'a pas les droits d'accès, et doit
    contacter son administrateur (le code interne
    <span class="badge-code">xNNNNN</span> est ajouté pour le support). L'action proposée est une
    <strong>déconnexion</strong> (<span class="badge-code">authClient.logout()</span>) : relancer
    une connexion bouclerait sur la session Keycloak toujours valide, la déconnexion est donc le
    seul moyen de sortir et de se connecter avec un autre compte.
  </p>
  <ul class="list ml-25">
    <li>
      <span class="badge-code">x00001</span> : authentifié mais sans le rôle
      <span class="badge-code">user</span> requis.
    </li>
    <li><span class="badge-code">x00002</span> : aucun rôle client dans le token.</li>
  </ul>
  <p>
    Les deux cas affichent le même message d'accès refusé.
    <router-link
      :to="{ name: 'services.auth-keycloak.error-screen' }"
      class="underline link-underline"
      target="_blank"
      >Vous pouvez visualiser cet écran ici</router-link
    >.
  </p>

  <h2 class="h2">Démarrage conditionnel (main.js)</h2>
  <p>
    L'écran est rendu par <span class="badge-code">initServices</span> lui-même : le service décrit
    seulement l'erreur (clés de traduction + callback), sans toucher au DOM.
    <span class="badge-code">main.js</span> ne monte l'application que si le démarrage a réussi.
  </p>
  <div class="div-code">
    import { BOOT_STATUS } from '@brugmann/vuemann/src/constants/boot-status.js'<br />
    <br />
    const boot = await servicesInit.initServices(app, { auth: authKeycloakInit, ... })<br />
    if (boot.status === BOOT_STATUS.SUCCESS) { app.mount('#app') }
  </div>
  <p>
    <i class="fa-solid fa-info-circle color-primary mr-5"></i>
    Veillez à ce que les comptes de développement portent bien le rôle
    <span class="badge-code">user</span>, sans quoi ils tomberont sur cet écran.
  </p>
</template>
