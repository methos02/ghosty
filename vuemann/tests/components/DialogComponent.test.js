import Dialog from '@brugmann/vuemann/src/components/DialogComponent.vue'
import {describe, expect, it, vi} from "vitest";
import { mount } from "@vue/test-utils";
import { initDialogFunctions } from '&/utils/mocks/dialog-mock.js';

describe('button component', () => {
  it('show() / hide() function', async () => {
    const { showModalSpy, closeModalSpy } = initDialogFunctions();

    const wrapper = mount(Dialog, {slots:{ default: 'test content'}})

    expect(wrapper.emitted('dialog-show')).toBeUndefined()

    wrapper.vm.show()
    await wrapper.vm.$nextTick()
    expect(showModalSpy).toHaveBeenCalledOnce()
    expect(wrapper.emitted('dialog-show')).toHaveLength(1)

    expect(wrapper.emitted('dialog-close')).toBeUndefined()

    wrapper.vm.close()
    await wrapper.vm.$nextTick()
    expect(closeModalSpy).toHaveBeenCalledOnce()
    expect(wrapper.emitted('dialog-close')).toHaveLength(1)
  })

  it('toggle() function', async () => {
    const { showModalSpy, closeModalSpy } = initDialogFunctions();

    const wrapper = mount(Dialog, {slots:{ default: 'test content'}})

    expect(wrapper.emitted('dialog-show')).toBeUndefined()

    wrapper.vm.toggle()
    await wrapper.vm.$nextTick()
    expect(showModalSpy).toHaveBeenCalledOnce()
    expect(wrapper.emitted('dialog-show')).toHaveLength(1)

    wrapper.vm.toggle()
    await wrapper.vm.$nextTick()
    expect(closeModalSpy).toHaveBeenCalledOnce()
    expect(wrapper.emitted('dialog-close')).toHaveLength(1)
  })

  it('toggle() function with state', async () => {
    const { showModalSpy, closeModalSpy } = initDialogFunctions();

    const wrapper = mount(Dialog, {slots:{ default: 'test content'}})

    expect(wrapper.emitted('dialog-show')).toBeUndefined()

    wrapper.vm.toggle(true)
    await wrapper.vm.$nextTick()
    expect(showModalSpy).toHaveBeenCalledOnce()
    expect(wrapper.emitted('dialog-show')).toHaveLength(1)

    wrapper.vm.toggle(false)
    await wrapper.vm.$nextTick()
    expect(closeModalSpy).toHaveBeenCalledOnce()
    expect(wrapper.emitted('dialog-close')).toHaveLength(1)
  })

  it('should not emit "dialog-close" when background is clicked and closeBg is false', async () => {
    const { closeModalSpy } = initDialogFunctions();
    const wrapper = mount(Dialog, { props: { closeBg: false }});

    await wrapper.find('dialog').trigger('click');
    expect(closeModalSpy).not.toHaveBeenCalled();
    expect(wrapper.emitted('dialog-close')).toBeUndefined();
  });

  it('should emit "dialog-close" when close button is clicked', async () => {
    const { closeModalSpy } = initDialogFunctions();
    
    const wrapper = mount(Dialog, { props: { closeCross: false } });

    const closeBtn = wrapper.find('button.dialog-close');
    expect(closeBtn.exists()).toBeFalsy();
  });

  it('correct render empty', async () => {
    const wrapper = mount(Dialog)

    expect(wrapper.html()).toMatchInlineSnapshot(`
      "<dialog class="dialog | bg-neutral-100 p-15 radius-5">
        <div class="d-flex g-25">
          <!--v-if-->
          <div class="d-flex j-end flex-1"><button class="dialog-close" type="button" title="Fermer la fenêtre popup" data-dialog="close"><i class="fa-solid fa-xmark"></i></button></div>
        </div>
      </dialog>"
    `)
  })

  it('correct render', async () => {
    const wrapper = mount(Dialog, {slots:{ default: 'test content'}})

    expect(wrapper.html()).toMatchInlineSnapshot(`
      "<dialog class="dialog | bg-neutral-100 p-15 radius-5">
        <div class="d-flex g-25">
          <!--v-if-->
          <div class="d-flex j-end flex-1"><button class="dialog-close" type="button" title="Fermer la fenêtre popup" data-dialog="close"><i class="fa-solid fa-xmark"></i></button></div>
        </div>test content
      </dialog>"
    `)
 
    expect(wrapper.html()).contains('test content')
  })
});
