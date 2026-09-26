# Learn Report: Where component logic and state live, naming honesty, shared components

- **Feature / context**: chapter reporting (one report per reader per chapter, with feedback when the dialog reopens) and the refactoring of the chapter support (like) feature that followed, on the Vue side; `is_reported` exposed on the chapter payload on the Laravel side. All proposals below target `front` — the backend work drew no remark from the developer.

## Proposal 1: Extract a composable only for duplication or an unsplittable template
- **Target**: front
- **Problem encountered**: the support logic lived in `apis/likes/composables/use-chapter-like.js` for a single consumer, `views/chapters/parts/LikeButton.vue`, a component of about thirty template lines. Reading the button told you nothing about what a click did — you had to open the composable. The extraction had been justified by `files-type/composable.md` ("use a composable when a view-oriented function depends on a store") and by `global/prefer-framework-agnostic-logic.md` (a `.vue` holds "template rendering, event handlers that delegate"), both of which, read literally, push every store-dependent handler out of the component. The composable was inlined back into the component and deleted, together with its `useChapterLikeInternal` test seam, which no test ever used — `global/prefer-internal-export-for-testability.md` says not to apply it blindly, and the tests spied on `LikeController` and read `flash`, both reachable from a component test.
- **Origin remark**: « non le composable est la quand il y a de la logique dupliqué entre deux component OU un component trop grand dont on ne peut pas découpé le template. Ici les Component est tous petit, la on est obligé d'aller dans le composable pour comprendre la logique »
- **Suggested convention**: a composable is justified by exactly two situations — the same logic is consumed by two or more components, or the component is large enough that its template must be split and the logic would otherwise be duplicated across the pieces. Neither condition met: the logic stays in the `.vue`, next to the template it serves, even when it reads stores, calls a controller and raises flashes. Depending on a store is not by itself a reason to extract. `files-type/composable.md` and `global/prefer-framework-agnostic-logic.md` must be amended to state this, otherwise the next agent re-extracts what was just inlined; this also refines Proposal 9 of the draft `naming-honesty-and-layer-boundaries` ("stores store; composables orchestrate"), which must not be read as "all orchestration leaves the component".
- **Suggested scope**: `src/**/*.vue`, `src/apis/*/composables/**/*.js`
- **Category hint**: rule

## Proposal 2: Transient request state stays in the component, never in a data store
- **Target**: front
- **Problem encountered**: an in-flight flag for the support request was placed in `apis/chapters/stores/reading-store.js` (`likePending` + `setLikePending`, reset by `setReading`) so that both buttons of the page could share it. That store holds what the reading endpoint returned and serializes it for SSR hydration; the flag is neither, it is not serialized, and it is always `false` at render time. It moved to a local `ref(false)` in the component. Checking the backend first showed the sharing was cosmetic, not a safeguard: `LikeService::like/unlike` go through `createIfAbsent`/`deleteFor`, so two concurrent supports on one chapter converge to the same state and count.
- **Origin remark**: « le likePending ne devrait pas être dans ce store »
- **Suggested convention**: a store holds data a request produced and that `serialize()`/`hydrate()` must carry. Transient interaction state — request in flight, opened panel, hovered row — stays local to the component that owns the interaction. Before promoting such a flag to a store to share it between components, establish what the sharing actually protects; if the server is idempotent, it protects nothing.
- **Suggested scope**: `src/apis/*/stores/**/*.js`, `src/**/*.vue`
- **Category hint**: rule

## Proposal 3: The owner of the data exposes the mutator
- **Target**: front
- **Problem encountered**: because `reading-store` returns `readonly(chapter)`, the like composable kept a parallel copy of the support state — `supports`, `pendings` and a `sources` Map indexed by chapter id, plus a `watch` arbitrating between the store payload and that copy, about twenty lines whose only job was to work around the `readonly`. Two sources of truth for one value. Replaced by `setChapterLike(chapterId, like)` on the store; the copy and the module-level state disappeared, and with them an SSR leak (the copy was written during `setup`, therefore on the server, from module scope).
- **Origin remark**: « il defrait y avoir une methode pour increment ou decrement le count »
- **Suggested convention**: when a view must change a value a store owns, the store gains a mutator — never a copy of that value elsewhere. The mutator applies what the API returned (the response is authoritative) rather than recomputing locally (`+1`/`-1` drifts as soon as another user acts on the same record), and guards against a stale answer: if the store no longer holds the record the response concerns, it ignores it.
- **Suggested scope**: `src/apis/*/stores/**/*.js`
- **Category hint**: rule

