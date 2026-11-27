import { describe, it, expect, vi, afterEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import TabsLayout from '@/views/parts/TabsLayout.vue'
import { routerPlugin } from '@/services/router/src/router-plugin.js'
import { t } from '@/services/shortcuts/services-shortcut.js'
import { PROFILE_TABS } from '@/constants/user-constants.js'
import { userSeeder } from '&/utils/seeders/user-seeder.js'

const router = routerPlugin.getRouter()

describe('TabsLayout.vue', () => {
  let wrapper

  afterEach(async () => {
    wrapper?.unmount()
    wrapper = undefined
    await router.push('/')
    vi.clearAllMocks()
  })

  it('links every tab to its route under its icon and label', async () => {
    const items = [
      { tab: PROFILE_TABS.NOVELS, icon: 'fa-solid fa-book' },
      { tab: PROFILE_TABS.COVERS, icon: 'fa-regular fa-image' },
    ]
    await router.push({
      name: PROFILE_TABS.NOVELS,
      params: { profileSlug: userSeeder.getProfileApi().profile_slug },
    })

    wrapper = mount(TabsLayout, { props: { items, labelPath: 'profile_page.tabs' } })

    expect(
      wrapper
        .findAllComponents('.tabs-layout__link')
        .map(link => [link.props('to'), link.find('i').classes(), link.text()]),
    ).toEqual([
      [
        { name: PROFILE_TABS.NOVELS },
        ['tabs-layout__icon', 'fa-solid', 'fa-book'],
        t(`profile_page.tabs.${PROFILE_TABS.NOVELS}`),
      ],
      [
        { name: PROFILE_TABS.COVERS },
        ['tabs-layout__icon', 'fa-regular', 'fa-image'],
        t(`profile_page.tabs.${PROFILE_TABS.COVERS}`),
      ],
    ])
  })

  it('highlights the tab of the current route', async () => {
    const items = [
      { tab: PROFILE_TABS.NOVELS, icon: 'fa-solid fa-book' },
      { tab: PROFILE_TABS.COVERS, icon: 'fa-regular fa-image' },
    ]
    await router.push({
      name: PROFILE_TABS.COVERS,
      params: { profileSlug: userSeeder.getProfileApi().profile_slug },
    })

    wrapper = mount(TabsLayout, { props: { items, labelPath: 'profile_page.tabs' } })

    expect(wrapper.find('[aria-current="page"]').text()).toBe(
      t(`profile_page.tabs.${PROFILE_TABS.COVERS}`),
    )
    expect(wrapper.find('[aria-current="page"]').classes()).toContain('tabs-layout__link--current')
  })

  it('shows the content next to the menu', () => {
    const items = [{ tab: PROFILE_TABS.NOVELS, icon: 'fa-solid fa-book' }]

    wrapper = mount(TabsLayout, {
      props: { items, labelPath: 'profile_page.tabs' },
      slots: { default: '<p class="tab-content">contenu</p>' },
    })

    expect(wrapper.find('.tabs-layout__content .tab-content').exists()).toBe(true)
  })

  it('lists every tab with its label in the phone selector', async () => {
    const items = [
      { tab: PROFILE_TABS.NOVELS, icon: 'fa-solid fa-book' },
      { tab: PROFILE_TABS.COVERS, icon: 'fa-regular fa-image' },
    ]
    await router.push({
      name: PROFILE_TABS.NOVELS,
      params: { profileSlug: userSeeder.getProfileApi().profile_slug },
    })

    wrapper = mount(TabsLayout, { props: { items, labelPath: 'profile_page.tabs' } })

    expect(wrapper.findAll('option:not([disabled])').map(option => option.text())).toEqual([
      t(`profile_page.tabs.${PROFILE_TABS.NOVELS}`),
      t(`profile_page.tabs.${PROFILE_TABS.COVERS}`),
    ])
  })

  it('starts with the phone selector not stuck', () => {
    const items = [{ tab: PROFILE_TABS.NOVELS, icon: 'fa-solid fa-book' }]

    wrapper = mount(TabsLayout, { props: { items, labelPath: 'profile_page.tabs' } })

    expect(wrapper.find('.tabs-layout__select').classes()).not.toContain(
      'tabs-layout__select--stuck',
    )
  })

  it('opens the tab picked from the phone selector, keeping the route params', async () => {
    const items = [
      { tab: PROFILE_TABS.NOVELS, icon: 'fa-solid fa-book' },
      { tab: PROFILE_TABS.COVERS, icon: 'fa-regular fa-image' },
    ]
    const profileSlug = userSeeder.getProfileApi().profile_slug
    await router.push({ name: PROFILE_TABS.NOVELS, params: { profileSlug } })
    wrapper = mount(TabsLayout, { props: { items, labelPath: 'profile_page.tabs' } })

    await wrapper.find('.tabs-layout__select select').setValue(PROFILE_TABS.COVERS)
    await flushPromises()

    expect(router.currentRoute.value.fullPath).toBe(`/users/${profileSlug}/covers`)
  })
})
