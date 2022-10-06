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
        this.printMessage(`Ha sido eliminado el producto: '${product.name}'`, 2);
    }

    delCategory(category) {
        const categoryUI = document.getElementById(`cat-${category.id}`);
        categoryUI.remove();
        this.printMessage(`Ha sido eliminada la categoría: '${category.name}'`, 2);
    }

    printMessage(message, success = 1) {
        const messageUI = document.createElement('div');
        let bgColor = '';
        switch(success) {  
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
        messageUI.setAttribute = ('role', 'alert');
        messageUI.innerHTML = `${message}`;
        const divMessage = document.getElementById('messages');
        divMessage.appendChild(messageUI);
        setTimeout(function() {
            messageUI.remove()
        }, 7000)
    }

}

module.exports = View