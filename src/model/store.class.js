'use strict';

const Category = require('./category.class');
const Product = require('./product.class');
const SERVER = 'http://localhost:3000';

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

    async addCategory(nombre, descripcion) {
        if (!nombre) {
            throw 'Debes de introducir un nombre';
        }
        try {
            this.getCategoryByName(nombre);
        } catch {
            const response = await fetch(SERVER + '/categories', {
                method: 'POST',
                body: JSON.stringify({
                    name: nombre,
                    description: descripcion
                }),
                headers: {
                    'Content-Type' : 'application/json'
                }
            });
            if (!response.ok) {
                throw `Error ${response.status}: Ha habido un problema con la petición`;
            }
            const object = await response.json();

            let category = Category.parse(object);
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

    isNameProductExists(id, name) {
        return this.products.some(product => product.name === name && product.id != id);
    }

    getProductsByCategory(id) {
        return this.products.filter(product => product.category.id === id);
    }

    async addProduct(payload) {
        payload = this.verifyProduct(payload);
        const response = await fetch(SERVER + '/products', {
            method: 'POST',
            body: JSON.stringify(payload),
            headers: {
                'Content-Type' : 'application/json'
            }
        });
        if (!response.ok) {
            throw `Error ${response.status}: Ha habido un problema con la petición`;
        }
        const object = await response.json();

        let product = Product.parse(object);
        product.category = this.getCategoryById(object.category);
        this.products.push(product);
        return product;
    }

    async modProduct(payload) {
        payload = this.verifyProduct(payload);
        const response = await fetch(SERVER + '/products/' + payload.id, {
            method: 'PATCH',
            body: JSON.stringify(payload),
            headers: {
                'Content-Type' : 'application/json'
            }
        });
        if (!response.ok) {
            throw `Error ${response.status}: Ha habido un problema con la petición`;
        }
        const object = await response.json();

        const product = this.getProductById(object.id)
        product.name = object.name;
        product.price = object.price;
        product.category = this.getCategoryById(object.category);
        product.units = object.units;
        return product;
    }

    async modUnitsPorduct(id, newUnits) {
        const response = await fetch(SERVER + '/products/' + id, {
            method: 'PATCH',
            body: `{"units": ${newUnits}}`,
            headers: {
                'Content-Type' : 'application/json'
            }
        });
        if (!response.ok) {
            throw `Error ${response.status}: Ha habido un problema con la petición`;
        }

        const product = this.getProductById(id);
        product.units = newUnits;
        return product;
    }

    async delCategory(id) {
        let category = this.getCategoryById(id);
        let productsCategory = this.getProductsByCategory(id);
        if (productsCategory.length > 0) {
            throw `La categoría ${id} tiene productos.`;
        }
        const response = await fetch(SERVER + '/categories/' + id, {
            method: 'DELETE'
        })
        if (!response.ok) {
            throw `Error ${response.status}: Ha habido un problema con la petición`;
        }
        let index = this.categories.indexOf(category);
        this.categories.splice(index, 1);
        return category;
    }

    async delProduct(id) {
        let product = this.getProductById(id);
        const response = await fetch(SERVER + '/products/' + id, {
            method: 'DELETE'
        })
        if (!response.ok) {
            throw `Error ${response.status}: Ha habido un problema con la petición`;
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

    async init() {
        const [categories, products] = await Promise.all([
            this.getTable('/categories'),
            this.getTable('/products')
        ]);

        categories.forEach(category => {
            this.categories.push(new Category(category.id, category.name, category.description));
        });

        products.forEach(product => {
            this.products.push(new Product(product.id, product.name, this.getCategoryById(product.category), product.price, product.units));
        });
    }

    async getTable(table) {
        const response = await fetch(SERVER + table);
        if (!response.ok) {
            throw `Error ${response.status}: Ha habido un problema al cargar los datos, reinicie la página.`;
        }        
        return await response.json();
    }

}

module.exports = Store

