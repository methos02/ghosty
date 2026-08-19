# ADR-08: Soutien positif seul, signalement comme unique voie négative, continuité courante automatique

**Date**: 2026-07-31
**Status**: Accepted

## Context

Le legacy 2016 votait `-1 / 0 / +1` et clôturait des sessions de vote qui **rejetaient** les propositions perdantes. Le MVP inverse ce principe : le vote « n'est plus une échéance destinée à éliminer les propositions » (§7), « une proposition moins soutenue peut toujours être poursuivie et devenir une branche » (§7), et l'archivage « ne doit pas être présenté comme une suppression ou un rejet » (§9).

Trois questions en découlent :

1. **Faut-il un downvote ?** Il classe, mais il permet aussi d'enterrer une proposition par vote de foule — soit l'élimination que le MVP écarte, sous une autre forme.
2. **Sans downvote, comment un lecteur signale-t-il un texte bâclé, raciste ou insultant ?** Il faut une voie, sans quoi la seule issue serait de détourner le classement.
3. **Qui désigne la continuité courante (§4) ?** Un humain ou le décompte des soutiens.

Sur le point 3, la sélection manuelle a un défaut structurel : le seul candidat plausible est l'auteur du chapitre parent, qui deviendrait juge entre des suites concurrentes écrites par d'autres, sur ses propres critères. C'est un parti pris, et §4 rappelle que la continuité courante « sert uniquement à rendre la lecture plus simple » — elle ne devrait donc pas être un pouvoir éditorial.

## Decision

**1. Le soutien est positif seul.** Un utilisateur soutient un chapitre ou une couverture, ou retire son soutien. Il n'existe aucun downvote. Le classement ordonne, il n'exclut jamais.

**2. Le signalement est l'unique canal négatif.** Il vise une faute, pas un goût, et débouche sur la modération plutôt que sur le classement. Les motifs couvrent explicitement ce que le downvote traitait de travers : `poor_quality` (texte bâclé, illisible ou incomplet), `off_topic`, `hate_speech` (racisme, propos haineux visant un groupe), `insult`, `personal_attack`, `harassment`, ainsi que `plagiarism`, `unauthorized_illustration`, `spam`, `like_manipulation` et `illegal` (§12). Un signalement par signaleur et par contenu.

**Aucun changement d'état n'est déclenché par un nombre de signalements.** Archiver ou masquer relève toujours d'une décision humaine. Sans cette règle, le bouton « signaler » redeviendrait le downvote supprimé au point 1, actionnable en brigade.

**3. La continuité courante est automatique et se mesure sur la branche entière.** Chaque chapitre porte `branch_like_count`, le cumul des soutiens depuis la racine jusqu'à lui. Le parcours de lecture par défaut est la branche du chapitre publié au cumul le plus élevé. Il n'existe ni sélection ni verrou manuel.

**Le cumul sur la branche, et non la comparaison entre frères.** Ne comparer que les suites directes d'un chapitre est un choix glouton : une suite très soutenue que personne n'a continuée bat une suite un peu moins soutenue qui porte une branche de douze chapitres, et le parcours par défaut s'arrête alors au deuxième chapitre. Le cumul fait remonter l'information d'aval jusqu'à la racine, seul endroit où existe l'information « cette branche est importante ».

**À cumul égal, le chapitre le plus profond l'emporte, puis le plus anciennement publié.** La profondeur d'abord, sinon une suite encore sans soutien — qui ne change pas le cumul — ferait s'arrêter la lecture avant la fin. L'ancienneté ensuite, pour un départage déterministe.

**Effet recherché au-delà de la lecture** : sur une feuille (`continuations_count = 0`), `branch_like_count` est l'évaluation d'une branche complète et `depth` sa longueur. Classer les meilleures branches d'un roman devient un `ORDER BY` indexé — pour l'impression, l'exploration ou une sélection éditoriale. Un calcul à la lecture ne le permettait pas sans reparcourir l'arbre à chaque requête.

**4. Le soutien ne notifie pas la perte.** Devenir la continuité courante déclenche une notification, la perdre n'en déclenche aucune : annoncer une rétrogradation transformerait un classement en défaite, à rebours de §7.

## Alternatives Considered

