import { describe, it, expect, vi, afterEach } from 'vitest';
import { codeHtml } from '@brugmann/vuemann/src/components/codeHtml/code-html-functions.js'; 

describe('stringifyAttributes', () => {

    afterEach(() => vi.resetAllMocks());

    it('should return empty string if attributes are null or undefined', () => {
        expect(codeHtml.stringifyAttributes(null)).toBe('');
        expect(codeHtml.stringifyAttributes(undefined)).toBe('');
    });

    it('should correctly format attributes', () => {
        const attributes = { class: 'my-class', id: 'my-id' };
        expect(codeHtml.stringifyAttributes(attributes)).toBe(' class="my-class" id="my-id"');
    });

    it('should handle attributes with empty values', () => {
        const attributes = { disabled: '', placeholder: 'Enter text' };
        expect(codeHtml.stringifyAttributes(attributes)).toBe(' disabled placeholder="Enter text"');
    });

    it('should call stringifyObjectAttributes for object type attributes', () => {
        const style = { width: "125px" };
        
        vi.spyOn(codeHtml, 'stringifyObjectAttributes').mockReturnValue('style="width:125px;"');   

        expect(codeHtml.stringifyAttributes({ style })).toBe(' style="width:125px;"');
        expect(codeHtml.stringifyObjectAttributes).toHaveBeenCalledWith('style', style);
    });

    it('should correctly handle multiple attributes including object attributes', () => {
        const styleObj = { width: "125px" };
        const dataObj = { info: "test" };
    
        vi.spyOn(codeHtml, 'stringifyObjectAttributes')
        .mockReturnValueOnce('style="width:125px;"')
        .mockReturnValueOnce('data="info:test;"');
    
        const attributes = {
          class: 'example',
          style: styleObj,
          data: dataObj,
          disabled: ''
        };
        
        const result = codeHtml.stringifyAttributes(attributes)

        expect(codeHtml.stringifyObjectAttributes).toHaveBeenNthCalledWith(1, 'style', styleObj);
        expect(codeHtml.stringifyObjectAttributes).toHaveBeenNthCalledWith(2, 'data', dataObj);

        expect(result)
          .toBe(' class="example" style="width:125px;" data="info:test;" disabled');
    
      });
});
