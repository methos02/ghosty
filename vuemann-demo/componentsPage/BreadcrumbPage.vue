<script setup>
import Breadcrumb from '@brugmann/vuemann/src/components/breadcrumb/BreadcrumbComponent.vue'
import CodeHtml from '@brugmann/vuemann/src/components/codeHtml/CodeHtmlComponent.vue'
import { ref } from 'vue'
import { breadcrumbPersist } from '@brugmann/vuemann/src/components/breadcrumb/src/breadcrumb-persist.js'

const breadcrumb = ref()
const addLink = () => {
  const pageCount = breadcrumbPersist.get().length + 1
  breadcrumb.value.add({ label: `Page ${pageCount}`, route: 'components.breadcrumb' })
}

const refreshBreadcrumb = () => {
  breadcrumb.value.refresh()
}
</script>

<template>
  <h1 class="h1">File d'ariane</h1>
  <p class="my-10">
    Ce component permet d'afficher facilement un file d'ariane. Vous avez deux possibilités pour
    l'utiliser. Soit via le fichier
    <router-link
      :to="{ name: 'config' }"
      class="underline link-underline"
      >fichiers de configuration</router-link
    >
    soit de mannière dynamique.
  </p>

  <h2 class="h2">Propriétés</h2>
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
        <td>type</td>
        <td>String</td>
        <td>-</td>
        <td>'config'</td>
        <td>
          Type de breadcrumb : 'config' (utilise les métas de routes) ou 'session' (manipulation
          dynamique via sessionStorage)
        </td>
      </tr>
    </tbody>
  </table>

  <h2 class="h2">Dépendances</h2>
  <p>Ce composant utilise :</p>
  <ul>
    <li>
      <span class="badge-code">breadcrumb functions</span> - Logique de construction du breadcrumb
      depuis les routes (breadcrumb.init)
    </li>
    <li>
      <span class="badge-code">servicesM.service('router:currentRoute')</span> - Accès à la route
      active pour mise à jour automatique
    </li>
    <li>
      <span class="badge-code">flash</span> - Service de messages d'erreur (affiche erreur si
      méthodes session appelées en mode config)
    </li>
    <li>
      <span class="badge-code">breadcrumbPersist</span> - Gestion de la persistance dans
      sessionStorage (get, save, clean, isCurrentRoute)
    </li>
  </ul>

  <h2 class="h2">Événements</h2>
  <table class="t-default mb-15 w-100">
    <thead>
      <tr>
        <th>Nom</th>
        <th>Paramètres</th>
        <th>Description</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>breadcrumb-click</td>
        <td>Boolean (true)</td>
        <td>
          Émis lors du click sur un lien du breadcrumb en mode session. Permet de rafraîchir le
          composant après navigation
        </td>
      </tr>
    </tbody>
  </table>

  <h2 class="h2">Type config</h2>
  <p>
    En ajoutant la clé <span class="badge-code">breadcrumb</span> dans les métas d'une route, vous
    pouvez facilement configurer votre file d'ariane. Vuemann remontrat l'arborescence de la route.
    La clé <span class="badge-code">breadcrumb</span> des pages parentes doivent contenir deux
    informations, <span class="badge-code">name</span> (le nom à afficher dans le file) et
    <span class="badge-code">route</span> (la route à utiliser pour le lien). Si il sagit d'une page
    sans enfant, juste l'attribut <span class="badge-code">name</span> est utilisé.
  </p>
  <h3 class="h3">configuration par arborescence</h3>
  <div class="div-code">
    {<br />
    &emsp;path: "/components",<br />
    &emsp;meta: {<br />
    &emsp;&emsp;breadcrumb : { name : 'Components', route : 'components' }<br />
    &emsp;},<br />
    &emsp;children: [<br />
    &emsp;&emsp;{<br />
    &emsp;&emsp;&emsp;path: "",<br />
    &emsp;&emsp;&emsp;name: "components",<br />
    &emsp;&emsp;&emsp;component : ComponentsPageComponent,<br />
    &emsp;&emsp;},<br />
    &emsp;&emsp;{<br />
    &emsp;&emsp;&emsp;path: "breadcrumb",<br />
    &emsp;&emsp;&emsp;name: "components.breadcrumb",<br />
    &emsp;&emsp;&emsp;component: BreadcrumbPageComponent,<br />
    &emsp;&emsp;&emsp;meta: {<br />
    &emsp;&emsp;&emsp;&emsp;breadcrumb : { name : "File d'ariane" }<br />
    &emsp;&emsp;&emsp;},<br />
    &emsp;&emsp;},<br />
    &emsp;&emsp;{<br />
    &emsp;&emsp;&emsp;path: "code-html",<br />
    &emsp;&emsp;&emsp;name: "components.code",<br />
    &emsp;&emsp;&emsp;component: CodeHtmlPageComponent,<br />
    &emsp;&emsp;&emsp;meta: {<br />
    &emsp;&emsp;&emsp;&emsp;breadcrumb : { name : 'Code Html' }<br />
    &emsp;&emsp;&emsp;},<br />
    &emsp;&emsp;},<br />
    &emsp;]<br />
    }
  </div>
  <p>
    Dans l'exemple ci-dessus, vous pouvez voir que l'option breadcrumb pour les routes
    <span class="badge-code">components.breadcrumb</span> et
    <span class="badge-code">components.code</span> ne comporte que l'attribut nom.
  </p>
  <p>
    <i class="fa-solid fa-triangle-exclamation color-danger mr-5"></i>
    la configuration pour la route avec le path <span class="badge-code">"/components"</span> au
    même niveau et non dans la route enfant avec le path <span class="badge-code">""</span>
    <i class="fa-solid fa-triangle-exclamation color-danger ml-5"></i>
  </p>
  <h3 class="h3">configuration parents</h3>
  <p>
    Vous pouvez si le file d'ariane ne doit pas suivre l'orborescance du fichier
    <span class="badge-code">route-config</span>, vous pouvez spécifier les routes à utiliser.
  </p>
  <div class="div-code">
    {<br />
    &emsp;path: "/components",<br />
    &emsp;name: "components",<br />
    &emsp;component : ComponentsPageComponent,<br />
    &emsp;meta: {<br />
    &emsp;&emsp;breadcrumb : { <br />
    &emsp;&emsp;&emsp;label : 'Components' <br />
    &emsp;&emsp;&emsp;parents : [<br />
    &emsp;&emsp;&emsp;&emsp;{ label: 'parent_1', route : 'parent1' }<br />
    &emsp;&emsp;&emsp;&emsp;{ label: 'parent_1', route : 'parent2' }<br />
    &emsp;&emsp;&emsp;] <br />
    &emsp;&emsp;}<br />
    &emsp;},<br />
    }
  </div>
  <h3 class="h3">Code</h3>
  <CodeHtml class="my-15">
    <scriptBalise v-pre>
      import CodeHtml from "@brugmann/vuemann/src/components/breadcrumb/BreadcrumbComponent.vue"
    </scriptBalise>
    <template v-pre>
      <Breadcrumb />
    </template>
  </CodeHtml>
  <h2 class="h2">Type Session</h2>
  <p class="mb-10">
    Dans certain cas, le fichier de configuration ne sera pas suffisant pour afficher les pages
    souhaitées, notamment pour les pages récursives. En passant le paramètre
    <span class="badge-code">type="session"</span> vous aurez accès à des méthodes pour manipuler
    dynamiquement votre file d'ariane.
  </p>
  <h3 class="h3">Méthodes exposées</h3>

  <p>
    <strong>Note :</strong> Ces méthodes ne fonctionnent qu'en mode
    <span class="badge-code">type="session"</span>. En mode config, elles affichent un message
    d'erreur flash.
  </p>

  <!-- init -->
  <h4 class="h4"><i class="fa-solid fa-diamond mr-5"></i>init</h4>
  <p>
    Permet de réinitialiser complètement le breadcrumb et optionnellement d'ajouter un premier lien.
  </p>
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
        <td>link</td>
        <td>Object</td>
        <td>-</td>
        <td>
          Premier lien à ajouter après le nettoyage (optionnel). Si undefined, le breadcrumb sera
          vide
        </td>
      </tr>
    </tbody>
  </table>
  <h5 class="h5">Utilisation</h5>
  <div class="div-code">
    // Réinitialiser complètement<br />
    breadcrumb.value.init()<br />
    <br />
    // Réinitialiser et ajouter un lien<br />
    breadcrumb.value.init({label: 'Accueil', route: 'home'})
  </div>

  <!-- add -->
  <h4 class="h4"><i class="fa-solid fa-diamond mr-5"></i>add</h4>
  <p>Permet d'ajouter un lien au file d'ariane.</p>
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
        <td>link</td>
        <td>Object</td>
        <th>Required</th>
        <td>
          objet route
          <span class="badge-code">
            {name: label dans le file , route: nom de la route, params: paramètre de la route si
            présent}</span
          >
        </td>
      </tr>
      <tr>
        <td>routeName</td>
        <td>String</td>
        <td>-</td>
        <td>Si présent, mettra à jour le sessionStorage</td>
      </tr>
    </tbody>
  </table>
  <!-- refresh -->
  <h4 class="h4"><i class="fa-solid fa-diamond mr-5"></i>refresh</h4>
  <p>Permet de recharger le breadcrumb depuis le sessionStorage pour rafraîchir le rendu HTML.</p>
  <h5 class="h5">Utilisation</h5>
  <div class="div-code">breadcrumb.value.refresh()</div>

  <h2 class="h2">Fonctionnalités</h2>

  <h3 class="h3"><i class="fa-solid fa-diamond mr-5"></i>Mode Config (Automatique)</h3>
  <p>
    En mode <span class="badge-code">type="config"</span> (par défaut), le breadcrumb est construit
    automatiquement :
  </p>
  <ul>
    <li>
      <strong>Construction automatique</strong> : Analyse la route active et remonte l'arborescence
      des routes parentes
    </li>
    <li>
      <strong>Mise à jour réactive</strong> : Watch sur
      <span class="badge-code">route.value.path</span> pour reconstruire le breadcrumb à chaque
      navigation
    </li>
    <li>
      <strong>Méta breadcrumb</strong> : Utilise
      <span class="badge-code">meta.breadcrumb</span> dans la configuration des routes
    </li>
    <li>
      <strong>Hiérarchie flexible</strong> : Supporte arborescence naturelle ou parents
      personnalisés via <span class="badge-code">meta.breadcrumb.parents</span>
    </li>
  </ul>

  <h3 class="h3"><i class="fa-solid fa-diamond mr-5"></i>Mode Session (Dynamique)</h3>
  <p>
    En mode <span class="badge-code">type="session"</span>, le breadcrumb est géré manuellement :
  </p>
  <ul>
    <li>
      <strong>Persistance</strong> : Les liens sont sauvegardés dans sessionStorage via
      <span class="badge-code">breadcrumbPersist</span>
    </li>
    <li>
      <strong>Clé de stockage</strong> : Associé au nom de la route active pour isolation entre
      pages
    </li>
    <li>
      <strong>Nettoyage automatique</strong> : Le sessionStorage est vidé si la route change (via
      <span class="badge-code">isCurrentRoute</span>)
    </li>
    <li>
      <strong>Manipulation</strong> : Méthodes exposées (init, add, refresh) pour contrôle total
    </li>
    <li>
      <strong>Click handler</strong> : Émet <span class="badge-code">breadcrumb-click</span> et
      sauvegarde les liens tronqués lors du click
    </li>
  </ul>

  <h3 class="h3"><i class="fa-solid fa-diamond mr-5"></i>Affichage conditionnel</h3>
  <p>Le breadcrumb contrôle automatiquement son affichage :</p>
  <ul>
    <li>
      <strong>Mode config</strong> : Affiché seulement si
      <span class="badge-code">links.length > 1</span> (au moins 2 liens)
    </li>
    <li>
      <strong>Mode session</strong> : Toujours affiché (même avec 0 lien) pour permettre l'ajout
      dynamique
    </li>
    <li>
      <strong>Dernier lien</strong> : N'est pas cliquable et affiché en texte simple (span au lieu
      de RouterLink)
    </li>
    <li>
      <strong>Séparateur</strong> : Icône chevron (font-awesome) ajouté automatiquement entre les
      liens
    </li>
  </ul>

  <h3 class="h3"><i class="fa-solid fa-diamond mr-5"></i>Structure d'un lien</h3>
  <p>Chaque lien du breadcrumb est un objet avec les propriétés suivantes :</p>
  <table class="t-default mb-15 w-100">
    <thead>
      <tr>
        <th>Propriété</th>
        <th>Type</th>
        <th>Required</th>
        <th>Description</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>label</td>
        <td>String</td>
        <td>oui</td>
        <td>Texte affiché pour le lien</td>
      </tr>
      <tr>
        <td>route</td>
        <td>String | Object</td>
        <td>-</td>
        <td>
          Nom de la route ou objet de route Vue Router. Si undefined, le lien ne sera pas cliquable
        </td>
      </tr>
      <tr>
        <td>params</td>
        <td>Object</td>
        <td>-</td>
        <td>Paramètres de la route (optionnel)</td>
      </tr>
    </tbody>
  </table>

  <h3 class="h3">Exemple</h3>
  <div class="breadcrumb-exemple">
    <Breadcrumb
      @breadcrumb-click="refreshBreadcrumb"
      type="session"
      ref="breadcrumb"
    />
  </div>
  <div class="d-flex a-center g-15">
    <button
      class="btn btn-primary btn-primary-400-active"
      @click="addLink"
    >
      Ajouter un lien
    </button>
    <p>Cliquez sur un lien du file d'ariane pour simuler une navigation.</p>
  </div>
  <h3 class="h3">Code</h3>
  <CodeHtml class="my-15">
    <scriptBalise v-pre>
      import CodeHtml from "@brugmann/vuemann/src/components/breadcrumb/BreadcrumbComponent.vue" \n
      const breadcrumb = ref() \n \n //utilisation des méthodes \n breadcrumb.value.add({name:'Page
      Breadcrumb', route: 'components.breadcrumb'}) \n breadcrumb.value.refresh()
    </scriptBalise>
    <template v-pre>
      <Breadcrumb ref="breadcrumb" />
    </template>
  </CodeHtml>
</template>
<style lang="scss">
.breadcrumb {
  &-exemple {
    height: 25px;
  }
}
</style>
