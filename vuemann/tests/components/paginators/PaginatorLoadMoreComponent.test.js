import { describe, expect, it, vi } from "vitest";
import { mount, flushPromises } from "@vue/test-utils";
import PaginatorLoadMore from "@brugmann/vuemann/src/components/paginators/PaginatorLoadMoreComponent.vue";
import { paginatorHelper } from "@brugmann/vuemann/src/helpers/paginator-helper.js";
import { utilsH } from "@brugmann/vuemann/src/helpers/utils-helper.js";

describe('paginator load more component', () => {
  it('watch page', async () => {
    const spy = vi.fn()
    const wrapper = mount(PaginatorLoadMore, {
      props: {params: { total: 100, size: 10, page: 10 }, cb : spy}
    });

    await wrapper.setProps({
      params: { total: 100, size: 10, page: 5 }
    })
    
    const totalPage = paginatorHelper.calculTotalPage(100, 10)
    expect(wrapper.vm.currentPage).toBe(5)
    expect(wrapper.vm.progress).toBe(utilsH.percentOf(5, totalPage))
  });

  it('watch total page', async () => {
    const spy = vi.fn()
    const wrapper = mount(PaginatorLoadMore, {
      props: {params: { total: 100, size: 10, page: 10 }, cb : spy}
    });

    await wrapper.setProps({
      params: { total: 200, size: 10, page: 10 }
    })

    const totalPage = paginatorHelper.calculTotalPage(200, 10)
    expect(wrapper.vm.totalPage).toBe(totalPage)
    expect(wrapper.vm.progress).toBe(utilsH.percentOf(10, totalPage))
  });

  it('correct render with one page', async () => {
    const wrapper = mount(PaginatorLoadMore, {props: { params: { total: 20, size: 10, page: 1 }}})
    await flushPromises()

    expect(wrapper.html()).toMatchInlineSnapshot(`
      "<div class="f-center f-column">
        <p class="fs-300" data-current="1">Vous êtes sur la page 1 sur 2</p>
        <div class="progressbar | bg-neutral-300 my-10">
          <div class="progressbar-content | h-100 bg-primary" style="width: 50%;"></div>
        </div><button type="button" class="btn btn-primary" title="Charger plus">Charger plus</button>
      </div>"
    `)

    expect(wrapper.html()).contains('data-current="1"')
  })

  it('click action', async () => {
    const wrapper = mount(PaginatorLoadMore, {props: { params: { total: 20, size: 10, page: 1 }}})
    await flushPromises()

    await wrapper.find('button').trigger('click')

    expect(wrapper.emitted('p-loadmore')).toHaveLength(1);
    expect(wrapper.emitted('p-loadmore')[0]).toEqual([{ size: 10, page: 2 }]);
  })

  it('last page', async () => {
    const wrapper = mount(PaginatorLoadMore, {props: { params: { total: 10, size: 10, page: 1 }}})
    await flushPromises()

    const button = wrapper.find('button')
    await button.trigger('click')

    expect(wrapper.emitted('p-loadmore')).toBe(undefined);
    expect(button.attributes('disabled')).toBeDefined();
  })
})
