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
        this.store.products.forEach(product => this.view.renderNewProduct(product));
        this.store.categories.forEach(category => this.view.renderNewCategory(category));
        this.view.renderImport(this.store.totalImport());
    }

    addProductToStore(payload) {
        try {
            let product = this.store.addProduct(payload);
            this.view.renderNewProduct(product);
            this.view.renderImport(this.store.totalImport());
        } catch (err) {
            this.view.printError(err);
        }
    }

    deleteProductFromStore(id) {
        try {
            id = this.verifyInteger(id);
            let product = this.store.delProduct(id);
            this.view.delProduct(product);
            this.view.renderImport(this.store.totalImport());
        } catch (err) {
            this.view.printError(err);
        }
    }

    addCategoryToStore(playload) {
        try {
            let category = this.store.addCategory(playload.name, playload.desc);
            this.view.renderNewCategory(category);
        } catch (err) {
            this.view.printError(err);
        }
    }

    deleteCategoryFromStore(id) {
        try {
            id = this.verifyInteger(id);
            let category = this.store.delCategory(id);
            this.view.delCategory(category);
        } catch (err) {
            this.view.printError(err);
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

}

module.exports = Controller