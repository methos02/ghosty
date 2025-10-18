import {describe, expect, it, beforeEach, vi, afterEach} from "vitest";
import { mount } from "@vue/test-utils";
import Header from "@brugmann/vuemann/src/components/HeaderComponent.vue";
import {createPinia, setActivePinia} from "pinia";
import { ConfigLoader } from "@brugmann/vuemann/src/config/config-loader.js";
import { localeFunctions } from "@brugmann/vuemann/src/services/locale/src/locale-functions.js";
import { currentUser } from "@brugmann/vuemann/src/services/auth/src/models/current-user.js";
import { servicesM } from "@brugmann/vuemann/src/services/services-manager.js";
import { getRouter } from "@brugmann/vuemann/src/services/router/init/router-plugin.js";

// Mock window.scrollTo pour jsdom
Object.defineProperty(window, 'scrollTo', {
  value: vi.fn(),
  writable: true
});


describe('header component', () => {
  // Fonction utilitaire pour monter le composant en stubant les détails d'implémentation
  const createWrapper = (props = {}) => {
    return mount(Header, {
      props,
      global: {
        stubs: {
          'router-link': {
            template: '<a :id="id" :href="href"><slot /></a>',
            props: ['to', 'id'],
            computed: {
              href() { return typeof this.to === 'string' ? this.to : `/${this.to.name}` }
            }
          }
        }
      }
    });
  };

  beforeEach(() => {
    setActivePinia(createPinia());
    vi.clearAllMocks();
    
    // Configuration de base pour éviter les erreurs
    ConfigLoader.init({
      app: { 
        name: 'app-test', 
        homepage_url: 'www.google.fr',
        apis: {} // Obligatoire pour le logout
      }
    });
  })
  
  afterEach(() => {
    vi.restoreAllMocks();
    // Nettoyer les routes ajoutées pour les tests
    const router = getRouter();
    if (router) {
      const routesToRemove = ['test-route', 'test-route-2', 'test-route-3', 'test-route-4', 'test-route-5', 'sidebar1', 'sidebar2', 'no-sidebar'];
      routesToRemove.forEach(routeName => {
        if (router.hasRoute(routeName)) {
          router.removeRoute(routeName);
        }
      });
    }
  })

  it('hamburger click', async () => {
    localeFunctions.getTranslater().global.mergeLocaleMessage('fr', {sidebar_users: 'homepage'})

    const testRoute = {
      path: "/test-route",
      name: "test-route",
      component: { template: '<div></div>' },
      meta: { sidebar: { icon: 'fa-solid fa-user', label: 'sidebar_users', order: 1 } }
    }

    // Ajouter la route au vrai router du service
    const router = getRouter()
    router.addRoute(testRoute)
    await router.push('/test-route') // Naviguer vers la route pour qu'elle soit active
    
    const wrapper = createWrapper()

    const hamburger = wrapper.find('#hamburger-button')
    const sidebar = wrapper.find('#sidebar')
    expect(hamburger.classes()).not.toContain('active')
    expect(sidebar.classes()).not.toContain('open')

    await wrapper.find('#hamburger-button').trigger('click')
    expect(hamburger.classes()).toContain('active')
    expect(sidebar.classes()).toContain('open')

    
    await wrapper.find('#hamburger-button').trigger('click')
    expect(hamburger.classes()).not.toContain('active')
    expect(sidebar.classes()).not.toContain('open')
  })

  it('logout button comportement', async () => {
    // Utiliser le vrai router sans routes sidebar
    const wrapper = createWrapper({ title: 'app-test' })

    expect(wrapper.find('#logout_button').exists()).toBeFalsy()

    currentUser.set('john')
    await wrapper.vm.$nextTick()
    expect(wrapper.find('#logout_button').exists()).toBeTruthy()

    currentUser.remove()
    await wrapper.vm.$nextTick()
    expect(wrapper.find('#logout_button').exists()).toBeFalsy()
  })

  it('should close sidebar when closeSidebar is called', async () => {
    const testRoute = {
      path: "/test-route-2",
      name: "test-route-2",
      component: { template: '<div></div>' },
      meta: { sidebar: { icon: 'fa-solid fa-user', label: 'sidebar_users', order: 1 } }
    }

    // Ajouter la route au vrai router du service
    const router = getRouter()
    router.addRoute(testRoute)
    await router.push('/test-route-2')

    const wrapper = createWrapper()

    wrapper.vm.sidebarOpen = true;
    wrapper.vm.activeHamburger = true;

    wrapper.vm.closeSidebar();

    expect(wrapper.vm.sidebarOpen).toBe(false);
    expect(wrapper.vm.activeHamburger).toBe(false);
  });

  it('should call servicesM.service with auth:logout when logout is called', async () => {
    const testRoute = {
      path: "/test-route-3",
      name: "test-route-3",
      component: { template: '<div></div>' },
      meta: { sidebar: { icon: 'fa-solid fa-user', label: 'sidebar_users', order: 1 } }
    }

    // Ajouter la route au vrai router du service
    const router = getRouter()
    router.addRoute(testRoute)
    await router.push('/test-route-3')
    
    const wrapper = createWrapper()

    // Spy après avoir monté le composant pour éviter les conflits avec l'initialisation
    const authSpy = vi.spyOn(servicesM, 'service')

    wrapper.vm.logout();
    expect(authSpy).toHaveBeenCalledWith('auth:logout');
  });

  it('should update iconTranslateY correctly on scroll', async () => {
    const testRoute = {
      path: "/test-route-4",
      name: "test-route-4",
      component: { template: '<div></div>' },
      meta: { sidebar: { icon: 'fa-solid fa-user', label: 'sidebar_users', order: 1 } }
    }

    // Ajouter la route au vrai router du service
    const router = getRouter()
    router.addRoute(testRoute)
    await router.push('/test-route-4')
    
    const wrapper = createWrapper()
    const headerHeight = 100;
    window.scrollY = 30;

    wrapper.vm.handleScroll();

    const expectedTranslate = `translateY(${headerHeight - 30}px)`;
    expect(wrapper.vm.iconTranslateY).toBe(expectedTranslate);
  });

  it('correct render without sidebar', async () => {
    // Utiliser le vrai router sans routes sidebar
    const wrapper = createWrapper({ title: 'app-test' })

    expect(wrapper.html()).toMatchInlineSnapshot(`
      "<header class="header | bg-primary p-25">
        <nav class="d-flex a-center g-20">
          <!--v-if--><a href="www.google.fr" class="header-logo_link" title="Lien vers l'intranet">
            <picture class="header-logo">
              <source srcset="/images/vuemann/brugmann-logo_white.svg" media="(min-width:850px)"><img src="/images/vuemann/brugmann-logo_white-xs.png" alt="logo de l'hôpital brugmann">
            </picture>
          </a>
        </nav>
        <h1 class="header-h1 | h1 f-center text-center color-neutral-100">app-test</h1>
        <nav class="d-flex j-end a-center g-5">
          <div class="dropdown locale-dropdown">
            <div id="dropdown-button"><button id="locale-dropdown-button" type="button" class="p-10 radius-5 bg-primary-300-hover pointer color-neutral-100 fw-2rem">FR <i class="fa-solid fa-chevron-down ml-10"></i></button></div>
            <div data-items="" class="dropdown-items bottom right" style="display: none;">
              <ul class="f-column g-5">
                <li><button id="local-change-fr" type="button" class="pointer d-flex a-center g-10 w-100 link-bg py-5 px-10"><img src="/images/vuemann/fr.png" alt="Changer la langue vers Français"><span>Français</span></button></li>
                <li><button id="local-change-nl" type="button" class="pointer d-flex a-center g-10 w-100 link-bg py-5 px-10"><img src="/images/vuemann/nl.png" alt="Changer la langue vers Nederlands"><span>Nederlands</span></button></li>
                <li><button id="local-change-en" type="button" class="pointer d-flex a-center g-10 w-100 link-bg py-5 px-10"><img src="/images/vuemann/en.png" alt="Changer la langue vers English"><span>English</span></button></li>
              </ul>
            </div>
          </div>
          <!--v-if-->
          <!--v-if-->
        </nav>
      </header>
      <!--v-if-->
      <div class="sidebar-bg"></div>"
    `)

    expect(wrapper.html()).contains('app-test')
    expect(wrapper.html()).contains('www.google.fr')
    expect(wrapper.html()).not.contains('id="hamburger-button"')
  })

  it('correct render with sidebar', async () => {
    const testRoute = {
      path: "/test-route-5",
      name: "test-route-5",
      component: { template: '<div></div>' },
      meta: { sidebar: { icon: 'fa-solid fa-user', label: 'sidebar_users', order: 1 } }
    }

    localeFunctions.getTranslater().global.mergeLocaleMessage('fr', {sidebar_users: 'homepage'})

    // Ajouter la route au vrai router du service
    const router = getRouter()
    router.addRoute(testRoute)
    await router.push('/test-route-5')

    const wrapper = createWrapper({ title: 'app-test' })

    expect(wrapper.html()).toMatchInlineSnapshot(`
      "<header class="header | bg-primary p-25">
        <nav class="d-flex a-center g-20"><button id="hamburger-button" type="button" class="div-hamburger | bg-primary-700-hover p-10 pointer radius-5" title="Afficher le menu">
            <div class="hamburger"><span class="hamburger-center"></span></div>
          </button><a href="www.google.fr" class="header-logo_link" title="Lien vers l'intranet">
            <picture class="header-logo">
              <source srcset="/images/vuemann/brugmann-logo_white.svg" media="(min-width:850px)"><img src="/images/vuemann/brugmann-logo_white-xs.png" alt="logo de l'hôpital brugmann">
            </picture>
          </a></nav>
        <h1 class="header-h1 | h1 f-center text-center color-neutral-100">app-test</h1>
        <nav class="d-flex j-end a-center g-5">
          <div class="dropdown locale-dropdown">
            <div id="dropdown-button"><button id="locale-dropdown-button" type="button" class="p-10 radius-5 bg-primary-300-hover pointer color-neutral-100 fw-2rem">FR <i class="fa-solid fa-chevron-down ml-10"></i></button></div>
            <div data-items="" class="dropdown-items bottom right" style="display: none;">
              <ul class="f-column g-5">
                <li><button id="local-change-fr" type="button" class="pointer d-flex a-center g-10 w-100 link-bg py-5 px-10"><img src="/images/vuemann/fr.png" alt="Changer la langue vers Français"><span>Français</span></button></li>
                <li><button id="local-change-nl" type="button" class="pointer d-flex a-center g-10 w-100 link-bg py-5 px-10"><img src="/images/vuemann/nl.png" alt="Changer la langue vers Nederlands"><span>Nederlands</span></button></li>
                <li><button id="local-change-en" type="button" class="pointer d-flex a-center g-10 w-100 link-bg py-5 px-10"><img src="/images/vuemann/en.png" alt="Changer la langue vers English"><span>English</span></button></li>
              </ul>
            </div>
          </div>
          <!--v-if-->
          <!--v-if-->
        </nav>
      </header>
      <div id="sidebar" class="sidebar | p-15">
        <nav>
          <ul class="sidebar-lu" style="transform: translateY(100px);">
            <li class="sidebar-li"><a id="link-test-route-5" href="/test-route-5" class="sidebar-button" activeclass="active"><i class="sidebar-icon fa-solid fa-user"></i><span class="sidebar-label">homepage</span></a></li>
          </ul>
        </nav>
      </div>
      <div class="sidebar-bg"></div>"
    `)
    
    expect(wrapper.html()).contains('id="hamburger-button"')
  })
})
