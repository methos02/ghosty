# Rapport d'Audit & Plan de Migration - Projet Ghosty

**Date** : 2025-10-01
**Projet** : Ghosty - Plateforme collaborative d'écriture de romans interactifs
**Version actuelle** : Legacy 2016 (PHP 5.6 / MySQL / jQuery / Bootstrap 3)
**Stack cible** : Vue 3 + Laravel 12 + Vuemann

---

## 📋 Table des matières

1. [Résumé exécutif](#résumé-exécutif)
2. [Inventaire du projet existant](#inventaire-du-projet-existant)
3. [Architecture actuelle](#architecture-actuelle)
4. [Points critiques de sécurité](#points-critiques-de-sécurité)
5. [Dette technique](#dette-technique)
6. [Schéma de base de données](#schéma-de-base-de-données)
7. [Plan de migration](#plan-de-migration)
8. [Mapping pages → composants Vue](#mapping-pages--composants-vue)
9. [API Laravel nécessaires](#api-laravel-nécessaires)
10. [Stratégie de migration](#stratégie-de-migration)
11. [Estimation et roadmap](#estimation-et-roadmap)

---

## 🎯 Résumé exécutif

### Vue d'ensemble

**Ghosty** est une plateforme collaborative permettant aux auteurs de créer des romans interactifs chapitre par chapitre, avec un système de vote communautaire pour choisir les meilleures suites proposées.

**Fonctionnalités principales** :
- Création de romans par chapitres avec votes communautaires
- Proposition de couvertures (covers) avec système de vote
- Sessions de vote hebdomadaires avec algorithme de classement sophistiqué
- Système de notifications complet (12 types)
- Modération avec signalements et sanctions progressives
- Gamification (points, favoris, statistiques)
- Personnalisation de la lecture

### État actuel

**⚠️ CRITIQUE** : Le projet présente **9 vulnérabilités critiques de sécurité** qui doivent être corrigées immédiatement :
- Credentials hardcodés en clair
- Injections SQL possibles
- XSS (Cross-Site Scripting)
- Upload de fichiers non sécurisé
- Hash de mot de passe faible (SHA1 + salt fixe)
- Absence de protection CSRF
- Authentification par cookies avec mdp en clair
- Session fixation
- Display errors activé en production

**Dette technique** : Code PHP 5.6 (EOL 2019), dépendances obsolètes, architecture monolithique, pas de tests.

### Recommandations

1. **URGENT (P0)** : Sécurisation immédiate (avant migration)
2. **Court terme** : Migration progressive vers Laravel 12 + Vue 3 avec Vuemann
3. **Moyen terme** : Refactoring et optimisations
4. **Estimation** : 110 jours/homme (~3 mois avec 2 développeurs)

---

## 📦 Inventaire du projet existant

### Structure du projet

```
ghosty/
├── backend/                    # Vide (futur Laravel)
├── frontend/                   # Vide (futur Vue)
├── vuemann/                    # Framework utilitaire (CSS/JS + docs)
│   ├── docs/
│   │   ├── bonne-pratiques.md  # ⭐ Guide architecture Vue + Vuemann
│   │   └── testing.md          # ⭐ Guide tests Vitest
│   └── src/                    # Components, services, helpers Vuemann
├── class/                      # 15 classes PHP métier
├── includes/                   # 20 composants PHP réutilisables
├── assets/                     # CSS (1935 lignes) + JS (3888 lignes)
├── images/                     # 51 fichiers (logo, icônes, illustrations)
├── tool/                       # Scripts utilitaires
├── test/                       # Vide (aucun test)
├── vendor/                     # Composer dependencies
└── *.php (14 fichiers)         # Pages principales à la racine
```

### Pages principales (14 fichiers PHP)

| Fichier | Fonction | Composants Vue cibles |
|---------|----------|----------------------|
| **accueil.php** | Page d'accueil avec liste des romans | `HomePage.vue`, `RomanListComponent.vue` |
| **roman.php** | Détail d'un roman + chapitres | `RomanDetailPage.vue`, `ChapterListComponent.vue` |
| **connexion.php** | Authentification | `LoginPage.vue` |
| **profil_roman.php** | Profil utilisateur | `UserProfilePage.vue` |
| **profil_notification.php** | Notifications | `NotificationsPage.vue` |
| **profil_modif.php** | Édition profil | `ProfileEditPage.vue` |
| **modif_chapitre.php** | Édition chapitre | `ChapterEditPage.vue` |
| **vote.php** | Traitement votes (AJAX) | API endpoint `/api/v1/votes` |
| **signalement_admin.php** | Modération | `AdminModerationPage.vue` |
| **contact.php** | Contact | `ContactPage.vue` |
| **principe.php** | Présentation concept | `AboutPage.vue` |
| **droit_auteur.php** | Mentions légales | `LegalPage.vue` |
| **conditions_generales.php** | CGU | `TermsPage.vue` |
| **envoi_mail.php** | Envoi email | API endpoint `/api/v1/mail/send` |

### Classes métier (class/)

#### Domaine métier principal

| Classe | Lignes | Responsabilité | Model Laravel |
|--------|--------|----------------|---------------|
| **User.php** | 324 | Gestion utilisateurs, droits, sanctions | `App\Models\User` |
| **Roman.php** | 140 | Gestion romans, statuts, recherche | `App\Models\Roman` |
| **Oeuvre.php** | 438 | Chapitres + covers, upload images | `App\Models\Oeuvre` |
| **Commentaire.php** | 191 | Système commentaires hiérarchique | `App\Models\Comment` |
| **Notification.php** | 438 | 12 types de notifications | `App\Models\Notification` |
| **Signalement.php** | 306 | Signalements et sanctions | `App\Models\Report` |
| **Resultat.php** | 303 | Algorithme calcul votes | Service `VoteCalculationService` |

#### Technique

| Classe | Responsabilité | Équivalent Laravel |
|--------|----------------|-------------------|
| **Core_ghosty.php** | Utilitaires UI, droits, flash | Helpers + middleware |
| **Connexion.php** | Singleton PDO | Eloquent ORM |
| **Mail.php** | SendinBlue API | `Mail` facade + Mailable |
| **History.php** | Versionning chapitres | Package `spatie/laravel-backup` |
| **Utils.php** | Validations formulaires | Form Requests |
| **Config_lecture.php** | Config lecture user | JSON column ou table |
| **Genre.php** | CRUD genres | `App\Models\Genre` |
| **Font.php** | Polices disponibles | Seeds ou config |

### Assets

**CSS** (1935 lignes custom) :
- Couleurs principales : `#02b875` (vert), `#fdfffd` (blanc)
- Classes custom : `.btn-ghosty`, `.roman-fiche`, `.cadre-link`
- **⚠️ Migration** : Utiliser classes Vuemann au maximum (layout, spacing, colors, typography)

**JavaScript** (3888 lignes) :
- `ghosty.js` (2730 lignes) : Logique principale (AJAX, History API, Cropper, votes)
- `form.js` (1158 lignes) : Gestion formulaires
- **⚠️ Migration** : Tout doit être réécrit en Vue 3 Composition API

**Images** (51 fichiers) :
- Logo, icônes interface, illustrations
- **⚠️ Optimisation** : Convertir en WebP, icônes → SVG ou icon font

### Dépendances

**Backend (composer.json)** :
```json
{
  "require": {
    "sendinblue/api-v3-sdk": "*@dev",      // ⚠️ Version non fixée
    "mailin-api/mailin-api-php": "1.0.*",  // ⚠️ Obsolète
    "ext-curl": "*"
  }
}
```

**Frontend** :
- jQuery (version inconnue, probablement 2.x)
- Bootstrap 3 (EOL 2019)
- Cropper.js

---

## 🏗️ Architecture actuelle

### Pattern utilisé

**Architecture monolithique** avec :
- **Pattern Factory** systématique (15 factories)
- **Singleton** pour connexion DB
- **Namespacing** : `namespace ghosty`
- **Mélange MVC** : Logique métier dans les vues PHP

### Flux de données actuel

```
Navigateur
    ↓
Pages PHP (.php racine)
    ↓
Classes métier (class/)
    ↓
Connexion PDO (singleton)
    ↓
MySQL Database
```

**Problèmes** :
- HTML généré dans les classes PHP
- Logique métier dans les vues
- Pas de routing centralisé
- AJAX avec jQuery non structuré

---

## 🔐 Points critiques de sécurité

### 🔴 CRITIQUES (P0 - Correction immédiate)

#### 1. Credentials hardcodés en clair

**Fichier** : `includes/conf.php`
```php
define('DB_PASSWORD', 'vPrPMLde6ccAEs');  // ⚠️ CRITIQUE
```

**Fichier** : `class/Mail.php`
```php
$this->mail = new Mailin("https://api.sendinblue.com/v2.0", "79wnzc3VCZJaxtQR");
```

**Impact** : Compromission totale si code accessible
**Solution** : `.env` avec Laravel + `config/database.php`

#### 2. Injections SQL

**Fichier** : `class/Roman.php` ligne 70
```php
$genre = ($id_genre != 'all')? ' AND rom_id_genre = '.$id_genre :'';
// Concaténation directe sans prepared statement
```

**Impact** : Lecture/modification/suppression données
**Solution** : Eloquent ORM ou Query Builder avec bindings

#### 3. XSS (Cross-Site Scripting)

**Fichier** : `class/Oeuvre.php` ligne 34
```php
'recit' => htmlspecialchars_decode(ltrim($recit))
// Décodage HTML avant insertion → XSS dans affichage
```

**Impact** : Exécution JS malveillant
**Solution** : Blade auto-escaping {{ }} + validation stricte

#### 4. Upload non sécurisé

**Fichier** : `class/Oeuvre.php` lignes 210-216
```php
$name_cover = uniqid().'.'.pathinfo($_FILES['cover']['name'], PATHINFO_EXTENSION);
move_uploaded_file($_FILES['cover']['tmp_name'], Oeuvre::PATH_COVER.$name_cover);
```

**Problèmes** :
- Pas de vérification MIME type
- Extension basée sur nom client
- Upload dans `/images/cover/` (webroot accessible)

**Impact** : Upload PHP shell déguisé en image
**Solution** : `Storage::disk('public')` + validation MIME + `spatie/laravel-medialibrary`

#### 5. Hash de mot de passe faible

**Fichier** : `class/User.php` ligne 70
```php
'mdp' => sha1('az'.$mdp)  // SHA1 + salt fixe "az"
```

**Impact** : Bruteforce avec GPU
**Solution** : `Hash::make($password)` (bcrypt/argon2)

#### 6. Absence de CSRF

**Tous les formulaires** : Aucun token CSRF trouvé

**Impact** : Actions forcées à l'insu de l'utilisateur
**Solution** : `@csrf` Blade directive + middleware `VerifyCsrfToken`

#### 7. Cookies avec mdp en clair

**Fichier** : `tool/connexion.php` lignes 54-55
```php
setcookie('mdp', $mdp, time()+31556926, "/");  // ⚠️ Mdp en clair
setcookie('pseudo', $pseudo, time()+31556926, "/");
```

**Impact** : Vol de session via XSS
**Solution** : Laravel Sanctum + tokens HttpOnly + SameSite

#### 8. Session fixation

**Fichier** : `tool/connexion.php`
```php
// Pas de session_regenerate_id() après connexion
$_SESSION['auth']['pseudo'] = $utilisateur['use_pseudo'];
```

**Impact** : Détournement de session
**Solution** : `Auth::login()` Laravel (gère automatiquement)

#### 9. Display errors en production

**Fichier** : `includes/conf.php`
```php
ini_set('display_errors', -1);  // ⚠️ Affiche tout
```

**Impact** : Leak de chemins, credentials DB
**Solution** : `APP_DEBUG=false` en production

### 🟠 IMPORTANTES (P1)

- Validation entrées insuffisante
- Absence rate limiting (login, votes, API)
- Droits d'accès faibles (pas de vérification propriétaire)
- Énumération de comptes via messages d'erreur

---

## 💰 Dette technique

### PHP obsolète

- **Version** : PHP 5.6 (EOL janvier 2019)
- **Incompatibilités** : PHP 8.x (named parameters, attributes, union types)
- **Solution** : Laravel 12 requiert PHP 8.2+

### Dépendances

- SendinBlue API v2 (obsolète → v3)
- Doublon `mailin-api` + `sendinblue/api-v3-sdk`
- jQuery/Bootstrap versions inconnues (probablement 2016)

### Architecture

- **Monolithe** : Logique + présentation mélangées
- **Pas de tests** : 0 test (PHPUnit, Vitest)
- **Pas de CI/CD**
- **Code dupliqué** : Factory pattern répété 15x

### Performance

- **Requêtes N+1** : Boucles avec requêtes
- **Pas de cache** : Aucun système de cache
- **Images non optimisées** : Pas de WebP, formats lourds

---

## 🗄️ Schéma de base de données

### Tables principales (structure déduite)

#### t_user
```sql
use_id INT PRIMARY KEY AUTO_INCREMENT
use_pseudo VARCHAR UNIQUE
use_mail VARCHAR UNIQUE
use_mdp VARCHAR                    -- SHA1 (à migrer bcrypt)
use_cle VARCHAR(32)               -- Clé validation email
use_droit TINYINT                 -- 0-4 (NOTCO, LECTEUR, AUTEUR, MODO, ADMIN)
use_photo VARCHAR                 -- Nom fichier photo profil
use_notif TINYINT                 -- Notifications activées
use_nom VARCHAR
use_prenom VARCHAR
use_birth DATE
use_banque VARCHAR
use_iban VARCHAR
use_brouillon INT                 -- Compteur brouillons
use_new_message INT               -- Compteur notifications
use_avertissement INT             -- Compteur avertissements
use_date_modif DATETIME
```

#### t_roman
```sql
rom_id INT PRIMARY KEY
rom_titre VARCHAR
rom_id_genre INT → t_genre
rom_id_auteur INT → t_user
rom_id_cover INT → t_oeuvre
rom_statut INT                    -- -1:rejeté, 0:brouillon, 1:vote, 2:écriture, 10:fini
rom_nb_suite INT                  -- Nombre chapitres validés
rom_favoris INT                   -- Compteur favoris
rom_vote INT                      -- Somme votes
rom_nb_vote INT                   -- Nombre de votes
rom_date_publi DATETIME
rom_date_statut DATETIME
```

#### t_oeuvre
```sql
oeu_id INT PRIMARY KEY
oeu_titre VARCHAR
oeu_contenu TEXT                  -- Chapitre (HTML) ou nom fichier cover
oeu_resume TEXT
oeu_order INT                     -- Numéro du chapitre
oeu_end TINYINT                   -- Marque fin du roman
oeu_statut INT                    -- -1:rejeté, 0:new, 1:accepté, 2:brouillon
oeu_type INT                      -- 1:chapitre, 2:cover
oeu_id_auteur INT → t_user
oeu_id_roman INT → t_roman
oeu_vote INT
oeu_nb_vote INT
oeu_nb_com INT
oeu_nb_modif INT                  -- Limite 20 modifications
oeu_date_publi DATETIME
oeu_date_statut DATETIME
```

#### t_vote
```sql
vot_id INT PRIMARY KEY
vot_id_user INT → t_user
vot_id_roman INT → t_roman
vot_id_oeuvre INT → t_oeuvre
vot_vote INT                      -- -1:moins, 0:neutre, 1:plus
vot_type INT                      -- 1:chapitre, 2:cover
vot_statut INT
vot_date DATETIME
```

#### t_commentaire
```sql
com_id INT PRIMARY KEY
com_commentaire TEXT
com_id_posteur INT → t_user
com_id_oeuvre INT → t_oeuvre
com_id_parent INT                 -- 0 si commentaire racine
com_id_reponse INT                -- ID commentaire répondu
com_nb_reponse INT
com_date DATETIME
```

#### t_notification
```sql
not_id INT PRIMARY KEY
not_id_user INT → t_user
not_notification TEXT             -- HTML du message
not_type INT                      -- 1-12 types différents
not_statut INT                    -- 0:actif, -1:supprimé
not_new TINYINT                   -- 1:non lu, 0:lu
not_date DATETIME
not_date_supp DATETIME
```

#### t_signalement & t_rapport
```sql
sig_id INT PRIMARY KEY
sig_id_poster INT → t_user        -- Signaleur
sig_id_oeuvre INT → t_oeuvre
sig_id_cause INT → t_alerte
sig_description TEXT
sig_statut INT                    -- 0:attente, 1:traité
sig_date_signalement DATETIME

rap_id INT PRIMARY KEY
rap_id_oeuvre INT → t_oeuvre
rap_id_user INT → t_user          -- Sanctionné
rap_id_modo INT → t_user          -- Modérateur
rap_id_cause INT → t_alerte
rap_id_type INT                   -- vote, write, comment
rap_id_sanction INT               -- 1:avertissement, 2:vote, 3:write
rap_rapport TEXT
rap_date_redaction DATETIME
rap_date_sanction DATE            -- Date fin sanction
```

#### Tables secondaires
- `t_genre` : Genres littéraires
- `t_favoris` : Favoris utilisateurs
- `t_history` : Historique modifications chapitres
- `t_config_lecture` : Config lecture personnalisée
- `t_font` : Polices disponibles

### Migrations Laravel

**Ordre de création** :
1. `users`, `genres`, `fonts`
2. `romans`
3. `oeuvres`
4. `votes`, `comments`, `favorites`
5. `notifications`, `reports`, `histories`

---

## 🗺️ Plan de migration

### Stratégie : **Strangler Pattern** (migration progressive)

**Principe** : Remplacer l'ancien système morceau par morceau, sans Big Bang.

```
┌─────────────────────────────────────────────────┐
│  PHASE 1: Backend Laravel API (Semaines 1-6)   │
├─────────────────────────────────────────────────┤
│  ✓ Migrations DB                                │
│  ✓ Models Eloquent + Relations                 │
│  ✓ API REST Controllers                        │
│  ✓ Form Requests (validation)                  │
│  ✓ Policies (authorization)                    │
│  ✓ Resources/Collections (serialization)       │
│  ✓ Authentication Sanctum                      │
│  ✓ Tests Feature + Unit (PHPUnit/Pest)        │
└─────────────────────────────────────────────────┘
         ↓
┌─────────────────────────────────────────────────┐
│  PHASE 2: Frontend Vue 3 (Semaines 7-12)       │
├─────────────────────────────────────────────────┤
│  ✓ Setup Vite + Vue 3 + Router + Composables  │
│  ✓ Composables globaux (auth, api, utils)     │
│  ✓ Pages Vue (HomePage, RomanDetailPage, etc) │
│  ✓ Components atomiques/moléculaires           │
│  ✓ Utilisation classes Vuemann (95% styles)   │
│  ✓ Services API (fetch/axios + intercepteurs) │
│  ✓ Tests Vitest + Testing Library             │
└─────────────────────────────────────────────────┘
         ↓
┌─────────────────────────────────────────────────┐
│  PHASE 3: Migration de données (Semaine 13)    │
├─────────────────────────────────────────────────┤
│  ✓ Script migration ancienne DB → nouvelle    │
│  ✓ Hash passwords SHA1 → bcrypt               │
│  ✓ Validation intégrité données               │
│  ✓ Tests acceptance complets                  │
└─────────────────────────────────────────────────┘
         ↓
┌─────────────────────────────────────────────────┐
│  PHASE 4: Déploiement & Cutover (Semaine 14)  │
├─────────────────────────────────────────────────┤
│  ✓ Docker + CI/CD                             │
│  ✓ Bascule DNS/routes                         │
│  ✓ Monitoring Sentry                          │
│  ✓ Ancien code en lecture seule (3 mois)     │
└─────────────────────────────────────────────────┘
```

---

## 🧩 Mapping pages → composants Vue

### Architecture frontend

```
frontend/src/
├── components/                   # Composants réutilisables
│   ├── atoms/                    # Composants atomiques
│   │   ├── ButtonComponent.vue
│   │   ├── InputComponent.vue
│   │   └── LoaderComponent.vue
│   ├── molecules/                # Composants moléculaires
│   │   ├── VoteBarComponent.vue
│   │   ├── SearchBarComponent.vue
│   │   └── NotificationItemComponent.vue
│   └── organisms/                # Composants organismes
│       ├── RomanCardComponent.vue
│       ├── ChapterListComponent.vue
│       └── CommentThreadComponent.vue
├── pages/                        # Pages routées
│   ├── HomePage.vue              # accueil.php
│   ├── RomanDetailPage.vue       # roman.php
│   ├── LoginPage.vue             # connexion.php
│   ├── UserProfilePage.vue       # profil_roman.php
│   ├── NotificationsPage.vue     # profil_notification.php
│   ├── ProfileEditPage.vue       # profil_modif.php
│   ├── ChapterEditPage.vue       # modif_chapitre.php
│   ├── AdminModerationPage.vue   # signalement_admin.php
│   ├── ContactPage.vue           # contact.php
│   ├── AboutPage.vue             # principe.php
│   ├── LegalPage.vue             # droit_auteur.php
│   └── TermsPage.vue             # conditions_generales.php
├── composables/                  # Logique réutilisable
│   ├── useAuth.js                # Authentification
│   ├── useApi.js                 # Appels API
│   ├── useNotifications.js       # Notifications temps réel
│   └── useVote.js                # Logique vote
├── services/                     # Services
│   ├── api.js                    # Client API axios
│   ├── auth.js                   # Service auth
│   └── websocket.js              # WebSocket notifications
├── router/
│   └── index.js                  # Vue Router config
├── stores/                       # Stores Pinia (état global minimal)
│   ├── authStore.js              # État authentification uniquement
│   ├── romansStore.js            # Cache romans uniquement
│   └── notificationsStore.js    # État notifications uniquement
└── assets/
    ├── scss/
    │   └── custom.scss           # CSS custom minimal (exceptions Vuemann)
    └── images/
```

### Mapping détaillé : Page par page

#### HomePage.vue (accueil.php)

**Composants utilisés** :
- `SearchBarComponent.vue` (barre recherche + filtres)
- `RomanListComponent.vue` (grille de romans)
  - `RomanCardComponent.vue` (carte roman individuelle)
    - `VoteBarComponent.vue` (barre de vote)
    - `GenreBadgeComponent.vue` (badge genre)

**Classes Vuemann** :
```vue
<template>
  <div class="d-flex f-column g-20 p-20">
    <div class="d-flex j-between a-center bg-primary-100 p-15 radius-10">
      <h1 class="fs-700 fw-700 color-primary">Ghosty</h1>
    </div>
    <SearchBarComponent class="w-100" />
    <RomanListComponent class="d-flex f-wrap g-15" />
  </div>
</template>
```

**State management** :
```js
// Composable useRomans.js
export const useRomans = () => {
  const romansStore = useRomansStore()
  const { romans, filters } = storeToRefs(romansStore)

  const fetchRomans = async (filters = {}) => {
    const response = await api.get('/api/v1/romans', { params: filters })
    romansStore.setRomans(response.data.data)
  }

  return { romans, filters, fetchRomans }
}
```

#### RomanDetailPage.vue (roman.php)

**Composants utilisés** :
- `RomanHeaderComponent.vue` (titre, auteur, cover, stats)
- `ChapterListComponent.vue` (liste chapitres validés)
  - `ChapterItemComponent.vue`
- `ProposalListComponent.vue` (propositions en vote)
  - `ProposalCardComponent.vue`
    - `VoteButtonsComponent.vue` (+/-/neutre)
- `CommentSectionComponent.vue`
  - `CommentFormComponent.vue`
  - `CommentThreadComponent.vue`

**Classes Vuemann** :
```vue
<div class="d-flex f-column g-25 p-20">
  <div class="bg-neutral-200 p-20 radius-15">
    <h2 class="fs-600 fw-700 color-primary mb-10">{{ roman.titre }}</h2>
    <p class="fs-400 color-neutral-700">par {{ roman.auteur }}</p>
  </div>

  <div class="d-flex g-15 f-wrap">
    <ChapterItemComponent
      v-for="chapter in chapters"
      :key="chapter.id"
      :chapter="chapter"
      class="flex-1 bg-white p-15 radius-10 pointer"
    />
  </div>
</div>
```

#### ChapterEditPage.vue (modif_chapitre.php)

**Composants utilisés** :
- `RichTextEditorComponent.vue` (TipTap ou Quill)
- `HistoryPanelComponent.vue` (historique modifications)
- `PreviewComponent.vue` (aperçu temps réel)

**Classes Vuemann** :
```vue
<div class="d-flex g-20 h-100">
  <!-- Éditeur principal -->
  <div class="flex-1 d-flex f-column g-10">
    <div class="d-flex j-between a-center p-15 bg-primary-100 radius-10">
      <h3 class="fs-500 fw-700">Édition du chapitre</h3>
      <button class="btn btn-primary pointer">Enregistrer</button>
    </div>
    <RichTextEditorComponent class="flex-1" />
  </div>

  <!-- Panneau historique -->
  <HistoryPanelComponent class="w-300 bg-neutral-100 p-15 radius-10" />
</div>
```

#### AdminModerationPage.vue (signalement_admin.php)

**Composants utilisés** :
- `ReportListComponent.vue`
  - `ReportCardComponent.vue`
    - `OeuvrePreviewComponent.vue`
    - `SanctionFormComponent.vue`

**Classes Vuemann** :
```vue
<div class="d-flex f-column g-20 p-20">
  <div class="d-flex j-between a-center bg-danger-100 p-15 radius-10">
    <h2 class="fs-600 fw-700 color-danger">Modération</h2>
    <span class="fs-400 color-neutral-700">{{ pendingReports }} signalements</span>
  </div>

  <div class="d-flex f-column g-15">
    <ReportCardComponent
      v-for="report in reports"
      :key="report.id"
      :report="report"
      class="bg-white p-20 radius-10"
    />
  </div>
</div>
```

### Réutilisation Vuemann (objectif 95%+)

**Classes utilitaires à utiliser prioritairement** :

#### Layout & Flexbox
```scss
.d-flex             // display: flex
.f-column           // flex-direction: column
.f-wrap             // flex-wrap: wrap
.j-between          // justify-content: space-between
.a-center           // align-items: center
.g-10, .g-15, .g-20 // gap: 10px, 15px, 20px
```

#### Spacing
```scss
.p-10, .p-15, .p-20, .p-25    // padding
.m-10, .m-15, .m-20           // margin
.px-15, .py-10                // padding horizontal/vertical
.mt-10, .mb-20                // margin-top, margin-bottom
```

#### Typography
```scss
.fs-400, .fs-500, .fs-600, .fs-700  // font-size
.fw-400, .fw-500, .fw-700           // font-weight
.text-center, .text-end             // text-align
```

#### Colors (basé sur design existant)
```scss
// Variables Vuemann à définir
$primary: #02b875      // Vert Ghosty
$neutral-100: #fdfffd  // Blanc cassé
$danger: #e74c3c
$success: #27ae60

// Classes générées auto
.color-primary       // color: var(--primary)
.bg-primary-100      // background: var(--primary-100)
.border-primary      // border-color: var(--primary)
```

#### Buttons
```scss
.btn                // Base button
.btn-primary        // Button vert Ghosty
.btn-danger         // Button rouge
.pointer            // cursor: pointer
```

#### Borders & Radius
```scss
.radius-5, .radius-10, .radius-15
.border-primary
```

**CSS custom autorisé uniquement pour** :
- Styles très spécifiques non couverts par Vuemann
- Animations custom
- Grid layouts complexes

Chaque exception doit être documentée dans un commentaire :
```scss
// Exception Vuemann : Grid 3 colonnes responsive complexe
.roman-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: var(--spacing-20);
}
```

---

## 🔌 API Laravel nécessaires

### Architecture API

**Pattern** : RESTful JSON API avec versioning `/api/v1/`

**Structure** :
```
app/
├── Http/
│   ├── Controllers/Api/V1/
│   │   ├── AuthController.php
│   │   ├── RomanController.php
│   │   ├── OeuvreController.php
│   │   ├── VoteController.php
│   │   ├── CommentController.php
│   │   ├── NotificationController.php
│   │   ├── ReportController.php
│   │   └── UserController.php
│   ├── Requests/
│   │   ├── StoreRomanRequest.php
│   │   ├── StoreOeuvreRequest.php
│   │   ├── VoteRequest.php
│   │   └── ...
│   ├── Resources/
│   │   ├── RomanResource.php
│   │   ├── OeuvreResource.php
│   │   ├── UserResource.php
│   │   └── ...
│   └── Middleware/
│       ├── CheckRole.php
│       └── RateLimitVotes.php
├── Models/
│   ├── User.php
│   ├── Roman.php
│   ├── Oeuvre.php
│   ├── Vote.php
│   ├── Comment.php
│   ├── Notification.php
│   └── Report.php
├── Policies/
│   ├── RomanPolicy.php
│   ├── OeuvrePolicy.php
│   └── ReportPolicy.php
└── Services/
    ├── VoteCalculationService.php
    ├── NotificationService.php
    └── ImageUploadService.php
```

### Endpoints principaux

#### Authentication
```
POST   /api/v1/register              # Inscription
POST   /api/v1/login                 # Connexion
POST   /api/v1/logout                # Déconnexion
POST   /api/v1/refresh               # Refresh token
GET    /api/v1/me                    # User actuel
```

#### Romans
```
GET    /api/v1/romans                # Liste (filtres: genre, statut, tri)
POST   /api/v1/romans                # Créer roman
GET    /api/v1/romans/{id}           # Détail roman
PUT    /api/v1/romans/{id}           # Modifier roman
DELETE /api/v1/romans/{id}           # Supprimer roman
GET    /api/v1/romans/{id}/chapters  # Chapitres du roman
GET    /api/v1/romans/{id}/proposals # Propositions en vote
POST   /api/v1/romans/{id}/favorite  # Ajouter aux favoris
DELETE /api/v1/romans/{id}/favorite  # Retirer des favoris
```

#### Oeuvres (Chapitres + Covers)
```
GET    /api/v1/oeuvres               # Liste (filtres)
POST   /api/v1/oeuvres               # Créer oeuvre
GET    /api/v1/oeuvres/{id}          # Détail oeuvre
PUT    /api/v1/oeuvres/{id}          # Modifier oeuvre
DELETE /api/v1/oeuvres/{id}          # Supprimer oeuvre
POST   /api/v1/oeuvres/{id}/cover    # Upload cover
GET    /api/v1/oeuvres/{id}/history  # Historique modifications
POST   /api/v1/oeuvres/{id}/restore  # Restaurer version
```

#### Votes
```
POST   /api/v1/votes                 # Voter (+1/-1/0)
GET    /api/v1/votes/my-votes        # Mes votes (validation 3 max)
DELETE /api/v1/votes/{id}            # Retirer vote
```

#### Comments
```
GET    /api/v1/oeuvres/{id}/comments # Commentaires d'une oeuvre
POST   /api/v1/comments              # Créer commentaire
PUT    /api/v1/comments/{id}         # Modifier commentaire
DELETE /api/v1/comments/{id}         # Supprimer commentaire
POST   /api/v1/comments/{id}/reply   # Répondre à un commentaire
```

#### Notifications
```
GET    /api/v1/notifications         # Mes notifications
PUT    /api/v1/notifications/{id}/read # Marquer lue
DELETE /api/v1/notifications/{id}    # Supprimer notification
POST   /api/v1/notifications/mark-all-read
```

#### Moderation
```
GET    /api/v1/reports               # Signalements (admin/modo)
POST   /api/v1/reports               # Créer signalement
PUT    /api/v1/reports/{id}/handle   # Traiter signalement
POST   /api/v1/reports/{id}/sanction # Appliquer sanction
```

#### User Profile
```
GET    /api/v1/users/{id}/profile    # Profil public
PUT    /api/v1/profile               # Modifier mon profil
POST   /api/v1/profile/photo         # Upload photo profil
GET    /api/v1/profile/romans        # Mes romans
GET    /api/v1/profile/favorites     # Mes favoris
GET    /api/v1/profile/stats         # Mes statistiques
```

### Format de réponse standard

**Success** :
```json
{
  "success": true,
  "data": {
    "id": 1,
    "titre": "Le Roman Mystère",
    "auteur": {
      "id": 5,
      "pseudo": "JohnDoe"
    }
  },
  "meta": {
    "pagination": {
      "total": 100,
      "per_page": 20,
      "current_page": 1,
      "last_page": 5
    }
  }
}
```

**Error** :
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": {
    "titre": ["Le titre est obligatoire"],
    "id_genre": ["Le genre sélectionné est invalide"]
  }
}
```

### Validation (Form Requests)

**Exemple** : `StoreOeuvreRequest.php`
```php
<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreOeuvreRequest extends FormRequest
{
    public function authorize()
    {
        return auth()->check();
    }

    public function rules()
    {
        return [
            'titre' => 'required|string|max:255',
            'contenu' => 'required|string|min:100',
            'resume' => 'nullable|string|max:500',
            'id_roman' => 'required|exists:romans,id',
            'type' => 'required|in:1,2', // 1:chapitre, 2:cover
            'cover' => 'required_if:type,2|image|mimes:jpg,png,webp|max:2048'
        ];
    }
}
```

### Authorization (Policies)

**Exemple** : `OeuvrePolicy.php`
```php
<?php

namespace App\Policies;

use App\Models\User;
use App\Models\Oeuvre;

class OeuvrePolicy
{
    public function update(User $user, Oeuvre $oeuvre)
    {
        // Seul l'auteur peut modifier (sauf si admin/modo)
        return $user->id === $oeuvre->id_auteur
            || $user->isAdmin()
            || $user->isModo();
    }

    public function delete(User $user, Oeuvre $oeuvre)
    {
        // Limite de 20 modifications atteinte
        if ($oeuvre->nb_modif >= 20) {
            return false;
        }

        return $user->id === $oeuvre->id_auteur
            || $user->isAdmin();
    }
}
```

### Resources (Serialization)

**Exemple** : `RomanResource.php`
```php
<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class RomanResource extends JsonResource
{
    public function toArray($request)
    {
        return [
            'id' => $this->id,
            'titre' => $this->titre,
            'statut' => $this->statut,
            'statut_label' => $this->getStatutLabel(),
            'genre' => GenreResource::make($this->whenLoaded('genre')),
            'auteur' => UserResource::make($this->whenLoaded('auteur')),
            'cover_url' => $this->cover_url,
            'nb_chapitres' => $this->nb_suite,
            'favoris' => $this->favoris,
            'votes' => [
                'total' => $this->vote,
                'count' => $this->nb_vote,
                'average' => $this->nb_vote > 0 ? round($this->vote / $this->nb_vote, 2) : 0
            ],
            'dates' => [
                'created_at' => $this->date_publi,
                'updated_at' => $this->date_statut
            ]
        ];
    }
}
```

---

## ⚙️ Stratégie de migration

### 1. Setup infrastructure (Semaine 1)

**Laravel** :
```bash
composer create-project laravel/laravel backend
cd backend
composer require laravel/sanctum spatie/laravel-permission spatie/laravel-medialibrary
php artisan vendor:publish --provider="Laravel\Sanctum\SanctumServiceProvider"
```

**Vue 3 + Vuemann** :
```bash
cd ../frontend
npm create vite@latest . -- --template vue
npm install vue-router@4 axios vee-validate zod
npm install -D @vitejs/plugin-vue vitest @vue/test-utils happy-dom
```

**Configuration O2Switch** :
- Base de données MySQL (via phpMyAdmin O2Switch)
- Accès FTP/SFTP pour déploiement
- Configuration `.htaccess` pour Laravel
- Session files (pas Redis sur mutualisé)
- Cache files (pas Redis)

### 2. Migration base de données (Semaine 2)

**Étape 1** : Analyser schéma actuel
```bash
mysqldump --no-data -u root -p ghostyfrplprod > old_schema.sql
```

**Étape 2** : Créer migrations Laravel
```bash
php artisan make:migration create_users_table
php artisan make:migration create_romans_table
# ... (15 migrations)
```

**Étape 3** : Seeders
```bash
php artisan make:seeder GenresSeeder
php artisan make:seeder FontsSeeder
```

**Étape 4** : Script de migration de données
```php
// database/migrations/2024_01_01_000000_migrate_old_data.php
public function up()
{
    // Connexion ancienne DB
    $oldDb = DB::connection('mysql_old');

    // Migration users avec re-hash mdp
    $oldUsers = $oldDb->table('t_user')->get();
    foreach ($oldUsers as $oldUser) {
        User::create([
            'id' => $oldUser->use_id,
            'pseudo' => $oldUser->use_pseudo,
            'email' => $oldUser->use_mail,
            'password' => Hash::make('temporary_' . $oldUser->use_pseudo), // ⚠️ Force reset mdp
            'email_verification_key' => $oldUser->use_cle,
            'role' => $this->mapRole($oldUser->use_droit),
            // ...
        ]);
    }

    // Migration romans
    $oldRomans = $oldDb->table('t_roman')->get();
    // ...
}
```

### 3. Développement API Laravel (Semaines 3-6)

**Semaine 3** : Auth + Users + Romans
```bash
php artisan make:controller Api/V1/AuthController
php artisan make:controller Api/V1/RomanController --resource --api
php artisan make:request StoreRomanRequest
php artisan make:resource RomanResource
php artisan make:policy RomanPolicy --model=Roman
```

**Semaine 4** : Oeuvres + Votes + Comments
**Semaine 5** : Notifications + Moderation
**Semaine 6** : Services (VoteCalculation, ImageUpload) + Cron Jobs

### 4. Développement Frontend Vue (Semaines 7-12)

**Semaine 7** : Setup + Auth + HomePage
```bash
# Structure
mkdir -p src/{pages,components/{atoms,molecules,organisms},composables,services,router,stores,assets}
```

**Semaine 8** : Romans (List + Detail) + Search
**Semaine 9** : Chapters (Create + Edit + History)
**Semaine 10** : Votes + Comments
**Semaine 11** : Notifications + User Profile
**Semaine 12** : Admin Moderation + Tests

### 5. Tests (Semaine 13)

**Backend Laravel** :
```bash
php artisan make:test RomanControllerTest
php artisan make:test VoteCalculationServiceTest --unit
```

**Frontend Vue** :
```js
// tests/pages/HomePage.test.js
import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import HomePage from '@/pages/HomePage.vue'

describe('HomePage', () => {
  it('should render romans list', async () => {
    const wrapper = mount(HomePage)
    expect(wrapper.find('[data-testid="romans-list"]').exists()).toBe(true)
  })
})
```

**Objectif couverture** : 80%+ (backend), 70%+ (frontend)

### 6. Déploiement O2Switch (Semaine 13)

**Scripts de déploiement manuel** :

**Backend (FTP/SFTP)** :
```bash
# deploy-backend.sh
#!/bin/bash

# Build assets
cd frontend
npm run build
cd ..

# Sync vers O2Switch via SFTP
rsync -avz --exclude='node_modules' --exclude='.git' \
  backend/ user@ftp.o2switch.net:/home/user/public_html/

# Migration DB en SSH
ssh user@ssh.o2switch.net "cd public_html && php artisan migrate --force"
```

**Frontend (build → backend/public)** :
```bash
# Le build Vite va dans backend/public
# Configuré dans vite.config.js :
# build: { outDir: '../backend/public' }
```

**Configuration .htaccess** (Laravel sur O2Switch) :
```apache
<IfModule mod_rewrite.c>
    RewriteEngine On
    RewriteRule ^(.*)$ public/$1 [L]
</IfModule>
```

### 7. Mise en production O2Switch (Semaine 14)

**Stratégie progressive** :
1. **Backup complet** : DB + fichiers actuels
2. **Créer sous-domaine** : `beta.ghosty.fr` (dossier séparé O2Switch)
3. **Déployer nouvelle version** sur beta
4. **Tests utilisateurs** avec subset (famille/amis)
5. **Migration DB définitive** avec script
6. **Bascule DNS** : pointer `www.ghosty.fr` vers nouveau dossier
7. **Ancien code** : garder dans `/old_ghosty/` (3 mois)

---

## 📊 Estimation et roadmap

### Effort par module (détaillé)

| Module | Backend (j) | Frontend (j) | Tests (j) | Total (j) |
|--------|-------------|--------------|-----------|-----------|
| **Infrastructure** | 2 | 2 | 1 | 5 |
| **Authentication** | 2 | 2 | 1 | 5 |
| **Users & Profile** | 3 | 4 | 2 | 9 |
| **Romans** | 4 | 6 | 3 | 13 |
| **Oeuvres (Chapters+Covers)** | 5 | 8 | 4 | 17 |
| **Vote System** | 6 | 5 | 3 | 14 |
| **Comments** | 3 | 3 | 2 | 8 |
| **Notifications** | 4 | 4 | 2 | 10 |
| **Moderation** | 5 | 5 | 3 | 13 |
| **Search & Filters** | 2 | 3 | 1 | 6 |
| **History/Versioning** | 3 | 3 | 2 | 8 |
| **Admin Panel** | 3 | 4 | 2 | 9 |
| **Cron Jobs** | 3 | - | 2 | 5 |
| **Migration Data** | 5 | - | 2 | 7 |
| **DevOps & Deploy** | 3 | - | 2 | 5 |
| **Documentation** | 2 | - | - | 2 |
| **TOTAL** | **55** | **49** | **32** | **136 j** |

**Note** : Estimation initiale 110j révisée à 136j après détail (marge sécurité +24%)

### Planning (équipe 2 devs)

**Configuration** : 1 dev backend (Laravel) + 1 dev frontend (Vue/Vuemann)

```
┌─────────────────────────────────────────────────────────────────────┐
│  Semaine 1-2 : Setup & Infrastructure                               │
│  ├─ Setup Docker, CI/CD, repos Git                                  │
│  ├─ Laravel init + Migrations DB                                    │
│  ├─ Vue 3 + Vite + Vuemann init                                     │
│  └─ Script migration données                                        │
├─────────────────────────────────────────────────────────────────────┤
│  Semaine 3-4 : MVP Core (Auth + Romans + Chapters)                  │
│  ├─ Backend: Auth Sanctum, RomanController, OeuvreController        │
│  ├─ Frontend: Login, HomePage, RomanDetailPage                      │
│  └─ Tests: Auth flow, CRUD romans                                   │
├─────────────────────────────────────────────────────────────────────┤
│  Semaine 5-6 : Vote System                                          │
│  ├─ Backend: VoteController, VoteCalculationService, Cron           │
│  ├─ Frontend: VoteBarComponent, résultats, classements              │
│  └─ Tests: Algorithme votes, limites (3 votes max)                  │
├─────────────────────────────────────────────────────────────────────┤
│  Semaine 7-8 : Social (Comments + Notifications)                    │
│  ├─ Backend: CommentController, NotificationService, WebSocket      │
│  ├─ Frontend: CommentThread, NotificationsPage, temps réel          │
│  └─ Tests: Hiérarchie comments, notifications types                 │
├─────────────────────────────────────────────────────────────────────┤
│  Semaine 9-10 : User Features (Profile + History + Search)          │
│  ├─ Backend: UserController, HistoryService, SearchController       │
│  ├─ Frontend: ProfileEditPage, HistoryPanel, SearchBar              │
│  └─ Tests: Upload photo, restore version, search filters            │
├─────────────────────────────────────────────────────────────────────┤
│  Semaine 11-12 : Moderation & Admin                                 │
│  ├─ Backend: ReportController, Policies, Sanctions                  │
│  ├─ Frontend: AdminModerationPage, workflow signalements            │
│  └─ Tests: Sanctions progressives, droits access                    │
├─────────────────────────────────────────────────────────────────────┤
│  Semaine 13 : Tests & QA                                            │
│  ├─ Tests E2E (Cypress/Playwright)                                  │
│  ├─ Coverage 80%+ backend, 70%+ frontend                            │
│  ├─ Load testing (k6 ou Artillery)                                  │
│  └─ Security audit (OWASP ZAP)                                      │
├─────────────────────────────────────────────────────────────────────┤
│  Semaine 14 : Migration & Déploiement                               │
│  ├─ Migration définitive des données                                │
│  ├─ Beta test avec users (beta.ghosty.fr)                           │
│  ├─ Bascule production                                              │
│  └─ Monitoring + hotfixes                                           │
└─────────────────────────────────────────────────────────────────────┘
```

**Durée totale** : **14 semaines** (3,5 mois)
**Budget** : 136 jours/homme ÷ 2 devs = 68 jours calendaires (~14 semaines)

### Jalons (Milestones)

| Jalon | Date | Livrables |
|-------|------|-----------|
| **M1 - Infrastructure** | S2 | Docker, CI/CD, DB migrated, repos setup |
| **M2 - MVP Core** | S4 | Auth + Romans CRUD + Chapters fonctionnels |
| **M3 - Vote System** | S6 | Système de vote complet avec cron résultats |
| **M4 - Social Features** | S8 | Comments + Notifications temps réel |
| **M5 - User Experience** | S10 | Profile, History, Search avancée |
| **M6 - Admin Ready** | S12 | Modération complète, tous features |
| **M7 - Production Ready** | S13 | Tests 80%+, audit sécurité passé |
| **M8 - Go Live** | S14 | Déploiement production, ancien code décommissionné |

### Risques & mitigation

| Risque | Probabilité | Impact | Mitigation |
|--------|-------------|--------|------------|
| **Failles sécurité critiques non corrigées** | Haute | Critique | Patch P0 AVANT migration |
| **Algorithme votes mal compris** | Moyenne | Haute | Doc détaillée + tests unitaires nombreux |
| **Perte de données migration** | Faible | Critique | Backup complet + migration test d'abord |
| **Performance dégradée** | Moyenne | Moyenne | Load testing + caching Redis |
| **Résistance users au changement** | Moyenne | Moyenne | Beta test + formation + docs |
| **Dépassement délais** | Moyenne | Moyenne | Marge sécurité 20% + priorisation MoSCoW |

---

## 📚 Annexes

### A. Stack technologique finale

#### Backend (adapté O2Switch)
- **PHP** : 8.2+ (version disponible O2Switch)
- **Framework** : Laravel 12.x
- **ORM** : Eloquent
- **Auth** : Laravel Sanctum
- **Cache** : File cache (pas Redis sur mutualisé)
- **Queue** : Sync driver (pas de queue worker)
- **Storage** : Local O2Switch (pas S3 pour l'instant)
- **Email** : SendinBlue API v3 (Laravel Mailable)
- **Tests** : Pest ou PHPUnit (en local)

#### Frontend
- **Framework** : Vue 3.4+ (Composition API)
- **Build** : Vite → compile vers `backend/public`
- **Router** : Vue Router 4
- **State** : Composables globaux (logique) + Pinia (stockage minimal)
- **HTTP** : Axios + intercepteurs
- **Forms** : VeeValidate + Zod
- **Rich Text** : TipTap
- **Upload** : Uppy
- **Utils CSS** : **Vuemann** (95%+) + CSS custom minimal
- **Tests** : Vitest (en local)

#### Hébergement O2Switch
- **Hosting** : Mutualisé O2Switch
- **PHP Version** : 8.1 (sélectionnable cPanel)
- **DB** : MySQL 8.0 (phpMyAdmin)
- **SSL** : Let's Encrypt (gratuit)
- **Déploiement** : FTP/SFTP + scripts manuels
- **Backup** : Export SQL + rsync fichiers
- **Monitoring** : Logs Laravel + emails erreurs

#### Évolutions futures (optionnelles)
- **Docker + CI/CD** → Si migration VPS ultérieure
- **Redis** → Si upgrade VPS
- **Queue workers** → Si upgrade VPS
- **CDN** → Cloudflare (gratuit)

### A bis. Configuration spécifique O2Switch

#### Structure des dossiers sur O2Switch

```
/home/user/
├── public_html/                    # Racine web accessible
│   ├── .htaccess                   # Redirection vers public/
│   ├── index.php                   # Point d'entrée Laravel (copié depuis public/)
│   ├── assets/                     # Assets compilés Vite (CSS, JS, images)
│   └── storage/                    # Symlink → ../storage/app/public
├── laravel_app/                    # Application Laravel (hors web)
│   ├── app/
│   ├── bootstrap/
│   ├── config/
│   ├── database/
│   ├── routes/
│   ├── storage/
│   ├── vendor/
│   └── .env                        # Configuration (credentials DB)
└── old_ghosty/                     # Ancien code (backup 3 mois)
```

#### Configuration Laravel pour O2Switch

**1. Fichier `.env` (adapter à O2Switch)** :
```env
APP_NAME=Ghosty
APP_ENV=production
APP_KEY=base64:... # généré avec php artisan key:generate
APP_DEBUG=false
APP_URL=https://www.ghosty.fr

DB_CONNECTION=mysql
DB_HOST=ghostyfrplprod.mysql.db
DB_PORT=3306
DB_DATABASE=ghostyfrplprod
DB_USERNAME=ghostyfrplprod
DB_PASSWORD=vPrPMLde6ccAEs  # ⚠️ À changer + stocker en .env

# Sessions & Cache sur fichiers (pas Redis)
SESSION_DRIVER=file
CACHE_DRIVER=file
QUEUE_CONNECTION=sync

# Mail
MAIL_MAILER=sendinblue
SENDINBLUE_API_KEY=your_api_key_here
```

**2. `.htaccess` racine (redirection vers public/)** :
```apache
<IfModule mod_rewrite.c>
    RewriteEngine On

    # Rediriger tout vers le dossier public de Laravel
    RewriteCond %{REQUEST_URI} !^/public/
    RewriteRule ^(.*)$ public/$1 [L]
</IfModule>
```

**3. Configuration PHP via `.htaccess` ou cPanel** :
```apache
# Version PHP 8.2 minimum
AddHandler application/x-httpd-php82 .php

# Limites PHP
php_value upload_max_filesize 10M
php_value post_max_size 10M
php_value memory_limit 256M
php_value max_execution_time 60
```

**4. Déploiement via script SFTP** :

```bash
#!/bin/bash
# deploy.sh

# Variables
O2SWITCH_HOST="ssh.o2switch.net"
O2SWITCH_USER="your_username"
O2SWITCH_PATH="/home/your_username/laravel_app"

# 1. Build frontend
echo "📦 Building frontend..."
cd frontend
npm run build
cd ..

# 2. Install backend dependencies (sans dev)
echo "📦 Installing backend dependencies..."
cd backend
composer install --no-dev --optimize-autoloader
cd ..

# 3. Sync vers O2Switch (excluant node_modules, .git, tests)
echo "🚀 Deploying to O2Switch..."
rsync -avz --progress \
  --exclude='node_modules' \
  --exclude='.git' \
  --exclude='tests' \
  --exclude='.env' \
  backend/ $O2SWITCH_USER@$O2SWITCH_HOST:$O2SWITCH_PATH/

# 4. Copier index.php et .htaccess dans public_html
echo "📋 Copying public files..."
scp backend/public/index.php $O2SWITCH_USER@$O2SWITCH_HOST:/home/your_username/public_html/
scp backend/public/.htaccess $O2SWITCH_USER@$O2SWITCH_HOST:/home/your_username/public_html/

# 5. Run migrations
echo "🔄 Running migrations..."
ssh $O2SWITCH_USER@$O2SWITCH_HOST "cd $O2SWITCH_PATH && php artisan migrate --force"

# 6. Clear cache
echo "🧹 Clearing cache..."
ssh $O2SWITCH_USER@$O2SWITCH_HOST "cd $O2SWITCH_PATH && php artisan config:cache && php artisan route:cache && php artisan view:cache"

echo "✅ Deployment complete!"
```

**5. Cron jobs O2Switch (via cPanel)** :

Pour les tâches planifiées Laravel (calcul résultats votes) :
```bash
# Cron à ajouter dans cPanel (1x par minute)
* * * * * cd /home/your_username/laravel_app && php artisan schedule:run >> /dev/null 2>&1
```

**6. Permissions fichiers** :
```bash
# Via SSH O2Switch
chmod -R 755 /home/your_username/laravel_app
chmod -R 775 /home/your_username/laravel_app/storage
chmod -R 775 /home/your_username/laravel_app/bootstrap/cache
```

**7. Configuration vite.config.js (build vers backend/public)** :
```javascript
// frontend/vite.config.js
export default defineConfig({
  plugins: [vue()],
  build: {
    outDir: '../backend/public',  // ⚠️ Build directement dans Laravel public
    emptyOutDir: false,  // Ne pas vider (garde index.php Laravel)
    manifest: true,
    rollupOptions: {
      input: 'src/main.js'
    }
  }
})
```

#### Limitations O2Switch à connaître

**Ce qui fonctionne** :
- ✅ Laravel complet (sauf queue workers)
- ✅ Eloquent ORM
- ✅ Blade templates
- ✅ API REST Sanctum
- ✅ Cache fichiers
- ✅ Sessions fichiers
- ✅ Upload fichiers (storage local)
- ✅ Cron jobs Laravel (schedule:run)
- ✅ SSL Let's Encrypt gratuit

**Limitations mutualisé** :
- ❌ Pas de Redis (cache/sessions sur fichiers)
- ❌ Pas de queue workers (queue sync uniquement)
- ❌ Pas de WebSocket (Laravel Echo)
- ❌ Pas de processes longs (max 60s execution)
- ❌ Pas d'accès root (pas Docker)

**Solutions de contournement** :
- **Notifications temps réel** : Polling AJAX (setInterval 30s) ou Server-Sent Events (SSE)
- **Jobs lourds** : Découper en micro-tâches via cron
- **Cache** : File cache performant avec opcache PHP activé

### B. Checklist sécurité (à valider avant go-live)

**Authentication** :
- [ ] Passwords hashés bcrypt/argon2
- [ ] Rate limiting connexion (5 tentatives/min)
- [ ] Email verification obligatoire
- [ ] 2FA optionnel (Google Authenticator)
- [ ] Session regeneration après login
- [ ] Logout invalide tokens

**Authorization** :
- [ ] Policies pour tous models
- [ ] Middleware roles (admin, modo, auteur)
- [ ] CSRF tokens sur tous forms
- [ ] CORS configuré strict

**Data Validation** :
- [ ] Form Requests partout
- [ ] Validation serveur stricte
- [ ] Sanitization HTML (HTMLPurifier)
- [ ] XSS protection (Blade auto-escape)

**File Upload** :
- [ ] MIME type validation
- [ ] Extension whitelist
- [ ] Taille max (2MB images)
- [ ] Storage hors webroot
- [ ] Antivirus scan (ClamAV)

**API Security** :
- [ ] Rate limiting (60 req/min)
- [ ] Pagination forcée
- [ ] No sensitive data in URLs
- [ ] HTTPS only (redirect HTTP)

**Infrastructure** :
- [ ] .env jamais commité
- [ ] Secrets dans GitLab CI/CD vars
- [ ] DB credentials rotatés
- [ ] Backups quotidiens
- [ ] Monitoring uptime

### C. Ressources et documentation

**Laravel** :
- [Laravel 12 Documentation](https://laravel.com/docs/12.x)
- [Laravel Best Practices](https://github.com/alexeymezenin/laravel-best-practices)
- [Spatie Laravel Packages](https://spatie.be/open-source?type=laravel)

**Vue 3** :
- [Vue 3 Documentation](https://vuejs.org/)
- [Vue Router 4](https://router.vuejs.org/)
- [Vue 3 Composables](https://vuejs.org/guide/reusability/composables.html)
- [Vitest](https://vitest.dev/)

**Vuemann** :
- `vuemann/docs/bonne-pratiques.md` (⭐ guide architecture)
- `vuemann/docs/testing.md` (⭐ guide tests)
- `vuemann/src/` (composants et services disponibles)

**Sécurité** :
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Laravel Security Best Practices](https://laravel-news.com/laravel-security-best-practices)

### D. Glossaire métier Ghosty

| Terme | Définition |
|-------|------------|
| **Roman** | Histoire collaborative en cours d'écriture |
| **Oeuvre** | Chapitre ou Cover proposé(e) |
| **Chapitre** | Texte proposé pour continuer un roman |
| **Cover** | Image de couverture proposée pour un roman |
| **Vote** | +1 (j'aime), -1 (j'aime pas), 0 (neutre) sur une oeuvre |
| **Session de vote** | Période hebdomadaire où les votes sont ouverts |
| **Résultat** | Calcul gagnant à la fin de session de vote |
| **Signalement** | Déclaration d'une oeuvre inappropriée |
| **Sanction** | Restriction (vote, write, comment) suite signalement |
| **Brouillon** | Oeuvre non publiée, en cours de rédaction |
| **Favoris** | Romans suivis par un utilisateur |
| **Historique** | Versions successives d'un chapitre modifié |

---

## 🎯 Conclusion

La migration de Ghosty vers Vue 3 + Laravel est **faisable en 14 semaines avec 2 développeurs**.

**Priorités immédiates** :
1. 🔴 **URGENT** : Corriger failles sécurité critiques (credentials, SQL injection, XSS)
2. 🟠 **Important** : Documenter algorithme votes et logique métier complexe
3. 🟢 **Normal** : Démarrer setup infrastructure (Docker, repos, CI/CD)

**Facteurs de succès** :
- ✅ Utilisation maximale de Vuemann (95%+ styles)
- ✅ Architecture stricte (Controllers → Repositories → API)
- ✅ Tests automatisés (80%+ couverture)
- ✅ Migration progressive (Strangler Pattern)
- ✅ Beta test avant cutover production

**Livrables attendus** :
- Rapport d'audit ✅ (ce document)
- Plan de migration ✅ (ce document)
- CLAUDE_BEST_PRACTICES.md ⏳ (à créer)
- Spécifications techniques détaillées ⏳ (à valider)

---

**Prochaine étape** : Validation du plan par le client + création du fichier `CLAUDE_BEST_PRACTICES.md`

**Contact** : Claude AI - Assistant de migration
**Date** : 2025-10-01
