<script setup>
import { ref } from 'vue'
import { flash } from '@brugmann/vuemann/src/shortcuts/services-shortcut.js'
import Dialog from '@brugmann/vuemann/src/components/DialogComponent.vue'

const dialog = ref()

const showSuccess = () => {
  flash.success('Opération réussie avec succès')
}

const showError = () => {
  flash.error('Une erreur est survenue')
}

const showWarning = () => {
  flash.warning('Attention : Ceci est un avertissement')
}

const openDialog = () => dialog.value.show()
</script>

<template>
  <h1 class="h1">Service Flash</h1>
  <p>
    Permet de faire apparaître des messages flash sur le côté droit de l'écran. Les messages flash
    sont gérés dans le fichier flashStore.
  </p>

  <h2 class="h2">Prévisualisation</h2>
  <p>Testez les différents types de messages flash :</p>
  <div class="d-flex g-10 mb-20">
    <button
      class="btn btn-success"
      @click="showSuccess"
    >
      <i class="fa-solid fa-check mr-5"></i>Afficher Success
    </button>
    <button
      class="btn btn-danger"
      @click="showError"
    >
      <i class="fa-solid fa-xmark mr-5"></i>Afficher Error
    </button>
    <button
      class="btn btn-warning"
      @click="showWarning"
    >
      <i class="fa-solid fa-triangle-exclamation mr-5"></i>Afficher Warning
    </button>
  </div>

  <h2 class="h2">Installation</h2>
  <p>
    Le service flash est enregistré via <span class="badge-code">flashInit</span> dans la méthode
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
  <p>Ce service utilise les services suivants :</p>
  <ul class="list ml-25">
    <li>
      <strong>log</strong> - Les messages <span class="badge-code">error()</span> et
      <span class="badge-code">warning()</span> sont automatiquement enregistrés dans les logs
    </li>
  </ul>

  <h2 class="h2">Configuration</h2>
  <h3 class="h3">Temporisation automatique</h3>
  <p>
    Les messages flash sont automatiquement supprimés après
    <span class="badge-code">4000ms</span> (4 secondes) par défaut. Cette temporisation peut être
    mise en pause en survolant le message avec la souris.
  </p>
  <ul class="list ml-25">
    <li>
      <strong>autoDelete</strong> - 4000ms (défini dans
      <span class="badge-code">flash-store.js</span>)
    </li>
    <li><strong>Animation de disparition</strong> - 350ms avant suppression du DOM</li>
    <li><strong>Animation d'apparition</strong> - 300ms avec translation depuis la droite</li>
  </ul>

  <h2 class="h2">Structure d'un Flash</h2>
  <p>Chaque message flash est un objet contenant :</p>
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
        <td>id</td>
        <td>String</td>
        <td>Identifiant unique généré automatiquement</td>
      </tr>
      <tr>
        <td>content</td>
        <td>String</td>
        <td>Message à afficher</td>
      </tr>
      <tr>
        <td>type</td>
        <td>String</td>
        <td>Type de flash : 'success', 'error', 'warning', ou 'info'</td>
      </tr>
      <tr>
        <td>autodelete</td>
        <td>Boolean</td>
        <td>Active/désactive la suppression automatique (mis à false au survol)</td>
      </tr>
      <tr>
        <td>hide</td>
        <td>Boolean</td>
        <td>Déclenche l'animation de disparition</td>
      </tr>
    </tbody>
  </table>

  <h2 class="h2">Fonctions accessibles depuis le gestionnaire de service</h2>
  <!-- success -->
  <h3 class="h3"><i class="fa-solid fa-diamond mr-5"></i>success</h3>
  <p>Permet d'afficher un message de succès (couleur vert) sur le côté droit de l'écran.</p>
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
        <td>message à afficher</td>
      </tr>
    </tbody>
  </table>
  <h4 class="h4">utilisation</h4>
  <div class="div-code">
    <span class="color-neutral-500">//appel via le service manager</span><br />
    import { servicesM } from "@brugmann/vuemann/src/services/services-manager.js"<br />
    <br />
    servicesM.service('flash:success', 'message')<br />
    <br />
    <span class="color-neutral-500">//appel avec le raccourci </span><br />
    import { flash } from "@brugmann/vuemann/src/shortcuts/services-shortcut.js"<br />
    <br />
    flash.success('message')<br />
  </div>
  <!-- error -->
  <h3 class="h3"><i class="fa-solid fa-diamond mr-5"></i>error</h3>
  <p>
    Permet d'afficher un message d'erreur (couleur rouge) sur le côté droit de l'écran. Cette
    fonction affiche aussi le message en console avec le service log.
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
        <td>message à afficher</td>
      </tr>
    </tbody>
  </table>
  <h4 class="h4">utilisation</h4>
  <div class="div-code">
    <span class="color-neutral-500">//appel via le service manager</span><br />
    import { servicesM } from "@brugmann/vuemann/src/services/services-manager.js"<br />
    <br />
    servicesM.service('flash:error', 'message')<br />
    <br />
    <span class="color-neutral-500">//appel avec le raccourci </span><br />
    import { flash } from "@brugmann/vuemann/src/shortcuts/services-shortcut.js"<br />
    <br />
    flash.error('message')<br />
  </div>
  <!-- warning -->
  <h3 class="h3"><i class="fa-solid fa-diamond mr-5"></i>warning</h3>
  <p>
    Permet d'afficher un message d'avertissement (couleur jaune / orange) sur le côté droit de
    l'écran.
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
        <td>message à afficher</td>
      </tr>
    </tbody>
  </table>
  <h4 class="h4">utilisation</h4>
  <div class="div-code">
    <span class="color-neutral-500">//appel via le service manager</span><br />
    import { servicesM } from "@brugmann/vuemann/src/services/services-manager.js"<br />
    <br />
    servicesM.service('flash:warning', 'message')<br />
    <br />
    <span class="color-neutral-500">//appel avec le raccourci </span><br />
    import { flash } from "@brugmann/vuemann/src/shortcuts/services-shortcut.js"<br />
    <br />
    flash.warning('message')<br />
  </div>

  <h2 class="h2">Raccourcis avec traduction</h2>
  <p>
    Ces raccourcis combinent la traduction et l'affichage du message flash en une seule fonction.
    Ils utilisent le service <span class="badge-code">locale</span> pour traduire la clé avant
    d'afficher le message.
  </p>

  <!-- successT -->
  <h3 class="h3"><i class="fa-solid fa-diamond mr-5"></i>successT</h3>
  <p>
    Affiche un message de succès traduit. Combine <span class="badge-code">t()</span> et
    <span class="badge-code">flash.success()</span>.
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
        <td>key</td>
        <td>String</td>
        <td>oui</td>
        <td>Clé de traduction</td>
      </tr>
      <tr>
        <td>params</td>
        <td>Object</td>
        <td>non</td>
        <td>Paramètres pour la traduction (interpolation)</td>
      </tr>
    </tbody>
  </table>
  <h4 class="h4">Utilisation</h4>
  <div class="div-code">
    import { flash } from "@brugmann/vuemann/src/shortcuts/services-shortcut.js"<br />
    <br />
    flash.successT('users.created')<br />
    flash.successT('users.updated', { name: 'John' })
  </div>

  <!-- errorT -->
  <h3 class="h3"><i class="fa-solid fa-diamond mr-5"></i>errorT</h3>
  <p>
    Affiche un message d'erreur traduit. Combine <span class="badge-code">t()</span> et
    <span class="badge-code">flash.error()</span>. Le message est également enregistré dans les
    logs.
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
        <td>key</td>
        <td>String</td>
        <td>oui</td>
        <td>Clé de traduction</td>
      </tr>
      <tr>
        <td>params</td>
        <td>Object</td>
        <td>non</td>
        <td>Paramètres pour la traduction (interpolation)</td>
      </tr>
    </tbody>
  </table>
  <h4 class="h4">Utilisation</h4>
  <div class="div-code">
    import { flash } from "@brugmann/vuemann/src/shortcuts/services-shortcut.js"<br />
    <br />
    flash.errorT('users.error.not_found')<br />
    flash.errorT('users.error.invalid', { field: 'email' })
  </div>

  <!-- warningT -->
  <h3 class="h3"><i class="fa-solid fa-diamond mr-5"></i>warningT</h3>
  <p>
    Affiche un message d'avertissement traduit. Combine <span class="badge-code">t()</span> et
    <span class="badge-code">flash.warning()</span>. Le message est également enregistré dans les
    logs.
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
        <td>key</td>
        <td>String</td>
        <td>oui</td>
        <td>Clé de traduction</td>
      </tr>
      <tr>
        <td>params</td>
        <td>Object</td>
        <td>non</td>
        <td>Paramètres pour la traduction (interpolation)</td>
      </tr>
    </tbody>
  </table>
  <h4 class="h4">Utilisation</h4>
  <div class="div-code">
    import { flash } from "@brugmann/vuemann/src/shortcuts/services-shortcut.js"<br />
    <br />
    flash.warningT('users.warning.duplicate')<br />
    flash.warningT('users.warning.limit', { max: 100 })
  </div>

  <h2 class="h2">FlashService (Point d'entrée unique)</h2>
  <p>
    L'objet <span class="badge-code">flashService</span> regroupe toutes les fonctionnalités du
    service flash. C'est le point d'entrée recommandé pour accéder aux flashes et aux méthodes de
    gestion.
  </p>
  <h3 class="h3"><i class="fa-solid fa-diamond mr-5"></i>flashService.flashes</h3>
  <p>
    Getter réactif qui retourne tous les messages flash actifs. Utile pour afficher les flashes dans
    un composant.
  </p>
  <h4 class="h4">Utilisation</h4>
  <div class="div-code">
    import { flashService } from "@brugmann/vuemann/src/services/flash/init/flash-service.js"<br />
    <br />
    const flashes = flashService.flashes
    <span class="color-neutral-500">// Array réactif de tous les flashes</span>
  </div>

  <h3 class="h3"><i class="fa-solid fa-diamond mr-5"></i>flashService.removeFlash</h3>
  <p>
    Supprime manuellement un message flash spécifique par son ID. Déclenche l'animation de
    disparition avant suppression du DOM.
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
        <td>flash_id</td>
        <td>String</td>
        <td>oui</td>
        <td>Identifiant unique du flash à supprimer</td>
      </tr>
    </tbody>
  </table>
  <h4 class="h4">Utilisation</h4>
  <div class="div-code">
    import { flashService } from "@brugmann/vuemann/src/services/flash/init/flash-service.js"<br />
    <br />
    flashService.removeFlash('flash_id_123')
  </div>

  <h2 class="h2">Store Flash (État réactif)</h2>
  <p>Le store flash gère l'état réactif des messages flash avec Vue 3 Composition API.</p>

  <h3 class="h3"><i class="fa-solid fa-diamond mr-5"></i>useFlashStore</h3>
  <p>
    Composable Vue 3 qui retourne les références réactives du store flash. À utiliser dans les
    composants Vue pour accéder aux flashes de manière réactive.
  </p>
  <h4 class="h4">Retour</h4>
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
        <td>flashes</td>
        <td>Ref&lt;Array&gt;</td>
        <td>Référence réactive du tableau de messages flash</td>
      </tr>
    </tbody>
  </table>
  <h4 class="h4">Utilisation</h4>
  <div class="div-code">
    import { useFlashStore } from "@brugmann/vuemann/src/services/flash/src/flash-store.js"<br />
    <br />
    const { flashes } = useFlashStore()
    <span class="color-neutral-500">// Dans un composant Vue</span>
  </div>

  <h3 class="h3">Méthodes du FlashStore</h3>
  <p>
    Le <span class="badge-code">flashStore</span> expose plusieurs méthodes pour gérer les messages
    flash de manière programmatique.
  </p>

  <h4 class="h4"><i class="fa-solid fa-diamond mr-5"></i>flashStore.getFlashes()</h4>
  <p>Retourne tous les messages flash actifs.</p>
  <div class="div-code">
    import { flashStore } from "@brugmann/vuemann/src/services/flash/src/flash-store.js"<br />
    <br />
    const allFlashes = flashStore.getFlashes() <span class="color-neutral-500">// Array</span>
  </div>

  <h4 class="h4"><i class="fa-solid fa-diamond mr-5"></i>flashStore.getFlash(flash_id)</h4>
  <p>
    Retourne un message flash spécifique par son ID. Retourne
    <span class="badge-code">undefined</span> si non trouvé.
  </p>
  <div class="div-code">
    import { flashStore } from "@brugmann/vuemann/src/services/flash/src/flash-store.js"<br />
    <br />
    const flash = flashStore.getFlash('flash_id_123')
  </div>

  <h4 class="h4"><i class="fa-solid fa-diamond mr-5"></i>flashStore.hasFlash(flash_id)</h4>
  <p>Vérifie si un message flash existe avec l'ID spécifié.</p>
  <div class="div-code">
    import { flashStore } from "@brugmann/vuemann/src/services/flash/src/flash-store.js"<br />
    <br />
    if (flashStore.hasFlash('flash_id_123')) {<br />
    &emsp;// Le flash existe<br />
    }
  </div>

  <h4 class="h4"><i class="fa-solid fa-diamond mr-5"></i>flashStore.addFlash(content, type)</h4>
  <p>Ajoute un nouveau message flash avec un ID généré automatiquement.</p>
  <table class="t-default">
    <thead>
      <tr>
        <th>Paramètre</th>
        <th>Type</th>
        <th>Default</th>
        <th>Description</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>content</td>
        <td>String</td>
        <td>-</td>
        <td>Contenu du message</td>
      </tr>
      <tr>
        <td>type</td>
        <td>String</td>
        <td>'error'</td>
        <td>Type de flash : 'success', 'error', 'warning', 'info'</td>
      </tr>
    </tbody>
  </table>
  <div class="div-code">
    import { flashStore } from "@brugmann/vuemann/src/services/flash/src/flash-store.js"<br />
    <br />
    flashStore.addFlash('Message de test', 'success')
  </div>

  <h4 class="h4"><i class="fa-solid fa-diamond mr-5"></i>flashStore.clearFlashes()</h4>
  <p>Supprime tous les messages flash immédiatement sans animation.</p>
  <div class="div-code">
    import { flashStore } from "@brugmann/vuemann/src/services/flash/src/flash-store.js"<br />
    <br />
    flashStore.clearFlashes() <span class="color-neutral-500">// Vide le tableau de flashes</span>
  </div>

  <h2 class="h2">Composant FlashComponent</h2>
  <p>
    Le composant <span class="badge-code">FlashComponent</span> affiche automatiquement tous les
    messages flash actifs. Il doit être inclus une seule fois dans votre application (généralement
    dans <span class="badge-code">App.vue</span>).
  </p>
  <h3 class="h3">Visibilité au-dessus des modales</h3>
  <p>
    Le conteneur utilise l'API native <span class="badge-code">popover="manual"</span> et est promu
    dans le top layer à chaque nouveau flash. Les messages restent ainsi visibles au-dessus de tout
    <span class="badge-code">&lt;dialog&gt;</span> ouvert en modal via
    <span class="badge-code">.showModal()</span> (par exemple
    <span class="badge-code">DialogComponent</span>).
  </p>
  <p>
    Support navigateurs : Chrome 114+, Firefox 125+, Safari 17+. Sur un navigateur non supporté, le
    flash reste fonctionnel hors dialog via un fallback dans le DOM normal (<span class="badge-code"
      >z-index: 100</span
    >).
  </p>

  <h4 class="h4">Test en conditions réelles</h4>
  <p>
    Ouvrez le dialog ci-dessous, puis déclenchez un flash depuis l'intérieur : le message doit
    apparaître au-dessus du dialog.
  </p>
  <button
    class="btn btn-primary btn-primary-400-active mb-20"
    @click="openDialog"
  >
    <i class="fa-solid fa-up-right-from-square mr-5"></i>Ouvrir un dialog modal
  </button>
  <Dialog
    ref="dialog"
    title="Test flash au-dessus d'un dialog"
  >
    <p class="my-10">
      Cliquez sur un bouton pour déclencher un flash. Il doit s'afficher au-dessus de ce dialog sans
      le masquer.
    </p>
    <div class="d-flex g-10">
      <button
        class="btn btn-success"
        @click="showSuccess"
      >
        <i class="fa-solid fa-check mr-5"></i>Flash Success
      </button>
      <button
        class="btn btn-danger"
        @click="showError"
      >
        <i class="fa-solid fa-xmark mr-5"></i>Flash Error
      </button>
      <button
        class="btn btn-warning"
        @click="showWarning"
      >
        <i class="fa-solid fa-triangle-exclamation mr-5"></i>Flash Warning
      </button>
    </div>
  </Dialog>
</template>
