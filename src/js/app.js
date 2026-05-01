import ProductView from "./productView.js";
import CategoryView from "./categoryView.js";
import i18n from "./i18n.js";
import Storage from "./storage.js";

function hideCookieBanner(cookieBanner) {
    cookieBanner.classList.add("hidden")
}

function showCookieBanner(cookieBanner) {
    cookieBanner.classList.remove("hidden")
}

function setupCookieBanner() {
    const cookieBanner = document.querySelector("#cookieBanner")
    const acceptButton = document.querySelector("#cookieAcceptBtn")
    const declineButton = document.querySelector("#cookieDeclineBtn")

    if (!cookieBanner || !acceptButton || !declineButton) {
        return
    }

    if (Storage.getCookieConsent()) {
        hideCookieBanner(cookieBanner)
    } else {
        showCookieBanner(cookieBanner)
    }

    acceptButton.addEventListener("click", () => {
        Storage.saveCookieConsent("accepted")
        hideCookieBanner(cookieBanner)
    })

    declineButton.addEventListener("click", () => {
        Storage.saveCookieConsent("declined")
        hideCookieBanner(cookieBanner)
    })
}

document.addEventListener("DOMContentLoaded", () => {
    const productView = new ProductView()
    const categoryView = new CategoryView()
    const languageToggle = document.querySelector("#languageToggle")

    i18n.applyStaticTranslations()
    categoryView.setupApp()
    productView.setupApp()
    setupCookieBanner()

    if (languageToggle) {
        languageToggle.addEventListener("click", () => {
            i18n.toggleLanguage()
        })
    }

    document.addEventListener("inventory:language-changed", () => {
        i18n.applyStaticTranslations()
        categoryView.setupApp()
        productView.sortBySelect(productView.sortSelect.value)
        productView.updateQuantityControls()
    })
})
