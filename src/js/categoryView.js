import Storage from "./storage.js";
import i18n from "./i18n.js";

export default class CategoryView {
    constructor() {
        // variables
        this.ctgTitleInput = document.querySelector("#categoryTitle")
        this.ctgDescInput = document.querySelector("#categoryDescription")
        this.ctgCacelBtn = document.querySelector("#categoryCanelBtn")
        this.ctgAddBtn = document.querySelector("#categoryAddNewBtn")
        this.ctgSelect = document.querySelector("#categoriesSelect")
        this.categoriesList = document.querySelector("#categoriesList")
        // event listeners
        this.ctgAddBtn.addEventListener("click", () => {
            this.addNewCategory()
        })
        this.ctgCacelBtn.addEventListener("click", () => {
            this.resetCategoryInputs()
        })
        this.ctgTitleInput.addEventListener("input", () => {
            this.ctgTitleInput.setCustomValidity("")
        })
    }

    setupApp() {
        this.instantCtgUpdate(Storage.getCategories())
    }

    resetCategoryInputs() {
        this.ctgTitleInput.value = ""
        this.ctgDescInput.value = ""
        this.ctgTitleInput.setCustomValidity("")
    }

    persistCategories(categories) {
        Storage.saveCategories(categories)
        this.instantCtgUpdate(categories)
    }

    validateCategoryForm() {
        const normalizedTitle = this.ctgTitleInput.value.trim()

        if (!normalizedTitle) {
            this.ctgTitleInput.setCustomValidity(i18n.t("categoryTitleRequired"))
            this.ctgTitleInput.reportValidity()
            return false
        }

        if (normalizedTitle.length < 2) {
            this.ctgTitleInput.setCustomValidity(i18n.t("categoryTitleMin"))
            this.ctgTitleInput.reportValidity()
            return false
        }

        this.ctgTitleInput.setCustomValidity("")
        return true
    }

    addNewCategory() {
        if (!this.validateCategoryForm()) {
            return
        }

        const normalizedTitle = this.ctgTitleInput.value.trim()
        const normalizedDescription = this.ctgDescInput.value.trim()

        // save category to local storage
        const savedCategories = Storage.getCategories();
        const existedItem = savedCategories.find((c) => c.title === normalizedTitle);

        if (existedItem) {
            existedItem.title = normalizedTitle;
            existedItem.description = normalizedDescription;
            existedItem.updatedAt = new Date().toISOString();
            this.persistCategories(savedCategories)
            this.resetCategoryInputs()
            alert(i18n.t("categoryUpdated"))
        } else {
            const newCategory = {
                id: new Date().getTime(),
                title: normalizedTitle,
                description: normalizedDescription,
                createdAt: new Date().toISOString(),
            }

            savedCategories.push(newCategory);
            this.persistCategories(savedCategories)
            this.resetCategoryInputs()
        }
    }

    instantCtgUpdate(categories) {
        const ctgListTitles = categories.map(obj => obj.title.trim())
        const defaultOption = document.createElement("option")

        defaultOption.selected = true
        defaultOption.value = "none"
        defaultOption.textContent = i18n.t("selectCategory")
        this.ctgSelect.replaceChildren(defaultOption)
        ctgListTitles.forEach(option => {
            const newOption = document.createElement("option")
            newOption.value = option;
            newOption.textContent = option;
            // append new created option to select tg
            this.ctgSelect.append(newOption)
        });
        this.renderCategoriesList(categories)
    }

    renderCategoriesList(categories) {
        const categoriesFragment = document.createDocumentFragment()

        if (!categories.length) {
            const emptyItem = document.createElement("li")
            emptyItem.className = "rounded-2xl border border-dashed border-[#394247] px-4 py-4 text-sm text-stone-400 text-center"
            emptyItem.textContent = i18n.t("noCategoriesYet")
            categoriesFragment.append(emptyItem)
        }

        categories.forEach((category) => {
            const categoryItem = document.createElement("li")
            const titleBlock = document.createElement("div")
            const descriptionBlock = document.createElement("p")
            const categoryTitle = document.createElement("p")
            const categoryMeta = document.createElement("p")

            categoryItem.className = "flex items-start justify-between gap-4 rounded-2xl border border-[#394247] px-4 py-3 text-stone-100"
            titleBlock.className = "w-2/5"
            descriptionBlock.className = "w-3/5 text-right text-sm text-stone-300"
            categoryTitle.className = "font-semibold"
            categoryMeta.className = "mt-1 text-xs uppercase tracking-[0.16em] text-stone-400"

            categoryTitle.textContent = category.title
            categoryMeta.textContent = category.updatedAt ? i18n.t("categoryMetaUpdated") : i18n.t("categoryMetaSaved")
            descriptionBlock.textContent = category.description || i18n.t("noDescription")

            titleBlock.append(categoryTitle, categoryMeta)
            categoryItem.append(titleBlock, descriptionBlock)
            categoriesFragment.append(categoryItem)
        })

        this.categoriesList.replaceChildren(categoriesFragment)
    }

}
