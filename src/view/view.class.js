'use strict';

const productFormUI = document.getElementById('new-prod');
const categoryFormUI = document.getElementById('new-cat');
const tableProductsUI = document.getElementById('almacen');
const tableCategoiesUI = document.getElementById('categories');
const tBodyProductsUI = tableProductsUI.querySelector('tbody');
const selectCategoryUI = document.getElementById('newprod-cat');
const tBodyCategoriesUI = tableCategoiesUI.querySelector('tbody');
const importeTotalUI = document.getElementById('importe-total');
const aboutUsUI = document.getElementById('about-us');
const menuUI = document.querySelector('#navbarNavAltMarkup .navbar-nav');

class View {
    renderNewProduct(product) {
        const productUI = document.createElement('tr');
        productUI.setAttribute('id', `prod-${product.id}`);
        productUI.innerHTML = `
            <td>${product.id}</td>
            <td>${product.name}</td>
            <td>${product.category}</td>
            <td>${product.units}</td>
            <td>${product.price.toFixed(2)} €/u</td>
            <td>${product.productImport().toFixed(2)} €</td>
            ${this.setButtons(product.units)}
        `;
        
        tBodyProductsUI.appendChild(productUI);
        productFormUI.reset();
    }

    editProduct(product) {
        const productUI = document.getElementById(`prod-${product.id}`);
        this.editButtonSubUnit(product.id, product.units);
        productUI.children[1].textContent = product.name;
        productUI.children[2].textContent = product.category;
        productUI.children[3].textContent = product.units;
        productUI.children[4].textContent = product.price.toFixed(2) + " €/u";
        productUI.children[5].textContent = product.productImport().toFixed(2) + " €";
    }

    renderImport(importe) {
        importeTotalUI.textContent = `${importe.toFixed(2)} €`;
    }

    renderNewCategory(category) {
        const categoryOptionUI = document.createElement('option');
        categoryOptionUI.setAttribute('value', category.id);
        categoryOptionUI.innerHTML = `${category.name}`;
        selectCategoryUI.appendChild(categoryOptionUI);

        const categoryRowUI = document.createElement('tr');
        categoryRowUI.setAttribute('id', `cat-${category.id}`);
        categoryRowUI.innerHTML = `
            <td>${category.id}</td>
            <td>${category.name}</td>
            <td>${category.description}</td>
            <td></td>
        `
        tBodyCategoriesUI.appendChild(categoryRowUI);

        categoryFormUI.reset();
    }

    delProduct(product) {
        document.getElementById(`prod-${product.id}`).remove();
    }

    delCategory(category) {
        document.getElementById(`cat-${category.id}`).remove();
        this.printMessage(`Ha sido eliminada la categoría: '${category.name}'`, 2);
    }

    printMessage(message, type = 1) {
        const messageUI = document.createElement('div');
        let bgColor = '';
        switch(type) {  
            case 0: 
                bgColor = 'alert-danger';
                break;
            case 1:
                bgColor = 'alert-success';
                break;
            default:
                bgColor = 'alert-warning';
                break;
        }
        messageUI.classList = "alert alert-dismissible " + bgColor;
        messageUI.setAttribute('role', 'alert');
        messageUI.innerHTML = `${message}`;
        const divMessage = document.getElementById('messages');
        divMessage.appendChild(messageUI);
        setTimeout(function() {
            messageUI.remove()
        }, 7000)
    }

    setButtonResetProductForm() {
        productFormUI.querySelector('button[type="reset"]').addEventListener('click', this.setAddProductForm);
    }

    setAddProductForm() {
        productFormUI.querySelector('legend').textContent = 'Añadir producto';
        productFormUI.querySelector('button[type="submit"]').textContent = 'Añadir';
        productFormUI.reset();
    }

    setModProductForm(product) {
        productFormUI.querySelector('legend').textContent = 'Modificar producto';
        productFormUI.querySelector('#newprod-id').value = product.id;
        productFormUI.querySelector('#newprod-name').value = product.name;
        productFormUI.querySelector('#newprod-cat').value = product.category;
        productFormUI.querySelector('#newprod-units').value = product.units;
        productFormUI.querySelector('#newprod-price').value = product.price.toFixed(2);
        productFormUI.querySelector('button[type="submit"]').textContent = 'Modificar';
    }

    setButtons() {
        return `<td>
            <button class="btn btn-outline-success plus-unit">
                <span class="material-icons">arrow_drop_up</span>
            </button>
            <button class="btn btn-outline-success sub-unit">
                <span class="material-icons">arrow_drop_down</span>
            </button>
            <button class="btn btn-warning mod-product">
                <span class="material-icons">edit</span>
            </button>
            <button class="btn btn-danger del-product">
                <span class="material-icons">delete</span>
            </button>    
        </td>`;
    }

    editButtonSubUnit(id, units) {
        const buttonProductUI = document.querySelector(`#prod-${id} .sub-unit`);
        if (units > 0) {
            buttonProductUI.removeAttribute('disabled');
        } else {
            buttonProductUI.setAttribute('disabled', '');
        }
    }

    setMenu() {        
        menuUI.children[0].addEventListener('click', this.mostrarTablaProductos);

        menuUI.children[1].addEventListener('click', this.mostrarTablaCategorias);
        
        menuUI.children[2].addEventListener('click', () => {
            this.mostrarProductForm();
            this.setAddProductForm();
        });
        
        menuUI.children[3].addEventListener('click', this.mostrarCategoryForm);

        menuUI.children[4].addEventListener('click', this.mostrarAboutUs);
    }

    mostrarTablaProductos() {
        document.querySelector('.visible').classList.replace('visible', 'oculto');        
        tableProductsUI.classList.replace('oculto', 'visible');
    }

    mostrarTablaCategorias() {
        document.querySelector('.visible').classList.replace('visible', 'oculto');        
        tableCategoiesUI.classList.replace('oculto', 'visible');
    }

    mostrarProductForm() {
        document.querySelector('.visible').classList.replace('visible', 'oculto');
        productFormUI.classList.replace('oculto', 'visible');
    }

    mostrarCategoryForm() {
        document.querySelector('.visible').classList.replace('visible', 'oculto');        
        categoryFormUI.classList.replace('oculto', 'visible');
    }

    mostrarAboutUs() {
        document.querySelector('.visible').classList.replace('visible', 'oculto');
        aboutUsUI.classList.replace('oculto', 'visible');
    }

}

module.exports = View