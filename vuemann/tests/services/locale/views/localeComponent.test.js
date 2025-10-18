import Locale from "@brugmann/vuemann/src/services/locale/views/LocaleComponent.vue";
import {describe, expect, it, beforeEach, afterEach} from "vitest";
import { mount, flushPromises } from "@vue/test-utils";
import { windowMock } from "&/utils/mocks/window-mock.js";

describe('auth middleware', () => {
  let wrapper

  beforeEach(() => {
    windowMock()
  })

  afterEach(async () => {
    await flushPromises()
    // Small delay to ensure file I/O operations complete (loadLocaleMessages)
    await new Promise(resolve => setTimeout(resolve, 50))
    if (wrapper) {
      wrapper.unmount()
      wrapper = null
    }
  })

  it('correct render', async () => {
    wrapper = mount(Locale)

    expect(wrapper.html()).toMatchInlineSnapshot(`
      "<div class="dropdown locale-dropdown">
        <div id="dropdown-button"><button id="locale-dropdown-button" type="button" class="p-10 radius-5 bg-primary-300-hover pointer color-neutral-100 fw-2rem">FR <i class="fa-solid fa-chevron-down ml-10"></i></button></div>
        <div data-items="" class="dropdown-items bottom right" style="display: none;">
          <ul class="f-column g-5">
            <li><button id="local-change-fr" type="button" class="pointer d-flex a-center g-10 w-100 link-bg py-5 px-10"><img src="/images/vuemann/fr.png" alt="Changer la langue vers Français"><span>Français</span></button></li>
            <li><button id="local-change-nl" type="button" class="pointer d-flex a-center g-10 w-100 link-bg py-5 px-10"><img src="/images/vuemann/nl.png" alt="Changer la langue vers Nederlands"><span>Nederlands</span></button></li>
            <li><button id="local-change-en" type="button" class="pointer d-flex a-center g-10 w-100 link-bg py-5 px-10"><img src="/images/vuemann/en.png" alt="Changer la langue vers English"><span>English</span></button></li>
          </ul>
        </div>
      </div>"
    `)
  })

  it('change lang', async () => {
    wrapper = mount(Locale)
    localStorage.setItem('locale', 'fr')
    expect(localStorage.getItem('locale')).toBe('fr')

    await wrapper.find('#locale-dropdown-button').trigger('click')
    await wrapper.find('#local-change-nl').trigger('click')

    expect(localStorage.getItem('locale')).toBe('nl')
  })
})
