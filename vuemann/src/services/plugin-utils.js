import { promises as fs } from 'node:fs'
import path from 'node:path'

const getAppVersion = async () => {
    const packageContent = await fs.readFile('package.json', 'utf8')
    const packageJson = JSON.parse(packageContent)
    return packageJson.version.replaceAll('.', '-')
}

const cleanOldServiceWorkers = async sw_name => {
    const publicDirectory = 'public'
    const files = await fs.readdir(publicDirectory)
    
    const oldWorkerFiles = files.filter(file => file.startsWith(sw_name) && file.endsWith('.js'))
    for (const file of oldWorkerFiles) {
        await fs.unlink(path.join(publicDirectory, file))
        //eslint-disable-next-line no-console
        console.log(`🗑️ Anciens workers supprimés: ${file}`)
    }
}

export const pluginUtils = { 
    getAppVersion,
    cleanOldServiceWorkers
}
