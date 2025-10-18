<script setup>
    import CodeHtml from "@brugmann/vuemann/src/components/codeHtml/CodeHtmlComponent.vue"
    import Loader from "@brugmann/vuemann/src/components/LoaderComponent.vue";

    const DELAY_MS = 1000;
    const loaderCallback = async () => {
    await new Promise((resolve) => setTimeout(resolve, DELAY_MS));
  }
</script>

<template>
    <h1 class="h1"> Loader </h1>
    <p class="my-10">
        Ce component permet d'afficher un loader le temps qu'une action qui prend du temps se déroute.
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
                <td>type</td>
                <td>String</td>
                <td>-</td>
                <td>bars</td>
                <td>
                   Permet de préciser le type de loader que l'on veut. <br />                   
                   Possibilité: bars, icon
                </td>
            </tr>
            <tr>
                <td class="pl-5">cb</td>
                <td>Function</td>
                <td>Si click est absent</td>
                <td>-</td>
                <td class="py-5">
                    Fonction à appeler lorsque l'on appel la méthode runCallBack.
                </td>
            </tr>
            <tr>
                <td class="pl-5">click</td>
                <td>Function</td>
                <td>Si cb est absent</td>
                <td>-</td>
                <td class="py-5">
                    Fonction à appeler lors du clic sur la confirmation.
                </td>
            </tr>
            <tr>
                <td>params</td>
                <td>Array</td>
                <td>-</td>
                <td>[]</td>
                <td>
                    Paramètres à passer à la fonction de callback.
                </td>
            </tr>
            <tr>
                <td>params</td>
                <td>Array</td>
                <td>-</td>
                <td>[]</td>
                <td>
                    Paramètres à passer à la fonction de callback.
                </td>
            </tr>
            <tr>
                <td>infinite</td>
                <td>Boolean</td>
                <td>-</td>
                <td>false</td>
                <td>
                    Si true, laissera afficher le loader même si l'action est terminé. 
                    Pratique pour les rechargements de page ou redirection.
                </td>
            </tr>
            <tr>
                <td>infinite</td>
                <td>Boolean</td>
                <td>-</td>
                <td>false</td>
                <td>
                    Si true, laissera afficher le loader même si l'action est terminé. 
                    Pratique pour les rechargements de page ou redirection.
                </td>
            </tr>
            <tr>
                <td>buttonClasses</td>
                <td>String</td>
                <td>-</td>
                <td>
                    type bars : btn btn-primary <br />                    
                    type icon : null
                </td>
                <td>
                    Classes du bouton. 
                </td>
            </tr>
            <tr>
                <td>buttonType</td>
                <td>String</td>
                <td>-</td>
                <td>button</td>
                <td>
                    Type du bouton .
                </td>
            </tr>
        </tbody>
    </table>
    <h3 class="h3">Méthodes</h3>
    <!-- add -->
    <h4 class="h4"><i class="fa-solid fa-diamond mr-5"></i>setLoad</h4>
    <p>
        Permet d'afficher ou cacher le loader.
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
                <th>Required</th>
                <td>
                    True pour afficher et False pour le masquer
                </td>
            </tr>
        </tbody>
    </table>
    <!-- refresh -->
    <h4 class="h4"><i class="fa-solid fa-diamond mr-5"></i>runCallBack</h4>
    <p>
        Permet d'éxécuter la fonction passé en paramètre.
    </p>
    <h2 class="h2">Exemple</h2>
    <div class="d-flex j-start a-center g-15">
        <Loader 
            :click="loaderCallback" 
        > 
            
            Afficher le loader
        </Loader>
        <Loader 
            :click="loaderCallback" 
            type="icon"
        > 
            <i class="fa-solid fa-face-smile color-primary color-primary-300-hover"></i>
        </Loader>
    </div>
    <h2 class="h2">Code</h2>
    <CodeHtml>
        <scriptBalise v-pre>
            import Loader from "@brugmann/vuemann/src/components/LoaderComponent.vue";
        </scriptBalise>
        <template v-pre>
            <Loader 
                :click="loaderCallback" 
            > 
                Afficher le loader
            </Loader>
            <Loader 
                :click="loaderCallback" 
                type="icon"
            > 
                <i class="fa-solid fa-face-smile color-primary color-primary-300-hover"></i>
            </Loader>
        </template>
  </CodeHtml>
</template>
<style lang="scss">
[data-loader="icon"] i {
    font-size: 1.4rem;
}
</style>
