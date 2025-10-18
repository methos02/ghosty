<script setup>
 import CodeHtml from "@brugmann/vuemann/src/components/codeHtml/CodeHtmlComponent.vue"
</script>

<template>
    <h1 class="h1"> Component Balise Code Html </h1>
    <p class="my-10">
        Ce component permet d'afficher du code Html sans que ce dernier ne soit interprété. Il offre aussi la possibilité de copier le code pour le réutiliser plus facilement.
    </p>
    <p class="color-danger d-flex g-10 a-center">
        <i class="fa-solid fa-triangle-exclamation"></i>
        <span>Le code doit être du HTML correcte.</span>
        <i class="fa-solid fa-triangle-exclamation"></i>
    </p>
    <h2 class="h2">Balise non-native</h2>
    <p class="mb-10">
        Pour éviter d'avoir un avertissement dans la console, vous devez ajouter 
        l'attribut <span class="badge-code">v-pre</span> a cette balise.<br />        Si plusieurs balises non-natives sont imbriquées, l'attribut ne doit être rajouter que dans la balise parente.
    </p>
    <p class="color-danger d-flex g-10 a-center">
        <i class="fa-solid fa-triangle-exclamation"></i>
        <span>
            Les balise scripte et img ne peut être utiliser dans ce composant. C'est pour cela que dans l'exemple ci-dessous 
            elles ont été remplacées par scriptBalise et ImgBalise
        </span>
        <i class="fa-solid fa-triangle-exclamation"></i>
    </p>
    <CodeHtml class="my-15">
        <scriptBalise v-pre>
            import CodeHtml from "@brugmann/vuemann/src/components/codeHtml/CodeHtmlComponent.vue"
        </scriptBalise>
        <template v-pre>
            <ImgBalise src="..." />
            <CodeHtml>
                Exemple de code HTML
            </CodeHtml>
        </template>
    </CodeHtml>  
</template>
