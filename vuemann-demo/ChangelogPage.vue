<script setup>
import ChangelogComponent from '@brugmann/vuemann/src/components/changelog/ChangelogComponent.vue'
import ChangelogSectionComponent from '@brugmann/vuemann/src/components/changelog/ChangelogSectionComponent.vue'
</script>

<template>
  <ChangelogComponent description="Voici un changelog de test de l'application Vuemann">
    <ChangelogSectionComponent
      version="4.9.37"
      date="17/03/26"
      :features="[
        'Nouveau composant DelayedLoaderComponent : affiche un loader uniquement si le chargement dure plus de 200ms (configurable via prop delay), évitant le scintillement pour les chargements rapides.',
      ]"
    />
    <ChangelogSectionComponent
      version="4.9.30"
      date="16/03/26"
      :features="[
        'app.title : le titre de l\'application est maintenant configuré via ConfigLoader (app.title) et supporte les clés de traduction i18n. Le document.title affiche maintenant le format &quot;Page - App&quot;.',
      ]"
      :bugs="[
        'AppComponent : correction du bug où les composants enfants étaient montés avant la fin du callback d\'initialisation (selects vides, onMounted prématuré). apiStatus() ne mute plus le store directement.',
      ]"
      :critical="[
        'HeaderComponent : la prop title est supprimée. Le titre est maintenant lu depuis ConfigLoader.get(\'app.title\'). Les apps enfants doivent définir app.title dans leur config.',
        'Le health check API utilise maintenant la route openapi. Les apps enfants doivent ajouter dans routes-api-config.js : &quot;api.openapi&quot;: { url: &quot;openapi.json&quot;, method: &quot;get&quot; }',
      ]"
    />
    <ChangelogSectionComponent
      version="4.8.0"
      date="02/02/26"
      :features="[
        'ConfigLoader.get() est maintenant strict : lance une erreur si la clé n\'existe pas (fail-fast)',
        'Nouvelle méthode ConfigLoader.find(key, defaultValue) : retourne la valeur par défaut si la clé n\'existe pas',
        'Nouvelle méthode ConfigLoader.has(key) : vérifie si une clé de configuration existe',
      ]"
      :critical="[
        'ConfigLoader.get() ne supporte plus de defaultValue. Utiliser ConfigLoader.find(key, defaultValue) à la place.',
        'Les appels ConfigLoader.get(key) sur une clé inexistante lancent maintenant une Error au lieu de retourner undefined.',
      ]"
    />
    <ChangelogSectionComponent
      version="4.5.12"
      date="20/11/25"
      :critical="[
        'req() signature changed: req(route_name, datas, options) → req(route_name, options). Data must now be passed via options.body property.',
      ]"
    />
    <ChangelogSectionComponent
      version="4.3.10"
      date="23/10/25"
      :updates="['La fonction auth.user() a été renommée auth.username().']"
    />
    <ChangelogSectionComponent
      version="4.3.9"
      date="23/10/25"
      :critical="[
        'La fonction callback de AppComponent doit maintenant retourner un objet avec la propriété appStatus et plus de status AJAX.',
      ]"
    />
    <ChangelogSectionComponent
      version="4.1.0"
      date="09/10/25"
      :updates="[
        'Refonte du service form avec une nouvelle structure de règles. Pour plus de détails, consultez la page du service form.',
      ]"
    />
    <ChangelogSectionComponent
      version="4.0.0"
      date="07/10/25"
      :features="[
        'Refactoring complet de l\'architecture des services avec système d\'initialisation simplifié',
        'Nouveau système de service manager avec gestion des dépendances automatique',
      ]"
      :updates="[
        'Suppression des raccourcis obsolètes success, successT, error, errorT (maintenant dans flash)',
      ]"
      :critical="[
        'Changement majeur dans l\'architecture des services : nouveau système d\'initialisation requis',
        'Les plugins sont maintenant des fonctions retournant un objet avec install()',
      ]"
    />
    <ChangelogSectionComponent
      version="3.11.19"
      date="19/09/25"
      :updates="[
        'La fonction Ajax service generateUrlFromRoute a été renommée generateUrlFromRouteName',
        'SwitchComponent : Il n\'y a plus de props label. A la place vous avez les props suffix et prefix',
      ]"
    />
    <ChangelogSectionComponent
      version="3.11.13"
      date="16/09/25"
      :updates="[
        'Form service : la fonction validateForm retourne maintenant un objet avec les propriétés valid (et non valide), datas et errors',
        'La classe btn-primary_reverse est remplacée par btn-primary-alt et s\'applique maintenant à tous les boutons',
      ]"
      :critical="[
        'AppComponent gère maintenant l\'authentification et plus le router. Ce composant est maintenant obligatoire dans le projet.',
      ]"
    />
    <ChangelogSectionComponent
      version="3.10.3"
      date="28/08/25"
      :updates="['Renommer le composant InputError en ErrorForm']"
    />
    <ChangelogSectionComponent
      version="3.8.8"
      date="31/07/25"
      :features="['Ajout du lien Liste des modifications dans la barre de debug']"
      :optimizations="['Autres améliorations et corrections de bugs']"
    />
  </ChangelogComponent>
</template>

<style>
.changelog-content {
  max-width: 800px;
}
</style>
