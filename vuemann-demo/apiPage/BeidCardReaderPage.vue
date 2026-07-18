<script setup>
import CodeHtml from '@brugmann/vuemann/src/components/codeHtml/CodeHtmlComponent.vue'
import BeidCardReader from '@brugmann/vuemann/src/apis/beid/views/BeidCardReaderComponent.vue'
import { ref } from 'vue'

const cardData = ref()
const lastError = ref()

const handleCardRead = data => {
  cardData.value = data
  lastError.value = undefined
}

const handleError = error => {
  lastError.value = error
  cardData.value = undefined
}
</script>

<template>
  <h1 class="h1">BeidCardReader Component - Belgian eID</h1>
  <p class="my-10">
    Ce composant permet de lire les cartes d'identité électroniques belges (eID) via une connexion
    WebSocket locale. Il communique avec l'application BeID installée sur le poste client pour
    récupérer les données de la carte.
  </p>

  <h2 class="h2">Prérequis</h2>
  <ul class="list ml-25">
    <li>Application BeID installée sur le poste client</li>
    <li>Lecteur de carte eID connecté</li>
    <li>Configuration dans <code>app-config.js</code></li>
  </ul>

  <h2 class="h2">Configuration requise</h2>
  <CodeHtml> // app-config.js apis: { beid: { url: "127.0.0.1:9000", auth: false } } </CodeHtml>

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
        <td>buttonClass</td>
        <td>String</td>
        <td>Non</td>
        <td>'btn btn-primary btn-primary-400-active'</td>
        <td>Classes CSS appliquées au bouton.</td>
      </tr>
    </tbody>
  </table>

  <h2 class="h2">Événements</h2>
  <table class="t-default">
    <thead>
      <tr>
        <th>Nom</th>
        <th>Payload</th>
        <th>Description</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>card-read</td>
        <td>Object (CardData)</td>
        <td>Émis lorsque la carte est lue avec succès. Contient les données transformées.</td>
      </tr>
      <tr>
        <td>error</td>
        <td>Object { message, raw }</td>
        <td>Émis en cas d'erreur de lecture.</td>
      </tr>
    </tbody>
  </table>

  <h2 class="h2">Structure des données (CardData)</h2>
  <table class="t-default">
    <thead>
      <tr>
        <th>Propriété</th>
        <th>Type</th>
        <th>Description</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>cardNumber</td>
        <td>String</td>
        <td>Numéro de la carte</td>
      </tr>
      <tr>
        <td>validFrom</td>
        <td>String</td>
        <td>Date de début de validité</td>
      </tr>
      <tr>
        <td>validUntil</td>
        <td>String</td>
        <td>Date de fin de validité</td>
      </tr>
      <tr>
        <td>issuingMunicipality</td>
        <td>String</td>
        <td>Commune de délivrance</td>
      </tr>
      <tr>
        <td>nationalNumber</td>
        <td>String</td>
        <td>Numéro national (NISS)</td>
      </tr>
      <tr>
        <td>lastName</td>
        <td>String</td>
        <td>Nom de famille</td>
      </tr>
      <tr>
        <td>firstNames</td>
        <td>String</td>
        <td>Prénoms</td>
      </tr>
      <tr>
        <td>suffix</td>
        <td>String</td>
        <td>Suffixe</td>
      </tr>
      <tr>
        <td>nationality</td>
        <td>String</td>
        <td>Nationalité</td>
      </tr>
      <tr>
        <td>birthPlace</td>
        <td>String</td>
        <td>Lieu de naissance</td>
      </tr>
      <tr>
        <td>birthDate</td>
        <td>String</td>
        <td>Date de naissance</td>
      </tr>
      <tr>
        <td>gender</td>
        <td>String</td>
        <td>Sexe (M/F)</td>
      </tr>
      <tr>
        <td>street</td>
        <td>String</td>
        <td>Adresse (rue et numéro)</td>
      </tr>
      <tr>
        <td>postalCode</td>
        <td>String</td>
        <td>Code postal</td>
      </tr>
      <tr>
        <td>city</td>
        <td>String</td>
        <td>Localité</td>
      </tr>
      <tr>
        <td>photo</td>
        <td>String</td>
        <td>Photo en base64 (data:image/jpeg;base64,...)</td>
      </tr>
      <tr>
        <td>state</td>
        <td>String</td>
        <td>État de la lecture (SUCCESS/ERROR)</td>
      </tr>
      <tr>
        <td>error</td>
        <td>String</td>
        <td>Message d'erreur (si applicable)</td>
      </tr>
    </tbody>
  </table>

  <h2 class="h2">Méthodes exposées</h2>
  <table class="t-default">
    <thead>
      <tr>
        <th>Nom</th>
        <th>Paramètres</th>
        <th>Description</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>readCard</td>
        <td>-</td>
        <td>Déclenche manuellement la lecture de la carte.</td>
      </tr>
    </tbody>
  </table>

  <h2 class="h2">Exemple</h2>
  <p class="my-10">
    <i class="fa-solid fa-info-circle color-warning"></i>
    Ce composant nécessite un lecteur de carte eID et l'application BeID pour fonctionner. La
    démonstration ci-dessous ne fonctionnera pas sans ces prérequis.
  </p>

  <div class="my-15 p-15 bg-light border-radius-5">
    <p class="mb-10 fw-700">Démonstration</p>
    <BeidCardReader
      @card-read="handleCardRead"
      @error="handleError"
    />

    <div
      v-if="cardData"
      class="mt-15 p-10 bg-white border-radius-5"
    >
      <div class="d-flex g-15 a-center">
        <img
          v-if="cardData.photo"
          :src="cardData.photo"
          alt="Photo"
          class="border-radius-5"
          style="width: 80px; height: auto"
        />
        <div>
          <p class="fw-700">{{ cardData.lastName }} {{ cardData.firstNames }}</p>
          <p class="fs-300">{{ cardData.nationalNumber }}</p>
          <p class="fs-300">{{ cardData.street }}, {{ cardData.postalCode }} {{ cardData.city }}</p>
        </div>
      </div>
    </div>

    <div
      v-if="lastError"
      class="mt-15 p-10 bg-danger-light color-danger border-radius-5"
    >
      Erreur: {{ lastError.message }}
    </div>
  </div>

  <h2 class="h2">Code</h2>
  <h3 class="h3">Utilisation de base</h3>
  <CodeHtml>
    <scriptBalise v-pre>
      import BeidCardReader from
      '@brugmann/vuemann/src/apis/beid/views/BeidCardReaderComponent.vue'; import { ref } from
      'vue'; const cardData = ref(null); const handleCardRead = (data) => { cardData.value = data;
      console.log('Carte lue:', data.lastName, data.firstNames); }; const handleError = (error) => {
      console.error('Erreur:', error.message); };
    </scriptBalise>
    <template v-pre>
      <BeidCardReader
        @cardRead="handleCardRead"
        @error="handleError"
      />

      <div
        v-if="cardData"
        class="card-display"
      >
        <img
          :src="cardData.photo"
          alt="Photo"
        />
        <p>{{ cardData.lastName }} {{ cardData.firstNames }}</p>
        <p>{{ cardData.nationalNumber }}</p>
      </div>
    </template>
  </CodeHtml>

  <h3 class="h3">Avec personnalisation du bouton</h3>
  <CodeHtml>
    <template v-pre>
      <BeidCardReader
        buttonClass="btn btn-success btn-lg"
        @cardRead="handleCardRead"
      />
    </template>
  </CodeHtml>
</template>
