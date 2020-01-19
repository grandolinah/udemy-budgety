// BUDGET CONTROLLER
let budgetController = (function () {
  class Expense {
    constructor(id, description, value) {
      this.id = id;
      this.description = description;
      this.value = value;
    }
  }

    Expense.prototype.calcPercentages = function (totalIncome) {
    if (totalIncome> 0) {
    this.percentage = Math.round((this.value / totalIncome) * 100);
  } else {
    this.percentage = -1;
  }
  };

    Expense.prototype.getPercentages = function (totalIncome) {
    return this.percentage;
  };

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

    calculatePercentages: function () {
      /* 
      a = 20
      b = 10
      c = 40

      income = 100
      a = 20 / 100 = 20%
      b = 10 / 100 = 10%
      c = 40 / 100 = 40%
      */

      data.allItems.exp.forEach((cur) => {
        cur.calcPercentages(data.total.inc);
      })
    },

    getPercentages: function () {
      let allPerc = data.allItems.exp.map((cur) => {
        return cur.getPercentages();
      })

      return allPerc;
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
    expensesPercLabel: '.item__percentage',
    dateLabel: '.budget__title--month',
  };

  const formatNumber = (number, type) => {
    let numberSplit, int, dec, sign, result;
    /*
    + or - before the number
    2 decimal points
    comma separating the thousands

    2310.3456 -> + 2,310.35
    */

    number = Math.abs(number).toFixed(2);
    numberSplit = number.split('.');

    int = numberSplit[0];
    dec = numberSplit[1];

    if(int.length > 3) {
      int = int.substr(0, int.length -3 ) + ',' + int.substr(int.length - 3, 3);
    }

    if(type === 'exp') {
      sign = '-';
    }else if(type === 'inc') {
      sign = '+';
    }

    result = `${sign} ${int}.${dec}`

    return result;
  };

  const nodeListForEach = function(list, callback) {
    for (var i = 0; i < list.length; i++) {
        callback(list[i], i);
    }
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

        html = `<div class="item clearfix" id="inc-${obj.id}"><div class="item__description">${obj.description}</div><div class="right clearfix"><div class="item__value">${formatNumber(obj.value, type)}</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>`
      } else if (type === 'exp') {
        element = DOMstrings.expenseContainer;

        html = `<div class="item clearfix" id="exp-${obj.id}"><div class="item__description">${obj.description}</div><div class="right clearfix"><div class="item__value">${formatNumber(obj.value, type)}</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>`
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
      let type;

      if(obj.budget > 0) {
        type = 'inc'
      }else{
        type = 'exp'
      }

      document.querySelector(DOMstrings.budgetLabel).textContent = formatNumber(obj.budget, type);
      document.querySelector(DOMstrings.incomeLabel).textContent = formatNumber(obj.totalInc, 'inc');
      document.querySelector(DOMstrings.expenseLabel).textContent = formatNumber(obj.totalExp, 'exp');

      if (obj.percentage > 0) {
        document.querySelector(DOMstrings.percentageLabel).textContent = `${obj.percentage} %`;
      } else {
        document.querySelector(DOMstrings.percentageLabel).textContent = `---`;
      }
    },

    displayPercentages: function(percentages) {
      const fields = document.querySelectorAll(DOMstrings.expensesPercLabel);

      nodeListForEach(fields, function(current, index) {
        if (percentages[index] > 0) {
          current.textContent = `${percentages[index]} %`;
        } else {
          current.textContent = `---`;
        }
      });
    },

    displayMonth: function () {
      let now, year, month;

      const months = ['January','February','March','April','May','June','July',
      'August','September','October','November','December'];

      now = new Date();
      year = now.getFullYear();
      month = now.getMonth();

      document.querySelector(DOMstrings.dateLabel).textContent = `${months[month]}, ${year}`;
    },

    changedType: function () {
      let fields = document.querySelectorAll(
        DOMstrings.inputType + ','+
        DOMstrings.inputDescription + ',' +
        DOMstrings.inputValue
      );

      nodeListForEach(fields, function(cur) {
        cur.classList.toggle('red-focus');
      })

      document.querySelector(DOMstrings.inputButton).classList.toggle('red');
    },

    getDOMstrings: function () {
      return DOMstrings;
    },
  };
})();

// GLOBAL APP CONTROLLER
const controller = (function (budgetCtrl, UICtrl) {
  const setupEventListeners = () => {
    const DOM = UICtrl.getDOMstrings();

    document.querySelector(DOM.inputButton).addEventListener('click', ctrlAddItem);

    document.addEventListener('keypress', (e) => {
      if (e.keyCode === 13 || event.which === 13) {
        ctrlAddItem();
      }
    });

    document.querySelector(DOM.container).addEventListener('click', ctrlDeleteItem);

    document.querySelector(DOM.inputType).addEventListener('change',
    UICtrl.changedType);
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

  const updatePercentages = () => {
    let percentages;

    // calc the percentages
    budgetCtrl.calculatePercentages();

    // read percentages from the budget controller
    percentages = budgetCtrl.getPercentages();

    // update UI with new percentages
    UICtrl.displayPercentages(percentages);
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

      // caclulate and update percentage
      updatePercentages();
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

      // caclulate and update percentage
      updatePercentages();
    }
  };

  return {
    init: function () {
      console.log('Application has started.');
      UICtrl.displayMonth();
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