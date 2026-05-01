import Storage from "./storage.js";

export default class CategoryView {
    constructor() {
        // variables
        this.ctgTitleInput = document.querySelector("#categoryTitle")
        this.ctgDescInput = document.querySelector("#categoryDescription")
        this.ctgCacelBtn = document.querySelector("#categoryCanelBtn")
        this.ctgAddBtn = document.querySelector("#categoryAddNewBtn")
        this.ctgSelect = document.querySelector("#categoriesSelect")
        // event listeners
        this.ctgAddBtn.addEventListener("click", () => {
            this.addNewCategory()
        })
        this.ctgCacelBtn.addEventListener("click", () => {
            this.resetCategoryInputs()
        })
    }

    setupApp() {
        this.instantCtgUpdate(Storage.getCategories())
    }

    resetCategoryInputs() {
        this.ctgTitleInput.value = ' '
        this.ctgDescInput.value = ' '
    }

    persistCategories(categories) {
        Storage.saveCategories(categories)
        this.instantCtgUpdate(categories)
    }

    addNewCategory() {
        const normalizedTitle = this.ctgTitleInput.value.trim()
        const normalizedDescription = this.ctgDescInput.value.trim()

        if (normalizedTitle.length >= 2) {
            // save category to local storage
            const savedCategories = Storage.getCategories();
            const existedItem = savedCategories.find((c) => c.title === normalizedTitle);

            if (existedItem) {
                existedItem.title = normalizedTitle;
                existedItem.description = normalizedDescription;
                existedItem.updatedAt = new Date().toISOString();
                this.persistCategories(savedCategories)
                this.resetCategoryInputs()
                alert("this category name has been added before so we will update the category description!")
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
        } else {
            alert("your entered title for category must be at least 2 characters!!!")
        }
    }

    instantCtgUpdate(categories) {
        const ctgListTitles = categories.map(obj => obj.title.trim())
        console.log(categories);
        // create option for each category
        this.ctgSelect.innerHTML = ` <option selected value="none">- select category -</option>  `
        ctgListTitles.forEach(option => {
            const newOption = document.createElement("option")
            newOption.value = option;
            newOption.textContent = option;
            // append new created option to select tg
            this.ctgSelect.append(newOption)
        });
    }

}