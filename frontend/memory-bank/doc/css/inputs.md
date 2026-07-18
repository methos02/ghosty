# Inputs

`.input` — styled input/textarea with `--neutral-100` (#ffffff) background, `--neutral-400` (#d9d9d9) border, rounded corners, full width. Hover/focus changes border to `--primary-300` (#9c4e89); focus adds a `box-shadow` ring. `[disabled]` and `[readonly]` get neutral background (`--neutral-200`), neutral border (`--neutral-400`), muted text (`--neutral-500`), `cursor: not-allowed`, and no hover/focus effect.
`.input-search` — wrapper div with `.input` class. Add `.searching` for loader on right.
`.select-container` > `select.input` — hides native caret, adds custom one.
`.checkbox-container` — aligns checkbox + label vertically with spacing.
