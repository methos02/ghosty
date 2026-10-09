---
paths:
  - "src/**/*.js"
  - "src/**/*.vue"
  - "src/locales/**/*.json"
---
# English Identifiers, French Labels

Variables, DTO properties, form field names and translation **keys** are in English (`register_username`). Translation **values** are in French (`"Pseudo"`, `"Le pseudo est requis"`). A global rename protects displayed strings before substituting: confusing the two changes the interface instead of the code.

**BAD**

```json
{ "register_pseudo": "Username" }
```

**GOOD**

```json
{ "register_username": "Pseudo" }
```
