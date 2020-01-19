// BUDGET CONTROLLER
let budgetController = (function () {
  class Expense {
    constructor(id, description, value) {
      this.id = id;
      this.description = description;
      this.value = value;
    }
  }

  class Income {
    constructor(id, description, value) {
      this.id = id;
      this.description = description;
      this.value = value;
    }
  }

  const calculateTotal = (type) => {
    let sum = 0;

    data.allItems[type].forEach((el) => {
      sum += el.value;
    })
    data.total[type] = sum;
  };;

  let data = {
    allItems: {
      exp: [],
      inc: [],
    },
    total: {
      exp: 0,
      inc: 0,
    },
    budget: 0,
    percentage: -1,
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
    deleteItem: function (type, id) {
      let ids, index;

      // id = 6
      //data.allItems[type][id];
      // ids [ 1 2 3 6 8]
      // idex = 3

      ids = data.allItems[type].map((current) => {
        return current.id;
      });

      index = ids.indexOf(id);

      if (index !== -1) {
        data.allItems[type].splice(index, 1);
      }
    },
    calculateBudget: function () {

      // calculate total income and expenses
      calculateTotal('exp');
      calculateTotal('inc');

      // calculate the budget: income - expenses
      data.budget = data.total.inc - data.total.exp;

      if (data.total.inc > 0) {
        // Expense = 100 and income 300, spent 33.333% = 100/300 = 0.3333 * 100
        data.percentage = Math.round((data.total.exp / data.total.inc) * 100);
      } else {
        data.percentage = -1;
      }
    },
    getBudget: function () {
      return {
        budget: data.budget,
        totalInc: data.total.inc,
        totalExp: data.total.exp,
        percentage: data.percentage,
      };
    },
    testing: function () {
      console.log(data);
    }
  }
})();

// UI CONTROLLER
const UIcontroller = (function () {
  let DOMstrings = {
    inputType: '.add__type',
    inputValue: '.add__value',
    inputDescription: '.add__description',
    inputButton: '.add__btn',
    incomeContainer: '.income__list',
    expenseContainer: '.expenses__list',
    budgetLabel: '.budget__value',
    incomeLabel: '.budget__income--value',
    expenseLabel: '.budget__expenses--value',
    percentageLabel: '.budget__expenses--percentage',
    container: '.container',
  };

  return {
    getInput: function () {
      return {
        type: document.querySelector(DOMstrings.inputType).value,
        description: document.querySelector(DOMstrings.inputDescription).value,
        value: Number(document.querySelector(DOMstrings.inputValue).value),
      }
    },

    addListItem: function (obj, type) {
      let html, element;

      // create html string with placeholder text
      if (type === 'inc') {
        element = DOMstrings.incomeContainer;
        html = `<div class="item clearfix" id="inc-${obj.id}"><div class="item__description">${obj.description}</div><div class="right clearfix"><div class="item__value">+ ${obj.value}</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>`
      } else if (type === 'exp') {
        element = DOMstrings.expenseContainer;
        html = `<div class="item clearfix" id="exp-${obj.id}"><div class="item__description">${obj.description}</div><div class="right clearfix"><div class="item__value">- ${obj.value}</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>`
      }

      // insert the html into the DOM
      document.querySelector(element).insertAdjacentHTML('beforeend', html);
    },

    deleteListItem: function (selectorId) {
      document.querySelector(`#${selectorId}`).remove();
    },

    clearFields: function () {
      let fields;

      fields = document.querySelectorAll(DOMstrings.inputDescription + ', ' + DOMstrings.inputValue);

      fields.forEach(el => {
        el.value = '';
      });

      fields[0].focus();
    },

    displayBudget: function (obj) {
      document.querySelector(DOMstrings.budgetLabel).textContent = obj.budget;
      document.querySelector(DOMstrings.incomeLabel).textContent = obj.totalInc;
      document.querySelector(DOMstrings.expenseLabel).textContent = obj.totalExp;

      if (obj.percentage > 0) {
        document.querySelector(DOMstrings.percentageLabel).textContent = `${obj.percentage} %`;
      } else {
        document.querySelector(DOMstrings.percentageLabel).textContent = `---`;
      }
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

    document.querySelector(DOM.container).addEventListener('click', ctrlDeleteItem);
  };

  const updateBudget = () => {
    let budget;

    // calc the budget
    budgetController.calculateBudget();

    // return the budget
    budget = budgetController.getBudget();

    // display the budget
    UICtrl.displayBudget(budget);
  };

  const ctrlAddItem = () => {
    let input, newItem;

    // get the field input data;
    input = UICtrl.getInput();

    if (input.description !== '' && !isNaN(input.value) && input.value > 0) {
      // add the item to the budget controller
      newItem = budgetController.addItem(input.type, input.description, input.value);

      // add the item on the UI
      UICtrl.addListItem(newItem, input.type);

      // clear the fields
      UICtrl.clearFields();

      // calculate and update budget
      updateBudget();
    }
  };

  const ctrlDeleteItem = (e) => {
    let itemID, splitID, type, id;

    itemID = e.target.parentNode.parentNode.parentNode.parentNode.id;

    if (itemID) {
      splitID = itemID.split('-');
      type = splitID[0];
      id = +splitID[1];

      // delete from the data structure
      budgetController.deleteItem(type, id);

      // delete from the UI
      UIcontroller.deleteListItem(itemID);

      // update and show the budget
      updateBudget();
    }
  };

  return {
    init: function () {
      console.log('Application has started.');
      UICtrl.displayBudget({
        budget: 0,
        totalInc: 0,
        totalExp: 0,
        percentage: -1,
      });
      setupEventListeners();
    }
  }
})(budgetController, UIcontroller);

controller.init();