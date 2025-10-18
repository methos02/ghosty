# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Vuemann** is a Vue 3 component library that provides a set of reusable components and services for building web applications. It's designed with portability in mind, keeping business logic in native JavaScript files to facilitate potential migration to other frameworks.

- **Version**: 4.2.0
- **Framework**: Vue 3 with Composition API
- **Build Tool**: Vite
- **Package Manager**: npm
- **Testing**: Vitest with jsdom
- **Registry**: Private GitLab registry at chu-brugmann.be

## Development Commands

### Core Commands
```bash
# Development mode - builds and runs dev server
npm run dev

# Build the library
npm run build

# Run tests in watch mode
npm test

# Run tests once
npm run test:run

# Run tests with coverage report
npm run coverage

# Lint JavaScript and Vue files
npm run lint

# Serve the built distribution
npm run serve
```

### CLI Commands
The project includes custom CLI commands in the `bin/` directory:

```bash
# Initialize a new API structure in src/apis/
npx init-api <api-name>

# Sourcemap utilities
npx sourcemap
```

## Architecture Overview

### Service-Based Architecture

Vuemann uses a centralized **service manager** (`servicesM`) that initializes and orchestrates all services. Services have **dependency management** with circular dependency detection.

**Key architectural principles:**
- **Native JavaScript First**: Business logic in `.js` files (not `.vue`) for framework portability
- **Service-Oriented**: Core functionality provided through Vuemann services
- **Dependency Injection**: Services initialized centrally and injected throughout the app
- **Minimal Stores**: Pinia stores used ONLY for data storage, NOT for business logic

### Core Services

All services are initialized through `servicesM.initServices()` in `main.js`:

```javascript
import { servicesM } from '@brugmann/vuemann/src/services/services-manager.js'

await servicesM.initServices(app, {
  ajax: ajaxInit,      // HTTP requests via axios
  locale: localeInit,  // i18n translations
  utils: utilsInit,    // Utility functions
  auth: authInit,      // Authentication
  flash: flashInit,    // Flash messages
  form: formInit,      // Form validation
  router: routerInit,  // Vue Router integration
})
```

**Service Helper Functions** (available via `services-helper.js`):
- `t(key)` - Translations from Vuemann locale service
- `error(message)` - Display error messages via flash service
- `req(endpoint, options)` - HTTP requests (use ONLY in repositories)
- `validateForm(rules, data)` - Form validation
- `form` - Access to form service

### Application Structure

```
src/
├── apis/                    # API-specific business logic
│   └── {api-name}/
│       ├── controllers/     # Orchestrate DTOs + Repositories
│       ├── repositories/    # ONLY place for req() calls
│       ├── dtos/           # Data transformation (API ↔ Vue)
│       ├── services/       # Multi-controller orchestration
│       ├── stores/         # Pinia stores (data storage ONLY)
│       └── formRequest/    # Validation logic
├── components/             # Reusable Vue components
├── views/                  # Page-level components
├── services/              # Core Vuemann services
│   ├── ajax/             # HTTP client (axios wrapper)
│   ├── auth/             # Authentication service
│   ├── flash/            # Flash message service
│   ├── form/             # Form validation service
│   ├── locale/           # Internationalization
│   ├── router/           # Router service
│   ├── utils/            # Utility functions
│   ├── services-manager.js      # Central service orchestrator
│   └── services-helper.js       # Helper functions (t, req, etc.)
├── config/               # Configuration files
│   ├── app-config.js
│   ├── route-config.js
│   ├── routes-api-config.js
│   ├── auth-config.js
│   └── config-loader.js  # Central configuration management
├── locales/              # Translation files
│   ├── fr/
│   ├── en/
│   └── nl/
├── assets/              # Static assets
│   └── scss/           # SCSS styles (use existing classes first!)
├── helpers/            # Helper utilities
└── main.js            # Application entry point
```

### Data Flow Architecture

**STRICT separation of responsibilities:**

```
Vue Components → Controllers → Repositories → API
                     ↓
                   DTOs (transformation)
                     ↓
                  Stores (storage only)
```

**Critical Rules:**
- ❌ **Repositories**: ONLY place to use `req()` for API calls
- ❌ **Controllers**: NEVER call `req()` directly, use repositories
- ❌ **Services**: NEVER call `req()` directly, orchestrate controllers
- ❌ **Stores**: NEVER make API calls, storage only
- ❌ **Components**: NEVER contain business logic, use controllers

