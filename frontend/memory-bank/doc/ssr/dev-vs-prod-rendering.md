# SSR — rendu dev vs prod (clignement / FOUC)

Comportement connu de la stack SSR (Vite + `server.js`). Constaté le 2026-07-27.

## Le symptôme

En **dev** (`npm run dev:ssr`), on voit un clignement au chargement : d'abord un rendu **sans CSS**, puis le rendu stylé, puis l'app hydratée.

## La cause

En mode dev, **Vite n'extrait pas le CSS dans un fichier** — il l'injecte via JavaScript après coup. Le HTML SSR renvoyé ne contient donc **aucun `<link>` vers le CSS de l'app** (seulement Font Awesome CDN + `/@vite/client`). D'où le flash de contenu non stylé (FOUC).

Vérifiable :

```bash
curl -s http://localhost:5173/ | grep stylesheet
# → uniquement le CDN Font Awesome, pas de /assets/index-*.css
```

## Pourquoi ce n'est PAS un bug applicatif

En **prod** (`npm run build` + `npm run serve`), `build:client` extrait le CSS dans `/assets/index-*.css` et le lie dans le `<head>` → le navigateur reçoit du **HTML déjà stylé** → **pas de FOUC**.

```bash
curl -s http://localhost:5174/ | grep stylesheet
# → <link rel="stylesheet" href="/assets/index-*.css">
```

## Décision

On **ne corrige pas** le FOUC côté dev : on préfère développer dans les mêmes conditions que la prod plutôt que d'ajouter un contournement dev-only.

## Si un clignement apparaît EN PROD

C'est une **vraie régression** (≠ l'artefact dev connu ci-dessus). Diagnostiquer en priorité :

1. Vérifier que le HTML servi contient bien `<link rel="stylesheet" href="/assets/index-*.css">` dans le `<head>`.
2. Sinon : soit `build:client` n'a pas extrait le CSS, soit `server.js` ne sert pas le bon `index.html` (celui de `dist/client`).

Ne pas confondre avec le clignement de dev, qui lui est normal.
