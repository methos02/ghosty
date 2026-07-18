<template>
  <h1 class="h1">Inputs</h1>
  <p>
    Vuemann met à votre disposition plusieurs types d'inputs pour vos formulaires. Chaque composant
    est documenté individuellement avec ses propriétés, exemples et code.
  </p>

  <h2 class="h2">Liste des inputs disponibles</h2>
  <ul class="list ml-25">
    <li>
      <router-link
        :to="{ name: 'services.form.inputs.input' }"
        class="link-underline"
        >Input</router-link
      >
      - Champ de saisie texte classique (text, email, password, number, etc.)
    </li>
    <li>
      <router-link
        :to="{ name: 'services.form.inputs.select' }"
        class="link-underline"
        >Select</router-link
      >
      - Liste déroulante avec recherche intégrée
    </li>
    <li>
      <router-link
        :to="{ name: 'services.form.inputs.textarea' }"
        class="link-underline"
        >Textarea</router-link
      >
      - Zone de texte multiligne
    </li>
    <li>
      <router-link
        :to="{ name: 'services.form.inputs.input-search' }"
        class="link-underline"
        >Input Search</router-link
      >
      - Champ de recherche avec debounce et clear button
    </li>
    <li>
      <router-link
        :to="{ name: 'services.form.inputs.switch' }"
        class="link-underline"
        >Switch</router-link
      >
      - Interrupteur on/off (toggle)
    </li>
    <li>
      <router-link
        :to="{ name: 'services.form.inputs.input-date' }"
        class="link-underline"
        >Input Date</router-link
      >
      - Sélecteur de date avec calendrier
    </li>
  </ul>

  <h2 class="h2">Caractéristiques communes</h2>
  <p>Tous les composants d'input Vuemann partagent des fonctionnalités communes :</p>
  <ul class="list ml-25">
    <li>
      <strong>Intégration avec le service Form</strong> - Validation automatique via FormRequest
    </li>
    <li>
      <strong>Affichage des erreurs</strong> - Utilisation de
      <span class="badge-code">ErrorFormComponent</span> pour afficher les messages d'erreur
    </li>
    <li><strong>Support de v-model</strong> - Liaison bidirectionnelle des données</li>
    <li>
      <strong>Labels et placeholders</strong> - Configuration flexible des labels et placeholders
    </li>
    <li><strong>États disabled et readonly</strong> - Gestion des états d'interaction</li>
    <li>
      <strong>Classes SCSS personnalisables</strong> - Utilisation des classes utilitaires Vuemann
    </li>
    <li><strong>Support des traductions</strong> - Clés de traduction via le service locale</li>
  </ul>

  <h2 class="h2">Validation des formulaires</h2>
  <p>
    Les inputs Vuemann sont conçus pour fonctionner avec le système de validation de formulaires.
    Pour plus d'informations sur la validation, consultez la
    <router-link
      :to="{ name: 'services.form' }"
      class="link-underline"
      >documentation du service Form</router-link
    >
    et la page
    <router-link
      :to="{ name: 'services.form.defaultTests' }"
      class="link-underline"
      >Tests de validation</router-link
    >.
  </p>

  <h2 class="h2">Affichage des erreurs</h2>
  <p>
    Le composant <span class="badge-code">ErrorFormComponent</span> est utilisé pour afficher les
    messages d'erreur de validation. Il s'intègre automatiquement avec tous les inputs.
  </p>
  <div class="div-code">
    import ErrorFormComponent from
    "@brugmann/vuemann/src/services/form/views/ErrorFormComponent.vue"<br /><br />
    &lt;ErrorFormComponent name="email" /&gt;<br />
    &lt;ErrorFormComponent name="global_tests" /&gt;
  </div>
  <p>
    Le composant accepte une prop <span class="badge-code">name</span> correspondant au nom du champ
    dans le FormRequest ou à <span class="badge-code">global_tests</span> pour les erreurs globales.
  </p>
</template>
