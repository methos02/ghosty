<script setup>
import { ref } from "vue";
import CodeHtml from "@brugmann/vuemann/src/components/codeHtml/CodeHtmlComponent.vue"
import InputDate from "@brugmann/vuemann/src/services/form/views/inputs/InputDate/InputDateComponent.vue";

const dateValue = ref('')
const appointmentDate = ref('')
const customDate = ref('')
</script>

<template>
  <h1 class="h1">Input Date Component</h1>
  <p>
    Ce component permet de saisir des dates avec une interface personnalisable. Il propose une popup de calendrier 
    entièrement stylisable avec une architecture modulaire (logique, styles et composant séparés).
  </p>
  
  <h2 class="h2">Propriétés</h2>
  <table class="t-default mb-15 w-100">
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
        <td>name</td>
        <td>String</td>
        <td>oui</td>
        <td>-</td>
        <td>Nom et id de l'input</td>
      </tr>
      <tr>
        <td>label</td>
        <td>String</td>
        <td>oui</td>
        <td>-</td>
        <td>Label de l'input.</td>
      </tr>
      <tr>
        <td>required</td>
        <td>Boolean</td>
        <td>-</td>
        <td>false</td>
        <td>L'input est-il requis.</td>
      </tr>
      <tr>
        <td>error</td>
        <td>Boolean</td>
        <td>-</td>
        <td>true</td>
        <td>Afficher ou non les erreurs de validation.</td>
      </tr>
      <tr>
        <td>form</td>
        <td>String</td>
        <td>-</td>
        <td>undefined</td>
        <td>Nom du formulaire associé.</td>
      </tr>
      <tr>
        <td>containerClass</td>
        <td>String</td>
        <td>-</td>
        <td>''</td>
        <td>Classes CSS supplémentaires pour le conteneur.</td>
      </tr>
      <tr>
        <td>dateFormat</td>
        <td>String</td>
        <td>-</td>
        <td>'DD/MM/YYYY'</td>
        <td>Format de date pour la valeur de sortie.</td>
      </tr>
      <tr>
        <td>minDate</td>
        <td>String</td>
        <td>-</td>
        <td>undefined</td>
        <td>Date minimum autorisée (format ISO : YYYY-MM-DD).</td>
      </tr>
      <tr>
        <td>maxDate</td>
        <td>String</td>
        <td>-</td>
        <td>undefined</td>
        <td>Date maximum autorisée (format ISO : YYYY-MM-DD).</td>
      </tr>
      <tr>
        <td>hasFooter</td>
        <td>Boolean</td>
        <td>-</td>
        <td>true</td>
        <td>Afficher ou non le footer du calendrier.</td>
      </tr>
    </tbody>
  </table>
  
  <h2 class="h2">Méthodes exposées</h2>
  
  <h3 class="h3">toggleCalendar</h3>
  <p>Permet d'ouvrir / fermer le calendrier. Si aucun état n'est passé en paramètre, la fonction va inverser l'état du calendrier.</p>
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
        <th>-</th>
        <td>True pour afficher et False pour le masquer</td>
      </tr>
    </tbody>
  </table>
  
  <h2 class="h2">Exemples</h2>
  
  <h3 class="h3">Input Date basique</h3>
  <div class="d-flex">
    <InputDate
      name="birthdate"
      v-model="dateValue"
      label="Date de naissance"
      :required="true"
    />
  </div>
  <p class="textarea-value mt-15">Valeur: {{ dateValue }}</p>
  
  <h3 class="h3">Input Date avec contraintes</h3>
  <div class="d-flex">
    <InputDate
      name="appointment"
      v-model="appointmentDate"
      label="Date de rendez-vous"
      :minDate="'2024-01-01'"
      :maxDate="'2024-12-31'"
    />
  </div>
  <p class="textarea-value mt-15">Valeur: {{ appointmentDate }}</p>
  
  <h3 class="h3">Input Date sans footer</h3>
  <div class="d-flex">
    <InputDate
      name="no-footer"
      v-model="customDate"
      label="Date sans footer"
      :hasFooter="false"
    />
  </div>
  <p class="textarea-value mt-15">Valeur: {{ customDate }}</p>
  
  <h3 class="h3">Input Date avec footer personnalisé</h3>
  <div class="d-flex">
    <InputDate
      name="custom-footer"
      v-model="customDate"
      label="Date avec footer personnalisé"
    >
      <template #footer-buttons>
        <button type="button" class="btn btn-primary">
          <i class="fa-solid fa-calendar-check mr-5"></i>
          Valider
        </button>
        <button type="button" class="btn btn-danger">
          <i class="fa-solid fa-times mr-5"></i>
          Annuler
        </button>
      </template>
    </InputDate>
  </div>
  
  <h2 class="h2">Code</h2>
  <!-- eslint-disable -->
  <CodeHtml class="my-15">
      <scriptBalise v-pre>
        import InputDate from "@brugmann/vuemann/src/services/form/views/inputs/InputDate/InputDateComponent.vue";
      </scriptBalise>
      <template v-pre>
        <!-- Exemple basique -->
        <InputDate
          name="birthdate"
          label="Date de naissance"
          :required="true"
        />
        
        <!-- Avec contraintes -->
        <InputDate
          name="appointment"
          label="Date de rendez-vous"
          :minDate="'2024-01-01'"
          :maxDate="'2024-12-31'"
        />
        
        <!-- Sans footer -->
        <InputDate
          name="no-footer"
          label="Date sans footer"
          :hasFooter="false"
        />
        
        <!-- Avec footer personnalisé -->
        <InputDate
          name="custom-footer"
          label="Date avec footer personnalisé"
        >
          <template #footer-buttons>
            <button type="button" class="btn btn-primary">
              <i class="fa-solid fa-calendar-check mr-5"></i>
              Valider
            </button>
            <button type="button" class="btn btn-danger">
              <i class="fa-solid fa-times mr-5"></i>
              Annuler
            </button>
          </template>
        </InputDate>
        
        <!-- Utilisation de toggleCalendar -->
        const inputDateRef = ref()
        const toggleCalendar = () => {
          inputDateRef.value.toggleCalendar()
        }
        <InputDate ref="inputDateRef" name="toggle-example" label="Calendrier contrôlé" />
      </template>
  </CodeHtml>
  <!-- eslint-enable -->
  
  <h2 class="h2">Fonctionnalités</h2>
  <ul>
    <li><strong>Interface personnalisable :</strong> Popup de calendrier entièrement stylisable</li>
    <li><strong>Navigation intuitive :</strong> Boutons pour naviguer entre les mois</li>
    <li><strong>Saisie manuelle :</strong> Possibilité de taper directement la date</li>
    <li><strong>Contraintes de dates :</strong> Support des dates minimum et maximum</li>
    <li><strong>Bouton "Aujourd'hui" :</strong> Retour rapide à la date actuelle</li>
    <li><strong>Bouton "Effacer" :</strong> Supprime la date sélectionnée et vide l'input</li>
    <li><strong>Gestion des clics extérieurs :</strong> Fermeture automatique de la popup</li>
    <li><strong>Format français :</strong> Affichage et saisie au format jj/mm/aaaa</li>
    <li><strong>Internationalisation :</strong> Support multilingue (français, anglais, néerlandais)</li>
    <li><strong>Contrôle programmatique :</strong> Méthode <span class="badge-code">toggleCalendar</span> exposée via ref</li>
  </ul>

  <h2 class="h2">Personnalisation du Footer</h2>
  <p>
    Le composant propose un système de slot pour personnaliser complètement le footer du calendrier :
  </p>
  
  <h3 class="h3">Slot footer-buttons</h3>
  <p>
    Utilisez le slot <code>footer-buttons</code> pour remplacer les boutons par défaut par vos propres boutons :
  </p>
  
  <ul>
    <li><strong>Par défaut :</strong> Boutons "Aujourd'hui" et "Effacer"</li>
    <li><strong>Avec slot :</strong> Contenu entièrement personnalisable</li>
    <li><strong>Flexibilité :</strong> Ajoutez autant de boutons que nécessaire</li>
    <li><strong>Styling :</strong> Utilisez les classes CSS Vuemann pour la cohérence</li>
  </ul>
  
  <h3 class="h3">Désactiver le footer</h3>
  <p>
    Utilisez la prop <code>hasFooter="false"</code> pour masquer complètement le footer :
  </p>
  
  <h2 class="h2">Architecture modulaire</h2>
  <p>
    Le composant suit une architecture modulaire pour une meilleure maintenabilité :
  </p>
  <ul>
    <li><strong>Logique séparée :</strong> Toute la logique métier est dans <code>src/input-date.js</code></li>
    <li><strong>Styles séparés :</strong> Les styles SCSS sont dans un fichier dédié pour une personnalisation facile</li>
    <li><strong>Composant principal :</strong> Le template et les props restent dans le composant Vue</li>
    <li><strong>Réutilisabilité :</strong> La logique peut être réutilisée dans d'autres composants</li>
    <li><strong>Internationalisation :</strong> Système de traduction intégré avec architecture miroir</li>
  </ul>
</template>

<style lang="scss">
.textarea-value {
    white-space: pre-wrap
}
</style>
