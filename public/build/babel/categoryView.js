"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _storage = _interopRequireDefault(require("./storage.js"));
var _i18n = _interopRequireDefault(require("./i18n.js"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { "default": e }; }
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
var CategoryView = exports["default"] = /*#__PURE__*/function () {
  function CategoryView() {
    var _this = this;
    _classCallCheck(this, CategoryView);
    // variables
    this.ctgTitleInput = document.querySelector("#categoryTitle");
    this.ctgDescInput = document.querySelector("#categoryDescription");
    this.ctgCacelBtn = document.querySelector("#categoryCanelBtn");
    this.ctgAddBtn = document.querySelector("#categoryAddNewBtn");
    this.ctgSelect = document.querySelector("#categoriesSelect");
    this.categoriesList = document.querySelector("#categoriesList");
    // event listeners
    this.ctgAddBtn.addEventListener("click", function () {
      _this.addNewCategory();
    });
    this.ctgCacelBtn.addEventListener("click", function () {
      _this.resetCategoryInputs();
    });
    this.ctgTitleInput.addEventListener("input", function () {
      _this.ctgTitleInput.setCustomValidity("");
    });
  }
  return _createClass(CategoryView, [{
    key: "setupApp",
    value: function setupApp() {
      this.instantCtgUpdate(_storage["default"].getCategories());
    }
  }, {
    key: "resetCategoryInputs",
    value: function resetCategoryInputs() {
      this.ctgTitleInput.value = "";
      this.ctgDescInput.value = "";
      this.ctgTitleInput.setCustomValidity("");
    }
  }, {
    key: "persistCategories",
    value: function persistCategories(categories) {
      _storage["default"].saveCategories(categories);
      this.instantCtgUpdate(categories);
    }
  }, {
    key: "validateCategoryForm",
    value: function validateCategoryForm() {
      var normalizedTitle = this.ctgTitleInput.value.trim();
      if (!normalizedTitle) {
        this.ctgTitleInput.setCustomValidity(_i18n["default"].t("categoryTitleRequired"));
        this.ctgTitleInput.reportValidity();
        return false;
      }
      if (normalizedTitle.length < 2) {
        this.ctgTitleInput.setCustomValidity(_i18n["default"].t("categoryTitleMin"));
        this.ctgTitleInput.reportValidity();
        return false;
      }
      this.ctgTitleInput.setCustomValidity("");
      return true;
    }
  }, {
    key: "addNewCategory",
    value: function addNewCategory() {
      if (!this.validateCategoryForm()) {
        return;
      }
      var normalizedTitle = this.ctgTitleInput.value.trim();
      var normalizedDescription = this.ctgDescInput.value.trim();

      // save category to local storage
      var savedCategories = _storage["default"].getCategories();
      var existedItem = savedCategories.find(function (c) {
        return c.title === normalizedTitle;
      });
      if (existedItem) {
        existedItem.title = normalizedTitle;
        existedItem.description = normalizedDescription;
        existedItem.updatedAt = new Date().toISOString();
        this.persistCategories(savedCategories);
        this.resetCategoryInputs();
        alert(_i18n["default"].t("categoryUpdated"));
      } else {
        var newCategory = {
          id: new Date().getTime(),
          title: normalizedTitle,
          description: normalizedDescription,
          createdAt: new Date().toISOString()
        };
        savedCategories.push(newCategory);
        this.persistCategories(savedCategories);
        this.resetCategoryInputs();
      }
    }
  }, {
    key: "instantCtgUpdate",
    value: function instantCtgUpdate(categories) {
      var _this2 = this;
      var ctgListTitles = categories.map(function (obj) {
        return obj.title.trim();
      });
      var defaultOption = document.createElement("option");
      defaultOption.selected = true;
      defaultOption.value = "none";
      defaultOption.textContent = _i18n["default"].t("selectCategory");
      this.ctgSelect.replaceChildren(defaultOption);
      ctgListTitles.forEach(function (option) {
        var newOption = document.createElement("option");
        newOption.value = option;
        newOption.textContent = option;
        // append new created option to select tg
        _this2.ctgSelect.append(newOption);
      });
      this.renderCategoriesList(categories);
    }
  }, {
    key: "renderCategoriesList",
    value: function renderCategoriesList(categories) {
      var categoriesFragment = document.createDocumentFragment();
      if (!categories.length) {
        var emptyItem = document.createElement("li");
        emptyItem.className = "rounded-2xl border border-dashed border-[#394247] px-4 py-4 text-sm text-stone-400 text-center";
        emptyItem.textContent = _i18n["default"].t("noCategoriesYet");
        categoriesFragment.append(emptyItem);
      }
      categories.forEach(function (category) {
        var categoryItem = document.createElement("li");
        var titleBlock = document.createElement("div");
        var descriptionBlock = document.createElement("p");
        var categoryTitle = document.createElement("p");
        var categoryMeta = document.createElement("p");
        categoryItem.className = "flex items-start justify-between gap-4 rounded-2xl border border-[#394247] px-4 py-3 text-stone-100";
        titleBlock.className = "w-2/5";
        descriptionBlock.className = "w-3/5 text-right text-sm text-stone-300";
        categoryTitle.className = "font-semibold";
        categoryMeta.className = "mt-1 text-xs uppercase tracking-[0.16em] text-stone-400";
        categoryTitle.textContent = category.title;
        categoryMeta.textContent = category.updatedAt ? _i18n["default"].t("categoryMetaUpdated") : _i18n["default"].t("categoryMetaSaved");
        descriptionBlock.textContent = category.description || _i18n["default"].t("noDescription");
        titleBlock.append(categoryTitle, categoryMeta);
        categoryItem.append(titleBlock, descriptionBlock);
        categoriesFragment.append(categoryItem);
      });
      this.categoriesList.replaceChildren(categoriesFragment);
    }
  }]);
}();
