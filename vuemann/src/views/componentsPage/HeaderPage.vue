<template>
  <h1 class="h1">Header des applications</h1>
  <p>
    Le header est un composant qui affiche le titre de l'application, le dropdown de langue, le bouton de logout, le bouton de documentation et un menu de navigation à droite.
  </p>
  <h2 class="h2">Paramètres</h2>
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
        <td>title</td>
        <td>String</td>
        <td>non</td>
        <td>''</td>
        <td>
          Titre de l'application.
        </td>
      </tr>
      <tr>
        <td>documentation</td>
        <td>String</td>
        <td>non</td>
        <td>-</td>
        <td>
          URL de la documentation de l'application.
        </td>
      </tr>
    </tbody>
  </table>
  <h2 class="h2">Lien dans le menu de navigation</h2>
  <p>
    Pour ajouter un lien dans le menu de navigation, vous devez ajouter l'attribut <code>sidebar</code> à la meta de la route.
  </p>
  <div class="div-code">
    <pre>
      {
        path: '/',
        meta: {
          sidebar: {
            label: 'Accueil',
            icon: 'fa-solid fa-house',
            order: 1
          }
        }
      }
    </pre>
  </div>
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
        <td>label</td>
        <td>String</td>
        <td>oui</td>
        <td>
          Label du lien.
        </td>
      </tr>
      <tr>
        <td>icon</td>
        <td>String</td>
        <td>oui</td>
        <td>
          Icon du lien.
        </td>
      </tr>
      <tr>
        <td>order</td>
        <td>Number</td>
        <td>oui</td>
        <td>
          Optionnel - Ordre du lien. Par défaut, le lien sera ajouté à la fin de la liste.
        </td>
      </tr>
    </tbody>
  </table>
  <h2 class="h2">Utilisation</h2>
  <p>
    Pour utiliser le header, vous devez ajouter le composant <code>HeaderComponent</code> dans le fichier <span class="badge-code">App.vue</span>. Cela est automatiquement fait si 
    vous utilisez le template <span class="badge-code">chu-brugmann-vue-template</span>.
  </p>
  <CodeHtmlComponent>
    <scriptBalise v-pre>
      import HeaderComponent from '@brugmann/vuemann/src/components/HeaderComponent.vue';
    </scriptBalise>
    <template v-pre>
      <div class="container-body | f-column">
        <Header 
          title="mon application" 
          documentation="/mon-application.pdf"
        />
        <router-view />
      </div>
    </template>
  </CodeHtmlComponent>
</template>
