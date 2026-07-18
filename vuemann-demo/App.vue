<script setup>
import Breadcrumb from '@brugmann/vuemann/src/components/breadcrumb/BreadcrumbComponent.vue'
import Header from '@brugmann/vuemann/src/components/HeaderComponent.vue'
import App from '@brugmann/vuemann/src/services/utils/views/AppComponent.vue'
</script>

<template>
  <div class="container-body | f-column">
    <Header />
    <App>
      <div class="container-merged">
        <Breadcrumb />
        <div class="f-column g-15">
          <router-view />
        </div>
      </div>
    </App>
  </div>
</template>

<style lang="scss">
.container-body {
  min-height: 100vh;
}
</style>
