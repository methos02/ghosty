<script setup>
  import Breadcrumb from "@brugmann/vuemann/src/components/breadcrumb/BreadcrumbComponent.vue"
  import Header from '@brugmann/vuemann/src/components/HeaderComponent.vue';
</script>

<template>
  <div class="container-body | f-column">
    <Header title="Vuemann" />
    <div class="container-homepage | container-merged">
      <Breadcrumb />
      <div class="f-column g-15">
        <router-view />
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.container-body {
  min-height: 100vh;
}
</style>
