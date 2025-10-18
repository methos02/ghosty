<template>
  <h1 class="h1">Les classes css</h1>
  <p class="my-15">
    Vuemann intégre un ensemble de class permettant de designer votre page plus facilement avec moins de code css. Il possède notamment un reset de style pour 
    overwrite les styles des différents navigateur par défaut.
  </p>
  <h2 class="h2">Les Variables</h2>
  <p class="my-15">Des variables css / scss sont disponible en fonction des cas.</p>
  <ul class="list ml-25 mb-15">
    <li>
      <p>
        Lors de la génération du fichier css via ViteJs : $variable
      </p>
    </li>
    <li>
      <p>
        Dans le fichier css via la <a href="https://developer.mozilla.org/fr/docs/Web/CSS/:root" class="link-underline" target="_blank">pseudo class :root</a> : var(--variable)
      </p>
    </li>
  </ul>
  <router-link :to="{name: 'css.variables'}" class="link-underline">Liste des variables</router-link>
  <h2 class="h2">Liste des classes</h2>
  <ul class="list ml-25">
    <li>
      <router-link :to="{name: 'css.button'}" class="link-underline">Button</router-link>
    </li>
    <li>
      <router-link :to="{name: 'css.color'}" class="link-underline">Color</router-link>
    </li>
    <li>
      <router-link :to="{name: 'css.display'}" class="link-underline">Display</router-link>
    </li>
    <li>
      <router-link :to="{name: 'css.globals'}" class="link-underline">Css global</router-link>
    </li>
    <li>
      <router-link :to="{name: 'css.inputs'}" class="link-underline">Inputs</router-link>
    </li>
    <li>
      <router-link :to="{name: 'css.forms'}" class="link-underline">Fomulaires</router-link>
    </li>
    <li>
      <router-link :to="{name: 'css.links'}" class="link-underline">Liens</router-link>
    </li>
    <li>
      <router-link :to="{name: 'css.loader'}" class="link-underline">Loader</router-link>
    </li>
    <li>
      <router-link :to="{name: 'css.titles'}" class="link-underline">Titre</router-link>
    </li>
    <li>
      <router-link :to="{name: 'css.table'}" class="link-underline">Table</router-link>
    </li>
    <li>
      <router-link :to="{name: 'css.badges'}" class="link-underline">Badges</router-link>
    </li>
  </ul>
</template>