## Proposal 4: A handler is named after what it does, not after the action it prepares
- **Target**: front
- **Problem encountered**: `views/chapters/parts/ReadingToolbar.vue` declared `const report = () => { openChapterReport(chapter.value) }` and bound it with `@click="report"`. The name announced that a report was being sent, when the function only opened a dialog. The wrapper was removed entirely and the template now calls `@click="openChapterReport(chapter)"` — the composable's own name was already accurate, and the `v-if` above guarantees `chapter` is defined.
- **Origin remark**: « report est trompeur on dirait qu'il est en train d'envoyé le rapport alors qu'il ne fait qu'ouvrir le dialog »
- **Suggested convention**: name a handler after the effect it produces (`openChapterReport`, `toggleNightMode`), never after the business action it merely starts. A handler whose whole body forwards one call to a store or composable is not renamed, it is deleted: call the target directly from the template, arguments included. This applies `global/no-passthrough-layers.md` and `global/name-by-role-not-origin.md` to component handlers, where neither rule currently gives an example.
- **Suggested scope**: `src/**/*.vue`
- **Category hint**: rule

## Proposal 5: No defensive attribute against a threat the context excludes
- **Target**: front
- **Problem encountered**: the read link of `views/chapters/parts/ChapterCard.vue` carried `:rel="opensNewTab ? 'noopener' : undefined"` alongside its `:target`. The destination is our own route, same origin, so the tabnabbing scenario the attribute prevents requires a hostile page we would have to be serving ourselves; and every browser the project supports (Safari 12.1, Firefox 79, Chrome/Edge 88) already implies `noopener` on `target="_blank"`. The attribute and its ternary were removed.
- **Origin remark**: « sauf que ma c'est de l'interne, pourquoi mon script ferais cela ? et tu dis que les nouveau navigateur on corigé cela, lesquel ? »
- **Suggested convention**: a defensive attribute, guard or sanitization must name the threat it answers in the context where it sits. On an internal link or an internal payload, where the code on both sides is ours, the reflex protections of external links do not apply and their presence suggests a danger that does not exist. Same test for a platform behaviour: state which versions need the workaround before writing it.
- **Suggested scope**: `src/**/*.vue`
- **Category hint**: rule

## Proposal 6: A component name must not reuse a domain word that already means something else
- **Target**: front
- **Problem encountered**: `ChapterEnd.vue` names the block shown under the text of the chapter being read (support, existing continuations, write/correct actions, alternative-branch and other-novel panels). But `end` is taken by the domain: the backend has `mostPopularBranchEnds` for the tip of a branch, and the component itself computes `isAtDeadEnd`. The name also reads as "the novel's final chapter". Renamed to `ChapterFooter.vue`, with its test file and its BEM block (`chapter-end__*` → `chapter-footer__*`); the i18n keys stayed under `chapter_read.*`, which is the page's namespace.
- **Origin remark**: « ça serais pas mieux de l'appeller ChapterFooter car la on peut croire que c'est le chapitre de fin de roman »
- **Suggested convention**: before naming a component, grep the word in the domain: if it already denotes something else there, pick another one. A block whose role is layout (what sits under the text, above it, beside it) takes layout vocabulary — `Footer`, `Toolbar`, `Panel` — which cannot collide with the domain. Renaming a component renames its file, its test file and its BEM block together. Front counterpart of Proposal 2 of the draft `naming-honesty-and-layer-boundaries`, which stated the same for the backend.
- **Suggested scope**: `src/views/**/*.vue`
- **Category hint**: rule

## Proposal 7: Look for the shared component before recoding its behaviour; extend it with a slot
- **Target**: front
- **Problem encountered**: `LikeButton.vue` hand-rolls what `components/LoaderComponent.vue` already provides — a `loading` flag around the callback, `:disabled`, a frozen button size, a spinner, and the refusal of a second call while the first is in flight — including about twenty lines of SCSS and a `@keyframes` of its own. The developer spotted the duplication. The obstacle is that `LoaderComponent` renders its only slot under `v-if="!loading"`, so the like count would vanish during the request; the answer discussed is a second slot, rendered in both states, rather than a second spinner implementation in the caller.
- **Origin remark**: « tu as un component vuemann pour cela je pense » puis « il y a moyen d'intégré le compteur dans le loadeur non ? il accepte un slot ? »
- **Suggested convention**: before writing button-loading, dialog, dropdown or paginator behaviour, read `src/components/` and the Vuemann equivalent. If the shared component covers the behaviour but not the exact rendering, extend it additively — a named slot, an optional prop — so every caller benefits and no one maintains a second implementation. Duplicating it in the caller is the last resort, and it must be stated why the shared component could not be extended.
- **Suggested scope**: `src/views/**/*.vue`, `src/components/**/*.vue`
- **Category hint**: rule
