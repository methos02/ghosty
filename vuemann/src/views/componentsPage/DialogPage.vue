<script setup>
import { ref } from "vue";
 import CodeHtml from "@brugmann/vuemann/src/components/codeHtml/CodeHtmlComponent.vue"
 import Dialog from "@brugmann/vuemann/src/components/DialogComponent.vue"

const dialog = ref()
const openDialog = () => dialog.value.show()
</script>

<template>
    <h1 class="h1"> Component Dialog </h1>
    <p class="my-10">
        Ce component permet de pouvoir utiliser l'élément html natif Dialog.
    </p>
    <h2 class="h2">Propriétés</h2>
    <table class="t-default">
        <thead>
            <tr>
                <th>Nom</th>
                <th>Type</th>
                <th>Required</th>
                <th>Default</th>
                <th>Description</th>
            </tr>
        </thead>
        <tbody>
        <tr>
            <td>title</td>
            <td>String</td>
            <td>-</td>
            <td>''</td>
            <td>
                Permet d'ajouter un titre dans le header du dialog.
            </td>
        </tr>
        <tr>
            <td>closeCross</td>
            <td>Boolean</td>
            <td>-</td>
            <td>true</td>
            <td>
                Si à true, affichera un icône pour fermer le dialog.
            </td>
        </tr>
        <tr>
            <td>closeBg</td>
            <td>Boolean</td>
            <td>-</td>
            <td>true</td>
            <td>
                Si à true, fermera le dialog au click sur l'arrière fond.
            </td>
        </tr>
        </tbody>
    </table>
    <h2 class="h2">Méthodes</h2>
    <!-- add -->
    <h4 class="h4"><i class="fa-solid fa-diamond mr-5"></i>show</h4>
    <p>
        Permet d'afficher le dialog.
    </p>
    <!-- close -->
    <h4 class="h4"><i class="fa-solid fa-diamond mr-5"></i>close</h4>
    <p>
        Permet de fermer le dialog.
    </p>
    <!-- toggle -->
    <h4 class="h4"><i class="fa-solid fa-diamond mr-5"></i>toggle</h4>
    <p>
        Permet de basculer l'état du dialog.
    </p>
    <table class="t-default">
        <thead>
            <tr>
                <th>Nom</th>
                <th>Type</th>
                <th>Required</th>
                <th>Description</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td>state</td>
                <td>Boolean</td>
                <td>-</td>
                <td>
                    True pour afficher et False pour le masquer
                </td>
            </tr>
        </tbody>
    </table>
    <h2 class="h2">Exemple</h2>
    <button 
        class="btn btn-primary"
        @click="openDialog"
    >
        Ouvrir le modal
    </button>
    <Dialog ref="dialog">
        <p>Dialog de test</p>
    </Dialog>
    <!-- eslint-disable -->
    <CodeHtml class="my-15">
        <scriptBalise v-pre>
            const dialog = ref() \n
            const openDialog = () => dialog.value.show()
        </scriptBalise>
        <template v-pre>
            <button @click="openDialog">
                ouvrir le modal
            </button>
            <Dialog ref="dialog">
                <span>Exemple de code HTML</span>
            </Dialog>
        </template>
    </CodeHtml>
    <!-- eslint-enable -->
    <h2 class="h2">Events</h2>
    <p>
        Le component Dialog émet deux évents
    </p>
    <ul class="list ml-25">
        <li>
            <span class="fw-700">dialog-show</span>: à l'ouvertue
        </li>
        <li>
            <span class="fw-700">dialog-hide</span>: à la fermeture
        </li>
    </ul>
</template>
