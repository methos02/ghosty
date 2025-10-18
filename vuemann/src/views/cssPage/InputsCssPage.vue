<script setup>
  import CodeHtml from '@brugmann/vuemann/src/components/codeHtml/CodeHtmlComponent.vue'
</script>

<template>
  <h1 class="h1">Inputs</h1>
  <p>
    Vuemann intègre un ensemble de class pour designer simplement vos inputs.
  </p>
  <h2 class="h2">Élément input et textarea</h2>
  <p>
    Design pour un element input. Ce dernier aura une bordure, des bords arrondi et prendra tous l'espace disponible. Le hover et le focus 
    changeront la couleur de sa bordure.
  </p>
  <div class="f-equal g-25">
    <div>
      <input type="text" name="input-exemple" class="input" />
    </div>
    <div>
      <textarea name="textarea-exemple" class="input"></textarea>
    </div>
  </div>
  <CodeHtml>
    <input type="text" name="input-exemple" class="input" />
    <textarea name="textarea-exemple" class="input"></textarea>
  </CodeHtml>
  <h2 class="h2">Input search</h2>
  <p class="mt-15">
    Permet de rajouter un loader à droit de l'input lorsque l'on rajoute la class <span class="badge-code">.searching</span>
  </p>
  <div class="f-center">
    <div class="w-50">
      <div class="input input-search searching">
        <input name="input-exemple"/>
      </div>
    </div>
  </div>
  <CodeHtml>
    //sans loader
    <div class="input input-search">
      <input name="input-exemple" />
    </div>
    //avec loader
    <div class="input input-search searching">
      <input name="input-exemple" />
    </div>
  </CodeHtml>
  <h2 class="h2">Select</h2>
  <p>
    Associé à la class input, permet de caché la caret d'un élément de type select pour le remplacer par un autre plus design.
  </p>
  <div class="f-center">
    <div class="w-50">
      <div class="select-container">
        <select name="select-exemple" class="input">
            <option value="exemple">option exemple</option>
        </select>
      </div>
    </div>
  </div>
  <CodeHtml>
    <div class="select-container">
      <select name="select-exemple" class="input">
          <option value="exemple">option exemple</option>
      </select>
    </div>
  </CodeHtml>
  <h2 class="h2">Checkbox</h2>
  <p>
    Permet d'aligner en hauteur une checkbox avec son label et d'ajouter une séparation entre les deux.
  </p>
  <div class="f-center">
    <div class="w-50 d-flex j-between">
      <div class="checkbox-container">
        <input id="checkbox-left" type="checkbox" name="checkbox-left" />
        <label for="checkbox-left">Checkbox à gauche</label>
      </div>
      <div class="checkbox-container">
        <label for="checkbox-right">Checkbox à droite</label>
        <input id="checkbox-right" type="checkbox" name="checkbox-right" />
      </div>
    </div>
  </div>
  <CodeHtml>
    <div class="checkbox-container">
        <input id="checkbox-left" type="checkbox" name="checkbox-left" />
        <label for="checkbox-left">Checkbox à gauche</label>
      </div>
      <div class="checkbox-container">
        <label for="checkbox-right">Checkbox à droite</label>
        <input id="checkbox-right" type="checkbox" name="checkbox-right" />
      </div>
  </CodeHtml>
</template>
