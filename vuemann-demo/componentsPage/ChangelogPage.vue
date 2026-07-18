<script setup>
import CodeHtml from '@brugmann/vuemann/src/components/codeHtml/CodeHtmlComponent.vue'
import ChangelogComponent from '@brugmann/vuemann/src/components/changelog/ChangelogComponent.vue'
import ChangelogSectionComponent from '@brugmann/vuemann/src/components/changelog/ChangelogSectionComponent.vue'
</script>

<template>
  <h1 class="h1">Component Changelog</h1>
  <p class="my-10">
    Le composant Changelog permet d'afficher de manière organisée les modifications apportées à
    votre application. Il comprend un système de filtrage par catégorie et une présentation visuelle
    claire des changements.
  </p>

  <h2 class="h2">Composants</h2>
  <p>Le système de changelog est composé de deux composants principaux :</p>
  <ul class="list ml-25">
    <li>
      <strong>ChangelogComponent</strong> : Le conteneur principal avec les filtres et la navigation
    </li>
    <li>
      <strong>ChangelogSectionComponent</strong> : Une section individuelle pour chaque version
    </li>
  </ul>

  <h2 class="h2">ChangelogComponent - Dépendances</h2>
  <p>Ce composant utilise :</p>
  <ul>
    <li>
      <span class="badge-code">useChangelogStore</span> - Gestion du filtre actif partagé entre
      toutes les sections
    </li>
    <li>
      <span class="badge-code">t()</span> - Service de traduction pour les textes du composant
    </li>
    <li>
      <span class="badge-code">router</span> - Navigation (méthode goBack pour retourner à la page
      précédente)
    </li>
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
        <td>redirectLink</td>
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

  <h2 class="h2">ChangelogSectionComponent - Dépendances</h2>
  <p>Ce composant utilise :</p>
  <ul>
    <li>
      <span class="badge-code">useChangelogStore</span> - Lecture du filtre actif et enregistrement
      des types d'items disponibles
    </li>
    <li>
      <span class="badge-code">onMounted</span> - Enregistrement automatique des types d'items
      présents dans la section au montage du composant
    </li>
  </ul>

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

  <h2 class="h2">Fonctionnalités</h2>

  <h3 class="h3"><i class="fa-solid fa-diamond mr-5"></i>Système de filtrage</h3>
  <p>Le ChangelogComponent fournit un système de filtrage complet avec 6 catégories :</p>
  <ul>
    <li>
      <strong>Tout afficher</strong> : Affiche toutes les sections de toutes les catégories (filtre
      par défaut)
    </li>
    <li>
      <strong>🚀 Nouvelles fonctionnalités</strong> : Affiche uniquement les sections contenant des
      nouvelles fonctionnalités
    </li>
    <li>
      <strong>🐛 Corrections de bugs</strong> : Affiche uniquement les sections contenant des
      corrections de bugs
    </li>
    <li>
      <strong>💡 Optimisations</strong> : Affiche uniquement les sections contenant des
      optimisations
    </li>
    <li>
      <strong>🔄 Mises à jour</strong> : Affiche uniquement les sections contenant des mises à jour
      générales
    </li>
    <li>
      <strong>⚠️ Critique</strong> : Affiche uniquement les sections contenant des changements
      critiques
    </li>
  </ul>
  <p>
    Le filtre actif est géré par le <span class="badge-code">ChangelogStore</span> et est partagé
    entre toutes les sections.
  </p>

  <h3 class="h3">
    <i class="fa-solid fa-diamond mr-5"></i>ChangelogStore - Gestion d'état centralisée
  </h3>
  <p>Le <span class="badge-code">useChangelogStore</span> est un composable global qui gère :</p>
  <ul>
    <li><strong>selectedFilter</strong> : Le filtre actuellement actif (ref réactive)</li>
    <li>
      <strong>availableItemTypes</strong> : Set des types d'items présents dans le changelog
      (auto-détecté)
    </li>
    <li><strong>setFilter(filter)</strong> : Change le filtre actif</li>
    <li><strong>registerItemType(type)</strong> : Enregistre un type d'item comme disponible</li>
    <li><strong>clearItemTypes()</strong> : Réinitialise la liste des types disponibles</li>
  </ul>
  <p>
    Le store est automatiquement réinitialisé quand le composant est démonté pour éviter les états
    résiduels.
  </p>

  <h3 class="h3">
    <i class="fa-solid fa-diamond mr-5"></i>Enregistrement automatique des types d'items
  </h3>
  <p>
    Chaque <span class="badge-code">ChangelogSectionComponent</span> enregistre automatiquement les
    types d'items qu'elle contient dans son <span class="badge-code">onMounted</span> :
  </p>
  <ul>
    <li>
      Si la prop <span class="badge-code">features</span> contient des éléments, le type 'features'
      est enregistré
    </li>
    <li>
      Si la prop <span class="badge-code">bugs</span> contient des éléments, le type 'bugs' est
      enregistré
    </li>
    <li>
      Si la prop <span class="badge-code">optimizations</span> contient des éléments, le type
      'optimizations' est enregistré
    </li>
    <li>
      Si la prop <span class="badge-code">updates</span> contient des éléments, le type 'updates'
      est enregistré
    </li>
    <li>
      Si la prop <span class="badge-code">critical</span> contient des éléments, le type 'critical'
      est enregistré
    </li>
  </ul>
  <p>
    Cela permet au ChangelogComponent de n'afficher que les boutons de filtre pour les catégories
    qui contiennent réellement des items.
  </p>

  <h3 class="h3"><i class="fa-solid fa-diamond mr-5"></i>Affichage conditionnel des sections</h3>
  <p>
    Chaque <span class="badge-code">ChangelogSectionComponent</span> utilise une propriété computed
    <span class="badge-code">shouldShowSection</span> pour déterminer si elle doit être affichée :
  </p>
  <ul>
    <li>
      Si le filtre est <span class="badge-code">'all'</span> : La section est toujours affichée
    </li>
    <li>
      Sinon : La section est affichée uniquement si elle contient des items du type correspondant au
      filtre actif
    </li>
  </ul>
  <p>
    Les sections individuelles (features, bugs, etc.) à l'intérieur d'une ChangelogSectionComponent
    sont également affichées conditionnellement en fonction du filtre actif.
  </p>

  <h3 class="h3"><i class="fa-solid fa-diamond mr-5"></i>Navigation avec goBack()</h3>
  <p>
    Le ChangelogComponent fournit un bouton "Retour" qui utilise la méthode
    <span class="badge-code">goBack()</span> :
  </p>
  <ul>
    <li>
      Si l'historique de navigation contient au moins 2 entrées : Retour à la page précédente via
      <span class="badge-code">router.back()</span>
    </li>
    <li>
      Sinon : Redirection vers la route spécifiée dans la prop
      <span class="badge-code">redirectLink</span> (par défaut 'home')
    </li>
  </ul>

  <h3 class="h3"><i class="fa-solid fa-diamond mr-5"></i>Styles visuels des catégories</h3>
  <p>Chaque catégorie possède un style visuel distinct :</p>
  <ul>
    <li><strong>Nouvelles fonctionnalités</strong> : Icône fusée 🚀, couleur verte</li>
    <li><strong>Corrections de bugs</strong> : Icône bug 🐛, couleur orange</li>
    <li><strong>Optimisations</strong> : Icône ampoule 💡, couleur bleue</li>
    <li><strong>Mises à jour</strong> : Icône rotation 🔄, couleur neutre</li>
    <li><strong>Critique</strong> : Icône avertissement ⚠️, couleur rouge avec badge "CRITIQUE"</li>
  </ul>

  <h2 class="h2">Exemple d'utilisation</h2>
  <ChangelogComponent>
    <ChangelogSectionComponent
      version="1.2.0"
      date="2024-01-15"
      :critical="[
        'Le composant AppComponent gère maintenant l\'authentification au lieu du route',
        'Changement majeur dans l\'architecture d\'authentification',
      ]"
      :features="[
        'Nouveau système de filtrage pour le changelog',
        'Ajout de la catégorie Critique pour les changements majeurs',
        'Amélioration de l\'interface utilisateur',
      ]"
      :bugs="[
        'Correction du problème de redirection après connexion',
        'Résolution du bug d\'affichage sur mobile',
      ]"
      :optimizations="['Réduction du temps de chargement de 30%', 'Optimisation des requêtes API']"
      :updates="['Mise à jour des dépendances', 'Amélioration de la documentation']"
    />

    <ChangelogSectionComponent
      version="1.1.0"
      date="2024-01-01"
      :features="['Ajout du système de changelog', 'Nouveau composant de navigation']"
      :bugs="['Correction du problème de validation des formulaires']"
    />
  </ChangelogComponent>

  <h2 class="h2">Code</h2>
  <CodeHtml>
    <scriptBalise v-pre>
      import ChangelogComponent from
      "@brugmann/vuemann/src/components/changelog/ChangelogComponent.vue" import
      ChangelogSectionComponent from
      "@brugmann/vuemann/src/components/changelog/ChangelogSectionComponent.vue"
    </scriptBalise>
    <template v-pre>
      <ChangelogComponent>
        <ChangelogSectionComponent
          version="1.2.0"
          date="2024-01-15"
          :critical="[
            'Le composant AppComponent gère maintenant l\'authentification',
            'Changement majeur dans l\'architecture',
          ]"
          :features="['Nouvelle fonctionnalité', 'Autre amélioration']"
          :bugs="['Correction d\'un bug important']"
          :optimizations="['Optimisation des performances']"
          :updates="['Mise à jour générale']"
        />
      </ChangelogComponent>
    </template>
  </CodeHtml>
</template>
