# Learn Report: Autonomie des composants et frontières de responsabilité

- **Feature / context**: page d'exploration du multivers (arbre de chapitres, branche sélectionnable, résumés en dialogue) et barre de la page de lecture, côté Vue ; endpoint `/tree` et remodelage de la branche côté Laravel.

## Proposal 1: Un composant ne reçoit pas en prop ce qu'un store lui donne
- **Target**: front
- **Problem encountered**: `ReadingToolbar` recevait `novelSlug` et `novelTitle`, `BranchBreadcrumb` recevait `novelSlug` et `ancestors`, `ChapterCard` recevait `novelSlug`, `canCorrect`, `isSelected`, `isPopular` et `alternativesCount`. Toutes ces données existaient déjà dans les stores request-scoped (`novel`, `reading`, `tree`), fournis à l'application entière par `ssr/app.js`. La page servait donc de courroie de transmission, et `ChapterEnd` repassait à `ContinuationSwitcher` des props qu'il ne faisait que traverser.
- **Origin remark**: « pourquoi ne pas importer selectedNovel plutôt que d'avoir novelSlug et novelTitle en props, il faut limiter les props » puis « idem il faut le rendre plus autonome ».
- **Suggested convention**: un composant de vue lit lui-même les stores dont il a besoin ; une prop ne se justifie que pour une donnée que l'appelant seul connaît (l'élément courant d'une boucle) ou pour un état qui n'existe que dans son contexte d'appel. Corollaire à documenter : ce que le composant gagne en autonomie, ses tests le paient — tout montage doit désormais fournir les stores injectés, ce qui est le signal qu'il faut vérifier que le composant n'en tire pas trop.
- **Suggested scope**: `frontend/src/views/**/*.vue`
- **Category hint**: rule

## Proposal 2: Deux comportements dans un composant, c'est deux conteneurs et un template
- **Target**: front
- **Problem encountered**: `ChapterCard` servait dans le multivers et en fin de lecture. Trois `computed` testaient la même condition `currentRoute.name === 'multiverse'` pour décider du clic, de la bordure de sélection et du badge. Un composant, deux métiers, et un discriminant fragile — le store de l'arbre survivant à la navigation, une heuristique « si l'arbre est vide » aurait produit un bug invisible après un passage par le multivers.
- **Origin remark**: « j'ai l'impression qu'il y a vraiment deux logiques différentes pour un seul template, est-ce que l'on ne pourrait pas diviser les deux qui appellent un seul template ? »
- **Suggested convention**: dès qu'un composant teste deux fois le même discriminant de contexte, séparer en deux conteneurs (`MultiverseChapterCard`, `ReadingChapterCard`) qui portent chacun un seul comportement et rendent le même composant de présentation. Le composant présentationnel ne connaît alors ni la route ni les stores de contexte. Bénéfice mesurable : les dépendances se répartissent — après la séparation, les tests de la lecture n'ont plus eu besoin du store de l'arbre, ni ceux du multivers du store de lecture.
- **Suggested scope**: `frontend/src/views/**/*.vue`
- **Category hint**: rule

## Proposal 3: Émettre ce qui dépend du contexte, agir sur ce qui n'en dépend pas
- **Target**: front
- **Problem encountered**: `ChapterCard` a traversé quatre formes en une session — quatre `defineEmits`, puis un objet `actions` passé en prop, puis quatre props de type `Function`, avant de se stabiliser. L'objet ne documentait ni ne validait rien (`{ type: Object, required: true }`), les quatre props alourdissaient chaque appel, et les émissions ne disaient pas qui répondait.
- **Origin remark**: « je ne suis pas fan des events car on ne sait pas quel composant répond et ça peut créer un code spaghetti », puis « pas fan non plus car on a 3652 props… les events étaient la version la plus simple », puis « supprime-moi le select et showAlternative comme event et appelle les fonctions directement ».
- **Suggested convention**: trancher par la nature de l'action, pas par le mécanisme. Une action au sens identique partout (ouvrir un résumé, aller corriger un chapitre) est exécutée par le composant lui-même via un composable ou le router. Une action dont le sens change selon l'écran (sélectionner dans une branche ici, naviguer là) remonte au conteneur — émission ou appel direct depuis un conteneur dédié (cf. Proposal 2), jamais un objet fourre-tout ni une liste de props-fonctions.
- **Suggested scope**: `frontend/src/views/**/*.vue`
- **Category hint**: rule

