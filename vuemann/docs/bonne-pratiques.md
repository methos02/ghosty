# Guide de Développement et Mise à Jour - Application Vue.js QOP

## Philosophie et Principes Fondamentaux

### Architecture Native JavaScript : Privilégier la Portabilité

**Principe fondamental** : La logique JavaScript doit être placée autant que possible dans des fichiers `.js` natifs pour faciliter une éventuelle migration vers un autre framework.

**Organisation recommandée** :
```
src/
├── apis/
│   └── qop/
│       ├── controllers/        # Logique métier en .js natif
│       ├── repositories/       # Accès aux données en .js natif (avec helpers Vuemann)
│       ├── dtos/              # Transformations en .js natif
│       ├── formRequest/       # Validation en .js natif (avec helpers Vuemann)
│       ├── services/          # Services métier en .js natif (orchestration)
│       └── stores/            # Stores Pinia minimalistes
├── functions/                 # Fonctions utilitaires en .js natif
├── config/                    # Configuration en .js natif
├── datas/                     # Données statiques en .js natif
└── views/                     # Composants Vue (avec helpers Vuemann : t, form, error)
```

**Avantages de cette approche** :
- ✅ **Portabilité** : Code réutilisable avec n'importe quel framework frontend
- ✅ **Testabilité** : Logique JavaScript pure plus facile à tester
- ✅ **Maintenabilité** : Séparation claire entre logique métier et présentation
- ✅ **Lisibilité** : Architecture claire et prévisible

```javascript
// ✅ EXCELLENT : Contrôleur qui utilise Repository + DTO
export const OperationController = {
  async list(filters = {}) {
    // 1. Transformation des filtres via DTO
    const apiFilters = OperationDto.toList(filters)
    
    // 2. Appel au repository (SEUL endroit pour les appels API)
    const response = await OperationRepository.list(apiFilters)
    if(response.status !== STATUS.SUCCESS) { return response }

    // 3. Transformation des données via DTO
    return {
      operations: response.data.map(operation => OperationDto.fromShow(operation)),
      status: STATUS.SUCCESS
    }
  }
}

// ❌ INTERDIT : Appels API directs dans les contrôleurs
export const BadOperationController = {
  async list(filters = {}) {
    // ❌ Ne jamais faire d'appel direct dans un contrôleur
    const response = await req('operation.list', { params: filters })
    // ...
  }
}

// ❌ ÉVITER : Logique métier dans les composants Vue
<script setup>
// Ne pas mettre de logique complexe ici
const fetchOperations = async () => {
  // Logique qui devrait être dans un contrôleur
}
</script>
```

### Stores Pinia Minimalistes : Stockage de Données Uniquement

**Règle absolue** : Les stores Pinia doivent uniquement servir à stocker des données via des getters, setters et transformations simples. Ils ne doivent pas contenir de logique métier.

**Structure type d'un store** :
```javascript
// ✅ EXCELLENT : Store simple et focalisé
import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useOperationsStore = defineStore('operations', () => {
  const operations = ref([])

  const setOperations = (newOperations) => {
    operations.value = newOperations
  }

  const addOperation = (operation) => {
    operations.value.push(operation)
  }

  const clearOperations = () => {
    operations.value = []
  }

  return {
    operations,
    setOperations,
    addOperation,
    clearOperations
  }
})

// ❌ INTERDIT : Logique métier dans le store
export const useOperationsStore = defineStore('operations', () => {
  // ❌ Ne jamais faire d'appels API dans un store
  const fetchOperations = async () => {
    const response = await fetch('/api/operations')
    // ...
  }
  
  // ❌ Ne jamais mettre de logique de validation
  const validateOperation = (operation) => {
    // ...
  }
})
```

**Responsabilités des stores** :
- ✅ **Stockage** : Conserver l'état des données
- ✅ **Getters simples** : Accès aux données
- ✅ **Setters simples** : Modification des données
- ✅ **Transformations basiques** : Push, filter, map simple
- ❌ **Appels API** : À déléguer exclusivement aux repositories
- ❌ **Logique métier** : À déléguer aux contrôleurs
- ❌ **Validation** : À déléguer aux formRequest

**Architecture stricte** :
```
Vue Components → Controllers → Repositories → API
                     ↓
                   DTOs (transformation)
                     ↓
                  Stores (stockage)
```

### Découpage Fin et Cohérent des Views

**Principe** : Avoir un découpage fin et cohérent des views pour assurer lisibilité et réutilisabilité.

**Organisation des composants** :
```
src/views/
└── qop/
    ├── pages/                 # Pages principales
    │   ├── ListOperationsPage.vue
    │   ├── FilterOperationsPage.vue
    │   └── parts/             # Sous-composants spécifiques à une page
    │       ├── OperationsCardComponent.vue
    │       ├── ListOperationsSearchComponent.vue
    │       └── FilterOperationsSearchComponent.vue
    └── shared/                # Composants partagés (si nécessaire)
```

**Règles de découpage** :
- ✅ **Pages** : Composants de niveau route, orchestrent les interactions
- ✅ **Parts** : Composants spécifiques à une page, responsabilité unique
- ✅ **Props typées** : Toujours définir les props avec `required: true` quand nécessaire
- ✅ **Émission d'événements** : Pour la communication parent-enfant
- ✅ **Structure sémantique** : Utiliser des attributs `data-*` pour structurer

```vue
<!-- ✅ EXCELLENT : Composant avec responsabilité claire -->
<script setup>
import { t } from '@brugmann/vuemann/src/services/services-helper.js'

defineProps({
  operation: { type: Object, required: true },
  type: { type: String, required: true }
})
</script>

<template>
  <div 
    class="operation-card"
    data-card="container"
  >
    <div 
      data-card="header"
      class="operation-card_header"
    >
      <!-- Contenu structuré -->
    </div>
  </div>
</template>

<!-- ❌ ÉVITER : Composant trop générique ou trop complexe -->
<script setup>
// Composant qui fait trop de choses différentes
defineProps({
  data: { type: [Object, Array, String] }, // ❌ Trop générique
  showHeader: { type: Boolean }, // ❌ Props optionnelles non nécessaires
  onlyRequired: { type: Boolean, default: false }
})
</script>
```

