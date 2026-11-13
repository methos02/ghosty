---
paths:
  - "backend/app/Http/Requests/**/*.php"
  - "backend/app/Http/Controllers/**/*.php"
---
# Request Rules

## Final class

A Form Request MUST be declared `final class … extends FormRequest`. A request MUST NOT extend another request, nor delegate its rules or messages to overridable hooks: the whole contract of an endpoint reads in one file, and a change to one endpoint never silently alters another. Two endpoints validating the same shape each declare their own rules; share a block only by composition (a method returning rules, spread with `...`), never by inheritance.

**BAD**

```php
class StoreCommentReplyRequest extends StoreCommentRequest
{
    public function rules(): array
    {
        return [...parent::rules(), 'mentioned_user_id' => ['sometimes', 'nullable', 'integer']];
    }
}
```

**GOOD**

```php
final class StoreCommentReplyRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'content' => ['required', 'string', 'max:'.Config::integer('ghosty.comments.content_max_length')],
            'is_spoiler' => ['sometimes', 'boolean'],
            'mentioned_user_id' => ['sometimes', 'nullable', 'integer'],
        ];
    }
}
```

## Nested resources

A request carrying two resources namespaces them by nesting (`novel.title`, `chapter.title`). Never prefix a resource's own field names on its own endpoint (`chapter_title`): the write shape must keep matching the read shape of its Resource, and every client of the endpoint would pay for one screen's layout.

The controller stays an orchestrator: it hands each block to its own service. No duplicate DTO factory per entry point (`fromOrigin()`-style).

**BAD**

```php
'title' => ['required', 'string'],
'chapter_title' => ['required', 'string'],
```

**GOOD**

```php
'novel.title' => ['required', 'string'],
'chapter.title' => ['required', 'string'],
```
