import { readFileSync } from 'node:fs'
import path from 'node:path'

function extractTranslationKeysFromObject(translationObject, prefix = '') {
  const keys = []
  
  for (const [key, value] of Object.entries(translationObject)) {
    const fullKey = prefix ? `${prefix}.${key}` : key
    
    if (typeof value === 'object' && value !== null) {
      keys.push(...extractTranslationKeysFromObject(value, fullKey))
      continue;
    } 
      
    keys.push(fullKey)
  }
  
  return keys
}

export function extractTranslationKeysFromFile(filePath) {
  try {
    const absolutePath = path.resolve(process.cwd(), filePath)
    
    const fileContent = readFileSync(absolutePath, 'utf8')
    const translationObject = JSON.parse(fileContent)
    
    return extractTranslationKeysFromObject(translationObject)
  } catch (error) {
    throw new Error(`Erreur lors de la lecture du fichier de traduction "${filePath}": ${error.message}`)
  }
}

export function extractTranslationKeysFromComponent(componentPath) {
  try {
    const absolutePath = path.resolve(process.cwd(), componentPath)
    const componentContent = readFileSync(absolutePath, 'utf8')
    const translationRegex = /t\(['"`]([^'"`]+)['"`]\)/g
    const foundKeys = []
    
    for (const match of componentContent.matchAll(translationRegex)) {
      const key = match[1]
      if (key.endsWith('.vue')) { continue }
      foundKeys.push(key)
    }
    
    return [...new Set(foundKeys)].sort()
  } catch (error) {
    throw new Error(`Erreur lors de la lecture du composant "${componentPath}": ${error.message}`)
  }
}

export function compareTranslationKeys(jsonKeys, componentKeys) {
  const jsonSet = new Set(jsonKeys)
  const componentSet = new Set(componentKeys)
  
  return {
    unusedKeys: jsonKeys.filter(key => !componentSet.has(key)),
    missingKeys: componentKeys.filter(key => !jsonSet.has(key)),
    usedKeys: jsonKeys.filter(key => componentSet.has(key)),
  }
}

export function extractTranslationKeysFromFiles(filePaths) {
  const allKeys = []
  
  for (const filePath of filePaths) {
    const keys = extractTranslationKeysFromFile(filePath)
    allKeys.push(...keys)
  }
  
  return allKeys
}
