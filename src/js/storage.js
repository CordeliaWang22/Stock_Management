export default class Storage {
    static cookieConsentKey = "inventory_cookie_consent"

    static get getProducts() {
        return JSON.parse(localStorage.getItem("products")) || [];
    }

    static getCategories() {
        return JSON.parse(localStorage.getItem("categories")) || []
    }

    static saveProducts(productsList) {
        localStorage.setItem("products", JSON.stringify(productsList))
    }

    static saveCategories(categoriesList) {
        localStorage.setItem("categories", JSON.stringify(categoriesList))
    }

    static getLanguage() {
        return localStorage.getItem("language") || "en"
    }

    static saveLanguage(language) {
        localStorage.setItem("language", language)
    }

    static getCookieConsent() {
        const cookieConsent = document.cookie
            .split("; ")
            .find((cookie) => cookie.startsWith(`${this.cookieConsentKey}=`))

        if (cookieConsent) {
            return decodeURIComponent(cookieConsent.split("=")[1])
        }

        return localStorage.getItem("cookieConsent")
    }

    static saveCookieConsent(consentStatus) {
        document.cookie = `${this.cookieConsentKey}=${encodeURIComponent(consentStatus)}; path=/; max-age=${60 * 60 * 24 * 180}; SameSite=Lax`
        localStorage.setItem("cookieConsent", consentStatus)
    }

    static removeProduct(deletedId) {
        const UpdatedProducts = this.getProducts.filter((product) => product.id !== deletedId)
        this.saveProducts(UpdatedProducts)
    }

}
