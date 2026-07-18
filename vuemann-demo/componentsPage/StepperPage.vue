<script setup>
import { ref, markRaw, h } from 'vue'
import CodeHtml from '@brugmann/vuemann/src/components/codeHtml/CodeHtmlComponent.vue'
import Stepper from '@brugmann/vuemann/src/components/stepper/StepperComponent.vue'

// ADR-006 (memory-bank/decisions/ADR-006-demo-components-inline-render.md)
const StepOne = markRaw({
  props: ['modelValue'],
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    const onInput = event => {
      emit('update:modelValue', { ...props.modelValue, name: event.target.value })
    }
    return () =>
      h('div', [
        h('h3', { class: 'h3 mb-15' }, 'Étape 1: Informations personnelles'),
        h('div', { class: 'form-row' }, [
          h('label', { class: 'form-label' }, 'Nom'),
          h('input', {
            type: 'text',
            class: 'form-input',
            value: props.modelValue.name,
            onInput,
          }),
        ]),
      ])
  },
})

const StepTwo = markRaw({
  props: ['modelValue'],
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    const onInput = event => {
      emit('update:modelValue', { ...props.modelValue, email: event.target.value })
    }
    return () =>
      h('div', [
        h('h3', { class: 'h3 mb-15' }, 'Étape 2: Coordonnées'),
        h('div', { class: 'form-row' }, [
          h('label', { class: 'form-label' }, 'Email'),
          h('input', {
            type: 'email',
            class: 'form-input',
            value: props.modelValue.email,
            onInput,
          }),
        ]),
      ])
  },
})

const StepThree = props =>
  h('div', [
    h('h3', { class: 'h3 mb-15' }, 'Étape 3: Récapitulatif'),
    h('p', [h('strong', 'Nom : '), props.modelValue.name]),
    h('p', [h('strong', 'Email : '), props.modelValue.email]),
  ])
StepThree.props = ['modelValue']

const formData = ref({
  name: '',
  email: '',
})

const steps = [
  {
    key: 'personal',
    label: 'Infos personnelles',
    icon: 'fa-solid fa-user',
    component: StepOne,
  },
  {
    key: 'contact',
    label: 'Coordonnées',
    icon: 'fa-solid fa-envelope',
    component: StepTwo,
  },
  {
    key: 'review',
    label: 'Récapitulatif',
    icon: 'fa-solid fa-check',
    component: StepThree,
  },
]

const DEMO_DELAY_MS = 1000

const handleSubmit = async () => {
  await new Promise(resolve => setTimeout(resolve, DEMO_DELAY_MS))
  globalThis.alert('Formulaire envoyé !')
}
</script>

