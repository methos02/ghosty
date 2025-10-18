<script setup>
 import Dropdown from "@brugmann/vuemann/src/components/DropdownComponent.vue"
 import Code from "@brugmann/vuemann/src/components/codeHtml/CodeHtmlComponent.vue"
import { ref } from "vue";

 const dropdown2 = ref()
 const dropdown2State = ref(false)
 const dropdown2Toggle = () => {
    dropdown2State.value = !dropdown2State.value
    dropdown2.value.toggle()
 }
</script>

<template>
    <h1 class="h1">Dropdown</h1>
    <p class="my-10">
        Ce component permet de pouvoir utiliser l'élément html natif Dropdown.
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
                <td>classes</td>
                <td>String</td>
                <td>-</td>
                <td>''</td>
                <td>
                    Permet d'ajouter des classes au dropdown.
                </td>
            </tr>
            <tr>
                <td>orientation</td>
                <td>String</td>
                <td>-</td>
                <td>''</td>
                <td>
                    Permet d'ajouter des classes au dropdown.
                </td>
            </tr>
            <tr>
                <td>autoToggle</td>
                <td>Boolean</td>
                <td>-</td>
                <td>true</td>
                <td>
                    Permet de gérer l'état du dropdown automatiquement.
                </td>
            </tr>
            </tbody>
    </table>
    <h2 class="h2">Méthodes</h2>
    <!-- show -->
    <h4 class="h4"><i class="fa-solid fa-diamond mr-5"></i>show</h4>
    <p>
        Permet d'ouvrir le dropdown.
    </p>
    <!-- hide -->
    <h4 class="h4"><i class="fa-solid fa-diamond mr-5"></i>hide</h4>
    <p>
        Permet de fermer le dropdown.
    </p>
    <!-- toggle -->
    <h4 class="h4"><i class="fa-solid fa-diamond mr-5"></i>toggle</h4>
    <p>
        Permet de changer l'état du dropdown.
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
                    True pour ouvrir et False pour fermer
                </td>
            </tr>
        </tbody>
    </table>
    <h2 class="h2"> Cas classique </h2>
    <Code>
        <Dropdown classes="left" v-pre>
            <template v-slot:button >
                <button class="btn btn-primary">Click me</button>
            </template>
            <template v-slot:items>
                <ul class="f-column g-5">
                    <li>item 1</li>
                    <li>item 2</li>
                    <li>item 3</li>
                </ul>
            </template>
        </Dropdown>
    </Code>
    <div class="d-flex">
        <Dropdown classes="left">
            <template v-slot:button >
                <button class="btn btn-primary">Click me</button>
            </template>
            <template v-slot:items>
                <ul class="f-column g-5">
                    <li>item 1</li>
                    <li>item 2</li>
                    <li>item 3</li>
                </ul>
            </template>
        </Dropdown>
    </div>
    <h2 class="h2">Dropdown toggle désactivé</h2>
    <p>
        Votre attribut @click doit être préfixé par .stop pour éviter la fermeture automatique du dropdown lorsque l'on clique en dehors. 
    </p>
    <div class="d-flex">
        <Dropdown 
            ref="dropdown2" 
            classes="left"
            :autoToggle="false"
        >
            <template v-slot:button >
                <button class="btn btn-primary">Toggle disabled</button>
            </template>
            <template v-slot:items>
                <ul class="f-column g-5">
                    <li>item 1</li>
                    <li>item 2</li>
                    <li>item 3</li>
                </ul>
            </template>
        </Dropdown>
        <button
            class="ml-25"
            @click.stop="dropdown2Toggle"
        >
            {{ dropdown2State ? 'Close me!' : 'Open me!' }} 
        </button>
    </div>
    <h2 class="h2">Events</h2>
    <p>
        L'évènement <span class="badge-code">show</span> est déclenché lorsque le dropdown est ouvert. <br />
        L'évènement <span class="badge-code">hide</span> est déclenché lorsque le dropdown est fermé.
    </p>
    <Code>
        <Dropdown 
            v-pre
            @show="show" 
            @hide="hide"
        >
            <template v-slot:button >
                <button class="btn btn-primary">Click me</button>
            </template>
            <template v-slot:items>
                <ul class="f-column g-5">
                    <li>item 1</li>
                </ul>
            </template>
        </Dropdown>
    </Code>
</template>
