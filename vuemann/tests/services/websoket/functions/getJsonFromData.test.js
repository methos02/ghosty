import { describe, it, expect, vi } from 'vitest';
import { websocketFunctions, websocketFunctionsInternal } from '@brugmann/vuemann/src/services/websocket/src/websocket-functions.js';
import { beforeEach, afterEach } from 'vitest';

afterEach(() => {
    vi.resetAllMocks()
})

describe('getJsonFromData', () => {
  it('should return a JavaScript object when input is a valid JSON string', () => {
    const validJsonString = '{"name": "John", "age": 30}';
    const result = websocketFunctions.getJsonFromData(validJsonString);

    expect(result).toEqual({ name: 'John', age: 30 });
  });

  it('should return false when input is not a valid JSON string', () => {
    const invalidJsonString = 'This is not a JSON string';
    expect(websocketFunctions.getJsonFromData(invalidJsonString)).toBe(false);
  });

  it('should return false when input is null, empty or undefined', () => {
    expect(websocketFunctions.getJsonFromData('')).toBe(false);
    expect(websocketFunctions.getJsonFromData(null)).toBe(null);
    expect(websocketFunctions.getJsonFromData(undefined)).toBe(false);
  });
});
  
