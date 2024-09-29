// storage


// item 
const item = (function() {
    class Item{
        constructor(id, name, calories) {
            this.id = id;
            this.name = name;
            this.calories = calories;
        }
    }
    const data = {
        items: [
            // {id:1, name: 'Steak', calories: 1200},
            // {id:2, name: 'Cookies', calories: 400},
            // {id:3, name: 'Eggs', calories: 300}
        ],
        currentitem: null,
        totalcalories: 0
    }

    return {
        logData: function() {
            return data;
        },
        getItems: function() {
            return data.items;
        },
        addItem: function(name, calories) {
            let id;
            if(data.items.length > 0) {
                id = data.items[data.items.length - 1].id + 1
            } else {
                id = 0
            }
            calories = parseInt(calories);
            newItem = new Item(id, name, calories);
            data.items.push(newItem);
            return newItem;
        },
        getTotal: function() {
            let total = 0;
            data.items.forEach(item => {
                total += item.calories;
                data.totalcalories = total;
            });
            return total;
        },
        getElementById: function(id) {
            let found = null;
            data.items.forEach(item => {
                if(item.id === id) {
                    found = item;
                }
            });
            return found;
        },
        setCurrent: function(item) {
            data.currentitem = item;
        },
        getCurrent: function() {
            return data.currentitem;
        },
        updateItem: function(name, calories) {
            calories = parseInt(calories);
            let found = null;
            data.items.forEach(item => {
                if(item.id === data.currentitem.id) {
                    item.name = name;
                    item.calories = calories;
                    found = item;
                }
            });
            return found;
        },
        removeItem: function(id) {
            const ids = data.items.map(item => {
                return item.id;
            });
            const index = ids.indexOf(id);
            data.items.splice(index, 1);
        }
    }
})(); 

// ui
const ui = (function() {
    const selectors = {
        itemList: '#item-list',
        listItems: '#item-list li',
        itemName: '#item-name',
        itemCalories: '#item-calories',
        addBtn: '.add-btn',
        updateBtn: '.update-btn',
        removeBtn: '.remove-btn',
        backBtn: '.back-btn',
        totalcalories: '.total-calories'
    }

    return {
        getSelectors: function() {
            return selectors;
        },
        populateItemList: function(items) {
            let output = '';
            items.forEach(item => {
                output += `
                <li class="collection-item" id="item-${item.id}">
                    <strong>${item.name}</strong>  <em>${item.calories} Calories</em>
                    <a href="#" class="secondary-content">
                        <i class="edit-item fa fa-pencil"></i>
                    </a>
                </li>
                `;
            });
            document.querySelector(selectors.itemList).innerHTML = output;
        },
        clearEdit: function() {
            document.querySelector(selectors.addBtn).style.display = 'inline';
            document.querySelector(selectors.updateBtn).style.display = 'none';
            document.querySelector(selectors.removeBtn).style.display = 'none';
            document.querySelector(selectors.backBtn).style.display = 'none';
            this.clearInput();
        },
        showEdit: function() {
            document.querySelector(selectors.addBtn).style.display = 'none';
            document.querySelector(selectors.updateBtn).style.display = 'inline';
            document.querySelector(selectors.removeBtn).style.display = 'inline';
            document.querySelector(selectors.backBtn).style.display = 'inline';
        },
        getInput: function() {
            return {
                name: document.querySelector(selectors.itemName).value,
                calories: document.querySelector(selectors.itemCalories).value
            }
        },
        clearInput: function() {
            document.querySelector(selectors.itemName).value = '';
            document.querySelector(selectors.itemCalories).value = '';
        },
        addItem: function(item) {
            this.showList();
            const li = document.createElement('li');
            li.className = 'collection-item';
            li.id = `item-${item.id}`;
            li.innerHTML = `
                <strong>${item.name}</strong>  <em>${item.calories} Calories</em>
                <a href="#" class="secondary-content">
                    <i class="edit-item fa fa-pencil"></i>
                </a>
            `;
            document.querySelector(selectors.itemList).insertAdjacentElement('beforeend', li);
        },
        hideList: function() {
            document.querySelector(selectors.itemList).style.display = 'none';
        },
        showList: function() {
            document.querySelector(selectors.itemList).style.display = 'block';
        },
        showTotal: function(totalcalories) {
            document.querySelector(selectors.totalcalories).textContent = totalcalories;
        },
        addForm: function() {
            this.showEdit();
            document.querySelector(selectors.itemName).value = item.getCurrent().name;
            document.querySelector(selectors.itemCalories).value = item.getCurrent().calories;
        },
        updateItem: function(item) {
            let listItems = document.querySelectorAll(selectors.listItems);
            listItems = Array.from(listItems);
            listItems.forEach(listItem => {
                const listId = `item-${item.id}`;
                if(listId === listItem.id) {
                    document.querySelector(`#${listId}`).innerHTML = `
                        <strong>${item.name}</strong>  <em>${item.calories} Calories</em>
                        <a href="#" class="secondary-content">
                            <i class="edit-item fa fa-pencil"></i>
                        </a>
                    `;
                }
            });
        },
        removeItem: function(id) {
            const itemId = `#item-${id}`;
            const item = document.querySelector(itemId);
            item.remove();
        }
    }
})();

// app
const app = (function(item, ui) {
    const loadEventListners = function() {
        const selectors = ui.getSelectors();

        document.addEventListener('keypress', e => {
            if(e.keyCode === 13 || e.which === 13) {
                e.preventDefault();
                return false;
            }
        });
        document.querySelector(selectors.addBtn).addEventListener('click', itemAdd);
        document.querySelector(selectors.itemList).addEventListener('click', itemEdit);
        document.querySelector(selectors.backBtn).addEventListener('click', e => {
            ui.clearEdit();
            e.preventDefault();
        });
        document.querySelector(selectors.updateBtn).addEventListener('click', itemUpdate);
        document.querySelector(selectors.removeBtn).addEventListener('click', itemRemove);
    }

    const itemAdd = function(e) {
        const input = ui.getInput();
        if(input.name !== '' && input.calories !== '') {
            const newItem = item.addItem(input.name, input.calories);
            ui.addItem(newItem);
            const totalcalories = item.getTotal();
            ui.showTotal(totalcalories);
            ui.clearInput();
        }

        e.preventDefault();
    }

    const itemEdit = function(e) {
        if(e.target.classList.contains('edit-item')) {
            const listId = e.target.parentNode.parentNode.id;
            const listIdArr = listId.split('-');
            const id = parseInt(listIdArr[1]);
            const itemToEdit = item.getElementById(id);
            item.setCurrent(itemToEdit);
            ui.addForm();
        }

        e.preventDefault();
    }

    const itemUpdate = function(e) {
        const input = ui.getInput();
        const updateItem = item.updateItem(input.name, input.calories);
        ui.updateItem(updateItem);
        const totalcalories = item.getTotal();
        ui.showTotal(totalcalories);
        ui.clearEdit();
        e.preventDefault();
    }

    const itemRemove = function(e) {
        const currentitemID = item.getCurrent().id;
        item.removeItem(currentitemID);
        ui.removeItem(currentitemID);
        const totalcalories = item.getTotal();
        ui.showTotal(totalcalories);
        const items = item.getItems();
        if(items.length === 0) {
            ui.hideList();
        }
        ui.clearEdit();

        e.preventDefault();
    }
    
    return {
        init: function() {
            console.log('Initializing App...');
            ui.clearEdit();
            const items = item.getItems();
            if(items.length === 0) {
                ui.hideList();
            } else {
                ui.populateItemList(items);
            }
            loadEventListners();
        }
    }
})(item, ui);
app.init();