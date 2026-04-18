import fs from 'node:fs'
import path from 'node:path'

const loadLocaleFiles = (directory) => {
    const translations = {};
    const entries = fs.readdirSync(directory, { withFileTypes: true });

    for (const entry of entries) {
        const entryPath = path.join(directory, entry.name);

        if (entry.isDirectory()) {
            mergeTranslations(loadLocaleFiles(entryPath), translations);
            continue;
        }

        if (path.extname(entry.name) !== '.json') { continue }

        mergeTranslations(JSON.parse(fs.readFileSync(entryPath, 'utf8')), translations);
    }

    return translations;
}

const mergeTranslations = (source, target) => {
    for (const key in source) {
        if (typeof source[key] === 'object' && source[key] !== null) {
            if (target[key] === undefined) { target[key] = {} }
            mergeTranslations(source[key], target[key]);
            continue;
        }

        target[key] = source[key];
    }
}

export const localeHelper = { loadLocaleFiles, mergeTranslations }
