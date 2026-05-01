"use strict";

var _productView = _interopRequireDefault(require("./productView.js"));
var _categoryView = _interopRequireDefault(require("./categoryView.js"));
var _i18n = _interopRequireDefault(require("./i18n.js"));
var _storage = _interopRequireDefault(require("./storage.js"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { "default": e }; }
function hideCookieBanner(cookieBanner) {
  cookieBanner.classList.add("hidden");
}
function showCookieBanner(cookieBanner) {
  cookieBanner.classList.remove("hidden");
}
function setupCookieBanner() {
  var cookieBanner = document.querySelector("#cookieBanner");
  var acceptButton = document.querySelector("#cookieAcceptBtn");
  var declineButton = document.querySelector("#cookieDeclineBtn");
  if (!cookieBanner || !acceptButton || !declineButton) {
    return;
  }
  if (_storage["default"].getCookieConsent()) {
    hideCookieBanner(cookieBanner);
  } else {
    showCookieBanner(cookieBanner);
  }
  acceptButton.addEventListener("click", function () {
    _storage["default"].saveCookieConsent("accepted");
    hideCookieBanner(cookieBanner);
  });
  declineButton.addEventListener("click", function () {
    _storage["default"].saveCookieConsent("declined");
    hideCookieBanner(cookieBanner);
  });
}
document.addEventListener("DOMContentLoaded", function () {
  var productView = new _productView["default"]();
  var categoryView = new _categoryView["default"]();
  var languageToggle = document.querySelector("#languageToggle");
  _i18n["default"].applyStaticTranslations();
  categoryView.setupApp();
  productView.setupApp();
  setupCookieBanner();
  if (languageToggle) {
    languageToggle.addEventListener("click", function () {
      _i18n["default"].toggleLanguage();
    });
  }
  document.addEventListener("inventory:language-changed", function () {
    _i18n["default"].applyStaticTranslations();
    categoryView.setupApp();
    productView.sortBySelect(productView.sortSelect.value);
    productView.updateQuantityControls();
  });
});
