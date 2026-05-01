import Storage from "./storage.js";
import i18n from "./i18n.js";

export default class ProductView {
    constructor() {
        this.quantityEnabledClass = "toggleBtn flex items-center justify-center p-1 rounded-full bg-[#273842]";
        this.quantityDisabledClass = "toggleBtn flex items-center justify-center p-1 rounded-full bg-slate-500 opacity-60 cursor-not-allowed";
        // variables
        this.pdtTitle = document.querySelector("#productTitle")
        this.pdtIncQty = document.querySelector("#incQty")
        this.pdtDecQty = document.querySelector("#decQty")
        this.pdtLocation = document.querySelector("#productLocations")
        this.ctgSelect = document.querySelector("#categoriesSelect")
        this.pdtAddNew = document.querySelector("#addNewProductBtn")
        this.pdtQty = document.querySelector("#productQuantity")
        this.productCenter = document.querySelector("#productsCenter")
        this.toggleBtns = document.querySelectorAll(".toggleBtn")
        this.searchInput = document.querySelector("#searchInput")
        this.sortSelect = document.querySelector("#sort")
        // event listeners
        this.pdtAddNew.addEventListener("click", () => {
            this.addNewProduct()
        })
        this.toggleBtns.forEach((btn) => {
            btn.addEventListener("click", (e) => {
                this.toggleProductQty(e)
            })
        })
        this.searchInput.addEventListener("keyup", (e) => {
            this.searchProducts(e.target.value)
        })
        this.sortSelect.addEventListener("change", (e) => {
            this.sortBySelect(e.target.value)
        })
        this.pdtTitle.addEventListener("input", () => {
            this.pdtTitle.setCustomValidity("")
        })
        this.pdtLocation.addEventListener("change", () => {
            this.pdtLocation.setCustomValidity("")
        })
        this.ctgSelect.addEventListener("change", () => {
            this.ctgSelect.setCustomValidity("")
        })
    }

    setupApp() {
        this.showListedProducts(Storage.getProducts)
        this.sortBySelect(this.sortSelect.value)
        this.updateQuantityControls()
    }

    normalizeUserText(value) {
        return String(value ?? "")
            .replace(/[\u0000-\u001F\u007F]/g, "")
            .trim();
    }

    validateRequiredTextField(field, label, minimumLength = 1) {
        const normalizedValue = this.normalizeUserText(field.value)

        if (!normalizedValue) {
            field.setCustomValidity(i18n.t(`${label}Required`))
            field.reportValidity()
            return false
        }

        if (normalizedValue.length < minimumLength) {
            field.setCustomValidity(i18n.t(`${label}Min`))
            field.reportValidity()
            return false
        }

        field.setCustomValidity("")
        return true
    }

    validateRequiredSelect(field, label) {
        if (field.value === "none") {
            field.setCustomValidity(i18n.t(`${label}Required`))
            field.reportValidity()
            return false
        }

        field.setCustomValidity("")
        return true
    }

    validateProductForm() {
        if (!this.validateRequiredTextField(this.pdtTitle, "productTitle", 2)) {
            return false
        }

        if (!this.validateRequiredSelect(this.pdtLocation, "location")) {
            return false
        }

        if (!this.validateRequiredSelect(this.ctgSelect, "category")) {
            return false
        }

        return true
    }

    resetProductForm() {
        this.pdtTitle.value = ""
        this.pdtQty.innerText = "0"
        this.pdtLocation.value = "none"
        this.ctgSelect.value = "none"
        this.pdtTitle.setCustomValidity("")
        this.pdtLocation.setCustomValidity("")
        this.ctgSelect.setCustomValidity("")
        this.updateQuantityControls()
    }

    getCurrentQuantity() {
        const parsedQuantity = Number(this.pdtQty.innerText)

        if (Number.isNaN(parsedQuantity)) {
            return 0
        }

        return Math.max(0, parsedQuantity)
    }

    updateQuantityControls() {
        const currentQuantity = this.getCurrentQuantity()
        const isDecrementDisabled = currentQuantity <= 0

        this.pdtQty.innerText = String(currentQuantity)
        this.pdtDecQty.disabled = isDecrementDisabled
        this.pdtDecQty.className = isDecrementDisabled ? this.quantityDisabledClass : this.quantityEnabledClass
        this.pdtIncQty.className = this.quantityEnabledClass
    }

    formatDateValue(dateInput) {
        const parsedDate = new Date(dateInput)

        if (Number.isNaN(parsedDate.getTime())) {
            return ""
        }

        const year = parsedDate.getFullYear()
        const month = String(parsedDate.getMonth() + 1).padStart(2, "0")
        const day = String(parsedDate.getDate()).padStart(2, "0")

        return `${year}-${month}-${day}`
    }

    formatProductDate(product) {
        if (product.createdAt) {
            return this.formatDateValue(product.createdAt)
        }

        if (!Number.isNaN(Number(product.id))) {
            return this.formatDateValue(Number(product.id))
        }

        return this.normalizeUserText(product.persianDate) || "N/A"
    }

