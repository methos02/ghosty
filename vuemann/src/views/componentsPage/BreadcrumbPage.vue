<script setup>
    import Breadcrumb from "@brugmann/vuemann/src/components/breadcrumb/BreadcrumbComponent.vue"
    import CodeHtml from "@brugmann/vuemann/src/components/codeHtml/CodeHtmlComponent.vue"
    import { ref } from "vue";
    import { breadcrumbPersist } from "@brugmann/vuemann/src/components/breadcrumb/src/breadcrumb-persist.js";

    const breadcrumb = ref()
    const addLink = () => {
        const pageCount = breadcrumbPersist.get().length + 1
        breadcrumb.value.add({label: `Page ${pageCount}`, route: "components.breadcrumb"})
    }

    const refreshBreadcrumb = () => {
        breadcrumb.value.refresh()
    }
</script>

<template>
    <h1 class="h1"> File d'ariane </h1>
    <p class="my-10">
        Ce component permet d'afficher facilement un file d'ariane. Vous avez deux possibilités pour l'utiliser. Soit via le fichier 
        <router-link :to="{name: 'config'}" class="underline link-underline">fichiers de configuration</router-link> 
        soit de mannière dynamique.
    </p>
    <h2 class="h2">Type config</h2>
    <p>
        En ajoutant la clé <span class="badge-code">breadcrumb</span> dans les métas d'une route, vous pouvez facilement configurer votre file d'ariane. 
        Vuemann remontrat l'arborescence de la route. La clé <span class="badge-code">breadcrumb</span> des pages parentes doivent contenir deux informations, 
        <span class="badge-code">name</span> (le nom à afficher dans le file) et <span class="badge-code">route</span> (la route à utiliser pour le lien). Si 
        il sagit d'une page sans enfant, juste l'attribut <span class="badge-code">name</span> est utilisé.
    </p>
    <h3 class="h3">configuration par arborescence</h3>
    <div class="div-code">
        {<br />        &emsp;path: "/components",<br />        &emsp;meta: {<br />        &emsp;&emsp;breadcrumb : { name : 'Components', route : 'components' }<br />        &emsp;},<br />        &emsp;children: [<br />        &emsp;&emsp;{<br />        &emsp;&emsp;&emsp;path: "",<br />        &emsp;&emsp;&emsp;name: "components",<br />        &emsp;&emsp;&emsp;component : ComponentsPageComponent,<br />        &emsp;&emsp;},<br />        &emsp;&emsp;{<br />        &emsp;&emsp;&emsp;path: "breadcrumb",<br />        &emsp;&emsp;&emsp;name: "components.breadcrumb",<br />        &emsp;&emsp;&emsp;component: BreadcrumbPageComponent,<br />        &emsp;&emsp;&emsp;meta: {<br />        &emsp;&emsp;&emsp;&emsp;breadcrumb : { name : "File d'ariane" }<br />        &emsp;&emsp;&emsp;},<br />        &emsp;&emsp;},<br />        &emsp;&emsp;{<br />        &emsp;&emsp;&emsp;path: "code-html",<br />        &emsp;&emsp;&emsp;name: "components.code",<br />        &emsp;&emsp;&emsp;component: CodeHtmlPageComponent,<br />        &emsp;&emsp;&emsp;meta: {<br />        &emsp;&emsp;&emsp;&emsp;breadcrumb : { name : 'Code Html' }<br />        &emsp;&emsp;&emsp;},<br />        &emsp;&emsp;},<br />        &emsp;]<br />        }
    </div>
    <p>
        Dans l'exemple ci-dessus, vous pouvez voir que l'option breadcrumb pour les routes <span class="badge-code">components.breadcrumb</span> 
        et <span class="badge-code">components.code</span> ne comporte que l'attribut nom. 
    </p>
    <p>
        <i class="fa-solid fa-triangle-exclamation color-danger mr-5"></i>
        la configuration pour la route avec le path <span class="badge-code">"/components"</span> au même niveau et non dans la route 
        enfant avec le path <span class="badge-code">""</span>
        <i class="fa-solid fa-triangle-exclamation color-danger ml-5"></i>
    </p>
    <h3 class="h3">configuration parents</h3>
    <p>
        Vous pouvez si le file d'ariane ne doit pas suivre l'orborescance du fichier <span class="badge-code">route-config</span>, vous pouvez spécifier 
        les routes à utiliser.
    </p>
    <div class="div-code">
        {<br />        &emsp;path: "/components",<br />        &emsp;name: "components",<br />        &emsp;component : ComponentsPageComponent,<br />        &emsp;meta: {<br />        &emsp;&emsp;breadcrumb : { <br />        &emsp;&emsp;&emsp;label : 'Components' <br />        &emsp;&emsp;&emsp;parents : [<br />        &emsp;&emsp;&emsp;&emsp;{ label: 'parent_1', route : 'parent1' }<br />        &emsp;&emsp;&emsp;&emsp;{ label: 'parent_1', route : 'parent2' }<br />        &emsp;&emsp;&emsp;] <br />        &emsp;&emsp;}<br />        &emsp;},<br />        }
    </div>
    <h3 class="h3">Code</h3>
    <CodeHtml class="my-15">
        <scriptBalise v-pre>
            import CodeHtml from "@brugmann/vuemann/src/components/breadcrumb/BreadcrumbComponent.vue"
        </scriptBalise>
        <template v-pre>
            <Breadcrumb />
        </template>
    </CodeHtml>
    <h2 class="h2">Type Session</h2>
    <p class="mb-10">
        Dans certain cas, le fichier de configuration ne sera pas suffisant pour afficher les pages souhaitées, notamment pour les pages récursives. 
        En passant le paramètre <span class="badge-code">type="session"</span> vous aurez accès à des méthodes pour manipuler dynamiquement votre 
        file d'ariane.
    </p>
    <h3 class="h3">Méthodes</h3>
    <!-- add -->
    <h4 class="h4"><i class="fa-solid fa-diamond mr-5"></i>add</h4>
    <p>
        Permet d'ajouter un lien au file d'ariane.
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
                <td>link</td>
                <td>Object</td>
                <th>Required</th>
                <td>
                    objet route <span class="badge-code"> {name: label dans le file , route: nom de la route, params: paramètre de la route si présent}</span>
                </td>
            </tr>
            <tr>
                <td>routeName</td>
                <td>String</td>
                <td>-</td>
                <td>
                    Si présent, mettra à jour le sessionStorage
                </td>
            </tr>
        </tbody>
    </table>
    <!-- refresh -->
    <h4 class="h4"><i class="fa-solid fa-diamond mr-5"></i>refresh</h4>
    <p>
        Permet de loader la session storage pour rafraichir le rendu html.
    </p>
    <h3 class="h3">Exemple</h3>
    <div class="breadcrumb-exemple">
        <Breadcrumb 
            @breadcrumb-click="refreshBreadcrumb" 
            type="session" 
            ref="breadcrumb" 
        />
    </div>
    <div class="d-flex a-center g-15">
        <button
            class="btn btn-primary"
            @click="addLink"
        >
            Ajouter un lien
        </button>
        <p>
            Cliquez sur un lien du file d'ariane pour simuler une navigation.
        </p>
    </div>
    <h3 class="h3">Code</h3>
    <CodeHtml class="my-15">
        <scriptBalise v-pre>
            import CodeHtml from "@brugmann/vuemann/src/components/breadcrumb/BreadcrumbComponent.vue" \n
            const breadcrumb = ref() \n
            \n
            //utilisation des méthodes \n
            breadcrumb.value.add({name:'Page Breadcrumb', route: 'components.breadcrumb'}) \n 
            breadcrumb.value.refresh()    
        </scriptBalise>
        <template v-pre>
            <Breadcrumb
                ref="breadcrumb"
            />
        </template>
    </CodeHtml>
</template>
<style lang="scss">
.breadcrumb {
    &-exemple {
        height: 25px;
    }
}
</style>
