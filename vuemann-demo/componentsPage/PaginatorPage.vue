<script setup>
import { ref } from 'vue'
import Paginator from '@brugmann/vuemann/src/components/PaginatorComponent.vue'
import CodeHtml from '@brugmann/vuemann/src/components/codeHtml/CodeHtmlComponent.vue'

const paginator = ref({
  page: 1,
  size: 20,
  total: 2000,
})

const updatePaginator = async page => {
  const DELAY_MS = 500
  await new Promise(resolve => setTimeout(resolve, DELAY_MS))
  paginator.value.page = page
}

const users = ref([])
const pageLoad = ref(0)
const addData = async () => {
  const DELAY_MS = 30
  await new Promise(resolve => setTimeout(resolve, DELAY_MS))

  const USER_COUNT_BUFFER = 10
  const maxCount = users.value.length + USER_COUNT_BUFFER
  for (let index = users.value.length; index <= maxCount; index++) {
    users.value.push(`user ${index}`)
  }

  pageLoad.value++
  paginator.value.page = pageLoad.value
}
</script>

<template>
  <h1 class="h1">Component Paginator</h1>
  <p>
    Ce component permet d'utiliser un paginator pouvant prendre 4 type différents: classique,
    load-more, range et infinite.
  </p>

  <h2 class="h2">Dépendances</h2>
  <p>Ce composant utilise :</p>
  <ul>
    <li>
      <span class="badge-code">PaginatorClassicComponent</span> - Paginator numéroté avec pages
      cliquables
    </li>
    <li>
      <span class="badge-code">PaginatorLoadMoreComponent</span> - Bouton "Charger plus" pour
      pagination incrémentale
    </li>
    <li>
      <span class="badge-code">PaginatorRangeComponent</span> - Affichage de plage d'éléments (ex:
      "1-20 sur 100")
    </li>
    <li>
      <span class="badge-code">PaginatorInfiniteComponent</span> - Scroll infini avec détection
      automatique
    </li>
    <li>
      <span class="badge-code">paginatorHelper</span> - Helper pour calculer le nombre total de
      pages (calculTotalPage)
    </li>
    <li>
      <span class="badge-code">Paginator (deprecated)</span> - Ancien composant pour
      rétrocompatibilité avec params.skip
    </li>
  </ul>

  <h2 class="h2">Slots</h2>
  <table class="t-default mb-15 w-100">
    <thead>
      <tr>
        <th>Nom</th>
        <th>Description</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>default</td>
        <td>
          Contenu à afficher pour type="infinite". Doit contenir un conteneur scrollable avec la
          liste des éléments.
        </td>
      </tr>
    </tbody>
  </table>

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
        <td>type</td>
        <td>String</td>
        <td>-</td>
        <td>classic</td>
        <td>Type de paginator à afficher.</td>
      </tr>
      <tr>
        <td>cb</td>
        <td>Function</td>
        <td>oui</td>
        <td>-</td>
        <td>Fonction à appeler lors d'un changement de page.</td>
      </tr>
      <tr>
        <td>params</td>
        <td>Array</td>
        <td>-</td>
        <td>[]</td>
        <td>Paramètres à passer à la fonction de callback.</td>
      </tr>
    </tbody>
  </table>

  <h2 class="h2">Fonctionnalités</h2>

  <h3 class="h3"><i class="fa-solid fa-diamond mr-5"></i>Quatre types de paginator</h3>
  <p>Le composant supporte quatre types de pagination différents selon les besoins :</p>
  <ul>
    <li>
      <strong>type="classic" (défaut)</strong> : Pagination numérotée classique avec boutons de
      pages, navigation précédent/suivant
    </li>
    <li>
      <strong>type="load-more"</strong> : Bouton "Charger plus" qui incrémente la page et charge les
      données suivantes
    </li>
    <li>
      <strong>type="range"</strong> : Affichage de plage d'éléments (ex: "Affichage de 1 à 20 sur
      100 éléments")
    </li>
    <li>
      <strong>type="infinite"</strong> : Scroll infini avec détection automatique du bas du
      conteneur, utilise un slot pour le contenu
    </li>
  </ul>

  <h3 class="h3"><i class="fa-solid fa-diamond mr-5"></i>Gestion automatique de l'affichage</h3>
  <p>Le composant détermine automatiquement s'il doit afficher la pagination :</p>
  <ul>
    <li>
      <strong>calculTotalPage()</strong> : Fonction du
      <span class="badge-code">paginatorHelper</span> qui calcule le nombre total de pages (total /
      size)
    </li>
    <li>
      <strong>Condition d'affichage</strong> : La pagination n'est rendue que si
      <span class="badge-code">calculTotalPage(params.total, params.size) > 1</span>
    </li>
    <li>
      <strong>Masquage automatique</strong> : Si le total d'éléments tient sur une seule page,
      aucune pagination n'est affichée
    </li>
    <li>
      <strong>Validation params</strong> : Vérifie que
      <span class="badge-code">params.size !== undefined</span> avant de calculer
    </li>
  </ul>

  <h3 class="h3"><i class="fa-solid fa-diamond mr-5"></i>Event handling unifié</h3>
  <p>Le composant gère les événements de pagination de manière unifiée :</p>
  <ul>
    <li>
      <strong>handlePageClick()</strong> : Méthode async qui reçoit
      <span class="badge-code">{ page, size }</span> et appelle
      <span class="badge-code">props.cb(page, size)</span>
    </li>
    <li>
      <strong>Événements custom</strong> : Les composants enfants émettent
      <span class="badge-code">@p-classic</span>, <span class="badge-code">@p-loadmore</span>,
      <span class="badge-code">@p-range</span>
    </li>
    <li>
      <strong>Passthrough pour infinite</strong> : Le type infinite passe directement la prop
      <span class="badge-code">cb</span> au PaginatorInfiniteComponent
    </li>
    <li>
      <strong>Async support</strong> : handlePageClick est async pour supporter les callbacks
      asynchrones
    </li>
    <li>
      <strong>Paramètres du callback</strong> : Le callback reçoit (page, size) pour tous les types
      sauf infinite
    </li>
  </ul>

  <h3 class="h3"><i class="fa-solid fa-diamond mr-5"></i>Slot pour infinite scroll</h3>
  <p>Le type infinite utilise un slot pour afficher le contenu scrollable :</p>
  <ul>
    <li>
      <strong>Default slot</strong> : Reçoit le contenu à afficher dans le conteneur scrollable
    </li>
    <li>
      <strong>Passthrough</strong> : Le slot est passé directement au
      <span class="badge-code">PaginatorInfiniteComponent</span>
    </li>
    <li>
      <strong>Container obligatoire</strong> : Le slot doit contenir un div avec une hauteur fixe
      pour activer le scroll
    </li>
    <li>
      <strong>Détection automatique</strong> : Le PaginatorInfiniteComponent détecte automatiquement
      quand le bas du conteneur est atteint
    </li>
  </ul>

  <h2 class="h2">Code</h2>
  <CodeHtml>
    <scriptBalise v-pre>
      import Paginator from "@brugmann/vuemann/src/components/PaginatorComponent.vue"; const
      paginator = ref({page: 1, size: 20, total: 2000}) const updatePaginator = page => {
      paginator.value.page = page }
    </scriptBalise>
    <template v-pre>
      <Paginator
        :params="paginator"
        :cb="updatePaginator"
      />
      <Paginator
        :type="'load-more'"
        :params="paginator"
        :cb="updatePaginator"
      />
      <Paginator
        :type="'range'"
        :params="paginator"
        :cb="updatePaginator"
      />
      <Paginator
        :type="'infinite'"
        :params="paginator"
        :cb="updatePaginator"
      />
    </template>
  </CodeHtml>
  <h2 class="h2">Exemple</h2>
  <h3 class="h3 text-center">Paginateur classique</h3>
  <Paginator
    :params="paginator"
    :cb="updatePaginator"
  />
  <h3 class="h3 text-center">Paginateur Load More</h3>
  <Paginator
    :type="'load-more'"
    :params="paginator"
    :cb="updatePaginator"
  />
  <h3 class="h3 text-center">Paginateur Range</h3>
  <Paginator
    :type="'range'"
    :params="paginator"
    :cb="updatePaginator"
  />
  <h3 class="h3 text-center">Paginateur infinite</h3>
  <div class="f-center">
    <Paginator
      :type="'infinite'"
      :params="paginator"
      :cb="addData"
    >
      <div class="infinite-container text-center">
        <ul class="f-column g-10 bg-neutral-300">
          <li
            v-for="user in users"
            :key="user"
            class="intinite-user"
          >
            {{ user }}
          </li>
        </ul>
      </div>
    </Paginator>
  </div>
</template>

<style lang="scss">
.paginator-infinite_container {
  width: 250px;
}

.infinite {
  &-container {
    height: 250px;
    background-color: var(--neutral-300);
  }
}
</style>
