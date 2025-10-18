<script setup>
  import CodeHtml from "@brugmann/vuemann/src/components/codeHtml/CodeHtmlComponent.vue"
</script>

<template>
  <h1 class="h1">Formulaire</h1>
  <p>
    Vuemann intègre un ensemble de class pour pouvoir structurer et rendre responsive vos formulaire.
  </p>
  <h2 class="h2">form-row</h2>
  <p>
    Cette class va répartir de manière équivalente tous les enfants à l'intérieur de l’élément. Les enfants auront seront séparé 
    de 25px et il y aura un margin bottom de 20px.
  </p>
  <p>
    Sûr les écran de moins de 768px, les enfants seront en flex-direction column.
  </p>
  <p>
    Combiné avec la class half, l’élément ne prendra que la moitié de l'espace disponible
  </p>
  <h3 class="h3">Avec deux inputs</h3>
  <div class="form-row">
   <input name="input-exemple" class="input" />
   <input name="input-2-exemple" class="input" />
  </div>
  <h3 class="h3">Avec un input et la class half</h3>
  <div class="form-row half">
      <input name="half-input-exemple" class="input" />
  </div> 
  <CodeHtml>
    <div class="form-row">
      <input name="input-exemple" />
      <input name="input-2-exemple" />
    </div>
    <div class="form-row half">
        <input name="half-input-exemple" />
    </div> 
  </CodeHtml>
  <h2 class="h2">form-input et form-label</h2>
  <p>
    La class <span class="badge-code">.form-input</span> s'applique directement à l'élément <span class="badge-code">&lt;input&gt;</span> pour activer le label flottant via <span class="badge-code">:focus</span> et <span class="badge-code">:not(:placeholder-shown)</span>.
  </p>
  <p>
    Utilisez un conteneur avec <span class="badge-code">.p-relative</span>, placez le <span class="badge-code">&lt;label.form-label&gt;</span> juste après l’input et définissez <span class="badge-code">placeholder=" "</span> (espace) pour permettre l’état <span class="badge-code">:placeholder-shown</span>.
  </p>
  <p>
    La class <span class="badge-code">.form-label</span> supporte <span class="badge-code">.required</span> pour afficher une astérisque indiquant un champ obligatoire.
  </p>
    <div class="f-equal g-25">
      <div>
        <h3 class="h3 mb-10">Avec une erreur</h3>
        <div class="p-relative mb-25">
          <input id="input-exemple" name="input-exemple" class="form-input input" placeholder=" "/>
          <label for="input-exemple" class="form-label">Label d'exemple</label>
          <p class="form-error">Exemple d'erreur</p>
        </div>
      </div>
      <div>
        <h3 class="h3 mb-10">Input required</h3>
        <div class="p-relative">
          <input id="input-exemple" name="input-exemple" class="form-input input"  placeholder=" " />
          <label for="input-exemple" class="form-label required">Label d'exemple</label>
        </div>
      </div>
    </div>
    <CodeHtml>
      <div class="p-relative">
        <input id="input-exemple" name="input-exemple" class="form-input input" placeholder=" " />
        <label for="input-exemple" class="form-label required">Label d'exemple</label>
        <p class="form-error">Exemple d'erreur</p>
      </div>
    </CodeHtml>
    <h2 class="h2">form-group</h2>
    <p>
      Permet de lier plusieurs éléments entre eux (input, select ou bouton). Le premier élément aura 
      les coins gauche arrondie tandis que le dernier élément aura les coins de droite arrondie.
    </p>
    <div class="f-center">
      <div class="w-25">
        <div class="form-group">
          <input name="input-exemple" class="input" />
          <button class="btn btn-primary">button</button>
        </div>
      </div>
    </div>
    <CodeHtml>
      <div class="form-group">
        <input name="input-exemple" class="input" />
        <button class="btn btn-primary">button</button>
      </div>
    </CodeHtml>
</template>