<template>
  <h1 class="h1">Component Stepper</h1>
  <p class="my-10">
    Composant d'assistant multi-étapes avec navigation intégrée, validation et intégration
    DialogComponent pour la confirmation d'annulation.
  </p>

  <h2 class="h2">Dépendances</h2>
  <p>Ce composant utilise :</p>
  <ul>
    <li>
      <span class="badge-code">DialogComponent</span> - Pour la modale de confirmation d'annulation
    </li>
    <li>
      <span class="badge-code">t()</span> - Service de traduction pour les libellés des boutons
    </li>
    <li>
      <span class="badge-code">router</span> - L'action d'annulation par défaut redirige vers
      l'accueil
    </li>
  </ul>

  <h2 class="h2">Propriétés</h2>
  <table class="t-default mb-15 w-100">
    <thead>
      <tr>
        <th>Nom</th>
        <th>Type</th>
        <th>Requis</th>
        <th>Défaut</th>
        <th>Description</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>steps</td>
        <td>Array</td>
        <td>Oui</td>
        <td>-</td>
        <td>Tableau d'objets étape définissant le flux de l'assistant</td>
      </tr>
      <tr>
        <td>title</td>
        <td>String</td>
        <td>-</td>
        <td>''</td>
        <td>Titre optionnel affiché au-dessus du stepper</td>
      </tr>
      <tr>
        <td>modelValue</td>
        <td>Object</td>
        <td>Oui</td>
        <td>-</td>
        <td>Objet de données du formulaire (v-model)</td>
      </tr>
      <tr>
        <td>onSubmit</td>
        <td>Function</td>
        <td>Oui</td>
        <td>-</td>
        <td>Fonction asynchrone appelée lors de la soumission finale</td>
      </tr>
      <tr>
        <td>onCancel</td>
        <td>Function</td>
        <td>-</td>
        <td>reset()</td>
        <td>
          Fonction appelée lorsque l'annulation est confirmée. Si fournie, le stepper ne
          réinitialise rien lui-même (contrôle au consommateur). Sinon, il appelle reset() (données
          vidées + étape 0).
        </td>
      </tr>
      <tr>
        <td>defaultForm</td>
        <td>Object</td>
        <td>-</td>
        <td>{}</td>
        <td>
          Valeur "vide" de référence vers laquelle reset() réinitialise le v-model (copie profonde).
        </td>
      </tr>
    </tbody>
  </table>

  <h2 class="h2">Structure de l'objet Step</h2>
  <table class="t-default mb-15 w-100">
    <thead>
      <tr>
        <th>Propriété</th>
        <th>Type</th>
        <th>Requis</th>
        <th>Description</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>key</td>
        <td>String</td>
        <td>Oui</td>
        <td>Identifiant unique de l'étape</td>
      </tr>
      <tr>
        <td>label</td>
        <td>String</td>
        <td>Oui</td>
        <td>Libellé affiché pour l'indicateur d'étape</td>
      </tr>
      <tr>
        <td>icon</td>
        <td>String</td>
        <td>-</td>
        <td>Classe d'icône FontAwesome (défaut : fa-solid fa-circle)</td>
      </tr>
      <tr>
        <td>component</td>
        <td>Component</td>
        <td>Oui</td>
        <td>Composant Vue à afficher pour cette étape</td>
      </tr>
      <tr>
        <td>validation</td>
        <td>Function</td>
        <td>-</td>
        <td>Fonction de validation : (modelValue) =&gt; &#123; valid: boolean &#125;</td>
      </tr>
      <tr>
        <td>onLeave</td>
        <td>Function</td>
        <td>-</td>
        <td>
          Hook appelé juste avant la transition vers l'étape suivante, après validation :
          (modelValue) =&gt; void. Peut muter modelValue. Uniquement sur transition avant via le
          bouton Suivant (pas Précédent, pas goToStep, pas soumission).
        </td>
      </tr>
    </tbody>
  </table>

  <h2 class="h2">Événements émis</h2>
  <table class="t-default mb-15 w-100">
    <thead>
      <tr>
        <th>Événement</th>
        <th>Payload</th>
        <th>Description</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>update:modelValue</td>
        <td>Object</td>
        <td>Émis lorsque les données du formulaire changent (support v-model)</td>
      </tr>
    </tbody>
  </table>

  <h2 class="h2">Méthodes exposées</h2>
  <h4 class="h4"><i class="fa-solid fa-diamond mr-5"></i>goToStep(index)</h4>
  <p>Navigue programmatiquement vers une étape spécifique par son index.</p>

  <h4 class="h4"><i class="fa-solid fa-diamond mr-5"></i>reset()</h4>
  <p>Réinitialise le stepper à la première étape (index 0).</p>

  <h4 class="h4"><i class="fa-solid fa-diamond mr-5"></i>currentStep</h4>
  <p>Ref en lecture seule contenant l'index de l'étape courante.</p>

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
        <td>confirm-dialog</td>
        <td>
          Contenu personnalisé pour la modale de confirmation d'annulation. Par défaut : message de
          confirmation avec boutons Oui/Non.
        </td>
      </tr>
    </tbody>
  </table>

  <h2 class="h2">Fonctionnalités</h2>

  <h3 class="h3"><i class="fa-solid fa-diamond mr-5"></i>Navigation entre étapes</h3>
  <ul>
    <li>
      <strong>Bouton Suivant</strong> : Avance à l'étape suivante (valide d'abord l'étape courante)
    </li>
    <li><strong>Bouton Précédent</strong> : Retourne à l'étape précédente</li>
    <li><strong>Clic sur une étape complétée</strong> : Navigue vers cette étape</li>
    <li><strong>Bouton Envoyer</strong> : Apparaît à la dernière étape, appelle onSubmit</li>
  </ul>

  <h3 class="h3"><i class="fa-solid fa-diamond mr-5"></i>Validation</h3>
  <p>
    Chaque étape peut avoir une fonction <span class="badge-code">validation</span> qui reçoit le
    modelValue courant. La fonction doit retourner un objet avec une propriété booléenne
    <span class="badge-code">valid</span>. Si la validation échoue, l'utilisateur ne peut pas passer
    à l'étape suivante.
  </p>

  <h3 class="h3"><i class="fa-solid fa-diamond mr-5"></i>État de chargement</h3>
  <p>
    Pendant la soumission asynchrone, tous les boutons sont désactivés pour éviter les
    double-soumissions. L'état <span class="badge-code">isSubmitting</span> est géré
    automatiquement.
  </p>

  <h3 class="h3"><i class="fa-solid fa-diamond mr-5"></i>Confirmation d'annulation</h3>
  <p>
    Lorsque l'utilisateur clique sur Annuler, une modale de confirmation DialogComponent apparaît.
    La fonction <span class="badge-code">onCancel</span> n'est appelée que lorsque l'utilisateur
    confirme. Utilisez le slot <span class="badge-code">#confirm-dialog</span> pour personnaliser le
    contenu de la modale.
  </p>

  <h2 class="h2">Exemple</h2>
  <Stepper
    title="Assistant d'inscription"
    :steps="steps"
    :modelValue="formData"
    :onSubmit="handleSubmit"
    :defaultForm="{ name: '', email: '' }"
    @update:modelValue="formData = $event"
  />

  <!-- eslint-disable -->
  <CodeHtml class="my-15">
    <scriptBalise v-pre>
      import Stepper from '@brugmann/vuemann/src/components/stepper/StepperComponent.vue' \n \n
      const formData = ref({ name: '', email: '' }) \n \n const steps = [ \n { \n key: 'personal',
      \n label: 'Infos personnelles', \n icon: 'fa-solid fa-user', \n component: StepOne, \n
      validation: (data) => ({ valid: data.name.trim().length > 0 }) \n }, \n { key: 'contact',
      label: 'Coordonnées', component: StepTwo }, \n { key: 'review', label: 'Récapitulatif',
      component: StepThree } \n ] \n \n const handleSubmit = async () => { \n await
      api.submit(formData.value) \n }
    </scriptBalise>
    <template v-pre>
      <Stepper
        title="Assistant d'inscription"
        :steps="steps"
        :modelValue="formData"
        :onSubmit="handleSubmit"
        :defaultForm="{ name: '', email: '' }"
        @update:modelValue="formData = $event"
      />
    </template>
  </CodeHtml>
  <!-- eslint-enable -->

  <h2 class="h2">Navigation clavier</h2>
  <p>
    Le stepper intègre une navigation clavier automatique via le composable
    <span class="badge-code">useStepperKeyboardNavigation</span> :
  </p>
  <ul>
    <li>
      <strong>Tab</strong> depuis le dernier champ interactif d'une étape : le focus passe au bouton
      Suivant (ou Envoyer à la dernière étape)
    </li>
    <li>
      <strong>Enter</strong> sur le dernier champ interactif (sauf textarea) : déclenche Suivant ou
      Envoyer
    </li>
    <li>
      <strong>Changement d'étape</strong> : le focus se place automatiquement sur le premier champ
      interactif de la nouvelle étape
    </li>
  </ul>
  <p>
    Éléments interactifs détectés : <span class="badge-code">input</span> (sauf hidden et
    tabindex="-1"), <span class="badge-code">select</span>,
    <span class="badge-code">textarea</span>, <span class="badge-code">[role="switch"]</span>,
    <span class="badge-code">[role="combobox"]</span>,
    <span class="badge-code">[role="listbox"]</span>, <span class="badge-code">button.switch</span>
  </p>

  <h2 class="h2">Contrôle programmatique</h2>
  <p>Utilisez les méthodes exposées via une ref de template :</p>
  <!-- eslint-disable -->
  <CodeHtml class="my-15">
    <scriptBalise v-pre>
      const stepperRef = ref() \n \n // Naviguer vers l'étape 2 \n stepperRef.value.goToStep(2) \n
      \n // Réinitialiser à la première étape \n stepperRef.value.reset() \n \n // Lire l'étape
      courante (lecture seule) \n console.log(stepperRef.value.currentStep)
    </scriptBalise>
  </CodeHtml>
  <!-- eslint-enable -->

  <h2 class="h2">Modale de confirmation personnalisée</h2>
  <p>Remplacez la confirmation d'annulation par défaut avec le slot #confirm-dialog :</p>
  <!-- eslint-disable -->
  <CodeHtml class="my-15">
    <template v-pre>
      <Stepper ...>
        <template #confirm-dialog>
          <p>Êtes-vous sûr de vouloir quitter ? Toutes les données seront perdues.</p>
          <button @click="confirmDialog.close()">Rester</button>
          <button @click="handleConfirmCancel">Quitter</button>
        </template>
      </Stepper>
    </template>
  </CodeHtml>
  <!-- eslint-enable -->
</template>
