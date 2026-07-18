<script setup>
import CodeHtml from '@brugmann/vuemann/src/components/codeHtml/CodeHtmlComponent.vue'
import SkeletonLoader from '@brugmann/vuemann/src/components/SkeletonLoader.vue'
</script>

<template>
  <h1 class="h1">Skeleton Loader</h1>
  <p class="my-10">
    Ce composant affiche un effet de chargement animé (skeleton screen) pour améliorer l'expérience
    utilisateur pendant le chargement de contenu. Il utilise un dégradé animé pour simuler le
    chargement.
  </p>

  <h2 class="h2">Dépendances</h2>
  <p>Ce composant utilise :</p>
  <ul>
    <li><span class="badge-code">defineProps</span> - Définition des props (width, height)</li>
  </ul>

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
        <td>width</td>
        <td>String</td>
        <td>non</td>
        <td>100%</td>
        <td>Largeur du skeleton. Accepte toutes les valeurs CSS valides (px, %, rem, etc.)</td>
      </tr>
      <tr>
        <td>height</td>
        <td>String</td>
        <td>non</td>
        <td>20px</td>
        <td>Hauteur du skeleton. Accepte toutes les valeurs CSS valides (px, %, rem, etc.)</td>
      </tr>
    </tbody>
  </table>

  <h2 class="h2">Fonctionnalités</h2>

  <h3 class="h3"><i class="fa-solid fa-diamond mr-5"></i>Simplicité et performance</h3>
  <p>Le composant est optimisé pour être simple, léger et performant :</p>
  <ul>
    <li>
      <strong>Composant minimal</strong> : Seulement 3 lignes de script setup (defineProps), pas de
      logique complexe
    </li>
    <li>
      <strong>Template simple</strong> : Un seul div avec binding de style, pas de slot ni de
      contenu dynamique
    </li>
    <li>
      <strong>CSS only animation</strong> : L'animation utilise uniquement CSS (pas de JavaScript),
      optimale pour les performances
    </li>
    <li>
      <strong>GPU-accelerated</strong> : Les animations CSS de background-position sont accélérées
      par le GPU du navigateur
    </li>
    <li>
      <strong>Pas de dépendances</strong> : Aucune dépendance externe, utilise uniquement les props
      Vue natives
    </li>
    <li>
      <strong>Réutilisable</strong> : Peut être utilisé autant de fois que nécessaire sans impact
      sur les performances
    </li>
  </ul>

  <h2 class="h2">Exemples</h2>

  <h3 class="h3">Skeleton basique (défaut)</h3>
  <p>Sans props, le skeleton utilise les valeurs par défaut (100% de largeur, 20px de hauteur) :</p>
  <div class="mb-20">
    <SkeletonLoader />
  </div>

  <h3 class="h3">Skeleton pour un titre</h3>
  <p>Simulation d'un titre avec une hauteur plus importante :</p>
  <div class="mb-20">
    <SkeletonLoader
      width="60%"
      height="32px"
    />
  </div>

  <h3 class="h3">Skeleton pour un paragraphe</h3>
  <p>Simulation de plusieurs lignes de texte :</p>
  <div class="d-flex f-column g-10 mb-20">
    <SkeletonLoader
      width="100%"
      height="16px"
    />
    <SkeletonLoader
      width="95%"
      height="16px"
    />
    <SkeletonLoader
      width="98%"
      height="16px"
    />
    <SkeletonLoader
      width="60%"
      height="16px"
    />
  </div>

  <h3 class="h3">Skeleton carré (avatar)</h3>
  <p>Simulation d'un avatar ou d'une image carrée :</p>
  <div class="mb-20">
    <SkeletonLoader
      width="80px"
      height="80px"
    />
  </div>

  <h3 class="h3">Skeleton pour une carte</h3>
  <p>Exemple complet d'une carte avec avatar, titre et description :</p>
  <div
    class="d-flex g-15 p-20 mb-20"
    style="border: 1px solid var(--neutral-300); border-radius: 8px"
  >
    <SkeletonLoader
      width="60px"
      height="60px"
    />
    <div class="d-flex f-column g-10 w-100">
      <SkeletonLoader
        width="40%"
        height="24px"
      />
      <SkeletonLoader
        width="100%"
        height="16px"
      />
      <SkeletonLoader
        width="80%"
        height="16px"
      />
    </div>
  </div>

  <h2 class="h2">Code</h2>
  <CodeHtml>
    <scriptBalise v-pre>
      import SkeletonLoader from "@brugmann/vuemann/src/components/SkeletonLoader.vue"
    </scriptBalise>
    <template v-pre>
      <!-- Skeleton basique -->
      <SkeletonLoader />

      <!-- Skeleton personnalisé -->
      <SkeletonLoader
        width="60%"
        height="32px"
      />

      <!-- Skeleton pour un paragraphe -->
      <div class="d-flex f-column g-10">
        <SkeletonLoader
          width="100%"
          height="16px"
        />
        <SkeletonLoader
          width="95%"
          height="16px"
        />
        <SkeletonLoader
          width="98%"
          height="16px"
        />
        <SkeletonLoader
          width="60%"
          height="16px"
        />
      </div>

      <!-- Skeleton carré -->
      <SkeletonLoader
        width="80px"
        height="80px"
      />
    </template>
  </CodeHtml>

  <h2 class="h2">Cas d'usage</h2>
  <ul class="list ml-25">
    <li>
      <strong>Chargement de contenu</strong> : Afficher un skeleton pendant le chargement de données
      depuis une API
    </li>
    <li><strong>Images</strong> : Remplacer temporairement des images en cours de chargement</li>
    <li>
      <strong>Listes</strong> : Afficher plusieurs skeletons pour simuler une liste en cours de
      chargement
    </li>
    <li>
      <strong>Cartes/Profils</strong> : Combiner plusieurs skeletons pour simuler des composants
      complexes
    </li>
  </ul>

  <h2 class="h2">Bonnes pratiques</h2>
  <ul class="list ml-25">
    <li>
      <strong>Taille appropriée</strong> : Utilisez des dimensions proches du contenu final pour
      éviter les décalages visuels
    </li>
    <li>
      <strong>Nombre d'éléments</strong> : Affichez un nombre raisonnable de skeletons (3-5) plutôt
      que le nombre exact d'éléments
    </li>
    <li>
      <strong>Combinaison</strong> : Combinez plusieurs skeletons pour représenter des structures
      complexes
    </li>
    <li>
      <strong>Remplacement rapide</strong> : Remplacez les skeletons par le contenu réel dès que
      disponible
    </li>
  </ul>
</template>
