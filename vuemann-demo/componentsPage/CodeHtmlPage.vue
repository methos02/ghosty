<script setup>
import { t } from '@brugmann/vuemann/src/shortcuts/services-shortcut.js'
import CodeHtml from '@brugmann/vuemann/src/components/codeHtml/CodeHtmlComponent.vue'
</script>

<template>
  <h1 class="h1">Component Balise Code Html</h1>
  <p class="my-10">
    Ce component permet d'afficher du code Html sans que ce dernier ne soit interprété. Il offre
    aussi la possibilité de copier le code pour le réutiliser plus facilement.
  </p>
  <p class="color-danger d-flex g-10 a-center">
    <i class="fa-solid fa-triangle-exclamation"></i>
    <span>Le code doit être du HTML correcte.</span>
    <i class="fa-solid fa-triangle-exclamation"></i>
  </p>

  <h2 class="h2">Dépendances</h2>
  <p>Ce composant utilise :</p>
  <ul>
    <li>
      <span class="badge-code">useClipboard</span> (@vueuse/core) - Gestion de la copie dans le
      presse-papiers
    </li>
    <li>
      <span class="badge-code">codeHtml</span> - Fonctions de conversion et formatage des VNodes en
      HTML
    </li>
    <li>
      <span class="badge-code">t()</span> - Service de traduction pour le texte du bouton de copie
    </li>
    <li><span class="badge-code">useSlots</span> - Récupération du contenu du slot par défaut</li>
  </ul>

  <h2 class="h2">Slots</h2>
  <table class="t-default mb-15 w-100">
    <thead>
      <tr>
        <th>Nom</th>
        <th>Description</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>default</td>
        <td>
          Contenu HTML à afficher et formatter. Doit être du HTML valide. Utiliser
          <span class="badge-code">v-pre</span> pour éviter les avertissements console sur les
          balises non-natives.
        </td>
      </tr>
    </tbody>
  </table>

  <h2 class="h2">Balise non-native</h2>
  <p class="mb-10">
    Pour éviter d'avoir un avertissement dans la console, vous devez ajouter l'attribut
    <span class="badge-code">v-pre</span> a cette balise.<br />
    Si plusieurs balises non-natives sont imbriquées, l'attribut ne doit être rajouter que dans la
    balise parente.
  </p>
  <p class="color-danger d-flex g-10 a-center">
    <i class="fa-solid fa-triangle-exclamation"></i>
    <span>
      Les balise scripte et img ne peut être utiliser dans ce composant. C'est pour cela que dans
      l'exemple ci-dessous elles ont été remplacées par scriptBalise et ImgBalise
    </span>
    <i class="fa-solid fa-triangle-exclamation"></i>
  </p>

  <h2 class="h2">Fonctionnalités</h2>

  <h3 class="h3"><i class="fa-solid fa-diamond mr-5"></i>Conversion VNode vers HTML</h3>
  <p>
    Le composant utilise la fonction <span class="badge-code">stringifyVNode</span> pour convertir
    les VNodes Vue en chaînes HTML :
  </p>
  <ul>
    <li>
      <strong>Récupération du slot</strong> : Utilise
      <span class="badge-code">useSlots()</span> pour accéder au contenu du slot par défaut
    </li>
    <li>
      <strong>Traitement récursif</strong> : Parcourt tous les VNodes enfants et reconstruit la
      structure HTML
    </li>
    <li>
      <strong>Gestion des symboles</strong> : Les VNodes de type symbol (fragments) retournent
      directement leurs enfants
    </li>
    <li>
      <strong>Reconstruction des balises</strong> : Génère les balises ouvrantes et fermantes avec
      leurs attributs
    </li>
  </ul>

  <h3 class="h3"><i class="fa-solid fa-diamond mr-5"></i>Formatage automatique</h3>
  <p>Le code HTML est automatiquement formaté pour une meilleure lisibilité :</p>
  <ul>
    <li>
      <strong>Indentation</strong> : Utilise 2 espaces par niveau d'imbrication (DEFAULT_SPACE = 2)
    </li>
    <li>
      <strong>Balises auto-fermantes</strong> : Détecte les balises auto-fermantes (img, input, br,
      hr, meta, link) et les composants Vue en majuscule sans enfants
    </li>
    <li>
      <strong>Formatage des props</strong> : Ajoute un retour à ligne entre chaque prop pour les
      balises auto-fermantes
    </li>
    <li>
      <strong>Script spécial</strong> : Le contenu de
      <span class="badge-code">scriptBalise</span> bénéficie d'un formatage JavaScript (ajout de
      retours à ligne après les points-virgules)
    </li>
  </ul>

  <h3 class="h3"><i class="fa-solid fa-diamond mr-5"></i>Copie dans le presse-papiers</h3>
  <p>
    Le composant intègre un bouton de copie utilisant
    <span class="badge-code">useClipboard</span> de @vueuse/core :
  </p>
  <ul>
    <li>
      <strong>Support automatique</strong> : Le bouton n'est affiché que si
      <span class="badge-code">isSupported</span> est true (dépend du navigateur)
    </li>
    <li>
      <strong>Feedback visuel</strong> : Le texte change en "{{ t('code_html.copied') }}" après
      copie réussie
    </li>
    <li>
      <strong>État réactif</strong> : La variable <span class="badge-code">copied</span> indique si
      la copie a été effectuée
    </li>
    <li>
      <strong>Position absolue</strong> : Bouton positionné en haut à droite du conteneur (inset:
      20px 20px auto auto)
    </li>
  </ul>

  <h3 class="h3"><i class="fa-solid fa-diamond mr-5"></i>Balises personnalisées</h3>
  <p>
    Pour éviter les conflits avec les balises natives, le composant utilise des balises de
    remplacement :
  </p>
  <ul>
    <li>
      <strong>scriptBalise</strong> : Remplace <span class="badge-code">&lt;script&gt;</span> pour
      éviter l'exécution du code
    </li>
    <li>
      <strong>ImgBalise</strong> : Remplace <span class="badge-code">&lt;img&gt;</span> pour éviter
      le chargement d'images
    </li>
    <li>
      <strong>Formatage scriptBalise</strong> : Le contenu des balises scriptBalise bénéficie d'un
      formatage JavaScript automatique
    </li>
    <li>
      <strong>Balises auto-fermantes</strong> : Les composants Vue en majuscule sans enfants sont
      automatiquement détectés comme auto-fermants
    </li>
  </ul>

  <h3 class="h3"><i class="fa-solid fa-diamond mr-5"></i>Gestion des attributs</h3>
  <p>Le composant gère intelligemment les différents types d'attributs :</p>
  <ul>
    <li>
      <strong>Attributs simples</strong> : Convertis en <span class="badge-code">key="value"</span>
    </li>
    <li>
      <strong>Attributs booléens</strong> : Si la valeur est une chaîne vide, seule la clé est
      affichée (ex: <span class="badge-code">disabled</span>)
    </li>
    <li>
      <strong>Attributs objets</strong> : Les objets (comme style) sont convertis en
      <span class="badge-code">key="property:value; property:value;"</span>
    </li>
    <li>
      <strong>Formatage multi-lignes</strong> : Les attributs des balises auto-fermantes sont
      affichés sur des lignes séparées pour meilleure lisibilité
    </li>
  </ul>

  <h3 class="h3"><i class="fa-solid fa-diamond mr-5"></i>Affichage avec pre</h3>
  <p>
    Le code formaté est affiché dans une balise <span class="badge-code">&lt;pre&gt;</span> avec
    v-text :
  </p>
  <ul>
    <li>
      <strong>Police monospace</strong> : Utilise "Courier New", Courier, monospace pour une
      meilleure lisibilité du code
    </li>
    <li><strong>Défilement horizontal</strong> : overflow-x: auto pour les lignes longues</li>
    <li><strong>Taille de police</strong> : 14px pour un bon équilibre lisibilité/densité</li>
    <li><strong>Fond clair</strong> : background: #f8f9fa pour contraster avec le texte</li>
  </ul>

  <h2 class="h2">Exemple d'utilisation</h2>
  <CodeHtml class="my-15">
    <scriptBalise v-pre>
      import CodeHtml from "@brugmann/vuemann/src/components/codeHtml/CodeHtmlComponent.vue"
    </scriptBalise>
    <template v-pre>
      <ImgBalise src="..." />
      <CodeHtml> Exemple de code HTML </CodeHtml>
    </template>
  </CodeHtml>
</template>