### Anti Over-Engineering : Simplicité et Directement

**Règle d'or** : Le code doit rester simple et direct. Il est inutile d'anticiper des cas d'usage non existants.

**Principes KISS (Keep It Simple, Stupid)** :
- ✅ **Solution directe** : Résoudre le problème actuel, pas les problèmes futurs hypothétiques
- ✅ **Code lisible** : Privilégier la clarté à la sophistication
- ✅ **Patterns simples** : Utiliser les patterns éprouvés sans sur-complexification
- ✅ **Éviter les fonctions intermédiaires** : Supprimer les fonctions qui ne font que déléguer
- ❌ **Abstraction prématurée** : Ne pas créer d'abstractions avant d'en avoir vraiment besoin
- ❌ **Optimisation prématurée** : Ne pas optimiser avant d'identifier un vrai problème de performance

```javascript
// ✅ EXCELLENT : Solution simple et directe
const formatPatient = (operation) => {
  return {
    lastName: operation.cnom,
    firstName: operation.cprenom,
    fullName: `${operation.cnom.toUpperCase()} ${operation.cprenom.toLowerCase()}`,
    birthDate: dateHelper.formatDate(operation.dddn, 'YYYY/MM/DD')
  }
}

// ❌ OVER-ENGINEERING : Solution trop complexe pour le besoin
class PatientFormatter {
  constructor(config) {
    this.config = config
    this.strategies = new Map()
    this.middleware = []
  }
  
  addStrategy(type, strategy) {
    this.strategies.set(type, strategy)
  }
  
  format(operation, type = 'default') {
    // Complexité non justifiée pour formater un patient
  }
}

// ❌ ÉVITER : Fonctions intermédiaires qui ne font que déléguer
const getDataDefinition = async (data, filters) => {
  const content = buildContent(data)
  return service.getDefinition(content, filters)  // Juste une délégation
}

const processData = async (data, filters) => {
  const definition = await getDataDefinition(data, filters)  // Indirection inutile
  return processDefinition(definition)
}

// ✅ EXCELLENT : Fusion des fonctions simples
const processData = async (data, filters) => {
  const content = buildContent(data)
  const definition = await service.getDefinition(content, filters)
  return processDefinition(definition)
}
```

### Code Auto-Documenté : Pas de Commentaires

**Principe** : Le code doit être auto-documenté et suffisamment lisible. Les commentaires sont à éviter, sauf exception rare.

**Règles de lisibilité** :
- ✅ **Noms explicites** : Variables et fonctions doivent expliquer leur purpose
- ✅ **Fonctions courtes** : Une responsabilité par fonction
- ✅ **Structure claire** : Organisation logique du code
- ❌ **Commentaires explicatifs** : Le code doit se suffire à lui-même
- ❌ **Commentaires de TODO** : À traiter immédiatement ou supprimer

```javascript
// ✅ EXCELLENT : Code auto-documenté
const getNextWeekFriday = () => {
  const today = new Date()
  const currentDay = today.getDay()
  const daysUntilNextFriday = (8 - currentDay) + 4
  
  const nextFriday = new Date()
  nextFriday.setDate(today.getDate() + daysUntilNextFriday)
  
  return dateHelper.formatDate(nextFriday, 'YYYY-MM-DD')
}

// ❌ ÉVITER : Code nécessitant des commentaires
const calc = (d) => {
  // Calcule le nombre de jours jusqu'au vendredi prochain
  const cd = d.getDay()
  // On avance jusqu'à lundi prochain puis +4 pour vendredi
  const days = (8 - cd) + 4
  // ...
}

// ✅ EXCEPTION ACCEPTÉE : Commentaire pour ESLint
//eslint-disable-next-line no-magic-numbers
const daysUntilNextFriday = (8 - currentDay) + 4
```

### Principe de Retour Anticipé (Early Return) - JAMAIS de else/else if

**Règle STRICTE** : **INTERDICTION ABSOLUE** d'utiliser `else` ou `else if` en JavaScript. Toujours utiliser le principe de retour anticipé (early return) avec des guard clauses.

**Important** : Cette règle s'applique UNIQUEMENT au code JavaScript. Les templates Vue peuvent continuer à utiliser `v-if`, `v-else-if`, `v-else` car ce sont des directives déclaratives.

#### Early Return Concis : Guard Clauses sur Une Ligne

**Règle spécifique** : Pour les guard clauses simples (validations, early returns), privilégier le format concis sur une ligne pour améliorer la lisibilité.

```javascript
// ✅ EXCELLENT : Guard clauses concises et lisibles
const generateReport = async (operations, filters = {}) => {
  if (operations.length === 0) { errorT('errors.pdf.no_data'); return }
  if (!filters.dateFrom) { errorT('errors.date.required'); return }
  if (status !== 'valid') { return false }

  // Suite de la logique métier...
  const result = await processOperations(operations)
  return result
}

// ❌ ÉVITER : Guard clauses trop verbeuses pour des cas simples
const generateReport = async (operations, filters = {}) => {
  if (operations.length === 0) { 
    errorT('errors.pdf.no_data')
    return
  }
  if (!filters.dateFrom) { 
    errorT('errors.date.required')
    return
  }
  
  // Logique métier noyée dans les validations...
}
```

**Quand utiliser le format concis** :
- ✅ **Validations simples** : 1-2 actions maximum (error + return, return simple)
- ✅ **Guard clauses** : Conditions de sortie précoce
- ✅ **Vérifications** : Données manquantes, états invalides
- ✅ **Actions atomiques** : Une seule instruction par condition

**Quand utiliser le format détaillé** :
- ❌ **Logique complexe** : Plus de 2 instructions
- ❌ **Conditions imbriquées** : Multiple niveaux de vérification
- ❌ **Transformations** : Manipulation de données avant retour

#### Pattern Recommandé Général

