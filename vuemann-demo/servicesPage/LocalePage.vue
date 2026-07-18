<template>
  <h1 class="h1">Service Locale</h1>
  <p>
    Permet d'embarquer un système de traduction avec trois langues, le français, le neerlandais et
    l'anglais.
  </p>
  <h2 class="h2">Installation</h2>
  <p>
    Le service locale est enregistré via <span class="badge-code">localeInit</span> dans la méthode
    <span class="badge-code">servicesM.initServices()</span> du fichier
    <span class="badge-code">main.js</span>. Pour plus de détails sur l'installation des services,
    consultez la
    <router-link
      :to="{ name: 'services' }"
      class="link-underline"
      >documentation des services</router-link
    >.
  </p>
  <h3 class="h3">Plugin Vite</h3>
  <p>
    Ce service nécessite également l'ajout du plugin <span class="badge-code">localeVite</span> dans
    le fichier <span class="badge-code">vite.config.js</span>
    pour compiler les fichiers de traduction lors de la compilation.
  </p>
  <h3 class="h3">Dépendances</h3>
  <p>
    Ce service utilise le package externe
    <a
      href="https://vue-i18n.intlify.dev/"
      class="underline link-underline"
      target="_blank"
      >Vue i18n</a
    >
    en mode Composition API (<span class="badge-code">legacy: false</span>).
  </p>
  <p>
    Bien que le service n'ait pas de dépendances d'initialisation, il utilise les services suivants
    à l'exécution :
  </p>
  <ul class="list ml-25">
    <li>flash - Pour afficher les erreurs de paramètres de traduction</li>
  </ul>
  <h2 class="h2">Configuration</h2>
  <h3 class="h3">Langues supportées</h3>
  <p>
    Les langues disponibles sont définies dans
    <span class="badge-code">src/config/locale-config.js</span>. Par défaut, trois langues sont
    supportées : français (fr), néerlandais (nl) et anglais (en).
    <strong>La langue par défaut est le français</strong>.
  </p>
  <div class="div-code">
    export const locales = {<br />
    &emsp;"fr": "Français",<br />
    &emsp;"nl": "Nederlands",<br />
    &emsp;"en": "English"<br />
    }
  </div>
  <h3 class="h3">Persistance</h3>
  <p>
    La locale sélectionnée par l'utilisateur est automatiquement sauvegardée dans le
    <span class="badge-code">localStorage</span> avec la clé
    <span class="badge-code">'locale'</span> et restaurée au chargement de l'application.
  </p>
  <h3 class="h3">Ressources Incluses</h3>
  <p>
    Le service locale inclut des images de drapeaux pour chaque langue supportée, situées dans
    <span class="badge-code">src/services/locale/images/</span>. Ces images sont automatiquement
    copiées dans <span class="badge-code">/images/vuemann/</span>
    lors de la compilation et utilisées par le composant LocaleComponent.
  </p>
  <h2 class="h2">Fonctionnement</h2>
  <p>
    Ce service va compiler tous les fichiers json contenu dans les dossiers locales du projet et des
    services de Vuemann dans un fichier src/locales/{lang}.json
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
    &emsp;|- services<br />
    &emsp;|&emsp;|- auth<br />
    &emsp;|&emsp;... |- locales<br />
    &emsp;|&emsp;&emsp;... |- en<br />
    &emsp;|&emsp;&emsp;&emsp;|&emsp;|- auth-en.json<br />
    &emsp;|&emsp;&emsp;&emsp;|- fr<br />
    &emsp;|&emsp;&emsp;&emsp;|&emsp;|- auth-fr.json<br />
    &emsp;|&emsp;&emsp;&emsp;|- nl<br />
    &emsp;|&emsp;&emsp;&emsp;&emsp;|- auth-nl.json<br />
    &emsp;...
  </div>
  <p>Les fichiers globaux générés sont accessible grace à la fonction de traduction.</p>
  <h3 class="h3">Fichier du traduction</h3>
  <p>
    Les fichiers de traduction contiennent un ensemble de clé/valeur reprenant l'ensemble des
    traductions de text d'une langue. Il est possible de personnaliser une traduction en mettant
    entre accolade la variable à personnaliser.
  </p>
  <div class="div-code">
    {<br />
    &emsp;"hello_global" : "Hello world!",<br />
    &emsp;"hello_perso" : "Hello {name}!"<br />
    }
  </div>
  <p>
    Dans l'exemple ci-dessus, le fichier de traduction possède deux clés traduite. La seconde clé
    "hello_perso" dispose d'un paramètre dynamique
    <span class="badge-code">name</span>. Passer la clé hello_perso à la fonction de traduction pour
    afficher le message associer dans la langue courante. Passez un objet de paramètre en second
    argument lorsque la phrase à traduire dispose de paramètre dynamique.
  </p>
  <h3 class="h3">Plugin Vite - Fonctionnalités Avancées</h3>
  <h4 class="h4">Versioning Automatique</h4>
  <p>
    Les fichiers de traduction compilés incluent la version du projet (depuis package.json) dans
    leur nom pour éviter les problèmes de cache :
  </p>
  <div class="div-code">
    public/locales/app-translate-fr-4_4_1.json<br />
    public/locales/app-translate-en-4_4_1.json<br />
    public/locales/app-translate-nl-4_4_1.json
  </div>
  <h4 class="h4">Hot Module Replacement (HMR)</h4>
  <p>
    En mode développement, toute modification d'un fichier JSON de traduction déclenche
    automatiquement une recompilation et un rechargement de la page.
  </p>
  <h4 class="h4">Nettoyage Automatique</h4>
  <p>
    À chaque compilation, les anciens fichiers de traduction sont automatiquement supprimés du
    dossier <span class="badge-code">public/locales/</span>.
  </p>
  <h4 class="h4">Chemins Scannés</h4>
  <p>
    Le plugin Vite scanne automatiquement les dossiers suivants pour trouver les fichiers de
    traduction :
  </p>
  <ul class="list ml-25">
    <li>./src/locales/{locale}/</li>
    <li>./node_modules/@brugmann/vuemann/src/locales/{locale}/</li>
    <li>./src/services/*/locales/{locale}/</li>
    <li>./src/apis/*/locales/{locale}/</li>
    <li>./node_modules/@brugmann/vuemann/src/services/*/locales/{locale}/</li>
    <li>./node_modules/@brugmann/vuemann/src/apis/*/locales/{locale}/</li>
  </ul>
  <h2 class="h2">Fonctions accessibles depuis le gestionnaire de service</h2>
  <!-- t -->
  <h3 class="h3"><i class="fa-solid fa-diamond mr-5"></i>t</h3>
  <p>Permet d'afficher un text traduit grace à une clé.</p>
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
        <td>clé du texte qui doit être traduit reprise dans le fichier de traduction json</td>
      </tr>
      <tr>
        <td>params</td>
        <td>Object</td>
        <td>-</td>
        <td>{}</td>
        <td>Permet de personnaliser un text traduit</td>
      </tr>
    </tbody>
  </table>
  <h4 class="h4">Utilisation sans paramètre dynamique</h4>
  <div class="div-code">
    <span class="color-neutral-500">//appel clasique</span><br />
    import { servicesM } from "@brugmann/vuemann/src/services/services-manager.js"<br />
    servicesM.service('locale:t', 'key_text')<br /><br />
    <span class="color-neutral-500">//appel sans paramètre dynamique avec le raccourci </span><br />
    import { t } from "@brugmann/vuemann/src/shortcuts/services-shortcut.js"<br />
    t('key_text')<br />
  </div>
  <h4 class="h4">Utilisation avec paramètre dynamique</h4>
  <div class="div-code">
    <span class="color-neutral-500">//appel clasique</span><br />
    import { servicesM } from "@brugmann/vuemann/src/services/services-manager.js"<br />
    servicesM.service('locale:t', ['key_text', {'name' : 'John'}])<br /><br />
    <span class="color-neutral-500">//appel avec le raccourci </span><br />
    import { t } from "@brugmann/vuemann/src/shortcuts/services-shortcut.js"<br />
    t('key_text', {'name' : 'John'})<br />
    <br />
    <span class="color-neutral-500"
      >//appel avec le raccourci avec un paramètre dynamique dans la clé</span
    ><br />
    import { t } from "@brugmann/vuemann/src/shortcuts/services-shortcut.js"<br />
    t('key_text:name=John')<br />
    <br />
    <span class="color-neutral-500"
      >//appel avec le raccourci avec plusieurs paramètre dynamique dans la clé</span
    ><br />
    import { t } from "@brugmann/vuemann/src/shortcuts/services-shortcut.js"<br />
    t('key_text:name=John|age=20')<br />
  </div>
  <h4 class="h4">Utilisation via l'objet locale</h4>
  <p>
    La fonction <span class="badge-code">t()</span> est également disponible via l'objet
    <span class="badge-code">locale</span>, qui regroupe toutes les méthodes du service locale.
  </p>
  <div class="div-code">
    import { locale } from "@brugmann/vuemann/src/shortcuts/services-shortcut.js"<br /><br />

    locale.t('key_text')<br />
    locale.t('key_text', {'name' : 'John'})<br />
    locale.current()
  </div>
  <!-- getCurrentLocale -->
  <h3 class="h3"><i class="fa-solid fa-diamond mr-5"></i>getCurrentLocale</h3>
  <p>Permet de récupérer la locale courante.</p>
  <h4 class="h4">retour</h4>
  <p>Le retour est un string de la locale courante (fr, en ou nl).</p>
  <h4 class="h4">Utilisation</h4>
  <div class="div-code">servicesM.service('locale:getCurrentLocale')<br /></div>
  <h2 class="h2">Méthodes Avancées</h2>
  <h3 class="h3"><i class="fa-solid fa-diamond mr-5"></i>localeStore.set()</h3>
  <p>
    Permet de changer la locale de manière programmatique. Cette méthode met à jour la locale et la
    persiste dans le localStorage. Pour un changement complet, il faut également charger les
    nouveaux messages de traduction et déclencher l'événement
    <span class="badge-code">locale-changed</span>.
  </p>
  <h4 class="h4">Paramètres</h4>
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
        <td>newLocale</td>
        <td>String</td>
        <td>oui</td>
        <td>Code de la nouvelle locale ('fr', 'en' ou 'nl')</td>
      </tr>
    </tbody>
  </table>
  <h4 class="h4">Utilisation Complète</h4>
  <div class="div-code">
    import { localeStore } from '@brugmann/vuemann/src/services/locale/src/locale-store.js'<br />
    import { localeFunctions } from
    '@brugmann/vuemann/src/services/locale/src/locale-functions.js'<br />
    import { useI18n } from 'vue-i18n'<br /><br />

    const { locale } = useI18n({ useScope: 'global' })<br /><br />

    const changeLocale = async (new_locale) => {<br />
    &emsp;localeStore.set(new_locale)<br />
    &emsp;globalThis.dispatchEvent(new CustomEvent('locale-changed', { detail: new_locale }))<br />
    &emsp;await localeFunctions.loadLocaleMessages(new_locale)<br />
    &emsp;locale.value = new_locale<br />
    }
  </div>
  <h3 class="h3"><i class="fa-solid fa-diamond mr-5"></i>localeStore.get()</h3>
  <p>
    Retourne la valeur courante de la locale (équivalent à
    <span class="badge-code">locale.current()</span>). Pour un usage réactif dans un composant Vue,
    utiliser <span class="badge-code">localeStore.currentRef</span> à la place.
  </p>
  <h4 class="h4">Utilisation</h4>
  <div class="div-code">
    import { localeStore } from '@brugmann/vuemann/src/services/locale/src/locale-store.js'<br /><br />

    const currentLocale = localeStore.get()
    <span class="color-neutral-500">// 'fr', 'en' ou 'nl'</span>
  </div>
  <h2 class="h2">Réactivité Vue 3</h2>
  <p>
    Le service locale dispose d'un système de réactivité native Vue 3 via
    <span class="badge-code">localeStore</span>. Cela permet aux composants de se mettre à jour
    automatiquement lors du changement de locale, sans avoir besoin d'écouter l'événement
    <span class="badge-code">locale-changed</span>.
  </p>
  <h3 class="h3"><i class="fa-solid fa-diamond mr-5"></i>localeStore.currentRef</h3>
  <p>
    Ref réactive qui contient la locale courante. Utilisez-la dans vos composants Vue pour une
    réactivité automatique.
  </p>
  <h4 class="h4">Utilisation dans un composant Vue</h4>
  <div class="div-code">
    <span class="color-neutral-500">// Import</span><br />
    import { localeStore } from '@brugmann/vuemann/src/shortcuts/services-shortcut.js'<br /><br />
    <span class="color-neutral-500">// Dans le script setup</span><br />
    const currentLocale = localeStore.currentRef<br /><br />
    <span class="color-neutral-500">// Dans le template - se met à jour automatiquement</span><br />
    &lt;div&gt;Langue actuelle : {{ currentLocale }}&lt;/div&gt;
  </div>
  <h4 class="h4">Utilisation dans un composable</h4>
  <div class="div-code">
    import { computed } from 'vue'<br />
    import { localeStore } from '@brugmann/vuemann/src/shortcuts/services-shortcut.js'<br /><br />
    export const useTranslatable = () => {<br />
    &emsp;const currentLocale = localeStore.currentRef<br /><br />
    &emsp;const getLabel = (model) => {<br />
    &emsp;&emsp;if (!model) return ''<br />
    &emsp;&emsp;const lang = currentLocale.value<br />
    &emsp;&emsp;return model[`label_${lang}`] || ''<br />
    &emsp;}<br /><br />
    &emsp;return { getLabel, currentLocale }<br />
    }
  </div>
  <h4 class="h4">Différence avec locale.current()</h4>
  <table class="t-default">
    <thead>
      <tr>
        <th>Méthode</th>
        <th>Type</th>
        <th>Réactif</th>
        <th>Usage</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>locale.current()</td>
        <td>Fonction</td>
        <td>Non</td>
        <td>Code JS natif, lecture ponctuelle</td>
      </tr>
      <tr>
        <td>localeStore.currentRef</td>
        <td>Ref Vue</td>
        <td>Oui</td>
        <td>Composants Vue, computed, watch</td>
      </tr>
    </tbody>
  </table>
  <h2 class="h2">Événements</h2>
  <h3 class="h3"><i class="fa-solid fa-diamond mr-5"></i>locale-changed</h3>
  <p>Un événement personnalisé est levé chaque fois que la locale est changée.</p>
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
    &emsp;<span class="color-neutral-500"
      >// event.detail contient le code de la nouvelle locale (ex: 'fr', 'en', 'nl')</span
    ><br />
    })
  </div>
  <p>
    L'événement est automatiquement déclenché lors du changement de locale via le composant
    <span class="badge-code">LocaleComponent.vue</span>.
  </p>
  <h2 class="h2">Vues</h2>
  <h3 class="h3">LocaleComponent.vue</h3>
  <p>
    Composant reprenant le bouton de changement de langue avec dropdown. Utilise le composant
    <span class="badge-code">DropdownComponent</span> pour afficher la liste des langues
    disponibles.
  </p>
</template>
