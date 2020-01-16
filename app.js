// BUDGET CONTROLLER
let budgetController = (function () {


})();

// UI CONTROLLER
const UIcontroller = (function () {

  let DOMstrings = {
    inputType: '.add__type',
    inputValue: '.add__value',
    inputDescription: '.add__description',
    inputButton: '.add__btn',

  };

  return {
    getInput: function () {
      return {
        type: document.querySelector(DOMstrings.inputType).value,
        desctription: document.querySelector(DOMstrings.inputDescription).value,
        value: document.querySelector(DOMstrings.inputValue).value,
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
    console.log(DOM);

    document.querySelector(DOM.inputButton).addEventListener('click', ctrlAddItem);

    document.addEventListener('keypress', (e) => {
      if (e.keyCode === 13 || event.which === 13) {
        ctrlAddItem();
      }
    });
  };

  const ctrlAddItem = () => {
    // 1 get the field input data;
    let input = UICtrl.getInput();

    // 2 add the item to the budget controller

    // 3 add the item on the UI

    // 4 calc the budget

    // 5 display the budget
  };

  return {
    init: function () {
      console.log('Application has started.');
      setupEventListeners();
    }
  }


})(budgetController, UIcontroller);

controller.init();