### Request Management System

The AJAX service has been refactored to support **simultaneous requests to multiple APIs**:

- Each request gets a unique `requestId`
- The `Request` model manages request metadata (URL, params, API base)
- HTTP client passes `requestId` in config for proper request tracking
- Interceptors handle authentication tokens and error responses

## Configuration System

### ConfigLoader

Central configuration management via `ConfigLoader`:

```javascript
import { ConfigLoader } from '@brugmann/vuemann/src/config/config-loader.js'

// Initialize with config objects
ConfigLoader.init({ routes, app, routesApi, auth, locales })

// Get config values (supports dot notation)
ConfigLoader.get('app.title')
ConfigLoader.get('auth.loginRoute', '/default-login')

// Set config values (supports dot notation)
ConfigLoader.set('app.theme', 'dark')
```

## Style System

### SCSS Architecture

**CRITICAL**: Before writing custom CSS, you MUST use existing Vuemann SCSS classes. These are located in `src/assets/scss/`.

**Key files:**
- `vuemann.scss` - Main entry point
- `_variables.scss` - Color, spacing, and size variables
- `_root.scss` - CSS custom properties (use `var(--primary)`, etc.)
- `layout/*.scss` - Utility classes

**Available utility classes:**
- **Colors**: `.color-primary`, `.bg-primary-300`, `.border-danger`
- **Spacing**: `.m-10`, `.p-15`, `.g-20` (5px increments, 0-50)
- **Flexbox**: `.d-flex`, `.f-column`, `.f-center`, `.j-between`, `.a-center`
- **Typography**: `.fs-400`, `.fw-500`, `.text-center`
- **Buttons**: `.btn`, `.btn-primary`, `.btn-danger` (hover style also applied with `.active` class)
- **Dimensions**: `.w-100`, `.h-100`, `.radius-10`
- **Interactions**: `.pointer`, `.underline-hover`

**Using CSS variables in components:**
```vue
<style lang="scss">
.custom {
  color: var(--primary);
  background: var(--neutral-200);
  border: 1px solid var(--primary-300);
}
</style>
```

## Testing

### Test Structure

Tests use a **mirror structure** matching `src/`:

```
tests/
├── apis/{api-name}/
│   ├── controllers/
│   ├── dtos/
│   └── formRequest/
├── views/
└── helpers/
```

### Test Organization by Function

**IMPORTANT**: When testing objects that export multiple functions (like `HydrateFunctions`, `DateHelpers`, etc.), organize tests by creating a subfolder with one test file per function.

**Structure:**
```
tests/services/utils/src/
└── HydrateFunctions/
    ├── hydrate-functions-hydrate.test.js
    ├── hydrate-functions-hydrateKey.test.js
    ├── hydrate-functions-extractUniqueIds.test.js
    ├── hydrate-functions-loadController.test.js
    ├── hydrate-functions-buildEntitiesMap.test.js
    └── hydrate-functions-hydrateItem.test.js
```

**Naming convention:**
- **Folder name**: PascalCase matching the exported object name (e.g., `HydrateFunctions/`)
- **File name**: Prefix with kebab-case version of the object name + function name (e.g., `hydrate-functions-hydrate.test.js`)

**Why this organization:**
- ✅ Avoids naming conflicts (each function has its own file)
- ✅ Easier to locate and maintain tests
- ✅ Better test isolation
- ✅ Clearer test output and error messages
- ✅ Follows single responsibility principle

**Example:**
```javascript
// File: tests/services/utils/src/HydrateFunctions/hydrate-functions-hydrate.test.js
import { describe, it, expect } from 'vitest'
import { HydrateFunctions } from '@brugmann/vuemann/src/services/utils/src/utils-hydrate.js'

describe('HydrateFunctions.hydrate', () => {
  it('should hydrate data', async () => {
    // Test implementation
  })
})
```

### Test Configuration

- **Framework**: Vitest with jsdom
- **Setup**: `vitest.setup.js` configures services and Vue Test Utils
- **Alias**: Use `&` for test imports (e.g., `import { mock } from '&/utils/mocks'`)

### Testing Philosophy

