import { describe, it, expect } from 'vitest';
import { codeHtml } from '@brugmann/vuemann/src/components/codeHtml/code-html-functions.js';

describe('formatSelfClosingTag', () => {

    it('render with one props', () => {
        expect(codeHtml.formatSelfClosingTag('img', ' src="image.jpg"', 0)).toMatchInlineSnapshot(`
          "<img
            src="image.jpg"
          />"
        `);
    });

    it('render with multie props', () => {
        expect(codeHtml.formatSelfClosingTag('IconConfirm', ' class="fa-solid fa-trash" :cb="iconConfirm"', 0)).toMatchInlineSnapshot(`
          "<IconConfirm
            class="fa-solid
            fa-trash"
            :cb="iconConfirm"
          />"
        `);
    });
});
