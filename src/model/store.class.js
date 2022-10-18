'use strict';

const Category = require('./category.class');
const Product = require('./product.class');
const Dades = require('../datosIni.json');

// Aquí la clase Store

class Store  {
    constructor(id, name) {
        this.id = id;
        this.name = name;
        this.products = [];
        this.categories = [];
    }

    getCategoryById(id) {
        let category = this.categories.find(category => category.id === id);
        if (!category) {
            throw `La categoría '${id}' no existe.`;
        }
        return category;
    }

    getCategoryByName(name) {
        let category = this.categories.find(category => category.name.toLowerCase() === name.toLowerCase());
        if (!category) {
            throw `La categoría '${name}' no existe.`;
        }
        return category;
    }

    addCategory(nombre, descripcion) {
        if (!nombre) {
            throw 'Debes de introducir un nombre';
        }
        try {
            this.getCategoryByName(nombre);
        } catch {
            let category = new Category (
                this.getNextId(this.categories), 
                nombre, 
                descripcion
                );
            this.categories.push(category);
            return category;
        }
        throw `Ya existe la categoría '${nombre}'`;
    }

    getProductById(id) {
        let product = this.products.find(product => product.id === id);
        if (!product) {
            throw `El producto con el id '${id}' no existe.`;
        }
        return product;
    }

    getProductsByCategory(id) {
        return this.products.filter(product => product.category === id);
    }

    addProduct(payload) {
        payload = this.verifyProduct(payload);
        let product = new Product (
                this.getNextId(this.products),
                payload.name,
                payload.category,
                payload.price,
                payload.units
        )
        this.products.push(product);
        return product;
    }

    modProduct(payload) {
        payload = this.verifyProduct(payload);
        let index = this.products.findIndex(item => item.id === payload.id);
        this.products[index].name = payload.name;
        this.products[index].price = payload.price;
        this.products[index].category = payload.category;
        this.products[index].units = payload.units;
        return this.products[index];
    }

    modUnitsPorduct(id, newUnits) {
        this.getProductById(id).units = newUnits;
    }

    delCategory(id) {
        let category = this.getCategoryById(id);
        let productsCategory = this.getProductsByCategory(id);
        if (productsCategory.length > 0) {
            throw `La categoría '${id}' tiene productos.'`;
        }
        let index = this.categories.indexOf(category);
        this.categories.splice(index, 1);
        return category;
    }

    delProduct(id) {
        let product = this.getProductById(id);
        if (product.units !== 0) {
            throw `Aún quedan unidades del producto ${id}.`;
        }
        let index = this.products.indexOf(product);
        this.products.splice(index, 1);
        return product;
    }

    totalImport() {
        return this.products.reduce((total, product) => total += product.productImport(), 0);
    }

    orderByUnitsDesc() {
        return this.products.sort((product1, product2) => product2.units - product1.units);
    }

    orderByName() {
        return this.products.sort((product1, product2) => product1.name.localeCompare(product2.name));
    }

    underStock(units) {
        return this.products.filter(product => product.units < units);
    }

    toString() {
        let string = `Almacén ${id} => ${this.products.length} productos: ${this.totalImport} €\n`;
        this.products.forEach((product) => string += `${product}\n`)
        return string
    }

    getNextId(array) {
        return array.reduce((max, item) => (max > item.id) ? max : item.id, 0) + 1;
    }

    verificarNumEntero(numero) {
        if (isNaN(numero)) {
            throw `'${numero}' no es un número.`;
        }
        if (!Number.isInteger(numero)) {
            throw `'${numero}' no es un número entero.`;
        }
        if (numero < 0) {
            throw `'${numero}' no es un número positivo.`;
        }
        return numero;
    }

    verificarNumFloat(numero) {
        if (!numero) {
            throw 'Has de introducir un número.';
        }
        if (isNaN(numero)) {
            throw `'${numero}' no es un número.`;
        }
        if (numero < 0) {
            throw `'${numero}' no es un número positivo.`;
        }
        return numero;
    }

    verifyProduct(payload) {
        if (!payload.name || payload.name.trim().length === 0) {
            throw 'El producto debe tener un nombre';
        }

        if (!payload.category) {
            throw 'El producto debe tener una categoría';
        }

        this.getCategoryById(payload.category);
        this.verificarNumFloat(payload.price);

        if (payload.units) {
            this.verificarNumEntero(payload.units);
        }
        return payload;
    }

    init() {
        let categories = Dades.categories;
        categories.forEach(category => {
            this.categories.push(new Category(category.id, category.name, category.description));
        });

        let products = Dades.products;
        products.forEach(product => {
            this.products.push(new Product(product.id, product.name, product.category, product.price, product.units));
        });
    }

}

module.exports = Store

