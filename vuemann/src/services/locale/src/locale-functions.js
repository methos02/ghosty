let translater

const setTranslater = translater_instance =>  {
  translater = translater_instance
  return translater
}

const getTranslater = () => {
  return translater
}

const vueTranslate = (message, params) => {
  return localeFunctions.getTranslater().global.t(message, params)
}

const loadLocaleMessages = async locale => {
  translater.global.setLocaleMessage(locale, await getLocaleMessage(locale))
}

export const localeFunctions = { setTranslater, getTranslater, vueTranslate, loadLocaleMessages }

const getLocaleMessage = async (locale) => {
  const version = await getAppVersion();

    try {
      // Code pour Node.js (tests)
      const { default: path } = await import("node:path");
      const { readFile } = await import("node:fs/promises");
      const filePath = path.resolve("public/locales", `app-translate-${locale}-${version}.json`);
      const data = await readFile(filePath, "utf8");
      return JSON.parse(data);
    
    } catch {
      // Code pour le navigateur
      return await fetch(`/locales/app-translate-${locale}-${version}.json`).then((response) => response.json())
    }  
}

const getAppVersion = async () => {
  try {
    // Toujours lire la vraie version depuis package.json pour avoir les bons fichiers
    const { readFile } = await import("node:fs/promises");
    const data = await readFile("package.json", "utf8");
    const packageJson = JSON.parse(data);
    return packageJson.version.replaceAll('.', '_');
  } catch {
    // Fallback: utiliser la variable globale définie par Vite (navigateur uniquement)
    return __APP_VERSION__.replaceAll('.', '_');
  }
}
  