**Mock Minimal, Test Real Logic:**
- Use **seeders** for realistic test data
- Mock ONLY at the API layer (repositories)
- Test real DTO transformations and business logic
- Use `vi.spyOn()` WITHOUT `.mockReturnValue()` to verify flow while keeping real logic

**What to mock:**
- ✅ Repository methods (API calls)
- ✅ External services (WebSocket, localStorage cleanup)
- ✅ Dialog HTML native methods
- ✅ File system for Node.js modules

**What NOT to mock:**
- ❌ Controllers (masks DTO logic)
- ❌ DTOs (masks transformation logic)
- ❌ Helpers (date formatting, validation)
- ❌ Repositories themselves (don't test them directly)

### Available Test Utilities

Located in `tests/utils/`:

**Mocks:**
- `dialog-mock.js` - Mock HTML `<dialog>` methods
- `fs-mock.js` - Mock Node.js file system
- `path-mock.js` - Mock Node.js path module
- `router-service-mock.js` - Mock router service
- `window-mock.js` - Mock browser APIs
- `websocket-mock.js` - Mock WebSocket connections

**Helpers:**
- `triggerConfirm(wrapper, selector)` - Simplify ConfirmButton interactions
- Seeders in `tests/utils/seeders/` - Realistic test data

### Test Example

```javascript
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { getOperations } from '&/utils/seeders/operation-seeder.js'

describe('OperationController', () => {
  beforeEach(() => {
    setActivePinia(createPinia())

    const rawOperations = getOperations(2)
    vi.spyOn(OperationRepository, 'list').mockResolvedValue({
      status: STATUS.SUCCESS,
      data: rawOperations
    })
  })

  it('should transform operations through DTO', async () => {
    const result = await OperationController.list()

    expect(result.status).toBe(STATUS.SUCCESS)
    expect(result.operations).toHaveLength(2)
  })
})
```

### Testing Vue Components with Async Operations

**CRITICAL**: When testing Vue components with asynchronous operations (especially vue-i18n or other library operations), you MUST properly clean up to avoid race conditions.

**The Problem:**
- Vue components may trigger async operations (locale loading, API calls, etc.)
- If tests end before these operations complete, they continue in the background
- When the test environment tears down, `window` and other globals are destroyed
- This causes intermittent `window is not defined` or similar errors on CI/CD

**The Solution - Proper Cleanup:**
```javascript
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'

describe('ComponentWithAsync', () => {
  let wrapper

  beforeEach(() => {
    // Setup code
  })

  afterEach(async () => {
    await flushPromises()
    // Required delay: flushPromises() only handles microtasks (promises),
    // but file I/O operations (like loadLocaleMessages) use macrotasks.
    // The 50ms ensures these I/O operations complete before unmounting.
    await new Promise(resolve => setTimeout(resolve, 50))
    if (wrapper) {
      wrapper.unmount()
      wrapper = null
    }
  })

  it('should handle async operation', async () => {
    wrapper = mount(Component)

    // Trigger async action
    await wrapper.find('button').trigger('click')

    // CRITICAL: Wait for all promises before ending test
    await flushPromises()

    expect(wrapper.text()).toContain('Expected result')
  })
})
```

**Key principles:**
1. **Never modify production code** to fix test-only problems
2. **Always use `afterEach`** to unmount components and flush promises
3. **Store wrapper in shared variable** for proper cleanup across all tests
4. **Use `flushPromises()`** in `afterEach` to handle microtasks
5. **Add 50ms timeout AFTER flushPromises** - Required because file I/O operations are macrotasks, not microtasks. `flushPromises()` alone won't wait for them.
6. **Order matters**: Flush promises → Wait (50ms) → Unmount

**Example - LocaleComponent test:**
```javascript
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import Locale from '@brugmann/vuemann/src/services/locale/views/LocaleComponent.vue'

describe('LocaleComponent', () => {
  let wrapper

  beforeEach(() => {
    // Setup
  })

  afterEach(async () => {
    await flushPromises()
    // Small delay to ensure file I/O operations complete (loadLocaleMessages)
    await new Promise(resolve => setTimeout(resolve, 50))
    if (wrapper) {
      wrapper.unmount()
      wrapper = null
    }
  })

  it('change lang', async () => {
    wrapper = mount(Locale)

    await wrapper.find('#locale-dropdown-button').trigger('click')
    await wrapper.find('#local-change-nl').trigger('click')

    expect(localStorage.getItem('locale')).toBe('nl')
  })
})
```

### Testing Labels and Translations

**CRITICAL**: When testing labels or text in Vue components, you MUST test translation keys, NOT hardcoded labels.

```javascript
// ❌ FORBIDDEN: Testing hardcoded text
expect(wrapper.text()).toContain('Submit')
expect(wrapper.find('h1').text()).toBe('User List')

// ✅ CORRECT: Testing translation keys
import { t } from '@brugmann/vuemann/src/services/services-helper.js'

expect(wrapper.text()).toContain(t('users.submit'))
expect(wrapper.find('h1').text()).toBe(t('users.title'))
```

**Why this is important:**
- ✅ Tests remain valid when translations change
- ✅ Tests work across all locales
- ✅ Ensures translation keys are correctly configured
- ✅ Catches missing translation keys early

**Complete Example:**
```javascript
import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { t } from '@brugmann/vuemann/src/services/services-helper.js'
import UserList from '@/components/UserList.vue'

describe('UserList', () => {
  let wrapper

  afterEach(async () => {
    await flushPromises()
    await new Promise(resolve => setTimeout(resolve, 50))
    if (wrapper) {
      wrapper.unmount()
      wrapper = null
    }
  })

  it('should display correct labels', async () => {
    wrapper = mount(UserList)

    // Test translation keys, not hardcoded text
    expect(wrapper.find('h1').text()).toBe(t('users.title'))
    expect(wrapper.find('button').text()).toBe(t('users.add'))
    expect(wrapper.find('.description').text()).toContain(t('users.description'))
  })
})
```

## Development Best Practices

### Architecture Principles

1. **Portability First**: Keep business logic in `.js` files, not `.vue` components
2. **Early Return - NO else/else if**: ALWAYS use guard clauses and early returns. NEVER use `else` or `else if` in JavaScript
3. **No Comments**: Code should be self-documenting with clear naming
4. **Minimal Stores**: Pinia stores for data storage only, no business logic
5. **Single Responsibility**: One clear purpose per function/component
6. **KISS**: Keep it simple - avoid premature abstraction and over-engineering

### Naming Conventions

- **Files**: kebab-case (`operation-controller.js`, `ListOperationsPage.vue`)
- **Components**: PascalCase (`OperationCard.vue`)
- **Functions**: camelCase (`formatDate()`, `handleSubmit()`)
- **Contextual Naming**: Avoid redundancy (use `pdfService.download()` not `pdfService.downloadPdf()`)

### Code Organization

**Repository Pattern (ONLY place for API calls):**
```javascript
export const UserRepository = {
  async list(filters) {
    return await req('user.list', { params: filters })
  },
  async getById(id) {
    return await req('user.show', { params: { id } })
  }
}
```

**Controller Pattern (orchestrates Repository + DTO):**
```javascript
export const UserController = {
  async list(filters) {
    const apiFilters = UserDto.toList(filters)
    const response = await UserRepository.list(apiFilters)
    if (response.status !== STATUS.SUCCESS) return response

    return {
      users: response.data.map(user => UserDto.fromShow(user)),
      status: STATUS.SUCCESS
    }
  }
}
```

**DTO Pattern (data transformation):**
```javascript
const fromShow = (user) => ({
  id: user.ikUser,
  name: `${user.clastname} ${user.cfirstname}`,
  email: user.cemail,
  createdAt: dateHelper.formatDate(user.dcreated_at, 'DD/MM/YYYY')
})

const toList = (filters) => ({
  name_filter: filters.name,
  date_from: filters.dateFrom,
  date_to: filters.dateTo
})

export const UserDto = { fromShow, toList }
```

**Utility Functions Pattern (for testability and mocking):**
```javascript
// ❌ FORBIDDEN: Direct function export
export const hydrate = async (data, keys) => {
  // Implementation
}

// ✅ CORRECT: Export object with PascalCase name + "Functions" suffix
const hydrate = async (data, keys) => {
  // Implementation
}

export const HydrateFunctions = { hydrate }

// Usage in code
import { HydrateFunctions } from '@/services/utils/src/utils-hydrate.js'
await HydrateFunctions.hydrate(data, keys)

// Easy mocking in tests
vi.spyOn(HydrateFunctions, 'hydrate').mockResolvedValue(mockData)
```

**Why this pattern:**
- ✅ Enables easy mocking with `vi.spyOn()` in tests
- ✅ Consistent with Repository, Controller, and DTO patterns
- ✅ Clear naming convention (file: `utils-hydrate.js` → object: `HydrateFunctions`)
- ✅ Groups related utility functions together

**Store Pattern (data storage only):**
```javascript
export const useUsersStore = defineStore('users', () => {
  const users = ref([])

  const setUsers = (newUsers) => {
    users.value = newUsers
  }

  const addUser = (user) => {
    users.value.push(user)
  }

  return { users, setUsers, addUser }
})
```

### Vue Component Best Practices

**Use Composition API with `<script setup>`:**
```vue
<script setup>
import { ref, computed, onMounted } from 'vue'
import { t } from '@brugmann/vuemann/src/services/services-helper.js'

// Always type props
defineProps({
  user: { type: Object, required: true },
  showDetails: { type: Boolean, default: false }
})

// Extract business logic to testable functions
const handleSubmit = async () => {
  // Business logic here
}

// Expose for testing
defineExpose({ handleSubmit })
</script>

<template>
  <div class="d-flex f-column g-15 p-20">
    <h1>{{ t('users.title') }}</h1>
    <button class="btn btn-primary pointer" @click="handleSubmit">
      {{ t('users.submit') }}
    </button>
  </div>
</template>
```

### Translations

**Use Vuemann's `t()` function** (NOT vue-i18n):
```javascript
import { t } from '@brugmann/vuemann/src/services/services-helper.js'
```

Translation files follow **mirror architecture** (except `dev-*.json`):
- `src/locales/fr/apis/qop/datas/operations-status-fr.json` mirrors `src/apis/qop/datas/operations-status.js`
- `src/locales/fr/views/qop/pages/ListOperationsPage-fr.json` mirrors `src/views/qop/pages/ListOperationsPage.vue`

## Common Patterns

### Data Hydration

The `HydrateFunctions.hydrate()` utility automatically loads complete entities associated with reference objects, replacing simple references like `{ id: 1 }` with full entities loaded from controllers.

**Basic Usage:**
```javascript
import { HydrateFunctions } from '@brugmann/vuemann/src/services/utils/src/utils-hydrate.js'

// Data with simple references
const hospitalizations = [
  { id: 1, patient: { id: 1 }, service: { id: 2 } },
  { id: 2, patient: { id: 2 }, service: { id: 2 } }
]

// Hydrate automatically loads full entities
const hydratedData = await HydrateFunctions.hydrate(hospitalizations, ['patient', 'service'])

// Result: references are replaced with complete entities
// hydratedData[0].patient = { id: 1, firstname: 'John', lastname: 'Doe', ... }
```

**Advanced Usage with Filters:**
```javascript
// Only load patients for active hospitalizations
const config = {
  patient: {
    filter: (h) => h.status === 'active'  // Must return true/false
  }
}

const hydratedData = await HydrateFunctions.hydrate(hospitalizations, ['patient'], config)
```

**Filter Function Requirements:**
- **Must return**: `true` (include item) or `false` (exclude item)
- **Purpose**: Determines which items are included in the hydration process
- **NOT for transformation**: Filter should NOT modify or transform items
- **Example**:
  ```javascript
  // ✅ CORRECT: Returns boolean
  filter: (item) => item.status === 'active'
  filter: (item) => item.id > 10

  // ❌ INCORRECT: Returns object (transformation)
  filter: (item) => ({ ...item, modified: true })

  // ❌ INCORRECT: Returns item or false
  filter: (item) => item.status === 'active' ? item : false
  ```

**Custom Controller:**
```javascript
// Use a different controller than the key name
const config = {
  practitioner: {
    controller: 'opera'  // Uses OperaController instead of PractitionerController
  }
}

const hydratedData = await HydrateFunctions.hydrate(surgeries, ['practitioner'], config)
```

**Custom Method:**
```javascript
// Use a different method than the default byIds
const config = {
  patient: {
    method: 'getByIdsWithDetails'  // Uses getByIdsWithDetails instead of byIds
  }
}

const hydratedData = await HydrateFunctions.hydrate(hospitalizations, ['patient'], config)
```

**Combining Options:**
```javascript
// Combine custom controller, method, and filter
const config = {
  practitioner: {
    controller: 'opera',
    method: 'getByIdsWithDetails',
    filter: (surgery) => surgery.status === 'scheduled'
  }
}

const hydratedData = await HydrateFunctions.hydrate(surgeries, ['practitioner'], config)
```

**Prerequisites:**
- Controllers must have a `byIds(ids)` method (or the custom method specified) that accepts an array of IDs
- Reference objects must contain at least an `id` property
- Controllers follow the naming convention `{name}Controller` in `/src/apis/{name}/controllers/{name}-controller.js`

**Controller byIds Implementation Example:**
```javascript
const byIds = async (ids) => {
  const response = await PatientRepository.byIds(ids)
  if (response.status !== STATUS.SUCCESS) {
    return { status: response.status, error: response.error }
  }

  return {
    status: STATUS.SUCCESS,
    data: response.data.map((patient) => PatientDto.fromShow(patient))
  }
}

export const PatientController = { byIds }
```

**Benefits:**
- ✅ **Performance**: Automatically deduplicates IDs and loads in batch
- ✅ **Simplicity**: Single function handles multiple relations
- ✅ **Flexibility**: Custom filters and controllers
- ✅ **Immutability**: Does not modify original data

### Form Validation

The validation logic is contained in a FormRequest-type file. This file must contain a function that takes as parameter an object of data to validate. The function defines all the rules that the data must respect and passes them to the `validateForm` function.

**Rules Object Structure:**

Each input has a configuration object with these properties:
- **rules** (required) - `string|array`: Contains all validation rules for this input (can be a string with pipes or an array)
- **tests** (optional) - `object`: Custom validation functions for this input
- **errors** (optional) - `object`: Custom translation keys for errors
- **format** (optional) - `function`: Function to format the value before validation (receives all datas)

**Basic Example:**
```javascript
const validate = (data) => {
  const rules = {
    email: {
      rules: 'required|email',
      errors: {
        required: 'errors.email.required',
        email: 'errors.email.invalid'
      }
    },
    dateFrom: {
      rules: 'required|dateFutur:yyyy-mm-dd',
      errors: {
        required: 'errors.dateFrom.required',
        dateFutur: 'errors.dateFrom.dateFutur'
      }
    }
  }

  return validateForm(rules, data)
}
```

**Custom Tests Example:**
```javascript
const validate = (data) => {
  const rules = {
    lastname: {
      rules: 'required|length_check',
      tests: {
        length_check: (value, datas) => value.length < 3 ? 'length_check' : ''
      },
      errors: {
        length_check: 'field_lastname_short'
      }
    },
    firstname: {
      rules: '',
      tests: {
        conditional_required: (value, datas) => datas.lastname && !value ? 'conditional_required' : ''
      },
      errors: {
        conditional_required: 'field_firstname_required_if_lastname'
      }
    }
  }

  return validateForm(rules, data)
}
```

**Custom tests requirements:**
- Must receive two parameters: `value` (the field value) and `datas` (all form data)
- Must return an empty string `''` if validation passes
- Must return the test name (string) if validation fails (will be used to get the error message from `errors`)

**Global Tests (for cross-field validation):**

Global tests are executed after all individual input tests. They receive all form data and allow validation of complex business rules involving multiple fields.

```javascript
const validate = (data) => {
  const rules = {
    global_tests: [
      // Check that end date is after start date
      datas => {
        if (datas.start_date && datas.end_date) {
          return new Date(datas.end_date) > new Date(datas.start_date)
            ? ''
            : 'End date must be after start date'
        }
        return ''
      },
      // Check that firstname is required if lastname is present
      datas => datas.lastname && !datas.firstname
        ? 'Firstname required if lastname present'
        : ''
    ],
    start_date: { rules: 'date:yyyy-mm-dd' },
    end_date: { rules: 'date:yyyy-mm-dd' },
    firstname: { rules: '' },
    lastname: { rules: 'required' }
  }

  return validateForm(rules, data)
}
```

**Displaying global errors:**
```vue
<script setup>
import ErrorFormComponent from "@brugmann/vuemann/src/services/form/views/ErrorFormComponent.vue"
</script>

<template>
  <ErrorFormComponent name="global_tests" />
</template>
```

**Options Parameter:**

The `validateForm` function accepts an optional third parameter for configuration:

```javascript
const result = validateForm(rules, data, {
  form: 'user_form'  // Prefixes all error keys with 'user_form.'
})

// Errors will be stored as: 'user_form.email', 'user_form.dateFrom', etc.
```

**Return Value:**
```javascript
{
  valid: boolean,      // true if no errors
  datas: object,       // original data object
  errors: object       // errors object (empty if valid)
}
```

### Using Services in Components

```vue
<script setup>
import { ref } from 'vue'
import { t, error } from '@brugmann/vuemann/src/services/services-helper.js'
import { UserController } from '@/apis/users/controllers/user-controller.js'

const users = ref([])
const isLoading = ref(false)

const loadUsers = async () => {
  isLoading.value = true
  const response = await UserController.list()

  if (response.status !== STATUS.SUCCESS) {
    error(response.error)
    return
  }

  users.value = response.users
  isLoading.value = false
}
</script>
```

## Important Notes

### What NOT to Do

- ❌ **Never** use `req()` outside of repositories
- ❌ **Never** put business logic in Pinia stores
- ❌ **Never** put business logic in Vue components
- ❌ **Never** write custom CSS without checking existing SCSS classes first
- ❌ **Never** hardcode strings - use `t()` for all user-facing text
- ❌ **Never** test repositories directly - they're tested via controllers
- ❌ **Never** use `vi.mock()` - prefer `vi.spyOn()` or no mocks
- ❌ **Never** use `else` or `else if` in JavaScript - ALWAYS use early returns with guard clauses

### Early Return Pattern (No else/else if)

**CRITICAL RULE**: Never use `else` or `else if` in JavaScript code. Always use guard clauses and early returns.

```javascript
// ❌ FORBIDDEN: Using else
const validate = (operation) => {
  if (operation) {
    if (operation.date) {
      return { isValid: true }
    } else {
      return { isValid: false, error: 'Date required' }
    }
  } else {
    return { isValid: false, error: 'Operation required' }
  }
}

// ✅ CORRECT: Early returns with guard clauses
const validate = (operation) => {
  if (!operation) return { isValid: false, error: 'Operation required' }
  if (!operation.date) return { isValid: false, error: 'Date required' }

  return { isValid: true }
}

// ❌ FORBIDDEN: Using else if
const getStatus = (code) => {
  if (code === 200) {
    return 'success'
  } else if (code === 404) {
    return 'not found'
  } else if (code === 500) {
    return 'error'
  } else {
    return 'unknown'
  }
}

// ✅ CORRECT: Early returns
const getStatus = (code) => {
  if (code === 200) return 'success'
  if (code === 404) return 'not found'
  if (code === 500) return 'error'

  return 'unknown'
}
```

**Note**: This rule applies ONLY to JavaScript code. Vue templates can still use `v-if`/`v-else-if`/`v-else` as they are declarative markup, not imperative logic.

### Vite Configuration

The project uses custom Vite plugins:
- `localeVite` - Processes locale files during build
- `vuemannVite` - Copies images and generates `app.json` with version info

Aliases:
- `@brugmann/vuemann/src` → `./src`
- `&` → `./tests`

## Ajax Helpers

The `AjaxHelpers` object provides utility functions for handling HTTP responses:

```javascript
import { AjaxHelpers } from '@brugmann/vuemann/src/services/ajax/ajax-helpers.js'

// Check if status is a success (20x codes)
if (AjaxHelpers.isSuccess(response.status)) {
  // Handle successful response (200, 201, 204, etc.)
}

// Check if status is an authentication error
if (AjaxHelpers.isAuthError(response.status)) {
  // Handle 401 or 403 errors
}
```

**Available methods:**
- `isSuccess(status)` - Returns `true` for any 20x status code (200, 201, 204, etc.)
- `isAuthError(status)` - Returns `true` for 401 (Unauthorized) or 403 (Forbidden)

## Documentation References

For more detailed information, see:
- [docs/bonne-pratiques.md](docs/bonne-pratiques.md) - Comprehensive development guidelines (in French)
- [docs/testing.md](docs/testing.md) - Complete testing guide (in French)
- [package.json](package.json) - Dependencies and scripts
- [vite.config.js](vite.config.js) - Build configuration
