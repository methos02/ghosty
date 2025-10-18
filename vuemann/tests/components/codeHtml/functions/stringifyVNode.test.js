import { describe, it, expect } from 'vitest';
import { codeHtml } from '@brugmann/vuemann/src/components/codeHtml/code-html-functions.js'; 

describe('stringifyVNode', () => {
    it('should stringify a self-closing tag correctly', () => {
        const vnode = {
            type: 'img',
            props: { src: 'image.jpg' },
            children: null
        };
        expect(codeHtml.stringifyVNode(vnode)).toMatchInlineSnapshot(`
          "<img
            src="image.jpg"
          />"
        `);
    });

    it('should handle children and generate proper indentation', () => {
        const vnode = {
            type: 'div',
            props: {},
            children: [
                { type: 'span', props: {}, children: 'Hello' }
            ]
        };
        expect(codeHtml.stringifyVNode(vnode)).toMatchInlineSnapshot(`
          "<div >
            <span >
              Hello
            </span>
          </div>"
        `);
    });

    it('should format nested children correctly', () => {
        const vnode = {
            type: 'div',
            props: {},
            children: [
                {
                    type: 'p',
                    props: {},
                    children: 'Nested paragraph'
                }
            ]
        };
        expect(codeHtml.stringifyVNode(vnode)).toMatchInlineSnapshot(`
          "<div >
            <p >
              Nested paragraph
            </p>
          </div>"
        `);
    });
});
