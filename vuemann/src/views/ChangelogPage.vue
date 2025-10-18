<script setup>
import ChangelogComponent from '@brugmann/vuemann/src/components/changelog/ChangelogComponent.vue'
import ChangelogSectionComponent from '@brugmann/vuemann/src/components/changelog/ChangelogSectionComponent.vue'
</script>

<template>    
  <ChangelogComponent description="Voici un changelog de test de l'application Vuemann">
    <ChangelogSectionComponent 
      version="4.1.0"
      date="09/10/25"
      :updates="[
        'Refonte du service form avec une nouvelle structure de règles. Pour plus de détails, consultez la page du service form.'
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
        'Les plugins sont maintenant des fonctions retournant un objet avec install()'
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
        'La classe btn-primary_reverse est remplacée par btn-primary-alt et s\'applique maintenant à tous les boutons'
      ]"
      :critical="[
        'AppComponent gère maintenant l\'authentification et plus le router. Ce composant est maintenant obligatoire dans le projet.'
      ]"
    />
    <ChangelogSectionComponent 
      version="3.10.3"
      date="28/08/25"
      :updates="[
        'Renommer le composant InputError en ErrorForm'
      ]"
    />
    <ChangelogSectionComponent 
      version="3.8.8"
      date="31/07/25"
      :features="[
        'Ajout du lien Liste des modifications dans la barre de debug'
      ]"
      :optimizations="[
        'Autres améliorations et corrections de bugs'
      ]"
    />
  </ChangelogComponent>
</template>

<style>
.changelog-content {
  max-width: 800px;
}
</style> 