| Alternative | Pros | Cons |
|---|---|---|
| **Soutien positif + signalement + continuité automatique (retenu)** | Aucune proposition enterrable par la foule ; le négatif est motivé et arbitré ; personne n'arbitre entre concurrents | Le soutien porte seul le classement, la continuité et la visibilité ; contenu médiocre freiné par la seule modération |
| Vote `-1 / 0 / +1` | Signal de qualité plus riche ; auto-régulation sans modérateur | Réintroduit l'élimination écartée par §7 ; décourage les auteurs débutants ; cible le goût autant que la faute |
| Bascule automatique après N signalements | Modération sans modérateur, réactive | Downvote déguisé, exploitable en brigade — contredit le point 1 |
| Continuité choisie par l'auteur du chapitre parent | Cohérence narrative arbitrée par un humain impliqué | Il juge ses propres concurrents ; un roman abandonné fige sa continuité |
| Continuité choisie par l'auteur du roman | Vision d'ensemble | Même parti pris, à l'échelle du roman entier |
| Comparaison locale entre suites d'un même chapitre (glouton) | Un seul booléen en base ; propagation en O(profondeur) | Aveugle à l'aval : un cul-de-sac très soutenu interrompt la lecture ; aucune évaluation de branche complète possible |
| Somme du sous-arbre au lieu de la branche | Voit l'aval ; propagation vers les seuls ancêtres, donc bornée par la profondeur | Additionne des réalités mutuellement exclusives qu'aucun lecteur ne lira ensemble ; ne classe pas des branches |
| Score à horizon borné ou amorti par la distance | Pondère le proche avenir plus que le lointain | Constante arbitraire, inexplicable au lecteur ; ne produit aucune valeur interrogeable |
| Score composite (soutiens, vues, fraîcheur) | Atténue l'effet boule de neige | Opaque pour les auteurs ; réglages arbitraires ; hors périmètre MVP |

## Consequences

- **Positive**: aucune proposition ne peut être enterrée par un vote de foule ; le signal négatif est motivé, tracé et arbitré ; la mise en avant ne dépend d'aucune personne.
- **Negative**: le soutien porte trois rôles à lui seul — classer les suites, désigner la continuité courante, réguler la visibilité en l'absence d'archivage automatique ([ADR-09](ADR-09-pas-d-archivage-automatique.md)). Un contenu médiocre mais non signalé n'est freiné que par le tri.
- **Negative**: un soutien propage `branch_like_count` à toute la descendance du chapitre (`WHERE path LIKE '<path>%'`). C'est **une seule requête**, mais elle écrit autant de lignes que le sous-arbre en compte, et les soutiens se concentrent sur les premiers chapitres, ceux dont le sous-arbre est le plus large. Assumé tant que les romans sont courts ; la sortie prévue, si la latence devient perceptible, est de déporter la propagation dans une file groupée par roman — le soutien lui-même reste alors O(1) et le classement des branches accuse quelques dizaines de secondes de retard, sans conséquence pour ses usages.
- **Negative**: le cumul sur la branche favorise la longueur — cent chapitres à un soutien pèsent plus que dix chapitres à neuf. `depth` étant stockée à côté, l'affichage peut relativiser (« 230 soutiens sur 15 chapitres ») sans toucher au calcul.
- **Risks**: **modération** — masquer un chapitre laisse à sa descendance un cumul élevé, et la branche retenue s'arrête alors au chapitre masqué. Le cas est inatteignable tant que la modération n'est pas livrée, mais le lot qui la livrera devra recalculer les cumuls du roman après chaque retrait. **manipulation** — truquer les soutiens ne fausse plus seulement un classement, cela détourne le parcours de lecture par défaut ; d'où un `LikeGuard` critique (email vérifié, ancienneté de compte, unicité, pas d'auto-soutien, throttle) et le motif de signalement `like_manipulation`. **Effet boule de neige** — la continuité en tête capte les lecteurs, donc les soutiens ; atténué en gardant les suites concurrentes visibles depuis le chapitre parent, et surveillé par l'indicateur §16 « lecteurs qui explorent une réalité alternative ». **Signalements en attente** — tant que la file de modération n'est pas livrée, ils s'accumulent sans traitement automatique : c'est assumé, mais l'ouverture publique ne doit pas la précéder.

## Références

- [ghosty-mvp.md](../../../ghosty-mvp.md) — §4 (continuité courante), §7 (soutiens et votes), §12 (modération)
- [ghosty-mvp-plan.md](../../../ghosty-mvp-plan.md) — décisions D2 et D3
- [ADR-07](ADR-07-modele-multivers-arbre-de-chapitres.md) — arbre de chapitres et branche dérivée
