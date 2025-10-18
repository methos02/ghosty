<script setup>
  import IconConfirm from '../../components/ConfirmIconComponent.vue';
  import CodeHtml from '@brugmann/vuemann/src/components/codeHtml/CodeHtmlComponent.vue'

  const DELAY_MS = 1000;
  const iconConfirmCallback = async () => {
    await new Promise((resolve) => setTimeout(resolve, DELAY_MS));
  }
</script>

<template>
  <h1 class="h1"> Component Icone de confirmation </h1>
  <p>
    Ce component permet d'avoir une confirmation lorsque l'on clique sur un icon.
  </p>
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
        <td>Question à afficher dans un dialog. Si fournie, ouvre un dialog de confirmation au lieu d'afficher directement les boutons.</td>
      </tr>
    </tbody>
  </table>
  <p>
    <i class="fa-solid fa-triangle-exclamation color-danger mr-5"></i>
    vous devez obligatoirement définir un texte ou une icone.
    <i class="fa-solid fa-triangle-exclamation color-danger ml-5"></i>
  </p>
  <h2 class="h2">Comportement</h2>
  <p>
    Le composant a deux modes de fonctionnement selon la prop <code>question</code> :
  </p>
  <ul class="list ml-25 mb-15">
    <li>
      <strong>Sans question</strong> : Affiche directement les boutons de confirmation/annulation après le clic initial
    </li>
    <li>
      <strong>Avec question</strong> : Ouvre un dialog de confirmation contenant la question et les boutons
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
    Lors de vos tests, des data attributes sont ajoutées sur les boutons pour pouvoir cibler les boutons facilement.
  </p>
  <ul class="list ml-25">
    <li>
      <code>data-confirm</code> : Bouton initial qui déclenche la confirmation.
    </li>
    <li>
      <code>data-valide</code> : Bouton de validation (soit dans les boutons directs soit dans le dialog).
    </li>
    <li>
      <code>data-cancel</code> : Bouton d'annulation (soit dans les boutons directs soit dans le dialog).
    </li>
  </ul>
  <p>
    <strong>Note :</strong> Selon la présence de la prop <code>question</code>, les boutons <code>data-valide</code> et <code>data-cancel</code> seront soit affichés directement soit dans un dialog.
  </p>
</template>
