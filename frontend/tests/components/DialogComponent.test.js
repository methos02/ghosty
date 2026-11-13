import { describe, it, expect, vi, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import DialogComponent from '@/components/DialogComponent.vue'

describe('DialogComponent.vue', () => {
  let wrapper

  afterEach(() => {
    vi.clearAllMocks()
    wrapper?.unmount()
    wrapper = undefined
  })

  it('renders the title and slot content', () => {
    wrapper = mount(DialogComponent, {
      props: { title: 'Connexion' },
      slots: { default: 'Formulaire' },
      attachTo: document.body,
    })

    expect(wrapper.find('.dialog-header h2').text()).toBe('Connexion')
    expect(wrapper.find('.dialog-content').text()).toBe('Formulaire')
  })

  it('renders the title slot in place of the title prop', () => {
    wrapper = mount(DialogComponent, {
      slots: { default: 'Formulaire', title: 'Signaler' },
      attachTo: document.body,
    })

    expect(wrapper.find('.dialog-header h2').text()).toBe('Signaler')
  })

  it('renders the actions slot in the header, next to the close cross', () => {
    wrapper = mount(DialogComponent, {
      props: { title: 'Roman' },
      slots: { default: 'Contenu', actions: '<button class="header-action">Commentaires</button>' },
      attachTo: document.body,
    })

    expect(wrapper.find('.dialog-header .header-action').text()).toBe('Commentaires')
    expect(wrapper.find('.dialog-content .header-action').exists()).toBe(false)
  })

  it('does not render a title heading when title is empty', () => {
    wrapper = mount(DialogComponent, {
      slots: { default: 'Contenu' },
      attachTo: document.body,
    })

    expect(wrapper.find('.dialog-header h2').exists()).toBe(false)
  })

  it('opens via the exposed show() and emits dialog-show', async () => {
    wrapper = mount(DialogComponent, {
      props: { title: 'X' },
      slots: { default: 'Contenu' },
      attachTo: document.body,
    })

    wrapper.vm.show()
    await wrapper.vm.$nextTick()

    expect(wrapper.find('dialog').element.open).toBe(true)
    expect(wrapper.emitted('dialog-show')).toHaveLength(1)
  })

  it('closes via the exposed close() and emits dialog-close', async () => {
    wrapper = mount(DialogComponent, {
      props: { title: 'X' },
      slots: { default: 'Contenu' },
      attachTo: document.body,
    })
    wrapper.vm.show()
    await wrapper.vm.$nextTick()

    wrapper.vm.close()
    await wrapper.vm.$nextTick()

    expect(wrapper.find('dialog').element.open).toBe(false)
    expect(wrapper.emitted('dialog-close')).toHaveLength(1)
  })

  it('closes when clicking the close cross', async () => {
    wrapper = mount(DialogComponent, {
      props: { title: 'X' },
      slots: { default: 'Contenu' },
      attachTo: document.body,
    })
    wrapper.vm.show()
    await wrapper.vm.$nextTick()

    await wrapper.find('[data-dialog="close"]').trigger('click')

    expect(wrapper.emitted('dialog-close')).toHaveLength(1)
  })

  it('hides the close cross when closeCross is false', () => {
    wrapper = mount(DialogComponent, {
      props: { closeCross: false },
      slots: { default: 'Contenu' },
      attachTo: document.body,
    })

    expect(wrapper.find('[data-dialog="close"]').exists()).toBe(false)
  })
})
