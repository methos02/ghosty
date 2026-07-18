<script setup>
import DocumentationComponent from '@brugmann/vuemann/src/components/DocumentationComponent.vue'
</script>

<template>
  <DocumentationComponent v-slot="{ cacheBuster }">
    <h1 class="h1">Connexion et déconnexion</h1>

    <p class="paragraph">
      Cette page explique comment se connecter à l'application et comment se déconnecter.
    </p>

    <h2
      id="ecran-de-connexion"
      class="h2"
    >
      Écran de connexion
    </h2>

    <p class="paragraph">
      Lors de votre première visite ou après une déconnexion, l'écran de connexion s'affiche
      automatiquement.
    </p>

    <figure>
      <img
        :src="`/images/vuemann/auth-login.png?v=${cacheBuster}`"
        alt="Écran de connexion"
        class="documentation-screenshot"
      />
      <figcaption class="documentation-caption">Écran de connexion de l'application</figcaption>
    </figure>

    <ol class="documentation-legend">
      <li>
        <span class="documentation-marker">1</span>
        <span>Champ <strong>Nom d'utilisateur</strong> — Saisissez votre identifiant.</span>
      </li>
      <li>
        <span class="documentation-marker">2</span>
        <span>Champ <strong>Mot de passe</strong> — Saisissez votre mot de passe.</span>
      </li>
      <li>
        <span class="documentation-marker">3</span>
        <span>Bouton <strong>Se connecter</strong> — Cliquez pour accéder à l'application.</span>
      </li>
    </ol>

    <h2
      id="deconnexion"
      class="h2"
    >
      Déconnexion
    </h2>

    <p class="paragraph">
      Pour vous déconnecter, utilisez le bouton situé dans le coin supérieur droit de l'application.
    </p>

    <figure>
      <img
        :src="`/images/vuemann/auth-logout.png?v=${cacheBuster}`"
        alt="Bouton de déconnexion dans le header"
        class="documentation-screenshot d-block screenshot-small"
      />
      <figcaption class="documentation-caption">
        Bouton de déconnexion dans l'en-tête de l'application
      </figcaption>
    </figure>

    <ol class="documentation-legend">
      <li>
        <span class="documentation-marker">1</span>
        <span
          >Bouton <strong>Déconnexion</strong> — Cliquez sur l'icône pour vous déconnecter et
          revenir à l'écran de connexion.</span
        >
      </li>
    </ol>
  </DocumentationComponent>
</template>

<style scoped>
.screenshot-small {
  width: auto;
  max-width: 500px;
  margin: 0 auto;
}
</style>
