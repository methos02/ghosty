import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import DialogComponent from '@/components/DialogComponent.vue'

describe('DialogComponent.vue', () => {
  it('renders the title and slot content', () => {
    const wrapper = mount(DialogComponent, {
      props: { title: 'Connexion' },
      slots: { default: 'Formulaire' },
      attachTo: document.body,
    })

    expect(wrapper.find('.dialog-header h2').text()).toBe('Connexion')
    expect(wrapper.find('.dialog-content').text()).toBe('Formulaire')
  })

  it('does not render a title heading when title is empty', () => {
    const wrapper = mount(DialogComponent, {
      slots: { default: 'Contenu' },
      attachTo: document.body,
    })

    expect(wrapper.find('.dialog-header h2').exists()).toBe(false)
  })

  it('opens via the exposed show() and emits dialog-show', async () => {
    const wrapper = mount(DialogComponent, {
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
    const wrapper = mount(DialogComponent, {
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
    const wrapper = mount(DialogComponent, {
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
    const wrapper = mount(DialogComponent, {
      props: { closeCross: false },
      slots: { default: 'Contenu' },
      attachTo: document.body,
    })

    expect(wrapper.find('[data-dialog="close"]').exists()).toBe(false)
  })
})
