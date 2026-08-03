# Learn Report: Écriture d'un roman (lot 1) — statuts HTTP, état d'écran et analyse statique

- **Feature / context**: lot 1 « Écriture et arbre » du MVP Ghosty — création d'un roman et de son chapitre d'origine, propositions de suites, brouillons, refonte de l'accueil (branche `feature/ecriture-arbre`).

## Proposal 1: Corriger les erreurs PHPStan à la cause, jamais par un pansement

- **Target**: back
- **Problem encountered**: le dépôt vivait avec 32 erreurs PHPStan au niveau `max`, considérées comme de la dette acceptable. La tentation immédiate pour les faire taire était le cast (`(int) config(...)`), la baseline, ou `@phpstan-ignore`. Or chaque erreur désignait un vrai défaut de contrat : `config()` rend du `mixed` injecté tel quel dans `Cookie::make()`, une relation typée nullable déréférencée sans garde (`$this->author->id`), un trait manipulant `$model->slug` sans le déclarer, un repository rendant un paginator sans generics. Les corriger a produit un objet de configuration typé (`TokenCookieSettings`), des accès `?->`, un `@property` explicite sur le trait, une exception explicite quand un contrat est violé — et zéro erreur.
- **Origin remark**: « Pour les erreur php stan il faut les corrigé (pas mettre de pensement) »
- **Suggested convention**: le niveau `max` doit rester à zéro erreur, sans `baseline`, sans `@phpstan-ignore*`, sans `assert()` ni `/** @var */` inline destinés à contourner l'analyse, et sans élargir un type de paramètre ou de retour pour faire passer l'outil. Les moyens légitimes : accesseurs typés (`Config::string/integer/boolean`), objet de configuration dédié pour un groupe de réglages, `@property` / generics dans les PHPDoc, vérification de type explicite (`is_string()`) quand la valeur est légitimement optionnelle, exception explicite quand c'est un contrat interne qui serait rompu. Un cast n'est acceptable que sur une valeur dont le type est déjà prouvé (jamais sur du `mixed`).
- **Suggested scope**: `backend/**/*.php`, `backend/phpstan.neon`
- **Category hint**: rule

## Proposal 2: Un appel qui écrit ne se juge pas sur `STATUS.SUCCESS`

- **Target**: front
- **Problem encountered**: `STATUS.SUCCESS` vaut `200` exactement. Or `POST /novels` répond `201 Created` et un `DELETE` peut répondre `204 No Content`. Tous les contrôleurs front testaient `if (response.status !== STATUS.SUCCESS) { return response }` : le roman était bien créé côté serveur, mais l'écran ne bougeait pas et aucune erreur n'était affichée. Le bug est resté invisible aux tests unitaires, qui simulaient tous une réponse `STATUS.SUCCESS` ; il n'a été trouvé qu'en pilotant le navigateur sur le parcours réel.
- **Origin remark**: « le système de création fonctionne ? » — la vérification déclenchée par cette question a révélé que non.
- **Suggested convention**: tout contrôleur front juge le succès via un helper partagé (`ajaxHelper.isSuccess(status)`, qui accepte `200`, `201`, `204`), jamais par une comparaison directe à `STATUS.SUCCESS`. Corollaire de test : un contrôleur qui écrit doit avoir au moins un cas simulant le code réellement renvoyé par l'API (`201` pour une création), et pas seulement `STATUS.SUCCESS`.
- **Suggested scope**: `frontend/src/apis/**/controllers/*.js`, `frontend/tests/apis/**/controllers/*.test.js`
- **Category hint**: rule

## Proposal 3: Quand deux routes rendent le même composant, l'état dérive de l'URL

