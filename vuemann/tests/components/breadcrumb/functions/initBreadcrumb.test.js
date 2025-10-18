import { describe, it, expect, vi, afterEach } from 'vitest';
import { breadcrumb } from '@brugmann/vuemann/src/components/breadcrumb/breadcrumb-functions.js';

describe('breadcrumb.init', () => {
  afterEach(() => vi.resetAllMocks())

  it('should return an empty array if route meta breadcrumb is undefined', () => {
    const route = {
      meta: {},
      matched: [
        { meta: { breadcrumb: { label: 'Home', route: 'home' } } },
      ],
    };

    const result = breadcrumb.init(route);

    expect(result).toStrictEqual([]);
  });

  it('should return an empty array if route matched meta breadcrumb is undefined', () => {
    const route = {
      meta: { breadcrumb: { label: 'Home' } },
      matched: [
        { meta: {} },
      ],
    };

    const result = breadcrumb.init(route);

    expect(result).toStrictEqual([]);
  });

  it('should return an array with a single breadcrumb if names match', () => {
    const route = {
      meta: {
        breadcrumb: { label: 'Home' },
      },
      matched: [
        { meta: { breadcrumb: { label: 'Home', route: 'home' } } },
      ],
    };

    expect(breadcrumb.init(route)).toEqual([{ label: 'Home' }]);
  });

  it('should iterate the matched', () => {
    const route = {
      meta: {
        breadcrumb: { label: 'Different' },
      },
      matched: [
        { meta: { breadcrumb: { label: 'Home', route: 'home' } } },
        { meta: { breadcrumb: { label: 'About', route: 'about' } } },
      ],
    };

    expect( breadcrumb.init(route)).toEqual([
      { label: 'Home', route: {name: 'home'} },
      { label: 'About', route: {name: 'about'} },
    ]);
  });

  it('should call resolveParents if parents are defined in route meta', () => {
    const route = {
      meta: {
        breadcrumb: {
          label: 'Child',
          parents: [
            {label : 'parent1', route: 'route1'}, 
            {label : 'parent2', route: 'route2'}
          ],
        },
      },
      matched: [
        { meta: { breadcrumb: { label: 'Home', route: 'home' } } },
      ],
    };

    vi.spyOn(breadcrumb, 'resolveParents').mockResolvedValue(true)

    breadcrumb.init(route);

    expect(breadcrumb.resolveParents).toHaveBeenCalledWith(route.meta.breadcrumb.parents, []);
  });
});
