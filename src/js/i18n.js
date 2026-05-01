import i18next from "i18next"
import Storage from "./storage.js"

const EN_TRANSLATIONS = {
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
    cookieLearnMore: "Read Privacy Policy",
}

const ZH_TRANSLATIONS = {
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
    cookieLearnMore: "查看隐私政策",
}

const DEFAULT_LANGUAGE = "en"
const SUPPORTED_LANGUAGES = ["en", "zh"]

function getInitialLanguage() {
    const saved = Storage.getLanguage()
    if (SUPPORTED_LANGUAGES.includes(saved)) {
        return saved
    }
    return DEFAULT_LANGUAGE
}

i18next.init({
    lng: getInitialLanguage(),
    fallbackLng: DEFAULT_LANGUAGE,
    supportedLngs: SUPPORTED_LANGUAGES,
    resources: {
        en: { translation: EN_TRANSLATIONS },
        zh: { translation: ZH_TRANSLATIONS },
    },
    interpolation: {
        prefix: "{{",
        suffix: "}}",
    },
})

const i18n = {
    getCurrentLanguage() {
        return i18next.language || DEFAULT_LANGUAGE
    },

    setLanguage(language) {
        if (!SUPPORTED_LANGUAGES.includes(language)) {
            return this.getCurrentLanguage()
        }

        Storage.saveLanguage(language)
        i18next.changeLanguage(language)
        this.applyStaticTranslations()
        document.dispatchEvent(new CustomEvent("inventory:language-changed", {
            detail: { language },
        }))

        return language
    },

    toggleLanguage() {
        return this.setLanguage(this.getCurrentLanguage() === "en" ? "zh" : "en")
    },

    t(key, replacements = {}) {
        const i18nextOptions = {}
        Object.entries(replacements).forEach(([k, v]) => {
            i18nextOptions[k] = v
        })
        return i18next.t(key, i18nextOptions)
    },

    applyStaticTranslations(root = document) {
        document.documentElement.lang = this.getCurrentLanguage() === "zh" ? "zh-CN" : "en"

        root.querySelectorAll("[data-i18n]").forEach((element) => {
            element.textContent = this.t(element.dataset.i18n)
        })

        root.querySelectorAll("[data-i18n-placeholder]").forEach((element) => {
            element.setAttribute("placeholder", this.t(element.dataset.i18nPlaceholder))
        })

        root.querySelectorAll("[data-i18n-aria-label]").forEach((element) => {
            element.setAttribute("aria-label", this.t(element.dataset.i18nAriaLabel))
        })

        const pageTitle = root.querySelector("title")

        if (pageTitle) {
            pageTitle.textContent = this.t("pageTitle")
        }
    },
}

export default i18n
