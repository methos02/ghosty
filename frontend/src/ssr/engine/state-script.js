import { uneval } from 'devalue'

const build = state => `<script>window.__INITIAL_STATE__ = ${uneval(state ?? {})}</script>`

export const stateScript = {
  build,
}
