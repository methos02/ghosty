# Learn Report: Naming honesty and layer boundaries

- **Feature / context**: multiverse reading path (chapter tree, branch support counters), combined novel+chapter form, and the novel search/filter stack.

## Proposal 1: A name must not assert what the domain denies
- **Target**: back
- **Problem encountered**: the column `is_main_child`, the planned `MainContinuityService` and the docs ("continuité principale") all implied an editorial ranking — a *main*, *recommended* version. ADR-08 states the opposite: no human arbitration, no proposal is ever rejected, the highlighted continuation is recomputed and never decided. The vocabulary reintroduced the hierarchy the model refuses.
- **Origin remark**: "mainContinuity sous entend la branch recommandé ... c'est trompeur"
- **Suggested convention**: before naming a column, service or route, check the ADR that governs it. A name must not carry a judgment (`main`, `best`, `recommended`, `official`, `winner`) that the domain explicitly refuses. Name after what is measured (`branch_like_count`) or computed, not after a verdict.
- **Suggested scope**: `backend/app/**/*.php`, `backend/database/migrations/**`, `backend/memory-bank/decisions/**`
- **Category hint**: rule

## Proposal 2: One domain word, one meaning per model
- **Target**: back
- **Problem encountered**: a new `ChapterRepository::bestBranches()` selected leaves (`continuations_count = 0`) while the existing `Chapter::isBranch()` and `scopeBranches()` meant the exact opposite (`> 0`). Two contradictory meanings of "branch" a few lines apart. Resolution: `isBranch()` became `isContinued()`, which freed "branch" for the chapter-sequence meaning.
- **Origin remark**: "je préfère branchEnd car une branch c'est un ensemble de chapitre avec une suite [...] isBranch c'est est ce qu'il y a une suite, apres on peu renommer isBranch par hasFollowing"
- **Suggested convention**: before reusing a domain word in a new identifier, grep its existing meaning in the model. If the word is taken, either rename the existing usage or pick another word — never let the same term denote two things in one bounded context.
- **Suggested scope**: `backend/app/Models/**`, `backend/app/Repositories/**`, `backend/app/Http/Resources/**`
- **Category hint**: rule

## Proposal 3: Name an accessor after what it returns
- **Target**: back
- **Problem encountered**: `Chapter::branchIds()` decomposed the materialized `path` into chapter ids, but read as "ids of branches" — entities that do not exist, ADR-07 defining a branch as derived with no table. The reviewer had to ask what the method returned.
- **Origin remark**: "le nom est bizarre, on a l'impression que l'on va récupére des id de branch alors que c'est le path avec l'id des chapitres, pathChapterIds ne serait ce pas mieux"
- **Suggested convention**: an accessor is named after the type of what it returns and, when useful, its source (`pathChapterIds`). Never name it after a concept that has no representation in the schema.
- **Suggested scope**: `backend/app/Models/**/*.php`
- **Category hint**: rule

## Proposal 4: Repository methods use plain data verbs
- **Target**: back
- **Problem encountered**: a repository method went `inheritBranchWeight()` → `startBranchLikeCount()` → `updateBranchLikeCount()`. "inherit" suggested copying the parent value when it also added the chapter's own; "start" asserted a lifecycle ("happens once, at publication") that a repository cannot enforce — that is the caller's business; "Weight" introduced a second word for a column named `branch_like_count`.
- **Origin remark**: "pourquoi start, updateBranchLikeCount ça parle tous seul ...."
- **Suggested convention**: repository methods use `create` / `update` / `delete` / `increment` plus the column they write, matching the column name exactly. No lifecycle claim (`start`, `init`, `first`), no synonym for the column.
- **Suggested scope**: `backend/app/Repositories/**/*.php`
- **Category hint**: rule

## Proposal 5: No unreachable expression kept as documentation
- **Target**: back
- **Problem encountered**: `'branch_like_count' => $parent->branch_like_count + $chapter->like_count` — at publication `like_count` is always 0, drafts being unlikeable and a chapter being created empty. The term was defended as "stating the invariant"; it only suggested a case that cannot occur.
- **Origin remark**: "like_count si au moment de la publication alors ça vaiut toujours 0"
- **Suggested convention**: an expression no reachable path can exercise is not documentation, it is noise that misleads about the domain. Remove it. If the case becomes reachable later, reintroduce it together with the test that covers it.
- **Suggested scope**: `backend/app/**/*.php`
- **Category hint**: rule

