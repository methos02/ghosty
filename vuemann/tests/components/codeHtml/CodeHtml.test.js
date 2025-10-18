import { mount } from "@vue/test-utils";
import { describe, it, expect, vi } from "vitest";
import CodeHtmlComponent from "@brugmann/vuemann/src/components/codeHtml/CodeHtmlComponent.vue";

describe("CodeHtmlComponent.vue", () => {
  it("renders slot content correctly", () => {
    const wrapper = mount(CodeHtmlComponent, {
      slots: {
        default: `<div class="test-slot">Hello, world!</div>`,
      },
    });

    expect(wrapper.find(".code-preview").text()).toContain('<div class="test-slot">\n  Hello, world!\n</div>');
  });

  //TODO: faire les tests du clipboard
});
