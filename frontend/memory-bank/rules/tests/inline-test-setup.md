---
paths:
  - "tests/**/*.test.js"
---
# Inline Test Setup

MUST write mounting, fixture instantiation and the **sequence of actions** of a test directly inside each `it`, never in a shared helper or a module/`describe`-scoped `const`. Locality beats DRY for setup: every step must be readable in the `it` without opening another file.

Accepted cost: setup is repeated in every test.

Allowed because they carry no test steps:
- data-format helpers (`controllerSuccess(data)`, `controllerError(data)` in `tests/utils/helpers/`);
- mocks in `tests/utils/mocks/`;
- seeders in `tests/utils/seeders/` (their *call site* stays inside the `it`).

Decisive question: does the helper return a **value** (allowed) or perform **actions** such as mount, fill, click, assert (forbidden)?

| Forbidden | Example |
|---|---|
| Mount factory | `const mountLoader = props => mount(LoaderComponent, { props })` |
| Shared fixture at module/`describe` scope | `const novel = novelSeeder.getNovel()` above the `it`s |
| Action-sequence helper | `const fillCredentials = (wrapper, credentials) => { ... }` |

```js
// BAD
const mountLoader = props => mount(LoaderComponent, { props })
const novel = novelSeeder.getNovel()

it('renders the title', () => {
  const wrapper = mountLoader({ cb: vi.fn() })
})

// GOOD
it('renders the title', () => {
  const novel = novelSeeder.getNovel()
  const wrapper = mount(LoaderComponent, { props: { cb: vi.fn() } })
  expect(wrapper.text()).toContain(novel.title)
})
```

A fixture used both as a mock's return value and as the expected value of an identity assertion (`toBe`) MUST be declared inside the `it`: module scope hides that both are the same object, which is what the test proves.

```js
// BAD
const failure = controllerError()
it('propagates the failure', async () => {
  vi.spyOn(AuthRepository, 'login').mockResolvedValueOnce(failure)
  expect(await AuthController.login(credentials)).toBe(failure)
})

// GOOD
it('propagates the failure', async () => {
  const failure = controllerError()
  vi.spyOn(AuthRepository, 'login').mockResolvedValueOnce(failure)
  expect(await AuthController.login(credentials)).toBe(failure)
})
```

Grep check: `const mount\w+ =` or `const \w+ = (.*wrapper.*) =>` at module scope, above a `describe`, is a violation.
