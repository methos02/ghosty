import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import DropdownComponent from '@/components/DropdownComponent.vue'

describe('DropdownComponent.vue', () => {
  it('hides its items by default', () => {
    const wrapper = mount(DropdownComponent, {
      slots: {
        button: '<button class="trigger">Open</button>',
        items: '<div class="menu-item">Item</div>',
      },
    })

    expect(wrapper.find('[data-items]').isVisible()).toBe(false)
  })

  it('toggles open on button click and emits "show"', async () => {
    const wrapper = mount(DropdownComponent, {
      slots: {
        button: '<button class="trigger">Open</button>',
        items: '<div class="menu-item">Item</div>',
      },
    })

    await wrapper.find('#dropdown-button').trigger('click')

    expect(wrapper.find('[data-items]').isVisible()).toBe(true)
    expect(wrapper.emitted('show')).toHaveLength(1)
  })

  it('toggles closed on a second click and emits "hide"', async () => {
    const wrapper = mount(DropdownComponent, {
      slots: {
        button: '<button class="trigger">Open</button>',
        items: '<div class="menu-item">Item</div>',
      },
    })

    await wrapper.find('#dropdown-button').trigger('click')
    await wrapper.find('#dropdown-button').trigger('click')

    expect(wrapper.find('[data-items]').isVisible()).toBe(false)
    expect(wrapper.emitted('hide')).toHaveLength(1)
  })

  it('does not toggle on click when autoToggle is false', async () => {
    const wrapper = mount(DropdownComponent, {
      props: { autoToggle: false },
      slots: {
        button: '<button class="trigger">Open</button>',
        items: '<div class="menu-item">Item</div>',
      },
    })

    await wrapper.find('#dropdown-button').trigger('click')

    expect(wrapper.find('[data-items]').isVisible()).toBe(false)
  })

  it('exposes hide() to close an open dropdown', async () => {
    const wrapper = mount(DropdownComponent, {
      slots: {
        button: '<button class="trigger">Open</button>',
        items: '<div class="menu-item">Item</div>',
      },
    })
    await wrapper.find('#dropdown-button').trigger('click')

    wrapper.vm.hide()
    await wrapper.vm.$nextTick()

    expect(wrapper.find('[data-items]').isVisible()).toBe(false)
  })

  it('applies the orientation class to the items container', () => {
    const wrapper = mount(DropdownComponent, {
      props: { orientation: 'right' },
      slots: {
        button: '<button class="trigger">Open</button>',
        items: '<div class="menu-item">Item</div>',
      },
    })

    expect(wrapper.find('[data-items]').classes()).toContain('right')
  })
})
