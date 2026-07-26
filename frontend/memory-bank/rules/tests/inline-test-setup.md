---
paths:
  - "tests/**/*.test.js"
---
# Inline Test Setup

Mounting, fixture instantiation, and the *sequence of actions* that drive a test go directly inside each `it`, never in a shared helper or a module/`describe`-scoped `const`. Assume repetition between tests — locality beats DRY for setup. The `mount(Component, { props, slots })` call and every step of the test body must be readable directly in the `it`, without opening another file.

Two categories of helper stay allowed because they carry no test steps of their own:
- **Data-format helpers** in `tests/utils/helpers/` — build a *shape*, not a sequence (`controllerSuccess(data)`, `controllerError(data)`). See [no-hardcoded-data-but-seeders-instead](no-hardcoded-data-but-seeders-instead.md).
- **Mocks** in dedicated files (`tests/utils/mocks/`).

The distinguishing question: does the helper return a *value* (OK), or does it perform *actions* — mount, fill, click, assert (FORBIDDEN)?

## Forbidden Patterns

| Pattern | Example |
|---------|---------|
| Mount factory (module or `describe` level) | `const mountLoader = (props) => mount(Loader, { props })` |
| Shared fixture at module/`describe` scope | `const novel = novelSeeder.getNovel()` above the `it`s |
| Action-sequence helper (bundles test steps) | `const fillCredentials = (wrapper, creds) => { wrapper.find('#email').setValue(creds.email); ... }` |

```js
// BAD - factory + shared fixture, both outside the it
const mountLoader = (props) => mount(LoaderComponent, { props })
const novel = novelSeeder.getNovel()

describe('LoaderComponent.vue', () => {
  it('renders slot content', () => {
    const wrapper = mountLoader({ cb: vi.fn() })
    expect(wrapper.text()).toContain(novel.title)
  })
})

// GOOD - mount and fixture instantiated locally, in every it
describe('LoaderComponent.vue', () => {
  it('renders slot content', () => {
    const novel = novelSeeder.getNovel()
    const wrapper = mount(LoaderComponent, { props: { cb: vi.fn() } })
    expect(wrapper.text()).toContain(novel.title)
  })
})
```

```js
// BAD - action-sequence helper hides the steps of the test
const fillCredentials = (wrapper, { email, password }) => {
  wrapper.find('input[name="email"]').setValue(email)
  wrapper.find('input[name="password"]').setValue(password)
}

it('logs in with valid credentials', async () => {
  const wrapper = mount(LoginDialog)
  await fillCredentials(wrapper, { email: 'a@a.com', password: 'secret' })
  await wrapper.find('form').trigger('submit')
})

// GOOD - every step visible in the it, nothing to look up elsewhere
it('logs in with valid credentials', async () => {
  const wrapper = mount(LoginDialog)
  await wrapper.find('input[name="email"]').setValue('a@a.com')
  await wrapper.find('input[name="password"]').setValue('secret')
  await wrapper.find('form').trigger('submit')
})
```

Grep check: any `const \w+ = \(.*wrapper.*\) =>` or `const mount\w+ =` above a `describe`/at module scope is a violation.

## Local Identity-Passthrough Fixtures

A fixture used both as a mock's return value **and** as the expected value in a `toBe`/identity assertion must be declared inside the `it` that uses it, not at module scope — even when it looks like ordinary shared setup. Module scope hides that the mock's return value and the assertion's expectation are *the same object*, which is the fact the test exists to prove.

```js
// BAD - module-scoped, the identity relationship (mock return === expectation) is hidden
const failure = controllerError()

describe('AuthController.login', () => {
  it('propagates the repository failure', async () => {
    vi.spyOn(AuthRepository, 'login').mockResolvedValueOnce(failure)
    const result = await AuthController.login(credentials)
    expect(result).toBe(failure)
  })
})

// GOOD - local, the relationship is visible in the it: same object in and out
describe('AuthController.login', () => {
  it('propagates the repository failure', async () => {
    const failure = controllerError()
    vi.spyOn(AuthRepository, 'login').mockResolvedValueOnce(failure)
    const result = await AuthController.login(credentials)
    expect(result).toBe(failure)
  })
})
```

Seeders themselves stay shared utils (`tests/utils/seeders/`) — only their *call site* must be local to each test.
