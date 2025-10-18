import { describe, it, expect, afterAll, vi, afterEach, beforeAll } from 'vitest';
import { mount } from '@vue/test-utils';
import BreadcrumbComponent from '@brugmann/vuemann/src/components/breadcrumb/BreadcrumbComponent.vue';
import { breadcrumb } from '@brugmann/vuemann/src/components/breadcrumb/breadcrumb-functions.js';
import { routerService } from '@brugmann/vuemann/src/services/router/init/router-service.js';
import { flashService } from '@brugmann/vuemann/src/services/flash/init/flash-service.js';
import { breadcrumbPersist } from '../../../src/components/breadcrumb/src/breadcrumb-persist.js';
import { nextTick } from 'vue';
import { t } from '@brugmann/vuemann/src/services/services-helper.js';
import { createRouter, createWebHistory } from 'vue-router';
import Home from "@brugmann/vuemann/src/views/HomePage.vue";

describe('BreadcrumbComponent', () => {
  const router = createRouter({
    history: createWebHistory(),
    routes: [
      { path: '/', name: "home" , component: Home},
      { path: '/user-profile/:id', name: 'user-profile' }
    ]
  })

  const wrapperOption = {
    global: {
      plugins: [router]
    }
  }

  beforeAll(() => vi.spyOn(routerService, 'currentRoute').mockReturnValue({ value : { name: 'test', path: '' }}));
  afterEach(() => vi.clearAllMocks());
  afterAll(() => vi.resetAllMocks());

  it('should render correctly when there are multiple breadcrumb links', async () => {
    vi.spyOn(breadcrumb, 'init').mockReturnValue([
      { label: 'Home', route: {name: 'home'} },
      { label: 'Api Init' },
    ]);

    const wrapper = mount(BreadcrumbComponent, wrapperOption);
    wrapper.vm.manageLink = vi.fn()
    await wrapper.find('a').trigger('click');

    expect(wrapper.vm.manageLink).toHaveBeenCalled();
    expect(wrapper.emitted('breadcrumb-click')).toBeUndefined();
    expect(wrapper.html()).contains('Api Init')
    expect(wrapper.html()).contains('Home')

    expect(wrapper.html()).toMatchInlineSnapshot(`
      "<div class="breadcrumb-container">
        <ul class="d-flex">
          <li class="breadcrumb-link"><a href="/" class="underline-hover color-neutral-800 color-primary-300-hover">Home</a>
            <!--v-if-->
          </li>
          <li class="breadcrumb-link">
            <!--v-if--><span>Api Init</span>
          </li>
        </ul>
      </div>"
    `);
  });

  it('should not render breadcrumb container when there is only one link', () => {
    breadcrumb.init.mockReturnValue([{ label: 'Home', route: {name : 'home'} }]);

    const wrapper = mount(BreadcrumbComponent, wrapperOption);

    expect(wrapper.html()).toMatchInlineSnapshot(`"<!--v-if-->"`);
  });

  it('should not render breadcrumb container when breadcrumb is empty', () => {
    breadcrumb.init.mockReturnValue([]);

    const wrapper = mount(BreadcrumbComponent, wrapperOption);

    expect(wrapper.html()).toMatchInlineSnapshot(`"<!--v-if-->"`);
  });

  it('onMounted clean breadcrumbPersist when different route', async () => {
    vi.spyOn(breadcrumbPersist, 'clean')
    breadcrumbPersist.setRouteName('other_route')

    mount(BreadcrumbComponent, wrapperOption)

    expect(breadcrumbPersist.clean).toHaveBeenCalled()
  });

  it('onMounted type session', async () => {
    vi.spyOn(breadcrumbPersist, 'get').mockReturnValue([{ label: 'Home', route: {name: 'home'} }])
    breadcrumbPersist.setRouteName('test')
    wrapperOption.props = {type : 'session'}

    const wrapper = mount(BreadcrumbComponent, wrapperOption);
    await nextTick()
    
    expect(breadcrumbPersist.get).toHaveBeenCalled();
    expect(wrapper.html()).contains('Home')
    expect(wrapper.html()).toMatchInlineSnapshot(`
      "<div class="breadcrumb-container">
        <ul class="d-flex">
          <li class="breadcrumb-link">
            <!--v-if--><span>Home</span>
          </li>
        </ul>
      </div>"
    `)

    breadcrumbPersist.clean()
  });

  it('should render RouterLink with route params when type is session', async () => {
  
    vi.spyOn(breadcrumbPersist, 'get').mockReturnValue([
      { label: 'User Profile', route:{ name: 'user-profile', params: { id: 123 }} },
      { label: 'Settings' },
    ]);

    breadcrumbPersist.setRouteName('test');
    wrapperOption.props = { type: 'session' };
    
    const wrapper = mount(BreadcrumbComponent,  wrapperOption);
    await nextTick()

    const link = wrapper.findComponent({ name: 'RouterLink' })
    expect(link.vm.$props.to).toEqual({ name: 'user-profile', params: { id: 123 } })
  
    breadcrumbPersist.clean();
  });

  it('should call "manageLink" method when a breadcrumb link is clicked', async () => {
    vi.spyOn(breadcrumbPersist, 'get').mockReturnValue([
      { label: 'Home', route: {name: 'home'} },
      { label: 'Api Init' },
    ])
    breadcrumbPersist.setRouteName('test')
    wrapperOption.props = {type : 'session'}
    
    const wrapper = mount(BreadcrumbComponent, wrapperOption);
    wrapper.vm.manageLink = vi.fn()
    await nextTick()
    
    await wrapper.find('a').trigger('click');

    expect(wrapper.vm.manageLink).toHaveBeenCalled();
    breadcrumbPersist.clean()
  });

  it('should not call method is config', async () => { 
    vi.spyOn(flashService, 'error').mockReturnValue(false)
    
    wrapperOption.props = {type : 'config'}
    const wrapper = mount(BreadcrumbComponent, wrapperOption);
    
    vi.spyOn(breadcrumbPersist, 'save')
    await wrapper.vm.add({ label: 'Home', route: {name: 'home'} });
    expect(flashService.error).toHaveBeenCalledExactlyOnceWith(t('breadcrumb.errors.type'));

    flashService.error.mockClear()
    vi.spyOn(breadcrumbPersist, 'get')
    await wrapper.vm.refresh();
    expect(flashService.error).toHaveBeenCalledExactlyOnceWith(t('breadcrumb.errors.type'));
  });

  it('call methods if type session', async () => {
    breadcrumb.init.mockReturnValue([{ label: 'Home', route: {name: 'home'} }])
  
    wrapperOption.props = { type : 'session' }
    const wrapper = mount(BreadcrumbComponent, wrapperOption)
  
    vi.spyOn(breadcrumbPersist, 'save')
    await wrapper.vm.add({ label: 'Home', route: {name: 'home'} })
    expect(breadcrumbPersist.save).toHaveBeenCalled()

    vi.spyOn(breadcrumbPersist, 'get')
    await wrapper.vm.refresh()
    expect(breadcrumbPersist.get).toHaveBeenCalled()
  });

  it('should emit breadcrumb-click event when manageLink is called', async () => {
    wrapperOption.props = { type : 'session' }
    const wrapper = mount(BreadcrumbComponent, wrapperOption)
  
    await wrapper.vm.manageLink(0);
    expect(wrapper.emitted('breadcrumb-click')).toHaveLength(1)
  });

  it('should render the last breadcrumb link as a span', async () => {
    vi.spyOn(breadcrumbPersist, 'get').mockReturnValue([
      { label: 'Loader', route: {name: 'home'} },
      { label: 'Api Init' },
    ])

    breadcrumbPersist.setRouteName('test')
    wrapperOption.props = { type : 'session' }
    const wrapper = mount(BreadcrumbComponent, wrapperOption)
    await nextTick()

    const breadcrumbItems = wrapper.findAll('.breadcrumb-link')

    const lastItem = breadcrumbItems.at(-1);
    expect(lastItem.find('span').exists()).toBe(true);
    expect(lastItem.find('a').exists()).toBe(false);
  });
});
