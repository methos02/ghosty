<script setup>
import { onMounted, onUnmounted } from 'vue'

const handleDemoAlert = () => {
  globalThis.alert(
    "Action sidebar déclenchée ! Cette alerte démontre le fonctionnement des items d'action.",
  )
}

onMounted(() => {
  globalThis.addEventListener('sidebar:demo-alert', handleDemoAlert)
})

onUnmounted(() => {
  globalThis.removeEventListener('sidebar:demo-alert', handleDemoAlert)
})
</script>

<template>
  <h1 class="h1">Header des applications</h1>
  <p>
    Le header est un composant qui affiche le titre de l'application, le dropdown de langue, le
    bouton de logout, le bouton de documentation et un menu de navigation à droite.
  </p>

  <h2 class="h2">Dépendances</h2>
  <p>Ce composant utilise :</p>
  <ul>
    <li>
      <span class="badge-code">LocaleComponent</span> - Dropdown pour changer la langue de
      l'application
    </li>
    <li><span class="badge-code">t()</span> - Service de traduction pour les labels et titres</li>
    <li>
      <span class="badge-code">auth</span> - Service d'authentification pour vérifier les rôles et
      gérer le logout
    </li>
    <li>
      <span class="badge-code">ref, computed, watch</span> - Gestion de l'état réactif (sidebar,
      hamburger, scroll)
    </li>
    <li>
      <span class="badge-code">onMounted, onUnmounted</span> - Lifecycle hooks pour les event
      listeners de scroll
    </li>
    <li>
      <span class="badge-code">ConfigLoader</span> - Chargement de la configuration (logo, homepage
      URL)
    </li>
    <li>
      <span class="badge-code">servicesM</span> - Gestionnaire de services pour appeler auth:logout
    </li>
    <li>
      <span class="badge-code">authStore</span> - Store d'authentification pour accéder au
      currentUser
    </li>
    <li>
      <span class="badge-code">route, router</span> - Services du routeur pour la route courante et
      la liste des routes
    </li>
  </ul>

  <h2 class="h2">Paramètres</h2>
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
        <td>logo</td>
        <td>Object</td>
        <td>non</td>
        <td>
          <span class="badge-code"
            >{ large: '/images/vuemann/brugmann-logo_white.svg', xs:
            '/images/vuemann/brugmann-logo_white-xs.png' }</span
          >
        </td>
        <td>
          Logo de l'application. <span class="badge-code">large</span> est le SVG affiché au-dessus
          de 850px, <span class="badge-code">xs</span> le PNG en dessous. Le texte alternatif est
          toujours <span class="badge-code">t('app.logo')</span> — surchargez la clé de traduction
          <span class="badge-code">app.logo</span>
          dans les locales de l'app pour le modifier.
        </td>
      </tr>
      <tr>
        <td>favicon</td>
        <td>String</td>
        <td>non</td>
        <td>'/favicon.png'</td>
        <td>
          Chemin appliqué à <span class="badge-code">&lt;link rel="icon"&gt;</span> au montage et à
          chaque changement de prop. Crée la balise <span class="badge-code">link</span> si elle
          n'existe pas dans <span class="badge-code">document.head</span>.
        </td>
      </tr>
    </tbody>
  </table>
  <p>
    Le titre de l'application est lu depuis
    <span class="badge-code">ConfigLoader.get('app.title')</span>.
  </p>
  <h3 class="h3">Surcharge dynamique du logo / favicon</h3>
  <p>
    Pour swapper le logo ou le favicon par rôle (ex: HUDERF vs Brugmann), passez des props réactives
    :
  </p>
  <div class="div-code">
    <pre>
&lt;script setup&gt;
import { computed } from 'vue'
import { auth } from '@brugmann/vuemann/src/shortcuts/services-shortcut.js'

const appLogo = computed(() => auth.hasRole('huderf')
  ? { large: '/images/huderf-logo.svg', xs: '/images/huderf-logo-xs.png' }
  : undefined)
const appFavicon = computed(() => auth.hasRole('huderf') ? '/huderf-favicon.png' : undefined)
&lt;/script&gt;
&lt;template&gt;
  &lt;HeaderComponent :logo="appLogo" :favicon="appFavicon" /&gt;
