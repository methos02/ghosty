<script setup>
import { ref } from 'vue'
import CodeHtml from '@brugmann/vuemann/src/components/codeHtml/CodeHtmlComponent.vue'
import InputDate from '@brugmann/vuemann/src/services/form/views/inputs/InputDate/InputDateComponent.vue'

const dateValue = ref('')
const appointmentDate = ref('')
const customDate = ref('')
</script>

<template>
  <h1 class="h1">Input Date Component</h1>
  <p>
    Ce component permet de saisir des dates avec une interface personnalisable. Il propose une popup
    de calendrier entièrement stylisable avec une architecture modulaire (logique, styles et
    composant séparés).
  </p>

  <h2 class="h2">v-model</h2>
  <p>
    Le composant utilise <span class="badge-code">v-model</span> pour la liaison bidirectionnelle de
    la date.
  </p>
  <table class="t-default mb-15 w-100">
    <thead>
      <tr>
        <th>Type</th>
        <th>Default</th>
        <th>Description</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>String</td>
        <td>''</td>
        <td>Valeur de la date au format spécifié par dateFormat</td>
      </tr>
    </tbody>
  </table>

  <h2 class="h2">Dépendances</h2>
  <p>Ce composant utilise :</p>
  <ul>
    <li><span class="badge-code">ErrorFormComponent</span> - Affiche les erreurs de validation</li>
    <li>
      <span class="badge-code">FormHelper.getInputName()</span> - Génère le nom complet de l'input
      avec préfixe de formulaire
    </li>
    <li>
      <span class="badge-code">flash</span> - Service de flash messages pour afficher les erreurs de
      format
    </li>
    <li><span class="badge-code">t()</span> - Service de traduction pour l'internationalisation</li>
    <li>
      <span class="badge-code">dateHelper</span> - Helper pour la manipulation et validation des
      dates
    </li>
    <li><span class="badge-code">InputDate</span> - Logique métier séparée (src/input-date.js)</li>
    <li><span class="badge-code">input-date.scss</span> - Styles SCSS séparés</li>
  </ul>

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
      <tr>
        <td>initialViewDate</td>
        <td>String</td>
        <td>-</td>
        <td>undefined</td>
        <td>
          Mois/année d'ouverture du calendrier quand aucune date n'est encore sélectionnée (format
          ISO : YYYY-MM-DD). Ignoré si <span class="badge-code">v-model</span> contient déjà une
          valeur. Une valeur invalide logue une erreur et replie sur le mois courant.
        </td>
      </tr>
    </tbody>
  </table>

  <p>
    <strong>Note :</strong> La popup de calendrier s'ouvre automatiquement dans la direction où
    l'espace est suffisant. Si l'input est proche du bord bas de la fenêtre, la popup s'affiche
    au-dessus ; si l'input est proche du bord droit, la popup s'aligne à droite. Ce comportement est
    calculé automatiquement — aucune prop n'est nécessaire sur
    <span class="badge-code">InputDateComponent</span>.
  </p>

  <h2 class="h2">Méthodes exposées</h2>

  <h3 class="h3">toggleCalendar</h3>
  <p>
    Permet d'ouvrir / fermer le calendrier. Si aucun état n'est passé en paramètre, la fonction va
    inverser l'état du calendrier.
  </p>
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
          Permet de personnaliser le contenu du footer du calendrier. Remplace les boutons
          "Aujourd'hui" et "Effacer" par défaut
        </td>
      </tr>
    </tbody>
  </table>

  <h2 class="h2">Exemples</h2>

  <h3 class="h3">Input Date basique</h3>
  <!-- eslint-disable -->
  <CodeHtml>
    <template v-pre>
      <InputDate
        name="birthdate"
        label="Date de naissance"
        :required="true"
      />
    </template>
  </CodeHtml>
  <!-- eslint-enable -->
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
  <!-- eslint-disable -->
  <CodeHtml>
    <template v-pre>
      <InputDate
        name="appointment"
        label="Date de rendez-vous"
        :minDate="'2024-01-01'"
        :maxDate="'2024-12-31'"
      />
    </template>
  </CodeHtml>
  <!-- eslint-enable -->
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
  <!-- eslint-disable -->
  <CodeHtml>
    <template v-pre>
      <InputDate
        name="no-footer"
        label="Date sans footer"
        :hasFooter="false"
      />
    </template>
  </CodeHtml>
  <!-- eslint-enable -->
  <div class="d-flex">
    <InputDate
      name="no-footer"
      v-model="customDate"
      label="Date sans footer"
      :hasFooter="false"
    />
  </div>
  <p class="textarea-value mt-15">Valeur: {{ customDate }}</p>

  <h3 class="h3">Input Date avec initialViewDate</h3>
  <p>
    La prop <span class="badge-code">initialViewDate</span> contrôle le mois/année affiché à
    l'ouverture du calendrier quand aucune date n'est encore sélectionnée. Cas d'usage typique : une
    date de naissance avec <span class="badge-code">maxDate</span> dans le passé — sans
    <span class="badge-code">initialViewDate</span>, le calendrier s'ouvrirait sur le mois courant,
    obligeant l'utilisateur à naviguer des années en arrière.
  </p>
  <!-- eslint-disable -->
  <CodeHtml>
    <template v-pre>
      <InputDate
        name="birthdate"
        label="Date de naissance"
        :maxDate="'2006-01-01'"
        :initialViewDate="'2000-01-01'"
      />
    </template>
  </CodeHtml>
  <!-- eslint-enable -->
  <div class="d-flex">
    <InputDate
      name="birthdate-initial"
      v-model="dateValue"
      label="Date de naissance"
      :maxDate="'2006-01-01'"
      :initialViewDate="'2000-01-01'"
    />
  </div>
  <p class="textarea-value mt-15">Valeur: {{ dateValue }}</p>

  <h3 class="h3">Input Date avec footer personnalisé</h3>
  <!-- eslint-disable -->
  <CodeHtml>
    <template v-pre>
      <InputDate
        name="custom-footer"
        label="Date avec footer personnalisé"
      >
        <template #default>
          <button
            type="button"
            class="btn btn-primary"
          >
            Valider
          </button>
          <button
            type="button"
            class="btn btn-danger"
          >
            Annuler
          </button>
        </template>
      </InputDate>
    </template>
  </CodeHtml>
  <!-- eslint-enable -->
  <div class="d-flex">
    <InputDate
      name="custom-footer"
      v-model="customDate"
      label="Date avec footer personnalisé"
    >
      <template #default>
        <button
          type="button"
          class="btn btn-primary btn-primary-400-active"
        >
          <i class="fa-solid fa-calendar-check mr-5"></i>
          Valider
        </button>
        <button
          type="button"
          class="btn btn-danger"
        >
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
      import InputDate from
      "@brugmann/vuemann/src/services/form/views/inputs/InputDate/InputDateComponent.vue";
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

      <!-- initialViewDate : ouvre le calendrier sur janvier 2000 quand aucune date n'est sélectionnée -->
      <InputDate
        name="birthdate"
        label="Date de naissance"
        :maxDate="'2006-01-01'"
        :initialViewDate="'2000-01-01'"
      />

      <!-- Avec footer personnalisé -->
      <InputDate
        name="custom-footer"
        label="Date avec footer personnalisé"
      >
        <template #default>
          <button
            type="button"
            class="btn btn-primary btn-primary-400-active"
          >
            <i class="fa-solid fa-calendar-check mr-5"></i>
            Valider
          </button>
          <button
            type="button"
            class="btn btn-danger"
          >
            <i class="fa-solid fa-times mr-5"></i>
            Annuler
          </button>
        </template>
      </InputDate>

      <!-- Utilisation de toggleCalendar -->
      const inputDateRef = ref() const toggleCalendar = () => { inputDateRef.value.toggleCalendar()
      }
      <InputDate
        ref="inputDateRef"
        name="toggle-example"
        label="Calendrier contrôlé"
      />
    </template>
  </CodeHtml>
  <!-- eslint-enable -->

  <h2 class="h2">Fonctionnalités</h2>

  <h3 class="h3"><i class="fa-solid fa-diamond mr-5"></i>Double valeur (display vs model)</h3>
  <p>Le composant gère deux valeurs distinctes :</p>
  <ul>
    <li>
      <strong>displayValue</strong> : Valeur affichée dans l'input, toujours au format DD/MM/YYYY
    </li>
    <li>
      <strong>input (v-model)</strong> : Valeur du modèle, au format spécifié par
      <span class="badge-code">dateFormat</span>
    </li>
    <li>Permet d'afficher un format à l'utilisateur tout en stockant un format différent</li>
    <li>
      Conversion automatique entre les deux formats via <span class="badge-code">dateHelper</span>
    </li>
  </ul>

  <h3 class="h3"><i class="fa-solid fa-diamond mr-5"></i>Saisie manuelle avec validation</h3>
  <p>L'utilisateur peut taper directement la date dans l'input :</p>
  <ul>
    <li>Format attendu : DD/MM/YYYY (affichage français)</li>
    <li>
      Formatage automatique pendant la saisie via <span class="badge-code">formatInputValue()</span>
    </li>
    <li>Validation en temps réel : la date doit faire exactement 10 caractères</li>
    <li>Validation du format via <span class="badge-code">dateHelper.isValidDate()</span></li>
    <li>Si invalide : v-model est vidé et selectedDate est réinitialisé</li>
    <li>maxlength="10" pour limiter la saisie</li>
  </ul>

  <h3 class="h3"><i class="fa-solid fa-diamond mr-5"></i>Boutons du footer</h3>
  <p>Par défaut, le footer contient deux boutons :</p>
  <ul>
    <li><strong>Aujourd'hui</strong> : Sélectionne la date du jour (masqué si hors contraintes)</li>
    <li>
      <strong>Effacer</strong> : Vide la sélection (selectedDate, input, displayValue) et ferme le
      calendrier
    </li>
    <li>Les boutons peuvent être remplacés via le slot default</li>
    <li>
      Le footer entier peut être masqué avec <span class="badge-code">:hasFooter="false"</span>
    </li>
  </ul>

  <h3 class="h3"><i class="fa-solid fa-diamond mr-5"></i>Validation au montage</h3>
  <p>Si une valeur v-model existe au montage du composant :</p>
  <ul>
    <li>
      Validation automatique du format via <span class="badge-code">dateHelper.isValidDate()</span>
    </li>
    <li>Si invalide : v-model est vidé + message d'erreur flash affiché</li>
    <li>Si valide : conversion en displayValue (DD/MM/YYYY) et selectedDate initialisée</li>
    <li>Permet de détecter les erreurs de format au chargement de la page</li>
  </ul>

  <h3 class="h3"><i class="fa-solid fa-diamond mr-5"></i>Positionnement automatique de la popup</h3>
  <p>
    Lors de l'ouverture du calendrier, le composant mesure l'espace disponible autour de l'input et
    choisit automatiquement la direction d'ouverture :
  </p>
  <ul>
    <li>
      <strong>Vertical :</strong> la popup s'ouvre en bas par défaut ; elle bascule vers le haut si
      l'espace sous l'input est insuffisant
    </li>
    <li>
      <strong>Horizontal :</strong> la popup s'aligne à gauche par défaut ; elle bascule vers la
      droite si l'espace à droite est insuffisant
    </li>
    <li>
      Ce calcul est entièrement géré par <span class="badge-code">InputDateComponent</span> via les
      props <span class="badge-code">verticalPosition</span> et
      <span class="badge-code">horizontalPosition</span> de
      <span class="badge-code">CalendarPopupComponent</span>
    </li>
    <li>Aucune configuration n'est requise : le comportement est entièrement automatique</li>
  </ul>

  <h2 class="h2">Personnalisation du Footer</h2>
  <p>
    Le composant propose un système de slot pour personnaliser complètement le footer du calendrier
    :
  </p>

  <h3 class="h3">Slot default</h3>
  <p>
    Utilisez le slot par défaut pour remplacer les boutons "Aujourd'hui" et "Effacer" par vos
    propres boutons :
  </p>

  <ul>
    <li><strong>Par défaut :</strong> Boutons "Aujourd'hui" et "Effacer"</li>
    <li><strong>Avec slot :</strong> Contenu entièrement personnalisable</li>
    <li><strong>Flexibilité :</strong> Ajoutez autant de boutons que nécessaire</li>
    <li><strong>Styling :</strong> Utilisez les classes CSS Vuemann pour la cohérence</li>
    <li>
      <strong>Usage :</strong>
      <span class="badge-code">&lt;template #default&gt;...&lt;/template&gt;</span>
    </li>
  </ul>

  <h3 class="h3">Désactiver le footer</h3>
  <p>
    Utilisez la prop <span class="badge-code">:hasFooter="false"</span> pour masquer complètement le
    footer :
  </p>
</template>

<style lang="scss">
.textarea-value {
  white-space: pre-wrap;
}
</style>
