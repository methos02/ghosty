# Flash Service

Displays flash messages on screen right side. Auto-delete after 4000ms (pauses on hover).

**Dependencies:** log (error/warning auto-logged)

## Methods

- `flash.success(message)` / `flash.error(message)` / `flash.warning(message)`
- `flash.successT(key, params?)` / `flash.errorT(key, params?)` / `flash.warningT(key, params?)` — with translation

## Flash Structure

`{ id: String (auto), content: String, type: 'success'|'error'|'warning'|'info', autodelete: Boolean, hide: Boolean }`

## Flash

`import { flash } from '@brugmann/vuemann/src/shortcuts/services-shortcut.js'`

- `flash.flashes` — reactive getter, all active flashes
- `flash.removeFlash(flash_id)` — remove with fade-out

## Flash Store

`import { useFlashStore } from '@brugmann/vuemann/src/services/flash/src/flash-store.js'`

- `flashStore.getFlashes()`, `flashStore.getFlash(id)`, `flashStore.hasFlash(id)`
- `flashStore.addFlash(content, type='error')`, `flashStore.clearFlashes()`

## FlashComponent

Include once in App.vue to display all active flash messages.

The container uses the native Popover API (`popover="manual"`) and is promoted to the top layer on each new flash so messages stay visible above any open modal `<dialog>`. Requires Chrome 114+, Firefox 125+, Safari 17+; falls back to normal DOM stacking on unsupported browsers.