```javascript
// ✅ EXCELLENT : Early return pattern complet
const list = async (filters = {}) => {
  const response = await OperationRepository.list(OperationDto.toList(filters))
  if(response.status !== STATUS.SUCCESS) { return response }

  return {
    operations: response.data.map(operation => OperationDto.fromShow(operation)),
    status: STATUS.SUCCESS
  }
}

const validate = (operation) => {
  if (!operation) { return { isValid: false, error: 'Operation required' } }
  if (!operation.date) { return { isValid: false, error: 'Date required' } }
  if (!operation.surgeon) { return { isValid: false, error: 'Surgeon required' } }
  
  return { isValid: true }
}

// ❌ INTERDIT : Imbrication excessive avec else
const validate = (operation) => {
  if (operation) {
    if (operation.date) {
      if (operation.surgeon) {
        return { isValid: true }
      } else {
        return { isValid: false, error: 'Surgeon required' }
      }
    } else {
      return { isValid: false, error: 'Date required' }
    }
  } else {
    return { isValid: false, error: 'Operation required' }
  }
}

// ❌ INTERDIT : Utilisation de else if
const getStatusLabel = (status) => {
  if (status === 'pending') {
    return 'En attente'
  } else if (status === 'approved') {
    return 'Approuvé'
  } else if (status === 'rejected') {
    return 'Rejeté'
  } else {
    return 'Inconnu'
  }
}

// ✅ CORRECT : Remplacement par early returns
const getStatusLabel = (status) => {
  if (status === 'pending') return 'En attente'
  if (status === 'approved') return 'Approuvé'
  if (status === 'rejected') return 'Rejeté'

  return 'Inconnu'
}
```

### Nommage Contextuel : Éviter la Redondance

**Règle** : Éviter la redondance dans les noms de fonctions quand le contexte (objet parent) est suffisamment explicite.

```javascript
// ✅ EXCELLENT : Noms concis grâce au contexte
operationListingPdf.download(data, filters)
operationWaitingPdf.download(data, filters)
userController.create(userData)
operationRepository.getById(id)

// ❌ ÉVITER : Redondance inutile
operationListingPdf.downloadOperationsListing(data, filters)  // "operations" et "listing" déjà dans l'objet
operationWaitingPdf.downloadOperationsWaiting(data, filters)  // "operations" et "waiting" déjà dans l'objet
userController.createUser(userData)                           // "user" déjà dans l'objet
operationRepository.getOperationById(id)                      // "operation" déjà dans l'objet
```

**Avantages du nommage contextuel** :
- ✅ **Lisibilité** : Code plus fluide et naturel
- ✅ **Concision** : Moins de répétition
- ✅ **Maintenabilité** : Changements d'objets n'impactent que le nom d'objet
- ✅ **Cohérence** : Pattern uniforme dans toute l'application

**Application dans les exports** :
```javascript
// ✅ EXCELLENT : Méthodes courtes dans l'export
export const operationListingPdf = {
  download,           // au lieu de downloadOperationsListing
  getDefinition,      // au lieu de getOperationsListingDefinition
  buildContent        // au lieu de buildOperationsContent
}

export const userController = {
  list,               // au lieu de listUsers
  create,             // au lieu de createUser
  update,             // au lieu de updateUser
  delete              // au lieu de deleteUser
}
```

**Application dans les templates Vue** :
```vue
<template>
  <div>
    <!-- ✅ EXCELLENT : Conditions de garde en premier -->
    <div v-if="isLoading" class="loading">
      {{ t('list-operations.loading') }}
    </div>
    
    <div v-else-if="operations.length === 0" class="no-results">
      {{ t('list-operations.no_results') }}
    </div>
    
    <div v-else class="results">
      <!-- Contenu principal -->
    </div>
  </div>
</template>
```

### Testabilité : Appels Internes via l'Objet Exporté

**Règle** : Pour améliorer la testabilité, toujours utiliser l'objet exporté pour les appels internes de fonctions, ce qui permet d'utiliser `spyOn` dans les tests.

```javascript
// ✅ EXCELLENT : Appels internes via l'objet exporté
const buildRow = operation => {
  return [
    { text: operation.date, style: 'tableCell' },
    { text: operation.number, style: 'tableCell' },
    { text: userService.buildFullName(operation.patient), style: 'tableCell' },  // Appel externe normal
    { text: operationWaitingPdf.interventionText(operation.interventions), style: 'tableCell' }  // Appel interne via objet
  ]
}

const buildTable = operations => {
  const rows = operations.map(operation => operationWaitingPdf.buildRow(operation))  // Appel interne via objet
  return pdfService.buildGenericTable(tableParameters, rows)
}

export const operationWaitingPdf = {
  download,
  buildRow,
  buildTable,
  interventionText
}

// ❌ ÉVITER : Appels internes directs (difficiles à mock dans les tests)
const buildRow = operation => {
  return [
    { text: operation.date, style: 'tableCell' },
    { text: interventionText(operation.interventions), style: 'tableCell' }  // Appel direct, pas mockable
  ]
}

const buildTable = operations => {
  const rows = operations.map(operation => buildRow(operation))  // Appel direct, pas mockable
  return pdfService.buildGenericTable(tableParameters, rows)
}
```

**Avantages pour les tests** :
- ✅ **Isolation** : Possibilité de mocker individuellement chaque fonction interne
- ✅ **Spying** : Vérification des appels avec `vi.spyOn(objet, 'méthode')`
- ✅ **Contrôle** : Mock des retours de fonctions pour tester différents scénarios
- ✅ **Debugging** : Traçage précis des appels dans les tests

**Exemple d'utilisation dans les tests** :
```javascript
// ✅ Test possible grâce aux appels via l'objet exporté
it('should call buildRow for each operation', () => {
  vi.spyOn(operationWaitingPdf, 'buildRow').mockReturnValue(['mocked', 'row'])
  
  const operations = [{ id: 1 }, { id: 2 }]
  operationWaitingPdf.buildTable(operations)
  
  expect(operationWaitingPdf.buildRow).toHaveBeenCalledTimes(2)
  expect(operationWaitingPdf.buildRow).toHaveBeenNthCalledWith(1, { id: 1 })
  expect(operationWaitingPdf.buildRow).toHaveBeenNthCalledWith(2, { id: 2 })
})
```

### Configuration Centralisée : Pattern tableParameters

**Règle** : Centraliser toute la configuration des tableaux PDF dans un objet `tableParameters` unique, facilitant la maintenance et la cohérence.