&lt;/template&gt;</pre>
  </div>
  <p>Une valeur <span class="badge-code">undefined</span> retombe sur le défaut Brugmann.</p>
  <h2 class="h2">Lien dans le menu de navigation</h2>
  <p>
    Pour ajouter un lien dans le menu de navigation, vous devez ajouter l'attribut
    <code>sidebar</code> à la meta de la route.
  </p>
  <div class="div-code">
    <pre>
      {
        path: '/',
        meta: {
          sidebar: {
            label: 'Accueil',
            icon: 'fa-solid fa-house',
            order: 1
          }
        }
      }
    </pre>
  </div>
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
        <td>label</td>
        <td>String</td>
        <td>oui</td>
        <td>Label du lien.</td>
      </tr>
      <tr>
        <td>icon</td>
        <td>String</td>
        <td>oui</td>
        <td>Icon du lien.</td>
      </tr>
      <tr>
        <td>order</td>
        <td>Number</td>
        <td>oui</td>
        <td>Optionnel - Ordre du lien. Par défaut, le lien sera ajouté à la fin de la liste.</td>
      </tr>
    </tbody>
  </table>
  <h2 class="h2">Filtrage par rôle</h2>
  <p>
    Le HeaderComponent supporte le filtrage automatique des items du menu en fonction des rôles de
    l'utilisateur. Pour restreindre l'accès à un lien du menu, ajoutez la propriété
    <span class="badge-code">roles</span> directement dans la
    <span class="badge-code">meta</span> de la route (et non dans l'objet
    <span class="badge-code">sidebar</span>).
  </p>
  <div class="div-code">
    <pre>
      {
        path: '/admin',
        name: 'admin',
        component: AdminPage,
        meta: {
          roles: ['admin', 'super_admin'],  // Contrôle accès route ET visibilité menu
          sidebar: {
            label: 'Administration',
            icon: 'fa-solid fa-shield',
            order: 10
          }
        }
      }
    </pre>
  </div>
  <p>
    <strong>Comportement :</strong>
  </p>
  <ul class="list ml-25">
    <li>
      <strong>Double protection</strong> : <span class="badge-code">meta.roles</span> contrôle à la
      fois l'accès à la route ET la visibilité dans le menu
    </li>
    <li>
      <strong>Rétrocompatible</strong> : Si la clé <span class="badge-code">roles</span> n'est pas
      présente, la route et le lien sont accessibles à tous
    </li>
    <li>
      <strong>Logique OR</strong> : Si plusieurs rôles sont spécifiés, l'utilisateur doit avoir au
      moins un des rôles listés
    </li>
    <li>
      <strong>Réactif</strong> : Le menu se met à jour automatiquement lors de la
      connexion/déconnexion de l'utilisateur
    </li>
    <li>
      <strong>Redirection automatique</strong> : Si un utilisateur tente d'accéder directement à une
      route protégée sans le rôle requis, il sera redirigé vers "/" avec un message d'avertissement
    </li>
  </ul>
  <p>
    <strong>Exemple avec plusieurs rôles :</strong>
  </p>
  <div class="div-code">
    <pre>
      // L'utilisateur doit avoir le rôle 'admin' OU 'manager' OU 'editor'
      meta: {
        roles: ['admin', 'manager', 'editor'],
        sidebar: {
          label: 'Gestion',
          icon: 'fa-solid fa-users',
          order: 5
        }
      }
    </pre>
  </div>
  <p>
    Pour plus d'informations sur la configuration des rôles et la protection des routes, consultez
    la
    <router-link
      :to="{ name: 'services.auth' }"
      class="underline link-underline"
      >documentation du service Auth</router-link
    >.
  </p>

  <h2 class="h2">Condition d'affichage</h2>
  <p>
    Vous pouvez contrôler dynamiquement l'affichage d'un lien du menu en fonction de la route
    courante grâce à la propriété <span class="badge-code">condition</span>. Cette fonction reçoit
    la route courante et retourne un booléen indiquant si le lien doit être affiché.
  </p>
  <div class="div-code">
    <pre>
      {
        path: '/admin/boxes',
        name: 'admin.boxes',
        meta: {
          sidebar: {
            label: 'Boxes',
            icon: 'fa-solid fa-box',
            order: 1,
            condition: (route) => route.name.startsWith('admin')
          }
        }
      }
    </pre>
  </div>
  <p>
    <strong>Comportement :</strong>
  </p>
  <ul class="list ml-25">
    <li>
      <strong>Rétrocompatible</strong> : Si <span class="badge-code">condition</span> n'est pas
      définie, le lien est toujours visible
    </li>
    <li>
      <strong>Fonction</strong> : <span class="badge-code">(route) => boolean</span> - reçoit la
      route courante, retourne true pour afficher
    </li>
    <li>
      <strong>Réactif</strong> : Le menu se met à jour automatiquement lors des changements de route
    </li>
  </ul>
  <p>
    <strong>Exemple : menu contextuel admin</strong>
  </p>
  <div class="div-code">
    <pre>
      // Lien visible uniquement hors de la section admin
      meta: {
        sidebar: {
          label: 'Admin',
          icon: 'fa-solid fa-shield',
          order: 10,
          condition: (route) => !route.name.startsWith('admin')
        }
      }

      // Lien visible uniquement dans la section admin
      meta: {
        sidebar: {
          label: 'Users',
          icon: 'fa-solid fa-users',
          order: 1,
          condition: (route) => route.name.startsWith('admin')
        }
      }
    </pre>
  </div>

  <h2 class="h2">Événement sidebar:navigate</h2>
  <p>
    Lorsqu'un utilisateur clique sur un lien du menu de navigation, un événement
    <span class="badge-code">sidebar:navigate</span> est émis sur l'objet
    <span class="badge-code">window</span>. Cet événement permet aux pages d'être notifiées lorsque
    l'utilisateur clique sur leur lien dans le menu, même s'il est déjà sur cette page.
  </p>
  <p>
    <strong>Cas d'usage :</strong> Réinitialiser l'état d'une page lorsque l'utilisateur clique sur
    le lien du menu alors qu'il est déjà sur cette page. Par exemple, une page de création de
    demande peut réinitialiser son formulaire pour démarrer une nouvelle création.
  </p>
  <table class="t-default">
    <thead>
      <tr>
        <th>Propriété</th>
        <th>Type</th>
        <th>Description</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>event.detail</td>
        <td>String</td>
        <td>Le nom de la route cliquée (ex: <span class="badge-code">'request-manage'</span>)</td>
      </tr>
    </tbody>
  </table>
  <p>
    <strong>Exemple d'écoute de l'événement :</strong>
  </p>
  <div class="div-code">
    <pre>
