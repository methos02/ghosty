<template>
    <h1 class="h1">Debug</h1>
    <p>
        Cette page explique les différentes procédures pour débugger une application avec Vuemann.
    </p>
    
    <h2 class="h2">Lire les logs en production</h2>
    <p>
        Les fichiers de l'application étant minifiés en production, vous ne pourrez pas retrouver la localisation des erreurs facilement.
        Une solution pour afficher la localisation exacte des erreurs serait de désactiver la minification des fichiers. Cependant, cette solution 
        comporte deux inconvénients majeurs : le chargement de l'application sera plus long et révéler le code source de l'application en clair sur le client
        pose un risque de sécurité.
    </p>
    <p>
        Pour cela, vous devez suivre les deux étapes suivantes :
    </p>
    <ol class="ml-25">
        <li class="mb-5">
            <p>
                Placer votre erreur dans le fichier <span class="badge-code">error.log</span> à la racine de l'application
            </p>
        </li>
        <li>
            <p>
                Lancer la commande <span class="badge-code">npx sourcemap</span>
            </p>
        </li>
    </ol>

    <h2 class="h2">Utilitaires de test disponibles</h2>
    <p>
        Vuemann fournit plusieurs utilitaires et mocks pour faciliter l'écriture de tests unitaires et d'intégration.
    </p>
    
    <h3 class="h3">Table des matières</h3>
    
    <h4 class="h4">Fonctions utilitaires de test</h4>
    <ul class="list ml-25">
        <li>
            <a href="#init-router" class="link-underline">initRouter()</a>
        </li>
        <li>
            <a href="#trigger-input" class="link-underline">triggerInput(wrapper, selector, value)</a>
        </li>
        <li>
            <a href="#trigger-confirm" class="link-underline">triggerConfirm(wrapper, type)</a>
        </li>
        <li>
            <a href="#trigger-loader" class="link-underline">triggerLoader(wrapper)</a>
        </li>
    </ul>

    <h4 class="h4">Fonctions de test de traduction</h4>
    <ul class="list ml-25">
        <li>
            <a href="#extract-translation-file" class="link-underline">extractTranslationKeysFromFile(filePath)</a>
        </li>
        <li>
            <a href="#extract-translation-component" class="link-underline">extractTranslationKeysFromComponent(componentPath)</a>
        </li>
        <li>
            <a href="#compare-translation-keys" class="link-underline">compareTranslationKeys(jsonKeys, componentKeys)</a>
        </li>
    </ul>

    <h4 class="h4">Mocks disponibles</h4>
    <ul class="list ml-25">
        <li>
            <a href="#window-mock" class="link-underline">window-mock.js</a>
        </li>
        <li>
            <a href="#dialog-mock" class="link-underline">dialog-mock.js</a>
        </li>
        <li>
            <a href="#router-service-mock" class="link-underline">router-service-mock.js</a>
        </li>
        <li>
            <a href="#websocket-mock" class="link-underline">websocket-mock.js</a>
        </li>
        <li>
            <a href="#fs-mock" class="link-underline">fs-mock.js</a>
        </li>
        <li>
            <a href="#path-mock" class="link-underline">path-mock.js</a>
        </li>
    </ul>

    <h4 class="h4">Seeders de données de test</h4>
    <ul class="list ml-25">
        <li>
            <a href="#users-seeder" class="link-underline">users-seeder.js</a>
        </li>
        <li>
            <a href="#groups-seeder" class="link-underline">groups-seeder.js</a>
        </li>
        <li>
            <a href="#levels-seeder" class="link-underline">levels-seeder.js</a>
        </li>
    </ul>

    <h4 class="h4">Configuration et exemples</h4>
    <ul class="list ml-25">
        <li>
            <a href="#configuration-vitest" class="link-underline">Configuration Vitest</a>
        </li>
        <li>
            <a href="#exemple-complet" class="link-underline">Exemple de test complet</a>
        </li>
    </ul>

    <h3 class="h3" id="fonctions-utilitaires">Fonctions utilitaires de test</h3>
    <p>
        Ces fonctions sont disponibles dans <span class="badge-code">tests/utils/functions/utils.js</span> :
    </p>
    
    <h4 class="h4" id="init-router">initRouter()</h4>
    <p>
        Initialise un routeur Vue Router pour les tests avec la configuration des routes de l'application.
    </p>
    <div class="div-code">
        <span class="color-green">// Initialisation du routeur pour les tests</span><br />
        import { initRouter } from '@/tests/utils/functions/utils.js'<br />
        <br />
        const router = initRouter()
    </div>

    <h4 class="h4" id="trigger-input">triggerInput(wrapper, selector, value)</h4>
    <p>
        Simule la saisie dans un champ de formulaire et déclenche l'événement input avec un délai.
        <strong>Important :</strong> Cette fonction utilise des timers, vous devez activer les fakeTimers dans vos tests.
    </p>
    <div class="div-code">
        <span class="color-green">// Configuration des fakeTimers (obligatoire)</span><br />
        import { vi } from 'vitest'<br />
        <br />
        beforeEach(() => {<br />
        &emsp;vi.useFakeTimers()<br />
        })<br />
        <br />
        afterEach(() => {<br />
        &emsp;vi.useRealTimers()<br />
        })<br />
        <br />
        <span class="color-green">// Simulation de saisie utilisateur</span><br />
        import { triggerInput } from '@/tests/utils/functions/utils.js'<br />
        <br />
        await triggerInput(wrapper, '#search-input', 'test value')
    </div>

    <h4 class="h4" id="trigger-confirm">triggerConfirm(wrapper, type)</h4>
    <p>
        Simule le processus de confirmation pour les composants ConfirmButtonComponent ou ConfirmIconComponent.
    </p>
    <div class="div-code">
        <span class="color-green">// Confirmation pour ConfirmButtonComponent</span><br />
        await triggerConfirm(wrapper, 'button')<br />
        <br />
        <span class="color-green">// Confirmation pour ConfirmIconComponent</span><br />
        await triggerConfirm(wrapper, 'icon')
    </div>

    <h4 class="h4" id="trigger-loader">triggerLoader(wrapper)</h4>
    <p>
        Simule le clic sur le bouton d'un LoaderComponent.
    </p>
    <div class="div-code">
        <span class="color-green">// Simulation du clic sur le loader</span><br />
        import { triggerLoader } from '@/tests/utils/functions/utils.js'<br />
        <br />
        await triggerLoader(wrapper)
    </div>

    <h3 class="h3" id="fonctions-traduction">Fonctions de test de traduction</h3>
    <p>
        Ces fonctions sont disponibles dans <span class="badge-code">tests/utils/functions/translate-test-functions.js</span> :
    </p>

    <h4 class="h4" id="extract-translation-file">extractTranslationKeysFromFile(filePath)</h4>
    <p>
        Extrait toutes les clés de traduction d'un fichier JSON de traduction.
    </p>
    <div class="div-code">
        <span class="color-green">// Extraction des clés de traduction</span><br />
        import { extractTranslationKeysFromFile } from '@/tests/utils/functions/translate-test-functions.js'<br />
        <br />
        const keys = extractTranslationKeysFromFile('src/locales/fr/common.json')
    </div>

    <h4 class="h4" id="extract-translation-component">extractTranslationKeysFromComponent(componentPath)</h4>
    <p>
        Extrait toutes les clés de traduction utilisées dans un composant Vue.
    </p>
    <div class="div-code">
        <span class="color-green">// Extraction des clés d'un composant</span><br />
        import { extractTranslationKeysFromComponent } from '@/tests/utils/functions/translate-test-functions.js'<br />
        <br />
        const keys = extractTranslationKeysFromComponent('src/components/MyComponent.vue')
    </div>

    <h4 class="h4" id="compare-translation-keys">compareTranslationKeys(jsonKeys, componentKeys)</h4>
    <p>
        Compare les clés de traduction entre un fichier JSON et un composant pour détecter les clés manquantes ou inutilisées.
    </p>
    <div class="div-code">
        <span class="color-green">// Comparaison des clés de traduction</span><br />
        import { compareTranslationKeys } from '@/tests/utils/functions/translate-test-functions.js'<br />
        <br />
        const result = compareTranslationKeys(jsonKeys, componentKeys)<br />
        <span class="color-green">// Retourne : { unusedKeys: [], missingKeys: [], usedKeys: [] }</span>
    </div>

    <h3 class="h3" id="mocks-disponibles">Mocks disponibles</h3>
    <p>
        Les mocks sont disponibles dans <span class="badge-code">tests/utils/mocks/</span> :
    </p>

    <h4 class="h4" id="window-mock">window-mock.js</h4>
    <p>
        Mock global pour window, document et navigator. Configuré automatiquement dans vitest.setup.js.
    </p>
    <div class="div-code">
        <span class="color-green">// Initialisation des mocks window</span><br />
        import { windowMock } from '@/tests/utils/mocks/window-mock.js'<br />
        <br />
        windowMock()
    </div>

    <h4 class="h4" id="dialog-mock">dialog-mock.js</h4>
    <p>
        Mock pour les éléments HTMLDialogElement avec les méthodes showModal() et close().
    </p>
    <div class="div-code">
        <span class="color-green">// Mock des fonctions de dialogue</span><br />
        import { initDialogFunctions } from '@/tests/utils/mocks/dialog-mock.js'<br />
        <br />
        const { showModalSpy, closeModalSpy } = initDialogFunctions()
    </div>

    <h4 class="h4" id="router-service-mock">router-service-mock.js</h4>
    <p>
        Mock pour le service de routage avec toutes les méthodes mockées.
    </p>
    <div class="div-code">
        <span class="color-green">// Utilisation du mock de service router</span><br />
        import { routerServiceMock } from '@/tests/utils/mocks/router-service-mock.js'<br />
        <br />
        <span class="color-green">// Utilise routerServiceMock.hasApiRoute, routerServiceMock.push, etc.</span>
    </div>

    <h4 class="h4" id="websocket-mock">websocket-mock.js</h4>
    <p>
        Mock pour WebSocket avec simulation des événements open, close et error.
    </p>
    <div class="div-code">
        <span class="color-green">// Mock WebSocket avec simulation d'événements</span><br />
        import { WebsocketMock } from '@/tests/utils/mocks/websocket-mock.js'<br />
        <br />
        const ws = new WebsocketMock('ws://localhost')<br />
        ws.simulateOpen() <span class="color-green">// Simule l'ouverture de connexion</span><br />
        ws.simulateClose() <span class="color-green">// Simule la fermeture de connexion</span><br />
        ws.simulateflash.error() <span class="color-green">// Simule une erreur</span>
    </div>

    <h4 class="h4" id="fs-mock">fs-mock.js</h4>
    <p>
        Mock pour les fonctions du système de fichiers Node.js.
    </p>
    <div class="div-code">
        <span class="color-green">// Mock des fonctions du système de fichiers</span><br />
        import { setupFsMocks } from '@/tests/utils/mocks/fs-mock.js'<br />
        <br />
        const fsMocks = await setupFsMocks()<br />
        fsMocks.existsSync.mockReturnValue(true)
    </div>

    <h4 class="h4" id="path-mock">path-mock.js</h4>
    <p>
        Mock pour les fonctions de manipulation de chemins Node.js.
    </p>
    <div class="div-code">
        <span class="color-green">// Mock des fonctions de manipulation de chemins</span><br />
        import { setupPathMocks } from '@/tests/utils/mocks/path-mock.js'<br />
        <br />
        const pathMocks = await setupPathMocks()<br />
        pathMocks.resolve.mockImplementation((...args) => args.join('/'))
    </div>

    <h3 class="h3" id="seeders-donnees">Seeders de données de test</h3>
    <p>
        Les seeders sont disponibles dans <span class="badge-code">tests/utils/seeders/</span> :
    </p>

    <h4 class="h4" id="users-seeder">users-seeder.js</h4>
    <p>
        Génère des données d'utilisateurs pour les tests.
    </p>
    <div class="div-code">
        <span class="color-green">// Génération de données d'utilisateurs</span><br />
        import { getUsers, getUser } from '@/tests/utils/seeders/users-seeder.js'<br />
        <br />
        <span class="color-green">// Génère un tableau d'utilisateurs</span><br />
        const users = getUsers(5) <span class="color-green">// 5 utilisateurs</span><br />
        <br />
        <span class="color-green">// Génère un utilisateur unique</span><br />
        const user = getUser({ groups: [groupData] })
    </div>

    <h4 class="h4" id="groups-seeder">groups-seeder.js</h4>
    <p>
        Génère des données de groupes pour les tests.
    </p>
    <div class="div-code">
        <span class="color-green">// Génération de données de groupes</span><br />
        import { getGroups, getGroup } from '@/tests/utils/seeders/groups-seeder.js'<br />
        <br />
        <span class="color-green">// Génère un tableau de groupes</span><br />
        const groups = getGroups(3) <span class="color-green">// 3 groupes</span><br />
        <br />
        <span class="color-green">// Génère un groupe unique avec relations</span><br />
        const group = getGroup({ users: [userData], levels: [levelData] })
    </div>

    <h4 class="h4" id="levels-seeder">levels-seeder.js</h4>
    <p>
        Fournit les niveaux d'accès prédéfinis.
    </p>
    <div class="div-code">
        <span class="color-green">// Récupération des niveaux prédéfinis</span><br />
        import { getLevels } from '@/tests/utils/seeders/levels-seeder.js'<br />
        <br />
        const levels = getLevels() <span class="color-green">// Retourne les 3 niveaux prédéfinis</span>
    </div>

    <h3 class="h3" id="configuration-vitest">Configuration Vitest</h3>
    <p>
        La configuration de test est définie dans <span class="badge-code">vitest.config.js</span> et <span class="badge-code">vitest.setup.js</span> :
    </p>
    <ul class="ml-25">
        <li>Environnement : jsdom</li>
        <li>Alias configuré : <span class="badge-code">@brugmann/vuemann/src</span></li>
        <li>Services automatiquement initialisés dans vitest.setup.js</li>
        <li>Plugins Vue Router et i18n configurés</li>
        <li>Mocks window automatiquement appliqués</li>
    </ul>

    <h3 class="h3" id="exemple-complet">Exemple de test complet</h3>
    <div class="div-code">
        <span class="color-green">// Exemple d'utilisation complète des utilitaires de test</span><br />
        import { describe, it, expect, beforeEach, afterEach } from 'vitest'<br />
        import { mount } from '@vue/test-utils'<br />
        import { initRouter } from '@/tests/utils/functions/utils.js'<br />
        import { triggerInput, triggerConfirm } from '@/tests/utils/functions/utils.js'<br />
        import { getUser } from '@/tests/utils/seeders/users-seeder.js'<br />
        import MyComponent from '@/components/MyComponent.vue'<br />
        <br />
        describe('MyComponent', () => {<br />
        &emsp;let wrapper<br />
        &emsp;let router<br />
        <br />
        &emsp;beforeEach(() => {<br />
        &emsp;&emsp;vi.useFakeTimers() <span class="color-green">// Obligatoire pour triggerInput</span><br />
        &emsp;&emsp;router = initRouter()<br />
        &emsp;&emsp;wrapper = mount(MyComponent, {<br />
        &emsp;&emsp;&emsp;global: {<br />
        &emsp;&emsp;&emsp;&emsp;plugins: [router]<br />
        &emsp;&emsp;&emsp;}<br />
        &emsp;&emsp;})<br />
        &emsp;})<br />
        <br />
        &emsp;afterEach(() => {<br />
        &emsp;&emsp;vi.useRealTimers() <span class="color-green">// Restaurer les timers réels</span><br />
        &emsp;})<br />
        <br />
        &emsp;it('should handle user input', async () => {<br />
        &emsp;&emsp;const testUser = getUser()<br />
        &emsp;&emsp;<br />
        &emsp;&emsp;await triggerInput(wrapper, '#user-input', testUser.username)<br />
        &emsp;&emsp;<br />
        &emsp;&emsp;expect(wrapper.find('#user-input').element.value).toBe(testUser.username)<br />
        &emsp;})<br />
        <br />
        &emsp;it('should confirm action', async () => {<br />
        &emsp;&emsp;await triggerConfirm(wrapper, 'button')<br />
        &emsp;&emsp;<br />
        &emsp;&emsp;expect(wrapper.emitted('confirmed')).toBeTruthy()<br />
        &emsp;})<br />
        })
    </div>
</template>
