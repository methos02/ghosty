# form-helper

`import { FormHelper } from '@brugmann/vuemann/src/helpers/form-helper.js'`

Pure helper — no service runtime required.

## API

- `FormHelper.getInputName(inputName, formName?)` — returns `inputName` when `formName` is undefined, otherwise `"formName.inputName"`.
- `FormHelper.isEmpty(value)` — `true` when value is `''`, `null`, `undefined`, an empty array, or an empty object.
- `FormHelper.isEmptyArray(value)` — `true` when value is an empty array.
- `FormHelper.isEmptyObject(value)` — `true` when value is an empty plain object.

## Usage

```js
import { FormHelper } from '@brugmann/vuemann/src/helpers/form-helper.js'

FormHelper.getInputName('email', 'user')   // 'user.email'
FormHelper.isEmpty('')                     // true
FormHelper.isEmpty([])                     // true
```
