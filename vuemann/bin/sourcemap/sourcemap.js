#!/usr/bin/env node

/* eslint-disable no-console */

/**
 * sourcemap.js
 *
 * Usage:
 *   Place your JSON error object in a file named `error.log` at the project root.
 *   Ensure your sourcemaps are in `dist/assets/` alongside the generated bundles.
 *   Install dependencies: npm install source-map
 *   Run: node sourcemap.js
 */

import fs from 'node:fs';
import path from 'node:path';
import { SourceMapConsumer } from 'source-map';

const CONFIG = {
  SOURCEMAP_DIR: path.resolve('dist', 'assets'),
  STACK_REGEX: /at (?:[^()]+\()?((?:https?:\/\/)[^\s)]+\/assets\/([^:\s)]+\.js)):(\d+):(\d+)\)?/g
};

const sourcemapCache = new Map();

const log = {
  info: (message) => console.log(`[INFO] ${message}`),
  warn: (message) => console.warn(`[WARN] ${message}`),
  debug: (message, data = '') => console.log(`[DEBUG] ${message}`, data),
  success: (message) => console.log(`[OK] ${message}`),
  error: (message) => console.error(`[ERROR] ${message}`)
};

function readErrorLog() {
  const logFile = 'error.log'
  const logPath = path.resolve(process.cwd(), logFile);
  
  if (!fs.existsSync(logPath)) {
    throw new Error(`${logFile} non trouvé dans le répertoire courant (${process.cwd()}).`);
  }

  try {
    const rawContent = fs.readFileSync(logPath, 'utf8');
    return JSON.parse(rawContent);
  } catch (error) {
    throw new Error(`Échec de l'analyse de ${logFile}: ${error.message}`);
  }
}

async function loadSourceMap(jsFileName) {
  // Vérifier le cache d'abord
  if (sourcemapCache.has(jsFileName)) {
    return sourcemapCache.get(jsFileName);
  }

  const mapPath = path.join(CONFIG.SOURCEMAP_DIR, `${jsFileName}.map`);
  
  if (!fs.existsSync(mapPath)) {
    log.warn(`Sourcemap non trouvé pour ${jsFileName} à l'emplacement ${mapPath}`);
    return false;
  }

  try {
    log.info(`Chargement du sourcemap pour ${jsFileName} depuis ${mapPath}`);
    const rawMap = JSON.parse(fs.readFileSync(mapPath, 'utf8'));
    const consumer = await new SourceMapConsumer(rawMap);
    
    // Mise en cache
    sourcemapCache.set(jsFileName, consumer);
    return consumer;
  } catch (error) {
    log.error(`Erreur lors du chargement du sourcemap pour ${jsFileName}: ${error.message}`);
    return false;
  }
}

function cleanupSourceMaps() {
  for (const consumer of sourcemapCache.values()) {
    consumer.destroy();
  }
  sourcemapCache.clear();
}

function parseStackLine(regexMatch) {
  const [fullMatch, , jsFileName, lineString, columnString] = regexMatch;
  return {
    fullMatch,
    jsFileName,
    line: Number.parseInt(lineString, 10),
    column: Number.parseInt(columnString, 10)
  };
}

function formatOriginalPosition(originalPos) {
  if (!originalPos || !originalPos.source) { return false; }

  // Nettoyage du chemin source
  const cleanSource = originalPos.source
    .replace(/^webpack:\/\//, '')
    .replace(/^\.\//, '');

  const functionName = originalPos.name ? ` (${originalPos.name})` : '';
  return `at ${cleanSource}:${originalPos.line}:${originalPos.column}${functionName}`;
}

async function findOriginalPosition(jsFileName, line, column) {
  const consumer = await loadSourceMap(jsFileName);
  
  if (!consumer) {
    log.warn(`Pas de consumer disponible pour ${jsFileName}`);
    return false;
  }

  log.debug(`Recherche mapping pour ${jsFileName} à ${line}:${column}`);
  const originalPosition = consumer.originalPositionFor({ line, column });
  log.debug('Mapping trouvé:', originalPosition);

  return originalPosition;
}

async function symbolicateStackTrace(stackTrace) {
  log.debug('Stack trace original:', stackTrace);

  // Trouver toutes les correspondances
  const matches = [...stackTrace.matchAll(CONFIG.STACK_REGEX)];
  log.debug(`${matches.length} correspondances trouvées`);

  let result = stackTrace;

  // Traiter chaque correspondance
  for (const match of matches) {
    const { fullMatch, jsFileName, line, column } = parseStackLine(match);
    
    const originalPosition = await findOriginalPosition(jsFileName, line, column);
    const formattedPosition = formatOriginalPosition(originalPosition);

    if (formattedPosition) {
      log.success(`${fullMatch} => ${formattedPosition}`);
      result = result.replace(fullMatch, formattedPosition);
    } else {
      log.warn(`Pas de correspondance pour ${jsFileName} à ${line}:${column}`);
    }
  }

  return result;
}

// ===== AFFICHAGE DES RÉSULTATS =====
function displayResults(errorData, symbolicatedStack) {
  const { date, app, message, info } = errorData;
  
  console.log(`Date:    ${date}`);
  console.log(`App:     ${app}`);
  console.log(`Message: ${message}`);
  console.log(`Info:    ${info}\n`);
  console.log('Stack (symbolicated):');
  console.log(symbolicatedStack);
}

// ===== FONCTION PRINCIPALE =====
async function symbolicate() {
  try {
    // Lecture du fichier d'erreur
    const errorData = readErrorLog();
    
    // Symbolisation de la stack trace
    const symbolicatedStack = await symbolicateStackTrace(errorData.stack);
    
    // Affichage des résultats
    displayResults(errorData, symbolicatedStack);
    
  } finally {
    // Nettoyage des ressources
    cleanupSourceMaps();
  }
}

// ===== EXÉCUTION =====
try {
  await symbolicate();
} catch (error) {
  log.error(error.message);
  process.exit(1);
}
