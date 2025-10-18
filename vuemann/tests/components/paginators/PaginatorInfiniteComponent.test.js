import { describe, expect, it, vi } from "vitest";
import { mount } from "@vue/test-utils";
import PaginatorInfinite from "@brugmann/vuemann/src/components/paginators/PaginatorInfiniteComponent.vue";
import { paginatorHelper } from "@brugmann/vuemann/src/helpers/paginator-helper.js";

describe('paginator infinite component', () => {
  it('initializes correctly with props', async () => {
    const wrapper = mount(PaginatorInfinite, {
      props: {params: { total: 100, size: 10, page: 1 }, cb : vi.fn()}
    });

    expect(wrapper.vm.currentPage).toBe(1); 
    expect(wrapper.vm.totalPage).toBe(10);
  });

  it('runCallBack', async () => {
    const spy = vi.fn()
    const wrapper = mount(PaginatorInfinite, {
      props: {params: { total: 100, size: 10, page: 1 }, cb : spy}
    });

    await wrapper.vm.runCallBack();

    expect(spy).toHaveBeenCalledOnce();
  });

  it('not runCallBack if last page', async () => {
    const spy = vi.fn()
    const wrapper = mount(PaginatorInfinite, {
      props: {params: { total: 100, size: 10, page: 10 }, cb : spy}
    });

    await wrapper.vm.runCallBack();

    expect(spy).not.toHaveBeenCalledOnce();
  });

  it('watch page', async () => {
    const spy = vi.fn()
    const wrapper = mount(PaginatorInfinite, {
      props: {params: { total: 100, size: 10, page: 10 }, cb : spy}
    });

    await wrapper.setProps({
      params: { total: 100, size: 10, page: 5 }
    })

    expect(wrapper.vm.currentPage).toBe(5)
  });

  it('watch total page', async () => {
    const spy = vi.fn()
    const wrapper = mount(PaginatorInfinite, {
      props: {params: { total: 100, size: 10, page: 10 }, cb : spy}
    });

    await wrapper.setProps({
      params: { total: 200, size: 20, page: 5 }
    })

    expect(wrapper.vm.totalPage).toBe(paginatorHelper.calculTotalPage(200, 20))
  });

  it('renders slot content', async () => {
    const slot = '<div class="slot-content">Hello World</div>'
    const wrapper = mount(PaginatorInfinite, {
      props: { params: { total: 100, size: 10, page: 1 } },
      slots: { default: slot },
      type: 'infinite',
    });
    
    expect(wrapper.html()).toContain(slot);
  });
})
