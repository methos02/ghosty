<script setup>
import ConfirmButton from '@brugmann/vuemann/src/components/ConfirmButtonComponent.vue'
import CodeHtml from '@brugmann/vuemann/src/components/codeHtml/CodeHtmlComponent.vue'

const DELAY_MS = 1000
const confirmCallback = async () => {
  await new Promise(resolve => setTimeout(resolve, DELAY_MS))
}
</script>

<template>
  <h1 class="h1">Component button de confirmation</h1>
  <p>
    Ce component permet d'avoir une confirmation lorsque l'on clique sur un bouton. Il supporte deux
    modes :
  </p>
  <ul class="list ml-25">
    <li>
      <span class="fw-700 color-primary">inline</span> : affichage inline des boutons de
      confirmation.
    </li>
    <li><span class="fw-700 color-primary">dialog</span> : affichage dans une modal.</li>
  </ul>

  <h2 class="h2">Dépendances</h2>
  <p>Ce composant utilise :</p>
  <ul>
    <li>
      <span class="badge-code">LoaderComponent</span> - Gère l'affichage du loader pendant
      l'exécution du callback
    </li>
    <li>
      <span class="badge-code">DialogComponent</span> - Affiche la modal de confirmation en mode
      dialog
    </li>
    <li>
      <span class="badge-code">t()</span> - Service de traduction pour les labels des boutons
      Valider/Annuler
    </li>
    <li><span class="badge-code">ref</span> - Gestion de l'état (state, dialog, loader)</li>
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
        <td>Contenu du bouton initial. S'affiche à l'intérieur du LoaderComponent.</td>
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
        <td>cb</td>
        <td>Function</td>
        <td>oui</td>
        <td>-</td>
        <td>Fonction à appeler lors du clic sur la confirmation.</td>
      </tr>
      <tr>
        <td>params</td>
        <td>Array</td>
        <td>-</td>
        <td>[]</td>
        <td>Paramètres à passer à la fonction de callback.</td>
      </tr>
      <tr>
        <td>question</td>
        <td>String</td>
        <td>-</td>
        <td>''</td>
        <td>Texte de la question de confirmation. Si fourni, active le mode dialog.</td>
      </tr>
    </tbody>
  </table>

  <h2 class="h2">Fonctionnalités</h2>

  <h3 class="h3"><i class="fa-solid fa-diamond mr-5"></i>État de confirmation</h3>
  <p>
    Le composant utilise une variable d'état réactive <span class="badge-code">state</span> avec
    deux valeurs possibles :
  </p>
  <ul>
    <li><strong>'init'</strong> : État initial, le bouton principal est affiché</li>
    <li>
      <strong>'confirm'</strong> : État de confirmation, les boutons Valider/Annuler sont affichés
      (mode inline uniquement)
    </li>
  </ul>
  <p>
    Le clic sur le bouton initial déclenche <span class="badge-code">clickEvent()</span> qui change
    l'état à 'confirm'.
  </p>

  <h3 class="h3"><i class="fa-solid fa-diamond mr-5"></i>Mode inline (par défaut)</h3>
  <p>
    En mode inline (<span class="badge-code">question === ''</span>), le comportement est le suivant
    :
  </p>
  <ul>
    <li>
      <strong>Bouton initial</strong> : Affiché quand
      <span class="badge-code">state === 'init'</span>
    </li>
    <li>
      <strong>Transformation</strong> : Au clic, l'état passe à 'confirm' et deux boutons
      apparaissent (Valider et Annuler)
    </li>
    <li>
      <strong>Bouton Valider</strong> : Déclenche <span class="badge-code">runCallback()</span> qui
      exécute le callback et réinitialise l'état
    </li>
    <li>
      <strong>Bouton Annuler</strong> : Réinitialise simplement l'état à 'init' sans exécuter le
      callback
    </li>
    <li>
      <strong>Data attributes</strong> : data-confirm, data-valide, data-cancel pour faciliter les
      tests
    </li>
  </ul>

  <h3 class="h3"><i class="fa-solid fa-diamond mr-5"></i>Mode dialog</h3>
  <p>En mode dialog (<span class="badge-code">question !== ''</span>), le comportement change :</p>
  <ul>
    <li>
      <strong>DialogComponent</strong> : Un composant DialogComponent est rendu avec
      <span class="badge-code">closeBg={false}</span> et
      <span class="badge-code">closeCross={false}</span>
    </li>
    <li>
      <strong>Ouverture</strong> : Au clic sur le bouton,
      <span class="badge-code">dialog.show()</span> est appelé
    </li>
    <li>
      <strong>Question</strong> : La prop <span class="badge-code">question</span> est affichée
      comme texte de confirmation dans la modal
    </li>
    <li>
      <strong>Boutons</strong> : Valider et Annuler sont affichés dans la modal au lieu d'être
      inline
    </li>
    <li>
      <strong>Fermeture</strong> : Annuler ferme la modal via
      <span class="badge-code">dialog.close()</span>, Valider exécute le callback puis ferme la
      modal
    </li>
  </ul>

  <h3 class="h3"><i class="fa-solid fa-diamond mr-5"></i>Intégration LoaderComponent</h3>
  <p>Le bouton initial est enrobé dans un <span class="badge-code">LoaderComponent</span> :</p>
  <ul>
    <li>
      <strong>Callback automatique</strong> : Le LoaderComponent reçoit les props
      <span class="badge-code">cb</span> et <span class="badge-code">params</span>
    </li>
    <li>
      <strong>Loading state</strong> : Pendant l'exécution du callback, un loader est affiché
      automatiquement
    </li>
    <li>
      <strong>Click event</strong> : L'événement @click sur le LoaderComponent déclenche
      <span class="badge-code">clickEvent()</span> avant l'exécution
    </li>
    <li>
      <strong>Méthode exposée</strong> :
      <span class="badge-code">loader.value.runCallback()</span> est appelé dans
      <span class="badge-code">runCallback()</span>
    </li>
  </ul>

  <h3 class="h3"><i class="fa-solid fa-diamond mr-5"></i>Gestion du callback</h3>
  <p>
    La fonction <span class="badge-code">runCallback()</span> orchestre l'exécution du callback :
  </p>
  <ul>
    <li>
      <strong>Exécution</strong> : Appelle
      <span class="badge-code">loader.value.runCallback()</span> qui exécute le callback avec les
      params
    </li>
    <li><strong>Réinitialisation</strong> : Remet l'état à 'init' après exécution</li>
    <li>
      <strong>Fermeture dialog</strong> : Si <span class="badge-code">question !== ''</span>, ferme
      la modal via <span class="badge-code">dialog.value.close()</span>
    </li>
    <li>
      <strong>Async support</strong> : Le LoaderComponent gère automatiquement les callbacks
      asynchrones
    </li>
  </ul>

  <h3 class="h3"><i class="fa-solid fa-diamond mr-5"></i>Affichage conditionnel</h3>
  <p>Le composant utilise des conditions v-if et v-show pour l'affichage :</p>
  <ul>
    <li>
      <strong>DialogComponent</strong> : Rendu uniquement si
      <span class="badge-code">question !== ''</span> (v-if)
    </li>
    <li>
      <strong>Bouton initial</strong> : Affiché si
      <span class="badge-code">state === 'init' || question !== ''</span> (v-show) - en mode dialog
      toujours visible, en mode inline seulement quand state est 'init'
    </li>
    <li>
      <strong>Boutons confirm/cancel</strong> : Rendus uniquement en mode inline (<span
        class="badge-code"
        >question === ''</span
      >) et affichés si <span class="badge-code">state === 'confirm'</span>
    </li>
    <li>
      <strong>Optimisation</strong> : v-show pour le bouton principal (préserve le DOM), v-if pour
      le DialogComponent (évite le rendu inutile)
    </li>
  </ul>

  <h2 class="h2">Exemples</h2>

  <h3 class="h3">Mode Inline (par défaut)</h3>
  <div class="d-flex j-start mb-20">
    <ConfirmButton :cb="confirmCallback"> Supprimer l'élément </ConfirmButton>
  </div>

  <h3 class="h3">Mode Dialog</h3>
  <div class="d-flex j-start mb-20">
    <ConfirmButton
      :cb="confirmCallback"
      question="Êtes-vous sûr de vouloir supprimer cet élément ?"
    >
      Supprimer avec dialog
    </ConfirmButton>
  </div>

  <h2 class="h2">Code</h2>

  <h3 class="h3">Mode Inline</h3>
  <CodeHtml>
    <scriptBalise v-pre>
      import ConfirmButton from '@brugmann/vuemann/src/components/ConfirmButtonComponent.vue';
    </scriptBalise>
    <template v-pre>
      <ConfirmButton :cb="confirmCallback"> Supprimer l'élément </ConfirmButton>
    </template>
  </CodeHtml>

  <h3 class="h3">Mode Dialog</h3>
  <CodeHtml>
    <scriptBalise v-pre>
      import ConfirmButton from '@brugmann/vuemann/src/components/ConfirmButtonComponent.vue';
    </scriptBalise>
    <template v-pre>
      <ConfirmButton
        :cb="confirmCallback"
        question="Êtes-vous sûr de vouloir supprimer cet élément ?"
      >
        Supprimer avec dialog
      </ConfirmButton>
    </template>
  </CodeHtml>
</template>
