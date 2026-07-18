<script setup>
import CodeHtml from '@brugmann/vuemann/src/components/codeHtml/CodeHtmlComponent.vue'

const colorGroups = [
  {
    title: 'Primary',
    colors: [
      { name: 'primary', label: 'Primary' },
      { name: 'primary-300', label: 'Primary 300' },
      { name: 'primary-400', label: 'Primary 400' },
      { name: 'primary-600', label: 'Primary 600' },
    ],
  },
  {
    title: 'Statuts',
    colors: [
      { name: 'danger', label: 'Danger' },
      { name: 'danger-400', label: 'Danger 400' },
      { name: 'danger-300', label: 'Danger 300' },
      { name: 'danger-200', label: 'Danger 200' },
      { name: 'success', label: 'Success' },
      { name: 'success-300', label: 'Success 300' },
      { name: 'warning', label: 'Warning' },
      { name: 'warning-300', label: 'Warning 300' },
      { name: 'info', label: 'Info' },
      { name: 'info-300', label: 'Info 300' },
    ],
  },
  {
    title: 'Accents',
    colors: [
      { name: 'blue', label: 'Blue' },
      { name: 'blue-300', label: 'Blue 300' },
      { name: 'green', label: 'Green' },
      { name: 'green-300', label: 'Green 300' },
      { name: 'red', label: 'Red' },
      { name: 'red-300', label: 'Red 300' },
      { name: 'yellow', label: 'Yellow' },
      { name: 'yellow-300', label: 'Yellow 300' },
    ],
  },
]
</script>

<template>
  <h1 class="h1">Buttons</h1>
  <p>
    Classe <span class="badge-code">.btn</span> +
    <span class="badge-code">.btn-{couleur}</span> pour appliquer la couleur. Chaque couleur génère
    automatiquement trois variantes : base, alt et ghost.
  </p>

  <h2 class="h2">Référence visuelle</h2>
  <table class="t-default">
    <thead>
      <tr>
        <th>Couleur</th>
        <th>Base</th>
        <th>Alt</th>
        <th>Ghost</th>
        <th class="icon-col">Icon</th>
      </tr>
    </thead>
    <tbody>
      <template
        v-for="group in colorGroups"
        :key="group.title"
      >
        <tr>
          <td
            colspan="5"
            class="group-label"
          >
            {{ group.title }}
          </td>
        </tr>
        <tr
          v-for="color in group.colors"
          :key="color.name"
        >
          <td>
            <code>.btn-{{ color.name }}</code>
          </td>
          <td>
            <button
              type="button"
              :class="`btn btn-${color.name}`"
            >
              {{ color.label }}
            </button>
          </td>
          <td>
            <button
              type="button"
              :class="`btn btn-${color.name}-alt`"
            >
              {{ color.label }}
            </button>
          </td>
          <td>
            <button
              type="button"
              :class="`btn btn-ghost-${color.name}`"
            >
              {{ color.label }}
            </button>
          </td>
          <td class="icon-col">
            <button
              type="button"
              :class="`btn-icon btn-icon-${color.name}`"
            >
              <i class="fa-solid fa-pen"></i>
            </button>
          </td>
        </tr>
      </template>
    </tbody>
  </table>

  <h2 class="h2">Boutons base</h2>
  <p>
    La classe <span class="badge-code">.btn-{couleur}</span> applique un fond coloré avec texte
    blanc (ou sombre pour les couleurs claires).
  </p>
  <CodeHtml>
    <button
      type="button"
      class="btn btn-primary"
    >
      Primary
    </button>
  </CodeHtml>

  <h2 class="h2">Boutons alternatifs</h2>
  <p>
    La classe <span class="badge-code">.btn-{couleur}-alt</span> donne un fond transparent avec
    bordure colorée. Au survol, le bouton prend la couleur de fond. Utile pour la navigation ou les
    onglets.
  </p>
  <CodeHtml>
    <button
      type="button"
      class="btn btn-primary-alt"
    >
      Primary alt
    </button>
  </CodeHtml>
  <h3 class="h3">État actif</h3>
  <p>La classe <span class="badge-code">.active</span> force l'état survolé.</p>
  <CodeHtml>
    <button
      type="button"
      class="btn btn-primary-alt active"
    >
      Primary alt actif
    </button>
  </CodeHtml>

  <h2 class="h2">Boutons ghost</h2>
  <p>
    La classe <span class="badge-code">.btn-ghost-{couleur}</span> donne un fond neutre (<span
      class="badge-code"
      >--neutral-400</span
    >) qui prend la couleur spécifiée au survol. Discret au repos, expressif au survol.
  </p>
  <CodeHtml>
    <button
      type="button"
      class="btn btn-ghost-primary"
    >
      Ghost primary
    </button>
  </CodeHtml>
  <h3 class="h3">État actif</h3>
  <CodeHtml>
    <button
      type="button"
      class="btn btn-ghost-primary active"
    >
      Ghost primary actif
    </button>
  </CodeHtml>

  <h2 class="h2">Bouton icône</h2>
  <p>
    Combiner <span class="badge-code">.btn-icon</span> avec
    <span class="badge-code">.btn-icon-{couleur}</span> pour gérer couleur, hover et focus.
    L'élément <span class="badge-code">&lt;i&gt;</span> ne porte que la classe d'icône.
  </p>
  <CodeHtml>
    <button
      type="button"
      class="btn-icon btn-icon-primary"
    >
      <i class="fa-regular fa-calendar-days"></i>
    </button>
  </CodeHtml>

  <h2 class="h2">Forcer la couleur au survol</h2>
  <p>
    Le modificateur <span class="badge-code">.btn-{couleur}-active</span> impose uniquement la
    couleur au survol et sur <span class="badge-code">.active</span>, sans toucher au style de base.
    S'utilise en combinaison avec une autre classe de bouton.
  </p>
  <div class="d-flex g-5">
    <button
      type="button"
      class="btn btn-primary btn-danger-active"
    >
      Survol danger
    </button>
  </div>
  <CodeHtml>
    <button
      type="button"
      class="btn btn-primary btn-danger-active"
    >
      Survol danger
    </button>
  </CodeHtml>

  <h2 class="h2">État désactivé</h2>
  <p>
    L'attribut <span class="badge-code">[disabled]</span> applique un fond
    <span class="badge-code">--neutral-500</span> quel que soit la couleur du bouton.
  </p>
  <div class="d-flex g-5">
    <button
      type="button"
      class="btn btn-primary"
      disabled
    >
      Désactivé
    </button>
  </div>
  <CodeHtml>
    <button
      type="button"
      class="btn btn-primary"
      disabled
    >
      Désactivé
    </button>
  </CodeHtml>
</template>

<style scoped>
.group-label {
  background-color: var(--neutral-200) !important;
  font-weight: 600;
  font-size: var(--fs-300);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--neutral-600);
}

.icon-col {
  text-align: center;
}
</style>
