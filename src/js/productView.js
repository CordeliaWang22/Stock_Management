import Storage from "./storage.js";

export default class ProductView {
    constructor() {
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
    }

    setupApp() {
        this.showListedProducts(Storage.getProducts)
        this.sortBySelect(this.sortSelect.value)
    }

    normalizeUserText(value) {
        return String(value ?? "")
            .replace(/[\u0000-\u001F\u007F]/g, "")
            .trim();
    }

    addNewProduct() {
        const normalizedTitle = this.normalizeUserText(this.pdtTitle.value);

        if (normalizedTitle.length >= 2) {
            // create new object for each category
            const newProduct = {
                id: new Date().getTime(),
                title: normalizedTitle,
                quantity: this.pdtQty.innerText,
                location: this.normalizeUserText(this.pdtLocation.value),
                category: this.normalizeUserText(this.ctgSelect.value),
                persianDate: new Date().toLocaleDateString("fa-IR")
            }
            // reset inputs value
            this.pdtTitle.value = ' '
            this.pdtQty.innerText = 0,
                this.pdtLocation.value = "none"
            this.ctgSelect.value = "none"
            // save product to local storage
            const pdtList = Storage.getProducts
            // console.log(pdtList);
            pdtList.push(newProduct)
            Storage.saveProducts(pdtList)
            // instant update html product list from storage
            this.sortBySelect(this.sortSelect.value)
            this.showListedProducts(pdtList)

        } else {
            alert("your entered title for category must be at least 2 characters!!!")
        }

    }

    showListedProducts(productList) {
        const productsFragment = document.createDocumentFragment();

        productList.forEach((product) => {
            productsFragment.append(this.createProductListItem(product));
        });

        this.productCenter.replaceChildren(productsFragment);
        this.productsAction()
    }

    createProductListItem(product) {
        const productItem = document.createElement("li");
        productItem.className = "flex items-center justify-between  w-full py-2 bg-blue-400/ text-white font-medium ss:min-w-[500px] ss:overflow-x-auto ";

        productItem.append(
            this.createTextCell(this.normalizeUserText(product.title)),
            this.createTextCell(this.normalizeUserText(product.location)),
            this.createTextCell(this.normalizeUserText(product.category)),
            this.createTextCell(this.normalizeUserText(product.persianDate), "  basis-[16%] font-vazir ww:text-base xx:text-[15px] dd:text-[14px] ss:text-[13px] "),
            this.createTextCell(String(product.quantity ?? ""), "  border-2 border-slate-400 p-1 rounded-2xl ww:text-base xx:text-[15px] dd:text-[14px] ss:text-[13px] "),
            this.createDeleteIcon(product.id)
        );

        return productItem;
    }

    createTextCell(value, className = "  basis-[16%] ww:text-base xx:text-[15px] dd:text-[14px] ss:text-[13px] ") {
        const textCell = document.createElement("p");
        textCell.className = className;
        textCell.textContent = value;

        return textCell;
    }

    createDeleteIcon(productId) {
        const svgNamespace = "http://www.w3.org/2000/svg";
        const deleteIcon = document.createElementNS(svgNamespace, "svg");
        const deletePath = document.createElementNS(svgNamespace, "path");

        deleteIcon.setAttribute("id", String(productId));
        deleteIcon.setAttribute("class", "pdt-dlt-btn stroke-red-500 dd:h-6 dd:w-6 ss:h-5 ss:w-5 cursor-pointer");
        deleteIcon.setAttribute("xmlns", svgNamespace);
        deleteIcon.setAttribute("fill", "none");
        deleteIcon.setAttribute("viewBox", "0 0 24 24");
        deleteIcon.setAttribute("stroke-width", "1.5");
        deleteIcon.setAttribute("stroke", "currentColor");

        deletePath.setAttribute("stroke-linecap", "round");
        deletePath.setAttribute("stroke-linejoin", "round");
        deletePath.setAttribute("d", "m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0");

        deleteIcon.append(deletePath);

        return deleteIcon;
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
        // console.log(e.currentTarget.id);
        switch (e.currentTarget.id) {
            case "incQty":
                this.pdtQty.innerText++;
                break;
            case "decQty":
                this.pdtQty.innerText--;
                break;
        }
    }

    deleteProduct(e) {
        const productId = Number(e.currentTarget.id)
        Storage.removeProduct(productId)
        this.showListedProducts(Storage.getProducts)
        this.sortBySelect(this.sortSelect.value)
    }

    searchProducts(searchTerm) {
        const addedProducts = Storage.getProducts
        const normalizedSearchTerm = searchTerm.toLowerCase().trim();
        const filteredProducts = addedProducts.filter((product) =>
            product.title.toLowerCase().trim().includes(normalizedSearchTerm)
        );
        this.sortBySelect(this.sortSelect.value)
        this.showListedProducts(filteredProducts);
    }

    sortBySelect(sortType) {
        let saveProducts = Storage.getProducts
        let sortedProducts = [];
        if (sortType === "newest") {
            sortedProducts = saveProducts.slice().sort((a, b) => b.id - a.id);
        } else if (sortType === "oldest") {
            sortedProducts = saveProducts.slice().sort((a, b) => a.id - b.id);
        } else if (sortType ==="A-Z" ){
            sortedProducts = saveProducts.slice().sort((a,b)=> a.title.toLowerCase().localeCompare(b.title.toLowerCase()))
        } else if (sortType ==="Z-A" ){
            sortedProducts = saveProducts.slice().sort((a,b)=> a.title.toLowerCase().localeCompare(b.title.toLowerCase())).reverse()
        } else {
            sortedProducts = saveProducts.slice();
        }
        this.showListedProducts(sortedProducts);
    }

}