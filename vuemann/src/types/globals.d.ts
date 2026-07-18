declare const __APP_VERSION__: string

declare module '*.vue' {
  import type { Component } from 'vue'
  const component: Component
  export default component
}
