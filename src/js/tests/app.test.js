import '../app';
import ProductView from '../productView';
import CategoryView from '../categoryView';
import i18n from '../i18n';
import Storage from '../storage';

// Mock 
jest.mock('../productView', () => ({
  __esModule: true,
  default: jest.fn().mockImplementation(() => ({
    setupApp: jest.fn(),
    sortBySelect: jest.fn(),
    updateQuantityControls: jest.fn(),
    sortSelect: { value: 'default' },
  })),
}));

jest.mock('../categoryView', () => ({
  __esModule: true,
  default: jest.fn().mockImplementation(() => ({
    setupApp: jest.fn(),
  })),
}));

jest.mock('../i18n', () => ({
  __esModule: true,
  default: {
    applyStaticTranslations: jest.fn(),
    toggleLanguage: jest.fn(),
  },
}));

jest.mock('../storage', () => ({
  __esModule: true,
  default: {
    getCookieConsent: jest.fn(),
    saveCookieConsent: jest.fn(),
  },
}));

function createDOMStructure() {
  document.body.innerHTML = `
    <div id="cookieBanner"></div>
    <button id="cookieAcceptBtn"></button>
    <button id="cookieDeclineBtn"></button>
    <button id="languageToggle"></button>
  `;
}

function triggerDOMContentLoaded() {
  const event = new Event('DOMContentLoaded');
  document.dispatchEvent(event);
}

describe('app.js', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    createDOMStructure();
  });

  describe('Initialization', () => {
    test('should create ProductView and CategoryView instances and call setupApp on DOMContentLoaded', () => {
      triggerDOMContentLoaded();

      const productViewInstance = ProductView.mock.results[0]?.value;
      const categoryViewInstance = CategoryView.mock.results[0]?.value;

      expect(ProductView).toHaveBeenCalledTimes(1);
      expect(CategoryView).toHaveBeenCalledTimes(1);
      expect(productViewInstance.setupApp).toHaveBeenCalledTimes(1);
      expect(categoryViewInstance.setupApp).toHaveBeenCalledTimes(1);
    });

    test('should call i18n.applyStaticTranslations and setupCookieBanner', () => {
      triggerDOMContentLoaded();

      expect(i18n.applyStaticTranslations).toHaveBeenCalled();
      expect(Storage.getCookieConsent).toHaveBeenCalled();
    });
  });

  describe('Cookie Banner', () => {
    test('should show cookie banner when user has not consented', () => {
      Storage.getCookieConsent.mockReturnValue(null);
      triggerDOMContentLoaded();

      const banner = document.querySelector('#cookieBanner');
      expect(banner.classList.contains('hidden')).toBe(false);
    });

    test('should hide cookie banner when user has accepted', () => {
      Storage.getCookieConsent.mockReturnValue('accepted');
      triggerDOMContentLoaded();

      const banner = document.querySelector('#cookieBanner');
      expect(banner.classList.contains('hidden')).toBe(true);
    });

    test('should hide cookie banner when user has declined', () => {
      Storage.getCookieConsent.mockReturnValue('declined');
      triggerDOMContentLoaded();
      expect(document.querySelector('#cookieBanner').classList.contains('hidden')).toBe(true);
    });

    test('clicking accept button should save consent and hide banner', () => {
      Storage.getCookieConsent.mockReturnValue(null);
      triggerDOMContentLoaded();

      const acceptBtn = document.querySelector('#cookieAcceptBtn');
      const banner = document.querySelector('#cookieBanner');

      acceptBtn.click();

      expect(Storage.saveCookieConsent).toHaveBeenCalledWith('accepted');
      expect(banner.classList.contains('hidden')).toBe(true);
    });

    test('clicking decline button should save decline and hide banner', () => {
      Storage.getCookieConsent.mockReturnValue(null);
      triggerDOMContentLoaded();

      const declineBtn = document.querySelector('#cookieDeclineBtn');
      const banner = document.querySelector('#cookieBanner');

      declineBtn.click();

      expect(Storage.saveCookieConsent).toHaveBeenCalledWith('declined');
      expect(banner.classList.contains('hidden')).toBe(true);
    });
  });

  describe('Language Toggle', () => {
    test('clicking language toggle button should call i18n.toggleLanguage', () => {
      triggerDOMContentLoaded();
      const langToggle = document.querySelector('#languageToggle');

      langToggle.click();

      expect(i18n.toggleLanguage).toHaveBeenCalledTimes(1);
    });
  });

  describe('Custom event inventory:language-changed', () => {
    let productViewInstance;
    let categoryViewInstance;

    beforeEach(() => {
      triggerDOMContentLoaded();
      productViewInstance = ProductView.mock.results[0]?.value;
      categoryViewInstance = CategoryView.mock.results[0]?.value;
      
      i18n.applyStaticTranslations.mockClear();
      categoryViewInstance.setupApp.mockClear();
    });

    test('should call i18n.applyStaticTranslations and categoryView.setupApp when event is dispatched', () => {
      const event = new Event('inventory:language-changed');
      document.dispatchEvent(event);

      expect(i18n.applyStaticTranslations).toHaveBeenCalled();
      expect(categoryViewInstance.setupApp).toHaveBeenCalled();
    });

    test('should not throw error if languageToggle button is missing during initialization', () => {
      document.querySelector('#languageToggle')?.remove();
      expect(() => triggerDOMContentLoaded()).not.toThrow();
    });

    test('should call productView.sortBySelect and productView.updateQuantityControls when event is dispatched', () => {
      productViewInstance.sortSelect = { value: 'price-desc' };
      const event = new Event('inventory:language-changed');
      document.dispatchEvent(event);

      expect(productViewInstance.sortBySelect).toHaveBeenCalledWith('price-desc');
      expect(productViewInstance.updateQuantityControls).toHaveBeenCalled();
    });
  });
});