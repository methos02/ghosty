# LoaderComponent

Displays loader during async action.

`import Loader from '@brugmann/vuemann/src/components/LoaderComponent.vue'`

**Slot:** default — button content (replaced by loader when loading)

**Props:** `type` (String, 'bars' — 'bars'|'icon'), `cb` (Function, if click absent), `click` (Function, if cb absent), `params` (Array, []), `infinite` (Boolean, false — keep loader after completion), `buttonClasses` (String, 'btn btn-primary'/'null'), `buttonType` (String, 'button')

**Methods:** `setLoad(state)` — manual control, `runCallBack()` — execute cb

Auto loading management. Button dimension preservation (caches size to avoid shifts). Reentrancy-safe: while an async callback is running, further clicks and `runCallBack()` calls are ignored and the `<button>` is rendered with `disabled`.

```vue
<Loader :click="callback">Show loader</Loader>
<Loader :click="callback" type="icon"><i class="fa-solid fa-face-smile"></i></Loader>
```
