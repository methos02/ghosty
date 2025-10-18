import {describe, expect, it} from "vitest";
import { mount } from "@vue/test-utils";
import Dropdown from '@brugmann/vuemann/src/components/DropdownComponent.vue';

describe('dropdown component', () => {
  it('correct render empty', async () => {
    const wrapper = mount(Dropdown)

    expect(wrapper.html()).toMatchInlineSnapshot(`
      "<div class="dropdown">
        <div id="dropdown-button"></div>
        <div data-items="" class="dropdown-items bottom" style="display: none;"></div>
      </div>"
    `)
  })
  it('correct render with props', async () => {
    const wrapper = mount(Dropdown, {props: { classes: 'class-test', orientation: 'orientation-test'}, slots:{ button: '<button>test</button>', items :'<ul><li>test</li></ul>'}})

    expect(wrapper.html()).toMatchInlineSnapshot(`
      "<div class="dropdown">
        <div id="dropdown-button"><button>test</button></div>
        <div data-items="" class="dropdown-items bottom orientation-test class-test" style="display: none;">
          <ul>
            <li>test</li>
          </ul>
        </div>
      </div>"
    `)

    expect(wrapper.html()).contains('<button>test</button>')
    
    const dropdownItem = wrapper.find('div.dropdown-items.bottom.class-test ul li')
    expect(dropdownItem.exists()).toBe(true)
    expect(dropdownItem.text()).toBe('test')

    expect(wrapper.html()).contains('class-test')
    expect(wrapper.html()).contains('orientation-test')
  })
  it('open with click', async () => {
    const wrapper = mount(Dropdown, { slots:{ button: '<button>test</button>', items :'<ul><li>test</li></ul>'}})
    
    await wrapper.find('#dropdown-button').trigger('click')
    const dropdown = wrapper.find('[data-items]')
    expect(dropdown.element.style.display).toBe('')
  })
  it('props autoToggle to false', async () => {
    const wrapper = mount(Dropdown, {props: { autoToggle: false}, slots:{ button: '<button>test</button>', items :'<ul><li>test</li></ul>'}})
    
    await wrapper.find('#dropdown-button').trigger('click')
    const dropdown = wrapper.find('[data-items]')
    expect(dropdown.element.style.display).toBe('none')
  })
  it('show() / hide() function', async () => {
    const wrapper = mount(Dropdown)

    wrapper.vm.show()
    await wrapper.vm.$nextTick()

    const dropdown = wrapper.find('[data-items]')
    expect(dropdown.element.style.display).toBe('')

    wrapper.vm.hide()
    await wrapper.vm.$nextTick()
    expect(dropdown.element.style.display).toBe('none')
  })

  it('toggle() function', async () => {
    const wrapper = mount(Dropdown)

    wrapper.vm.toggle(true)
    await wrapper.vm.$nextTick()

    const dropdown = wrapper.find('[data-items]')
    expect(dropdown.element.style.display).toBe('')

    wrapper.vm.toggle(false)
    await wrapper.vm.$nextTick()
    expect(dropdown.element.style.display).toBe('none')
  })
})