```javascript
// ✅ EXCELLENT : Configuration centralisée
const tableParameters = {
    title: 'OPERATIONS EN ATTENTE DE PROGRAMMATION',
    header: [
        'Date cible',
        'Dossier', 
        'Patient',
        'Date naissance',
        'Intervention / Service / Docteur'
    ],
    row_number: "Nombre total d'opérations en attente",  // String pour activer le comptage
    widths: [60, 50, 120, 60, 200],
}

// ✅ Utilisation dans les fonctions
const buildTable = operations => {
  const rows = operations.map(operation => operationWaitingPdf.buildRow(operation))
  return pdfService.buildGenericTable(tableParameters, rows)
}

const download = async (data, searchFilters = {}) => {
  const content = operationWaitingPdf.buildTable(data)
  const documentDefinition = await pdfService.getPdfDefinition(tableParameters, content, searchFilters)
  // ...
}

// ❌ ÉVITER : Configuration dispersée
const headers = ['Date cible', 'Dossier', 'Patient']  // ❌ Séparé
const widths = [60, 50, 120]                         // ❌ Séparé
const title = 'OPERATIONS EN ATTENTE'                // ❌ Séparé

const buildTable = operations => {
  // ❌ Reconstruction manuelle de la configuration
  return pdfService.buildGenericTable({ header: headers, widths: widths }, rows)
}
```

**Avantages du pattern tableParameters** :
- ✅ **Centralisation** : Toute la configuration du tableau au même endroit
- ✅ **Cohérence** : Garantit la synchronisation entre header, widths, et title
- ✅ **Maintenance** : Modification en un seul endroit
- ✅ **Réutilisabilité** : Configuration passée facilement entre fonctions
- ✅ **Options intégrées** : `row_number` pour le comptage automatique

**Configuration complète** :
```javascript
const tableParameters = {
    title: 'Titre du rapport',           // Titre affiché en en-tête
    header: ['Col1', 'Col2', 'Col3'],    // En-têtes des colonnes
    widths: [100, 150, 200],             // Largeurs des colonnes
    row_number: "Texte de comptage",     // String = comptage activé, false = pas de comptage
}
```

## Architecture et Organisation du Code

### Flux de Données : Séparation Stricte des Responsabilités

**Architecture en couches** avec séparation stricte des responsabilités :

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐    ┌─────────────┐
│  Vue Components │───▶│   Controllers    │───▶│   Repositories  │───▶│     API     │
│                 │    │                  │    │                 │    │             │
│ - Affichage     │    │ - Logique métier │    │ - Appels HTTP   │    │ - Serveur   │
│ - Interaction   │    │ - Orchestration  │    │ - req() helper  │    │ - Base de   │
│ - t(), form()   │    │ - Early return   │    │ - Filtrage      │    │   données   │
└─────────────────┘    └──────────────────┘    └─────────────────┘    └─────────────┘
         │                        │                        │
         ▼                        ▼                        │
┌─────────────────┐    ┌──────────────────┐                │
│     Stores      │    │      DTOs        │                │
│                 │    │                  │                │
│ - Stockage seul │    │ - Transformations│                │
│ - Getters/      │    │ - API ↔ Vue      │                │
│   Setters       │    │ - fromShow()     │                │
│ - PAS d'API     │    │ - toList()       │                │
└─────────────────┘    └──────────────────┘                │
                                │                           │
                                ▼                           │
                    ┌──────────────────┐                    │
                    │   FormRequest    │                    │
                    │                  │                    │
                    │ - Validation     │                    │
                    │ - validateForm() │                    │
                    │ - Règles métier  │                    │
                    └──────────────────┘                    │
                                                           │
                    ┌──────────────────┐                    │
                    │    Services      │────────────────────┘
                    │                  │
                    │ - Orchestration  │
                    │ - Multi-contrôl. │
                    │ - error() helper │
                    └──────────────────┘
```

**Règles absolues** :
- ❌ **Repositories** : SEULS à utiliser `req()` pour les appels API
- ❌ **Controllers** : JAMAIS d'appels directs, utilisent uniquement les repositories
- ❌ **Services** : JAMAIS d'appels directs, orchestrent les controllers
- ❌ **Stores** : JAMAIS d'appels API, stockage uniquement
- ❌ **Components** : JAMAIS de logique métier, utilisent les controllers

### Structure Mirror : Cohérence entre Source et Tests

**Principe** : L'organisation des tests doit être un miroir fidèle de l'architecture du projet source, comme documenté dans le guide des tests.

#### Exception : Architecture des Traductions

**Règle spécifique** : Seuls les fichiers `dev-*.json` font exception à l'architecture miroir. Tous les autres fichiers de traduction doivent suivre l'architecture miroir du projet source.

**Organisation des traductions** :
```
src/locales/
├── fr/
│   ├── global-fr.json          # Traductions globales de l'application
│   ├── dev-fr.json             # EXCEPTION : Configuration Vuemann + vues Vuemann
│   ├── apis/qop/datas/operations-status-fr.json  # Architecture miroir avec suffixe langue
│   ├── common/errors-fr.json   # Architecture miroir avec suffixe langue
│   └── views/qop/pages/ListOperationsPage-fr.json # Architecture miroir avec suffixe langue
├── en/
│   ├── global-en.json
│   ├── dev-en.json             # EXCEPTION : Configuration Vuemann + vues Vuemann
│   ├── apis/qop/datas/operations-status-en.json  # Architecture miroir avec suffixe langue
│   ├── common/errors-en.json   # Architecture miroir avec suffixe langue
│   └── views/qop/pages/ListOperationsPage-en.json # Architecture miroir avec suffixe langue
└── nl/
    ├── global-nl.json
    ├── dev-nl.json             # EXCEPTION : Configuration Vuemann + vues Vuemann
    ├── apis/qop/datas/operations-status-nl.json  # Architecture miroir avec suffixe langue
    ├── common/errors-nl.json   # Architecture miroir avec suffixe langue
    └── views/qop/pages/ListOperationsPage-nl.json # Architecture miroir avec suffixe langue
