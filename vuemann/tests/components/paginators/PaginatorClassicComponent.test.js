import { describe, expect, it, vi } from "vitest";
import { mount, flushPromises } from "@vue/test-utils";
import PaginatorClassic from "@brugmann/vuemann/src/components/paginators/PaginatorClassicComponent.vue";
import { paginatorHelper } from "@brugmann/vuemann/src/helpers/paginator-helper.js";

describe('paginator classique component', () => {
  it('watch page', async () => {
    const spy = vi.fn()
    const wrapper = mount(PaginatorClassic, {
      props: {params: { total: 100, size: 10, page: 10 }, cb : spy}
    });

    await wrapper.setProps({
      params: { total: 100, size: 10, page: 5 }
    })

    expect(wrapper.vm.currentPage).toBe(5)
  });

  it('watch total page', async () => {
    const spy = vi.fn()
    const wrapper = mount(PaginatorClassic, {
      props: {params: { total: 100, size: 10, page: 10 }, cb : spy}
    });

    await wrapper.setProps({
      params: { total: 200, size: 20, page: 5 }
    })

    expect(wrapper.vm.totalPage).toBe(paginatorHelper.calculTotalPage(200, 20))
  });

  it('click next previous', async () => {
    const wrapper = mount(PaginatorClassic, { props: { params: { total: 100, size: 10, page: 2 }}});
  
    const nextButton = wrapper.find('[data-button="previous"]');
    await nextButton.trigger('click');
  
    expect(wrapper.emitted('p-classic')).toHaveLength(1);
    expect(wrapper.emitted('p-classic')[0]).toEqual([{ page: 1, size: 10 }]);
  });

  it('correct render with one page', async () => {
    const wrapper = mount(PaginatorClassic, {props: { params: { total: 20, size: 10, page: 1 }}})
    await flushPromises()

    expect(wrapper.html()).toMatchInlineSnapshot(`
      "<nav class="paginator-container | d-flex j-center">
        <ul class="paginator | d-flex a-center py-15">
          <!-- Previous Page Link -->
          <li class="paginator-li disabled" aria-disabled="true" aria-label="Page précédente" data-button="previous"><span class="paginator-chevron" aria-hidden="true"><i class="fa-solid fa-chevron-left"></i></span></li><!-- paginator Elements -->
          <li class="paginator-li active" aria-current="page" data-current="1"><span class="paginator-current">1</span></li>
          <li class="paginator-li"><button type="button" class="paginator-button" data-page="2">2</button></li><!-- Next Page Link -->
          <li class="paginator-li"><button type="button" class="paginator-button" rel="next" aria-label="Page suivante" data-button="next"><i class="fa-solid fa-chevron-right"></i></button></li>
        </ul>
      </nav>"
    `)

    expect(wrapper.html()).contains('data-current="1"')
    expect(wrapper.html()).contains('data-page="2"')

    const previousButton = wrapper.find('[data-button="previous"]')
    expect(previousButton.attributes('aria-disabled')).toBe('true')

    const nextButton = wrapper.find('[data-button="next"]')
    expect(nextButton.attributes('aria-disabled')).toBe(undefined)
  })

  it('correct render current page 1 with many page', async () => {
    const wrapper = mount(PaginatorClassic, {props: { params: { total: 1000, size: 10, page: 1}}})
    await flushPromises()

    expect(wrapper.html()).toMatchInlineSnapshot(`
      "<nav class="paginator-container | d-flex j-center">
        <ul class="paginator | d-flex a-center py-15">
          <!-- Previous Page Link -->
          <li class="paginator-li disabled" aria-disabled="true" aria-label="Page précédente" data-button="previous"><span class="paginator-chevron" aria-hidden="true"><i class="fa-solid fa-chevron-left"></i></span></li><!-- paginator Elements -->
          <li class="paginator-li active" aria-current="page" data-current="1"><span class="paginator-current">1</span></li>
          <li class="paginator-li"><button type="button" class="paginator-button" data-page="2">2</button></li>
          <li class="paginator-li hide-lg"><button type="button" class="paginator-button" data-page="3">3</button></li>
          <li class="paginator-li" aria-disabled="true"><span>...</span></li>
          <li class="paginator-li"><button type="button" class="paginator-button" data-page="99">99</button></li>
          <li class="paginator-li"><button type="button" class="paginator-button" data-page="100">100</button></li><!-- Next Page Link -->
          <li class="paginator-li"><button type="button" class="paginator-button" rel="next" aria-label="Page suivante" data-button="next"><i class="fa-solid fa-chevron-right"></i></button></li>
        </ul>
      </nav>"
    `)

    expect(wrapper.html()).contains('data-current="1"')
    expect(wrapper.html()).contains('data-page="2"')
    expect(wrapper.html()).contains('data-page="99"')
    expect(wrapper.html()).contains('data-page="100"')

    const pageButtons = wrapper.findAll('[data-page]')
    expect(pageButtons.length).toBe(4)

    const previousButton = wrapper.find('[data-button="previous"]')
    expect(previousButton.attributes('aria-disabled')).toBe('true')

    const nextButton = wrapper.find('[data-button="next"]')
    expect(nextButton.attributes('aria-disabled')).toBe(undefined)
  })
  
  it('correct render current page middle with mani page', async () => {
    const wrapper = mount(PaginatorClassic, {props: { params: { total: 1000, size: 10, page: 51 }}})
    await flushPromises()

    expect(wrapper.html()).toMatchInlineSnapshot(`
      "<nav class="paginator-container | d-flex j-center">
        <ul class="paginator | d-flex a-center py-15">
          <!-- Previous Page Link -->
          <li class="paginator-li"><button type="button" class="paginator-button" rel="prev" aria-label="Page précédente" data-button="previous"><i class="fa-solid fa-chevron-left"></i></button></li><!-- paginator Elements -->
          <li class="paginator-li"><button type="button" class="paginator-button" data-page="1">1</button></li>
          <li class="paginator-li"><button type="button" class="paginator-button" data-page="2">2</button></li>
          <li class="paginator-li" aria-disabled="true"><span>...</span></li>
          <li class="paginator-li hide-lg"><button type="button" class="paginator-button" data-page="49">49</button></li>
          <li class="paginator-li"><button type="button" class="paginator-button" data-page="50">50</button></li>
          <li class="paginator-li active" aria-current="page" data-current="51"><span class="paginator-current">51</span></li>
          <li class="paginator-li"><button type="button" class="paginator-button" data-page="52">52</button></li>
          <li class="paginator-li hide-lg"><button type="button" class="paginator-button" data-page="53">53</button></li>
          <li class="paginator-li" aria-disabled="true"><span>...</span></li>
          <li class="paginator-li"><button type="button" class="paginator-button" data-page="99">99</button></li>
          <li class="paginator-li"><button type="button" class="paginator-button" data-page="100">100</button></li><!-- Next Page Link -->
          <li class="paginator-li"><button type="button" class="paginator-button" rel="next" aria-label="Page suivante" data-button="next"><i class="fa-solid fa-chevron-right"></i></button></li>
        </ul>
      </nav>"
    `)

    expect(wrapper.html()).contains('data-page="1"')
    expect(wrapper.html()).contains('data-page="2"')
    expect(wrapper.html()).contains('data-page="49"')
    expect(wrapper.html()).contains('data-page="50"')
    expect(wrapper.html()).contains('data-current="51"')
    expect(wrapper.html()).contains('data-page="52"')
    expect(wrapper.html()).contains('data-page="53"')
    expect(wrapper.html()).contains('data-page="99"')
    expect(wrapper.html()).contains('data-page="100"')

    const pageButtons = wrapper.findAll('[data-page]')
    expect(pageButtons.length).toBe(8)

    const previousButton = wrapper.find('[data-button="previous"]')
    expect(previousButton.attributes('aria-disabled')).toBe(undefined)

    const nextButton = wrapper.find('[data-button="next"]')
    expect(nextButton.attributes('aria-disabled')).toBe(undefined)
  })

  it('correct render current page middle with mani page', async () => {
    const wrapper = mount(PaginatorClassic, {props: { params: { total: 1000, size: 10, page: 100}}})
    await flushPromises()

    expect(wrapper.html()).toMatchInlineSnapshot(`
      "<nav class="paginator-container | d-flex j-center">
        <ul class="paginator | d-flex a-center py-15">
          <!-- Previous Page Link -->
          <li class="paginator-li"><button type="button" class="paginator-button" rel="prev" aria-label="Page précédente" data-button="previous"><i class="fa-solid fa-chevron-left"></i></button></li><!-- paginator Elements -->
          <li class="paginator-li"><button type="button" class="paginator-button" data-page="1">1</button></li>
          <li class="paginator-li"><button type="button" class="paginator-button" data-page="2">2</button></li>
          <li class="paginator-li" aria-disabled="true"><span>...</span></li>
          <li class="paginator-li hide-lg"><button type="button" class="paginator-button" data-page="98">98</button></li>
          <li class="paginator-li"><button type="button" class="paginator-button" data-page="99">99</button></li>
          <li class="paginator-li active" aria-current="page" data-current="100"><span class="paginator-current">100</span></li><!-- Next Page Link -->
          <li class="paginator-li disabled" aria-disabled="true" aria-label="Page suivante" data-button="next"><span class="paginator-chevron" aria-hidden="true"><i class="fa-solid fa-chevron-right"></i></span></li>
        </ul>
      </nav>"
    `)

    expect(wrapper.html()).contains('data-page="1"')
    expect(wrapper.html()).contains('data-page="2"')
    expect(wrapper.html()).contains('data-page="98"')
    expect(wrapper.html()).contains('data-page="99"')
    expect(wrapper.html()).contains('data-current="100"')

    const pageButtons = wrapper.findAll('[data-page]')
    expect(pageButtons.length).toBe(4)

    const previousButton = wrapper.find('[data-button="previous"]')
    expect(previousButton.attributes('aria-disabled')).toBe(undefined)

    const nextButton = wrapper.find('[data-button="next"]')
    expect(nextButton.attributes('aria-disabled')).toBe('true')
  })
})
