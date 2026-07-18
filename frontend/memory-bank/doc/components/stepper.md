# StepperComponent

Multi-step wizard with validation and cancel confirmation dialog.

`import Stepper from '@brugmann/vuemann/src/components/stepper/StepperComponent.vue'`

**Props:** `steps` (Array, required), `title` (String, ''), `modelValue` (Object, required — v-model), `onSubmit` (Function, required — async), `onCancel` (Function, default: reset())

**Step object:** `{ key: String, label: String, icon?: String (fa-solid fa-circle), component: Component, validation?: (modelValue) => { valid: boolean }, onLeave?: (modelValue) => void }`

**`onLeave` hook:** Called just before transitioning to the next step, after validation passes. Receives `modelValue` (the full form data object) and may mutate it in place. Only fires on forward transitions via the "Next" button — not on backward navigation, not on `goToStep()`, not on submit.

**Events:** `update:modelValue`

**Exposed:** `goToStep(index)`, `reset()`, `currentStep` (read-only ref)

**Slot:** `confirm-dialog` — custom cancel confirmation content

**Navigation**: Next (validates first), Previous, click completed step, Submit on last step (validates first). Buttons disabled during async submission. Cancel opens DialogComponent → onCancel only on confirm.

**Keyboard navigation** (via `useStepperKeyboardNavigation` composable):
- **Tab** from the last interactive element in a step → focuses the Next button (or Submit on the last step)
- **Enter** on the last interactive element (except `<textarea>`) → triggers Next/Submit
- On step transition → auto-focuses the first interactive element of the new step
- Interactive elements detected: `input` (not hidden, not tabindex="-1"), `select`, `textarea`, `[role="switch"]`, `[role="combobox"]`, `[role="listbox"]`, `button.switch`

```vue
<Stepper ref="stepperRef" title="Wizard" :steps="steps" v-model="formData"
  :onSubmit="handleSubmit" :onCancel="handleCancel" />
```
