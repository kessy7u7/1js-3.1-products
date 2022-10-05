'use strict';

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
            <td></td>
        `;
        
        const tableUI = document.querySelector('#table-products tbody');
        tableUI.appendChild(productUI);
    }

    renderImport(importe) {
        const importUI = document.getElementById('importe-total');
        importUI.textContent = `${importe.toFixed(2)} €`;
    }

    renderNewCategory(category) {
        const categoryUI = document.createElement('option');
        categoryUI.setAttribute('value', category.id);
        categoryUI.setAttribute('id', `cat-${category.id}`);
        categoryUI.innerHTML = `${category.name}`;

        const selectUI = document.querySelector('#newprod-cat');
        selectUI.appendChild(categoryUI);
    }

    delProduct(product) {
        const productUI = document.getElementById(`prod-${product.id}`);
        productUI.remove();
    }

    delCategory(category) {
        const categoryUI = document.getElementById(`cat-${category.id}`);
        categoryUI.remove();
    }

    printError(err) {
        const messageUI = document.createElement('div');
        messageUI.classList = "alert alert-danger alert-dismissible";
        messageUI.setAttribute = ('role', 'alert');
        messageUI.innerHTML = `
        ${err}
		<button type="button" class="btn-close" data-bs-dismiss="alert" 
        aria-label="Close" onclick="this.parentElement.remove()"></button>
        `;
        const divMessage = document.getElementById('messages');
        divMessage.appendChild(messageUI);
    }

}

module.exports = View