## Proposal 6: A DTO owns its payload key; use a named boolean, not an inner closure
- **Target**: back
- **Problem encountered**: `ChapterDTO::fromRequest(FormRequest $request, string $prefix = '')` built its keys with a closure declared inside the method (`$key = fn (string $field) => ...`), and let the caller dictate the prefix — `ChapterDTO::fromRequest($request, 'novel')` was writable and meaningless. Replaced by `fromRequest(FormRequest $request, bool $addPrefix = false)` with the key held by the DTO, called as `ChapterDTO::fromRequest($request, addPrefix: true)`.
- **Origin remark**: "pas fan de cette fonction dans la fonction $key, prefix ne pourrait pas être un argument bool et si true ajouter chapter ? en plus tu peux nommer l'argument dans l'appelant" then "nested est pas claire je préfère addPrefix"
- **Suggested convention**: a DTO knows the key it lives under in a nested payload; do not pass it in. Toggle with a boolean parameter, always called with a named argument at the call site. No key-building closure inside the factory.
- **Suggested scope**: `backend/app/DTO/**/*.php`
- **Category hint**: rule

## Proposal 7: A request carrying two resources nests them, never prefixes one
- **Target**: back
- **Problem encountered**: `StoreNovelRequest` validated `title`, `genre_id`, `chapter_title`, `chapter_content`, `chapter_summary`, while updating the same chapter went through the generic `PUT /chapters/{id}` validating `title`, `content`, `summary`. The `chapter_` prefix was a property of one screen, paid for by every client of the chapter API, and the two paths disagreed. Prefixing the novel instead hits the same wall symmetrically. Resolution: nested payload `{ novel: {...}, chapter: {...} }`, validated as `novel.title` / `chapter.title`, with the controller passing each block to its own service.
- **Origin remark**: "autre solution c'est que pour la création on est deux name d'input distinct: novel[] et chapter[]" and "et que create novel soit un orchestrateur qui passe tous le novel[] pour créer la novel et tous le chapter[] pour créer le chapter"
- **Suggested convention**: when one request carries two resources, namespace them by nesting. Never prefix a resource's own field names on its own endpoint — the write shape must keep matching the read shape of its Resource. The controller stays an orchestrator handing each block to its service. Removes `fromOrigin()`-style duplicate DTO factories.
- **Suggested scope**: `backend/app/Http/Requests/**`, `backend/app/Http/Controllers/**`
- **Category hint**: rule

## Proposal 8: A form spanning two resources declares one form scope per resource
- **Target**: front
- **Problem encountered**: `NovelCreateForm` put its five inputs in a single `form="novel"` scope with hand-prefixed names (`chapterTitle`, `chapterContent`), then translated API error keys back with a hand-maintained alias table passed through `ChapterController.update(id, data, { form, aliases })`. Any new field required a new alias line. A pre-existing bug hid there too: `formStore.addError()` re-prefixes with the `form` option that `validateForm()` sets and never clears, so a server error following a client validation was scoped twice (`novel.novel.title`) and reached no input.
- **Origin remark**: "voila le smell dans le chapter-controller a disparu... c'est beaucoup plus propre" (after the alias, `errorTarget` and the `aliases` parameter were removed)
- **Suggested convention**: declare one `form` scope per resource on the inputs (`form="novel"`, `form="chapter"`) with unprefixed names. Error keys then arrive already scoped (`chapter.title`) and route themselves — `toInputName()` reads the scope from a dotted key and falls back to the given form. No alias table, no per-call error target. `addValidationErrors()` clears the form option before writing, its keys being already complete.
- **Suggested scope**: `frontend/src/views/**/*.vue`, `frontend/src/services/form/**`, `frontend/src/apis/**/controllers/**`
- **Category hint**: rule

## Proposal 9: Stores store; composables orchestrate stores and controllers
- **Target**: front
- **Problem encountered**: `frontend/CLAUDE.md` stated "Composables : Stockage uniquement, PAS d'appels API", contradicting both `rules/files-type/composable.md` and the import hierarchy of `rules/global/pure-js-no-vue-imports.md` (`.vue -> Store -> Controller/Service -> Repository/DTO`). Acting on the wrong sentence produced a `NovelSearchService` taking the store as a parameter and reaching into `store.search.value` — a "pure JS" file manipulating Vue refs. The search store also duplicated the novel list and carried dead state (`isLoading`, `setNovels` unused, the real grid living in a second store).
- **Origin remark**: "elle est fausse, sinon je t'aurais pas dis déplace la logique dans le store. tu peux découplé le store avoir un composable qui appel les stores (store filtre, store des novels ... ) et les controller ainsi tu limite la responsabilité par fichier"
- **Suggested convention**: a store holds state only — no `req()`, no controller call. Orchestration that reads several stores and calls a controller lives in a composable under `apis/{domain}/composables/use-*.js`, injecting the stores it needs. Split stores by concern (filters apart from the collection) rather than growing one. Fix the CLAUDE.md sentence, which is the source of the error.
- **Suggested scope**: `frontend/src/apis/**/stores/**`, `frontend/src/apis/**/composables/**`, `frontend/CLAUDE.md`
- **Category hint**: rule