import { onMounted, onUnmounted } from 'vue'

onMounted(() => {
  window.addEventListener('sidebar:navigate', handleSidebarNavigate)
})

onUnmounted(() => {
  window.removeEventListener('sidebar:navigate', handleSidebarNavigate)
})

const handleSidebarNavigate = (event) => {
  // Vérifier si c'est notre route
  if (event.detail !== 'ma-route') { return }

  // Réinitialiser l'état de la page
  resetForm()
  clearSelection()
}</pre>
  </div>

  <h2 class="h2">Items d'action (sidebar.action)</h2>
  <p class="badge badge-info mb-15">
    <i class="fa-solid fa-bell mr-10"></i>
    <strong>Démo :</strong> Ouvrez le menu sidebar pour voir le bouton "Demo Action" qui déclenche
    une alerte.
  </p>
  <p>
    Par défaut, les items du menu naviguent vers une route. Avec la propriété
    <span class="badge-code">action</span>, vous pouvez créer des items qui déclenchent une action
    (callback) au lieu de naviguer.
  </p>
  <p>
    <strong>Cas d'usage :</strong> Ouvrir une boîte de dialogue de recherche, afficher un panneau
    contextuel, déclencher une action globale depuis le menu.
  </p>
  <div class="div-code">
    <pre>
{
  path: '/search-patient-shortcut',  // Chemin fictif (jamais visité)
  name: 'search-patient-shortcut',
  component: null,  // Pas de composant nécessaire
  meta: {
    sidebar: {
      icon: 'fa-solid fa-magnifying-glass',
      label: 'sidebar.search',
      order: 10,
      action: 'open-search'  // Nom de l'action
    }
  }
}</pre>
  </div>
  <table class="t-default">
    <thead>
      <tr>
        <th>Propriété</th>
        <th>Type</th>
        <th>Description</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>action</td>
        <td>String</td>
        <td>
          Nom de l'action. L'événement émis sera <span class="badge-code">sidebar:{action}</span>
        </td>
      </tr>
    </tbody>
  </table>
  <p>
    <strong>Comportement :</strong>
  </p>
  <ul class="list ml-25">
    <li>
      <strong>Pas de navigation</strong> : L'item est rendu comme un
      <span class="badge-code">&lt;button&gt;</span> au lieu d'un
      <span class="badge-code">&lt;Link&gt;</span>
    </li>
    <li>
      <strong>Événement personnalisé</strong> : Émet
      <span class="badge-code">sidebar:{action}</span> sur
      <span class="badge-code">globalThis</span>
    </li>
    <li>
      <strong>ID préfixé</strong> : L'élément a un ID
      <span class="badge-code">action-{route.name}</span>
    </li>
  </ul>
  <p>
    <strong>Exemple d'écoute de l'événement :</strong>
  </p>
  <div class="div-code">
    <pre>
import { onMounted, onUnmounted } from 'vue'

onMounted(() => {
  globalThis.addEventListener('sidebar:open-search', handleOpenSearch)
})

onUnmounted(() => {
  globalThis.removeEventListener('sidebar:open-search', handleOpenSearch)
})