```

**Contenu des fichiers dev-*.json (EXCEPTION)** :
- ✅ **Configuration Vuemann** : Clés pour les pages de configuration, services, etc.
- ✅ **Pages de développement** : Clés pour les pages de debug, documentation, etc.
- ❌ **Vues Vuemann** : Les vues de l'écosystème Vuemann ne doivent PAS être traduites (apiPage, componentsPage, etc.)

**Exemple de contenu dev-fr.json** :
```json
{
  "v_api_page": "Les APIs",
  "v_component_page": "Les components", 
  "v_config_page": "Les configurations",
  "v_css_page": "Les styles",
  "v_services_page": "Les services",
  "v_commands_page": "Les commandes",
  "v_debug": "Debug",
  "v_helpers_page": "Les helpers"
}
```

**Règles d'architecture miroir pour les autres fichiers** :
- ✅ **APIs** : `src/locales/fr/apis/qop/datas/operations-status-fr.json` ↔ `src/apis/qop/datas/operations-status.js`
- ✅ **Views métier** : `src/locales/fr/views/qop/pages/ListOperationsPage-fr.json` ↔ `src/views/qop/pages/ListOperationsPage.vue`
- ✅ **Services** : `src/locales/fr/services/auth/auth-service-fr.json` ↔ `src/services/auth/auth-service.js`
- ✅ **Components** : `src/locales/fr/components/breadcrumb/breadcrumb-component-fr.json` ↔ `src/components/breadcrumb/BreadcrumbComponent.vue`
- ✅ **Common** : `src/locales/fr/common/errors-fr.json` ↔ Utilisé dans `src/common/` ou globalement
- ❌ **Vues Vuemann** : Les vues de l'écosystème Vuemann (apiPage, componentsPage, etc.) ne suivent PAS l'architecture miroir

**Convention de nommage des fichiers de traduction** :
- ✅ **Suffixe obligatoire** : Ajouter le code de langue après le nom du fichier source
- ✅ **Format** : `{nom-du-fichier-source}-{langue}.json`
- ✅ **Exemples** :
  - `HomepagePage.vue` → `homepagePage-fr.json`, `homepagePage-en.json`, `homepagePage-nl.json`
  - `auth-service.js` → `auth-service-fr.json`, `auth-service-en.json`, `auth-service-nl.json`
  - `operations-status.js` → `operations-status-fr.json`, `operations-status-en.json`, `operations-status-nl.json`

**Raison de cette exception limitée** :
- ✅ **Centralisation** : Regroupement logique des traductions liées à Vuemann
- ✅ **Simplicité** : Évite la dispersion des traductions dans une architecture complexe
- ✅ **Maintenance** : Plus facile de maintenir les traductions Vuemann au même endroit
- ✅ **Cohérence** : Alignement avec l'organisation des services Vuemann
- ✅ **Architecture miroir préservée** : Toutes les autres traductions suivent la structure du code source

### Composition API et Props Typées

**Standard adopté** : Utiliser la Composition API de Vue 3 avec `<script setup>` et toujours typer les props.

```vue
<script setup>
// ✅ Props typées avec validation
defineProps({
  operation: { type: Object, required: true },
  type: { type: String, required: true },
  showDetails: { type: Boolean, default: false }
})

// ✅ Reactive refs clairs
const isLoading = ref(false)
const selectedOperation = ref(null)

// ✅ Computed properties avec noms explicites
const operationsCount = computed(() => operations.value.length)

// ✅ Lifecycle hooks simples
onMounted(async () => {
  if(operations.value.length > 0) { return }
  await loadInitialData()
})
</script>
```

### DTOs : Transformations de Données Centralisées

**Responsabilité** : Les DTOs gèrent exclusivement les transformations entre format API et format composant.

```javascript
// ✅ EXCELLENT : DTO avec transformations claires
const fromShow = (operation) => {
  const dateOperation = operation.ddt_oper_prevu ? 
    `${operation.ddt_oper_prevu} ${operation.chr_prevu}` : 
    undefined

  return {
    id: operation.ikInterventions_associees,
    number: operation.cdossier,
    date: dateOperation ? dateHelper.formatDate(dateOperation, 'DD/MM/YYYY HH:mm') : undefined,
    patient: formatPatient(operation),
    service: ServiceDto.fromShow({cspecial: operation.cserv}),
    site: SiteDto.fromShow({cunite_traitement: operation.cunite_traitement})
  }
}

const toList = (filters) => {
  return {
    specialite_id: filters.service,
    unite_traitement_ids: filters.site,
    intervenant_id: filters.surgeon,
    date_debut: filters.dateFrom,
    date_fin: filters.dateTo
  }
}
```

### FormRequest : Validation Centralisée

**Principe** : Centraliser toutes les règles de validation dans des fichiers `formRequest`.

```javascript
// ✅ Validation claire et réutilisable
const validate = datas => {
  const rules = {
    site: {
      tests : 'required',
      errors: { required: 'errors.site.required' }
    },
    dateFrom: {
      tests : 'required|dateFutur:yyyy-mm-dd',
      errors: {
        required: 'errors.dateFrom.required',
        dateFutur: 'errors.dateFrom.dateFutur'
      }
    }
  }

  return validateForm(rules, datas)
}
```

### Repositories : Couche d'Accès aux Données

**Responsabilité exclusive** : Gérer tous les appels API et la logique d'accès aux données. Les contrôleurs et services ne doivent JAMAIS faire d'appels directs.

```javascript
// ✅ Repository - SEUL endroit pour les appels API
const list = async (filters = {}) => { 
  return await req('operation.list', { params: filters})
}

const getAll = async () => {
  return await req('site.getAll')
}

const filter = async (filters = {}) => {
  await new Promise(resolve => setTimeout(resolve, TIMEOUT))
  
  let filtered = operationsData.getAll()
  
  if (filters.status === operationsStatus.toSchedule.value) {
    filtered = filtered.filter(operation => operation.ddt_oper_prevu === undefined)
  }
  
  return {
    status: STATUS.SUCCESS,
    data: filtered
  }
}

