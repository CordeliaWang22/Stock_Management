"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _storage = _interopRequireDefault(require("./storage.js"));
var _i18n = _interopRequireDefault(require("./i18n.js"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { "default": e }; }
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _toConsumableArray(r) { return _arrayWithoutHoles(r) || _iterableToArray(r) || _unsupportedIterableToArray(r) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _iterableToArray(r) { if ("undefined" != typeof Symbol && null != r[Symbol.iterator] || null != r["@@iterator"]) return Array.from(r); }
function _arrayWithoutHoles(r) { if (Array.isArray(r)) return _arrayLikeToArray(r); }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
var ProductView = exports["default"] = /*#__PURE__*/function () {
  function ProductView() {
    var _this = this;
    _classCallCheck(this, ProductView);
    this.quantityEnabledClass = "toggleBtn flex items-center justify-center p-1 rounded-full bg-[#273842]";
    this.quantityDisabledClass = "toggleBtn flex items-center justify-center p-1 rounded-full bg-slate-500 opacity-60 cursor-not-allowed";
    // variables
    this.pdtTitle = document.querySelector("#productTitle");
    this.pdtIncQty = document.querySelector("#incQty");
    this.pdtDecQty = document.querySelector("#decQty");
    this.pdtLocation = document.querySelector("#productLocations");
    this.ctgSelect = document.querySelector("#categoriesSelect");
    this.pdtAddNew = document.querySelector("#addNewProductBtn");
    this.pdtQty = document.querySelector("#productQuantity");
    this.productCenter = document.querySelector("#productsCenter");
    this.toggleBtns = document.querySelectorAll(".toggleBtn");
    this.searchInput = document.querySelector("#searchInput");
    this.sortSelect = document.querySelector("#sort");
    // event listeners
    this.pdtAddNew.addEventListener("click", function () {
      _this.addNewProduct();
    });
    this.toggleBtns.forEach(function (btn) {
      btn.addEventListener("click", function (e) {
        _this.toggleProductQty(e);
      });
    });
    this.searchInput.addEventListener("keyup", function (e) {
      _this.searchProducts(e.target.value);
    });
    this.sortSelect.addEventListener("change", function (e) {
      _this.sortBySelect(e.target.value);
    });
    this.pdtTitle.addEventListener("input", function () {
      _this.pdtTitle.setCustomValidity("");
    });
    this.pdtLocation.addEventListener("change", function () {
      _this.pdtLocation.setCustomValidity("");
    });
    this.ctgSelect.addEventListener("change", function () {
      _this.ctgSelect.setCustomValidity("");
    });
  }
  return _createClass(ProductView, [{
    key: "setupApp",
    value: function setupApp() {
      this.showListedProducts(_storage["default"].getProducts);
      this.sortBySelect(this.sortSelect.value);
      this.updateQuantityControls();
    }
  }, {
    key: "normalizeUserText",
    value: function normalizeUserText(value) {
      return String(value !== null && value !== void 0 ? value : "").replace(/[\u0000-\u001F\u007F]/g, "").trim();
    }
  }, {
    key: "validateRequiredTextField",
    value: function validateRequiredTextField(field, label) {
      var minimumLength = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 1;
      var normalizedValue = this.normalizeUserText(field.value);
      if (!normalizedValue) {
        field.setCustomValidity(_i18n["default"].t("".concat(label, "Required")));
        field.reportValidity();
        return false;
      }
      if (normalizedValue.length < minimumLength) {
        field.setCustomValidity(_i18n["default"].t("".concat(label, "Min")));
        field.reportValidity();
        return false;
      }
      field.setCustomValidity("");
      return true;
    }
  }, {
    key: "validateRequiredSelect",
    value: function validateRequiredSelect(field, label) {
      if (field.value === "none") {
        field.setCustomValidity(_i18n["default"].t("".concat(label, "Required")));
        field.reportValidity();
        return false;
      }
      field.setCustomValidity("");
      return true;
    }
  }, {
    key: "validateProductForm",
    value: function validateProductForm() {
      if (!this.validateRequiredTextField(this.pdtTitle, "productTitle", 2)) {
        return false;
      }
      if (!this.validateRequiredSelect(this.pdtLocation, "location")) {
        return false;
      }
      if (!this.validateRequiredSelect(this.ctgSelect, "category")) {
        return false;
      }
      return true;
    }
  }, {
    key: "resetProductForm",
    value: function resetProductForm() {
      this.pdtTitle.value = "";
      this.pdtQty.innerText = "0";
      this.pdtLocation.value = "none";
      this.ctgSelect.value = "none";
      this.pdtTitle.setCustomValidity("");
      this.pdtLocation.setCustomValidity("");
      this.ctgSelect.setCustomValidity("");
      this.updateQuantityControls();
    }
  }, {
    key: "getCurrentQuantity",
    value: function getCurrentQuantity() {
      var parsedQuantity = Number(this.pdtQty.innerText);
      if (Number.isNaN(parsedQuantity)) {
        return 0;
      }
      return Math.max(0, parsedQuantity);
    }
  }, {
    key: "updateQuantityControls",
    value: function updateQuantityControls() {
      var currentQuantity = this.getCurrentQuantity();
      var isDecrementDisabled = currentQuantity <= 0;
      this.pdtQty.innerText = String(currentQuantity);
      this.pdtDecQty.disabled = isDecrementDisabled;
      this.pdtDecQty.className = isDecrementDisabled ? this.quantityDisabledClass : this.quantityEnabledClass;
      this.pdtIncQty.className = this.quantityEnabledClass;
    }
  }, {
    key: "formatDateValue",
    value: function formatDateValue(dateInput) {
      var parsedDate = new Date(dateInput);
      if (Number.isNaN(parsedDate.getTime())) {
        return "";
      }
      var year = parsedDate.getFullYear();
      var month = String(parsedDate.getMonth() + 1).padStart(2, "0");
      var day = String(parsedDate.getDate()).padStart(2, "0");
      return "".concat(year, "-").concat(month, "-").concat(day);
    }
  }, {
    key: "formatProductDate",
    value: function formatProductDate(product) {
      if (product.createdAt) {
        return this.formatDateValue(product.createdAt);
      }
      if (!Number.isNaN(Number(product.id))) {
        return this.formatDateValue(Number(product.id));
      }
      return this.normalizeUserText(product.persianDate) || "N/A";
    }
  }, {
    key: "sortProducts",
    value: function sortProducts(productList, sortType) {
      if (sortType === "newest") {
        return productList.slice().sort(function (a, b) {
          return b.id - a.id;
        });
      }
      if (sortType === "oldest") {
        return productList.slice().sort(function (a, b) {
          return a.id - b.id;
        });
      }
      if (sortType === "A-Z") {
        return productList.slice().sort(function (a, b) {
          return a.title.toLowerCase().localeCompare(b.title.toLowerCase());
        });
      }
      if (sortType === "Z-A") {
        return productList.slice().sort(function (a, b) {
          return a.title.toLowerCase().localeCompare(b.title.toLowerCase());
        }).reverse();
      }
      return productList.slice();
    }
  }, {
    key: "addNewProduct",
    value: function addNewProduct() {
      if (!this.validateProductForm()) {
        return;
      }
      var createdAt = new Date().toISOString();
      var newProduct = {
        id: new Date().getTime(),
        title: this.normalizeUserText(this.pdtTitle.value),
        quantity: this.getCurrentQuantity(),
        location: this.normalizeUserText(this.pdtLocation.value),
        category: this.normalizeUserText(this.ctgSelect.value),
        createdAt: createdAt,
        displayDate: this.formatDateValue(createdAt)
      };
      var pdtList = _storage["default"].getProducts;
      pdtList.push(newProduct);
      _storage["default"].saveProducts(pdtList);
      this.resetProductForm();
      this.sortBySelect(this.sortSelect.value);
    }
  }, {
    key: "showListedProducts",
    value: function showListedProducts(productList) {
      var _this2 = this;
      var productsFragment = document.createDocumentFragment();
      if (!productList.length) {
        productsFragment.append(this.createEmptyStateItem());
      }
      productList.forEach(function (product) {
        productsFragment.append(_this2.createProductListItem(product));
      });
      this.productCenter.replaceChildren(productsFragment);
      this.productsAction();
    }
  }, {
    key: "createProductListItem",
    value: function createProductListItem(product) {
      var _product$quantity;
      var productItem = document.createElement("li");
      productItem.className = "flex items-center justify-between w-full py-3 border-b border-[#2b3c45] text-white font-medium ss:min-w-[500px] ss:overflow-x-auto";
      productItem.append(this.createTextCell(this.normalizeUserText(product.title)), this.createTextCell(this.normalizeUserText(product.location)), this.createTextCell(this.normalizeUserText(product.category)), this.createTextCell(this.formatProductDate(product)), this.createTextCell(String((_product$quantity = product.quantity) !== null && _product$quantity !== void 0 ? _product$quantity : ""), "basis-[16%] ww:text-base xx:text-[15px] dd:text-[14px] ss:text-[13px]"), this.createDeleteButton(product));
      return productItem;
    }
  }, {
    key: "createEmptyStateItem",
    value: function createEmptyStateItem() {
      var emptyItem = document.createElement("li");
      emptyItem.className = "w-full py-6 text-center text-stone-400 text-sm";
      emptyItem.textContent = _i18n["default"].t("noProductsYet");
      return emptyItem;
    }
  }, {
    key: "createTextCell",
    value: function createTextCell(value) {
      var className = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "basis-[16%] ww:text-base xx:text-[15px] dd:text-[14px] ss:text-[13px]";
      var textCell = document.createElement("p");
      textCell.className = className;
      textCell.textContent = value;
      return textCell;
    }
  }, {
    key: "createDeleteButton",
    value: function createDeleteButton(product) {
      var actionCell = document.createElement("div");
      var svgNamespace = "http://www.w3.org/2000/svg";
      var deleteButton = document.createElement("button");
      var deleteIcon = document.createElementNS(svgNamespace, "svg");
      var deletePath = document.createElementNS(svgNamespace, "path");
      actionCell.className = "basis-[8%] flex justify-end";
      deleteButton.setAttribute("type", "button");
      deleteButton.setAttribute("data-product-id", String(product.id));
      deleteButton.setAttribute("data-product-title", this.normalizeUserText(product.title));
      deleteButton.setAttribute("class", "pdt-dlt-btn flex items-center justify-end");
      deleteButton.setAttribute("aria-label", _i18n["default"].t("deleteProductAria", {
        title: this.normalizeUserText(product.title) || _i18n["default"].t("deleteProduct")
      }));
      deleteIcon.setAttribute("class", "stroke-red-500 dd:h-6 dd:w-6 ss:h-5 ss:w-5 cursor-pointer");
      deleteIcon.setAttribute("xmlns", svgNamespace);
      deleteIcon.setAttribute("fill", "none");
      deleteIcon.setAttribute("viewBox", "0 0 24 24");
      deleteIcon.setAttribute("stroke-width", "1.5");
      deleteIcon.setAttribute("stroke", "currentColor");
      deletePath.setAttribute("stroke-linecap", "round");
      deletePath.setAttribute("stroke-linejoin", "round");
      deletePath.setAttribute("d", "m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0");
      deleteIcon.append(deletePath);
      deleteButton.append(deleteIcon);
      actionCell.append(deleteButton);
      return actionCell;
    }
  }, {
    key: "productsAction",
    value: function productsAction() {
      var _this3 = this;
      // delete product event listener
      var removeBtns = _toConsumableArray(document.querySelectorAll(".pdt-dlt-btn"));
      removeBtns.forEach(function (btn) {
        btn.addEventListener("click", function (e) {
          _this3.deleteProduct(e);
        });
      });
    }
  }, {
    key: "toggleProductQty",
    value: function toggleProductQty(e) {
      var currentQuantity = this.getCurrentQuantity();
      switch (e.currentTarget.id) {
        case "incQty":
          this.pdtQty.innerText = String(currentQuantity + 1);
          break;
        case "decQty":
          if (currentQuantity === 0) {
            return;
          }
          this.pdtQty.innerText = String(currentQuantity - 1);
          break;
      }
      this.updateQuantityControls();
    }
  }, {
    key: "deleteProduct",
    value: function deleteProduct(e) {
      var productId = Number(e.currentTarget.dataset.productId);
      var productTitle = e.currentTarget.dataset.productTitle || _i18n["default"].t("deleteProduct");
      if (!window.confirm(_i18n["default"].t("deleteConfirm", {
        title: productTitle
      }))) {
        return;
      }
      _storage["default"].removeProduct(productId);
      this.sortBySelect(this.sortSelect.value);
    }
  }, {
    key: "searchProducts",
    value: function searchProducts(searchTerm) {
      var addedProducts = _storage["default"].getProducts;
      var normalizedSearchTerm = searchTerm.toLowerCase().trim();
      var filteredProducts = addedProducts.filter(function (product) {
        return product.title.toLowerCase().trim().includes(normalizedSearchTerm);
      });
      this.showListedProducts(this.sortProducts(filteredProducts, this.sortSelect.value));
    }
  }, {
    key: "sortBySelect",
    value: function sortBySelect(sortType) {
      var sortedProducts = this.sortProducts(_storage["default"].getProducts, sortType);
      this.showListedProducts(sortedProducts);
    }
  }]);
}();
