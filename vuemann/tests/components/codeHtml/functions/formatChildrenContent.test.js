import { describe, it, expect } from 'vitest';
import { codeHtml } from '@brugmann/vuemann/src/components/codeHtml/code-html-functions.js';

describe('formatChildrenContent', () => {
    it('should return empty string for empty children content', () => {
        expect(codeHtml.formatChildrenContent('', '')).toBe('');
    });

    it('should format children with new lines and indentation', () => {
        const childrenContent = 'Child content';
        const spaces = '  ';
        expect(codeHtml.formatChildrenContent(childrenContent, spaces)).toMatchInlineSnapshot(`
          "
          Child content
            "
        `);
    });

    it('should return children content correctly without additional indentation', () => {
        const childrenContent = 'Single line content';
        expect(codeHtml.formatChildrenContent(childrenContent, '')).toMatchInlineSnapshot(`
          "
          Single line content
          "
        `);
    });
});
