# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## ⚠️ RÈGLE CRITIQUE : Consultation des CLAUDE.md Spécifiques

**AVANT de travailler sur le frontend ou le backend, tu DOIS impérativement consulter le fichier CLAUDE.md spécifique correspondant** :

- **Travail sur le frontend** → Lire **[frontend/CLAUDE.md](frontend/CLAUDE.md)** en priorité
- **Travail sur le backend** → Lire **[backend/CLAUDE.md](backend/CLAUDE.md)** en priorité

Ces fichiers contiennent des règles architecturales et conventions spécifiques qui NE SONT PAS dans ce fichier général.

**Exemples de règles critiques** :
- **Backend** : Architecture des seeders avec JSON externe (JAMAIS de données hardcodées)
- **Frontend** : Architecture Controllers → Repositories → API (JAMAIS d'appels directs)

**Ce fichier (racine) ne donne qu'une vue d'ensemble**. Les détails techniques sont dans les CLAUDE.md spécifiques.

## Project Overview

**Ghosty** est une plateforme collaborative permettant aux auteurs de créer des romans interactifs chapitre par chapitre, avec un système de vote communautaire pour choisir les meilleures suites proposées.

**Migration en cours** : Passage d'un legacy PHP 5.6/jQuery/Bootstrap 3 (2016) vers une stack moderne **Vue 3 + Laravel 13 + Vuemann**.

- **Type**: Application web collaborative
- **Stack Frontend**: Vue 3 (Composition API) + Vuemann 4.2.0
- **Stack Backend**: Laravel 13 (à développer)
- **Hébergement**: O2Switch (mutualisé)

## Structure du Projet

```
ghosty/
├── frontend/          # Application Vue 3 + Vuemann (EN COURS)
│   ├── src/
│   │   ├── apis/      # Logique métier par API (à créer)
│   │   ├── views/     # Pages et composants Vue
│   │   ├── services/  # Services Vuemann (ajax, locale)
│   │   ├── composables/ # Composables globaux (état partagé)
│   │   ├── config/    # Configuration routes et API
│   │   ├── assets/    # SCSS, images, fonts
│   │   └── main.js    # Point d'entrée
│   └── CLAUDE.md      # Documentation frontend spécifique
├── backend/           # API Laravel 13 (VIDE - À DÉVELOPPER)
│   └── CLAUDE.md      # Documentation backend spécifique
├── vuemann/           # Framework Vuemann (dépendance)
│   └── CLAUDE.md      # Documentation Vuemann
├── AUDIT_MIGRATION.md # Rapport d'audit complet du legacy
├── CLAUDE_BEST_PRACTICES.md # Guide des bonnes pratiques
└── CLAUDE.md          # Ce fichier (vue d'ensemble)
```

## Documentation Complète

**⚠️ IMPORTANT** : Ce fichier donne une vue d'ensemble. Pour les détails spécifiques :

### Frontend (Vue 3 + Vuemann)
📄 **Voir [frontend/CLAUDE.md](frontend/CLAUDE.md)** pour :
- Architecture Vue 3 + Vuemann
- Services et composables
- Configuration et routing
- Développement des composants

### Backend (Laravel 13)
📄 **Voir [backend/CLAUDE.md](backend/CLAUDE.md)** pour :
- Architecture API Laravel
- Models, Controllers, Resources
- Authentification Sanctum
- Migrations et seeders

### Framework Vuemann
📄 **Voir [vuemann/CLAUDE.md](vuemann/CLAUDE.md)** pour :
- Services Vuemann (ajax, locale, auth, etc.)
- Helpers disponibles (t, req, error, form)
- Classes SCSS utilitaires
- Patterns de développement

### Bonnes Pratiques et Architecture
📄 **Voir [CLAUDE_BEST_PRACTICES.md](CLAUDE_BEST_PRACTICES.md)** pour :
- Principes architecturaux (KISS, Early Return, etc.)
- Flux de données (Controllers → Repositories → API)
- Organisation du code et tests
- Conventions de nommage

### Audit et Migration
📄 **Voir [AUDIT_MIGRATION.md](AUDIT_MIGRATION.md)** pour :
- Inventaire du projet legacy
- Vulnérabilités de sécurité critiques
- Plan de migration détaillé
- Mapping pages PHP → composants Vue
- Schéma de base de données

## Workflow Git Worktree (OBLIGATOIRE)

### ⚠️ Procédure pour Nouvelles Features

**Avant toute implémentation de feature** :

1. **Vérifier la branche courante** :
   ```bash
   git branch --show-current
   ```

2. **Si sur `master`** → Créer un worktree :
   ```bash
   # Créer un worktree pour la feature
   git worktree add ../ghosty-feature-{nom} -b feature/{nom}

   # Se déplacer dans le worktree
   cd ../ghosty-feature-{nom}
   ```

3. **Si déjà dans un worktree** → Continuer normalement

4. **Implémenter la feature** dans le worktree isolé

5. **Nettoyage après merge** :
   ```bash
   # Retourner au répertoire principal
   cd ../ghosty

   # Supprimer le worktree
   git worktree remove ../ghosty-feature-{nom}
   ```

**Règles** :
- ✅ Toujours vérifier la branche avant d'implémenter
- ✅ JAMAIS de développement direct sur `master`
- ✅ Un worktree = Une feature isolée
- ✅ Supprimer le worktree après merge

### Commandes Git Worktree Utiles

```bash
# Lister tous les worktrees
git worktree list

# Supprimer un worktree
git worktree remove {path}

# Nettoyer les worktrees orphelins
git worktree prune
```

## Commandes Essentielles

### Frontend (Vue 3)
```bash
cd frontend

# Développement
npm run dev              # Serveur dev sur http://localhost:5173

# Build
npm run build            # Compile vers backend/public/build

# Tests
npm run test             # Tests Vitest en mode watch
npm run test:ui          # Interface UI pour les tests
```

### Backend (Laravel) - À développer
```bash
cd backend

# Installation (futur)
composer install
php artisan key:generate

# Développement (futur)
php artisan serve        # Serveur dev sur http://localhost:8000

# Migrations (futur)
php artisan migrate
php artisan db:seed

# Tests (futur)
php artisan test
```

## Philosophie du Projet

### 1. Architecture Native JavaScript (Portabilité)
- Logique métier en **fichiers `.js` natifs** (pas dans `.vue`)
- Facilite migration future vers autre framework
- Séparation claire logique/présentation

### 2. Composables Globaux (Pas Pinia)
- Utilisation de **composables Vue natifs** pour l'état global
- Stockage uniquement (refs/reactive), PAS de logique métier
- Plus simple, moins de boilerplate

### 3. Vuemann au Maximum
- **95%+ des styles** via classes utilitaires Vuemann
- CSS custom uniquement en dernier recours
- Lire `vuemann/src/assets/scss/` AVANT d'écrire du CSS

### 4. KISS (Keep It Simple, Stupid)
- Solution la plus simple pour résoudre le problème actuel
- Pas d'over-engineering
- Code auto-documenté (pas de commentaires)

### 5. Early Return (Pas de else/else if)
- TOUJOURS utiliser des guard clauses
- JAMAIS de `else` ou `else if` en JavaScript
- Code plus lisible et maintenable

### 6. Tests avec Seeders + DTOs
- Mock minimal (uniquement repositories)
- Tester la vraie logique métier
- Seeders pour données réalistes

## Flux de Données (Architecture Stricte)

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐    ┌─────────────┐
│  Vue Components │───▶│   Controllers    │───▶│   Repositories  │───▶│   API REST  │
│                 │    │                  │    │                 │    │   (Laravel) │
│ - Affichage     │    │ - Orchestration  │    │ - req() SEUL    │    │             │
│ - Interaction   │    │ - DTO + Repo     │    │ - Appels HTTP   │    │             │
└─────────────────┘    └──────────────────┘    └─────────────────┘    └─────────────┘
         │                        │
         ▼                        ▼
┌─────────────────┐    ┌──────────────────┐
│  Composables    │    │      DTOs        │
│                 │    │                  │
│ - État global   │    │ - Transformation │
│ - Getters/      │    │ - API ↔ Vue      │
│   Setters       │    │                  │
│ - PAS d'API     │    └──────────────────┘
└─────────────────┘
```

**Règles critiques** :
- ❌ **Repositories** : SEULS à utiliser `req()` pour appels API
- ❌ **Controllers** : Orchestrent Repository + DTO, PAS d'appels directs
- ❌ **Composables** : Stockage uniquement, PAS d'appels API
- ❌ **Components** : Présentation uniquement, PAS de logique métier

## Fonctionnalités Principales (à migrer)

### Domaine Métier Principal
1. **Romans** : Création collaborative chapitre par chapitre
2. **Votes** : Système de vote communautaire (+1/-1/neutre)
3. **Propositions** : Plusieurs auteurs proposent des suites
4. **Covers** : Proposition et vote de couvertures
5. **Commentaires** : Système hiérarchique de discussions
6. **Notifications** : 12 types de notifications (votes, acceptations, etc.)
7. **Modération** : Signalements et sanctions progressives
8. **Gamification** : Points, favoris, statistiques

### APIs à Développer (Backend Laravel)
- `novel` : Gestion des romans
- `work` : Gestion des œuvres (chapitres + covers)
- `vote` : Système de votes
- `comment` : Commentaires hiérarchiques
- `notification` : Notifications temps réel
- `user` : Gestion utilisateurs et profils
- `moderation` : Signalements et sanctions

## Sécurité

### Vulnérabilités Critiques du Legacy (À NE PAS reproduire)
⚠️ **Le code legacy contient 9 vulnérabilités critiques** :
1. Credentials hardcodés en clair
2. Injections SQL
3. XSS (Cross-Site Scripting)
4. Upload non sécurisé
5. Hash SHA1 faible
6. Absence de CSRF
7. Cookies avec mdp en clair
8. Session fixation
9. Display errors en production

### Checklist Sécurité (Nouveau Projet)
**Backend Laravel** :
- ✅ Bcrypt/Argon2 pour passwords (`Hash::make()`)
- ✅ Eloquent ORM (pas de SQL brut)
- ✅ Form Requests avec validation stricte
- ✅ Policies pour authorization
- ✅ CSRF tokens (`@csrf`)
- ✅ Rate limiting
- ✅ `Storage::disk()` pour uploads sécurisés
- ✅ HTTPS only

**Frontend Vue** :
- ✅ Blade auto-escaping ou sanitization
- ✅ Validation côté client (VeeValidate + Zod)
- ✅ Pas de données sensibles dans localStorage
- ✅ Tokens HttpOnly + SameSite

## Conventions de Nommage

### Frontend
- **Fichiers** :
  - Composants Vue : `PascalCase.vue` (`HomePage.vue`)
  - JavaScript : `kebab-case.js` (`novel-controller.js`)
  - Tests : `{nom}.test.js` (`novel-controller.test.js`)
- **Variables** : `camelCase` (`novelsCount`, `isLoading`)
- **Constantes** : `UPPER_SNAKE_CASE` (`STATUS.SUCCESS`)
- **Fonctions** : `camelCase` (`list`, `create`, `formatDate`)
- **Composables** : `use{Name}` (`useNovels`, `useAuth`)

### Backend
- **Fichiers** :
  - Models : `PascalCase.php` (`Novel.php`)
  - Controllers : `PascalCaseController.php` (`NovelController.php`)
  - Migrations : `{timestamp}_create_{table}_table.php`
- **Variables PHP** : `snake_case` (`$novel_id`, `$date_publi`)
- **Constantes** : `UPPER_SNAKE_CASE` (`self::STATUS_DRAFT`)
- **Tables** : `snake_case` pluriel (`novels`, `works`)
- **Colonnes** : `{prefix}_{name}` (`nov_title`, `wrk_content`)

## État du Projet

### ✅ Complété
- [x] Audit complet du legacy (AUDIT_MIGRATION.md)
- [x] Documentation des bonnes pratiques (CLAUDE_BEST_PRACTICES.md)
- [x] Structure frontend Vue 3 initialisée
- [x] Services Vuemann intégrés (ajax, locale)
- [x] Configuration routes et API

### 🚧 En Cours (Frontend)
- [ ] Développement des pages principales
- [ ] Composables métier (useNovels, useWorks, etc.)
- [ ] Controllers et Repositories
- [ ] DTOs pour transformation de données
- [ ] Tests Vitest

### 📋 À Faire (Backend)
- [ ] Setup Laravel 13
- [ ] Migrations base de données
- [ ] Models Eloquent + Relations
- [ ] API Controllers REST
- [ ] Form Requests (validation)
- [ ] Resources (serialization)
- [ ] Policies (authorization)
- [ ] Authentification Sanctum
- [ ] Tests Pest/PHPUnit

### 🔄 Migration de Données
- [ ] Script migration ancienne DB → nouvelle
- [ ] Re-hash passwords (SHA1 → Bcrypt)
- [ ] Validation intégrité données
- [ ] Tests acceptance complets

## Ressources Importantes

### Documentation Interne
- **[frontend/CLAUDE.md](frontend/CLAUDE.md)** : Vue 3 + Vuemann
- **[backend/CLAUDE.md](backend/CLAUDE.md)** : Laravel 13
- **[vuemann/CLAUDE.md](vuemann/CLAUDE.md)** : Framework Vuemann
- **[CLAUDE_BEST_PRACTICES.md](CLAUDE_BEST_PRACTICES.md)** : Bonnes pratiques complètes
- **[AUDIT_MIGRATION.md](AUDIT_MIGRATION.md)** : Audit legacy + plan migration

### Documentation Externe
- [Vue 3 Documentation](https://vuejs.org/)
- [Vue Router 4](https://router.vuejs.org/)
- [Vitest](https://vitest.dev/)
- [Laravel 13 Documentation](https://laravel.com/docs/13.x)
- [Laravel Sanctum](https://laravel.com/docs/13.x/sanctum)

## Aide et Support

Pour toute question sur :
- **Architecture Vue/Vuemann** → Voir [frontend/CLAUDE.md](frontend/CLAUDE.md)
- **Architecture Laravel** → Voir [backend/CLAUDE.md](backend/CLAUDE.md)
- **Bonnes pratiques** → Voir [CLAUDE_BEST_PRACTICES.md](CLAUDE_BEST_PRACTICES.md)
- **Plan de migration** → Voir [AUDIT_MIGRATION.md](AUDIT_MIGRATION.md)

---

**Version** : 1.0
**Date** : 2025-10-18
**Projet** : Ghosty - Migration vers Vue 3 + Laravel 13
