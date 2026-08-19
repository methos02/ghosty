# Learn Report: Conventions de nommage et de structure (revue du lot 1)

- **Feature / context** : revue ligne à ligne du lot 1 « écriture et arbre » (backend Laravel + frontend Vue 3), au cours de laquelle l'utilisateur a corrigé une série de choix de nommage, de structure et de gestion d'erreurs.

## Proposal 1: Ramener les méthodes aux verbes CRUD
- **Target**: back
- **Problem encountered**: `ChapterService` et `ChapterPolicy` exposaient `propose()`, un verbe métier hérité du MVP. Il fallait ouvrir le corps pour comprendre qu'il s'agissait d'une création. Le service portait aussi `rewrite()` et `proofread()`, deux méthodes aux corps **strictement identiques** dont la distinction n'était appliquée nulle part (la validation vivait dans le Form Request), et un ternaire dans le contrôleur choisissait entre les deux.
- **Origin remark**: « je n'aime pas ce nom propose, c'est juste un store, il faut ramener au max a des actions du crud classique »
- **Suggested convention**: dans les services, policies et repositories, employer par défaut les verbes CRUD — `create`, `update`, `delete`, `find`. Ne qualifier que le cas qui s'écarte réellement du cas nu (`createContinuation` pour une création qui exige un parent). Un verbe métier n'est légitime que s'il désigne une transition d'état à effets propres, comme `publish` (qui incrémente des compteurs et propage l'activité). Deux méthodes au corps identique doivent fusionner : la distinction qu'elles prétendent porter vit ailleurs.
- **Suggested scope**: `backend/app/Services/**/*.php`, `backend/app/Policies/**/*.php`, `backend/app/Repositories/**/*.php`
- **Category hint**: rule

## Proposal 2: Pas de préposition sans complément, pas de nom positionnel
- **Target**: back
- **Problem encountered**: `ChapterRepository::draftsOf(int $authorId)` — « de » quoi ? d'un roman, d'un utilisateur, d'une branche ? Et un paramètre `Novel|Chapter $under` nommé d'après une position spatiale plutôt que d'après ce que l'objet est.
- **Origin remark**: « draftsOf => jamais de Of sans précisé quoi, ici je préfère draftByOwner » et « $under ? »
- **Suggested convention**: un nom de méthode ne se termine jamais par une préposition seule (`Of`, `By`, `For`) : le complément fait partie du nom (`draftsByOwner`). Un nom de paramètre désigne **ce que la chose est** ou la relation qu'elle porte (`attachedTo`, `parent`), jamais une position relative (`under`, `above`, `next`).
- **Suggested scope**: `backend/app/**/*.php`
- **Category hint**: rule

## Proposal 3: Nommer ce qui distingue, pas ce qui est toujours vrai
- **Target**: back
- **Problem encountered**: `NovelRepository::findBySlugWithRelations()`, `ChapterRepository::findWithRelations()`, `paginateWithRelations()` — treize appels, **aucune variante sans relations**. Le suffixe ne distinguait rien et décrivait le *comment* (un détail d'implémentation du repository) au lieu du *quoi*.
- **Origin remark**: « findBySlugWithRelations est ce que la relation est obligatoire sachant que l'on cherchera vraisemblablement toujours avec relation »
- **Suggested convention**: un nom ne porte que ce qui distingue une méthode de ses sœurs. Si une seule variante existe, le qualificatif tombe (`findBySlug`, `find`, `paginate`). Le jour où une exception apparaît, c'est **elle** qui prend le nom explicite, pas la norme.
- **Suggested scope**: `backend/app/Repositories/**/*.php`, `backend/app/Services/**/*.php`
- **Category hint**: rule

## Proposal 4: Le nom dit ce que la méthode renvoie
- **Target**: back
- **Problem encountered**: `NovelRepository::novelsBeingWritten()` annonçait des romans, avait pour type de retour `Builder<Chapter>`, et renvoyait en réalité une sous-requête de `novel_id`. Trois choses différentes dans une même signature.
- **Origin remark**: « novelsBeingWritten le nom n'est pas implicite, est-ce que tu peux le simplifier, je ne comprends pas ce que ça fait ? »
- **Suggested convention**: le nom d'une méthode privée de requête énonce la **nature** de ce qu'elle renvoie (`draftNovelIds` : des identifiants, de romans, en brouillon). Attention aux noms qui suggèrent un état stocké quand il est dérivé : un roman n'a pas de statut dans ce modèle, c'est son chapitre d'origine qui est brouillon — `getNovelsDraft` aurait fait chercher une colonne inexistante.
- **Suggested scope**: `backend/app/Repositories/**/*.php`
- **Category hint**: rule

## Proposal 5: DTO — dossier, suffixe, et frontière avec le service
- **Target**: back
- **Problem encountered**: les services recevaient `array $datas, bool $asDraft = false`. Le tableau n'était tenu que par un `@phpstan-type`, et le booléen final était illisible au site d'appel (`propose($parent, $author, $datas, asDraft: ...)`). Les contrôleurs fabriquaient ces tableaux à la main, avec une méthode privée `chapterDatas()` qui doublait le travail.
- **Origin remark**: « je n'aime pas devoir passer les data un par un et après devoir mettre asDraft car on ne sait pas pourquoi le dernier booléen est, passer un DTO ne serait-il pas mieux ? », puis « DTO c'est mieux et il faut que la classe ait le suffixe DTO », puis « alors appelle le ChapterDTO »
- **Suggested convention**: les objets de transport vivent dans `backend/app/DTO/`, en `final readonly class` suffixée `DTO`, nommées d'après l'entité **sans verbe** (`ChapterDTO`, `NovelDTO`) — le même DTO sert la création, la mise à jour et la correction. Constructeur nommé `fromRequest(FormRequest)`. Frontière : **le DTO transforme ses propres champs** via `attributes()`, **le service compose la ligne** (auteur, position dans l'arbre, statut, horodatages). Un DTO qui aurait besoin du modèle, de l'horloge ou de l'utilisateur connecté n'est plus un DTO.
- **Suggested scope**: `backend/app/DTO/**/*.php`, `backend/app/Services/**/*.php`, `backend/app/Http/Controllers/**/*.php`
- **Category hint**: rule

## Proposal 6: Migrations numérotées, pas datées
- **Target**: back
- **Problem encountered**: les migrations portaient des horodatages (`2026_07_31_141503_create_chapters_table.php`), dont l'ordre d'exécution dépend de l'horloge de qui les a générées.
- **Origin remark**: « je ne suis pas fan de la date devant les migrations, dans babyborn on a adopté une convention par numéro, peux-tu la reproduire »
- **Suggested convention**: nommer `NNNN_description.php` avec un numéro sur quatre chiffres, suivant la convention du dépôt babyborn (`0001_create_users_table.php`). L'ordre est alors explicite plutôt que déduit. Conséquence à documenter : `php artisan make:migration` produit un nom daté, à renommer à la main ; et deux branches qui prennent le même numéro entrent en collision au merge — visible, contrairement à un ordre qui changerait silencieusement.
- **Suggested scope**: `backend/database/migrations/*.php`
- **Category hint**: rule

## Proposal 7: Resources liste et détail explicites, jamais conditionnées à la route
- **Target**: back
- **Problem encountered**: `ChapterResource` décidait d'exposer ou non le `content` (un `LONGTEXT`) en interrogeant `$request->routeIs('chapters.show', 'chapters.store', ...)`. Le défaut était **cacher**, avec une liste blanche de noms de route : un endpoint ajouté sans y penser perdait son contenu en silence — pas d'erreur, juste un champ manquant et un écran vide.
- **Origin remark**: « est-ce que c'est vraiment utile de ne pas exposer un content ? » puis « unset($attributes['content'], ...) explique »
- **Suggested convention**: une Resource ne consulte pas la requête HTTP pour décider de ce qu'elle sérialise. Le cas riche est la classe de base ; le cas allégé est une sous-classe explicite (`ChapterListResource extends ChapterResource`) choisie **au site d'appel**. Le défaut devient « exposer », donc un oubli coûte de la bande passante — mesurable — au lieu d'un champ absent. Attention aux champs **calculés** : les retirer par `unset()` après coup ne dispense pas de leur calcul ; préférer une méthode protégée surchargée qui ne les produit pas.
- **Suggested scope**: `backend/app/Http/Resources/**/*.php`
- **Category hint**: rule

## Proposal 8: Ne pas compenser le typage d'Eloquent par des gardes nullsafe
- **Target**: back
- **Problem encountered**: `NovelResource` écrivait `$this->author?->id` et `$this->genre?->name` alors que `novels.author_id` et `novels.genre_id` sont des clés étrangères **non nullables**. La garde ne protégeait de rien : elle compensait `@property-read User|null $author`, généré par laravel-ide-helper qui type toute relation `BelongsTo` comme nullable.
- **Origin remark**: « author est toujours défini »
- **Suggested convention**: quand la base garantit la présence d'une relation, déclarer `@property-read X $relation` dans le docblock **de la classe du modèle** — il l'emporte sur celui du `@mixin IdeHelper*` — et écrire `$this->author->pseudo` sans garde. Deux corollaires : lire l'identifiant depuis la colonne (`$this->author_id`) plutôt que via la relation, et protéger l'accès au libellé par `whenLoaded()` pour qu'une sérialisation ne déclenche jamais un N+1 silencieux.
- **Suggested scope**: `backend/app/Models/**/*.php`, `backend/app/Http/Resources/**/*.php`
- **Category hint**: rule

## Proposal 9: Gestion des 422 — pas de DTO d'erreur, pas de statut fabriqué
- **Target**: front
- **Problem encountered**: chaque API portait un `*-error-dto.js` (`auth-error-dto`, `novel-error-dto`, `chapter-error-dto`) dont le seul rôle était de convertir `snake_case` en `camelCase` et de préfixer par le nom du formulaire — une table à maintenir à la main, où tout champ ajouté côté serveur atterrissait nulle part s'il n'y était pas déclaré. Et le contrôleur renvoyait `{ status: STATUS.ERROR }`, jetant le vrai 422 et son corps.
- **Origin remark**: « regarde la façon dont babyborn gère les 422 et applique la même chose »
- **Suggested convention**: le service de formulaire expose `addValidationErrors(validationErrors, formName, aliases = {})`, qui convertit `snake_case → camelCase` et préfixe automatiquement. Les contrôleurs appellent `form.addValidationErrors(response.data.errors, 'novel')` puis **laissent passer** la réponse réelle (`if (!ajaxHelper.isSuccess(response.status)) return response`). Aucun DTO d'erreur. Le troisième argument `aliases` n'existe que pour les vrais renommages sémantiques (`title → chapterTitle`), pas pour les conversions de casse.
- **Suggested scope**: `frontend/src/apis/**/controllers/*.js`, `frontend/src/services/form/form-service.js`
- **Category hint**: rule

## Proposal 10: Fichiers de form request nommés par entité, sans verbe d'action
- **Target**: front
- **Problem encountered**: `chapter-write-form-request.js` / `validateChapterWriteForm` et `novel-create-form-request.js` / `validateNovelCreateForm`. Le verbe était devenu faux : le même jeu de règles valide la proposition d'une suite **et** la correction d'un chapitre publié ; celui du roman valide la création **et** la reprise d'un brouillon.
- **Origin remark**: « Pourquoi chapter-write ? chapter-manage ou chapter-create / update, toujours revenir au max au verbe simple »
- **Suggested convention**: nommer `{entity}-form-request.js` exportant `validate{Entity}Form` quand un seul jeu de règles couvre toutes les écritures de l'entité — convention du dépôt babyborn (`kitty-form-request.js`). Ne qualifier que si plusieurs actions réellement distinctes coexistent (`password-update`, `password-reset`, `login`, `register`). Le nom de formulaire passé aux composants et aux clés d'erreur suit (`form="novel"`, `novel.genreId`).
- **Suggested scope**: `frontend/src/apis/**/formRequest/*.js`, `frontend/src/services/**/formRequest/*.js`
- **Category hint**: rule

## Proposal 11: Confirmation obligatoire avant une action destructrice
- **Target**: front
- **Problem encountered**: la suppression d'un brouillon partait au premier clic, sans retour possible — côté serveur, supprimer le chapitre racine emporte le roman entier.
- **Origin remark**: « il faut utiliser un component confirme pour la suppression d'un brouillon »
- **Suggested convention**: toute action irréversible passe par `ConfirmButtonComponent` (dialogue portant la question, `closeBg` et `closeCross` à `false`, bouton de confirmation en `LoaderComponent`). La question énonce la **conséquence réelle** et s'adapte au cas — supprimer un brouillon de roman efface le roman, supprimer un brouillon de chapitre efface un texte. Vuemann fournit un `ConfirmButtonComponent` mais il importe depuis `@brugmann/vuemann`, alias absent du projet : Ghosty en tient une copie locale dans `src/components/`, comme pour `DialogComponent` et `LoaderComponent`.
- **Suggested scope**: `frontend/src/views/**/*.vue`, `frontend/src/components/ConfirmButtonComponent.vue`
- **Category hint**: rule

## Proposal 12: Aucun commentaire dans le code (front)
- **Target**: front
- **Problem encountered**: le code livré était truffé de commentaires expliquant les intentions (« pourquoi cette largeur », « pourquoi ce mode dérivé de l'URL »), dans les blocs `<script setup>`, les templates Vue, les blocs SCSS et les tests.
- **Origin remark**: « Stop tous ces commentaires !!!!! le code doit être compris sans commentaire, les adr sont des choix technique, des orientation » puis, plus tard, « pas de commentaire :'( »
- **Suggested convention**: aucun commentaire de prose — ni `//`, ni `/* */`, ni `<!-- -->`. Si une ligne semble avoir besoin d'être expliquée, revoir le nom ou le découpage ; si c'est une décision structurante, ouvrir une ADR. Seules les directives d'outillage subsistent (`eslint-disable`, `prettier-ignore`). **Piège rencontré** : la règle ESLint `no-empty-function` ne tolère une fonction vide **que** si elle contient un commentaire — supprimer le commentaire casse le lint. La sortie correcte est de configurer la règle (`allow: ['arrowFunctions', 'asyncFunctions']`), pas de remettre un commentaire ; `=> undefined` et `=> null` sont refusés par `unicorn`.
- **Suggested scope**: `frontend/src/**/*.{js,vue,scss}`, `frontend/tests/**/*.js`
- **Category hint**: rule

## Proposal 13: Aucun commentaire dans le code (back)
- **Target**: back
- **Problem encountered**: mêmes commentaires de prose dans les contrôleurs, services, règles, migrations, seeders et docblocks PHP.
- **Origin remark**: « Stop tous ces commentaires !!!!! le code doit être compris sans commentaire, les adr sont des choix technique, des orientation »
- **Suggested convention**: aucun commentaire de prose, y compris les lignes descriptives à l'intérieur d'un docblock. **Exceptions** : les annotations de typage exigées par PHPStan niveau max (`@return array<string, mixed>`, `@param`, `@var`, `@mixin`, `@use`, `@property-read`) et les renvois `@see memory-bank/decisions/ADR-xx.md`, qui pointent vers l'endroit où la décision est écrite. **Pièges rencontrés** : un docblock d'une seule ligne (`/** @var array<string, mixed> */`) est une annotation, pas un commentaire — le supprimer casse PHPStan ; et Pint retire ensuite les `use` dont le seul usage était ce docblock effacé.
- **Suggested scope**: `backend/app/**/*.php`, `backend/tests/**/*.php`, `backend/config/*.php`, `backend/database/**/*.php`, `backend/routes/*.php`
- **Category hint**: rule

## Proposal 14: Identifiants de code en anglais
- **Target**: back
- **Problem encountered**: la colonne `users.pseudo` et tout ce qui en dépendait (modèle, validation, Resources) étaient le seul francisme d'un domaine par ailleurs entièrement anglophone — `title`, `content`, `summary`, `author_id`. En anglais, « pseudo » ne désigne d'ailleurs pas un surnom.
- **Origin remark**: « genre a toujours un name, et un author un pseudo (username serait pas mieux ?) » puis « oui change pseudo »
- **Suggested convention**: colonnes, propriétés, méthodes et champs d'API en anglais. Les **messages affichés** restent en français, dans `lang/fr/` : renommer un champ ne touche pas le texte du message. Le meilleur moment pour corriger un identifiant est avant tout déploiement — la migration de création s'édite alors sur place, sans `ALTER` ni fenêtre où l'API et le front divergent. Penser à régénérer ou corriger `_ide_helper_models.php`, que PHPStan lit.
- **Suggested scope**: `backend/app/**/*.php`, `backend/database/**/*.php`
- **Category hint**: rule

## Proposal 15: Identifiants de code en anglais, libellés en français
- **Target**: front
- **Problem encountered**: le renommage `pseudo → username` traversait DTO, stores, vues, clés d'erreur **et** fichiers de locales, où les valeurs françaises devaient impérativement survivre au renommage des clés.
- **Origin remark**: « genre a toujours un name, et un author un pseudo (username serait pas mieux ?) » puis « oui change pseudo »
- **Suggested convention**: variables, propriétés de DTO, noms de champs de formulaire et **clés** de traduction en anglais (`register_username`) ; **valeurs** de traduction en français (« Pseudo », « Le pseudo est requis »). Un renommage global doit protéger les chaînes affichées avant substitution — les confondre change l'interface au lieu du code.
- **Suggested scope**: `frontend/src/**/*.{js,vue}`, `frontend/src/locales/**/*.json`
- **Category hint**: rule
