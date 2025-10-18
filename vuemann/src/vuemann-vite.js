/* eslint-disable no-console */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

let publicDirectory;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const vuemannVite = (projetcDirectory) => {
    return {
        name: 'vuemann',
        enforce: 'pre',
        async buildStart() {
            publicDirectory = path.resolve(projetcDirectory, 'public/images/vuemann');

            if (fs.existsSync(publicDirectory)) { fs.rmSync(publicDirectory, { recursive: true, force: true }) }
            fs.mkdirSync(publicDirectory, { recursive: true });

            console.log('Copie des images vers le dossier public...');
            
            const vuemannImagesFolder = path.resolve(__dirname, './assets/images')
            if(fs.existsSync(vuemannImagesFolder)) { copyImages(vuemannImagesFolder) }

            const servicesPath = path.resolve(__dirname, './services')
            const entries = fs.readdirSync(servicesPath, { withFileTypes: true });
            for (const entry of entries) {
                if (!entry.isDirectory()) { continue }
                
                const serviceImagesFolderPath = path.join(servicesPath, entry.name + '/images');
                if (!fs.existsSync(serviceImagesFolderPath)) { continue }

                copyImages(serviceImagesFolderPath);
            }

            await generateAppInfo(projetcDirectory)
        }
    };
}

const copyImages = (sourceDirectory) => {
    const files = fs.readdirSync(sourceDirectory, { withFileTypes: true });
    for (const file of files) {
        const sourcePath = path.join(sourceDirectory, file.name);
        const destinationPath = path.join(publicDirectory, file.name);

        if (file.isDirectory()) { copyImages(sourcePath); return }

        fs.copyFileSync(sourcePath, destinationPath);
    }
}

const generateAppInfo = async (projectDirectory) => {
    try {
        const packageJsonPath = path.resolve(projectDirectory, 'package.json');
        const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
        
        fs.writeFileSync(path.resolve(projectDirectory, 'public/app.json'), JSON.stringify({
            version: packageJson.version,
            description: packageJson.description || '',
            date: new Date().toISOString(),
            documentation: findManualFile(projectDirectory)
        }));
        
        console.log(`✅ app.json généré avec les informations du build`);
        
    } catch (error) {
        console.error('❌ Erreur lors de la génération des informations de build:', error.message);
        
        fs.writeFileSync(path.resolve(projectDirectory, 'public/app.json'), JSON.stringify({
            version: 'unknown',
            description: '',
            date: new Date().toISOString(),
            documentation: ''
        }));
    }
}

const findManualFile = (projectDirectory) => {
    const publicDir = path.resolve(projectDirectory, 'public');
    
    if (!fs.existsSync(publicDir)) { 
        console.warn('⚠️ Dossier public introuvable'); 
        return "" 
    }

    const files = fs.readdirSync(publicDir);
    const manualFile = files.find(file => 
        file.toLowerCase().includes('manual') && 
        file.toLowerCase().endsWith('.pdf')
    );

    if(!manualFile) {
        console.warn('⚠️ Aucun fichier manuel PDF trouvé dans le dossier public');
    }

    return manualFile ?? "";
}