## Proposal 4: Un dialogue ouvrable de partout est un composable et une seule instance montée
- **Target**: front
- **Problem encountered**: le dialogue de résumé était monté par chaque parent, avec un `ref`, une fonction `openSummary` et l'élément dans le template — dupliqué entre `MultiversePage` et `ContinuationSwitcher`. Le mettre dans la card aurait produit une instance par card, soit une trentaine de dialogues portant chacun 500 caractères de résumé.
- **Origin remark**: « le dialog show summary devrait être un composant + composable appelable de partout ».
- **Suggested convention**: pour un dialogue global, suivre le patron déjà en place avec `useAuth()` / `<LoginDialog />` : un composable détient l'état d'ouverture, le composant le lit, et il est monté **une seule fois** dans le layout. N'importe quel composant l'ouvre en appelant le composable, sans prop ni émission. Les tests doivent remettre cet état à zéro dans leur `afterEach`, puisqu'il est partagé.
- **Suggested scope**: `frontend/src/views/**/*.vue`, `frontend/src/apis/**/composables/*.js`
- **Category hint**: rule

## Proposal 5: Le conteneur énonce le fait, la présentation choisit les mots
- **Target**: front
- **Problem encountered**: les deux conteneurs de card calculaient chacun un `popularLabel` avec `t()`, donc la même décision « quel badge afficher » rendue deux fois, avec deux conditions différentes et le même vocabulaire.
- **Origin remark**: « dupliqué dans les deux chapter card ».
- **Suggested convention**: quand plusieurs conteneurs alimentent un même composant de présentation, ils lui transmettent un **état** issu d'une énumération partagée (`POPULARITY.NONE | NOVEL | BRANCH` dans `constants/`), jamais un libellé déjà traduit. Le composant de présentation détient seul la correspondance état → texte, et `t()` disparaît des conteneurs. Un booléen ne convient plus dès qu'il existe trois cas.
- **Suggested scope**: `frontend/src/views/**/*.vue`, `frontend/src/constants/*.js`
- **Category hint**: rule

