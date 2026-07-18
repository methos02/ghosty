/* eslint-disable no-console */
import fs from 'node:fs'
import path from 'node:path'
import { translations } from './translations.js'

const extractApiKeysFromConfig = configContent => {
  const apisBlock = configExtractor.findApisBlock(configContent)
  const keys = configExtractor.extractTopLevelKeys(apisBlock)
  if (apisBlock.trim() !== '' && keys.length === 0) {
    console.warn(
      '⚠️ app-config.js declares an "apis" block but no API keys could be extracted — app.json apis will be empty',
    )
    return []
  }

  return keys
}

const extractApis = projectDirectory => {
  const appConfigPath = path.resolve(projectDirectory, 'src/config/app-config.js')
  if (!fs.existsSync(appConfigPath)) {
    return {}
  }

  const environmentVariables = configExtractor.parseEnvironmentFile(
    path.resolve(projectDirectory, '.env'),
  )
  const configContent = fs.readFileSync(appConfigPath, 'utf8')
  const apiKeys = configExtractor.extractApiKeysFromConfig(configContent)

  const apis = {}
  for (const apiName of apiKeys) {
    const environmentKey = `VITE_API_${apiName.toUpperCase()}_URL`
    apis[apiName] = environmentVariables[environmentKey] || process.env[environmentKey] || ''
  }

  return apis
}

const extractAppTitle = projectDirectory => {
  const appConfigPath = path.resolve(projectDirectory, 'src/config/app-config.js')
  if (!fs.existsSync(appConfigPath)) {
    return ''
  }

  const configContent = fs.readFileSync(appConfigPath, 'utf8')
  const titleMatch = configContent.match(/title\s*:\s*['"]([^'"]+)['"]/)
  if (!titleMatch) {
    return ''
  }

  return translations.resolveTranslationKey(titleMatch[1], projectDirectory)
}

const extractTopLevelKeys = block => {
  const keys = []
  const keyPattern = /(\w+)\s*:\s*\{/g
  let match = keyPattern.exec(block)
  while (match) {
    const precedingContent = block.slice(0, match.index)
    const openBraceCount = (precedingContent.match(/\{/g) || []).length
    const closeBraceCount = (precedingContent.match(/\}/g) || []).length
    const depth = openBraceCount - closeBraceCount
    if (depth === 0) {
      keys.push(match[1])
    }
    match = keyPattern.exec(block)
  }
  return keys
}

const findApisBlock = configContent => {
  const strippedContent = configExtractor.stripComments(configContent)
  const apisMatch = strippedContent.match(/apis\s*:\s*\{/)
  if (!apisMatch) {
    return ''
  }

  const openBraceIndex = strippedContent.indexOf('{', apisMatch.index)
  let depth = 0
  for (
    let characterIndex = openBraceIndex;
    characterIndex < strippedContent.length;
    characterIndex++
  ) {
    const character = strippedContent[characterIndex]
    if (character === '{') {
      depth++
    }
    if (character === '}') {
      depth--
    }
    if (depth === 0) {
      return strippedContent.slice(openBraceIndex + 1, characterIndex)
    }
  }
  return ''
}

const hasDocumentationRoute = projectDirectory => {
  const routesConfigPath = path.resolve(projectDirectory, 'src/config/routes-config.js')
  if (!fs.existsSync(routesConfigPath)) {
    return false
  }

  const routesContent = fs.readFileSync(routesConfigPath, 'utf8')
  return /path\s*:\s*['"]\/documentation['"]/.test(routesContent)
}

const parseEnvironmentFile = environmentPath => {
  if (!fs.existsSync(environmentPath)) {
    return {}
  }

  const environmentContent = fs.readFileSync(environmentPath, 'utf8')
  const environmentVariables = {}

  for (const line of environmentContent.split('\n')) {
    const trimmedLine = line.trim()
    if (trimmedLine.startsWith('#') || !trimmedLine) {
      continue
    }
    const [key, ...valueParts] = trimmedLine.split('=')
    environmentVariables[key.trim()] = valueParts.join('=').trim()
  }

  return environmentVariables
}

const stripComments = content => {
  return content.replaceAll(/\/\*[\s\S]*?\*\//g, '').replaceAll(/\/\/.*/g, '')
}

export const configExtractor = {
  extractApiKeysFromConfig,
  extractApis,
  extractAppTitle,
  extractTopLevelKeys,
  findApisBlock,
  hasDocumentationRoute,
  parseEnvironmentFile,
  stripComments,
}
