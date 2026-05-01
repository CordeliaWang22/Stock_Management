import CategoryView from '../categoryView';
import Storage from '../storage';

// i18n 
jest.mock('../i18n', () => ({
  t: jest.fn(),
}));

import i18n from '../i18n';

// Storage
jest.mock('../storage', () => ({
  getCategories: jest.fn(),
  saveCategories: jest.fn(),
}));

describe('CategoryView', () => {
  let categoryView;
  let mockElements;

  beforeEach(() => {
    i18n.t.mockImplementation((key) => {
      const translations = {
        categoryTitleRequired: 'Category title is required.',
        categoryTitleMin: 'Category title must be at least 2 characters long.',
        selectCategory: '- select category -',
        noCategoriesYet: 'No categories have been added yet.',
        categoryMetaUpdated: 'Updated',
        categoryMetaSaved: 'Saved',
        noDescription: 'No description',
        categoryUpdated: 'Category updated',
      };
      return translations[key] || key;
    });

    // DOM
    document.body.innerHTML = `
      <input id="categoryTitle" />
      <textarea id="categoryDescription"></textarea>
      <button id="categoryCanelBtn"></button>
      <button id="categoryAddNewBtn"></button>
      <select id="categoriesSelect"></select>
      <ul id="categoriesList"></ul>
    `;

    categoryView = new CategoryView();

    mockElements = {
      titleInput: document.querySelector('#categoryTitle'),
      descInput: document.querySelector('#categoryDescription'),
      cancelBtn: document.querySelector('#categoryCanelBtn'),
      addBtn: document.querySelector('#categoryAddNewBtn'),
      select: document.querySelector('#categoriesSelect'),
      list: document.querySelector('#categoriesList'),
    };

    jest.spyOn(mockElements.titleInput, 'setCustomValidity');
    jest.spyOn(mockElements.titleInput, 'reportValidity');

    // mock alert
    global.alert = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
    delete global.alert;
  });

  describe('Initialization', () => {
    test('constructor should correctly bind DOM elements', () => {
      expect(categoryView.ctgTitleInput).toBe(mockElements.titleInput);
      expect(categoryView.ctgDescInput).toBe(mockElements.descInput);
      expect(categoryView.ctgCacelBtn).toBe(mockElements.cancelBtn);
      expect(categoryView.ctgAddBtn).toBe(mockElements.addBtn);
      expect(categoryView.ctgSelect).toBe(mockElements.select);
      expect(categoryView.categoriesList).toBe(mockElements.list);
    });
  });

  describe('resetCategoryInputs', () => {
    test('should clear input fields and remove custom validity message', () => {
      mockElements.titleInput.value = 'Test';
      mockElements.descInput.value = 'Description';
      mockElements.titleInput.setCustomValidity('some error');

      categoryView.resetCategoryInputs();

      expect(mockElements.titleInput.value).toBe('');
      expect(mockElements.descInput.value).toBe('');
      expect(mockElements.titleInput.setCustomValidity).toHaveBeenCalledWith('');
    });
  });

  describe('validateCategoryForm', () => {
    test('should return false and set custom validity when title is empty', () => {
      mockElements.titleInput.value = '   ';
      const result = categoryView.validateCategoryForm();
      expect(result).toBe(false);
      expect(mockElements.titleInput.setCustomValidity).toHaveBeenCalledWith('Category title is required.');
      expect(mockElements.titleInput.reportValidity).toHaveBeenCalled();
    });

    test('should return false when title length is less than 2', () => {
      mockElements.titleInput.value = 'a';
      const result = categoryView.validateCategoryForm();
      expect(result).toBe(false);
      expect(mockElements.titleInput.setCustomValidity).toHaveBeenCalledWith('Category title must be at least 2 characters long.');
      expect(mockElements.titleInput.reportValidity).toHaveBeenCalled();
    });

    test('should return true for valid title', () => {
      mockElements.titleInput.value = 'Valid Title';
      const result = categoryView.validateCategoryForm();
      expect(result).toBe(true);
      expect(mockElements.titleInput.setCustomValidity).toHaveBeenCalledWith('');
    });
  });

  describe('addNewCategory', () => {
    test('should not add category when validation fails', () => {
      mockElements.titleInput.value = '';
      const spyValidate = jest.spyOn(categoryView, 'validateCategoryForm');
      Storage.getCategories.mockReturnValue([]);

      categoryView.addNewCategory();

      expect(spyValidate).toHaveBeenCalled();
      expect(Storage.saveCategories).not.toHaveBeenCalled();
    });

    test('should add a new category when it does not exist', () => {
      mockElements.titleInput.value = 'New Cat';
      mockElements.descInput.value = 'New Desc';
      Storage.getCategories.mockReturnValue([]);

      categoryView.addNewCategory();

      expect(Storage.saveCategories).toHaveBeenCalledTimes(1);
      const savedCategories = Storage.saveCategories.mock.calls[0][0];
      expect(savedCategories).toHaveLength(1);
      expect(savedCategories[0].title).toBe('New Cat');
      expect(savedCategories[0].description).toBe('New Desc');
      expect(mockElements.titleInput.value).toBe('');
      expect(mockElements.descInput.value).toBe('');
    });

    test('should update an existing category', () => {
      const existingCategory = {
        id: 123,
        title: 'Existing',
        description: 'Old Desc',
        createdAt: '2024-01-01T00:00:00.000Z',
      };
      Storage.getCategories.mockReturnValue([existingCategory]);
      mockElements.titleInput.value = 'Existing';
      mockElements.descInput.value = 'New Desc';

      categoryView.addNewCategory();

      expect(Storage.saveCategories).toHaveBeenCalledTimes(1);
      const savedCategories = Storage.saveCategories.mock.calls[0][0];
      expect(savedCategories).toHaveLength(1);
      expect(savedCategories[0].description).toBe('New Desc');
      expect(savedCategories[0].updatedAt).toBeDefined();
      expect(global.alert).toHaveBeenCalledWith('Category updated');
    });
  });

  describe('persistCategories', () => {
    test('should save categories and update the UI', () => {
      const categories = [{ title: 'Cat1' }, { title: 'Cat2' }];
      const spyInstantUpdate = jest.spyOn(categoryView, 'instantCtgUpdate');

      categoryView.persistCategories(categories);

      expect(Storage.saveCategories).toHaveBeenCalledWith(categories);
      expect(spyInstantUpdate).toHaveBeenCalledWith(categories);
    });
  });

  describe('instantCtgUpdate', () => {
    test('should update dropdown and category list based on categories', () => {
      const categories = [
        { title: 'Food', description: 'Eat' },
        { title: 'Drink', description: 'Sip' },
      ];
      categoryView.instantCtgUpdate(categories);

      const options = mockElements.select.querySelectorAll('option');
      expect(options.length).toBe(3);
      expect(options[0].value).toBe('none');
      expect(options[0].textContent).toBe('- select category -');
      expect(options[1].value).toBe('Food');
      expect(options[1].textContent).toBe('Food');
      expect(options[2].value).toBe('Drink');
      expect(options[2].textContent).toBe('Drink');

      const listItems = mockElements.list.querySelectorAll('li');
      expect(listItems.length).toBe(2);
      expect(listItems[0].textContent).toContain('Food');
      expect(listItems[0].textContent).toContain('Eat');
    });
  });

  describe('renderCategoriesList', () => {
    test('should display a message when category list is empty', () => {
      categoryView.renderCategoriesList([]);
      const emptyItem = mockElements.list.querySelector('li');
      expect(emptyItem).not.toBeNull();
      expect(emptyItem.textContent).toBe('No categories have been added yet.');
    });

    test('should correctly render each category when there are categories', () => {
      const categories = [
        { title: 'Books', description: 'Read', createdAt: '2024-01-01T00:00:00.000Z' },
        { title: 'Movies', description: 'Watch', updatedAt: '2024-02-01T00:00:00.000Z' },
      ];
      categoryView.renderCategoriesList(categories);

      const items = mockElements.list.querySelectorAll('li');
      expect(items.length).toBe(2);

      const desc1 = items[0].querySelector('p.w-3\\/5');
      const desc2 = items[1].querySelector('p.w-3\\/5');
      expect(desc1.textContent).toBe('Read');
      expect(desc2.textContent).toBe('Watch');

      const noDescCategory = { title: 'NoDesc' };
      categoryView.renderCategoriesList([noDescCategory]);
      const descElement = mockElements.list.querySelector('li p.w-3\\/5');
      expect(descElement.textContent).toBe('No description');
    });
  });

  describe('setupApp', () => {
    test('should get categories from Storage and call instantCtgUpdate', () => {
      const mockCategories = [{ title: 'Test' }];
      Storage.getCategories.mockReturnValue(mockCategories);
      const spyInstantUpdate = jest.spyOn(categoryView, 'instantCtgUpdate');

      categoryView.setupApp();

      expect(Storage.getCategories).toHaveBeenCalled();
      expect(spyInstantUpdate).toHaveBeenCalledWith(mockCategories);
    });
  });
});