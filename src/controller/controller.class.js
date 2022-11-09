'use strict';
const Store = require("../model/store.class");
const View = require("../view/view.class");

class Controller {
    constructor() {
        this.store = new Store(1, "Almacén ACME");
        this.view = new View();
    }

    async init() {
        try {
            await this.store.init();
        } catch (err) {
            alert(err)
        }

        this.view.init();
        this.store.products.forEach(product => {
            this.view.renderNewProduct(product);
            this.setAddEventListenersProduct(product);
        });
        this.store.categories.forEach(category => {
            this.view.renderNewCategory(category);
            this.setAddEventListenersCategory(category);
        });
        this.view.renderImport(this.store.totalImport());
        this.setProductFormValidator();
    }

    async addProductToStore(payload) {
        try {
            let product = await this.store.addProduct(payload);
            this.view.renderNewProduct(product);
            this.setAddEventListenersProduct(product);
            this.view.printMessage(`Se ha añadido el producto: '${product.name}'.`);
            this.view.renderImport(this.store.totalImport());
        } catch (err) {
            this.view.printMessage(err, 0);
        }
    }

    async modProductFromStore(payload) {
        try {
            let product = await this.store.modProduct(payload);
            this.view.editProduct(product);
            this.view.setAddProductForm();
            this.view.printMessage(`Se ha editado el producto ${product.id}.`, 2);
            this.view.renderImport(this.store.totalImport());
        } catch (err) {
            this.view.printMessage(err, 0);
        }
    }

    async deleteProductFromStore(id) {
        let product = this.store.getProductById(id);
        try {
            if (confirm(`¿Estás seguro que deseas borrar el producto "${product.name}"?`)) {
                if (product.units !== 0) {
                    if (!confirm(`Aún quedan unidades del producto ${id}. ¿Deseas continuar?`)) {
                        return;
                    }
                }
                await this.store.delProduct(id)
                this.view.delProduct(product);
                this.view.renderImport(this.store.totalImport());
                this.view.printMessage(`Ha sido eliminado el producto: '${product.name}'`, 2);
            }
        } catch (err) {
            this.view.printMessage(err, 0);
        }
    }

    async addCategoryToStore(playload) {
        try {
            if (playload.description.trim().length === 0) {
                playload.description = 'No hay descripción';
            }
            let category = await this.store.addCategory(playload.name, playload.description);
            this.view.renderNewCategory(category);
            this.setAddEventListenersCategory(category);
            this.view.printMessage(`Se ha añadido la categoría: '${category.name}'.`);
        } catch (err) {
            this.view.printMessage(err, 0);
        }
    }

    async deleteCategoryFromStore(id) {
        let category = this.store.getCategoryById(id);
        if (confirm(`¿Estás seguro que deseas borrar la categoría "${category.name}"?`)) {
            try {
                await this.store.delCategory(id);
                this.view.delCategory(category);
                this.view.printMessage(`Ha sido eliminado la categoría: '${category.name}'`, 2);
            } catch (err) {
                this.view.printMessage(err, 0);
            }
        }
    }

    setAddEventListenersProduct(product) {
        const productRowUI = document.getElementById(`prod-${product.id}`);
        
        if (product.units === 0) {
            productRowUI.querySelector('.sub-unit').setAttribute('disabled', '');
        }

        productRowUI.querySelector('.del-product').addEventListener('click', () => {
            this.deleteProductFromStore(product.id);
        });

        productRowUI.querySelector('.mod-product').addEventListener('click', () => {
            this.view.setModProductForm(product);
            document.querySelector('a.nav-link[data-div="new-prod"]').click();
        });

        productRowUI.querySelector('.plus-unit').addEventListener('click', async () => {
            try {
                const newProduct = await this.store.modUnitsPorduct(product.id, product.units + 1);
                this.view.editProduct(newProduct);
                this.view.renderImport(this.store.totalImport());
            } catch (err) {
                this.view.printMessage(err, 0);
            }
        });

        productRowUI.querySelector('.sub-unit').addEventListener('click', async () => {
            try {
                const newProduct = await this.store.modUnitsPorduct(product.id, product.units - 1);
                this.view.editProduct(newProduct);
                this.view.renderImport(this.store.totalImport());
            } catch (err) {
                this.view.printMessage(err, 0);
            }
            
        });
    }

    setAddEventListenersCategory(category) {
        const catRowUI = document.getElementById(`cat-${category.id}`);

        catRowUI.querySelector('.del-cat').addEventListener('click', () => {
            this.deleteCategoryFromStore(category.id);
        })
    }

    setProductFormValidator() {
        const prodId = document.getElementById('newprod-id');

        const prodName = document.getElementById('newprod-name');
        prodName.addEventListener('blur', () => {
            prodName.setCustomValidity('');
            if (this.store.isNameProductExists(prodId.value, prodName.value)) {
                prodName.setCustomValidity('El nombre ya existe.');
            }
            prodName.nextElementSibling.textContent = prodName.validationMessage;
        });

        const prodCat = document.getElementById('newprod-cat');
        prodCat.addEventListener('blur', () => {
            prodCat.nextElementSibling.textContent = prodCat.validationMessage;
        });

        const prodUnits = document.getElementById('newprod-units');
        prodUnits.addEventListener('blur', () => {
            prodUnits.nextElementSibling.textContent = prodUnits.validationMessage;
        });

        const prodPrice = document.getElementById('newprod-price');
        prodPrice.addEventListener('blur', () => {
            prodPrice.nextElementSibling.textContent = prodPrice.validationMessage;
        });
    }

    productFormValid() {
        const inputs = ['newprod-name', 'newprod-cat', 'newprod-units', 'newprod-price'];

        inputs.forEach(inputId => {
            const input = document.getElementById(inputId);
            input.nextElementSibling.textContent = input.validationMessage;
        });

        return document.getElementById('new-prod').checkValidity();
    }

}

module.exports = Controller