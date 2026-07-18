# Date Helper

`import { dateHelper } from '@brugmann/vuemann/src/helpers/date-helper.js'`

Uses dayjs (+ customParseFormat, utc plugins).

**UTC methods:**
- `parseDate(dateStr, format)` → ISO 'YYYY-MM-DD[T]HH:mm:ss[Z]'
- `formatDate(dateStr, format='DD/MM/YYYY')` → formatted string

**Local methods:**
- `parseDateLocal(dateStr, format='DD/MM/YYYY')` → ISO with local timezone
- `formatDateLocal(dateStr, format='DD/MM/YYYY')` → local formatted string

**Comparison:**
- `isBefore(d1, d2, format?)`, `isBeforeOrEqual(d1, d2, format?)`, `isAfter(d1, d2, format?)`, `isAfterOrEqual(d1, d2, format?)` — d2 defaults to current date when falsy; `DD/MM/YYYY` format is auto-detected, other custom formats can be passed explicitly via the format parameter

**Validation:** `isValidDate(dateStr, format)` — parses then reformats to verify match

**Arithmetic:**
- `addToDate(dateStr, amount, unit, format='YYYY-MM-DD')` → adds amount of unit to date, returns formatted string
- `subtractFromDate(dateStr, amount, unit, format='YYYY-MM-DD')` → subtracts amount of unit from date, returns formatted string
- Units: `day`, `week`, `month`, `year`, `hour`, `minute`, `second`

**Current:** `currentDatetime()` → 'DD/MM/YYYY HH:mm:ss', `currentDate(format='DD/MM/YYYY')` → formatted
