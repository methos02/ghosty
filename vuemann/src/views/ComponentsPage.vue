<template>
  <h1 class="fs-2rem fw-400 color-primary">Les components</h1>
  <p class="my-15">Vuemann intégre un ensemble de component réutilisable ayant pour but de simplifier votre développement.</p>
  <h2 class="fs-700 fw-400 color-primary mb-15">Liste des composents disponibles</h2>
  <ul class="list ml-25">
    <li>
      <router-link :to="{name: 'components.changelog'}" class="link-underline">Changelog</router-link>
    </li>
    <li>
      <router-link :to="{name: 'components.code'}" class="link-underline">CodeHtml</router-link>
    </li>
    <li>
      <router-link :to="{name: 'components.confirm-button'}" class="link-underline">Confirm Button</router-link>
    </li>
    <li>
      <router-link :to="{name: 'components.confirm-icon'}" class="link-underline">Confirm Icon</router-link>
    </li>
    <li>
      <router-link :to="{name: 'components.dialog'}" class="link-underline">Dialog</router-link>
    </li>
    <li>
      <router-link :to="{name: 'components.dropdown'}" class="link-underline">Dropdown</router-link>
    </li>
    <li>
      <router-link :to="{name: 'components.breadcrumb'}" class="link-underline">File d'ariane</router-link>
    </li>
    <li>
      <router-link :to="{name: 'components.header'}" class="link-underline">Header</router-link>
    </li>
    <li>
      <router-link :to="{name: 'components.loader'}" class="link-underline">Loader</router-link>
    </li>
    <li>
      <router-link :to="{name: 'components.paginator'}" class="link-underline">Paginator</router-link>
    </li>
  </ul>
</template>
