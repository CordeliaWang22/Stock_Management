"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _i18next = _interopRequireDefault(require("i18next"));
var _storage = _interopRequireDefault(require("./storage.js"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { "default": e }; }
function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
var EN_TRANSLATIONS = {
  pageTitle: "Inventory App | Abolfazl Rahmati",
  languageToggle: "中文",
  privacyPolicy: "Privacy Policy",
  appHeading: "Inventory App With JS & TailwindCSS",
  addCategoryHeading: "Add New Category",
  titleLabel: "Title",
  descriptionLabel: "Description",
  optionalLabel: "(Optional)",
  cancelButton: "Cancel",
  addCategoryButton: "Add Category",
  categoryColumn: "Category",
  descriptionColumn: "Description",
  noCategoriesYet: "No categories have been added yet.",
  noDescription: "No description",
  categoryMetaSaved: "Saved",
  categoryMetaUpdated: "Updated",
  addProductHeading: "Add New Product",
  quantityLabel: "Quantity",
  decreaseQuantity: "Decrease quantity",
  increaseQuantity: "Increase quantity",
  locationLabel: "Location",
  selectLocation: "- select location -",
  categorySelectLabel: "Category",
  selectCategory: "- select category -",
  addProductButton: "Add Product",
  productsListHeading: "Products List",
  searchProductsLabel: "Search products",
  searchPlaceholder: "Search...",
  sortProductsLabel: "Sort products",
  sortNewest: "Newest",
  sortOldest: "Oldest",
  sortAZ: "A-Z",
  sortZA: "Z-A",
  dateColumn: "Date",
  quantityColumn: "Quantity",
  actionColumn: "Action",
  locationColumn: "Location",
  noProductsYet: "No products have been added yet.",
  categoryTitleRequired: "Category title is required.",
  categoryTitleMin: "Category title must be at least 2 characters long.",
  categoryUpdated: "This category already exists, so its description has been updated.",
  productTitleRequired: "Product title is required.",
  productTitleMin: "Product title must be at least 2 characters long.",
  locationRequired: "Please select a location.",
  categoryRequired: "Please select a category.",
  deleteProduct: "Delete",
  deleteProductAria: "Delete {{title}}",
  deleteConfirm: "Are you sure you want to delete {{title}}?",
  cookieBannerTitle: "Cookie Preferences",
  cookieBannerBody: "We use a small preference cookie and local browser storage to remember your language, inventory data, and cookie choice on this device.",
  cookieAccept: "Accept",
  cookieDecline: "Decline",
  cookieLearnMore: "Read Privacy Policy"
};
var ZH_TRANSLATIONS = {
  pageTitle: "库存管理系统 | Abolfazl Rahmati",
  languageToggle: "EN",
  privacyPolicy: "隐私政策",
  appHeading: "JavaScript 与 TailwindCSS 库存管理系统",
  addCategoryHeading: "新增类别",
  titleLabel: "标题",
  descriptionLabel: "描述",
  optionalLabel: "（选填）",
  cancelButton: "取消",
  addCategoryButton: "添加类别",
  categoryColumn: "类别",
  descriptionColumn: "描述",
  noCategoriesYet: "当前还没有已保存的类别。",
  noDescription: "暂无描述",
  categoryMetaSaved: "已保存",
  categoryMetaUpdated: "已更新",
  addProductHeading: "新增产品",
  quantityLabel: "数量",
  decreaseQuantity: "减少数量",
  increaseQuantity: "增加数量",
  locationLabel: "仓库位置",
  selectLocation: "- 请选择位置 -",
  categorySelectLabel: "所属类别",
  selectCategory: "- 请选择类别 -",
  addProductButton: "添加产品",
  productsListHeading: "产品列表",
  searchProductsLabel: "搜索产品",
  searchPlaceholder: "搜索...",
  sortProductsLabel: "排序产品",
  sortNewest: "最新",
  sortOldest: "最早",
  sortAZ: "A-Z",
  sortZA: "Z-A",
  dateColumn: "日期",
  quantityColumn: "数量",
  actionColumn: "操作",
  locationColumn: "位置",
  noProductsYet: "当前还没有已添加的产品。",
  categoryTitleRequired: "类别标题不能为空。",
  categoryTitleMin: "类别标题至少需要 2 个字符。",
  categoryUpdated: "该类别已存在，系统已更新其描述。",
  productTitleRequired: "产品标题不能为空。",
  productTitleMin: "产品标题至少需要 2 个字符。",
  locationRequired: "请选择一个位置。",
  categoryRequired: "请选择一个类别。",
  deleteProduct: "删除",
  deleteProductAria: "删除 {{title}}",
  deleteConfirm: "确认要删除 {{title}} 吗？",
  cookieBannerTitle: "Cookie 选择",
  cookieBannerBody: "我们会使用一个偏好 Cookie 和浏览器本地存储，在当前设备上记住你的语言、库存数据和 Cookie 选择。",
  cookieAccept: "接受",
  cookieDecline: "拒绝",
  cookieLearnMore: "查看隐私政策"
};
var DEFAULT_LANGUAGE = "en";
var SUPPORTED_LANGUAGES = ["en", "zh"];
function getInitialLanguage() {
  var saved = _storage["default"].getLanguage();
  if (SUPPORTED_LANGUAGES.includes(saved)) {
    return saved;
  }
  return DEFAULT_LANGUAGE;
}
_i18next["default"].init({
  lng: getInitialLanguage(),
  fallbackLng: DEFAULT_LANGUAGE,
  supportedLngs: SUPPORTED_LANGUAGES,
  resources: {
    en: {
      translation: EN_TRANSLATIONS
    },
    zh: {
      translation: ZH_TRANSLATIONS
    }
  },
  interpolation: {
    prefix: "{{",
    suffix: "}}"
  }
});
var i18n = {
  getCurrentLanguage: function getCurrentLanguage() {
    return _i18next["default"].language || DEFAULT_LANGUAGE;
  },
  setLanguage: function setLanguage(language) {
    if (!SUPPORTED_LANGUAGES.includes(language)) {
      return this.getCurrentLanguage();
    }
    _storage["default"].saveLanguage(language);
    _i18next["default"].changeLanguage(language);
    this.applyStaticTranslations();
    document.dispatchEvent(new CustomEvent("inventory:language-changed", {
      detail: {
        language: language
      }
    }));
    return language;
  },
  toggleLanguage: function toggleLanguage() {
    return this.setLanguage(this.getCurrentLanguage() === "en" ? "zh" : "en");
  },
  t: function t(key) {
    var replacements = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var i18nextOptions = {};
    Object.entries(replacements).forEach(function (_ref) {
      var _ref2 = _slicedToArray(_ref, 2),
        k = _ref2[0],
        v = _ref2[1];
      i18nextOptions[k] = v;
    });
    return _i18next["default"].t(key, i18nextOptions);
  },
  applyStaticTranslations: function applyStaticTranslations() {
    var _this = this;
    var root = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : document;
    document.documentElement.lang = this.getCurrentLanguage() === "zh" ? "zh-CN" : "en";
    root.querySelectorAll("[data-i18n]").forEach(function (element) {
      element.textContent = _this.t(element.dataset.i18n);
    });
    root.querySelectorAll("[data-i18n-placeholder]").forEach(function (element) {
      element.setAttribute("placeholder", _this.t(element.dataset.i18nPlaceholder));
    });
    root.querySelectorAll("[data-i18n-aria-label]").forEach(function (element) {
      element.setAttribute("aria-label", _this.t(element.dataset.i18nAriaLabel));
    });
    var pageTitle = root.querySelector("title");
    if (pageTitle) {
      pageTitle.textContent = this.t("pageTitle");
    }
  }
};
var _default = exports["default"] = i18n;
