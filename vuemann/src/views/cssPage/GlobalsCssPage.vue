<script setup>
 import CodeHtml from "@brugmann/vuemann/src/components/codeHtml/CodeHtmlComponent.vue"
</script>

<template>
  <h1 class="h1">Css global</h1>
  <p>
    Vuemann intègre un ensemble de class permettant de facilité le design de vos pages et limiter la grandeur de vos fichier css.
  </p>
  <ul class="list ml-25">
    <li>
      <router-link :to="{ hash: '#mpg' }" class="color-neutral-900 color-primary-300-hover underline-hover">Margin, Padding et Gap</router-link>
    </li>
    <li>
      <router-link :to="{ hash: '#fsw' }" class="color-neutral-900 color-primary-300-hover underline-hover">Font Size et Weight</router-link>
    </li>
    <li>
      <router-link :to="{ hash: '#aligment' }" class="color-neutral-900 color-primary-300-hover underline-hover">Alignement de Text</router-link>
    </li>
    <li>
      <router-link :to="{ hash: '#truncate' }" class="color-neutral-900 color-primary-300-hover underline-hover">Truncate Line</router-link>
    </li>
    <li>
      <router-link :to="{ hash: '#image' }" class="color-neutral-900 color-primary-300-hover underline-hover">Image Responsive</router-link>
    </li>
    <li>
      <router-link :to="{ hash: '#stripe' }" class="color-neutral-900 color-primary-300-hover underline-hover">Children Stripe</router-link>
    </li>
    <li>
      <router-link :to="{ hash: '#position' }" class="color-neutral-900 color-primary-300-hover underline-hover">Position Relative</router-link>
    </li>
    <li>
      <router-link :to="{ hash: '#hw' }" class="color-neutral-900 color-primary-300-hover underline-hover">Height et Width</router-link>
    </li>
    <li>
      <router-link :to="{ hash: '#radius' }" class="color-neutral-900 color-primary-300-hover underline-hover">Radius</router-link>
    </li>
    <li>
      <router-link :to="{ hash: '#hide' }" class="color-neutral-900 color-primary-300-hover underline-hover">Hide</router-link>
    </li>
    <li>
      <router-link :to="{ hash: '#shadow' }" class="color-neutral-900 color-primary-300-hover underline-hover">Box Shadow</router-link>
    </li>
  </ul>
  <h2 id="mpg" class="h2">Margin, padding et gap</h2>
  <p>
    En combinant un préfixe et une longueur en pixel, vous pouvez ajouter un margin ou un padding à un élément. La longueur doit être un 
    multiple de 5 compris en 5 et 50.
  </p>
  <table class="t-default">
    <thead>
      <tr>
        <th>suffix</th>
        <th></th>
        <th>x</th>
        <th>y</th>
        <th>t</th>
        <th>r</th>
        <th>b</th>
        <th>l</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>signafication</td>
        <th>all</th>
        <th>inline</th>
        <th>block</th>
        <th>top</th>
        <th>right</th>
        <th>bottom</th>
        <th>left</th>
      </tr>
      <tr>
        <td>margin</td>
        <th>m-15</th>
        <th>mx-15</th>
        <th>my-15</th>
        <th>mt-15</th>
        <th>mr-15</th>
        <th>mb-15</th>
        <th>ml-15</th>
      </tr>
      <tr>
        <td>padding</td>
        <th>p-15</th>
        <th>px-15</th>
        <th>py-15</th>
        <th>pt-15</th>
        <th>pr-15</th>
        <th>pb-15</th>
        <th>pl-15</th>
      </tr>
    </tbody>
  </table>
  <p>
    En ajoutant le prefix g avec une longueur en pixel, vous pourrez préciser un gap
  </p>
  <div class="div-code">
    .g-15 => gap de 15px
  </div>
  <h2 class="h2" id="fsw">Font size et weight</h2>
  <p>
    En combinant le préfixe fs avec une longueur vous pourrez spécifier une taille de police
  </p>
  <table class="t-default">
    <thead>
      <tr>
        <th></th>
        <th>2rem</th>
        <th>3rem</th>
        <th>4rem</th>
        <th>5rem</th>
        <th>300</th>
        <th>400</th>
        <th>600</th>
        <th>700</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>taille</td>
        <th>2rem</th>
        <th>3rem</th>
        <th>4rem</th>
        <th>5rem</th>
        <th>0.85rem</th>
        <th>0.9375rem</th>
        <th>1.2rem</th>
        <th>1.5rem</th>
      </tr>
      <tr>
        <td>class</td>
        <th>fs-2rem</th>
        <th>fs-3rem</th>
        <th>fs-4rem</th>
        <th>fs-5rem</th>
        <th>fs-300</th>
        <th>fs-400</th>
        <th>fs-600</th>
        <th>fs-700</th>
      </tr>
    </tbody>
  </table>
  <p>
    Vous pouvez ajouter la class <span class="badge-code">fs-icon-(300|400)</span> qui corresponde a un font size de 1.2 et 1.4rem
  </p>
  <p>
    La class <span class="badge-code">fw-700</span> vous permettra de mettre en gras l'élément.
  </p>
  <h2 id="aligment" class="h2">Alignement de text</h2>
  <p>
    Les class suivantes vous permettront d'aligner vos texts.
  </p>
  <table class="t-default">
    <thead>
      <tr>
        <th></th>
        <th>text-center</th>
        <th>text-justify</th>
        <th>text-end</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>alignement</td>
        <th>centre</th>
        <th>justify</th>
        <th>droite</th>
      </tr>
    </tbody>
  </table>
  <h2 id="truncate" class="h2">Truncate-line</h2>
  <p>
    Vous permettra de cacher la fin d'un texte quand celui-ci est trop grand et de mettre des petits point à la fin. 
    Vous devez spécifier une longueur dans l'élément parent.
  </p>
  <CodeHtml>
    <div style="width:125px">
      <p class="truncate-line">Very long text</p>
    </div>
  </CodeHtml>
  <h2 id="image" class="h2">Image-responsive</h2>
  <p>
    Vous permettra d'adapter une image à son container. Elle aura l'aspect rond si vous rajouter en plus la class <span class="badge-code">.round</span>
  </p>
  <CodeHtml>
    <div style="width:125px">
      <!-- <img src="image-exemple.jpg" class="image-responsive" alt="image d'exemple"> -->
    </div>
    <div style="width:125px">
      <!-- <img src="image-ronde-exemple.jpg" class="image-responsive round" alt="image ronde d'exemple"> -->
    </div> 
  </CodeHtml>
  <h2 id="stripe" class="h2">children-stripe</h2>
  <p>
    Vous permettra d'avoir un enfant sur deux avec une couleur de fond grisée.
  </p>
  <CodeHtml>
    <ul class="children-stripe">
      <li>child 1</li>
      <li>child 2 - fond gris</li>
      <li>child 3</li>
      <li>child 4 - fond gris</li>
    </ul>
  </CodeHtml>
  <h2 id="position" class="h2">p-relative</h2>
  <p>
    Donnera la position relative à un élément
  </p>
  <CodeHtml>
    <div class="p-relative">
      <div style="position:absolute; inset:5px 5px 0 0;">child absolute</div>
    </div>
  </CodeHtml>
  <h2 id="hw" class="h2">Height et width</h2>
  <p>
    Les class suivantes vous permettront de préciser une hauteur ou une longueur en pourcentage ou avec des valeurs fixes pour les éléments d'interface.
  </p>
  <table class="t-default">
    <thead>
      <tr>
        <th>h-100</th>
        <th>w-100</th>
        <th>w-50</th>
        <th>w-25</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>height : 100%</td>
        <th>height : 100%</th>
        <th>height : 50%</th>
        <th>height : 25%</th>
      </tr>
    </tbody>
  </table>
  <p>
    Les classes <span class="badge-code">h-input</span> et <span class="badge-code">h-header</span> utilisent respectivement les variables CSS <span class="badge-code">--input-height</span> et <span class="badge-code">--header-height</span> pour définir leur hauteur.
  </p>
  <h2 id="radius" class="h2">Radius</h2>
  <p>
    Les class suivantes vous permettront de préciser le border radius d'un element.
  </p>
  <table class="t-default">
    <thead>
      <tr>
        <th>class</th>
        <th>radius-5</th>
        <th>radius-10</th>
        <th>radius-15</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>border-radius</td>
        <th>5px</th>
        <th>10px</th>
        <th>15px</th>
      </tr>
    </tbody>
  </table>
  <h2 id="hide" class="h2">Hide</h2>
  <p>
    Permet de cacher une élément (passe l'opacité à 0).
  </p>
  <CodeHtml>
    <div class="hide">
      Élément a cacher
    </div>
  </CodeHtml>
  <h2 id="shadow" class="h2">Box Shadow</h2>
  <p>
    La classe <span class="badge-code">b-shadow</span> permet d'ajouter une ombre portée à un élément.
  </p>
  <table class="t-default">
    <thead>
      <tr>
        <th>class</th>
        <th>b-shadow</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>box-shadow</td>
        <th>rgba(0, 0, 0, 0.15) 0px 3px 8px</th>
      </tr>
    </tbody>
  </table>
  <CodeHtml>
    <div class="b-shadow p-20 radius-10">
      Élément avec ombre portée
    </div>
  </CodeHtml>
</template>
