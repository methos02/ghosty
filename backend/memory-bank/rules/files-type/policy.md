---
paths:
  - "backend/app/Policies/**/*.php"
  - "backend/routes/api.php"
  - "backend/app/Http/Controllers/**/*.php"
---
# Policy Rules

- MUST name each public method after the Gate ability it answers (`viewAny`, `view`, `create`, `update`, `publish`, `delete`) and return `bool`, or a `Response` when the denial must not be a 403 (@see global/method-naming.md).
- MUST deny a sanctioned user on every ability that writes or moderates, with the predicate matching the action: `isWriteBanned()` (novels, chapters), `isCommentBanned()` (comments), `isBanned()` otherwise (likes included); moderation abilities use `canModerate()`. Read abilities (`view`) do not check sanctions (@see decisions/ADR-15-traitement-de-la-moderation.md).
- MUST test ownership by comparing `$user->id` with the model's `author_id`; factor a repeated check into a private method (`isOwnWork`).
- MUST use early returns, with no `else`.
- A resource whose existence must stay hidden (a draft read by someone else) MUST deny with `Response::denyAsNotFound()`, so the route answers 404, never 403.

## Where the policy is called

- MUST authorize in `routes/api.php` with `->can('ability', 'routeModel')`, on the same line as the route; a class-level ability shared by a whole area goes on its group (`->middleware('can:moderate,'.Report::class)`).
- `$this->authorize()` in a controller is reserved to a check on a model that only the request body designates (`ChapterController::store` and its `parent_id`).
- A policy is never invoked from a service.
- MUST NOT keep a `Gate::denies(...) → abort(404)` in a controller: the route `->can()` with `denyAsNotFound()` covers it.

**BAD**

```php
public function update(UpdateChapterRequest $request, int $chapterId): ChapterResource
{
    $chapter = $this->chaptersR->find($chapterId);
    $this->authorize('update', $chapter);
}
```

**GOOD**

```php
Route::put('/chapters/{chapter}', [ChapterController::class, 'update'])->can('update', 'chapter')->name('chapters.update');
```
