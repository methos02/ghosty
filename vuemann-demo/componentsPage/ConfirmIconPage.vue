<script setup>
import IconConfirm from '@brugmann/vuemann/src/components/ConfirmIconComponent.vue'
import CodeHtml from '@brugmann/vuemann/src/components/codeHtml/CodeHtmlComponent.vue'

const DELAY_MS = 1000
const iconConfirmCallback = async () => {
  await new Promise(resolve => setTimeout(resolve, DELAY_MS))
}
</script>

<template>
  <h1 class="h1">Component Icone de confirmation</h1>
  <p>Ce component permet d'avoir une confirmation lorsque l'on clique sur un icon.</p>

  <h2 class="h2">Dépendances</h2>
  <p>Ce composant utilise :</p>
  <ul>
    <li>
      <span class="badge-code">DialogComponent</span> - Affiche la modal de confirmation en mode
      question
    </li>
    <li>
      <span class="badge-code">flash</span> - Service pour afficher un message d'erreur si icon et
      text sont utilisés ensemble
    </li>
    <li>
      <span class="badge-code">t()</span> - Service de traduction pour les labels des boutons dans
      la modal
    </li>
    <li><span class="badge-code">ref</span> - Gestion de l'état (state, dialog)</li>
    <li>
      <span class="badge-code">onMounted</span> - Validation que icon et text ne sont pas utilisés
      simultanément
    </li>
  </ul>

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
        <td>icon</td>
        <td>String</td>
        <td>-</td>
        <td>''</td>
        <td>
          Classes de l'icon. Ce n'est pas obligé d'être une classe Font Awesome.<br />
          Les classes fournies seront appliquées à une balise <code>&lt;i&gt;</code>.
        </td>
      </tr>
      <tr>
        <td>text</td>
        <td>String</td>
        <td>-</td>
        <td>''</td>
        <td>Texte à afficher sur le bouton de confirmation.</td>
      </tr>
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
        <td>
          Question à afficher dans un dialog. Si fournie, ouvre un dialog de confirmation au lieu
          d'afficher directement les boutons.
        </td>
      </tr>
    </tbody>
  </table>
  <p>
    <i class="fa-solid fa-triangle-exclamation color-danger mr-5"></i>
    vous devez obligatoirement définir un texte ou une icone.
    <i class="fa-solid fa-triangle-exclamation color-danger ml-5"></i>
  </p>

  <h2 class="h2">Fonctionnalités</h2>

  <h3 class="h3"><i class="fa-solid fa-diamond mr-5"></i>Validation icon/text</h3>
  <p>
    Le composant valide que <span class="badge-code">icon</span> et
    <span class="badge-code">text</span> ne sont pas utilisés simultanément :
  </p>
  <ul>
    <li>
      <strong>Validation onMounted</strong> : Vérifie au montage du composant que les deux props ne
      sont pas remplies
    </li>
    <li>
      <strong>Message d'erreur</strong> : Affiche un flash error via
      <span class="badge-code"
        >flash.error('ConfirmIconComponent: text and icon cannot be used together')</span
      >
    </li>
    <li>
      <strong>Affichage conditionnel</strong> : L'icône s'affiche si
      <span class="badge-code">icon !== '' && text === ''</span>
    </li>
    <li>
      <strong>Affichage conditionnel</strong> : Le texte s'affiche si
      <span class="badge-code">text !== '' && icon === ''</span>
    </li>
  </ul>

  <h3 class="h3"><i class="fa-solid fa-diamond mr-5"></i>État de confirmation</h3>
  <p>
    Le composant utilise une variable d'état réactive <span class="badge-code">state</span> avec
    trois valeurs possibles :
  </p>
  <ul>
    <li><strong>'init'</strong> : État initial, le bouton icon/text est affiché</li>
    <li>
      <strong>'confirm'</strong> : État de confirmation, les boutons de validation/annulation sont
      affichés (mode sans question uniquement)
    </li>
    <li>
      <strong>'loading'</strong> : État de chargement pendant l'exécution du callback, un
      loader-spin est affiché
    </li>
  </ul>
  <p>
    Le clic sur le bouton initial déclenche <span class="badge-code">clickEvent()</span> qui change
    l'état à 'confirm'.
  </p>

  <h3 class="h3"><i class="fa-solid fa-diamond mr-5"></i>Mode sans question</h3>
  <p>
    En mode sans question (<span class="badge-code">question === ''</span>), le comportement est le
    suivant :
  </p>
  <ul>
    <li>
      <strong>Bouton initial</strong> : Icône ou texte avec classe
      <span class="badge-code">link-default</span> et
      <span class="badge-code">underline-hover</span> pour le texte
    </li>
    <li>
      <strong>Transformation</strong> : Au clic, l'état passe à 'confirm' et deux icônes
      apparaissent (check et xmark)
    </li>
    <li>
      <strong>Icône check</strong> : Couleur success au hover, déclenche
      <span class="badge-code">runCallback()</span>
    </li>
    <li>
      <strong>Icône xmark</strong> : Couleur danger au hover, réinitialise l'état à 'init' sans
      exécuter le callback
    </li>
    <li>
      <strong>Data attributes</strong> : data-confirm, data-valid, data-cancel pour faciliter les
      tests
    </li>
  </ul>

  <h3 class="h3"><i class="fa-solid fa-diamond mr-5"></i>Mode avec question</h3>
  <p>
    En mode avec question (<span class="badge-code">question !== ''</span>), le comportement change
    :
  </p>
  <ul>
    <li>
      <strong>DialogComponent</strong> : Rendu avec
      <span class="badge-code">closeBg={false}</span> et
      <span class="badge-code">closeCross={false}</span>
    </li>
    <li>
      <strong>Ouverture</strong> : Au clic sur l'icône/texte,
      <span class="badge-code">dialog.show()</span> est appelé
    </li>
    <li>
      <strong>Question</strong> : La prop <span class="badge-code">question</span> est affichée
      comme texte de confirmation dans la modal
    </li>
    <li>
      <strong>Boutons complets</strong> : Boutons Valider et Annuler avec texte et icônes (btn
      btn-success/btn-danger)
    </li>
    <li>
      <strong>Fermeture</strong> : Annuler ferme la modal via
      <span class="badge-code">dialog.close()</span>, Valider exécute le callback puis ferme la
      modal
    </li>
  </ul>

  <h3 class="h3"><i class="fa-solid fa-diamond mr-5"></i>Gestion du callback</h3>
  <p>La fonction <span class="badge-code">runCallback()</span> gère l'exécution du callback :</p>
  <ul>
    <li>
      <strong>Fermeture dialog</strong> : Si <span class="badge-code">question !== ''</span>, ferme
      la modal avant l'exécution
    </li>
    <li>
      <strong>Loading state</strong> : Change l'état à 'loading' avant l'exécution, affiche un
      loader-spin
    </li>
    <li>
      <strong>Exécution async</strong> : Attend la fin du callback avec
      <span class="badge-code">await props.cb(...props.params)</span>
    </li>
    <li><strong>Réinitialisation</strong> : Remet l'état à 'init' après l'exécution</li>
    <li><strong>Spread params</strong> : Les params sont passés au callback via spread operator</li>
  </ul>

  <h3 class="h3"><i class="fa-solid fa-diamond mr-5"></i>Affichage conditionnel</h3>
  <p>Le composant utilise des conditions v-if complexes pour l'affichage :</p>
  <ul>
    <li>
      <strong>Bouton initial</strong> : Affiché si
      <span class="badge-code">state === 'init' || (state === 'confirm' && question !== '')</span>
    </li>
    <li>
      <strong>Boutons confirm/cancel</strong> : Affichés si
      <span class="badge-code">state === 'confirm' && question === ''</span>
    </li>
    <li>
      <strong>Loader</strong> : Affiché si <span class="badge-code">state === 'loading'</span>
    </li>
    <li>
      <strong>DialogComponent</strong> : Rendu uniquement si
      <span class="badge-code">question !== ''</span> (v-if)
    </li>
  </ul>

  <h2 class="h2">Comportement</h2>
  <p>Le composant a deux modes de fonctionnement selon la prop <code>question</code> :</p>
  <ul class="list ml-25 mb-15">
    <li>
      <strong>Sans question</strong> : Affiche directement les boutons de confirmation/annulation
      après le clic initial
    </li>
    <li>
      <strong>Avec question</strong> : Ouvre un dialog de confirmation contenant la question et les
      boutons
    </li>
  </ul>
  <h2 class="h2">Exemples</h2>
  <h3 class="h3">Sans question (boutons directs)</h3>
  <div class="f-column g-10 a-start mb-25">
    <p>Avec une icône :</p>
    <IconConfirm
      icon="fa-solid fa-trash"
      :cb="iconConfirmCallback"
    />
    <p>Avec un texte :</p>
    <IconConfirm
      text="Supprimer"
      :cb="iconConfirmCallback"
    />
  </div>
  <h3 class="h3">Avec question (dialog)</h3>
  <div class="f-column g-10 a-start">
    <p>Avec une icône et dialog :</p>
    <IconConfirm
      icon="fa-solid fa-trash"
      question="Êtes-vous sûr de vouloir supprimer cet élément ?"
      :cb="iconConfirmCallback"
    />
    <p>Avec un texte et dialog :</p>
    <IconConfirm
      text="Supprimer définitivement"
      question="Cette action est irréversible. Continuer ?"
      :cb="iconConfirmCallback"
    />
  </div>
  <h2 class="h2">Code</h2>
  <h3 class="h3">Sans question</h3>
  <CodeHtml>
    <IconConfirm
      icon="fa-solid fa-trash"
      :cb="iconConfirmCallback"
      v-pre
    />
  </CodeHtml>
  <h3 class="h3">Avec question</h3>
  <CodeHtml>
    <IconConfirm
      icon="fa-solid fa-trash"
      question="Êtes-vous sûr de vouloir supprimer cet élément ?"
      :cb="iconConfirmCallback"
      v-pre
    />
  </CodeHtml>
  <h2 class="h2">Tests</h2>
  <p>
    Lors de vos tests, des data attributes sont ajoutées sur les boutons pour pouvoir cibler les
    boutons facilement.
  </p>
  <ul class="list ml-25">
    <li><code>data-confirm</code> : Bouton initial qui déclenche la confirmation.</li>
    <li>
      <code>data-valide</code> : Bouton de validation (soit dans les boutons directs soit dans le
      dialog).
    </li>
    <li>
      <code>data-cancel</code> : Bouton d'annulation (soit dans les boutons directs soit dans le
      dialog).
    </li>
  </ul>
  <p>
    <strong>Note :</strong> Selon la présence de la prop <code>question</code>, les boutons
    <code>data-valide</code> et <code>data-cancel</code> seront soit affichés directement soit dans
    un dialog.
  </p>
</template>
