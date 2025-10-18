<template>
  <h1 class="h1">Bienvenue sur Vuemann</h1>
  <p>
    Vuemann est un framework VueJS conçu pour faciliter le développement d'applications hospitalières. Il intègre un ensemble de services, d'helpers, de 
    composants et de règles CSS, permettant une cohérence et une harmonie entre les différentes applications.
  </p>
  <h2 class="h2">Installation</h2>
  <p>
    L'installation d'un service a été prévue pour être la plus simple possible. Jusqu'a trois fichiers doivent être enregistrés pour qu'un service fonctionne :
  </p>
  <h3 class="h3">Objet Service</h3>
  <p>
    L'objet <span class="badge-code">{service}Service</span> présent dans le fichier portant le même nom et reprend l'ensemble des méthodes disponibles aux autres services. Cet objet doit être renseigné dans la fonction <span class="badge-code">setServices</span>, présente dans le fichier <span class="badge-code">main.js</span>.
  </p>
  <div class="div-code">
    import { authService } from '@brugmann/vuemann/src/services/auth/authService.hs'<br />    ...<br />    setServices({ authService, routerService, ajaxService, flashService, localeService })
  </div>
  <h3 class="h3">Objet Plugin</h3>
  <p>
    L'objet <span class="badge-code">{service}Plugin</span> présent dans le fichier portant le même nom doit être ajouté dans le fichier <span class="badge-code">main.js</span>. Il existe deux types de plugins : synchrones et asynchrones.
  </p>
  <h4 class="h4">Plugins Synchrones</h4>
  <p>
    Les plugins synchrones doivent être ajoutés via la fonction <span class="badge-code">app.use()</span>.
  </p>
  <div class="div-code">
    // exemple <br />    import { flashPlugin } from '@brugmann/vuemann/src/services/flash/flash-plugin.js'<br />    app.use(flashPlugin)
  </div>
  <h4 class="h4">Plugins Asynchrones</h4>
  <p>
    Les plugins asynchrones doivent être ajoutés dans l'array du <span class="badge-code">Promise.all</span>.
  </p>
  <div class="div-code">
    // exemple <br />    import { localePlugin } from '@brugmann/vuemann/src/services/locale/locale-plugin.js'<br />    Promise.all([localePlugin]).then(plugins => { <br />    &emsp;plugins.forEach(plugin => app.use(plugin)) <br />    &emsp;app.mount('#app') <br />    })
  </div>
  <p>
    Dans l'exemple ci-dessus, le plugin <span class="badge-code">localePlugin</span> est asynchrone car il doit charger les traductions de la locale courante.
  </p>
  <h2 class="h2">Plugins Vite</h2>
  <p>
    Les plugins Vite doivent être placés dans le fichier <span class="badge-code">vite.config.js</span> dans la partie plugin. Cela permet d'effectuer une action au moment de la compilation de l'application.
  </p>
  <div class="div-code">
    // exemple <br />    import { localeVite } from '@brugmann/vuemann/src/services/locale/locale-vite.js'<br />    plugins: [ <br />    &emsp;vue(), <br />    &emsp;localeVite(__dirname) <br />    ]
  </div>
</template>
