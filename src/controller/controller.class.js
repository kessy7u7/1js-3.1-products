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
            this.view.printMessage(`Se ha añadido el producto: '${payload.name}'.`);
        } catch (err) {
            this.view.printMessage(err, 0);
        }
    }

    deleteProductFromStore(id) {
        try {
            id = this.verifyInteger(id);
            let product = this.store.delProduct(id);
            this.view.delProduct(product);
            this.view.renderImport(this.store.totalImport());
        } catch (err) {
            this.view.printMessage(err, 0);
        }
    }

    addCategoryToStore(playload) {
        try {
            let category = this.store.addCategory(playload.name, playload.desc);
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

}

module.exports = Controller