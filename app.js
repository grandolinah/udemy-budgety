// BUDGET CONTROLLER
let budgetController = (function () {
  const Expense = function (id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
  }

  const Income = function (id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
  }

  let data = {
    allItems: {
      exp: [],
      inc: [],
    },
    total: {
      exp: 0,
      inc: 0,
    }
  }

  return {
    addItem: function (type, desc, val) {
      let newItem, ID;
      // ID = last ID + 1

      // create new ID
      if (data.allItems[type].length === 0) {
        ID = 0;
      } else {
        ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
      }

      // create new item base on type
      if (type === 'exp') {
        newItem = new Expense(ID, desc, val);
      } else if (type === 'inc') {
        newItem = new Income(ID, desc, val);
      }

      // push it into our data structure
      data.allItems[type].push(newItem);

      // return the new element
      return newItem;
    },
    testing: function () {
      console.log(data);
    }
  }
})();

const Expense = function (id, description, value) {
  this.id = id;
  this.description = description;
  this.value = value;
}

// UI CONTROLLER
const UIcontroller = (function () {
  let DOMstrings = {
    inputType: '.add__type',
    inputValue: '.add__value',
    inputDescription: '.add__description',
    inputButton: '.add__btn',
    incomeContainer: '.income__list',
    expenseContainer: '.expenses__list',
  };

  return {
    getInput: function () {
      return {
        type: document.querySelector(DOMstrings.inputType).value,
        description: document.querySelector(DOMstrings.inputDescription).value,
        value: document.querySelector(DOMstrings.inputValue).value,
      }
    },
    addListItem: function (obj, type) {
      let html, element;

      // create html string with placeholder text
      if (type === 'inc') {
        element = DOMstrings.incomeContainer;
        html = `<div class="item clearfix" id="income-${obj.id}"><div class="item__description">${obj.description}</div><div class="right clearfix"><div class="item__value">+ ${obj.value}</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>`
      } else if (type === 'exp') {
        element = DOMstrings.expenseContainer;
        html = `<div class="item clearfix" id="expense-${obj.id}"><div class="item__description">${obj.description}</div><div class="right clearfix"><div class="item__value">- ${obj.value}</div><div class="item__percentage">21 %</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>`
      }

      // insert the html into the DOM
      document.querySelector(element).insertAdjacentHTML('beforeend', html);
    },

    clearFields: function () {
      let fields;

      fields = document.querySelectorAll(DOMstrings.inputDescription + ', ' + DOMstrings.inputValue);

      fields.forEach(el => {
        el.value = '';
      });

      fields[0].focus();
    },
    getDOMstrings: function () {
      return DOMstrings;
    },
  };
})();

// GLOBAL APP CONTROLLER
const controller = (function (budgetCtrl, UICtrl) {
  const setupEventListeners = () => {
    let DOM = UICtrl.getDOMstrings();

    document.querySelector(DOM.inputButton).addEventListener('click', ctrlAddItem);

    document.addEventListener('keypress', (e) => {
      if (e.keyCode === 13 || event.which === 13) {
        ctrlAddItem();
      }
    });
  };

  const ctrlAddItem = () => {
    let input, newItem;

    // get the field input data;
    input = UICtrl.getInput();

    // add the item to the budget controller
    newItem = budgetController.addItem(input.type, input.description, input.value);

    // add the item on the UI
    UICtrl.addListItem(newItem, input.type);

    // clear the fields
    UICtrl.clearFields();

    // calc the budget

    // display the budget
  };

  return {
    init: function () {
      console.log('Application has started.');
      setupEventListeners();
    }
  }


})(budgetController, UIcontroller);

controller.init();