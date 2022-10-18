'use strict'

const Controller = require('./controller/controller.class')

const myController = new Controller()
myController.init()

window.addEventListener('load', () => {

  document.getElementById('new-prod').addEventListener('submit', (event) => {
    event.preventDefault()

    const id = Number(document.getElementById('newprod-id').value);
    const name = document.getElementById('newprod-name').value;
    const price = Number(document.getElementById('newprod-price').value); 
    const category = Number(document.getElementById('newprod-cat').value);
    const units = Number(document.getElementById('newprod-units').value);
    
    if (!id) {
      myController.addProductToStore({ name, price, category, units });
    } else {
      myController.modProductFromStore({ id, name, price, category, units });
    }
  })

  document.getElementById('new-cat').addEventListener('submit', (event) => {
    event.preventDefault()

    const name = document.getElementById('newcat-name').value;
    const description = document.getElementById('newcat-desc').value;

    myController.addCategoryToStore({ name, description });
  })

})
