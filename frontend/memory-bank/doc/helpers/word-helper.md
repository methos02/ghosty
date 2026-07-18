# Word Helper

`import { wordHelper } from '@brugmann/vuemann/src/helpers/word-helper.js'`

**Sanitization:**
- `sanitize(string)` → trims leading/trailing spaces and collapses multiple internal spaces into one. Returns `''` for non-string or empty input.

**Pure casing (no sanitize):**
- `uppercase(string)` → toUpperCase only. Returns `''` for non-string or empty input.
- `capitalize(string)` → first letter uppercase, rest lowercase. No sanitization. Returns `''` for non-string or empty input.

**Sanitize + casing (combined):**
- `upperSanitize(string)` → sanitize then toUpperCase. Use for user inputs that need cleaning + uppercase.
- `capiSanitize(string)` → sanitize then capitalize. Use for user inputs that need cleaning + capitalize.

**Normalization:**
- `normalize(string)` → removes diacritics (NFD decomposition) and converts to lowercase.
