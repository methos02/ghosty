<script setup>
import { ref } from 'vue'
import CodeHtml from '@brugmann/vuemann/src/components/codeHtml/CodeHtmlComponent.vue'
import Dialog from '@brugmann/vuemann/src/components/DialogComponent.vue'

const dialog = ref()
const dialogPrint = ref()
const openDialog = () => dialog.value.show()
const openAndPrint = () => {
  dialogPrint.value.show()
  const TIMEOUT = 300
  setTimeout(() => globalThis.print(), TIMEOUT)
}
</script>

<template>
  <h1 class="h1">Component Dialog</h1>
  <p class="my-10">Ce component permet de pouvoir utiliser l'élément html natif Dialog.</p>

  <h2 class="h2">Dépendances</h2>
  <p>Ce composant utilise :</p>
  <ul>
    <li>
      <span class="badge-code">t()</span> - Service de traduction pour le title du bouton de
      fermeture
    </li>
    <li><span class="badge-code">ref</span> - Référence à l'élément dialog natif</li>
    <li>
      <span class="badge-code">defineExpose</span> - Expose les méthodes show, close, closeSilent,
      toggle et l'état réactif isOpen
    </li>
    <li>
      <span class="badge-code">defineEmits</span> - Définit les événements dialog-show et
      dialog-close
    </li>
  </ul>

  <h2 class="h2">Slots</h2>
  <table class="t-default mb-15 w-100">
    <thead>
      <tr>
        <th>Nom</th>
        <th>Description</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>default</td>
        <td>Contenu du dialog. Affiché après le titre (si présent).</td>
      </tr>
    </tbody>
  </table>

  <h2 class="h2">Propriétés</h2>
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
        <td>title</td>
        <td>String</td>
        <td>-</td>
        <td>''</td>
        <td>Permet d'ajouter un titre dans le header du dialog.</td>
      </tr>
      <tr>
        <td>closeCross</td>
        <td>Boolean</td>
        <td>-</td>
        <td>true</td>
        <td>Si à true, affichera un icône pour fermer le dialog.</td>
      </tr>
      <tr>
        <td>closeBg</td>
        <td>Boolean</td>
        <td>-</td>
        <td>true</td>
        <td>Si à true, fermera le dialog au click sur l'arrière fond.</td>
      </tr>
    </tbody>
  </table>
  <h2 class="h2">État exposé</h2>
  <h4 class="h4"><i class="fa-solid fa-diamond mr-5"></i>isOpen</h4>
  <p>
    <span class="badge-code">Ref&lt;boolean&gt;</span> réactif exposé par le composant. Initialement
    à <span class="badge-code">false</span>, passe à <span class="badge-code">true</span> à
    l'ouverture et revient à <span class="badge-code">false</span> à la fermeture (incluant
    <span class="badge-code">closeSilent</span> et la touche Escape). Utile pour démonter le contenu
    du slot via <span class="badge-code">v-if="dialog?.isOpen"</span> et éviter les rendus finaux
    sur des refs réinitialisées dans <span class="badge-code">@dialog-close</span>.
  </p>

  <h2 class="h2">Méthodes</h2>
  <!-- add -->
  <h4 class="h4"><i class="fa-solid fa-diamond mr-5"></i>show</h4>
  <p>Permet d'afficher le dialog.</p>
  <!-- close -->
  <h4 class="h4"><i class="fa-solid fa-diamond mr-5"></i>close</h4>
  <p>Permet de fermer le dialog. Émet l'événement <span class="badge-code">dialog-close</span>.</p>
  <!-- closeSilent -->
  <h4 class="h4"><i class="fa-solid fa-diamond mr-5"></i>closeSilent</h4>
  <p>
    Permet de fermer le dialog sans émettre l'événement
    <span class="badge-code">dialog-close</span>. Utile lorsque le composant parent gère lui-même la
    logique de fermeture (ex: après un save).
  </p>
  <!-- toggle -->
  <h4 class="h4"><i class="fa-solid fa-diamond mr-5"></i>toggle</h4>
  <p>Permet de basculer l'état du dialog.</p>
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
        <td>state</td>
        <td>Boolean</td>
        <td>-</td>
        <td>True pour afficher et False pour le masquer</td>
      </tr>
    </tbody>
  </table>

  <h2 class="h2">Fonctionnalités</h2>

  <h3 class="h3"><i class="fa-solid fa-diamond mr-5"></i>HTML Native Dialog</h3>
  <p>Le composant utilise l'élément HTML natif <span class="badge-code">&lt;dialog&gt;</span> :</p>
  <ul>
    <li>
      <strong>showModal()</strong> : Affiche le dialog en mode modal (bloque l'interaction avec le
      reste de la page)
    </li>
    <li><strong>close()</strong> : Ferme le dialog</li>
    <li>
      <strong>Propriété open</strong> : Booléen indiquant si le dialog est ouvert (utilisé dans
      toggle)
    </li>
    <li><strong>Backdrop natif</strong> : Arrière-plan généré automatiquement par le navigateur</li>
  </ul>

  <h3 class="h3"><i class="fa-solid fa-diamond mr-5"></i>Événements émis</h3>
  <p>Le composant émet deux événements via <span class="badge-code">defineEmits</span> :</p>
  <ul>
    <li>
      <strong>dialog-show</strong> : Émis quand le dialog s'ouvre (dans showDialog après showModal)
    </li>
    <li>
      <strong>dialog-close</strong> : Émis quand le dialog se ferme (dans closeDialog après close)
    </li>
  </ul>

  <h3 class="h3"><i class="fa-solid fa-diamond mr-5"></i>Fermeture par Escape</h3>
  <p>
    Le composant intercepte l'événement <span class="badge-code">cancel</span> natif du dialog
    (déclenché par la touche Escape). Cela garantit que l'événement
    <span class="badge-code">@dialog-close</span> est correctement émis, permettant aux composants
    parents de réaliser le nettoyage nécessaire.
  </p>

  <h3 class="h3"><i class="fa-solid fa-diamond mr-5"></i>Démontage du contenu à la fermeture</h3>
  <p>
    Quand <span class="badge-code">@dialog-close</span> réinitialise des refs lues par le slot, un
    dernier tick de rendu peut se produire après la fermeture native mais avant le démontage du
    slot, provoquant des erreurs du type
    <span class="badge-code">Cannot read properties of undefined</span>. Envelopper le contenu du
    slot avec <span class="badge-code">v-if="dialog?.isOpen"</span> garantit un démontage propre :
  </p>
  <!-- eslint-disable -->
  <CodeHtml class="my-15">
    <template v-pre>
      <Dialog ref="dialog">
        <div v-if="dialog?.isOpen">
          <!-- contenu qui lit l'état du composable -->
        </div>
      </Dialog>
    </template>
  </CodeHtml>
  <!-- eslint-enable -->

  <h2 class="h2">Exemple</h2>
  <button
    class="btn btn-primary btn-primary-400-active"
    @click="openDialog"
  >
    Ouvrir le modal
  </button>
  <Dialog ref="dialog">
    <p>Dialog de test</p>
  </Dialog>
  <!-- eslint-disable -->
  <CodeHtml class="my-15">
    <scriptBalise v-pre>
      const dialog = ref() \n const openDialog = () => dialog.value.show()
    </scriptBalise>
    <template v-pre>
      <button @click="openDialog">ouvrir le modal</button>
      <Dialog ref="dialog">
        <span>Exemple de code HTML</span>
      </Dialog>
    </template>
  </CodeHtml>
  <!-- eslint-enable -->

  <h2 class="h2">Impression (Print)</h2>
  <p class="my-10">
    Le composant gère automatiquement l'impression via <span class="badge-code">@media print</span>.
    Quand un dialog est ouvert et que l'utilisateur imprime la page, seul le contenu du dialog est
    visible.
  </p>
  <h3 class="h3"><i class="fa-solid fa-diamond mr-5"></i>Comportement</h3>
  <ul>
    <li>
      Les éléments frères du dialog (et de ses ancêtres) sont masqués via
      <span class="badge-code">display: none</span>
    </li>
    <li>Seule la chaîne d'ancêtres menant au dialog reste affichée</li>
    <li>Le bouton de fermeture et le backdrop sont masqués à l'impression</li>
    <li>Le dialog est affiché en pleine largeur sans bordures ni ombres</li>
  </ul>
  <h3 class="h3"><i class="fa-solid fa-diamond mr-5"></i>Exemple</h3>
  <button
    class="btn btn-primary btn-primary-400-active"
    @click="openAndPrint"
  >
    Ouvrir et imprimer
  </button>
  <Dialog ref="dialogPrint">
    <p>Ce contenu sera imprimé. Le reste de la page sera masqué.</p>
  </Dialog>
  <!-- eslint-disable -->
  <CodeHtml class="my-15">
    <scriptBalise v-pre>
      const dialog = ref() \n const openAndPrint = () => { \n dialog.value.show() \n setTimeout(()
      => window.print(), 300) \n }
    </scriptBalise>
    <template v-pre>
      <button @click="openAndPrint">Ouvrir et imprimer</button>
      <Dialog ref="dialog">
        <p>Ce contenu sera imprimé.</p>
      </Dialog>
    </template>
  </CodeHtml>
  <!-- eslint-enable -->
</template>