- **Target**: front
- **Problem encountered**: `/` et `/novels/create` rendent tous deux `HomePage`. Vue Router réutilise alors l'instance et ne rejoue pas `setup()`. L'état d'affichage était un `ref` initialisé une seule fois depuis la route (`ref(route.current().value.name === 'novel-create' ? 'create' : 'read')`) : l'URL changeait, l'écran restait figé. Le lien du bandeau, le bouton du menu et le bouton « précédent » du navigateur étaient tous cassés de la même façon. La correction — un `computed` sur la route courante, et des onglets qui appellent `router.push()` — a réparé les quatre d'un coup.
- **Origin remark**: « lorsque je clique sur rédiger un roman rien ne se passe »
- **Suggested convention**: lorsqu'un composant sert plusieurs routes, tout état qui dépend de la route est un `computed` sur `route.current()`, jamais un `ref` initialisé au `setup()`. Les commandes d'interface qui changent cet état naviguent (`router.push`) au lieu d'écrire l'état : l'URL reste la source unique de vérité, et la navigation arrière fonctionne sans code supplémentaire.
- **Suggested scope**: `frontend/src/views/**/*.vue`, `frontend/src/config/routes-config.js`
- **Category hint**: rule

## Proposal 4: Un test ne compare pas un rendu à `t('clé')`

- **Target**: front
- **Problem encountered**: un test vérifiait les libellés d'un composant avec `expect(labels).toEqual([t('search_bar.new_novel'), …])`. Si la clé de traduction n'existe pas, `t()` retourne la clé elle-même — des deux côtés de l'assertion. Le test reste donc vert alors que l'interface affiche `search_bar.new_novel` à l'utilisateur. Le défaut n'a été révélé que par les avertissements `[intlify] Not found` d'un serveur en cours d'exécution.
- **Origin remark**: friction retenue explicitement par l'utilisateur lors du `/learn` (aucune remarque directe en conversation — le symptôme est venu des logs du serveur SSR).
- **Suggested convention**: dans un test, un libellé attendu s'écrit en clair (`expect(link.text()).toBe('Rédiger un nouveau roman')`), jamais via `t()`. Passer par `t()` des deux côtés rend le test insensible à une clé manquante, ce qui est précisément le défaut à attraper.
- **Suggested scope**: `frontend/tests/**/*.test.js`
- **Category hint**: rule

## Proposal 5: Deux blocs encadrant un élément centré ont la même largeur

- **Target**: front
- **Problem encountered**: la barre de l'accueil est faite de trois blocs (`Trier par` — actions — `Genre`) centrés ensemble. Les deux côtés faisaient 229 px et 213 px : le bloc central se trouvait donc décalé de 8 px vers la droite. Comme les côtés disparaissent en mode écriture, le centre se recentrait alors pour de bon — d'où un saut visible à chaque bascule. Le défaut n'était pas perceptible sur une capture isolée, seulement en changeant d'état ; il a été confirmé en mesurant la position du bloc central dans les deux modes.
- **Origin remark**: « par contre la barre bouge légèrement quand tu switch de nouveau a lire »
- **Suggested convention**: quand des blocs latéraux encadrent un élément centré et qu'au moins un d'eux est conditionnel, leur donner une largeur fixe identique et pousser leur contenu vers l'intérieur ; sans quoi le centre se déplace quand un côté disparaît. Vérifier en mesurant la position de l'élément centré dans chaque état, pas à l'œil.
- **Suggested scope**: `frontend/src/views/**/*.vue` (barres, en-têtes, toute mise en page à blocs conditionnels)
- **Category hint**: rule

## Proposal 6: Un écran interdit à un visiteur est un contenu, pas un message

- **Target**: front
- **Problem encountered**: la zone de création affichait, pour un visiteur non connecté, une phrase brute (« Connectez-vous pour créer un roman. ») suivie d'un bouton. Cela ressemblait à un message d'erreur, n'expliquait pas ce que le site propose, et n'offrait que la connexion — impasse pour quelqu'un qui n'a pas encore de compte. Remplacé par une carte centrée : icône, titre (« Écrivez le premier chapitre »), une phrase disant ce à quoi on s'engage, puis **connexion et inscription**.
- **Origin remark**: « le Connectez-vous pour créer un roman. pour écire un roman fait très brouillon, il faudrait quelque chose de plus design »
- **Suggested convention**: un écran ou un bloc inaccessible faute d'authentification se présente comme un contenu à part entière — titre, courte explication de ce que l'action apporte, et **les deux** portes d'entrée (connexion et inscription) — jamais une phrase seule ni un simple bouton. Il occupe la place de la fonctionnalité qu'il remplace, sans excéder la largeur d'un paragraphe lisible.
- **Suggested scope**: `frontend/src/views/**/*.vue`
- **Category hint**: rule

