import PaginatorClassic from "@brugmann/vuemann/src/components/paginators/PaginatorClassicComponent.vue";
import PaginatorLoadMore from "@brugmann/vuemann/src/components/paginators/PaginatorLoadMoreComponent.vue";
import PaginatorRange from "@brugmann/vuemann/src/components/paginators/PaginatorRangeComponent.vue";
import PaginatorInfinite from "@brugmann/vuemann/src/components/paginators/PaginatorInfiniteComponent.vue";
import Paginator from "@brugmann/vuemann/src/components/PaginatorComponent.vue";
import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import { mount } from "@vue/test-utils";

describe('Paginator component', () => {
  let cbMock
  beforeEach(() => cbMock = vi.fn())
  afterEach(() => vi.resetAllMocks())

  it("renders PaginatorClassic without type", async () => {
    const wrapper = mount(Paginator, {
      props: { params: { total: 100, size: 10, page: 1 }, cb: cbMock },
    });
  
    expect(wrapper.findComponent(PaginatorRange).exists()).toBe(false);
    expect(wrapper.findComponent(PaginatorInfinite).exists()).toBe(false);
    expect(wrapper.findComponent(PaginatorLoadMore).exists()).toBe(false);

    const paginatorClassic = wrapper.findComponent(PaginatorClassic);
    expect(paginatorClassic.exists()).toBe(true);

    expect(paginatorClassic.exists()).toBe(true);

    const mockPayload = { page: 20, size: 10 }
    paginatorClassic.vm.$emit("p-classic", mockPayload);

    // Vérifier que la fonction de callback est appelée si fournie
    expect(cbMock).toHaveBeenCalledOnce();
    expect(cbMock).toHaveBeenCalledWith(mockPayload.page, mockPayload.size);
  });

  it("renders PaginatorClassic when type is 'classic'", async () => {
    const wrapper = mount(Paginator, {
      props: { type: "classic", params: { total: 100, size: 10, page: 1 }, cb: cbMock },
    });
  
    expect(wrapper.findComponent(PaginatorRange).exists()).toBe(false);
    expect(wrapper.findComponent(PaginatorInfinite).exists()).toBe(false);
    expect(wrapper.findComponent(PaginatorLoadMore).exists()).toBe(false);

    const paginatorClassic = wrapper.findComponent(PaginatorClassic);
    expect(paginatorClassic.exists()).toBe(true);

    expect(paginatorClassic.exists()).toBe(true);

    const mockPayload = { page: 20, size: 10 }
    paginatorClassic.vm.$emit("p-classic", mockPayload);

    // Vérifier que la fonction de callback est appelée si fournie
    expect(cbMock).toHaveBeenCalledOnce();
    expect(cbMock).toHaveBeenCalledWith(mockPayload.page, mockPayload.size);
  });

  it("renders PaginatorLoadMore when type is 'load-more'", async () => {
    const wrapper = mount(Paginator, {
      props: { type: "load-more", params: { total: 100, size: 10, page: 1 }, cb: cbMock },
    });
  
    expect(wrapper.findComponent(PaginatorClassic).exists()).toBe(false);
    expect(wrapper.findComponent(PaginatorRange).exists()).toBe(false);
    expect(wrapper.findComponent(PaginatorInfinite).exists()).toBe(false);

    const paginatorLoadMore = wrapper.findComponent(PaginatorLoadMore);
    expect(paginatorLoadMore.exists()).toBe(true);

    expect(paginatorLoadMore.exists()).toBe(true);

    const mockPayload = { page: 2, size: 10 }
    paginatorLoadMore.vm.$emit("p-loadmore", mockPayload);

    // Vérifier que la fonction de callback est appelée si fournie
    expect(cbMock).toHaveBeenCalledOnce();
    expect(cbMock).toHaveBeenCalledWith(mockPayload.page, mockPayload.size);
  });
  

  it("renders PaginatorRange when type is 'range'", async () => {
    const wrapper = mount(Paginator, {
      props: { type: "range", params: { total: 100, size: 10, page: 1 }, cb: cbMock },
    });
  
    expect(wrapper.findComponent(PaginatorClassic).exists()).toBe(false);
    expect(wrapper.findComponent(PaginatorLoadMore).exists()).toBe(false);
    expect(wrapper.findComponent(PaginatorInfinite).exists()).toBe(false);

    const paginatorRange = wrapper.findComponent(PaginatorRange);
    expect(paginatorRange.exists()).toBe(true);

    const mockPayload = { page: 20, size: 10 }
    paginatorRange.vm.$emit("p-range", mockPayload);

    // Vérifier que la fonction de callback est appelée si fournie
    expect(cbMock).toHaveBeenCalledOnce();
    expect(cbMock).toHaveBeenCalledWith(mockPayload.page, mockPayload.size);
  });
  
  it("renders PaginatorInfinite when type is 'infinite'", () => {
    const wrapper = mount(Paginator, {
      props: { type: "infinite", params: { total: 100, size: 10, page: 0 }, cb: cbMock },
    });
  
    const infiniteComponent = wrapper.findComponent(PaginatorInfinite);
    expect(infiniteComponent.exists()).toBe(true);
    expect(wrapper.findComponent(PaginatorClassic).exists()).toBe(false);
    expect(wrapper.findComponent(PaginatorLoadMore).exists()).toBe(false);
    expect(wrapper.findComponent(PaginatorRange).exists()).toBe(false);
  });

  it("renders slot content when type is 'infinite'", () => {
    const wrapper = mount(Paginator, {
      props: { type: "infinite", params: { total: 100, size: 10, page: 0 }, cb: cbMock },
      slots: { default: "<div class='slot-content'>Slot Content</div>" },
    });
  
    expect(wrapper.html()).toContain("Slot Content");
    expect(wrapper.find(".slot-content").exists()).toBe(true);
  });
})
