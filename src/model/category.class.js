'use strict';

// Aquí la clase Category

class Category {
    constructor(id, name, description = 'No hay descripción') {
        this.id = id;
        this.name = name;
        this.description = description;
    }

    static parse(object) {
        return new Category(object.id, object.name, object.description);
    }
}

module.exports = Category
