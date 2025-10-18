<template>
  <h1 class="h1">Service Locale</h1>
  <p>
    Permet d'embarquer un système de traduction avec trois langues, le français, le neerlandais et l'anglais.
  </p>
  <h2 class="h2">Installation</h2>
  <ul class="list ml-25">
    <li>Importer localeService dans l'objet services situé dans le fichier main.js.</li>
    <li>Importer localePlugin dans l'array plugins_asynchrone dans le fichier main.js.</li>
    <li>Importer le plugin localeVite dans l'array des plugins du fichier vite.config.js.</li>
  </ul>
  <h3 class="h3">Dépendances</h3>
  <p>
    Ce service utilise le package externe <a href="https://vue-i18n.intlify.dev/" class="underline link-underline" target="_blank">Vue i18n</a>. 
    En plus de ce package, ce service est dépedants des services :
  </p>
  <ul class="list ml-25">
    <li>flash - error</li>
  </ul>
  <h2 class="h2">Fonctionnement</h2>
  <p>
    Ce service va compiler tous les fichiers json contenu dans les dossiers locales du projet et des services de Vuemann dans un fichier src/locales/{lang}.json
  </p>
  <div class="div-code">
    project/src/<br />    
    &emsp;...<br />    
    &emsp;|- locales<br />   
    &emsp;|&emsp;|- en<br />    
    &emsp;|&emsp;|&emsp;|- project-en.json<br />    
    &emsp;|&emsp;|- fr<br />   
    &emsp;|&emsp;|&emsp;|- project-fr.json<br />    
    &emsp;|&emsp;|- nl<br />    
    &emsp;|&emsp;&emsp;|- project-nl.json<br />    
    &emsp;|- services<br />    &emsp;|&emsp;|- auth<br />    
    &emsp;|&emsp;... |- locales<br />    &emsp;|&emsp;&emsp;... |- en<br />    
    &emsp;|&emsp;&emsp;&emsp;|&emsp;|- auth-en.json<br />    
    &emsp;|&emsp;&emsp;&emsp;|- fr<br />    
    &emsp;|&emsp;&emsp;&emsp;|&emsp;|- auth-fr.json<br />    
    &emsp;|&emsp;&emsp;&emsp;|- nl<br />    
    &emsp;|&emsp;&emsp;&emsp;&emsp;|- auth-nl.json<br />    
    &emsp;...
  </div>
  <p>
    Les fichiers globaux générés sont accessible grace à la fonction de traduction.
  </p>
  <h3 class="h3">Fichier du traduction</h3>
  <p>
    Les fichiers de traduction contiennent un ensemble de clé/valeur reprenant l'ensemble des traductions de text d'une langue. Il est 
    possible de personnaliser une traduction en mettant entre accolade la variable à personnaliser.
  </p>
  <div class="div-code">
    {<br />    &emsp;"hello_global" : "Hello world!",<br />    &emsp;"hello_perso" : "Hello {name}!"<br />    }
  </div>
  <p>
    Dans l'exemple ci-dessus, le fichier de traduction possède deux clés traduite. La seconde clé "hello_perso" dispose d'un paramètre dynamique 
    <span class="badge-code">name</span>. Passer la clé hello_perso à la fonction de traduction pour afficher le message associer dans la langue courante. 
    Passez un objet de paramètre en second argument lorsque la phrase à traduire dispose de paramètre dynamique.
  </p>
  <h2 class="h2">Fonctions accessibles depuis le gestionnaire de service</h2> 
  <!-- t -->
  <h3 class="h3"><i class="fa-solid fa-diamond mr-5"></i>t</h3>
  <p>
    Permet d'afficher un text traduit grace à une clé.
  </p>
  <h4 class="h4">Paramètres</h4>  
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
        <td>text_key</td>
        <td>String</td>
        <td>oui</td>
        <td>-</td>
        <td>
          clé du texte qui doit être traduit reprise dans le fichier de traduction json
        </td>
      </tr>
      <tr>
        <td>params</td>
        <td>Object</td>
        <td>-</td>
        <td>{}</td>
        <td>
          Permet de personnaliser un text traduit
        </td>
      </tr>
    </tbody>
  </table>
  <h4 class="h4">Utilisation sans paramètre dynamique</h4>
  <div class="div-code">
    <span class="color-neutral-500">//appel clasique</span><br />
    import { servicesM } from "@brugmann/vuemann/src/services/services-manager.js"<br />         
    serviceM.service('locale:t', 'key_text')<br /><br />    
    <span class="color-neutral-500">//appel sans paramètre dynamique avec le raccourci </span><br />   
    import { t } from "@brugmann/vuemann/src/services/services-helper.js"<br />          
    t('key_text')<br />  
  </div> 
  <h4 class="h4">Utilisation avec paramètre dynamique</h4>
  <div class="div-code">      
    <span class="color-neutral-500">//appel clasique</span><br /> 
    import { servicesM } from "@brugmann/vuemann/src/services/services-manager.js"<br />   
    serviceM.service('locale:t', ['key_text', {'name' : 'John'}])<br /><br />  
    <span class="color-neutral-500">//appel avec le raccourci </span><br />   
    import { t } from "@brugmann/vuemann/src/services/services-helper.js"<br />      
    t('key_text', {'name' : 'John'})<br />  <br />
    <span class="color-neutral-500">//appel avec le raccourci avec un paramètre dynamique dans la clé</span><br />   
    import { t } from "@brugmann/vuemann/src/services/services-helper.js"<br />   
    t('key_text:name=John')<br />  <br />
    <span class="color-neutral-500">//appel avec le raccourci avec plusieurs paramètre dynamique dans la clé</span><br />   
    import { t } from "@brugmann/vuemann/src/services/services-helper.js"<br />   
    t('key_text:name=John|age=20')<br />  
  </div> 
  <!-- getCurrentLocale -->
  <h3 class="h3"><i class="fa-solid fa-diamond mr-5"></i>getCurrentLocale</h3>
  <p>
    Permet de récupérer la locale courante.
  </p>
  <h4 class="h4">retour</h4>  
  <p>
    Le retour est un string de la locale courante (fr, en ou nl).
  </p>
  <h4 class="h4">Utilisation</h4>
  <div class="div-code">
    serviceM.service('locale:getCurrentLocale')<br />  </div> 
  <h2 class="h2">Événements</h2>
  <h3 class="h3"><i class="fa-solid fa-diamond mr-5"></i>locale-changed</h3>
  <p>
    Un événement personnalisé est levé chaque fois que la locale est changée.
  </p>
  <h4 class="h4">Détails de l'événement</h4>
  <ul class="list ml-25">
    <li><span class="fw-700">Type:</span> CustomEvent</li>
    <li><span class="fw-700">Nom:</span> locale-changed</li>
    <li><span class="fw-700">Detail:</span> Contient le code de la nouvelle locale (string)</li>
  </ul>
  <h4 class="h4">Utilisation</h4>
  <div class="div-code">
    <span class="color-neutral-500">// Écouter le changement de locale</span><br />
    globalThis.addEventListener('locale-changed', (event) => {<br />
    &emsp;console.log('Nouvelle locale:', event.detail)<br />
    &emsp;<span class="color-neutral-500">// event.detail contient le code de la nouvelle locale (ex: 'fr', 'en', 'nl')</span><br />
    })
  </div>
  <p>
    L'événement est automatiquement déclenché lors du changement de locale via le composant <span class="badge-code">LocaleComponent.vue</span>.
  </p>
  <h2 class="h2">vues</h2> 
  <p>
    <span class="fw-700">LocaleComponent.vue</span>: View reprenant le bouton de changement de lang et la fonction dynamique
  </p>
</template>