## Proposal 6: Un libellé n'affirme que ce qui est vrai à la portée qu'il annonce
- **Target**: front
- **Problem encountered**: le badge « La plus populaire » a d'abord marqué le premier élément d'une liste de suites, c'est-à-dire le frère au plus fort cumul — une approximation gloutonne que l'ADR-08 écarte explicitement (« le cumul, jamais la comparaison entre frères »). Même défaut dans la barre de lecture, où « Voie que vous suivez » laissait croire à un chemin personnel alors que c'est la voie la plus populaire passant par le chapitre lu.
- **Origin remark**: « il faut que ce badge soit juste pour la vraie branche populaire donc où ce n'est pas choquant que le badge disparaisse si on n'est pas dans cette branche », puis « l'intitulé des badges ne reflète pas cela ».
- **Suggested convention**: un libellé d'interface qui qualifie un classement doit correspondre exactement à la règle appliquée par l'API, portée comprise. Quand la portée change, le libellé change avec elle (« Voie la plus populaire du roman » / « … depuis ce chapitre », « La plus populaire » / « La plus populaire d'ici »). Il vaut mieux qu'un badge disparaisse qu'il affirme une chose fausse ; si le front ne peut pas connaître la portée, c'est un champ à ajouter à la réponse — ici `branch_is_current_continuity`.
- **Suggested scope**: `frontend/src/views/**/*.vue`, `frontend/src/locales/**/*.json`
- **Category hint**: rule

## Proposal 7: Un reformatage de la donnée API appartient au DTO, pas à un `computed` de vue
- **Target**: front
- **Problem encountered**: la page de lecture découpait le texte du chapitre en paragraphes dans un `computed` (`content.split(/\n+/)`), alors que le format d'arrivée — un texte à sauts de ligne, CRLF ou LF selon l'auteur — est une caractéristique de la charge utile.
- **Origin remark**: « pourquoi ce n'est pas dans le DTO ? avec une props paragraphs ».
- **Suggested convention**: toute transformation qui dépend du format renvoyé par l'API vit dans le DTO et arrive dans la vue sous forme de champ prêt à l'emploi (`paragraphs`). La vue ne connaît que la forme Vue. Effet de bord attendu sur les tests : le cas limite (fins de ligne mélangées) se teste sur le DTO, et la vue se contente de vérifier qu'elle rend un élément par entrée.
- **Suggested scope**: `frontend/src/apis/**/dtos/*.js`, `frontend/src/views/**/*.vue`
- **Category hint**: rule

## Proposal 8: Les classes de `App\Support` portent le suffixe `Support`
- **Target**: back
- **Problem encountered**: `App\Support` contenait `CoverUrl` et `TokenCookieSettings`, sans suffixe, alors que tout le reste du backend l'affiche (`ChapterController`, `ChapterRepository`, `ChapterPolicy`, `ChapterService`, `ChapterDTO`). Une nouvelle classe y a été ajoutée sous le nom `ChapterChain`, ce qui laissait deux conventions cohabiter dans un même dossier.
- **Origin remark**: « ces classes doivent alors finir par Support ».
- **Suggested convention**: le suffixe d'une classe annonce son dossier. `App\Support\XxxSupport`, et les tests suivent (`XxxSupportTest`). Une convention appliquée à moitié n'en est pas une : renommer l'existant en même temps que l'ajout.
- **Suggested scope**: `backend/app/Support/**/*.php`, `backend/tests/**/Support/**/*.php`
- **Category hint**: rule

## Proposal 9: Un repository ne fait que des requêtes ; le remodelage en mémoire sort dans `App\Support`
- **Target**: back
- **Problem encountered**: `ChapterRepository::chainFromRoot()` reconstruisait une chaîne ordonnée à partir d'une collection déjà chargée — un `groupBy` et une boucle, aucune requête — dans une classe dont la règle du projet dit qu'elle est le seul endroit de l'accès base, donc implicitement rien d'autre.
- **Origin remark**: « ça ne serait pas mieux de le mettre dans un DTO, c'est pas une requête c'est du formatage de donnée ».
- **Suggested convention**: une transformation purement en mémoire quitte le repository. Elle ne va pas dans un DTO — les DTO du projet sont des objets `readonly` construits depuis une `Request` — mais dans `App\Support`, en classe statique testable sans base (`tests/Unit`). Piège rencontré en écrivant ces tests : construire un modèle Eloquent avec `new Chapter(['id' => 10])` laisse `id` à `null` car la colonne est *guarded*, ce qui a fait boucler indéfiniment le parcours ; utiliser `forceFill`.
- **Suggested scope**: `backend/app/Repositories/**/*.php`, `backend/app/Support/**/*.php`
- **Category hint**: rule

## Proposal 10: Une méthode privée à usage unique se réintègre dans son action
- **Target**: back
- **Problem encountered**: l'action `tree()` déléguait à `treeOrigin()` et `treeChapters()`, deux méthodes privées appelées une seule fois et déclarées cent lignes plus bas. Lire l'endpoint demandait deux sauts pour reconstituer une règle qui tient en une condition.
- **Origin remark**: « pourquoi avoir ces micro-fonctions, ça serait plus lisible si c'était dans la fonction tree ».
- **Suggested convention**: dans un contrôleur, une méthode privée appelée une seule fois et dont le nom ne fait que répéter son corps se réintègre dans l'action. Garder l'extraction quand la méthode porte un véritable algorithme dont le détail parasiterait la lecture — `nextChapterIdInBranch()` (chercher la position puis prendre le suivant) reste extraite pour cette raison.
- **Suggested scope**: `backend/app/Http/Controllers/**/*.php`
- **Category hint**: rule

## Proposal 11: Un worktree a son port et sa base
- **Target**: back
- **Problem encountered**: le front ne joignait plus l'API. Trois causes empilées : deux vhosts Apache déclaraient le même `ServerName api.ghosty.local` (l'un sur `:80` vers le worktree principal, l'autre sur `:8080` vers le worktree de la feature), le `.env` du front visait `:8081` où rien n'écoutait, et les deux `.env` backend pointent sur la même base `ghosty`. Pendant le diagnostic, une requête vers le port 80 a répondu correctement — mais c'était l'autre checkout, avec son code et son CORS. Une heure perdue, et un `migrate:fresh --seed` aurait écrasé les données du worktree voisin.
- **Origin remark**: « j'ai lancé wamp et run dev:ssr mais le front n'arrive pas à communiquer avec le back. Qu'est-ce que je dois faire » puis « ça ne fonctionne pas ».
- **Suggested convention**: documenter le protocole d'ouverture d'un worktree — vhost sur un port dédié, `VITE_GHOSTY_API_URL` aligné sur ce port, `DB_DATABASE` propre au worktree, et vérification que le port répond avant de chercher plus loin (`curl` sur l'endpoint, contrôle de l'en-tête `Access-Control-Allow-Origin` qui trahit le mauvais checkout). Rappeler aussi que Vite ne relit les `.env` qu'au démarrage : comparer la date de modification du fichier et l'heure de lancement du process avant de conclure à un problème de configuration.
- **Suggested scope**: `backend/memory-bank/doc/**`, `frontend/.env.example`, `backend/.env.example`
- **Category hint**: doc
