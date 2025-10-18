# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Inheritance

**IMPORTANT** : Ce fichier étend et complète le fichier CLAUDE.md de Vuemann.

📄 **Fichier parent** : `node_modules/@brugmann/vuemann/CLAUDE.md`

Les règles et patterns définis dans le CLAUDE.md de Vuemann s'appliquent à ce projet. Ce fichier ajoute **uniquement** des spécificités pour l'application de gestion des demandes d'hospitalisation.

En cas de conflit entre les deux fichiers, les règles de ce fichier prévalent.

---

## Project Overview

Application Vue.js de gestion des demandes d'hospitalisation pour l'Hôpital Brugmann.

- **Type**: Application métier (CHU Brugmann)
- **Vuemann**: v4.2.0
- **APIs utilisées**:
  - `patient` - Gestion des patients connus
  - `opera` - Gestion des interventions chirurgicales
  - `hospitalization_request` - Gestion des demandes d'hospitalisation

---

## MCP Server Configuration (Context7)

Ce projet utilise **Context7** pour accéder à la documentation à jour des bibliothèques via Claude Code.

### Configuration initiale

1. **Créer le fichier `.mcp.json`** à la racine du projet :
```bash
cp .mcp.json.example .mcp.json
```

2. **Ajouter votre clé API Context7** : Obtenir une clé sur [https://context7.com](https://context7.com)

3. **Redémarrer Claude Code** pour détecter les changements

⚠️ **Sécurité** : `.mcp.json` contient votre clé personnelle et est ignoré par Git.

---

## Domain-Specific Patterns

### Hospitalisation Request Flow

```
1. Recherche des hospitalisations
   HospitalizationRepository.search(filters)
   ↓
2. Transformation via DTO
   HospitalizationDto.fromList(data)
   ↓
3. Hydratation automatique via utils.hydrate()
   - Patients connus (type: 'known') → PatientController.byIds()
   - Praticiens (surgery) → OperaController.practitionerByIds()
   - Spécialités (surgery) → OperaController.specialityByIds()
   - Interventions (surgery) → OperaController.interventionByIds()
   ↓
4. Données enrichies disponibles
   Toutes les données sont injectées automatiquement
```

### Patient Types

Deux types de patients dans le système :

1. **Known Patients** (`type: 'known'`)
   - Patients existants dans la base patient
   - Récupérés via `PatientController.byIds()`
   - Données enrichies (fullName, birthDate, gender, niss, phone)

2. **Unknown Patients** (`type: 'unknown'`)
   - Patients temporaires pour la demande
   - Stockés dans hospitalization_request
   - Données limitées (nom, prénom, date naissance, sexe)

---

## Routes API Spécifiques

```javascript
// Patient API
"patient.search": { url: "v1/patients/filters", method: "get", api: "patient" },
"patient.byIds": { url: "v1/patients/by-ids", method: "get", api: "patient" },
"patient.searchUnknown": { url: "v1/unknown_patients/search", method: "get", api: "hospitalization_request" },
"patient.storeUnknown": { url: "v1/unknown_patients/", method: "post", api: "hospitalization_request" },

// Hospitalization Request API
"hospitalization_request.store": { url: "v1/hospitalizations_requests/", method: "post", api: "hospitalization_request" },
"hospitalization_request.search": { url: "v1/hospitalizations_requests/search", method: "get", api: "hospitalization_request" },

// Opera API (interventions chirurgicales)
"praticien.search": { url: "v1/intervenants/substring/{search}", method: "get", api: "opera" },
"practitioner.get": { url: "v1/intervenants/id/{id}", method: "get", api: "opera" },
"intervention.search": { url: "v1/interventions/search", method: "get", api: "opera" },
"intervention.get": { url: "v1/interventions/id/{id}", method: "get", api: "opera" },
"speciality.index": { url: "v1/specialites/", method: "get", api: "opera" },
```

---

## Export Pattern (Ajout Vuemann)

**AJOUT SPÉCIFIQUE** : Pour faciliter les tests, les fonctions helpers/utils doivent être exportées via un objet.

```javascript
// ❌ MAUVAIS : Export direct (difficile à mocker)
export const hydrate = async (data, keys) => { ... }

// ✅ BON : Export via objet (facilement mockable avec vi.spyOn)
const hydrate = async (data, keys) => { ... }

export const hydrateFunction = {
    hydrate
}
```

**Usage** :
```javascript
import { hydrateFunction } from './utils-hydrate.js'
await hydrateFunction.hydrate(data, keys)

// Mock dans les tests
vi.spyOn(hydrateFunction, 'hydrate').mockResolvedValue(mockData)
```

Ce pattern s'applique aux **Helpers/Utils** (en complément des Repositories, Controllers, DTOs déjà respectés dans Vuemann).

---

## Key Points

**Spécificités de ce projet** (compléments du CLAUDE.md Vuemann) :

1. **Multi-APIs** : 3 APIs distinctes (patient, opera, hospitalization_request)
2. **Types de patients** : Distinction patients connus/inconnus
3. **Hydratation automatique** : `utils.hydrate()` gère l'hydratation par batch de toutes les dépendances (patients, praticiens, spécialités, interventions)
4. **DTO unifié** : `fromList()` et `fromShow()` retournent la même structure de données complète
5. **Context7 MCP** : Configuration pour accès documentation
6. **Export helpers** : Pattern d'export via objet pour utils/helpers