export const OperationRepository = { list, filter }
```

**Règles strictes des repositories** :
- ✅ **Appels API** : Utiliser `req()` pour tous les appels HTTP
- ✅ **Logique de filtrage** : Traitement des données côté client si nécessaire
- ✅ **Gestion d'erreurs** : Retourner les erreurs au format standardisé
- ✅ **Mock de données** : Fournir des versions fake pour le développement
- ❌ **Transformation** : Laisser les DTOs transformer les données
- ❌ **Logique métier** : Déléguer aux contrôleurs

**Pattern repository standard** :
```javascript
// ✅ Structure type d'un repository
export const EntityRepository = {
  async getAll() {
    return await req('entity.getAll')
  },
  
  async getById(id) {
    return await req('entity.getById', { params: { id } })
  },
  
  async create(data) {
    return await req('entity.create', { data })
  },
  
  async update(id, data) {
    return await req('entity.update', { params: { id }, data })
  },
  
  async delete(id) {
    return await req('entity.delete', { params: { id } })
  }
}
```

## Bonnes Pratiques Spécifiques

### Configuration Externalisée

**Principe** : Centraliser toutes les configurations dans des fichiers dédiés.

```javascript
// config/routes-config.js
export const routes = [
  {
    path: "/",
    name: "list-operations",
    component: ListOperationsPage,
    meta: { 
      requiresAuth: true,
      sidebar: {
        icon: 'fa-solid fa-calendar-check',
        label: 'sidebar.scheduled_operations'
      } 
    }
  }
]
```

### Services Vuemann : Architecture Centralisée

**Principe fondamental** : L'application utilise l'écosystème de services Vuemann pour toutes les fonctionnalités transverses.

#### ServiceManager : Gestionnaire Central des Services

**Le `servicesM`** est le gestionnaire central qui initialise et orchestre tous les services Vuemann :

```javascript
// main.js - Initialisation des services
import { servicesM } from '@brugmann/vuemann/src/services/services-manager.js'

const services = {
  ajaxService,
  utilsService,
  authService,
  flashService,
  formService,
  localeService,
  routerService,
  websocketService,
  logService
}

// Initialisation centralisée
servicesM.initServices(services)
```

**Avantages du ServiceManager** :
- ✅ **Centralisation** : Un seul point d'initialisation pour tous les services
- ✅ **Injection de dépendances** : Les services sont disponibles partout via les helpers
- ✅ **Configuration globale** : Setup uniforme pour l'app et les tests
- ✅ **Lifecycle management** : Contrôle du cycle de vie des services

#### Services Vuemann Disponibles

**Services transverses fournis par Vuemann** :

```javascript
// Services principaux toujours disponibles
import { ajaxService } from '@brugmann/vuemann/src/services/ajax/ajax-service.js'       // Appels HTTP
import { authService } from '@brugmann/vuemann/src/services/auth/auth-service.js'         // Authentification
import { localeService } from '@brugmann/vuemann/src/services/locale/locale-service.js'   // Internationalisation
import { flashService } from '@brugmann/vuemann/src/services/flash/flash-service.js'     // Messages flash
import { formService } from '@brugmann/vuemann/src/services/form/form-service.js'        // Gestion des formulaires
import { utilsService } from '@brugmann/vuemann/src/services/utils/utils-service.js'     // Utilitaires
import { routerService } from '@brugmann/vuemann/src/services/router/router-service.js'  // Navigation
import { logService } from '@brugmann/vuemann/src/services/log/log-service.js'           // Logging
```

#### Services Métier Locaux : Orchestration de la Logique

**Responsabilité** : Les services métier orchestrent plusieurs contrôleurs pour des opérations complexes.

```javascript
// ✅ EXCELLENT : Service métier qui orchestre
import { SiteController } from '@/apis/qop/controllers/site-controller.js'
import { ServiceController } from '@/apis/qop/controllers/service-controller.js'
import { error } from '@brugmann/vuemann/src/services/services-helper.js'

const initDatas = async () => {
  const response_sites = await SiteController.getAll()
  if(response_sites.status !== STATUS.SUCCESS) { error(response_sites.error) }

  const response_services = await ServiceController.getAll()
  if(response_services.status !== STATUS.SUCCESS) { error(response_services.error) }

  return {
    services: response_services.services ?? [],
    sites: response_sites.sites ?? []
  }
}

export const qopService = { initDatas }
```

**Cas d'usage des services métier** :
- ✅ **Initialisation** : Charger plusieurs ressources en parallèle
- ✅ **Orchestration** : Coordonner plusieurs contrôleurs
- ✅ **Logique transverse** : Opérations qui touchent plusieurs domaines
- ❌ **Logique simple** : Déléguer aux contrôleurs pour les opérations simples

#### Services-Helper : Fonctions Utilitaires Vuemann

**Les helpers** fournissent un accès simple aux services Vuemann initialisés :

```javascript
// ✅ Helpers disponibles depuis Vuemann
import { 
  t,              // Traduction (internationalisation)
  error,          // Affichage d'erreurs
  form,           // Gestion de formulaires
  req,            // Requêtes HTTP
  validateForm    // Validation de formulaires
} from '@brugmann/vuemann/src/services/services-helper.js'

// ✅ Utilisation dans les repositories UNIQUEMENT
return await req('site.getAll')
return await req('operation.list', { params: filters })

// ❌ INTERDIT : Appels directs dans les contrôleurs
// const response = await req('operation.list', { params: filters }) // ❌ À faire dans le repository

// ✅ Utilisation dans les formRequest
return validateForm(rules, datas)

// ✅ Utilisation dans les services
if(response.status !== STATUS.SUCCESS) { error(response.error) }
```

**Fonctions helper principales** :
- ✅ **`t(key)`** : Traduction depuis les fichiers de locale Vuemann
- ✅ **`error(message)`** : Affichage d'erreurs via flashService
- ✅ **`form`** : Accès au service de formulaires pour la validation
- ✅ **`req(endpoint, options)`** : Requêtes HTTP via ajaxService
- ✅ **`validateForm(rules, data)`** : Validation de formulaires

#### Configuration des Services pour les Tests

**Setup identique** : Les tests utilisent la même configuration que l'application :

```javascript
// vitest.setup.js - Configuration pour les tests
import { servicesM } from '@brugmann/vuemann/src/services/services-manager.js'
import { localePlugin } from '@brugmann/vuemann/src/services/locale/locale-plugin.js'

// Configuration des services pour les tests
servicesM.initServices({ 
  utilsService, 
  authService, 
  ajaxService, 
  flashService, 
  localeService, 
  formService 
})

