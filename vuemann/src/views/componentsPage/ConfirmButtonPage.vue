<script setup>
  import ConfirmButton from '../../components/ConfirmButtonComponent.vue';
  import CodeHtml from '@brugmann/vuemann/src/components/codeHtml/CodeHtmlComponent.vue'

  const DELAY_MS = 1000;
  const confirmCallback = async () => {
    await new Promise((resolve) => setTimeout(resolve, DELAY_MS));
  }
</script>

<template>
  <h1 class="h1"> Component button de confirmation </h1>
  <p>
    Ce component permet d'avoir une confirmation lorsque l'on clique sur un bouton. Il supporte deux modes : 

  </p>
  <ul class="list ml-25">
    <li>
      <span class="fw-700 color-primary">inline</span> : affichage inline des boutons de confirmation.
    </li>
    <li>
      <span class="fw-700 color-primary">dialog</span> : affichage dans une modal.
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
        <td>Texte de la question de confirmation (utilisé en mode dialog).</td>
      </tr>
      <tr>
        <td>type</td>
        <td>String</td>
        <td>-</td>
        <td>'inline'</td>
        <td>Type d'affichage : 'inline' ou 'dialog'.</td>
      </tr>
    </tbody>
  </table>
  
  <h2 class="h2">Exemples</h2>
  
  <h3 class="h3">Mode Inline (par défaut)</h3>
  <div class="d-flex j-start mb-20">
    <ConfirmButton 
        :cb="confirmCallback" 
      > 
        Supprimer l'élément
      </ConfirmButton>
  </div>
  
  <h3 class="h3">Mode Dialog</h3>
  <div class="d-flex j-start mb-20">
    <ConfirmButton 
        :cb="confirmCallback"
        type="dialog"
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
      <ConfirmButton 
        :cb="confirmCallback" 
      > 
        Supprimer l'élément
      </ConfirmButton>
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
        type="dialog"
        question="Êtes-vous sûr de vouloir supprimer cet élément ?"
      > 
        Supprimer avec dialog
      </ConfirmButton>
    </template>
  </CodeHtml>
</template>
