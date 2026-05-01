"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
var Storage = exports["default"] = /*#__PURE__*/function () {
  function Storage() {
    _classCallCheck(this, Storage);
  }
  return _createClass(Storage, null, [{
    key: "getProducts",
    get: function get() {
      return JSON.parse(localStorage.getItem("products")) || [];
    }
  }, {
    key: "getCategories",
    value: function getCategories() {
      return JSON.parse(localStorage.getItem("categories")) || [];
    }
  }, {
    key: "saveProducts",
    value: function saveProducts(productsList) {
      localStorage.setItem("products", JSON.stringify(productsList));
    }
  }, {
    key: "saveCategories",
    value: function saveCategories(categoriesList) {
      localStorage.setItem("categories", JSON.stringify(categoriesList));
    }
  }, {
    key: "getLanguage",
    value: function getLanguage() {
      return localStorage.getItem("language") || "en";
    }
  }, {
    key: "saveLanguage",
    value: function saveLanguage(language) {
      localStorage.setItem("language", language);
    }
  }, {
    key: "getCookieConsent",
    value: function getCookieConsent() {
      var _this = this;
      var cookieConsent = document.cookie.split("; ").find(function (cookie) {
        return cookie.startsWith("".concat(_this.cookieConsentKey, "="));
      });
      if (cookieConsent) {
        return decodeURIComponent(cookieConsent.split("=")[1]);
      }
      return localStorage.getItem("cookieConsent");
    }
  }, {
    key: "saveCookieConsent",
    value: function saveCookieConsent(consentStatus) {
      document.cookie = "".concat(this.cookieConsentKey, "=").concat(encodeURIComponent(consentStatus), "; path=/; max-age=").concat(60 * 60 * 24 * 180, "; SameSite=Lax");
      localStorage.setItem("cookieConsent", consentStatus);
    }
  }, {
    key: "removeProduct",
    value: function removeProduct(deletedId) {
      var UpdatedProducts = this.getProducts.filter(function (product) {
        return product.id !== deletedId;
      });
      this.saveProducts(UpdatedProducts);
    }
  }]);
}();
_defineProperty(Storage, "cookieConsentKey", "inventory_cookie_consent");