// Plugin de traduction pour les tests
const translater = await localePlugin()
config.global.plugins = [translater]
```

### Internationalisation Vuemann : Système de Traduction

**Standard** : Utiliser systématiquement `t()` de Vuemann pour toutes les chaînes affichées à l'utilisateur.

**Important** : La fonction `t()` provient de **Vuemann** et non de vue-i18n ou d'autres librairies d'internationalisation.

```vue
<script setup>
// ✅ Import correct depuis Vuemann
import { t } from '@brugmann/vuemann/src/services/services-helper.js'
</script>

<template>
  <h1>{{ t('list-operations.scheduled_title') }}</h1>
  <div v-if="isLoading">{{ t('list-operations.loading') }}</div>
  <option v-for="option in operationsStatus" :value="option.value">
    {{ t(option.label) }}
  </option>
</template>
```

**Organisation des traductions** :
```
src/locales/
├── fr/
│   ├── dev-fr.json                       # EXCEPTION : Configuration Vuemann + vues Vuemann
│   ├── apis/qop/datas/operations-status.json  # Architecture miroir
│   ├── common/errors.json                # Architecture miroir
│   └── views/qop/pages/ListOperationsPage.json # Architecture miroir
├── en/
│   └── [same structure]
└── nl/
    └── [same structure]
```

**Exception architecture miroir** : Seuls les fichiers `dev-*.json` font exception. Toutes les autres traductions suivent l'architecture miroir du projet source.

### Utilisation Obligatoire des Classes SCSS Vuemann

**Principe fondamental** : Avant d'écrire du CSS personnalisé, il est OBLIGATOIRE de lire et d'utiliser au maximum les classes SCSS existantes dans Vuemann. Cette pratique garantit la cohérence visuelle et évite la duplication de code.

**Processus obligatoire** :
1. **Lire `src/assets/scss/vuemann.scss`** : Point d'entrée de tous les styles
2. **Explorer les fichiers de layout** : `src/assets/scss/layout/` pour les utilitaires
3. **Utiliser les variables** : `src/assets/scss/_variables.scss` pour les couleurs, tailles, etc.
4. **Préférer les classes existantes** : N'écrire du CSS custom qu'en dernier recours

**Classes utilitaires disponibles** :

#### Système de Couleurs
```scss
// Variables disponibles dans _variables.scss
$primary, $primary-100, $primary-300, $primary-400, $primary-600
$success, $danger, $warning, $info
$neutral-100 à $neutral-900
$blue, $blue-300, $green, $green-300, etc.

// Classes générées automatiquement
.color-primary       // Couleur de texte
.bg-primary-300      // Couleur de fond  
.border-danger       // Couleur de bordure
.color-primary-hover:hover  // Couleur au survol

// Variables CSS générées automatiquement dans _root.scss
var(--primary), var(--primary-300), var(--success), var(--danger)
// Utilisation dans du CSS custom si nécessaire
```

**Accès aux variables dans les composants Vue** :
```vue
<style lang="scss">
// ✅ Méthode 1 : Utiliser les variables CSS (recommandé)
.custom-component {
  color: var(--primary);
  background-color: var(--neutral-200);
  border: 1px solid var(--primary-300);
}

// ✅ Méthode 2 : Importer les variables SCSS si nécessaire
@use '@/assets/scss/variables';

.custom-component {
  color: variables.$primary;
  background-color: variables.$neutral-200;
}
</style>
```

#### Espacement et Layout
```scss
// Marges et padding (de 0 à 50px par pas de 5)
.m-5, .m-10, .m-15, .m-20, .m-25, .m-30, .m-35, .m-40, .m-45, .m-50
.mt-5, .mb-10, .ml-15, .mr-20  // Directions spécifiques
.mx-10 (margin-inline), .my-15 (margin-block)
.p-5, .px-10, .py-15, .pt-20, .pb-25, .pl-30, .pr-35

// Gap pour flexbox
.g-5, .g-10, .g-15, .g-20, .g-25, .g-30, .g-35, .g-40, .g-45, .g-50
```

#### Display et Flexbox
```scss
// Display
.d-none, .d-block, .d-flex

// Flexbox direction
.f-column, .f-column-reverse, .f-column-md
.f-center      // display: flex + justify-content: center + align-items: center
.f-equal       // Enfants avec flex: 1

// Alignement
.j-center, .j-between, .j-around, .j-start, .j-end     // justify-content
.a-center, .a-between, .a-around, .a-start, .a-end     // align-items
.j-center-md, .a-center-md  // Responsive pour écrans moyens et plus

// Flex utilitaires
.f-wrap, .flex-1
```

#### Typographie
```scss
// Tailles de police
.fs-300, .fs-400, .fs-600, .fs-700, .fs-800
.fs-2rem, .fs-3rem, .fs-4rem, .fs-5rem
.fs-icon-300, .fs-icon-400  // Pour les icônes

// Poids
.fw-400, .fw-500, .fw-700

// Alignement
.text-center, .text-justify, .text-end
```

#### Boutons
```scss
// Classes de base
.btn                          // Style de base
.btn-primary, .btn-danger, .btn-success, .btn-info, .btn-warning
.btn-blue, .btn-primary_reverse
.btn-primary-alt, .btn-danger-alt, etc.  // Versions alternatives (bordure + fond blanc)

// Gestion du hover et de l'état actif
// Le style hover est appliqué automatiquement sur :hover ET sur .active
// Les boutons disabled ne reçoivent pas le style hover
```

**Comportement hover et active** :
```vue
<template>
  <!-- Le bouton aura le style hover quand survolé OU quand actif -->
  <button class="btn btn-primary" :class="{ active: isSelected }">
    Bouton
  </button>

  <!-- Version alternative avec bordure -->
  <button class="btn btn-primary-alt" :class="{ active: isSelected }">
    Bouton alt
  </button>
</template>
```

#### Dimensions et Bordures
```scss
// Largeurs et hauteurs
.w-100, .w-50, .w-25, .h-100

// Bordures arrondies
.radius-5, .radius-10, .radius-15

