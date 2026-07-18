<script setup>
import CodeHtml from '@brugmann/vuemann/src/components/codeHtml/CodeHtmlComponent.vue'
import Loader from '@brugmann/vuemann/src/components/LoaderComponent.vue'

const DELAY_MS = 1000
const loaderCallback = async () => {
  await new Promise(resolve => setTimeout(resolve, DELAY_MS))
}
</script>

<template>
  <h1 class="h1">Loader</h1>
  <p class="my-10">
    Ce component permet d'afficher un loader le temps qu'une action qui prend du temps se déroute.
  </p>

  <h2 class="h2">Dépendances</h2>
  <p>Ce composant utilise :</p>
  <ul>
    <li><span class="badge-code">ref</span> - Gestion de l'état réactif (button, loading, size)</li>
    <li>
      <span class="badge-code">defineExpose</span> - Expose les méthodes setLoad et runCallback
    </li>
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
          Contenu du bouton. Affiché quand loading=false, remplacé par le loader quand loading=true.
        </td>
      </tr>
    </tbody>
  </table>

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
        <td>type</td>
        <td>String</td>
        <td>-</td>
        <td>bars</td>
        <td>
          Permet de préciser le type de loader que l'on veut. <br />
          Possibilité: bars, icon
        </td>
      </tr>
      <tr>
        <td class="pl-5">cb</td>
        <td>Function</td>
        <td>Si click est absent</td>
        <td>-</td>
        <td class="py-5">Fonction à appeler lorsque l'on appel la méthode runCallback.</td>
      </tr>
      <tr>
        <td class="pl-5">click</td>
        <td>Function</td>
        <td>Si cb est absent</td>
        <td>-</td>
        <td class="py-5">Fonction à appeler lors du clic sur la confirmation.</td>
      </tr>
      <tr>
        <td>params</td>
        <td>Array</td>
        <td>-</td>
        <td>[]</td>
        <td>Paramètres à passer à la fonction de callback.</td>
      </tr>
      <tr>
        <td>infinite</td>
        <td>Boolean</td>
        <td>-</td>
        <td>false</td>
        <td>
          Si true, laissera afficher le loader même si l'action est terminé. Pratique pour les
          rechargements de page ou redirection.
        </td>
      </tr>
      <tr>
        <td>buttonClasses</td>
        <td>String</td>
        <td>-</td>
        <td>
          type bars : btn btn-primary <br />
          type icon : null
        </td>
        <td>Classes du bouton.</td>
      </tr>
      <tr>
        <td>buttonType</td>
        <td>String</td>
        <td>-</td>
        <td>button</td>
        <td>Type du bouton .</td>
      </tr>
    </tbody>
  </table>
  <h3 class="h3">Méthodes</h3>
  <!-- add -->
  <h4 class="h4"><i class="fa-solid fa-diamond mr-5"></i>setLoad</h4>
  <p>Permet d'afficher ou cacher le loader.</p>
  <table class="t-default">
    <thead>
      <tr>
        <th>Nom</th>
        <th>Type</th>
        <th>Required</th>
        <th>Description</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>state</td>
        <td>Boolean</td>
        <th>Required</th>
        <td>True pour afficher et False pour le masquer</td>
      </tr>
    </tbody>
  </table>
  <!-- refresh -->
  <h4 class="h4"><i class="fa-solid fa-diamond mr-5"></i>runCallback</h4>
  <p>Permet d'éxécuter la fonction passé en paramètre.</p>

  <h2 class="h2">Fonctionnalités</h2>

  <h3 class="h3"><i class="fa-solid fa-diamond mr-5"></i>Gestion automatique du loading</h3>
  <p>
    L'état de chargement est géré automatiquement via la ref
    <span class="badge-code">loading</span> :
  </p>
  <ul>
    <li><strong>État initial</strong> : loading = false, le slot par défaut est affiché</li>
    <li>
      <strong>Pendant callback</strong> : loading = true, le loader (bars ou spin) remplace le slot
    </li>
    <li>
      <strong>Après callback</strong> : loading = false, le slot réapparaît (sauf si infinite=true)
    </li>
    <li>
      <strong>Prop infinite</strong> : Si true, le loader reste affiché après la fin du callback
      (utile pour redirections/rechargements)
    </li>
    <li>
      <strong>Méthode setLoad(state)</strong> : Permet un contrôle manuel de l'état de loading via
      méthode exposée
    </li>
  </ul>

  <h3 class="h3"><i class="fa-solid fa-diamond mr-5"></i>Préservation des dimensions du bouton</h3>
  <p>
    Le composant préserve la taille du bouton pendant le chargement pour éviter les décalages
    visuels :
  </p>
  <ul>
    <li>
      <strong>defineButtonSize()</strong> : Calcule les dimensions exactes du bouton (width + height
      + borders)
    </li>
    <li>
      <strong>size ref</strong> : Stocke { width, height } et applique via
      <span class="badge-code">:style</span> sur le bouton
    </li>
    <li><strong>EXTRA_PADDING</strong> : Ajoute 5px à la largeur pour compensation visuelle</li>
    <li>
      <strong>getComputedStyle()</strong> : Utilise les styles calculés du navigateur pour inclure
      les borders
    </li>
    <li>
      <strong>Calcul automatique</strong> : Appelé automatiquement au premier
      <span class="badge-code">setLoad(true)</span> si size.height est undefined
    </li>
    <li>
      <strong>Cache</strong> : Les dimensions sont calculées une seule fois et réutilisées
      (performance)
    </li>
    <li>
      <strong>Protection</strong> : Si buttonHeight === 0, la fonction retourne sans définir size
      (évite les erreurs)
    </li>
  </ul>

  <h3 class="h3"><i class="fa-solid fa-diamond mr-5"></i>Protection contre les clics multiples</h3>
  <p>
    Le composant ignore les clics et appels supplémentaires tant que le callback asynchrone en cours
    n'est pas terminé :
  </p>
  <ul>
    <li>
      <strong>Guard de réentrance</strong> : <span class="badge-code">clickEvent</span> et
      <span class="badge-code">runCallback</span> retournent immédiatement si
      <span class="badge-code">loading === true</span>
    </li>
    <li>
      <strong>Attribut disabled</strong> : Le <span class="badge-code">&lt;button&gt;</span> est
      rendu avec <span class="badge-code">:disabled="loading"</span> pendant l'exécution
    </li>
    <li>
      <strong>Cas concret</strong> : Dans un formulaire de création, empêche la double soumission et
      donc la création de ressources dupliquées côté API
    </li>
    <li>
      <strong>Compatible infinite</strong> : En mode <span class="badge-code">infinite=true</span>,
      le guard reste actif tant que l'appelant n'a pas appelé
      <span class="badge-code">setLoad(false)</span>
    </li>
  </ul>

  <h2 class="h2">Exemple</h2>
  <div class="d-flex j-start a-center g-15">
    <Loader :click="loaderCallback"> Afficher le loader </Loader>
    <Loader
      :click="loaderCallback"
      type="icon"
    >
      <i class="fa-solid fa-face-smile color-primary color-primary-300-hover"></i>
    </Loader>
  </div>
  <h2 class="h2">Code</h2>
  <CodeHtml>
    <scriptBalise v-pre>
      import Loader from "@brugmann/vuemann/src/components/LoaderComponent.vue";
    </scriptBalise>
    <template v-pre>
      <Loader :click="loaderCallback"> Afficher le loader </Loader>
      <Loader
        :click="loaderCallback"
        type="icon"
      >
        <i class="fa-solid fa-face-smile color-primary color-primary-300-hover"></i>
      </Loader>
    </template>
  </CodeHtml>
</template>
<style lang="scss">
[data-loader='icon'] i {
  font-size: 1.4rem;
}
</style>
