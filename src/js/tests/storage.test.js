// src/js/__tests__/storage.test.js
import Storage from '../storage';

describe('Storage', () => {
  beforeEach(() => {
    localStorage.clear();
    
    document.cookie.split(';').forEach(cookie => {
      const eqPos = cookie.indexOf('=');
      const name = eqPos > -1 ? cookie.substr(0, eqPos).trim() : cookie.trim();
      document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/';
    });
  });

  describe('getProducts (getter)', () => {
    test('should return empty array when there are no products in localStorage', () => {
      expect(Storage.getProducts).toEqual([]);
    });

    test('should correctly parse and return products when they exist in localStorage', () => {
      const mockProducts = [{ id: 1, name: 'Product 1' }];
      localStorage.setItem('products', JSON.stringify(mockProducts));
      expect(Storage.getProducts).toEqual(mockProducts);
    });
  });

  describe('getCategories', () => {
    test('should return empty array when there are no categories in localStorage', () => {
      expect(Storage.getCategories()).toEqual([]);
    });

    test('should correctly parse and return categories when they exist in localStorage', () => {
      const mockCategories = [{ id: 1, title: 'Category 1' }];
      localStorage.setItem('categories', JSON.stringify(mockCategories));
      expect(Storage.getCategories()).toEqual(mockCategories);
    });
  });

  describe('saveProducts', () => {
    test('should save product list to localStorage', () => {
      const products = [{ id: 1, name: 'Test' }];
      Storage.saveProducts(products);
      const saved = JSON.parse(localStorage.getItem('products'));
      expect(saved).toEqual(products);
    });
  });

  describe('saveCategories', () => {
    test('should save category list to localStorage', () => {
      const categories = [{ id: 1, title: 'Test' }];
      Storage.saveCategories(categories);
      const saved = JSON.parse(localStorage.getItem('categories'));
      expect(saved).toEqual(categories);
    });
  });

  describe('getLanguage', () => {
    test('should return default value "en" when there is no language in localStorage', () => {
      expect(Storage.getLanguage()).toBe('en');
    });

    test('should return stored value when language exists in localStorage', () => {
      localStorage.setItem('language', 'fr');
      expect(Storage.getLanguage()).toBe('fr');
    });
  });

  describe('saveLanguage', () => {
    test('should save language to localStorage', () => {
      Storage.saveLanguage('de');
      expect(localStorage.getItem('language')).toBe('de');
    });
  });

  describe('getCookieConsent', () => {
    test('should read consent status from cookie first', () => {
      document.cookie = 'inventory_cookie_consent=accepted; path=/';
      expect(Storage.getCookieConsent()).toBe('accepted');
    });

    test('should read from localStorage if cookie does not exist', () => {
      localStorage.setItem('cookieConsent', 'declined');
      expect(Storage.getCookieConsent()).toBe('declined');
    });

    test('should return null if neither cookie nor localStorage has consent', () => {
      expect(Storage.getCookieConsent()).toBeNull();
    });
  });

  describe('saveCookieConsent', () => {
    test('should save to both cookie and localStorage', () => {
      Storage.saveCookieConsent('accepted');
      const cookieMatch = document.cookie.match(/inventory_cookie_consent=([^;]+)/);
      expect(cookieMatch ? decodeURIComponent(cookieMatch[1]) : null).toBe('accepted');
      expect(localStorage.getItem('cookieConsent')).toBe('accepted');
    });
  });

  describe('removeProduct', () => {
    test('should remove product with the given id', () => {
      const initialProducts = [
        { id: 1, name: 'Product 1' },
        { id: 2, name: 'Product 2' },
      ];
      localStorage.setItem('products', JSON.stringify(initialProducts));

      Storage.removeProduct(1);
      expect(Storage.getProducts).toEqual([{ id: 2, name: 'Product 2' }]);
    });

    test('should not change product list if product does not exist', () => {
      const products = [{ id: 1, name: 'Product 1' }];
      localStorage.setItem('products', JSON.stringify(products));

      Storage.removeProduct(999);
      expect(Storage.getProducts).toEqual(products);
    });
  });
});