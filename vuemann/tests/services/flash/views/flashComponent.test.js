
import {describe, expect, it, beforeEach, afterEach, vi} from "vitest";
import {createPinia, setActivePinia} from "pinia";
import { flushPromises, mount } from "@vue/test-utils";
import Flash from '@brugmann/vuemann/src/services/flash/views/FlashComponent.vue';
import { flashService } from "@brugmann/vuemann/src/services/flash/init/flash-service.js";
import { flashFunctions } from "@brugmann/vuemann/src/services/flash/src/flash-functions.js";

describe('flash component', () => {
    beforeEach(() => setActivePinia(createPinia()) )

    it('correct render empty', async () => {
      const wrapper = mount(Flash)

      expect(wrapper.html()).toMatchInlineSnapshot(`"<div class="container-flash"></div>"`)
    }) 

    it('with flash error', async () => {
      const consoleErrorMock = vi.spyOn(console, 'error').mockImplementation(() => {});
      vi.spyOn(flashFunctions, 'generateFlashId').mockReturnValue('id-error')
      flashService.error("Message d'erreur");

      const wrapper = mount(Flash)

      expect(wrapper.html()).toMatchInlineSnapshot(`
        "<div class="container-flash">
          <div class="flash flash-error" data-flash="id-error"><button class="flash-close"><i class="fa-solid fa-xmark"></i></button>
            <p>Message d'erreur</p>
          </div>
        </div>"
      `)

      expect(wrapper.html()).contains('data-flash="id-error"')
      expect(wrapper.html()).contains('flash-error')
      consoleErrorMock.mockRestore();
    })

    it('with flash success', async () => {
      vi.spyOn(flashFunctions, 'generateFlashId').mockReturnValue('id-success')
      flashService.success("Message de success");

      const wrapper = mount(Flash)

      expect(wrapper.html()).toMatchInlineSnapshot(`
        "<div class="container-flash">
          <div class="flash flash-success" data-flash="id-success"><button class="flash-close"><i class="fa-solid fa-xmark"></i></button>
            <p>Message de success</p>
          </div>
        </div>"
      `)

      expect(wrapper.html()).contains('data-flash="id-success"')
      expect(wrapper.html()).contains('flash-success')
    })

    it('with flash warning', async () => {
      vi.spyOn(flashFunctions, 'generateFlashId').mockReturnValue('id-warning')
      flashService.warning("Message warning");

      const wrapper = mount(Flash)

      expect(wrapper.html()).toMatchInlineSnapshot(`
        "<div class="container-flash">
          <div class="flash flash-warning" data-flash="id-warning"><button class="flash-close"><i class="fa-solid fa-xmark"></i></button>
            <p>Message warning</p>
          </div>
        </div>"
      `)

      expect(wrapper.html()).contains('data-flash="id-warning"')
      expect(wrapper.html()).contains('flash-warning')
    })

    it('with two flash', async () => {
      vi.spyOn(flashFunctions, 'generateFlashId').mockReturnValueOnce('id-warning').mockReturnValueOnce('id-success')
      flashService.warning("Message warning");
      flashService.success("Message success");

      const wrapper = mount(Flash)

      expect(wrapper.html()).toMatchInlineSnapshot(`
        "<div class="container-flash">
          <div class="flash flash-warning" data-flash="id-warning"><button class="flash-close"><i class="fa-solid fa-xmark"></i></button>
            <p>Message warning</p>
          </div>
          <div class="flash flash-success" data-flash="id-success"><button class="flash-close"><i class="fa-solid fa-xmark"></i></button>
            <p>Message success</p>
          </div>
        </div>"
      `)

      expect(wrapper.html()).contains('data-flash="id-warning"')
      expect(wrapper.html()).contains('flash-warning')
      
      expect(wrapper.html()).contains('data-flash="id-success"')
      expect(wrapper.html()).contains('flash-success')
    })

    it('close function', async () => {
      vi.useFakeTimers();
      vi.spyOn(flashFunctions, 'generateFlashId').mockReturnValueOnce('id-success')
      flashService.success("Message success");

      const wrapper = mount(Flash)
      await wrapper.find('[data-flash="id-success"] button').trigger('click')

      expect(wrapper.html()).toMatchInlineSnapshot(`
        "<div class="container-flash">
          <div class="flash flash-success hide" data-flash="id-success"><button class="flash-close"><i class="fa-solid fa-xmark"></i></button>
            <p>Message success</p>
          </div>
        </div>"
      `)

      vi.runAllTimers();
      await flushPromises()
      
      expect(wrapper.html()).toMatchInlineSnapshot(`"<div class="container-flash"></div>"`)
    })
})
