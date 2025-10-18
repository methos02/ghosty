import { describe, it, expect } from 'vitest';
import { codeHtml } from '@brugmann/vuemann/src/components/codeHtml/code-html-functions.js';

describe('isSelfClosing', () => {
    for(const tag of ["img", "input", "br", "hr", "meta", "link"]) {
        it('should return true for ' + tag, () => {
            expect(codeHtml.isSelfClosing(tag)).toBe(true);
        });
    }

    it('should return false for non-void elements (e.g. div, p)', () => {
        expect(codeHtml.isSelfClosing('div')).toBe(false);
        expect(codeHtml.isSelfClosing('p')).toBe(false);
    });

    it('should return true for custom components with no children', () => {
        expect(codeHtml.isSelfClosing('IconConfirm', '')).toBe(true);
        expect(codeHtml.isSelfClosing('CustomComponent', '')).toBe(true);
    });

    it('should return false for custom components with children', () => {
        expect(codeHtml.isSelfClosing('CustomComponentWithChildren')).toBe(false);
    });
});