## Proposal 7: Un état vide propose l'action qui le remplit

- **Target**: front
- **Problem encountered**: le bandeau utilisateur affichait le nombre de brouillons en cours. À zéro, la première version disait « Aucun brouillon en cours » — un constat sans issue — ou masquait la ligne, ce qui laissait un trou. La proposition retenue affiche « Rédiger un nouveau roman », et le lien change de destination selon le cas : la page des brouillons quand il y en a, l'écran d'écriture quand il n'y en a pas.
- **Origin remark**: « et s'il n'a pas de brouille on peu peut être lui ecrire a la place Rédiger un nouveau roman ? »
- **Suggested convention**: un compteur ou une liste à zéro n'annonce pas le vide et ne disparaît pas : il devient l'invitation à faire l'action qui le remplirait, avec le lien correspondant. Le libellé et la destination se déduisent du même état, dans un `computed`, pour qu'ils ne puissent pas diverger.
- **Suggested scope**: `frontend/src/views/**/*.vue`
- **Category hint**: rule

## Proposal 8: Les états d'un composant se distinguent dans sa propre palette

- **Target**: front
- **Problem encountered**: pour marquer l'onglet actif d'une barre verte, trois pistes ont été essayées et rejetées l'une après l'autre : un liseré blanc (« je n'aime pas le border white »), la couleur secondaire du thème (`#0b3d3a`), puis un noir translucide. Chacune introduisait une teinte étrangère au composant. La solution retenue n'utilise que deux nuances du même vert (`--primary` pour l'état actif, `--primary-700` pour l'autre, avec le texte de l'inactif légèrement en retrait). Un piège technique est apparu au passage : appliquer un fond translucide par-dessus un conteneur déjà coloré produit une teinte composite imprévue — le fond de l'état actif doit porter la couleur, pas le conteneur.
- **Origin remark**: « je n'aime pas le secondary sur la barre centrale » puis « le noir ça va pas non plus, ça dénote »
- **Suggested convention**: les états d'un même composant (actif, survolé, inactif) se distinguent par des nuances de sa couleur, jamais par une couleur étrangère à celle-ci. Poser la couleur sur l'élément qui porte l'état, pas sur le conteneur : superposer un fond translucide à un conteneur coloré donne une teinte qu'on n'a pas choisie.
- **Suggested scope**: `frontend/src/views/**/*.vue`, `frontend/src/assets/scss/**`
- **Category hint**: rule

## Proposal 9: Migrer un écran, c'est migrer ses deux états

- **Target**: front
- **Problem encountered**: le bandeau d'accueil a été repris du legacy en ne traitant que le visiteur : titre du site, accroche et bouton « Le principe » restaient affichés à un utilisateur connecté. Or l'écran d'origine remplaçait tout cela par les données de l'utilisateur (avatar, pseudo, brouillons en cours, notifications). La place occupée par une présentation du site est perdue pour quelqu'un qui l'utilise déjà.
- **Origin remark**: « tu as loupé un chose, il n'y a plus le titre Bienvenue sur GHOSTY […] c'est changé par des data du user courant, s'il est connecté pas la peine de lui rappelé qu'il est sur ghosty »
- **Suggested convention**: reprendre un écran existant impose de relever ses **deux** états, connecté et déconnecté, avant de l'implémenter — la version connectée n'est presque jamais la version visiteur avec un bouton en moins. Le contenu promotionnel (accroche, présentation du concept) ne s'affiche qu'aux visiteurs ; la même place sert, pour un utilisateur connecté, à ses propres données et à ses raccourcis.
- **Suggested scope**: `frontend/src/views/**/*.vue`
- **Category hint**: rule
