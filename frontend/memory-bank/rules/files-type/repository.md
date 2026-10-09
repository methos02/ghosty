---
paths:
  - "src/**/repositories/**/*.js"
  - "**/*-repository.js"
---
# Repository

A repository function receives only an `options` object and passes it to `req()` unchanged. The controller builds `{ params, body }`. A repository MAY add request options (`headers`, `empty404`, `no-flash`).

```js
// GOOD
const getBySlug = async options => {
  return await req('novel.show', options)
}

// GOOD
const getBySlug = async options => {
  return await req('novel.show', { ...options, empty404: true })
}

// BAD
const getBySlug = async slug => {
  return await req('novel.show', { params: { slug } })
}
```

## Simulating an absent API

When a backend route does not exist yet, the repository is the only simulation layer: after the `req()` call it injects the data the real endpoint will return. Controllers, services and DTOs stay backend-agnostic: when the real API ships, delete the simulation and nothing else changes.

- The repository owns the raw API shape: it MAY write the **snake_case** key the real endpoint will return, so the existing DTO already maps it. This is the only exemption to "API names stay in the DTO" ([dto](dto.md)).
- MUST isolate each simulation in a function named `simulate{Field}`, called from the repository function. `grep simulate` lists what is still simulated; an unnamed injection becomes permanent.
- MUST NOT simulate in a controller, a service or a DTO.

```js
// GOOD
const simulatePublicationStatus = novel => {
  novel.publication_status = 'draft'
}

const getBySlug = async options => {
  const response = await req('novel.show', { ...options, empty404: true })
  if (response.data?.novel) {
    simulatePublicationStatus(response.data.novel)
  }
  return response
}

// BAD
const show = async slug => {
  const response = await NovelRepository.getBySlug({ params: { slug } })
  response.data.publicationStatus = 'draft'
  return response
}
```
