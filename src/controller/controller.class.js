'use strict';
const Store = require("../model/store.class");
const View = require("../view/view.class");

class Controller {
    constructor() {
        this.store = new Store(1, "Almacén ACME");
        this.view = new View();
    }

    init() {
        this.store.init();
        this.store.products.forEach(product => {
            this.view.renderNewProduct(product);
            this.setAddEventListeners(product);
        });
        this.store.categories.forEach(category => this.view.renderNewCategory(category));
        this.view.renderImport(this.store.totalImport());
        this.view.setButtonResetProductForm();
        this.view.setMenu();
        this.setProductFormValidator();
    }

    addProductToStore(payload) {
        try {
            let product = this.store.addProduct(payload);
            this.view.renderNewProduct(product);
            this.setAddEventListeners(product);
            this.view.printMessage(`Se ha añadido el producto: '${product.name}'.`);
            this.view.renderImport(this.store.totalImport());
        } catch (err) {
            this.view.printMessage(err, 0);
        }
    }

    modProductFromStore(payload) {
        try {
            let product = this.store.modProduct(payload);
            this.view.editProduct(product);
            this.view.setAddProductForm();
            this.view.printMessage(`Se ha editado el producto ${product.id}.`, 2);
            this.view.renderImport(this.store.totalImport());
        } catch (err) {
            this.view.printMessage(err, 0);
        }
    }

    deleteProductFromStore(id) {
        let product = this.store.getProductById(id);
        if (confirm(`¿Estás seguro que deseas borrar el producto "${product.name}"?`)) {
            try {
                this.store.delProduct(id);
            } catch (err) {
                if (confirm(`${err} ¿Deseas continuar?`)) {
                    let index = this.store.products.indexOf(product);
                    this.store.products.splice(index, 1);
                } else {
                    return;
                }
            }
            this.view.delProduct(product);
            this.view.renderImport(this.store.totalImport());
            this.view.printMessage(`Ha sido eliminado el producto: '${product.name}'`, 2);
        }
    }

    addCategoryToStore(playload) {
        try {
            if (playload.description.trim().length === 0) {
                playload.description = undefined;
            }
            let category = this.store.addCategory(playload.name, playload.description);
            this.view.renderNewCategory(category);
            this.view.printMessage(`Se ha añadido la categoría: '${category.name}'.`);
        } catch (err) {
            this.view.printMessage(err, 0);
        }
    }

    deleteCategoryFromStore(id) {
        try {
            id = this.verifyInteger(id);
            let category = this.store.delCategory(id);
            this.view.delCategory(category);
        } catch (err) {
            this.view.printMessage(err, 0);
        }
    }

    verifyInteger(id) {
        if (!id) {
            throw 'Introduce una ID.';
        }
        id = Number(id);
        if (isNaN(id)) {
            throw `La ID no es un número.`;
        }
        if (!Number.isInteger(id)) {
            throw `${id} no es un número entero.`;
        }
        return id;
    }

    setAddEventListeners(product) {
        const productRowUI = document.getElementById(`prod-${product.id}`);
        
        if (product.units === 0) {
            productRowUI.querySelector('.sub-unit').setAttribute('disabled', '');
        }

        productRowUI.querySelector('.del-product').addEventListener('click', () => {
            this.deleteProductFromStore(product.id);
        });

        productRowUI.querySelector('.mod-product').addEventListener('click', () => {
            this.view.setModProductForm(product);
            this.view.mostrarProductForm();
        });

        productRowUI.querySelector('.plus-unit').addEventListener('click', () => {
            this.store.modUnitsPorduct(product.id, product.units + 1);
            this.view.editButtonSubUnit(product.id, product.units);
            productRowUI.children[3].textContent = product.units;
            productRowUI.children[5].textContent = product.productImport().toFixed(2) + " €";
            this.view.renderImport(this.store.totalImport());
        });

        productRowUI.querySelector('.sub-unit').addEventListener('click', () => {
            this.store.modUnitsPorduct(product.id, product.units - 1);
            this.view.editButtonSubUnit(product.id, product.units);
            productRowUI.children[3].textContent = product.units;
            productRowUI.children[5].textContent = product.productImport().toFixed(2) + " €";
            this.view.renderImport(this.store.totalImport());
        });
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

        document.getElementById('new-prod').addEventListener('submit', (event) => {
            event.preventDefault();

            prodName.nextElementSibling.textContent = prodName.validationMessage;

            prodCat.nextElementSibling.textContent = prodCat.validationMessage;

            prodUnits.nextElementSibling.textContent = prodUnits.validationMessage;

            prodPrice.nextElementSibling.textContent = prodPrice.validationMessage;
        });
    }

}

module.exports = Controller