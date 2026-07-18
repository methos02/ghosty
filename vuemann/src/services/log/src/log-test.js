/* eslint-disable no-console */
import { ConfigLoader } from '@brugmann/vuemann/src/config/config-loader.js'
import { servicesM } from '@brugmann/vuemann/src/services/services-manager.js'
import { req } from '@brugmann/vuemann/src/shortcuts/services-shortcut.js'
import { LogDto } from '@brugmann/vuemann/src/services/log/src/log-dto.js'

const checkLogEnabled = () => {
  const isEnabled = ConfigLoader.find('app.log', true)
  return {
    label: 'app.log is enabled',
    passed: isEnabled,
    message: isEnabled ? 'Log configuration is enabled' : 'Log is disabled in config',
    hint: isEnabled ? undefined : 'Set "app.log" to true in your app config (config/app.js).',
  }
}

const checkLogRoute = () => {
  const hasRoute = servicesM.service('router:hasApiRoute', 'log')
  return {
    label: 'API route "log" is configured',
    passed: hasRoute,
    message: hasRoute ? 'Log API route exists' : 'Route "log" not found in API routes',
    hint: hasRoute
      ? undefined
      : 'Add a route named "log" to your API routes config (e.g. apiRoutes.log = { api: "log", method: "post", url: "/" }).',
  }
}

const checkLogApiUrl = () => {
  const hasUrl = ConfigLoader.has('app.apis.log.url')
  const url = hasUrl ? ConfigLoader.find('app.apis.log.url') : undefined
  return {
    label: 'Log API URL is configured',
    passed: hasUrl,
    message: hasUrl ? `Log API URL is set to "${url}"` : 'Config key "app.apis.log.url" is missing',
    hint: hasUrl
      ? undefined
      : 'Add "app.apis.log.url" in your app config (config/app.js), e.g. apis: { log: { url: "https://your-log-api.example.com" } }.',
  }
}

const sendTestLog = async () => {
  try {
    await req('log', {
      body: LogDto.toCreate('Log test', { module: 'log-test' }),
      log: false,
    })
    return {
      label: 'Test log sent successfully',
      passed: true,
      message: 'Log request completed without errors',
    }
  } catch (error) {
    return {
      label: 'Test log sent successfully',
      passed: false,
      message: `Request failed: ${error.message}`,
      hint: 'Check that the log API URL is reachable, that the route method matches the backend, and that CORS/authentication are correctly configured.',
    }
  }
}

const logConsoleResults = results => {
  console.group('[Log Test] Testing log configuration...')
  for (const result of results) {
    const icon = result.passed ? '✅' : '❌'
    console.log(`  ${icon} ${result.label}`)
  }
  console.groupEnd()

  const allPassed = results.every(result => result.passed)
  if (!allPassed) {
    return
  }
  console.log('[Log Test] All checks passed!')
}

const createResultsResponse = (results, success) => {
  logConsoleResults(results)
  return { success, results }
}

export const testLogConfig = async () => {
  const logEnabledResult = checkLogEnabled()
  if (!logEnabledResult.passed) {
    return createResultsResponse([logEnabledResult], false)
  }

  const logRouteResult = checkLogRoute()
  if (!logRouteResult.passed) {
    return createResultsResponse([logEnabledResult, logRouteResult], false)
  }

  const logApiUrlResult = checkLogApiUrl()
  if (!logApiUrlResult.passed) {
    return createResultsResponse([logEnabledResult, logRouteResult, logApiUrlResult], false)
  }

  const testLogResult = await sendTestLog()
  const results = [logEnabledResult, logRouteResult, logApiUrlResult, testLogResult]
  return createResultsResponse(results, testLogResult.passed)
}
