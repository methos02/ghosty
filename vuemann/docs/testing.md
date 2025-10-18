# Guide des Tests - Projets Vue.js avec Vuemann

## Table des Matières

1. [Philosophie et Principes Fondamentaux](#philosophie-et-principes-fondamentaux)
2. [Structure et Conventions](#structure-et-conventions)
3. [Configuration Technique](#configuration-technique)
4. [Mocks et Utilitaires](#mocks-et-utilitaires)
5. [Approches par Type de Test](#approches-par-type-de-test)
6. [Difficultés Rencontrées et Solutions](#difficultés-rencontrées-et-solutions)
7. [Meilleures Pratiques](#meilleures-pratiques)
8. [Scripts et Maintenance](#scripts-et-maintenance)

## Philosophie et Principes Fondamentaux

### Structure Mirror : L'arborescence des tests reflète la structure du projet

**Principe de base** : L'organisation des tests doit être un miroir fidèle de l'architecture du projet source.

```
src/
├── apis/
│   └── api_name/
│       ├── controllers/
│       ├── stores/
│       ├── repositories/
│       ├── dtos/
│       └── formRequest/
├── views/
│   └── api_name/
│       └── parts/
└── helpers/

tests/
├── apis/                    # Mirror de src/apis/
│   └── api_name/
│       ├── controllers/     # Tests des contrôleurs
│       ├── stores/          # Tests des stores Pinia
│       ├── repositories/    # Tests des repositories
│       ├── dtos/            # Tests des DTOs de transformation
│       └── formRequest/     # Tests des formulaires de validation
├── views/                   # Mirror de src/views/
│   └── api_name/
│       └── parts/           # Tests des sous-composants
└── helpers/                 # Mirror de src/helpers/
```

### Principe du Mock Minimal et de la Vraie Logique

**Règle d'or** : Privilégier les tests de la vraie logique métier plutôt que les mocks complexes.

**Philosophie adoptée** :
- **Tester la vraie logique** : Passer de vrais objets de données aux méthodes
- **Setup minimal** : Uniquement Pinia pour les formulaires, mocks simples pour les controllers
- **Focus sur les comportements** : Plutôt que sur les détails d'implémentation

**Exceptions importantes** :
- Le `localStorage` ne doit PAS être mocké mais nettoyé après chaque test
- **INTERDIT** : Ne jamais utiliser `vi.mock()` - utiliser uniquement `vi.spyOn()` ou pas de mock
- **Seeders** : Utiliser les vraies données des seeders pour des tests robustes

**Distinction cruciale pour les spies** :
- ✅ **`vi.spyOn()` sans mock** : Garde la vraie logique tout en vérifiant les appels
- ❌ **`vi.spyOn().mockReturnValue()`** : Masque la vraie logique (à éviter sauf cas exceptionnel)

### Principe Seeders + DTOs : Simuler le Flux de Données Réel

**Règle fondamentale** : Dans les tests, reproduire exactement le même flux de transformation des données que l'application réelle.

**Principe** :
1. **Seeders** = Données brutes de l'API (clés comme `ikUnite_traitement`, `cunite_traitement`)
2. **DTOs** = Transformation vers le format composant (clés comme `id`, `name`)
3. **Tests** = Utiliser les deux pour simuler le flux réel

```javascript
// ✅ EXCELLENT : Flux de données réel avec Seeder + DTO
import { getSites } from '&/utils/seeders/site-seeder.js'
import { SiteDto } from '@/apis/qop/dtos/site-dto.js'

// 1. Données brutes du seeder (format API)
const realSitesFromApi = getSites(3) // [{ ikUnite_traitement: 1, cunite_traitement: 'Site 1' }]

// 2. Transformation par le DTO (format composant)
const transformedSites = realSitesFromApi.map(site => SiteDto.fromShow(site)) // [{ id: 1, name: 'Site 1' }]

// 3. Le store reçoit les données transformées
sitesStore.setSites(transformedSites)

// 4. Test avec les données transformées
expect(wrapper.vm.sites).toEqual(transformedSites)
```

## Structure et Conventions

### Nommage des Fichiers de Test

**Format strict** : `[nom-du-fichier].test.js` (kebab-case comme le fichier source)

```
src/stores/appointment-store.js    → tests/stores/appointment-store.test.js
src/views/AppointmentIndex.vue     → tests/views/AppointmentIndex.test.js
src/helpers/filters-helper.js      → tests/helpers/filters-helper.test.js
```

### Template de Test Standard

```javascript
import { getOperation } from '&/utils/seeders/operation-seeder.js'
import { initDialogFunctions } from '&/utils/mocks/dialog-mock.js'
import { setupFsMocks } from '&/utils/mocks/fs-mock.js'
import { setupPathMocks } from '&/utils/mocks/path-mock.js'
import { routerServiceMock } from '&/utils/mocks/router-service-mock.js'
import { windowMock } from '&/utils/mocks/window-mock.js'
import { WebsocketMock } from '&/utils/mocks/websocket-mock.js'

describe('NomDuModule', () => {
  let wrapper, store, dialogSpies, fsMocks, pathMocks, wsMock;
  
  beforeEach(async () => {
    // Setup Pinia pour les stores et formulaires
    setActivePinia(createPinia())
    
    // Timers pour les délais
    vi.useFakeTimers()
    
    // Mocks conditionnels selon le type de test
    if (/* composant avec dialog */) {
      dialogSpies = initDialogFunctions()
    }
    
    if (/* module Node.js avec fs */) {
      fsMocks = await setupFsMocks()
    }
    
    if (/* module Node.js avec path */) {
      pathMocks = await setupPathMocks()
    }
    
    if (/* composant avec navigation */) {
      vi.mock('@/services/router/router-service.js', () => ({
        default: routerServiceMock
      }))
    }
    
    if (/* composant avec window/navigator */) {
      windowMock()
    }
    
    if (/* composant avec WebSocket */) {
      global.WebSocket = WebsocketMock
      wsMock = new WebsocketMock('ws://localhost:8080')
    }
    
    // Mock des appels API avec données du seeder
    const rawOperations = getOperations(3)
    vi.spyOn(OperationRepository, 'list').mockResolvedValue({
      status: STATUS.SUCCESS,
      data: rawOperations
    })
  });

  afterEach(() => {
    // Nettoyage systématique
    wrapper?.unmount()
    vi.resetAllMocks()
    vi.useRealTimers()
    
    // Restore des mocks spécifiques
    if (dialogSpies) {
      dialogSpies.showModalSpy.mockRestore()
      dialogSpies.closeModalSpy.mockRestore()
    }
    
    if (fsMocks || pathMocks) {
      vi.restoreAllMocks()
    }
  })

  describe('groupe de fonctionnalités', () => {
    it('should [comportement attendu en anglais]', async () => {
      // Arrange, Act, Assert avec vraies données
    })
  })
})
```

## Configuration Technique

### Vitest Configuration

```javascript
export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      environment: 'jsdom',           // Environnement DOM pour les composants
      setupFiles: 'vitest.setup',    // Configuration globale
      exclude: [...configDefaults.exclude, 'e2e/**'],
      root: fileURLToPath(new URL('./', import.meta.url))
    }
  })
)
```

### Alias de Configuration

```javascript
// vite.config.js
resolve: {
  alias: {
    '@': path.resolve(__dirname, './src'),
    '&': path.resolve(__dirname, './tests'), // Alias pour les tests
  }
}
```

### Setup Global

Le fichier `vitest.setup.js` configure :
- Les services Vuemann (auth, ajax, websocket, etc.)
- Le système de traduction
- La configuration globale de l'application
- Les plugins Vue Test Utils

## Mocks et Utilitaires

### Récapitulatif des Mocks Disponibles

| Mock | Fichier | Usage | Méthodes principales |
|------|---------|-------|---------------------|
| **Dialog HTML** | `dialog-mock.js` | Composants avec `<dialog>` | `initDialogFunctions()` |
| **Système de fichiers** | `fs-mock.js` | Modules Node.js avec `node:fs` | `setupFsMocks()` |
| **Path** | `path-mock.js` | Modules Node.js avec `node:path` | `setupPathMocks()` |
| **Router Service** | `router-service-mock.js` | Composants avec navigation | `routerServiceMock` |
| **Window/Navigator** | `window-mock.js` | Composants avec APIs navigateur | `windowMock()` |
| **WebSocket** | `websocket-mock.js` | Composants avec WebSocket | `WebsocketMock` |

### Utilitaires de Test Brugmann

#### Utilitaires d'Interaction

| Utilitaire | Fichier | Usage | Méthodes principales |
|------------|---------|-------|---------------------|
| **triggerConfirm** | `utils/functions/utils.js` | Interactions avec ConfirmButton | `triggerConfirm(wrapper, selector)` |
| **initDialogFunctions** | `utils/mocks/dialog-mock.js` | Setup des dialogs HTML | `initDialogFunctions()` |

#### 1. triggerConfirm - Helper pour Interactions ConfirmButton

**Problème** : Simulation manuelle complexe des interactions avec ConfirmButton (chercher le composant, confirmer, valider).

**Solution** : Utiliser l'utilitaire `triggerConfirm` pour simplifier le processus multi-étapes.

```javascript
import { triggerConfirm } from '@brugmann/vuemann/tests/utils/functions/utils.js';

describe('ComponentWithConfirmButton', () => {
  it('should trigger action when confirm button is clicked', async () => {
    // Setup
    vi.spyOn(repository, 'method').mockResolvedValue({ status: 'success' });
    
    // Action - utiliser triggerConfirm au lieu de $emit
    await triggerConfirm(wrapper, 'button');
    
    // Assertion
    expect(repository.method).toHaveBeenCalled();
  });
});
```

**Avantages** :
- ✅ **Processus simplifié** : Automatise la recherche, confirmation et validation
- ✅ **Code plus lisible** : Une seule ligne au lieu de plusieurs étapes manuelles
- ✅ **Sélecteur flexible** : Accepte différents sélecteurs CSS
- ✅ **Intégration dialog** : Compatible avec `initDialogFunctions()`

### Mocks Spécifiques

#### 1. Dialog HTML (`dialog-mock.js`)

**Problème** : Tests de composants utilisant des `<dialog>` HTML natifs échouent avec `showModal is not a function`.

**Solution** :
```javascript
import { initDialogFunctions } from "&/utils/mocks/dialog-mock.js";

describe('ComponentWithDialog', () => {
  let dialogSpies;

  beforeEach(() => {
    dialogSpies = initDialogFunctions();
  });

  afterEach(() => {
    dialogSpies.showModalSpy.mockRestore();
    dialogSpies.closeModalSpy.mockRestore();
  });

  it('should show dialog when triggered', async () => {
    wrapper = createWrapper();
    
    await wrapper.find('[data-trigger]').trigger('click');
    
    expect(dialogSpies.showModalSpy).toHaveBeenCalled();
  });
});
```

**Méthodes mockées** : `showModal()`, `close()`

#### 2. Système de Fichiers (`fs-mock.js`)

**Problème** : Tests de modules Node.js utilisant `node:fs` échouent dans jsdom.

**Solution** :
```javascript
import { setupFsMocks } from "&/utils/mocks/fs-mock.js";

describe('FileSystemModule', () => {
  let fsMocks;

  beforeEach(async () => {
    fsMocks = await setupFsMocks();
  });

  it('should read file correctly', async () => {
    fsMocks.readFileSync.mockReturnValue('file content');
    
    const result = await someFileOperation();
    
    expect(fsMocks.readFileSync).toHaveBeenCalledWith('path/to/file');
    expect(result).toBe('file content');
  });
});
```

**Méthodes mockées** : `existsSync()`, `readdirSync()`, `readFileSync()`, `writeFileSync()`

#### 3. Path (`path-mock.js`)

**Problème** : Tests de modules Node.js utilisant `node:path` échouent dans jsdom.

**Solution** :
```javascript
import { setupPathMocks } from "&/utils/mocks/path-mock.js";

describe('PathModule', () => {
  let pathMocks;

  beforeEach(async () => {
    pathMocks = await setupPathMocks();
  });

  it('should resolve path correctly', () => {
    pathMocks.resolve.mockReturnValue('/resolved/path');
    
    expect(pathMocks.resolve).toHaveBeenCalledWith('relative', 'path');
  });
});
```

**Méthodes mockées** : `resolve()`, `join()`, `dirname()`, `extname()`

#### 4. Router Service (`router-service-mock.js`)

**Problème** : Tests de composants utilisant le service de routage nécessitent un mock.

**Solution** :
```javascript
import { routerServiceMock } from "&/utils/mocks/router-service-mock.js";

describe('NavigationComponent', () => {
  beforeEach(() => {
    vi.mock('@/services/router/router-service.js', () => ({
      default: routerServiceMock
    }));
  });

  it('should navigate to correct route', async () => {
    wrapper = createWrapper();
    
    await wrapper.find('[data-navigate]').trigger('click');
    
    expect(routerServiceMock.push).toHaveBeenCalledWith('/target-route');
  });
});
```

**Méthodes mockées** : `hasApiRoute()`, `addRoute()`, `currentRoute()`, `push()`, etc.

#### 5. Window/Navigator (`window-mock.js`)

**Problème** : Tests de composants utilisant `window`, `document` ou `navigator` échouent dans jsdom.

**Solution** :
```javascript
import { windowMock } from "&/utils/mocks/window-mock.js";

describe('BrowserComponent', () => {
  beforeEach(() => {
    windowMock();
  });

  it('should detect browser language', () => {
    wrapper = createWrapper();
    
    expect(wrapper.vm.browserLanguage).toBe('fr');
  });
});
```

**Objets mockés** : `window.location`, `window.navigator`, `window.localStorage`, `window.document`, `window.history`

#### 6. WebSocket (`websocket-mock.js`)

**Problème** : Tests de composants utilisant des WebSockets nécessitent un mock.

**Solution** :
```javascript
import { WebsocketMock } from "&/utils/mocks/websocket-mock.js";

describe('WebSocketComponent', () => {
  let wsMock;

  beforeEach(() => {
    global.WebSocket = WebsocketMock;
    wsMock = new WebsocketMock('ws://localhost:8080');
  });

  it('should connect to WebSocket', async () => {
    wrapper = createWrapper();
    
    await wrapper.vm.$nextTick();
    
    expect(wsMock.readyState).toBe(WebsocketMock.OPEN);
  });
});
```

**Méthodes de simulation** : `simulateOpen()`, `simulateClose()`, `simulateError()`

### Mocks à éviter absolument

**JAMAIS mocker** :
- **Controllers** : Masque la logique de transformation des DTOs
- **DTOs** : Masque la logique de mapping des données
- **Helpers métier** : `dateHelper.formatDate()`, `validateForm()`, etc.

**TOUJOURS mocker** :
- **Appels API** : `req()` dans les repositories
- **Services externes** : localStorage (nettoyer, pas mocker), websockets
- **Timers** : `setTimeout()`, `setInterval()` avec `vi.useFakeTimers()`
- **Dialogs HTML natifs** : `showModal()`, `close()` avec `initDialogFunctions()`
- **Modules Node.js** : `node:fs`, `node:path` avec les mocks appropriés
- **Services de routage** : Navigation et gestion des routes avec `routerServiceMock`
- **APIs navigateur** : `window`, `document`, `navigator` avec `windowMock`
- **WebSockets** : Connexions WebSocket avec `WebsocketMock`

**Règle d'or** : **Mock au plus bas niveau (API) pour tester la vraie logique métier.**

## Approches par Type de Test

### 1. Tests de DTOs : Vérifier le Mapping

**Objectif** : S'assurer que les transformations de données sont correctes et complètes.

**Philosophie** :
- **Utiliser les seeders** : Données réelles avec les mêmes clés que le serveur
- **Pas de mocks sur les helpers** : Tester le vrai formatage des dates
- **Valeurs dynamiques** : Éviter les valeurs hardcodées, utiliser `realOperation.field`
- **Mapping complet** : Vérifier tous les champs transformés

```javascript
describe('operation-dto', () => {
  let realOperation

  beforeEach(() => {
    realOperation = getOperation() // Vraies données du seeder
  })

  it('should correctly map all fields from seeder data', () => {
    const result = OperationDto.fromShow(realOperation)

    // ✅ Valeurs dynamiques du seeder
    expect(result.number).toBe(realOperation.number)
    expect(result.date).toBe(dateHelper.formatDate(realOperation.date, 'DD/MM/YYYY HH:mm'))
    
    // ✅ Vérifier que les DTOs nested sont appelés
    expect(SurgeonDto.fromShow).toHaveBeenCalledWith(realOperation.surgeon)
    
    // ✅ Mapping du patient complet
    expect(result.patient).toEqual({
      name: realOperation.patient.name,
      birthDate: dateHelper.formatDate(realOperation.patient.birthDate),
      email: realOperation.patient.email,
      phone: realOperation.patient.phone
    })
  })
})
```

### 2. Tests de FormRequest : Passer des Objets et Vérifier la Validation

**Objectif** : Tester la logique de validation en passant de vrais objets de données.

**Philosophie** :
- **Pas de mocks** : Tester la vraie logique de validation
- **Setup Pinia** : Nécessaire pour les helpers de validation
- **Objets de test** : Créer des objets valides/invalides pour les scénarios
- **Tests des règles** : Required, dateFutur, etc.

```javascript
describe('operations-filter-form', () => {
  beforeEach(() => {
    setActivePinia(createPinia()) // Setup nécessaire pour validateForm
  })

  it('should validate successfully with all required fields', () => {
    const validData = {
      site: 1,
      status: 'toSchedule',
      dateFrom: FUTURE_DATE_FROM, // Date dynamique future
      dateTo: FUTURE_DATE_TO
    }

    const result = OperationsFilterForm.validate(validData)

    expect(result.valide).toBe(true)
    expect(Object.keys(result.errors)).toHaveLength(0)
  })

  it('should fail validation with empty object', () => {
    const invalidData = {}

    const result = OperationsFilterForm.validate(invalidData)

    expect(result.valide).toBe(false)
    // Vérifier que tous les champs required sont en erreur
    expect(result.errors.site).toBeDefined()
    expect(result.errors.status).toBeDefined()
    expect(result.errors.dateFrom).toBeDefined()
    expect(result.errors.dateTo).toBeDefined()
  })
})
```

### 3. Repositories : Ne PAS tester directement

**Règle fondamentale** : **NE JAMAIS tester les repositories directement.**

**Raisons** :

1. **Simplicité extrême** : Les repositories sont de simples wrappers autour de `req()` sans logique métier
2. **Redondance** : Ils sont déjà testés indirectement dans les tests de controllers
3. **Complexité inutile** : Créerait un double mock (repository + req) sans valeur ajoutée
4. **Leur rôle** : Être mockés dans les tests de controllers, pas être testés eux-mêmes

**Exemple de repository typique** :
```javascript
export const UserRepository = {
  userSearchLastname: async params => {
    return req('user.search.lastname', { params })
  },
  userSearch: async params => {
    return req("user.search", {params, 'no-flash': [STATUS.NOT_FOUND]})
  }
}
```

**Ce qu'il faut faire** : Mocker les repositories dans les tests de controllers pour tester la vraie logique métier.

### 4. Tests de Controller : Vraie Logique avec Spy Intelligent

**Objectif** : Vérifier que le controller orchestre correctement DTO + Repository tout en testant la vraie logique de transformation.

**Philosophie** :
- **Spy sans mock** : Utiliser `vi.spyOn()` **SANS** `.mockReturnValue()` pour garder la vraie logique
- **Seeders + Repository mocké** : Données réelles du seeder, seul le repository (appel API) est mocké
- **Vérification du flow** : Tester que les bonnes méthodes sont appelées avec les bons paramètres
- **Vraie transformation** : Les DTOs font leur vraie logique de mapping

```javascript
describe('operation-controller', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('list', () => {
    it('should transform filters through real DTO and return operations on success', async () => {
      const inputFilters = { service: 1, site: 2, surgeon: 3, dateFrom: '2024-01-01', dateTo: '2024-01-31' }
      
      // ✅ Données brutes du seeder (format API)
      const rawOperationsFromApi = getOperations(2)

      // ✅ Spy sur les DTOs SANS mock (vraie logique gardée)
      vi.spyOn(OperationDto, 'toList')
      vi.spyOn(OperationDto, 'fromShow')
      
      // ✅ Mock uniquement le Repository (appel API)
      vi.spyOn(OperationRepository, 'list').mockResolvedValueOnce({
        status: STATUS.SUCCESS,
        data: rawOperationsFromApi
      })

      const result = await OperationController.list(inputFilters)

      // ✅ Vérifier le flow : bonnes méthodes appelées avec bons paramètres
      expect(OperationDto.toList).toHaveBeenCalledWith(inputFilters)
      expect(OperationDto.fromShow).toHaveBeenCalledTimes(2)
      expect(OperationDto.fromShow).toHaveBeenCalledWith(rawOperationsFromApi[0])
      expect(OperationDto.fromShow).toHaveBeenCalledWith(rawOperationsFromApi[1])
      
      // ✅ Vérifier que la vraie logique fonctionne
      expect(result.status).toBe(STATUS.SUCCESS)
      expect(result.operations).toHaveLength(2)
    })
  })
})
```

### 5. Tests de Store : État et Mutations

**Objectif** : Vérifier la gestion d'état et les mutations Pinia.

**Philosophie** :
- **Setup Pinia** : Toujours nécessaire
- **État initial** : Vérifier les valeurs par défaut
- **Mutations** : Tester les changements d'état
- **Getters** : Vérifier les calculs dérivés

```javascript
describe('services-store', () => {
  let servicesStore

  beforeEach(() => {
    setActivePinia(createPinia())
    servicesStore = useServicesStore()
  })

  it('should filter services by site id correctly', () => {
    const services = [
      { id: 1, name: 'Service A', site_id: 1 },
      { id: 2, name: 'Service B', site_id: 1 },
      { id: 3, name: 'Service C', site_id: 2 }
    ]
    servicesStore.setServices(services)

    const result = servicesStore.getBySite(1)

    expect(result).toHaveLength(2)
    expect(result.every(service => service.site_id === 1)).toBe(true)
  })
})
```

### 6. Tests de Composants Vue : Extraction de la Logique Métier

**Objectif** : Tester la logique métier des composants Vue sans dépendre des détails d'implémentation.

**Philosophie** :
- **Extraction des fonctions métier** : Sortir la logique des watchers/computed vers des fonctions testables
- **Tests de comportement** : Tester ce que fait le composant, pas comment il le fait
- **Exposition explicite** : Utiliser `defineExpose()` pour rendre les fonctions testables
- **Vraies interactions** : Préférer les actions utilisateur aux manipulations directes du state

```javascript
// ✅ Dans le composant : extraction de la logique
const handleServiceChange = async () => {
  if (!filters.value.service) {
    surgeons.value = []
    return
  }
  
  const response = await SurgeonController.surgeonsByService(filters.value.service)
  if (response.status !== STATUS.SUCCESS) {
    error(response.error)
    surgeons.value = []
    return
  }

  surgeons.value = response.surgeons
}

// Watcher simple qui délègue
watch(() => filters.value.service, handleServiceChange)

// Exposition pour les tests
defineExpose({ handleSearch, handleServiceChange })

// ✅ Dans les tests : test de la fonction extraite
describe('FilterOperationsSearchComponent', () => {
  it('should clear surgeons when no service selected', async () => {
    createWrapper()
    
    wrapper.vm.surgeons = [mockSurgeon]
    wrapper.vm.filters.service = undefined
    
    await wrapper.vm.handleServiceChange()

    expect(wrapper.vm.surgeons).toEqual([])
  })
})
```

**Règles importantes** :
- **Ne jamais tester les watchers directement** : Ils sont des détails d'implémentation
- **Extraire la logique métier** : Dans des fonctions pures et testables
- **Tester les fonctions exposées** : Via `defineExpose()` pour une API claire
- **Privilégier les interactions utilisateur** : `setValue()`, `trigger('click')`, etc.

## Difficultés Rencontrées et Solutions

### 1. Problème de Convention de Nommage

**Problème** : Incohérence entre `operationRepository.test.js` (camelCase) et `operation-repository.js` (kebab-case).

**Solution** : Renommage systématique pour respecter la convention avec tirets.

### 2. Erreurs ESM avec les Mocks

**Problème** : `Cannot spy on export validateForm` avec `vi.spyOn()` sur les modules ES6.

**Solution finale** : Abandon des mocks complexes au profit de la vraie logique avec setup Pinia.

### 3. Problème Pinia dans les Tests de Formulaires

**Problème** : Les helpers de validation nécessitent Pinia mais les tests n'avaient pas de setup.

**Solution** :
```javascript
beforeEach(() => {
  setActivePinia(createPinia())
})
```

### 4. Structure de Données Incohérente

**Problème** : Tests avec `site.id` mais store attendant `site_id`.

**Solution** : Vérification de la vraie structure des données dans `services-data.js`.

### 5. Mocks qui Masquent les Vraies Erreurs

**Problème** : Tests avec trop de mocks qui passent sans tester la vraie logique.

**Solution** : Suppression progressive des mocks pour tester la vraie logique métier.

### 6. Tests Non-Robustes avec Valeurs Hardcodées

**Problème** : Tests cassés dès que les données du seeder changent.

**Solution** : Utilisation de valeurs dynamiques du seeder :
```javascript
// ❌ Fragile
expect(result.number).toBe('198000001')

// ✅ Robuste
expect(result.number).toBe(realOperation.number)
```

### 7. Problème avec les Tests de Watchers Vue

**Problème** : Difficulté à tester les watchers Vue qui ne se déclenchent pas de manière prévisible dans les tests.

**Solution recommandée** : **Extraction de la logique métier** dans une fonction testable

```javascript
// ✅ Extraction de la logique dans une fonction pure
const handleServiceChange = async () => {
  if (!filters.value.service) {
    surgeons.value = []
    return
  }
  
  const response = await SurgeonController.surgeonsByService(filters.value.service)
  if (response.status !== STATUS.SUCCESS) {
    error(response.error)
    surgeons.value = []
    return
  }

  surgeons.value = response.surgeons
}

// Watcher simplifié qui appelle la fonction
watch(() => filters.value.service, async () => await handleServiceChange())

// Exposition pour les tests
defineExpose({ handleSearch, handleServiceChange })
```

**Tests robustes de la fonction extraite** :
```javascript
it('should clear surgeons when no service selected', async () => {
  createWrapper()
  
  wrapper.vm.surgeons = [{ id: 1, name: 'Dr. Smith' }]
  wrapper.vm.filters.service = undefined
  
  // Appel direct de la fonction extraite
  await wrapper.vm.handleServiceChange()

  expect(wrapper.vm.surgeons).toEqual([])
})
```

**Règle d'or** : **Ne jamais tester les watchers directement, mais extraire et tester la logique qu'ils contiennent.**

### 8. Problème avec les Dialogs HTML Natifs

**Problème** : Tests de composants utilisant des `<dialog>` HTML natifs qui échouent avec l'erreur `TypeError: dialog.value.showModal is not a function`.

**Solution** : Utiliser le mock de dialog fourni dans `tests/utils/mocks/dialog-mock.js`.

```javascript
// ✅ Solution correcte
import { initDialogFunctions } from "&/utils/mocks/dialog-mock.js";

describe('ConfirmButtonComponent', () => {
  let dialogSpies;

  beforeEach(() => {
    dialogSpies = initDialogFunctions();
  });

  afterEach(() => {
    dialogSpies.showModalSpy.mockRestore();
    dialogSpies.closeModalSpy.mockRestore();
  });

  it('should show dialog when clicked', async () => {
    wrapper = createWrapper({ type: 'dialog' })
    
    await wrapper.find('[data-confirm]').trigger('click')
    
    expect(dialogSpies.showModalSpy).toHaveBeenCalled();
  });
});
```

**Apprentissage** : **Toujours utiliser `initDialogFunctions()` pour les tests de composants utilisant des dialogs HTML natifs.**

### 9. Tests d'Interaction avec ConfirmButton

**Problème** : Processus manuel complexe pour simuler les interactions avec ConfirmButton (chercher le composant, confirmer, valider).

**Cause** : Tentative de simuler manuellement chaque étape au lieu d'utiliser l'utilitaire `triggerConfirm`.

**❌ Code incorrect** :
```javascript
await confirmButton.vm.$emit('click');
```

**✅ Code correct** :
```javascript
import { triggerConfirm } from '@brugmann/vuemann/tests/utils/functions/utils.js';
import { initDialogFunctions } from '@brugmann/vuemann/tests/utils/mocks/dialog-mock.js';

beforeEach(() => {
    initDialogFunctions();
    // ... autres setup
});

it('appelle la bonne fonction quand on clique sur le ConfirmButton', async () => {
    await triggerConfirm(wrapper, 'button');
    expect(repository.method).toHaveBeenCalled();
});
```

### 10. Erreurs de Nommage des Repositories

**Problème** : "Cannot convert undefined or null to object" causé par des noms d'import incorrects.

**Cause** : Fautes de frappe dans les noms d'export des repositories.

**❌ Code incorrect** :
```javascript
import { appointmentRepository } from '@/apis/appointment/repositories/appointment-repository.js';
```

**✅ Code correct** :
```javascript
import { appointementRepository } from '@/apis/appointment/repositories/appointment-repository.js';
```

**Note** : Vérifier les noms exacts des exports (attention aux fautes de frappe comme `appointementRepository` vs `appointmentRepository`).

### 11. Mock Inapproprié des Fonctions Internes

**Problème** : Test qui échoue avec "expected spy to be called at least once" malgré un mock.

**Cause** : Mock direct de la fonction au lieu de tester le vrai flux d'interaction.

**❌ Code incorrect** :
```javascript
const mockAppointmentUnlock = vi.fn();
wrapper.vm.appointmentUnlock = mockAppointmentUnlock;
await confirmButton.vm.$emit('click');
expect(mockAppointmentUnlock).toHaveBeenCalled();
```

**✅ Code correct** :
```javascript
vi.spyOn(appointementRepository, 'appointmentLockPatch').mockResolvedValue({ status: 'success' });
await triggerConfirm(wrapper, 'button');
expect(appointementRepository.appointmentLockPatch).toHaveBeenCalled();
```

### 12. Confusion entre Test de Logique et Test d'Interaction

**Problème** : Tests qui ne reflètent pas le vrai comportement utilisateur.

**Cause** : Focus sur les détails d'implémentation plutôt que sur le comportement.

**❌ Code incorrect** :
```javascript
it('appelle appointmentUnlock quand la fonction est appelée', async () => {
    await wrapper.vm.appointmentUnlock();
    expect(mockAppointmentUnlock).toHaveBeenCalled();
});
```

**✅ Code correct** :
```javascript
it('appelle appointmentStore.unlock quand on clique sur le ConfirmButton', async () => {
    await triggerConfirm(wrapper, 'button');
    expect(appointmentStore.unlock).toHaveBeenCalledWith(appointment.id);
});
```

**Règle d'or** : **Tester le comportement utilisateur (clics, interactions) plutôt que les détails d'implémentation (appels de fonctions internes).**

## Meilleures Pratiques

### 1. Isolation et Indépendance

```javascript
beforeEach(async () => {
  setActivePinia(createPinia())
  vi.useFakeTimers()
  vi.clearAllMocks()
});

afterEach(() => {
  wrapper?.unmount()
  vi.resetAllMocks()
  vi.useRealTimers()
  localStorage.clear() // Nettoyer, ne pas mocker
});
```

### 2. Gestion des Opérations Asynchrones

```javascript
// Attendre les délais avec les fake timers
await vi.advanceTimersByTimeAsync(400)

// Attendre les promesses
await flushPromises()

// Attendre les mises à jour DOM
await wrapper.vm.$nextTick()
```

### 3. Assertions de Complétude

```javascript
// ✅ Vérifier la qualité ET la complétude
const allOperations = operationsData.getAll()
const expectedOperations = allOperations.filter(op => op.service.id === serviceId)

// Qualité : tous correspondent au filtre
expect(result.data.every(op => op.service.id === serviceId)).toBe(true)

// Complétude : tous les attendus sont trouvés
expect(result.data).toHaveLength(expectedOperations.length)
```

### 4. Data Test IDs

Utiliser des `data-testid` pour les sélecteurs de test :

```vue
<!-- Dans les composants -->
<button data-testid="submit-btn">Valider</button>
<div data-testid="error-message" v-if="hasError">{{ error }}</div>
```

```javascript
// Dans les tests
expect(wrapper.find('[data-testid="submit-btn"]').exists()).toBe(true)
expect(wrapper.find('[data-testid="error-message"]').text()).toBe(expectedError)
```

### 5. Commentaires dans les Tests : Minimalisme et Clarté

**Règle fondamentale** : Les tests doivent être auto-documentés par leur code, pas par leurs commentaires.

**Principe du commentaire minimal** :
- ✅ **Code expressif** : Noms de variables et fonctions clairs
- ✅ **Structure claire** : Organisation logique des tests
- ❌ **Commentaires évidents** : Éviter d'expliquer ce que fait le code
- ❌ **Commentaires redondants** : Qui répètent le code

```javascript
// ❌ ÉVITER : Commentaires évidents et redondants
it('should render operations cards when operations exist', async () => {
  // Utiliser le DTO pour transformer les données comme l'application réelle
  const rawOperations = getOperations(2)
  const transformedOperations = rawOperations.map(op => OperationDto.fromShow(op))

  await createWrapper()
  
  // Simuler l'état de loading en modifiant directement la ref
  wrapper.vm.isLoading = true
  await wrapper.vm.$nextTick()

  // Vérifier que la prop est liée correctement
  expect(searchComponent.props('isLoading')).toBe(false)
})

// ✅ EXCELLENT : Code auto-documenté sans commentaires inutiles
it('should render operations cards when operations exist', async () => {
  const rawOperations = getOperations(2)
  const transformedOperations = rawOperations.map(op => OperationDto.fromShow(op))

  await createWrapper()
  
  wrapper.vm.isLoading = true
  await wrapper.vm.$nextTick()

  expect(searchComponent.props('isLoading')).toBe(false)
})
```

**Quand utiliser des commentaires** :
- ✅ **Logique complexe** : Algorithmes non évidents
- ✅ **Contexte métier** : Règles business spécifiques
- ✅ **Workarounds temporaires** : Solutions temporaires documentées
- ✅ **Décisions techniques** : Pourquoi cette approche plutôt qu'une autre

```javascript
// ✅ Commentaire utile : explication du contexte métier
it('should validate form data correctly with seeder values', async () => {
  const validFormData = {
    site: transformedSite.id,
    status: operationsStatus.toSchedule.value,
    dateFrom: getFutureDate(1), // dateFutur validation requires future dates
    dateTo: getFutureDate(7)
  }
  
  const validationResult = OperationsFilterForm.validate(validFormData)
  expect(validationResult.valide).toBe(true)
})
```

**Avantages du code auto-documenté** :
- ✅ **Maintenance réduite** : Pas de commentaires à maintenir
- ✅ **Clarté immédiate** : Le code dit ce qu'il fait
- ✅ **Évolution naturelle** : Le code évolue, les commentaires restent obsolètes
- ✅ **Focus sur l'essentiel** : Concentration sur la logique, pas la documentation

**Règle d'or** : **Si vous ressentez le besoin d'ajouter un commentaire, demandez-vous d'abord si le code peut être rendu plus expressif.**

### 6. Tests d'Interaction avec ConfirmButton

**Règle fondamentale** : Utiliser les utilitaires Brugmann pour les interactions avec ConfirmButton.

**Bonnes pratiques** :
- ✅ **Utiliser `triggerConfirm`** : Au lieu de `$emit('click')` ou `trigger('click')`
- ✅ **Setup dialog** : Toujours appeler `initDialogFunctions()` dans `beforeEach`
- ✅ **Mocker le repository** : Plutôt que les fonctions internes du composant
- ✅ **Tester le comportement** : Focus sur l'action utilisateur, pas l'implémentation

```javascript
// ✅ Template de test pour ConfirmButton
describe('Interaction avec ConfirmButton', () => {
  beforeEach(() => {
    initDialogFunctions();
    vi.spyOn(repository, 'method').mockResolvedValue({ status: 'success' });
  });

  it('déclenche la bonne action', async () => {
    await triggerConfirm(wrapper, 'button');
    expect(repository.method).toHaveBeenCalled();
  });
});
```

**Erreurs courantes à éviter** :
- ❌ **`await confirmButton.vm.$emit('click')`** : Processus manuel complexe
- ❌ **Mock des fonctions internes** : Masque la vraie logique
- ❌ **Oublier `initDialogFunctions()`** : Erreurs de dialog
- ❌ **Tester l'implémentation** : Au lieu du comportement utilisateur

### 7. Évolution de l'Approche

**Avant : Mocks Complexes**
```javascript
// ❌ Approche initiale trop complexe
vi.spyOn(dateHelper, 'formatDate')
  .mockReturnValueOnce('17/12/2024 08:00')
  .mockReturnValueOnce('15/03/1985')

vi.mock('@/services/validation-helper', () => ({
  validateForm: vi.fn().mockReturnValue({ valide: true })
}))
```

**Évolution : Spy Intelligent (Recommandé pour Controllers)**
```javascript
// ✅ Compromis intelligent : Spy sans mock
const rawOperations = getOperations(2)

vi.spyOn(OperationDto, 'fromShow') // Pas de mockReturnValue !
vi.spyOn(OperationRepository, 'list').mockResolvedValue({
  status: STATUS.SUCCESS,
  data: rawOperations
})

// Vérifier le flow ET la vraie logique
expect(OperationDto.fromShow).toHaveBeenCalledWith(rawOperations[0])
expect(result.operations[0].patient.fullName).toBeDefined() // Vraie transformation
```

**Finalité : Vraie Logique Pure (Idéal pour DTOs)**
```javascript
// ✅ Approche finale pour DTOs : Aucun mock
const realOperation = getOperation()
const result = OperationDto.fromShow(realOperation)

expect(result.date).toBe(dateHelper.formatDate(realOperation.date, 'DD/MM/YYYY HH:mm'))

// Setup minimal pour Pinia
beforeEach(() => {
  setActivePinia(createPinia())
})
```

### Récapitulatif des Approches par Type

| Type de Test | Approche Recommandée | Raison |
|--------------|---------------------|---------|
| **DTOs** | Vraie logique pure | Tester la transformation complète |
| **Controllers** | Spy intelligent | Vérifier l'orchestration + vraie logique |
| **Repositories** | Ne PAS tester | Simples wrappers, déjà testés indirectement |
| **FormRequest** | Vraie logique + Pinia | Tester la vraie validation |

## Seeders et Données de Test

### Utilisation des Seeders Personnalisés

Les seeders du projet fournissent des données réalistes avec les mêmes clés que le serveur :

```javascript
// operation-seeder.js
export const getOperation = (relations = {}) => {
  return {
    id: 1,
    number: '198000001',
    date: '2024-12-17T08:00:00.000Z',
    patient: {
      name: 'PATIENT1 Test',
      birthDate: '1985-03-15',
      email: 'patient1@test.com'
    },
    // Relations personnalisables
    ...relations
  }
}

// Dans les tests
const customOperation = getOperation({
  patient: { name: 'Custom Patient' },
  validated: false
})
```

### Avantages des Seeders

- **Données cohérentes** : Structure identique au serveur
- **Relations personnalisables** : `getOperation({ service: customService })`
- **Tests robustes** : Changement des seeders = tests toujours valides
- **Réalisme** : Données proches de la production

## Ce qu'il ne faut PAS tester

### Fichiers exclus des tests

**Ne jamais tester** :
- **Repositories** : Simples wrappers autour de `req()`, déjà testés indirectement dans les controllers
- **Fichiers de configuration** : `config/*.js` - Déclarations statiques
- **Fichiers de traduction** : `locales/**/*.json` - Contenu déclaratif
- **Fichiers de routes statiques** : Déclarations de routes simples
- **Assets et ressources** : Images, CSS, etc.

**Focus sur la logique métier** : Tester uniquement le code avec de la logique, des transformations ou des interactions.

## Scripts et Maintenance

### Scripts et Commandes

```json
{
  "scripts": {
    "test": "vitest",                    // Mode watch pour développement
    "test:run": "vitest run",            // Exécution unique
    "test:ui": "vitest --ui",            // Interface graphique
    "test:coverage": "vitest --coverage" // Rapport de couverture
  }
}
```

### Techniques de Debug

```javascript
// Afficher l'état du composant
console.log(wrapper.vm.$data)
console.log(wrapper.html())

// Afficher les données du seeder
console.log(JSON.stringify(realOperation, null, 2))
```

### Gestion des Erreurs Courantes

1. **Tests qui passent isolément mais échouent en groupe** → Problème de nettoyage des mocks
2. **Timeouts sur les tests async** → Oublier `await vi.advanceTimersByTimeAsync(400)`
3. **Erreurs ESM "Cannot spy on export"** → Éviter les mocks complexes, tester la vraie logique
4. **Tests fragiles** → Remplacer les valeurs hardcodées par les données du seeder
5. **Erreurs Pinia** → Oublier `setActivePinia(createPinia())` dans `beforeEach`
6. **Erreurs de nommage** → Vérifier les noms exacts des exports (fautes de frappe)
7. **Erreurs dialog** → Oublier `initDialogFunctions()` dans `beforeEach`

### Guide de Debug des Erreurs ConfirmButton

| Erreur | Cause | Solution |
|--------|-------|----------|
| `Cannot convert undefined or null to object` | Nom d'import incorrect | Vérifier le nom exact de l'export |
| `expected spy to be called at least once` | Mock au mauvais niveau | Mocker le repository plutôt que la fonction |
| `Cannot read properties of undefined` | Import manquant | Vérifier tous les imports nécessaires |
| `showModal is not a function` | Oubli de `initDialogFunctions()` | Ajouter dans `beforeEach` |

### Checklist pour les Tests ConfirmButton

- [ ] Utiliser `triggerConfirm` pour les interactions avec `ConfirmButton`
- [ ] Importer `initDialogFunctions()` dans le `beforeEach`
- [ ] Mocker le repository plutôt que les fonctions internes
- [ ] Vérifier les noms d'import (attention aux fautes de frappe)
- [ ] Tester le comportement utilisateur, pas les détails d'implémentation
- [ ] Utiliser les seeders + DTOs pour les vraies données

## Conclusion

Cette approche garantit :
- **Robustesse** : Tests qui survivent aux changements de données
- **Simplicité** : Moins de mocks = moins de complexité
- **Réalisme** : Utilisation de vraies données et de vraie logique
- **Maintenabilité** : Structure claire et tests auto-documentés
- **Fiabilité** : Tests isolés et reproductibles

**Leçon principale** : Privilégier la simplicité et la vraie logique métier plutôt que l'over-engineering avec des mocks complexes. Les tests doivent documenter le comportement réel de l'application, pas celui des mocks. 