## Proposal 10: Request-scoped store shape
- **Target**: front
- **Problem encountered**: SSR runs one Node process for every visitor, so a module-level `ref()` in a store leaks state between them. The existing `rules/files-type/composable-store-export-pattern.md` mandated exactly that (module-level refs) while targeting `src/**/stores/**/*.js`. Separately, `createNovelStore` alone reads as ambiguously as "createNovel + Store", "create novel" being a real domain action here.
- **Origin remark**: "createNovelStore serais qu'un simple wrapper mais il permettrait de comprendre directement que ça retourne un novelStore" and "des fonction longue vont être moin lisible, je prèfere le const pour avoir moins d'indentation"
- **Suggested convention**: two functions — `xStore()` creating the refs and holding the behaviour as `const` declarations grouped in the returned object, and a one-line `createXStore() => xStore()` stating the return type JavaScript cannot express. The wrapper is not dead indirection. `composable-store-export-pattern` must be scoped to client-only stores. *(Already written during the session as `rules/files-type/request-scoped-store.md`; kept here for trace.)*
- **Suggested scope**: `frontend/src/**/stores/**/*.js`
- **Category hint**: rule

## Proposal 11: Files of a domain folder carry the domain prefix
- **Target**: front
- **Problem encountered**: `apis/novels/` held `novel-controller`, `novel-dto`, `novel-repository`, `novel-form-request`, `novel-async-data`, `novel-store`, `novel-search-service` — and one intruder, `search-novels-store`, which sorted away from its siblings and read with the verb first.
- **Origin remark**: "j'ai search-novels-store et novel-search-service, il faudrait le même ordre partout"
- **Suggested convention**: inside `apis/{domain}/`, every file starts with the domain singular, then the role (`novel-search-store`, not `search-novels-store`). Keeps the folder alphabetically grouped and the reading order domain-then-role.
- **Suggested scope**: `frontend/src/apis/**`
- **Category hint**: rule

## Proposal 12: The `src/core` and `src/core-vue` split must be a rule, not an example
- **Target**: front
- **Problem encountered**: the Vuemann layout separates `src/core/` (pure JS: helpers) from `src/core-vue/` (Vue-dependent: stores, composables). The project had neither — helpers sat in `src/helpers/`, composables in `src/composables/`. The convention appears **only inside the code examples** of `rules/files-type/composable.md`, never as a rule, which is why nothing enforced it and it drifted.
- **Origin remark**: "il y a un autre problème, le projet front ne respecte pas le standart vuemann avec les fichier src/core et src/core-vue"
- **Suggested convention**: state the split explicitly — `src/core/**` must not import Vue, `src/core-vue/**` may. Unresolved question the rule should settle: domain stores currently live in `apis/{domain}/stores/` (as `vuemann/CLAUDE.md` documents) while `composable.md` examples show `core-vue/stores/`.
- **Suggested scope**: `frontend/src/core/**`, `frontend/src/core-vue/**`
- **Category hint**: rule

## Proposal 13: Pluralize through vue-i18n, not through branches
- **Target**: front
- **Problem encountered**: `UserSummary` carried two computed properties chaining `if (count === 0) ... if (count === 1) ...` to pick a label, across five translation keys. Replacing them with `v-if` blocks would, given the project's `no-else` rule, produce three hand-maintained mutually exclusive conditions. The actual answer is that this is pluralization, handled natively by vue-i18n: the Vuemann `t()` shortcut forwards its second argument straight to `i18n.global.t`, so `t(key, count)` selects the form. The capability was absent from `memory-bank/doc/services/locale.md`, which documents only parameter interpolation — likely why the branches were written.
- **Origin remark**: "Pourquoi ne pas avoir des divs avec v-if plustot qu'une fonction opaque"
- **Suggested convention**: never branch on a count to pick a label. Write the forms in one key separated by `|` (zero / one / many) and call `t('key', count)`; `{count}` is filled automatically. *(Capability verified and documented during the session in `memory-bank/doc/services/locale.md`; kept here for trace.)*
- **Suggested scope**: `frontend/src/**/*.vue`, `frontend/src/locales/**`
- **Category hint**: doc
