# ADR-09: Pas d'archivage automatique — l'archivage est une issue de modération

**Date**: 2026-07-31
**Status**: Accepted

## Context

Le MVP §9 demande qu'une proposition inactive « puisse être archivée après un délai à définir », pour qu'elle ne reste pas « indéfiniment au même niveau de visibilité ».

Cette exigence entre en contradiction avec §3, qui fonde le concept : un utilisateur peut proposer une suite « à tout moment, à partir de n'importe quel chapitre publié », y compris en revenant sur un ancien chapitre pour créer une bifurcation. Un minuteur qui dégrade la visibilité pose une date de péremption sur une promesse d'éternité.

Le mécanisme est en outre auto-réalisateur : moins de visibilité → moins de lecteurs → moins de chances d'être poursuivi → archivé. Un chapitre excellent mais que personne n'a *encore* repris serait puni pour une raison qui ne dit rien de sa qualité.

Le problème que §9 cherche à résoudre reste réel : un chapitre à quarante propositions, dont la plupart sans suite, noie les intéressantes.

## Decision

**1. Aucun archivage automatique sur inactivité.** Un chapitre sans suite reste publié indéfiniment. Aucune commande planifiée ne change l'état d'un contenu à cause du temps qui passe.

**2. L'encombrement se règle par le classement, pas par l'état.** Les suites d'un chapitre sont triées par soutiens et paginées (« voir les N autres suites »). La visibilité décroît proportionnellement ; la porte ne se ferme jamais.

**3. `chapters.status` connaît trois valeurs, et seule la modération humaine fait sortir de la première :**

| Statut | Sens | Atteint par |
|---|---|---|
| `published` | par défaut, sans limite de durée | publication |
| `archived` | issue **douce** : qualité insuffisante, hors sujet. Reste consultable depuis le profil de son auteur (§9), réversible | décision de modération |
| `hidden` | issue **dure** : haine, insulte, harcèlement, illégal. Retiré de la lecture, assorti d'une sanction | décision de modération |

Un contenu haineux n'est jamais « simplement archivé » : §9 définit l'archivage comme un contenu qui reste consultable, ce qui convient à un texte bâclé, pas à des propos haineux.

**4. L'indicateur §16 « propositions archivées sans interaction » devient une mesure**, non plus la conséquence d'un mécanisme : on compte les propositions sans soutien, sans commentaire et sans suite après un délai donné, **sans changer leur état**. L'observation est conservée, la sanction disparaît.

## Alternatives Considered

| Alternative | Pros | Cons |
|---|---|---|
| **Aucun archivage automatique (retenu)** | Cohérent avec §3 ; ne punit pas un bon chapitre pour l'inaction d'autrui ; aucun réglage arbitraire à défendre | Rien ne purge l'encombrement ; le tri porte seul cette charge |
| Archivage à N jours d'inactivité (§9 littéral) | Désencombre ; met en avant ce qui vit | Contredit §3 ; auto-réalisateur ; le délai est indéfendable (pourquoi 60 et non 90 ?) |
| Archivage conditionné à un seuil de signalements | Automatique et réactif | Downvote déguisé, exploitable en brigade — écarté par [ADR-08](ADR-08-soutien-positif-et-continuite-automatique.md) |
| Repli visuel automatique sans changement d'état | Désencombre sans « archiver » | Deux notions de visibilité concurrentes (tri + repli) pour un même effet |

## Consequences

- **Positive**: la promesse de §3 est tenue sans réserve — un chapitre reste éternellement poursuivable ; un état de contenu n'est jamais dégradé sans décision humaine ; une commande planifiée et son réglage en moins.
- **Negative**: l'encombrement n'est plus purgé du tout ; le tri par soutiens et la pagination portent seuls cette charge, à surveiller sur le premier roman qui ramifie fortement. Combiné à l'absence de downvote ([ADR-08](ADR-08-soutien-positif-et-continuite-automatique.md)), un contenu médiocre n'est freiné que par la modération humaine.
- **Risks**: la charge de modération devient le facteur limitant de l'ouverture publique — la file de traitement doit être livrée avant celle-ci. Si l'encombrement se révèle réel en observation, la réponse devra rester du ressort du **classement** (pondération, repli d'affichage) et non d'un retour au changement d'état automatique.

## Références

- [ghosty-mvp.md](../../../ghosty-mvp.md) — §3 (publication continue), §9 (propositions inactives), §12 (modération), §16 (indicateurs)
- [ghosty-mvp-plan.md](../../../ghosty-mvp-plan.md) — décision D5
- [ADR-08](ADR-08-soutien-positif-et-continuite-automatique.md) — soutien positif seul
