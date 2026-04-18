# Repository Rules

## Function Signature

**CRITICAL**: Repository functions receive only an `options` object and pass it directly to `req()`.

```javascript
// ✅ CORRECT
const getBySlug = async (options) => {
  return await req('novel.show', options)
}
// Called with: NovelRepository.getBySlug({ params: { slug } })

// ❌ INCORRECT - Never receive individual parameters
const getBySlug = async (slug) => {
  return await req('novel.show', { params: { slug } })
}
```

## Summary

- Repository receives `options`, passes it as-is to `req()`
- Controller builds `{ params: {...}, body: {...} }` - only these two keys allowed
- Repository may add `headers` or other request options (e.g., `{ ...options, headers: {...} }`)
- Repository does NO transformation of params/body
