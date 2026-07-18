# Pixel Helper

`import { pixelHelper } from '@brugmann/vuemann/src/helpers/pixel-helper.js'`

Conversion entre valeurs CSS en pixels et nombres, dans les deux sens.

- `pxToNumber(pxString)` → retire le `px` final et convertit le reste en nombre (`"2px"` → `2`, `"2.5px"` → `2.5`). **Lève une exception** si le reste n'est pas numérique (`"auto"`, `"10%"`) : la valeur invalide n'est pas masquée par un fallback silencieux. Adapté aux retours de `getComputedStyle`, toujours de la forme `"Npx"`.
- `numberToPx(value)` → ajoute l'unité px à un nombre (`2` → `"2px"`).