// Position
.p-relative
```

#### Interactions
```scss
.pointer                     // cursor: pointer
.underline, .underline-hover:hover
.link-underline, .link-bg    // Styles de liens prédéfinis
```

**✅ EXCELLENT : Utilisation maximale des classes existantes**
```vue
<template>
  <div class="d-flex f-column g-15 p-20">
    <button class="btn btn-primary pointer">
      <i class="fs-icon-300 mr-5"></i>
      Action principale
    </button>
    
    <div class="d-flex j-between a-center bg-neutral-200 p-15 radius-10">
      <span class="fs-600 fw-500 color-primary">Titre</span>
      <span class="color-neutral-500 fs-400">Info</span>
    </div>
  </div>
</template>

<style lang="scss">
// Uniquement si nécessaire et non disponible
.custom-component {
  // CSS custom très spécifique seulement
}
</style>
```

**❌ INTERDIT : Réinventer les classes existantes**
```vue
<template>
  <div class="custom-container">
    <button class="custom-btn">Action</button>
  </div>
</template>

<style lang="scss">
// ❌ Réinvente des utilitaires existants
.custom-container {
  display: flex;          // ❌ Utiliser .d-flex
  flex-direction: column; // ❌ Utiliser .f-column
  gap: 15px;              // ❌ Utiliser .g-15
  padding: 20px;          // ❌ Utiliser .p-20
}

.custom-btn {
  background-color: #582C4D;  // ❌ Utiliser .btn.btn-primary
  color: white;               // ❌ Inclus dans .btn-primary
  border-radius: 50px;        // ❌ Inclus dans .btn
  padding: 3px 15px;          // ❌ Inclus dans .btn
}
</style>
```

**Processus de développement** :
1. **Analyser le besoin** : Quel style visuel est nécessaire ?
2. **Chercher dans les fichiers SCSS** : Cette classe existe-t-elle déjà ?
3. **Combiner les utilitaires** : Utiliser plusieurs classes plutôt qu'une seule custom
4. **CSS custom en dernier recours** : Seulement pour des besoins très spécifiques

**Avantages de cette approche** :
- ✅ **Cohérence** : Styles uniformes dans toute l'application
- ✅ **Maintenance** : Changement global via les variables
- ✅ **Performance** : Réutilisation du CSS, taille réduite
- ✅ **Rapidité de développement** : Pas besoin d'écrire du CSS
- ✅ **Responsive** : Classes responsive intégrées (md, lg, etc.)

### Structure Sémantique des Templates

**Principe** : Utiliser des attributs `data-*` pour structurer sémantiquement les templates.

```vue
<template>
  <div data-card="container" class="operation-card">
    <div data-card="header" class="operation-card_header">
      <p data-header="date">{{ operation.date }}</p>
      <div data-header="unity">{{ operation.unity }}</div>
    </div>
    
    <div data-card="user" class="operation-card_user">
      <div data-user="name">{{ operation.patient.fullName }}</div>
      <div data-user="info">{{ operation.patient.birthDate }}</div>
    </div>
  </div>
</template>
```

### Gestion des États et Loading

**Pattern recommandé** : Gérer les états de chargement de manière claire et cohérente.

```vue
<script setup>
const isLoading = ref(false)

onMounted(async () => {
  if(operations.value.length > 0) { return }
  
  isLoading.value = true
  try {
    await loadData()
  } finally {
    isLoading.value = false
  }
})
</script>

<template>
  <div v-if="isLoading">{{ t('common.loading') }}</div>
  <div v-else-if="operations.length === 0">{{ t('common.no_results') }}</div>
  <div v-else><!-- Contenu --></div>
</template>
```

### Constants et Énumérations

**Principe** : Utiliser des constantes pour tous les statuts et valeurs fixes.

```javascript
// apis/qop/datas/operations-status.js
export const operationsStatus = {
  toSchedule: { value: 'toSchedule', label: 'À programmer' },
  notValidated: { value: 'notValidated', label: 'Non validé' },
  noShow: { value: 'noShow', label: 'Non présenté' }
}
```

## Checklist de Développement

### Avant de Commencer une Fonctionnalité

- [ ] **Architecture** : Définir quelle couche sera impactée (Repository, Controller, DTO, Store, View)
- [ ] **Simplicité** : Vérifier que la solution est la plus simple possible
- [ ] **Réutilisabilité** : Identifier les composants réutilisables existants

### Pendant le Développement

- [ ] **Classes SCSS** : Lire et utiliser au maximum les classes existantes avant d'écrire du CSS custom
- [ ] **Early Return** : Utiliser le retour anticipé dans toutes les fonctions
- [ ] **Noms explicites** : Variables et fonctions auto-documentées
- [ ] **Props typées** : Validation des props dans les composants
- [ ] **Logique JS native** : Placer la logique métier en `.js`
- [ ] **Store minimal** : Ne stocker que des données dans Pinia
- [ ] **Services Vuemann** : Utiliser les helpers `t()`, `error()`, `req()`, `validateForm()` depuis services-helper
- [ ] **Services métier** : Créer des services pour orchestrer plusieurs contrôleurs
- [ ] **Architecture stricte** : Appels API UNIQUEMENT dans les repositories, jamais dans les contrôleurs/services/stores

### Avant la Validation

- [ ] **Tests** : Suivre le guide des tests (structure mirror, seeders + DTOs)
- [ ] **Internationalisation** : Toutes les chaînes utilisent `t()`
- [ ] **Configuration** : Aucune valeur en dur dans le code
- [ ] **Structure sémantique** : Attributs `data-*` dans les templates
- [ ] **Pas de commentaires** : Code auto-documenté

### Refactoring et Maintenance

- [ ] **Éviter la duplication** : Identifier et factoriser le code dupliqué
- [ ] **Simplifier** : Supprimer le code mort et les abstractions inutiles
- [ ] **Cohérence** : Respecter les patterns établis dans le projet
- [ ] **Performance** : Optimiser uniquement si un problème est identifié

## Conclusion

Ce guide établit les principes fondamentaux pour maintenir une codebase claire, simple et maintenable. L'objectif est de privilégier la lisibilité et la simplicité plutôt que la sophistication technique.

**Règle finale** : En cas de doute, choisir toujours la solution la plus simple et la plus directe qui résout le problème actuel. 