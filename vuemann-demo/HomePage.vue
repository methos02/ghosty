<template>
  <h1 class="h1">Bienvenue sur Vuemann</h1>
  <p>
    Vuemann est un framework VueJS conçu pour faciliter le développement d'applications
    hospitalières. Il intègre un ensemble de services, d'helpers, de composants et de règles CSS,
    permettant une cohérence et une harmonie entre les différentes applications.
  </p>
  <h2 class="h2">Architecture</h2>
  <p>
    Vuemann utilise un <strong>gestionnaire de services centralisé</strong> qui initialise et
    orchestre tous les services avec gestion des dépendances et détection des dépendances
    circulaires. Pour plus de détails, consultez la
    <router-link
      :to="{ name: 'services' }"
      class="link-underline"
      >documentation des services</router-link
    >.
  </p>
  <h2 class="h2">Installation d'un Service</h2>
  <p>
    L'installation d'un service est simple et suit un pattern standardisé. Chaque service nécessite
    un fichier d'initialisation qui est enregistré dans le
    <span class="badge-code">main.js</span> de votre application.
  </p>
  <h3 class="h3">Fichier d'Initialisation</h3>
  <p>
    Chaque service doit avoir un fichier <span class="badge-code">{service}-init.js</span> qui
    exporte un objet contenant :
  </p>
  <ul class="list ml-25">
    <li>
      <span class="badge-code">dependencies</span> : Array des services dont dépend ce service
    </li>
    <li><span class="badge-code">services</span> : Objet contenant les méthodes du service</li>
    <li><span class="badge-code">plugin</span> : Fonction retournant un objet plugin Vue.js</li>
  </ul>
  <div class="div-code">
    // Exemple : ajax-init.js<br />
    import { ajaxService } from '@brugmann/vuemann/src/services/ajax/init/ajax-service.js'<br />
    <br />
    export const ajaxInit = {<br />
    &emsp;dependencies: ['locale'],<br />
    &emsp;services: ajaxService,<br />
    }
  </div>
  <h3 class="h3">Enregistrement dans main.js</h3>
  <p>
    Les services sont enregistrés via la méthode
    <span class="badge-code">servicesM.initServices()</span> dans le fichier
    <span class="badge-code">main.js</span>. Le service manager gère automatiquement l'ordre
    d'initialisation en fonction des dépendances.
  </p>
  <div class="div-code">
    import { servicesM } from '@brugmann/vuemann/src/services/services-manager.js'<br />
    import { ajaxInit } from '@brugmann/vuemann/src/views/services/ajax/ajax-init.js'<br />
    import { localeInit } from '@brugmann/vuemann/src/views/services/locale/locale-init.js'<br />
    import { authInit } from '@brugmann/vuemann/src/views/services/auth/auth-init.js'<br />
    <br />
    await servicesM.initServices(app, {<br />
    &emsp;ajax: ajaxInit,<br />
    &emsp;locale: localeInit,<br />
    &emsp;auth: authInit,<br />
    &emsp;// ... autres services<br />
    })
  </div>
  <p>
    Le service manager initialise automatiquement les plugins et vérifie les dépendances. Si un
    service dépend d'un autre qui n'est pas enregistré, un message d'erreur sera affiché dans la
    console.
  </p>
  <h2 class="h2">Utilisation des Services</h2>
  <p>
    Pour faciliter l'utilisation quotidienne, Vuemann fournit des raccourcis via le fichier
    <span class="badge-code">services-shortcut.js</span>. Ces raccourcis permettent d'accéder aux
    fonctions des services sans passer par le service manager.
  </p>
  <div class="div-code">
    import { t, req, auth, flash, form } from
    '@brugmann/vuemann/src/shortcuts/services-shortcut.js'<br />
    <br />
    // Traduction<br />
    t('users.title')<br />
    <br />
    // Requête AJAX<br />
    await req('users.index')<br />
    <br />
    // Authentification<br />
    auth.hasRole('admin')<br />
    <br />
    // Flash messages<br />
    flash.success('Operation réussie')<br />
    <br />
    // Validation de formulaire<br />
    form.validate(rules, datas, options)
  </div>
  <h2 class="h2">Méthodes Avancées du Service Manager</h2>
  <p>
    Le service manager expose également des méthodes utilitaires pour inspecter et interagir avec
    les services enregistrés.
  </p>
  <h3 class="h3"><i class="fa-solid fa-diamond mr-5"></i>servicesM.hasService</h3>
  <p>Vérifie si un service est enregistré dans le service manager. Retourne un boolean.</p>
  <div class="div-code">
    import { servicesM } from '@brugmann/vuemann/src/services/services-manager.js'<br />
    <br />
    if (servicesM.hasService('ajax')) {<br />
    &emsp;// Le service AJAX est disponible<br />
    }
  </div>
  <h3 class="h3"><i class="fa-solid fa-diamond mr-5"></i>servicesM.getServices</h3>
  <p>Retourne un tableau contenant les noms de tous les services enregistrés.</p>
  <div class="div-code">
    import { servicesM } from '@brugmann/vuemann/src/services/services-manager.js'<br />
    <br />
    const services = servicesM.getServices()<br />
    // ['ajaxService', 'localeService', 'authService', ...]
  </div>
  <h3 class="h3"><i class="fa-solid fa-diamond mr-5"></i>servicesM.service</h3>
  <p>
    Appelle directement une méthode d'un service via le service manager. Utile pour l'appel
    dynamique de services. La syntaxe est
    <span class="badge-code">service('serviceName:methodName', params)</span>.
  </p>
  <div class="div-code">
    import { servicesM } from '@brugmann/vuemann/src/services/services-manager.js'<br />
    <br />
    // Appel avec un paramètre<br />
    servicesM.service('auth:hasRole', 'admin')<br />
    <br />
    // Appel avec plusieurs paramètres (array)<br />
    servicesM.service('flash:success', ['Message réussi'])<br />
    <br />
    // Appel sans paramètre<br />
    servicesM.service('auth:currentUser')
  </div>
  <h3 class="h3"><i class="fa-solid fa-diamond mr-5"></i>servicesM.resetServices</h3>
  <p>
    Réinitialise tous les services enregistrés. Cette méthode est principalement utilisée pour les
    tests unitaires.
    <i class="fa-solid fa-triangle-exclamation color-warning ml-5"></i> À utiliser avec précaution
    en production.
  </p>
  <div class="div-code">
    import { servicesM } from '@brugmann/vuemann/src/services/services-manager.js'<br />
    <br />
    servicesM.resetServices()
  </div>
  <h2 class="h2">Services par Défaut (Fallback)</h2>
  <p>
    Si un service n'est pas initialisé (par exemple dans un contexte de test), le service manager
    utilise automatiquement des implémentations par défaut pour
    <span class="badge-code">locale</span> et <span class="badge-code">flash</span>. Cela permet
    d'éviter des erreurs critiques si ces services ne sont pas disponibles.
  </p>
  <ul class="list ml-25">
    <li>
      <span class="badge-code">locale.t(key)</span> : Retourne la clé de traduction telle quelle
    </li>
    <li>
      <span class="badge-code">flash.success(message)</span> : Affiche le message dans la console
    </li>
    <li>
      <span class="badge-code">flash.error(message)</span> : Affiche le message dans la console
    </li>
  </ul>
  <h2 class="h2">Plugins Vite</h2>
  <p>
    Certains services nécessitent une configuration Vite spécifique. Les plugins Vite doivent être
    placés dans le fichier <span class="badge-code">vite.config.js</span>
    dans la partie plugins. Cela permet d'effectuer une action au moment de la compilation de
    l'application.
  </p>
  <div class="div-code">
    import { localeVite } from '@brugmann/vuemann/src/services/locale/src/locale-vite.js'<br />
    <br />
    export default defineConfig({<br />
    &emsp;plugins: [<br />
    &emsp;&emsp;vue(),<br />
    &emsp;&emsp;localeVite(__dirname)<br />
    &emsp;],<br />
    &emsp;// ...<br />
    })
  </div>
  <p>
    <i class="fa-solid fa-triangle-exclamation color-danger mr-5"></i>
    Dans un fichier plugin Vite, vous vous trouvez dans un contexte Node.js et non dans un contexte
    Vue.js.
    <i class="fa-solid fa-triangle-exclamation color-danger ml-5"></i>
  </p>
  <h2 class="h2">Pour Aller Plus Loin</h2>
  <p>Pour plus d'informations sur l'architecture et l'utilisation des services, consultez :</p>
  <ul class="list ml-25">
    <li>
      <router-link
        :to="{ name: 'services' }"
        class="link-underline"
        >Documentation complète des services</router-link
      >
    </li>
    <li>
      <router-link
        :to="{ name: 'components' }"
        class="link-underline"
        >Composants disponibles</router-link
      >
    </li>
    <li>
      <router-link
        :to="{ name: 'css' }"
        class="link-underline"
        >Système CSS</router-link
      >
    </li>
    <li>
      <router-link
        :to="{ name: 'helpers' }"
        class="link-underline"
        >Helpers</router-link
      >
    </li>
  </ul>
</template>