    sortProducts(productList, sortType) {
        if (sortType === "newest") {
            return productList.slice().sort((a, b) => b.id - a.id)
        }

        if (sortType === "oldest") {
            return productList.slice().sort((a, b) => a.id - b.id)
        }

        if (sortType === "A-Z") {
            return productList.slice().sort((a, b) => a.title.toLowerCase().localeCompare(b.title.toLowerCase()))
        }

        if (sortType === "Z-A") {
            return productList.slice().sort((a, b) => a.title.toLowerCase().localeCompare(b.title.toLowerCase())).reverse()
        }

        return productList.slice()
    }

    addNewProduct() {
        if (!this.validateProductForm()) {
            return
        }

        const createdAt = new Date().toISOString()
        const newProduct = {
            id: new Date().getTime(),
            title: this.normalizeUserText(this.pdtTitle.value),
            quantity: this.getCurrentQuantity(),
            location: this.normalizeUserText(this.pdtLocation.value),
            category: this.normalizeUserText(this.ctgSelect.value),
            createdAt,
            displayDate: this.formatDateValue(createdAt)
        }
        const pdtList = Storage.getProducts

        pdtList.push(newProduct)
        Storage.saveProducts(pdtList)
        this.resetProductForm()
        this.sortBySelect(this.sortSelect.value)
    }

    showListedProducts(productList) {
        const productsFragment = document.createDocumentFragment();

        if (!productList.length) {
            productsFragment.append(this.createEmptyStateItem())
        }

        productList.forEach((product) => {
            productsFragment.append(this.createProductListItem(product));
        });

        this.productCenter.replaceChildren(productsFragment);
        this.productsAction()
    }

    createProductListItem(product) {
        const productItem = document.createElement("li");
        productItem.className = "flex items-center justify-between w-full py-3 border-b border-[#2b3c45] text-white font-medium ss:min-w-[500px] ss:overflow-x-auto";

        productItem.append(
            this.createTextCell(this.normalizeUserText(product.title)),
            this.createTextCell(this.normalizeUserText(product.location)),
            this.createTextCell(this.normalizeUserText(product.category)),
            this.createTextCell(this.formatProductDate(product)),
            this.createTextCell(String(product.quantity ?? ""), "basis-[16%] ww:text-base xx:text-[15px] dd:text-[14px] ss:text-[13px]"),
            this.createDeleteButton(product)
        );

        return productItem;
    }

    createEmptyStateItem() {
        const emptyItem = document.createElement("li")

        emptyItem.className = "w-full py-6 text-center text-stone-400 text-sm"
        emptyItem.textContent = i18n.t("noProductsYet")

        return emptyItem
    }

    createTextCell(value, className = "basis-[16%] ww:text-base xx:text-[15px] dd:text-[14px] ss:text-[13px]") {
        const textCell = document.createElement("p");
        textCell.className = className;
        textCell.textContent = value;

        return textCell;
    }

    createDeleteButton(product) {
        const actionCell = document.createElement("div")
        const svgNamespace = "http://www.w3.org/2000/svg";
        const deleteButton = document.createElement("button")
        const deleteIcon = document.createElementNS(svgNamespace, "svg");
        const deletePath = document.createElementNS(svgNamespace, "path");

        actionCell.className = "basis-[8%] flex justify-end"

        deleteButton.setAttribute("type", "button")
        deleteButton.setAttribute("data-product-id", String(product.id))
        deleteButton.setAttribute("data-product-title", this.normalizeUserText(product.title))
        deleteButton.setAttribute("class", "pdt-dlt-btn flex items-center justify-end")
        deleteButton.setAttribute("aria-label", i18n.t("deleteProductAria", {
            title: this.normalizeUserText(product.title) || i18n.t("deleteProduct")
        }))

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
        deleteButton.append(deleteIcon)
        actionCell.append(deleteButton)

        return actionCell;
    }

    productsAction() {
        // delete product event listener
        const removeBtns = [...document.querySelectorAll(".pdt-dlt-btn")]
        removeBtns.forEach((btn) => {
            btn.addEventListener("click", (e) => {
                this.deleteProduct(e)
            })
        })
    }

    toggleProductQty(e) {
        const currentQuantity = this.getCurrentQuantity()

        switch (e.currentTarget.id) {
            case "incQty":
                this.pdtQty.innerText = String(currentQuantity + 1)
                break;
            case "decQty":
                if (currentQuantity === 0) {
                    return
                }
                this.pdtQty.innerText = String(currentQuantity - 1)
                break;
        }

        this.updateQuantityControls()
    }

    deleteProduct(e) {
        const productId = Number(e.currentTarget.dataset.productId)
        const productTitle = e.currentTarget.dataset.productTitle || i18n.t("deleteProduct")

        if (!window.confirm(i18n.t("deleteConfirm", { title: productTitle }))) {
            return
        }

        Storage.removeProduct(productId)
        this.sortBySelect(this.sortSelect.value)
    }

    searchProducts(searchTerm) {
        const addedProducts = Storage.getProducts
        const normalizedSearchTerm = searchTerm.toLowerCase().trim();
        const filteredProducts = addedProducts.filter((product) =>
            product.title.toLowerCase().trim().includes(normalizedSearchTerm)
        );
        this.showListedProducts(this.sortProducts(filteredProducts, this.sortSelect.value));
    }

    sortBySelect(sortType) {
        const sortedProducts = this.sortProducts(Storage.getProducts, sortType);
        this.showListedProducts(sortedProducts);
    }
}
