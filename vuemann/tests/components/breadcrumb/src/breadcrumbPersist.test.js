// breadcrumbPersist.test.js

import { describe, it, expect, beforeEach } from 'vitest';
import { breadcrumbPersist } from '../../../../src/components/breadcrumb/src/breadcrumb-persist.js';

describe('breadcrumb-persist.js', () => {
  beforeEach(() => {
    sessionStorage.clear();
  });

  it('should save breadcrumb to sessionStorage', () => {
    const links = [{ label: 'Home', route: 'home' }];
    const routeName = 'home';

    breadcrumbPersist.save(links, routeName);

    expect(sessionStorage.getItem('breadcrumb')).toBe(JSON.stringify(links));
    expect(sessionStorage.getItem('breadcrumb_page')).toBe(routeName);
  })

  it('should save breadcrumb to sessionStorage', () => {
    const links = [{ label: 'Home', route: 'home' }];

    breadcrumbPersist.save(links);

    expect(sessionStorage.getItem('breadcrumb_page')).toBeNull();
  })

  it('should get breadcrumb from sessionStorage', () => {
    const links = [{ label: 'Home', route: 'home' }];
    sessionStorage.setItem('breadcrumb', JSON.stringify(links));

    const result = breadcrumbPersist.get();

    expect(result).toEqual(links);
  });

  it('should clean breadcrumb from sessionStorage', () => {
    sessionStorage.setItem('breadcrumb', JSON.stringify([{ label: 'Home', route: 'home' }]));
    sessionStorage.setItem('breadcrumb_page', 'home');

    breadcrumbPersist.clean();

    expect(sessionStorage.getItem('breadcrumb')).toBeNull();
    expect(sessionStorage.getItem('breadcrumb_page')).toBeNull();
  });

  it('should check if the current route matches the stored route', () => {
    sessionStorage.setItem('breadcrumb_page', 'home');

    expect(breadcrumbPersist.isCurrentRoute('home')).toBe(true);
    expect(breadcrumbPersist.isCurrentRoute('commands')).toBe(false);
  });

  it('should set the route name in sessionStorage', () => {
    breadcrumbPersist.setRouteName('home');
    expect(sessionStorage.getItem('breadcrumb_page')).toBe('home');
  });

  it('should get the route name from sessionStorage', () => {
    sessionStorage.setItem('breadcrumb_page', 'home');
    const result = breadcrumbPersist.routeName();

    expect(result).toBe('home');
  });
});
