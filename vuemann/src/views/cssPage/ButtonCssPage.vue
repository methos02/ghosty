<script setup>
  import CodeHtml from "@brugmann/vuemann/src/components/codeHtml/CodeHtmlComponent.vue"
</script>

<template>
  <h1 class="h1"> Button </h1>
  <p>
    Vuemann intégre un ensemble de style pour les boutons avec un effet de survole.
  </p>
  <p>
    La class <span class="badge-code">.btn</span> permet d'appliquer le style du bouton. La structure suivante <span class="badge-code">.btn-{btn_type}</span> 
    permet d'appliquer la couleur.
  </p>
  <h2 class="h2">Colorie disponible</h2>
  <div class="d-flex g-5">
    <button type="button" class="btn btn-primary">Primary</button>
    <button type="button" class="btn btn-success">Success</button>
    <button type="button" class="btn btn-danger">Danger</button>
    <button type="button" class="btn btn-warning">Warning</button>
    <button type="button" class="btn btn-info">Info</button>
    <button type="button" class="btn btn-blue">Blue</button>
  </div>
  <CodeHtml>
    <button type="button" class="btn btn-primary">Primary</button>
    <button type="button" class="btn btn-success">Success</button>
    <button type="button" class="btn btn-danger">Danger</button>
    <button type="button" class="btn btn-warning">Warning</button>
    <button type="button" class="btn btn-info">Info</button>
    <button type="button" class="btn btn-blue">Blue</button>
  </CodeHtml>
  <h2 class="h2">Boutons alternatifs</h2>
  <p>
    Chaque couleur de bouton dispose d'une version alternative avec la classe <span class="badge-code">.btn-{btn_type}-alt</span>. 
    Ces boutons ont un fond transparent avec une bordure colorée et prennent la couleur de fond au survol. 
    Très utile pour les barres de navigation ou les onglets.
  </p>
  <div class="d-flex g-5">
    <button type="button" class="btn btn-primary-alt">Primary alt</button>
    <button type="button" class="btn btn-success-alt">Success alt</button>
    <button type="button" class="btn btn-danger-alt">Danger alt</button>
    <button type="button" class="btn btn-warning-alt">Warning alt</button>
    <button type="button" class="btn btn-info-alt">Info alt</button>
    <button type="button" class="btn btn-blue-alt">Blue alt</button>
  </div>
  <CodeHtml>
    <button type="button" class="btn btn-primary-alt">Primary alt</button>
    <button type="button" class="btn btn-success-alt">Success alt</button>
    <button type="button" class="btn btn-danger-alt">Danger alt</button>
    <button type="button" class="btn btn-warning-alt">Warning alt</button>
    <button type="button" class="btn btn-info-alt">Info alt</button>
    <button type="button" class="btn btn-blue-alt">Blue alt</button>
  </CodeHtml>
  <h3 class="h3">État actif</h3>
  <p>
    Les boutons alternatifs peuvent avoir un état actif avec la classe <span class="badge-code">.active</span>.
  </p>
  <div class="d-flex g-5">
    <button type="button" class="btn btn-primary-alt active">Primary alt actif</button>
    <button type="button" class="btn btn-success-alt active">Success alt actif</button>
  </div>
  <CodeHtml>
    <button type="button" class="btn btn-primary-alt active">Primary alt actif</button>
    <button type="button" class="btn btn-success-alt active">Success alt actif</button>
  </CodeHtml>
  <h2 class="h2">btn-icon et sur le focus</h2>
  <p>
    Pour ajouter un effet de focus sur un bouton avec une icône, il faut ajouter la classe <span class="badge-code">.btn-icon</span>.
  </p>
  <div class="d-flex g-5">
    <button type="button" class="btn-icon">
      <i class="fa-regular fa-calendar-days fs-600 color-primary color-primary-300-hover pointer"></i>
    </button>
  </div>
  <CodeHtml>
    <button type="button" class="btn-icon">
      <i class="fa-regular fa-calendar-days fs-600 color-primary color-primary-300-hover pointer"></i>
    </button>
  </CodeHtml>
  <ul>
    <li>Une bordure de focus avec la couleur <span class="badge-code">--primary-300</span></li>
    <li>Un border-radius de 5px pour la bordure de focus</li>
    <li>L'icône change de couleur pour utiliser <span class="badge-code">--primary-300</span></li>
  </ul>
  <p>
    <strong>Note :</strong> Utilisez la touche Tab pour naviguer entre les boutons et voir l'effet de focus.
  </p>
</template>
