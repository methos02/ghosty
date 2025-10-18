/* eslint-disable max-lines */

import Home from "@brugmann/vuemann/src/views/HomePage.vue";

export const routes = [
    {
        path: "/",
        name: "home",
        component: Home,
    },
    {
        path: "/api",
        meta: {
            breadcrumb : { label : 'API', route : 'api' }
        },
        children: [
            {
                path: "",
                name: "api",
                component: () => import("@brugmann/vuemann/src/views/ApiPage.vue"),
                meta: {
                    title : 'API - Vuemann',
                    sidebar: {
                        icon: 'fa-solid fa-plug',
                        label: 'v_api_page',
                        order: 1
                    }
                },
            },
            {
                path: "users",
                meta: {
                    breadcrumb : { label : 'Users API', route: 'api.users' }
                },
                children: [
                    {
                        path: "",
                        name: "api.users",
                        component: () => import("@brugmann/vuemann/src/views/apiPage/UsersApiPage.vue"),
                        meta: {
                            title : 'API Users - Vuemann'
                        },
                    },
                    {
                        path: "search",
                        name: "api.users.search",
                        component: () => import("@brugmann/vuemann/src/views/apiPage/UserSearchPage.vue"),
                        meta: {
                            title : 'UserSearch Component - Vuemann',
                            breadcrumb : { label : 'UserSearch' }
                        },
                    }
                ]
            }
        ]
    },
    {
        path: "/commands",
        meta: {
            breadcrumb : { label : 'Loader', route : 'commands' }
        },
        children: [
            {
                path: "",
                name: "commands",
                component: () => import("@brugmann/vuemann/src/views/CommandsPage.vue"),
                meta: {
                    title : 'Commands - Vuemann',
                    sidebar: {
                        icon: 'fa-solid fa-terminal',
                        label: 'v_commands_page',
                        order: 2
                    }
                },
            },
            {
                path: "init-api",
                name: "commands.initApi",
                component: () => import("@brugmann/vuemann/src/views/commandsPage/InitApiPage.vue"),
                meta: {
                    title : 'Init Api - Vuemann',
                    breadcrumb : { label : 'Init Api' }
                },
            }
        ]
    },
    {
        path: "/components",
        meta: {
            breadcrumb : { label : 'Components', route : 'components' }
        },
        children: [
            {
                path: "",
                name: "components",
                component: () => import("@brugmann/vuemann/src/views/ComponentsPage.vue"),
                meta: {
                    title : 'Components - Vuemann',
                    sidebar: {
                        icon: 'fa-solid fa-boxes-stacked',
                        label: 'v_component_page',
                        order: 3
                    }
                },
            },
            {
                path: "breadcrumb",
                name: "components.breadcrumb",
                component: () => import("@brugmann/vuemann/src/views/componentsPage/BreadcrumbPage.vue"),
                meta: {
                    title : "File d'ariane - Vuemann",
                    breadcrumb : { label : "File d'ariane" }
                },
            },
            {
                path: "code-html",
                name: "components.code",
                component: () => import("@brugmann/vuemann/src/views/componentsPage/CodeHtmlPage.vue"),
                meta: {
                    title : 'Code-html - Vuemann',
                    breadcrumb : { label : 'Code Html' }
                },
            },
            {
                path: "confirm-icon",
                name: "components.confirm-icon",
                component: () => import("@brugmann/vuemann/src/views/componentsPage/ConfirmIconPage.vue"),
                meta: {
                    title : 'Confirm Icon - Vuemann',
                    breadcrumb : { label : 'Confirm Icon' }
                },
            },
            {
                path: "confirm-button",
                name: "components.confirm-button",
                component: () => import("@brugmann/vuemann/src/views/componentsPage/ConfirmButtonPage.vue"),
                meta: {
                    title : 'Confirm Button - Vuemann',
                    breadcrumb : { label : 'Confirm Button' }
                },
            },
            {
                path: "dialog",
                name: "components.dialog",
                component: () => import("@brugmann/vuemann/src/views/componentsPage/DialogPage.vue"),
                meta: {
                    title : 'Dialog - Vuemann',
                    breadcrumb : { label : 'Dialog' }
                },
            },
            {
                path: "dropdown",
                name: "components.dropdown",
                component: () => import("@brugmann/vuemann/src/views/componentsPage/DropdownPage.vue"),
                meta: {
                    breadcrumb : { label : 'Dropdown' }
                },
            },
            {
                path: "header",
                name: "components.header",
                component: () => import("@brugmann/vuemann/src/views/componentsPage/HeaderPage.vue"),
                meta: {
                    title : 'Header - Vuemann',
                    breadcrumb : { label : 'Header' }
                },
            },
            {
                path: "loader",
                name: "components.loader",
                component: () => import("@brugmann/vuemann/src/views/componentsPage/LoaderPage.vue"),
                meta: {
                    breadcrumb : { label : 'Loader' }
                },
            },
            {
                path: "paginator",
                name: "components.paginator",
                component: () => import("@brugmann/vuemann/src/views/componentsPage/PaginatorPage.vue"),
                meta: {
                    title : 'Paginator - Vuemann',
                    breadcrumb : { label : 'Paginator' }
                },
            },
            {
                path: "changelog",
                name: "components.changelog",
                component: () => import("@brugmann/vuemann/src/views/componentsPage/ChangelogPage.vue"),
                meta: {
                    title : 'Changelog - Vuemann',
                    breadcrumb : { label : 'Changelog' }
                },
            }
        ]
    },
    {
        path: "/config",
        meta: {
            breadcrumb : { label : 'Config', route : 'config' }
        },
        children: [
            {
                path: "",
                name: "config",
                component: () => import("@brugmann/vuemann/src/views/ConfigPage.vue"),
                meta: {
                    title : 'Config - Vuemann',
                    sidebar: {
                        icon: 'fa-solid fa-gears',
                        label: 'v_config_page',
                        order: 4
                    }
                },
            },
            {
                path: "app",
                name: "config.app",
                component: () => import("@brugmann/vuemann/src/views/configPage/AppConfigComponent.vue"),
                meta: {
                    title : 'AppConfig - Vuemann',
                    breadcrumb : { label : 'AppConfig' }
                },
            },
            {
                path: "config-loader",
                name: "config.loader",
                component: () => import("@brugmann/vuemann/src/views/configPage/ConfigLoaderComponent.vue"),
                meta: {
                    title : 'ConfigLoader - Vuemann',
                    breadcrumb : { label : 'ConfigLoader' }
                },
            },
        ]
    },
    {
        path: "/css",
        meta: {
            breadcrumb : { label : 'Css', route: 'css'}
        },
        children: [
            {
                path: "",
                name: "css",
                component: () => import("@brugmann/vuemann/src/views/CssPage.vue"),
                meta: {
                    title : 'Css - Vuemann',
                    sidebar: {
                        icon: 'fa-solid fa-paintbrush',
                        label: 'v_css_page',
                        order: 5
                    },
                },
            },
            {
                path: "variables",
                name: "css.variables",
                component: () => import("@brugmann/vuemann/src/views/cssPage/VariablesCssPage.vue"),
                meta: {
                    title : 'Variables - Vuemann',
                    breadcrumb : { label : 'Variables' }
                }
            },
            {
                path: "button",
                name: "css.button",
                component: () => import("@brugmann/vuemann/src/views/cssPage/ButtonCssPage.vue"),
                meta: {
                    title : 'Buttons - Vuemann',
                    breadcrumb : { label : 'Button' }
                }
            },
            {
                path: "color",
                name: "css.color",
                component: () => import("@brugmann/vuemann/src/views/cssPage/ColorCssPage.vue"),
                meta: {
                    title : 'Couleurs - Vuemann',
                    breadcrumb : { label : 'Couleur' }
                }
            },
            {
                path: "display",
                name: "css.display",
                component: () => import("@brugmann/vuemann/src/views/cssPage/DisplayCssPage.vue"),
                meta: {
                    title : 'Display - Vuemann',
                    breadcrumb : { label : 'Display' }
                }
            },
            {
                path: "globals",
                name: "css.globals",
                component: () => import("@brugmann/vuemann/src/views/cssPage/GlobalsCssPage.vue"),
                meta: {
                    title : 'Globals - Vuemann',
                    breadcrumb : { label : 'Css global' }
                }
            },
            {
                path: "inputs",
                name: "css.inputs",
                component: () => import("@brugmann/vuemann/src/views/cssPage/InputsCssPage.vue"),
                meta: {
                    title : 'Inputs - Vuemann',
                    breadcrumb : { label : 'inputs' }
                }
            },
            {
                path: "forms",
                name: "css.forms",
                component: () => import("@brugmann/vuemann/src/views/cssPage/FormsCssPage.vue"),
                meta: {
                    title : 'Forms - Vuemann',
                    breadcrumb : { label : 'Formulaires' }
                }
            },
            {
                path: "links",
                name: "css.links",
                component: () => import("@brugmann/vuemann/src/views/cssPage/LinkCssPage.vue"),
                meta: {
                    title : 'Liens - Vuemann',
                    breadcrumb : { label : 'Liens' }
                }
            },
            {
                path: "loader",
                name: "css.loader",
                component: () => import("@brugmann/vuemann/src/views/cssPage/LoaderCssPage.vue"),
                meta: {
                    title : 'Loader - Vuemann',
                    breadcrumb : { label : 'Loader' }
                }
            },
            {
                path: "titles",
                name: "css.titles",
                component: () => import("@brugmann/vuemann/src/views/cssPage/TitleCssPage.vue"),
                meta: {
                    title : 'Titres - Vuemann',
                    breadcrumb : { label : 'Titres' }
                }
            },
            {
                path: "table",
                name: "css.table",
                component: () => import("@brugmann/vuemann/src/views/cssPage/TableCssPage.vue"),
                meta: {
                    title : 'Table - Vuemann',
                    breadcrumb : { label : 'Tableau' }
                }
            },
            {
                path: "badges",
                name: "css.badges",
                component: () => import("@brugmann/vuemann/src/views/cssPage/BadgesCssPage.vue"),
                meta: {
                    title : 'Badges - Vuemann',
                    breadcrumb : { label : 'Badges' }
                }
            },
        ]
    },
    {
        path: "/debug",
        meta: {
            breadcrumb : { label : 'Debug' }
        },
        children: [
            {
                path: "",
                name: "debug",
                component: () => import("@brugmann/vuemann/src/views/DebugPage.vue"),
                meta: {
                    title : 'Debug - Vuemann',
                    sidebar: {
                        icon: 'fa-solid fa-bug',
                        label : 'v_debug',
                        order: 6
                    }
                },
            }
        ]
    },
    {
        path: "/services",
        meta: {
            breadcrumb : { label : 'Services', route: 'services' }
        },
        children: [
            {
                path: "",
                name: "services",
                component: () => import("@brugmann/vuemann/src/views/ServicesPage.vue"),
                meta: {
                    title : 'Service manager - Vuemann',
                    sidebar: {
                        icon: 'fa-solid fa-bell-concierge',
                        label: 'v_services_page',
                        order: 7
                    } ,
                },
            },
            {
                path: "ajax",
                name: "services.ajax",
                component: () => import("@brugmann/vuemann/src/views/servicesPage/AjaxPage.vue"),
                meta: {
                    title : 'Ajax - Vuemann',
                    breadcrumb : { label : 'Ajax' }
                },
            },
            {
                path: "auth",
                name: "services.auth",
                component: () => import("@brugmann/vuemann/src/views/servicesPage/AuthPage.vue"),
                meta: {
                    title : 'Auth - Vuemann',
                    breadcrumb : { label : 'Auth' }
                },
            },
            {
                path: "flash",
                name: "services.flash",
                component: () => import("@brugmann/vuemann/src/views/servicesPage/FlashPage.vue"),
                meta: {
                    title : 'Flash - Vuemann',
                    breadcrumb : { label : 'Flash' }
                },
            },
            {
                path: "form",
                meta: {
                    breadcrumb : { label : 'Form', route: 'services.form' }
                },
                children: [
                    {
                        path: "",
                        name: "services.form",
                        component: () => import("@brugmann/vuemann/src/views/servicesPage/FormPage.vue"),
                        meta : {
                            title : 'Form - Vuemann',
                        }
                    },
                    {
                        path: "inputs",
                        meta: {
                            breadcrumb : { label : 'Inputs', route: 'services.form.inputs' }
                        },
                        children: [
                            {
                                path: "",
                                name: "services.form.inputs",
                                component: () => import("@brugmann/vuemann/src/views/servicesPage/form/InputsPage.vue"),
                                meta: {
                                    title : 'Inputs - Vuemann',
                                },
                            },
                            {
                                path: "input",
                                name: "services.form.inputs.input",
                                component: () => import("@brugmann/vuemann/src/views/servicesPage/form/inputs/InputComponentPage.vue"),
                                meta: {
                                    title : 'Input - Vuemann',
                                    breadcrumb : { label : 'Input' }
                                },
                            },
                            {
                                path: "select",
                                name: "services.form.inputs.select",
                                component: () => import("@brugmann/vuemann/src/views/servicesPage/form/inputs/SelectComponentPage.vue"),
                                meta: {
                                    title : 'Select - Vuemann',
                                    breadcrumb : { label : 'Select' }
                                },
                            },
                            
                            {
                                path: "textarea",
                                name: "services.form.inputs.textarea",
                                component: () => import("@brugmann/vuemann/src/views/servicesPage/form/inputs/TextareaComponentPage.vue"),
                                meta: {
                                    title : 'Textarea Component - Vuemann',
                                    breadcrumb : { label : 'Textarea' }
                                },
                            },
                            
                            {
                                path: "input-search",
                                name: "services.form.inputs.input-search",
                                component: () => import("@brugmann/vuemann/src/views/servicesPage/form/inputs/InputSearchComponentPage.vue"),
                                meta: {
                                    title : 'Input Search - Vuemann',
                                    breadcrumb : { label : 'Input Search' }
                                },
                            },
                            
                            {
                                path: "switch",
                                name: "services.form.inputs.switch",
                                component: () => import("@brugmann/vuemann/src/views/servicesPage/form/inputs/SwitchComponentPage.vue"),
                                meta: {
                                    title : 'Switch - Vuemann',
                                    breadcrumb : { label : 'Switch' }
                                },
                            },
                            {
                                path: "input-date",
                                name: "services.form.inputs.input-date",
                                component: () => import("@brugmann/vuemann/src/views/servicesPage/form/inputs/InputDateComponentPage.vue"),
                                meta: {
                                    title : 'Input Date - Vuemann',
                                    breadcrumb : { label : 'Input Date' }
                                },
                            },
                        ],
                    },
                    {
                        path: "defaultTests",
                        name: "services.form.defaultTests",
                        component: () => import("@brugmann/vuemann/src/views/servicesPage/form/DefaultTestsPage.vue"),
                        meta: {
                            title : 'Tests par Défaut - Vuemann',
                            breadcrumb : { label : 'Tests par Défaut' }
                        },
                    },
                ]
            },
            {
                path: "locale",
                name: "services.locale",
                component: () => import("@brugmann/vuemann/src/views/servicesPage/LocalePage.vue"),
                meta: {
                    title : 'Locale - Vuemann',
                    breadcrumb : { label : 'Locale' }
                }
            },
            {
                path: "log",
                name: "services.log",
                component: () => import("@brugmann/vuemann/src/views/servicesPage/LogPage.vue"),
                meta: {
                    title : 'Log - Vuemann',
                    breadcrumb : { label : 'Log' }
                }
            },
            {
                path: "router",
                name: "services.router",
                component: () => import("@brugmann/vuemann/src/views/servicesPage/RouterPage.vue"),
                meta: {
                    title : 'Router - Vuemann',
                    breadcrumb : { label : 'Router' }
                }
            },
            {
                path: "utils",
                name: "services.utils",
                component: () => import("@brugmann/vuemann/src/views/servicesPage/UtilsPage.vue"),
                meta: {
                    title : 'Utils - Vuemann',
                    breadcrumb : { label : 'Utils' }
                }
            },
            {
                path: "websocket",
                name: "services.websocket",
                component: () => import("@brugmann/vuemann/src/views/servicesPage/WebsocketPage.vue"),
                meta: {
                    title : 'Websocket - Vuemann',
                    breadcrumb : { label : 'Websocket' }
                }
            },
        ]
    },
    {
        path: "/helpers",
        meta: {
            breadcrumb : { label : 'Helpers', route: 'helpers' }
        },
        children: [
            {
                path: "",
                name: "helpers",
                component: () => import("@brugmann/vuemann/src/views/HelpersPage.vue"),
                meta: {
                    title : 'Helpers - Vuemann',
                    sidebar: {
                        icon: 'fa-solid fa-screwdriver-wrench',
                        label: 'v_helpers_page',
                        order: 8
                    } ,
                },
            },
            {
                path: "date",
                name: "helpers.date",
                component: () => import("@brugmann/vuemann/src/views/helpersPage/DateHelperPage.vue"),
                meta: {
                    title : 'Date Helper - Vuemann',
                    breadcrumb : { label : 'Date Helper' }
                },
            },
            {
                path: "paginator",
                name: "helpers.paginator",
                component: () => import("@brugmann/vuemann/src/views/helpersPage/PaginatorHelperPage.vue"),
                meta: {
                    title : 'Paginator Helper - Vuemann',
                    breadcrumb : { label : 'Paginator Helper' }
                },
            },
            {
                path: "utils",
                name: "helpers.utils",
                component: () => import("@brugmann/vuemann/src/views/helpersPage/UtilsHelperPage.vue"),
                meta: {
                    title : 'Utils Helper - Vuemann',
                    breadcrumb : { label : 'Utils Helper' }
                },
            },
        ]
    },
    {
        path: "/changelog",
        name: "changelog", 
        component: () => import("@brugmann/vuemann/src/views/ChangelogPage.vue"),
        meta: {
            title : 'Liste des modifications - Vuemann'
        }
    },
]
