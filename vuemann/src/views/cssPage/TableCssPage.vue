<script setup>
  import Code from '@brugmann/vuemann/src/components/codeHtml/CodeHtmlComponent.vue'
</script>

<template>
  <h1 class="h1">Style des éléments "table"</h1>
  <p class="my-15">
    Vuemann intègre plusieurs classes pour les éléments table :
  </p>
  <h2 class="h2">.t-primary</h2>
  <p class="my-15">
    Va colorer le header avec la couleur <span class="badge-code">primary</span> et mettre le texte en blanc.
  </p>
  <table class="t-primary">
    <thead>
          <tr>
            <th>Nom</th>
            <th>Prénom</th>
          </tr>
      </thead>
      <tbody>
          <tr>
            <td data-label="Nom">DOE</td>
            <td data-label="Prénom">John</td>
          </tr>
      </tbody>
  </table>
  <h2 class="h2">.t-space</h2>
  <p class="my-15">
    Permet d'appliquer un padding au <span class="badge-code">td</span> et <span class="badge-code">th</span>
  </p>
  <table class="t-space">
    <thead class="bg-neutral-400">
          <tr>
            <th>Nom</th>
            <th>Prénom</th>
          </tr>
      </thead>
      <tbody>
          <tr>
            <td data-label="Nom">DOE</td>
            <td data-label="Prénom">John</td>
          </tr>
      </tbody>
  </table>
  <h2 class="h2">.t-colored</h2>
  <p class="my-15">
    Permet d'appliquer une couleur de fond grise sur un élément <span class="badge-code">tr</span> sur deux.
  </p>
  <table class="t-colored">
    <thead class="bg-neutral-400">
          <tr>
            <th>Nom</th>
            <th>Prénom</th>
          </tr>
      </thead>
      <tbody>
          <tr>
            <td data-label="Nom">Dupont</td>
            <td data-label="Prénom">Michel</td>
          </tr>
          <tr>
            <td data-label="Nom">Martin</td>
            <td data-label="Prénom">Clémence</td>
          </tr>
      </tbody>
  </table>
  <h2 class="h2">.t-responsive</h2>
  <p class="my-15">
    En rajoutant la class <span class="badge-code">t-responsive</span> dans l'élement parent <span class="badge-code">table</span> et 
    l'attribut <span class="badge-code">data-label</span> dans chacun des éléments <span class="badge-code">td</span>, votre tableau sera 
    responsive.
  </p>
  <table class="t-responsive">
    <thead class="bg-neutral-400">
          <tr>
            <th>Nom</th>
            <th>Prénom</th>
          </tr>
      </thead>
      <tbody>
          <tr>
            <td data-label="Nom">Dupont</td>
            <td data-label="Prénom">Michel</td>
          </tr>
          <tr>
            <td data-label="Nom">Martin</td>
            <td data-label="Prénom">Clémence</td>
          </tr>
      </tbody>
  </table>
  <Code>
    <table class="t-responsive">
      <thead>
            <tr>
              <th>Nom</th>
              <th>Prénom</th>
            </tr>
        </thead>
        <tbody>
            <tr>
              <td data-label="Nom">DOE</td>
              <td data-label="Prénom">John</td>
            </tr>
        </tbody>
    </table>
  </Code>
  <h2 class="h2">.t-default</h2>
  <p class="my-15">
    Permet d'appliquer le style de t-colored, t-primary, t-space et t-responsive en une seule class.
  </p>
  <table class="t-default">
    <thead>
          <tr>
            <th>Nom</th>
            <th>Prénom</th>
          </tr>
      </thead>
      <tbody>
          <tr>
            <td data-label="Nom">Dupont</td>
            <td data-label="Prénom">Michel</td>
          </tr>
          <tr>
            <td data-label="Nom">Martin</td>
            <td data-label="Prénom">Clémence</td>
          </tr>
      </tbody>
  </table>
  <Code>
    <table class="t-default">
      <thead>
            <tr>
              <th>Nom</th>
              <th>Prénom</th>
            </tr>
        </thead>
        <tbody>
            <tr>
              <td data-label="Nom">DOE</td>
              <td data-label="Prénom">John</td>
            </tr>
        </tbody>
    </table>
  </Code>
</template>
