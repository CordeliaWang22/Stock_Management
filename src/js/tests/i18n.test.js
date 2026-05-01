import Storage from '../storage.js';
import i18n from '../i18n.js';

jest.mock('../storage.js', () => ({
  getLanguage: jest.fn(),
  saveLanguage: jest.fn(),
}));

describe('I18n class tests', () => {
  let mockStorageLang = 'en';

  beforeEach(() => {
    jest.clearAllMocks();
    mockStorageLang = 'en';

    Storage.getLanguage.mockImplementation(() => mockStorageLang);
    Storage.saveLanguage.mockImplementation((lang) => {
      mockStorageLang = lang;
    });

    i18n.setLanguage(mockStorageLang);
    Storage.saveLanguage.mockClear();

    document.documentElement.lang = '';
    document.title = '';
    document.body.innerHTML = '';
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('getCurrentLanguage should return saved language if it is supported', () => {
    i18n.setLanguage('zh');
    expect(i18n.getCurrentLanguage()).toBe('zh');
  });

  test('getCurrentLanguage should fallback to default when saved language is not supported', () => {
    mockStorageLang = 'fr';
    const current = i18n.getCurrentLanguage();
    const result = i18n.setLanguage('fr');
    expect(result).toBe(current);
    expect(i18n.getCurrentLanguage()).toBe(current);
  });

  test('getCurrentLanguage should return default language if saved language is not supported (simulate initial load)', () => {
    expect(i18n.getCurrentLanguage()).toBe('en');
  });

  test('getCurrentLanguage should return default language if no saved language', () => {
    mockStorageLang = undefined;
    i18n.setLanguage(undefined);
    expect(i18n.getCurrentLanguage()).toBe('en');
  });

  test('setLanguage should set a valid language and apply translations', () => {
    const spyApply = jest.spyOn(i18n, 'applyStaticTranslations');
    const result = i18n.setLanguage('zh');
    expect(result).toBe('zh');
    expect(Storage.saveLanguage).toHaveBeenCalledWith('zh');
    expect(mockStorageLang).toBe('zh');
    expect(i18n.getCurrentLanguage()).toBe('zh');
    expect(spyApply).toHaveBeenCalled();
    spyApply.mockRestore();
  });

  test('setLanguage with same language should still save and apply', () => {
    const spyApply = jest.spyOn(i18n, 'applyStaticTranslations');
    const result = i18n.setLanguage('en');
    expect(result).toBe('en');
    expect(Storage.saveLanguage).toHaveBeenCalledWith('en');
    expect(spyApply).toHaveBeenCalled();
    spyApply.mockRestore();
  });

  test('setLanguage with unsupported language should return current language and not save', () => {
    expect(mockStorageLang).toBe('en');
    Storage.saveLanguage.mockClear();
    const spyApply = jest.spyOn(i18n, 'applyStaticTranslations');

    const result = i18n.setLanguage('de');
    expect(result).toBe('en');
    expect(Storage.saveLanguage).not.toHaveBeenCalled();
    expect(spyApply).not.toHaveBeenCalled();
    expect(mockStorageLang).toBe('en');
    spyApply.mockRestore();
  });

  test('toggleLanguage should toggle between "en" and "zh"', () => {
    i18n.setLanguage('en');
    Storage.saveLanguage.mockClear();

    const result1 = i18n.toggleLanguage();
    expect(result1).toBe('zh');
    expect(i18n.getCurrentLanguage()).toBe('zh');
    expect(Storage.saveLanguage).toHaveBeenCalledWith('zh');

    Storage.saveLanguage.mockClear();
    const result2 = i18n.toggleLanguage();
    expect(result2).toBe('en');
    expect(i18n.getCurrentLanguage()).toBe('en');
    expect(Storage.saveLanguage).toHaveBeenCalledWith('en');
  });

  test('t should return translation for given key', () => {
    i18n.setLanguage('en');
    expect(i18n.t('pageTitle')).toBe('Inventory App | Abolfazl Rahmati');

    i18n.setLanguage('zh');
    expect(i18n.t('pageTitle')).toBe('库存管理系统 | Abolfazl Rahmati');
  });

  test('t should fallback to default language if key missing in current language', () => {
    i18n.setLanguage('zh');
    expect(i18n.t('nonExistentKey')).toBe('nonExistentKey');
  });

  test('t should perform replacements', () => {
    i18n.setLanguage('en');
    const result = i18n.t('deleteProductAria', { title: 'MyProduct' });
    expect(result).toBe('Delete MyProduct');
  });

  test('applyStaticTranslations should set the correct lang attribute in the document', () => {
    i18n.setLanguage('zh');
    i18n.applyStaticTranslations();
    expect(document.documentElement.lang).toBe('zh-CN');

    i18n.setLanguage('en');
    i18n.applyStaticTranslations();
    expect(document.documentElement.lang).toBe('en');
  });

  test('applyStaticTranslations should update page title', () => {
    const titleEl = document.createElement('title');
    document.head.appendChild(titleEl);
    i18n.setLanguage('zh');
    i18n.applyStaticTranslations();
    expect(document.title).toBe('库存管理系统 | Abolfazl Rahmati');
  });

  test('applyStaticTranslations should translate elements with data-i18n attribute', () => {
    const div = document.createElement('div');
    div.setAttribute('data-i18n', 'cancelButton');
    document.body.appendChild(div);
    i18n.setLanguage('zh');
    i18n.applyStaticTranslations();
    expect(div.textContent).toBe('取消');
  });

  test('applyStaticTranslations should set placeholder for data-i18n-placeholder', () => {
    const input = document.createElement('input');
    input.setAttribute('data-i18n-placeholder', 'searchPlaceholder');
    document.body.appendChild(input);
    i18n.setLanguage('zh');
    i18n.applyStaticTranslations();
    expect(input.placeholder).toBe('搜索...');
  });

  test('applyStaticTranslations should set aria-label for data-i18n-aria-label', () => {
    const btn = document.createElement('button');
    btn.setAttribute('data-i18n-aria-label', 'deleteProductAria');
    btn.setAttribute('data-i18n', '');
    document.body.appendChild(btn);
    i18n.setLanguage('en');
    i18n.applyStaticTranslations();
    expect(btn.getAttribute('aria-label')).toBe('Delete {{title}}');
  });

  test('setLanguage should dispatch inventory:language-changed event', () => {
    const eventListener = jest.fn();
    document.addEventListener('inventory:language-changed', eventListener);
    i18n.setLanguage('zh');
    expect(eventListener).toHaveBeenCalledTimes(1);
    const event = eventListener.mock.calls[0][0];
    expect(event.detail.language).toBe('zh');
  });
});