#!/usr/bin/env node

import { InitApi } from "./init-api.js";

const args = process.argv.slice(2);
const folderName = args[0]

try {
  InitApi(folderName)
  console.log(`✅ L'API "${folderName}" a été créée avec succès dans "src/apis/${folderName}".`)
} catch (error) {
  console.error(error.message)
  process.exit(1)
}