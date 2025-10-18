<script setup>
import { ref } from "vue";
import Paginator from "@brugmann/vuemann/src/components/PaginatorComponent.vue";
import CodeHtml from '@brugmann/vuemann/src/components/codeHtml/CodeHtmlComponent.vue'

const paginator = ref({page: 1, size: 20, total: 2000})

const updatePaginator = page => {
  paginator.value.page = page
}

const users = ref([])
const pageLoad = ref(0)
const addData = async () => {
  const DELAY_MS = 30;
  await new Promise((resolve) => setTimeout(resolve, DELAY_MS));
  
  const USER_COUNT_BUFFER = 10;
  const maxCount = users.value.length + USER_COUNT_BUFFER
  for(let index = users.value.length; index <= maxCount; index++) {
    users.value.push(`user ${index}`)
  }

  pageLoad.value++
  paginator.value.page = pageLoad.value
}

</script>

<template>
  <h1 class="h1"> Component Paginator </h1>
  <p>
    Ce component permet d'utiliser un paginator pouvant prendre 4 type différents: classique, load-more, range et infinite.
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
  <h2 class="h2">Code</h2>
  <CodeHtml>
    <scriptBalise v-pre>
      import Paginator from "@brugmann/vuemann/src/components/PaginatorComponent.vue";

      const paginator = ref({page: 1, size: 20, total: 2000})

      const updatePaginator = page => {
        paginator.value.page = page
      }
    </scriptBalise>
    <template v-pre>
      <Paginator :params="paginator" :cb="updatePaginator"/>
      <Paginator :type="'load-more'" :params="paginator" :cb="updatePaginator"/>
      <Paginator :type="'range'" :params="paginator" :cb="updatePaginator"/>
      <Paginator :type="'infinite'" :params="paginator" :cb="updatePaginator"/>
    </template>
  </CodeHtml>
  <h2 class="h2">Exemple</h2>
  <h3 class="h3 text-center">Paginateur classique</h3>
  <Paginator :params="paginator" :cb="updatePaginator"/>
  <h3 class="h3 text-center">Paginateur Load More</h3>
  <Paginator :type="'load-more'" :params="paginator" :cb="updatePaginator"/>
  <h3 class="h3 text-center">Paginateur Range</h3>
  <Paginator :type="'range'" :params="paginator" :cb="updatePaginator"/>
  <h3 class="h3 text-center">Paginateur infinite</h3>
  <div class="f-center">
    <Paginator :type="'infinite'" :params="paginator" :cb="addData">
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
  @use '@brugmann/vuemann/src/assets/scss/variables';
  .paginator-infinite_container {
    width: 250px;
  }

  .infinite {
    &-container {
      height: 250px;
      background-color: variables.$neutral-300;
      
    }
  }
</style>