const handleOpenSearch = () => {
  // Ouvrir la boîte de dialogue de recherche
  searchDialogOpen.value = true
}</pre>
  </div>

  <h2 class="h2">Syntaxe tableau (sidebar en array)</h2>
  <p>
    La propriété <span class="badge-code">sidebar</span> peut aussi être un tableau d'items. Cela
    permet de définir plusieurs entrées dans le menu à partir d'une seule route, par exemple un lien
    de navigation et un bouton d'action.
  </p>
  <div class="div-code">
    <pre>
{
  path: '/patient',
  name: 'patient',
  component: PatientPage,
  meta: {
    sidebar: [
      { icon: 'fa-solid fa-user', label: 'sidebar.patient', order: 1 },
      { icon: 'fa-solid fa-magnifying-glass', label: 'sidebar.search', order: 10, action: 'open-search' }
    ]
  }
}</pre>
  </div>
  <p>
    <strong>Comportement :</strong>
  </p>
  <ul class="list ml-25">
    <li><strong>Rétrocompatible</strong> : Un objet simple continue de fonctionner comme avant</li>
    <li>
      <strong>Conditions par item</strong> : Chaque item du tableau peut avoir sa propre
      <span class="badge-code">condition</span>
    </li>
    <li>
      <strong>Rôles au niveau route</strong> : <span class="badge-code">meta.roles</span> s'applique
      à tous les items du tableau
    </li>
    <li>
      <strong>Plus de routes fictives</strong> : Les items d'action n'ont plus besoin d'une route
      dédiée
    </li>
  </ul>
  <p>
    <strong>Exemple complet avec conditions par item :</strong>
  </p>
  <div class="div-code">
    <pre>
{
  path: '/patient',
  name: 'patient',
  component: PatientPage,
  meta: {
    sidebar: [
      { icon: 'fa-solid fa-user', label: 'sidebar.patient', order: 1 },
      {
        icon: 'fa-solid fa-magnifying-glass',
        label: 'sidebar.search',
        order: 10,
        action: 'open-search',
        condition: (route) => route.name.startsWith('patient')
      }
    ]
  }
}</pre>
  </div>

  <h2 class="h2">Documentation par routes</h2>
  <p>
    Le HeaderComponent détecte automatiquement les routes commençant par
    <span class="badge-code">/documentation</span> et gère un sidebar contextuel :
  </p>
  <ul class="list ml-25">
    <li>
      <strong>Bouton header</strong> : Un bouton livre (<span class="badge-code"
        >&lt;Link to="/documentation"&gt;</span
      >) apparaît dans le header quand au moins une route
      <span class="badge-code">/documentation/*</span> existe
    </li>
    <li>
      <strong>Sidebar contextuel</strong> : Sur une URL
      <span class="badge-code">/documentation/*</span>, le sidebar affiche uniquement les routes de
      documentation. Sur toute autre URL, les routes de documentation sont exclues du sidebar
    </li>
    <li>
      <strong>Convention</strong> : Le préfixe est toujours
      <span class="badge-code">/documentation</span> (pas configurable)
    </li>
  </ul>
  <p>
    <strong>Ajouter de la documentation dans une app :</strong>
  </p>
  <div class="div-code">
    <pre>
// Dans routes-config.js
{ path: "/documentation", name: "documentation", redirect: { name: 'documentation.home' } },
{
  path: "/documentation/home",
  name: "documentation.home",
  component: HomeDocPage,
  meta: {
    sidebar: { icon: 'fa-solid fa-house', label: 'doc_home', order: 1 }
  }
},
{
  path: "/documentation/components",
  name: "documentation.components",
  component: ComponentsDocPage,
  meta: {
    sidebar: { icon: 'fa-solid fa-puzzle-piece', label: 'doc_components', order: 2 }
  }
}</pre>
  </div>
  <p>
    <strong>Breaking change :</strong> La prop
    <span class="badge-code">documentation</span> (String, lien PDF externe) a été supprimée.
    Utilisez des routes <span class="badge-code">/documentation/*</span> à la place.
  </p>

  <h2 class="h2">Utilisation</h2>
  <p>
    Pour utiliser le header, vous devez ajouter le composant <code>HeaderComponent</code> dans le
    fichier <span class="badge-code">App.vue</span>. Cela est automatiquement fait si vous utilisez
    le template <span class="badge-code">chu-brugmann-vue-template</span>.
  </p>
  <CodeHtmlComponent>
    <scriptBalise v-pre>
      import HeaderComponent from '@brugmann/vuemann/src/components/HeaderComponent.vue';
    </scriptBalise>
    <template v-pre>
      <div class="container-body | f-column">
        <Header title="mon application" />
        <router-view />
      </div>
    </template>
  </CodeHtmlComponent>
</template>
