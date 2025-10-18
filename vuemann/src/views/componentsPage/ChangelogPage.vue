<script setup>
import CodeHtml from "@brugmann/vuemann/src/components/codeHtml/CodeHtmlComponent.vue"
import ChangelogComponent from "@brugmann/vuemann/src/components/changelog/ChangelogComponent.vue"
import ChangelogSectionComponent from "@brugmann/vuemann/src/components/changelog/ChangelogSectionComponent.vue"
</script>

<template>
  <h1 class="h1">Component Changelog</h1>
  <p class="my-10">
    Le composant Changelog permet d'afficher de manière organisée les modifications apportées à votre application. 
    Il comprend un système de filtrage par catégorie et une présentation visuelle claire des changements.
  </p>
  
  <h2 class="h2">Composants</h2>
  <p>
    Le système de changelog est composé de deux composants principaux :
  </p>
  <ul class="list ml-25">
    <li><strong>ChangelogComponent</strong> : Le conteneur principal avec les filtres et la navigation</li>
    <li><strong>ChangelogSectionComponent</strong> : Une section individuelle pour chaque version</li>
  </ul>

  <h2 class="h2">ChangelogComponent - Propriétés</h2>
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
        <td>defaultLink</td>
        <td>String</td>
        <td>-</td>
        <td>'home'</td>
        <td>Nom de la route vers laquelle rediriger si l'historique est vide</td>
      </tr>
      <tr>
        <td>title</td>
        <td>String</td>
        <td>-</td>
        <td>'changelog.title'</td>
        <td>Clé de traduction pour le titre de la page</td>
      </tr>
      <tr>
        <td>description</td>
        <td>String</td>
        <td>-</td>
        <td>'changelog.description'</td>
        <td>Clé de traduction pour la description de la page</td>
      </tr>
    </tbody>
  </table>

  <h2 class="h2">ChangelogSectionComponent - Propriétés</h2>
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
        <td>version</td>
        <td>String</td>
        <td>oui</td>
        <td>-</td>
        <td>Numéro de version (ex: "1.2.0")</td>
      </tr>
      <tr>
        <td>date</td>
        <td>String</td>
        <td>oui</td>
        <td>-</td>
        <td>Date de la version (ex: "2024-01-15")</td>
      </tr>
      <tr>
        <td>features</td>
        <td>Array</td>
        <td>-</td>
        <td>[]</td>
        <td>Liste des nouvelles fonctionnalités</td>
      </tr>
      <tr>
        <td>bugs</td>
        <td>Array</td>
        <td>-</td>
        <td>[]</td>
        <td>Liste des corrections de bugs</td>
      </tr>
      <tr>
        <td>optimizations</td>
        <td>Array</td>
        <td>-</td>
        <td>[]</td>
        <td>Liste des optimisations</td>
      </tr>
      <tr>
        <td>updates</td>
        <td>Array</td>
        <td>-</td>
        <td>[]</td>
        <td>Liste des mises à jour générales</td>
      </tr>
      <tr>
        <td>critical</td>
        <td>Array</td>
        <td>-</td>
        <td>[]</td>
        <td>Liste des mises à jour critiques (affichées en rouge)</td>
      </tr>
    </tbody>
  </table>

  <h2 class="h2">Catégories disponibles</h2>
  <p>Le système de filtrage supporte les catégories suivantes :</p>
  <ul class="list ml-25">
    <li><strong>🚀 Nouvelles fonctionnalités</strong> : Nouvelles capacités ajoutées</li>
    <li><strong>🐛 Corrections de bugs</strong> : Problèmes résolus</li>
    <li><strong>💡 Optimisations</strong> : Améliorations de performance</li>
    <li><strong>🔄 Mises à jour</strong> : Modifications générales</li>
    <li><strong>⚠️ Critique</strong> : Changements majeurs nécessitant une attention particulière</li>
  </ul>

  <h2 class="h2">Exemple d'utilisation</h2>
  <ChangelogComponent>
    <ChangelogSectionComponent
      version="1.2.0"
      date="2024-01-15"
      :critical="[
        'Le composant AppComponent gère maintenant l\'authentification au lieu du route',
        'Changement majeur dans l\'architecture d\'authentification'
      ]"
      :features="[
        'Nouveau système de filtrage pour le changelog',
        'Ajout de la catégorie Critique pour les changements majeurs',
        'Amélioration de l\'interface utilisateur'
      ]"
      :bugs="[
        'Correction du problème de redirection après connexion',
        'Résolution du bug d\'affichage sur mobile'
      ]"
      :optimizations="[
        'Réduction du temps de chargement de 30%',
        'Optimisation des requêtes API'
      ]"
      :updates="[
        'Mise à jour des dépendances',
        'Amélioration de la documentation'
      ]"
    />
    
    <ChangelogSectionComponent
      version="1.1.0"
      date="2024-01-01"
      :features="[
        'Ajout du système de changelog',
        'Nouveau composant de navigation'
      ]"
      :bugs="[
        'Correction du problème de validation des formulaires'
      ]"
    />
  </ChangelogComponent>

  <h2 class="h2">Code</h2>
  <CodeHtml>
    <scriptBalise v-pre>
      import ChangelogComponent from "@brugmann/vuemann/src/components/changelog/ChangelogComponent.vue"
      import ChangelogSectionComponent from "@brugmann/vuemann/src/components/changelog/ChangelogSectionComponent.vue"
    </scriptBalise>
    <template v-pre>
      <ChangelogComponent>
        <ChangelogSectionComponent
          version="1.2.0"
          date="2024-01-15"
          :critical="[
            'Le composant AppComponent gère maintenant l\'authentification',
            'Changement majeur dans l\'architecture'
          ]"
          :features="[
            'Nouvelle fonctionnalité',
            'Autre amélioration'
          ]"
          :bugs="[
            'Correction d\'un bug important'
          ]"
          :optimizations="[
            'Optimisation des performances'
          ]"
          :updates="[
            'Mise à jour générale'
          ]"
        />
      </ChangelogComponent>
    </template>
  </CodeHtml>
</template>
