---
paths:
  - "src/**/repositories/**/*.js"
---
# Repository Rules

Repository functions receive only an `options` object and pass it directly to `req()`. No transformation of params/body. Controller builds `{ params, body }`. Repository may add `headers` or other request options.

```js
// GOOD
const getBySlug = async (options) => {
  return await req('novel.show', options)
}
// Called with: Repository.getBySlug({ params: { slug } })

// GOOD - repository adds request option
const getBySlug = async (options) => {
  return await req('novel.show', { ...options, empty404: true })
}

// BAD - individual parameters
const getBySlug = async (slug) => {
  return await req('novel.show', { params: { slug } })
}
```

## Simulating an absent API (mock-first)

When the backend route does not exist yet, the repository is the API-simulation layer: after the `req()` call it injects the data the real endpoint will return (or returns a localStorage mock in place of `req()`). Controllers, services and DTOs stay backend-agnostic — when the real API ships you delete the injection and nothing else changes.

The repository owns the raw API shape, so here it may read/write **snake_case** API fields — write the exact key the real endpoint will return so the existing DTO already maps it. This is the one place exempt from `no-api-names-outside-dto`.

**Mandatory marker.** Every mock injection must carry a greppable `// ⚠️ MOCK API` marker naming the route that will replace it, so the scaffolding is findable and deletable when the real endpoint ships. An unmarked mock is indistinguishable from real wiring and becomes permanent. Grep `⚠️ MOCK API` to audit what is still simulated.

```js
// GOOD - repository writes the snake_case key the real API will return; the DTO maps it downstream
const getTeam = async (options) => {
  const response = await req('iris_academy.organisation_unit.users', { ...options, empty404: true })
  // ⚠️ MOCK API - remove when iris_academy.organisation_unit.certification_status exists
  if (response.data?.organisation_unit) {
    response.data.organisation_unit.certification_status =
      CertificationRepository.getStatus(response.data.organisation_unit.id)
  }
  return response
}

// BAD - enrichment leaked into the controller; must be ripped out (and the DTO reworked) when the API ships
const getTeam = async (slug) => {
  const response = await TeamController.show(slug)
  response.data.certificationStatus = CertificationRepository.getStatus(response.data.id)
  return response
}
```
