<script setup>
    import CodeHtml from "@brugmann/vuemann/src/components/codeHtml/CodeHtmlComponent.vue"
</script>

<template>
  <h1 class="h1"> Couleurs </h1>
  <p>
    Ces classes permettent d'appliquer facilement une couleur. La liste des couleurs disponibles correspond aux variables de couleur
  </p>
  <h2 class="h2">Color</h2>
  <p>
    La structure suivante <span class="badge-code">.color-{color_name}</span> permet de changer la couleur appliquée à un élément.
  </p>
  <h3 class="h3">Nuances de gris</h3>
  <div class="d-flex g-5">
      <i class="fa-solid fa-heart color-neutral-100 fs-2rem"></i>
      <i class="fa-solid fa-heart color-neutral-200 fs-2rem"></i>
      <i class="fa-solid fa-heart color-neutral-300 fs-2rem"></i>
      <i class="fa-solid fa-heart color-neutral-400 fs-2rem"></i>
      <i class="fa-solid fa-heart color-neutral-500 fs-2rem"></i>
      <i class="fa-solid fa-heart color-neutral-600 fs-2rem"></i>
      <i class="fa-solid fa-heart color-neutral-700 fs-2rem"></i> 
      <i class="fa-solid fa-heart color-neutral-800 fs-2rem"></i>
      <i class="fa-solid fa-heart color-neutral-900 fs-2rem"></i>
  </div>
  <CodeHtml>
    <i class="fa-solid fa-heart color-neutral-100"></i>
    <i class="fa-solid fa-heart color-neutral-200"></i>
    <i class="fa-solid fa-heart color-neutral-300"></i>
    <i class="fa-solid fa-heart color-neutral-400"></i>
    <i class="fa-solid fa-heart color-neutral-500"></i>
    <i class="fa-solid fa-heart color-neutral-600"></i>
    <i class="fa-solid fa-heart color-neutral-700"></i>
    <i class="fa-solid fa-heart color-neutral-800"></i>
    <i class="fa-solid fa-heart color-neutral-900"></i>
  </CodeHtml>
  <h3 class="h3">Couleur principale</h3>
  <div class="d-flex g-5">
      <i class="fa-solid fa-heart color-primary-300 fs-2rem"></i>
      <i class="fa-solid fa-heart color-primary-400 fs-2rem"></i>
      <i class="fa-solid fa-heart color-primary fs-2rem"></i>
      <i class="fa-solid fa-heart color-primary-600 fs-2rem"></i>
  </div>
  <CodeHtml>
    <i class="fa-solid fa-heart color-primary-300"></i>
    <i class="fa-solid fa-heart color-primary-400"></i>
    <i class="fa-solid fa-heart color-primary"></i>
    <i class="fa-solid fa-heart color-primary-600"></i>
  </CodeHtml>
  <h3 class="h3">Autre couleur</h3>
  <div class="d-flex g-5">
      <i class="fa-solid fa-heart color-success fs-2rem"></i>
      <i class="fa-solid fa-heart color-danger fs-2rem"></i>
      <i class="fa-solid fa-heart color-warning fs-2rem"></i>
      <i class="fa-solid fa-heart color-info fs-2rem"></i>
      <i class="fa-solid fa-heart color-blue-300 fs-2rem"></i>
      <i class="fa-solid fa-heart color-blue fs-2rem"></i>
      <i class="fa-solid fa-heart color-green-300 fs-2rem"></i>
      <i class="fa-solid fa-heart color-green fs-2rem"></i>
      <i class="fa-solid fa-heart color-yellow fs-2rem"></i>
      <i class="fa-solid fa-heart color-red fs-2rem"></i>
  </div>
  <CodeHtml>
    <i class="fa-solid fa-heart color-success"></i>
    <i class="fa-solid fa-heart color-danger"></i>
    <i class="fa-solid fa-heart color-warning"></i>
    <i class="fa-solid fa-heart color-info"></i>
    <i class="fa-solid fa-heart color-blue-300"></i>
    <i class="fa-solid fa-heart color-blue"></i>
    <i class="fa-solid fa-heart color-green-300"></i>
    <i class="fa-solid fa-heart color-green"></i>
    <i class="fa-solid fa-heart color-yellow"></i>
    <i class="fa-solid fa-heart color-red"></i>
  </CodeHtml>
  <h2 class="h2">Background Color</h2>
  <p>
    La structure suivante <span class="badge-code">.bg-{color_name}</span> permet de changer la couleur du fond d'un élément.
  </p>
  <h3 class="h3">Nuances de gris</h3>
  <div class="d-flex g-5">
    <i class="fa-solid fa-heart py-5 color-neutral-100 bg-neutral-100 fs-2rem"></i>
    <i class="fa-solid fa-heart py-5 color-neutral-100 bg-neutral-200 fs-2rem"></i>
    <i class="fa-solid fa-heart py-5 color-neutral-100 bg-neutral-300 fs-2rem"></i>
    <i class="fa-solid fa-heart py-5 color-neutral-100 bg-neutral-400 fs-2rem"></i>
    <i class="fa-solid fa-heart py-5 color-neutral-100 bg-neutral-500 fs-2rem"></i>
    <i class="fa-solid fa-heart py-5 color-neutral-100 bg-neutral-600 fs-2rem"></i>
    <i class="fa-solid fa-heart py-5 color-neutral-100 bg-neutral-700 fs-2rem"></i>
    <i class="fa-solid fa-heart py-5 color-neutral-100 bg-neutral-800 fs-2rem"></i>
    <i class="fa-solid fa-heart py-5 color-neutral-100 bg-neutral-900 fs-2rem"></i>
  </div>
  <CodeHtml>
    <div class="bg-neutral-100"></div>
    <div class="bg-neutral-200"></div>
    <div class="bg-neutral-300"></div>
    <div class="bg-neutral-400"></div>
    <div class="bg-neutral-500"></div>
    <div class="bg-neutral-600"></div>
    <div class="bg-neutral-700"></div>
    <div class="bg-neutral-800"></div>
    <div class="bg-neutral-900"></div>
  </CodeHtml>
  <h3 class="h3">Couleur principale</h3>
  <div class="d-flex">
    <div class="px-5">
      <i class="fa-solid fa-heart py-5 color-neutral-100 bg-primary-300 fs-2rem"></i>
    </div>
    <div class="px-5">
      <i class="fa-solid fa-heart py-5 color-neutral-100 bg-primary-400 fs-2rem"></i>
    </div>
    <div class="px-5">
      <i class="fa-solid fa-heart py-5 color-neutral-100 bg-primary fs-2rem"></i>
    </div>
    <div class="px-5">
      <i class="fa-solid fa-heart py-5 color-neutral-100 bg-primary-600 fs-2rem"></i>
    </div>
  </div>
  <CodeHtml>
    <div class="bg-primary-300"></div>
    <div class="bg-primary-400"></div>
    <div class="bg-primary"></div>
    <div class="bg-primary-600"></div>
  </CodeHtml>
  <h3 class="h3">Autre couleur</h3>
  <div class="d-flex">
    <div class="px-5">
      <i class="fa-solid fa-heart py-5 color-neutral-100 bg-success fs-2rem"></i>
    </div>
    <div class="px-5">
      <i class="fa-solid fa-heart py-5 color-neutral-100 bg-danger fs-2rem"></i>
    </div>
    <div class="px-5">
      <i class="fa-solid fa-heart py-5 color-neutral-100 bg-warning fs-2rem"></i>
    </div>
    <div class="px-5">
      <i class="fa-solid fa-heart py-5 color-neutral-100 bg-info fs-2rem"></i>
    </div>
    <div class="px-5">
      <i class="fa-solid fa-heart py-5 color-neutral-100 bg-blue-300 fs-2rem"></i>
    </div>
    <div class="px-5">
      <i class="fa-solid fa-heart py-5 color-neutral-100 bg-blue fs-2rem"></i>
    </div>
    <div class="px-5">
      <i class="fa-solid fa-heart py-5 color-neutral-100 bg-green-300 fs-2rem"></i>
    </div>
    <div class="px-5">
      <i class="fa-solid fa-heart py-5 color-neutral-100 bg-green fs-2rem"></i>
    </div>
    <div class="px-5">
      <i class="fa-solid fa-heart py-5 color-neutral-100 bg-yellow fs-2rem"></i>
    </div>
    <div class="px-5">
      <i class="fa-solid fa-heart py-5 color-neutral-100 bg-red fs-2rem"></i>
    </div>
  </div>
  <CodeHtml>
    <div class="bg-success"></div>
    <div class="bg-danger"></div>
    <div class="bg-warning"></div>
    <div class="bg-info"></div>
    <div class="bg-blue-300"></div>
    <div class="bg-blue"></div>
    <div class="bg-green-300"></div>
    <div class="bg-green"></div>
    <div class="bg-yellow"></div>
    <div class="bg-red"></div>
  </CodeHtml>
  <h2 class="h2">Bordure</h2>
  <p>
    La structure suivante <span class="badge-code">.border-{color_name}</span> 
    permet d'appliquer une bordure d'un pixel à un élément.
  </p>
  <h3 class="h3">Nuances de gris</h3>
  <div class="d-flex">
    <div class="px-5">
      <i class="fa-solid fa-heart py-5 color-neutral-100 border-neutral-100 fs-2rem"></i>
    </div>
    <div class="px-5">
      <i class="fa-solid fa-heart py-5 color-neutral-100 border-neutral-200 fs-2rem"></i>
    </div>
    <div class="px-5">
      <i class="fa-solid fa-heart py-5 color-neutral-100 border-neutral-300 fs-2rem"></i>
    </div>
    <div class="px-5">
      <i class="fa-solid fa-heart py-5 color-neutral-100 border-neutral-400 fs-2rem"></i>
    </div>
    <div class="px-5">
      <i class="fa-solid fa-heart py-5 color-neutral-100 border-neutral-500 fs-2rem"></i>
    </div>
    <div class="px-5">
      <i class="fa-solid fa-heart py-5 color-neutral-100 border-neutral-600 fs-2rem"></i>
    </div>
    <div class="px-5">
      <i class="fa-solid fa-heart py-5 color-neutral-100 border-neutral-700 fs-2rem"></i>
    </div>
    <div class="px-5">
      <i class="fa-solid fa-heart py-5 color-neutral-100 border-neutral-800 fs-2rem"></i>
    </div>
    <div class="px-5">
      <i class="fa-solid fa-heart py-5 color-neutral-100 border-neutral-900 fs-2rem"></i>
    </div>
  </div>
  <CodeHtml>
    <div class="border-neutral-100"></div>
    <div class="border-neutral-200"></div>
    <div class="border-neutral-300"></div>
    <div class="border-neutral-400"></div>
    <div class="border-neutral-500"></div>
    <div class="border-neutral-600"></div>
    <div class="border-neutral-700"></div>
    <div class="border-neutral-800"></div>
    <div class="border-neutral-900"></div>
  </CodeHtml>
  <h3 class="h3">Couleur principale</h3>
  <div class="d-flex">
    <div class="px-5">
      <i class="fa-solid fa-heart py-5 color-neutral-100 border-primary-300 fs-2rem"></i>
    </div>
    <div class="px-5">
      <i class="fa-solid fa-heart py-5 color-neutral-100 border-primary-400 fs-2rem"></i>
    </div>
    <div class="px-5">
      <i class="fa-solid fa-heart py-5 color-neutral-100 border-primary fs-2rem"></i>
    </div>
    <div class="px-5">
      <i class="fa-solid fa-heart py-5 color-neutral-100 border-primary-600 fs-2rem"></i>
    </div>
  </div>
  <CodeHtml>
    <div class="border-primary-300"></div>
    <div class="border-primary-400"></div>
    <div class="border-primary"></div>
    <div class="border-primary-600"></div>
  </CodeHtml>
  <h3 class="h3">Autre couleur</h3>
  <div class="d-flex">
    <div class="px-5">
      <i class="fa-solid fa-heart py-5 color-neutral-100 border-success fs-2rem"></i>
    </div>
    <div class="px-5">
      <i class="fa-solid fa-heart py-5 color-neutral-100 border-danger fs-2rem"></i>
    </div>
    <div class="px-5">
      <i class="fa-solid fa-heart py-5 color-neutral-100 border-warning fs-2rem"></i>
    </div>
    <div class="px-5">
      <i class="fa-solid fa-heart py-5 color-neutral-100 border-info fs-2rem"></i>
    </div>
    <div class="px-5">
      <i class="fa-solid fa-heart py-5 color-neutral-100 border-blue-300 fs-2rem"></i>
    </div>
    <div class="px-5">
      <i class="fa-solid fa-heart py-5 color-neutral-100 border-blue fs-2rem"></i>
    </div>
    <div class="px-5">
      <i class="fa-solid fa-heart py-5 color-neutral-100 border-green-300 fs-2rem"></i>
    </div>
    <div class="px-5">
      <i class="fa-solid fa-heart py-5 color-neutral-100 border-green fs-2rem"></i>
    </div>
    <div class="px-5">
      <i class="fa-solid fa-heart py-5 color-neutral-100 border-yellow fs-2rem"></i>
    </div>
    <div class="px-5">
      <i class="fa-solid fa-heart py-5 color-neutral-100 border-red fs-2rem"></i>
    </div>
  </div>
  <CodeHtml>
    <div class="border-success"></div>
    <div class="border-danger"></div>
    <div class="border-warning"></div>
    <div class="border-info"></div>
    <div class="border-blue-300"></div>
    <div class="border-blue"></div>
    <div class="border-green-300"></div>
    <div class="border-green"></div>
    <div class="border-yellow"></div>
    <div class="border-red"></div>
  </CodeHtml>
</template>

<style lang="scss">
 .fa-heart {
  text-shadow: 2px 2px 5px rgba(0, 0, 0, 0.5);
 }
</style>
