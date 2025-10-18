<script setup>
    import { onMounted, ref, watch } from 'vue';
    import { breadcrumb } from './breadcrumb-functions.js';
    import { servicesM } from '@brugmann/vuemann/src/services/services-manager.js';
    import { flash } from "@brugmann/vuemann/src/services/services-helper.js";
    import { breadcrumbPersist } from './src/breadcrumb-persist.js';

    const props = defineProps({
        type: {type: String, default: 'config'}
    })

    const route = servicesM.service('router:currentRoute')
    const links = ref(props.type === 'config' ? breadcrumb.init(route.value) : [])

    watch(() => route.value.path, () => {
        if(props.type !== 'config') { return }
        links.value = breadcrumb.init(route.value)
    });

    onMounted(() => {
        if(!breadcrumbPersist.isCurrentRoute(route.value.name)) { breadcrumbPersist.clean() }
        if(props.type === 'config') { return }

        links.value = breadcrumbPersist.get()
    })

    const manageLink = index => {
        if(props.type === 'config') { return }
        breadcrumbPersist.save(links.value.slice(0, index + 1))
        emit('breadcrumb-click', true)
    }

    const init = link => {
        breadcrumbPersist.clean(); 
        links.value = [];
        if(link === undefined) { return } 
        
        add(link)
    }

    const add = link => {
        if(props.type === 'config') { flash.errorT('breadcrumb.errors.type'); return }
        links.value.push(link)
        breadcrumbPersist.save(links.value, route.value.name)
    }

    const refresh = () => {
        if(props.type === 'config') { flash.errorT('breadcrumb.errors.type'); return }
        links.value = breadcrumbPersist.get()
    }

    defineExpose({ add, refresh, init })
    const emit = defineEmits(['breadcrumb-click']);
</script>

<template>
    <div 
        v-if="links.length > 1 || type === 'session'"
        class="breadcrumb-container"
    >
        <ul class="d-flex">
            <li 
                v-for="(link, index) in links"
                :key="link.label"
                class="breadcrumb-link"
            >
                <RouterLink 
                    v-if="link.route !== undefined && index !== links.length - 1"
                    :to="link.route" 
                    class="underline-hover color-neutral-800 color-primary-300-hover"
                    @click="manageLink(index)"
                >
                    {{ link.label }}
                </RouterLink>
                <span
                    v-if="link.route === undefined || index === links.length - 1"
                >
                    {{ link.label }}
                </span>
            </li>
        </ul>
    </div>
</template>
<style lang="scss">
.breadcrumb-container {
    .breadcrumb {
        &-link {
            &:not(:last-child)::after {
                content: "\f054";
                font-family: "Font Awesome 5 Free";
                font-size: 12px;
                font-weight: 900;
                margin-inline: 5px;
            }
        }
    }
}
</style>
