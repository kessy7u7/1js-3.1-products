'use strict';

// Aquí la clase Product

class Product {
    constructor(id, name, category, price, units = 0) {
        this. id = id;
        this.name = name;
        this.category = category;
        this.price = price;
        this.units = units;
    }

    productImport() {
        return this.price * this.units;
    }
    
    toString() {
        return `${this.name}: ${this.units} uds. x ${this.price.toFixed(2)} €/u = ${this.productImport().toFixed(2)} €`;
    }

    static parse(object) {
        return new Product(object.id, object.name, object.category, object.price, object.units);
    }
}

module.exports = Product

