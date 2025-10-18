<template>
  <h1 class="h1">Les Helpers</h1>
  <p>
    Vuemann intègre un ensemble de fonctions helpers réutilisables ayant pour but de simplifier les opérations courantes dans votre développement.
  </p>
  <h2 class="h2">Liste des helpers disponibles</h2>
  <ul class="list ml-25">
    <li>
      <router-link :to="{name: 'helpers.date'}" class="link-underline">Date Helper</router-link>
    </li>
    <li>
      <router-link :to="{name: 'helpers.paginator'}" class="link-underline">Paginator Helper</router-link>
    </li>
    <li>
      <router-link :to="{name: 'helpers.utils'}" class="link-underline">Utils Helper</router-link>
    </li>
  </ul>
  <h2 class="h2">Principe des Helpers</h2>
  <p>
    Les helpers sont des fonctions utilitaires qui permettent d'exécuter des tâches récurrentes de manière simple et standardisée.
    Contrairement aux services, les helpers sont de simples fonctions JavaScript qui n'ont pas besoin d'être enregistrées dans le service manager.
  </p>
  <h3 class="h3">Utilisation</h3>
  <p>
    Pour utiliser un helper, il suffit de l'importer directement dans votre composant ou fichier JavaScript :
  </p>
  <div class="div-code">
    <span class="color-green">//Exemple d'utilisation</span><br />    import { dateHelper } from "@/helpers/date-helper.js"<br />    <br />    const currentDate = dateHelper.currentDate()<br />    const formattedDate = dateHelper.formatDate('2024-01-15', 'DD/MM/YYYY')
  </div>
  <h2 class="h2">Structure</h2>
  <p>
    Chaque helper suit une structure commune pour faciliter la compréhension et la maintenance :
  </p>
  <div class="div-code">
    date-helper.js<br />    export const dateHelper = {<br />    &emsp;parseDate: (date_string, format) => { ... },<br />    &emsp;formatDate: (date_string, format) => { ... },<br />    &emsp;// autres méthodes...<br />    }
  </div>
  <p>
    Les helpers exportent toujours un objet contenant les différentes fonctions utilitaires disponibles.
  </p>
</template>
