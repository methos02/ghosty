import { describe, expect, it } from "vitest";
import { mount, flushPromises } from "@vue/test-utils";
import PaginatorRange from "@brugmann/vuemann/src/components/paginators/PaginatorRangeComponent.vue";

describe('paginator range component', () => {
  it('render properly', async () => {
    const wrapper = mount(PaginatorRange, {
      props: { params: { total: 100, size: 10, page: 1 } },
    });
    await flushPromises()

    expect(wrapper.html()).toMatchInlineSnapshot(`
      "<div class="paginator-range | f-center g-10 mt-30"><button aria-label="Page précédente" data-button="previous" type="button" class="pointer" disabled=""><i class="fa-solid fa-chevron-left"></i></button>
        <div class="p-relative"><span class="paginator-range_indicator" style="left: 10%;" data-current="1">1 / 10</span><input min="1" type="range" class="paginator-range_input" style="background: linear-gradient(to right, rgb(88, 44, 77) 0%, rgb(88, 44, 77) 9.6%, rgb(226, 226, 226) 9.6%, rgb(226, 226, 226) 100%);" max="10"></div><button aria-label="Page suivante" data-button="next" type="button" class="pointer"><i class="fa-solid fa-chevron-right"></i></button>
      </div>"
    `)

    const rangeInput = wrapper.find('input[type="range"]');

    expect(rangeInput.attributes('min')).toBe('1');
    expect(rangeInput.attributes('max')).toBe('10');

    const prev_button = wrapper.find('[data-button="previous"]')
    expect(prev_button.attributes('disabled')).toBeDefined();

    const next_button = wrapper.find('[data-button="next"]')
    expect(next_button.attributes('disabled')).not.toBeDefined();
  });

  it('click next page', async () => {
    const wrapper = mount(PaginatorRange, { props: { params: { total: 100, size: 10, page: 1 }}});
    await flushPromises()
  
    const nextButton = wrapper.find('[data-button="next"]');
    await nextButton.trigger('click');
  
    expect(wrapper.emitted('p-range')).toHaveLength(1);
    expect(wrapper.emitted('p-range')[0]).toEqual([{ page: 2, size: 10 }]);
  });

  it('click next previous', async () => {
    const wrapper = mount(PaginatorRange, { props: { params: { total: 100, size: 10, page: 2 }}});
    await flushPromises()
  
    const nextButton = wrapper.find('[data-button="previous"]');
    await nextButton.trigger('click');
  
    expect(wrapper.emitted('p-range')).toHaveLength(1);
    expect(wrapper.emitted('p-range')[0]).toEqual([{ page: 1, size: 10 }]);
  });

  it('emit p-range event', async () => {
    const wrapper = mount(PaginatorRange, { props: { params: { total: 100, size: 10, page: 0 } } });
    await flushPromises()

    const rangeInput = wrapper.find('input[type="range"]');
  
    // Change le slider à la page 5
    await rangeInput.setValue(5);

    expect(wrapper.emitted('p-range')).toHaveLength(1);
    expect(wrapper.emitted('p-range')[0]).toEqual([{ page: 5, size: 10 }]);
  });
  it('last page', async () => {
    const wrapper = mount(PaginatorRange, {props: { params: { total: 100, size: 10, page: 100 }}})
    await flushPromises()

    const rangeInput = wrapper.find('input[type="range"]');
    // Change le slider à la page 5
    await rangeInput.setValue(10);

    const prev_button = wrapper.find('[data-button="previous"]')
    expect(prev_button.attributes('disabled')).not.toBeDefined();

    const next_button = wrapper.find('[data-button="next"]')
    expect(next_button.attributes('disabled')).toBeDefined();
  })
})
