import { describe, it, expect } from 'vitest';
import { codeHtml } from '@brugmann/vuemann/src/components/codeHtml/code-html-functions.js';

describe('defineChildrenVnode', () => {

    it('should return empty string when children is null', () => {
        expect(codeHtml.defineChildrenVnode(null, 0)).toMatchInlineSnapshot(`""`);
    });

    it('should format children that are not strings correctly', () => {
        const children = [
            { type: 'span', props: {}, children: 'Child 1' },
            { type: 'p', props: {}, children: 'Child 2' }
        ];
        expect(codeHtml.defineChildrenVnode(children, 0)).toMatchInlineSnapshot(`
          "  <span >
              Child 1
            </span>
            <p >
              Child 2
            </p>"
        `);
    });

    it('should format string children correctly', () => {
        const children = 'Some text content';
        expect(codeHtml.defineChildrenVnode(children, 2)).toMatchInlineSnapshot(`"    Some text content"`);
    });
});
