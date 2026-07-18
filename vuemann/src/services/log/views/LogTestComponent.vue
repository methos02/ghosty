<script setup>
import { ref } from 'vue'
import { testLogConfig } from '@brugmann/vuemann/src/services/log/src/log-test.js'
import Loader from '@brugmann/vuemann/src/components/LoaderComponent.vue'

const testResults = ref(undefined)
const loader = ref()

const runTest = async () => {
  testResults.value = undefined
  const result = await testLogConfig()
  testResults.value = result
  loader.value.setLoad(false)
}
</script>

<template>
  <div class="container | p-30">
    <h1 class="h1 mb-20">Log Configuration Test</h1>

    <p class="mb-20">This page validates the log service configuration by testing:</p>
    <ul class="mb-30">
      <li>Log configuration is enabled (<code class="badge badge-code">app.log</code>)</li>
      <li>API route exists for log endpoint</li>
      <li>Test log can be sent successfully</li>
    </ul>

    <Loader
      buttonClasses="btn btn-primary btn-primary-400-active"
      ref="loader"
      :click="runTest"
    >
      Run Log Test
    </Loader>

    <div
      v-if="testResults"
      class="mt-30"
    >
      <h2 class="h2 mb-15">Test Results</h2>

      <div
        v-if="testResults.results.length > 0"
        class="f-column g-15"
      >
        <div
          v-for="(result, index) in testResults.results"
          :key="index"
          class="test-result | p-15 d-flex a-start g-10"
          :class="result.passed ? 'bg-success-light' : 'bg-danger-light'"
        >
          <span class="test-icon | fs-24">{{ result.passed ? '✅' : '❌' }}</span>
          <div class="f-column g-5">
            <strong :class="result.passed ? 'color-success' : 'color-danger'">
              {{ result.label }}
            </strong>
            <span class="fs-14">{{ result.message }}</span>
            <span
              v-if="!result.passed && result.hint"
              class="fs-14 hint | mt-5 p-10"
            >
              <strong>How to fix:</strong> {{ result.hint }}
            </span>
          </div>
        </div>
      </div>

      <div
        v-if="testResults.success"
        class="mt-20 p-15 bg-success-light"
      >
        <strong class="color-success">All checks passed!</strong>
        <p class="mt-5">The log service is correctly configured.</p>
      </div>

      <div
        v-if="!testResults.success && testResults.results.length > 0"
        class="mt-20 p-15 bg-danger-light"
      >
        <strong class="color-danger">Some checks failed</strong>
        <p class="mt-5">Please review the configuration and try again.</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.container {
  max-width: 800px;
  margin: 0 auto;
}

.test-result {
  border-radius: 8px;
  border: 1px solid var(--color-border);
}

.bg-success-light {
  background-color: rgba(76, 175, 80, 0.1);
}

.bg-danger-light {
  background-color: rgba(244, 67, 54, 0.1);
}

.test-icon {
  line-height: 1;
}

.hint {
  background-color: rgba(255, 193, 7, 0.15);
  border-left: 3px solid rgba(255, 152, 0, 0.6);
  border-radius: 4px;
}

code {
  padding: 2px 6px;
  border-radius: 4px;
  font-family: monospace;
  font-size: 0.9em;
}
</style>
