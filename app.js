//
// Bare Bones budget framework
//

// BudgetController
var budgetController = (function() {
    
    var Expense = function(id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
        this.percentage = -1;
    };
    
 
    Expense.prototype.calcPercentage = function(totalIncome) {
        if (totalIncome > 0) {
            this.percentage = Math.round((this.value / totalIncome) * 100);
        } else {
            this.percentage = -1;
        }
    };
    
    Expense.prototype.getPercentage = function() {
        return this.percentage;
    };
  
    
    var Income = function(id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    };
    
    var calculateTotal = function(type) {
        var sum =0;
        data.allItems[type].forEach(function(cur) {
            sum  += cur.value; 
        });
        data.totals[type] = sum;
    };
    
    var data = {
        allItems: {
            exp: [],
            inc: []
        },
        totals: {
            exp: 0,
            inc: 0
        },
        budget: 0
    }
    
    return {
        addItem: function(type, des, val) {
            var newItem, ID;
            
          // Next ID is equal to the last ID in the array + 1
            if (data.allItems[type].length > 0) {
                ID = data.allItems[type][data.allItems[type].length -1].id + 1;
            } else {
                ID = 0;
            }
             
            // Create new item bases on 'inc' or 'exp'
            if (type === 'exp') {
                newItem = new Expense(ID, des, val);
            } else if (type === 'inc') {
                newItem = new Income(ID, des, val);
            }
            
            // Push new Item into the appropriate array
            data.allItems[type].push(newItem);
            
            // Return the New Element
            return newItem;
        }, 
                 
        deleteItem: function(type, id) {
            var ids, index;

            ids = data.allItems[type].map(function(current) {
                return current.id;
            });

            index = ids.indexOf(id);
            if (index !== -1) {
                data.allItems[type].splice(index, 1);
            }
            
        },
        
        calculateBudget: function () {
            // 1. calculate total income and expenses
             calculateTotal('inc');
             calculateTotal('exp');
        
           // 2. Calculate the budget: income - expenses
           data.budget = data.totals.inc - data.totals.exp;
        
            // 3. calculate the percentage of income we have spent.
            if (data.totals.inc > 0) {
                data.percentage = Math.round((data.totals.exp/data.totals.inc) * 100);   
            } else {
                data.percentage = - 1;
            }
        },
        
        calculatePercentages: function() {
          data.allItems.exp.forEach(function(cur)  {
              cur.calcPercentage(data.totals.inc);
          });
         
        },
        
        getPercentages: function() {
          var allPerc = data.allItems.exp.map(function(cur){
            return cur.getPercentage();  
          });  
          return allPerc; 
        },
           
        getBudget: function() {
            return {
                budget: data.budget,
                totalInc: data.totals.inc,
                totalExp: data.totals.exp,
                percentage: data.percentage
            }; 
        },
    
        testing: function() {
            console.log(data);
        }
    };  

 })();


// UI Controller
var UIController = (function() {
                    
    var DOMStrings = {
        
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        inputBtn: '.add__btn',
        incomeContainer: '.income__list',
        expenseContainer: '.expenses__list',
        budgetLabel:  '.budget__value',
        incomeLabel:  '.budget__income--value',
        expensesLabel: '.budget__expenses--value',
        percentageLabel: '.budget__expenses--percentage',
        container: '.container'
    };
    
   return {
       getInput: function() {
           return {
               type: document.querySelector(DOMStrings.inputType).value,
               // type will return either 'inc' or 'exp' as the selection.
               description: document.querySelector(DOMStrings.inputDescription).value,
               value: parseFloat(document.querySelector(DOMStrings.inputValue).value)
           };
       },
       
       addListItem: function(obj, type) {

        var html, newHtml, element, fields, fieldsArr;
        // 1. Create HTML String with 'placeholders'
        
        if (type === 'inc') {
            element = DOMStrings.incomeContainer;
            html = '<div class="item clearfix" id="inc-%id%"><div  class="item__description">%description%</div><div class="right clearfix"><div class="item__value">+%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
        } else if (type === 'exp') {
            element = DOMStrings.expenseContainer;
            html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
        }

        // 2. Replace the placeholder test with some actual data
 
        newHtml = html.replace('%id%', obj.id);
        newHtml = newHtml.replace('%description%', obj.description);
        newHtml = newHtml.replace('%value%', obj.value);
                                    
        // 3. Insert the HTML into the DOM.
        document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);          
       },
       
       deleteListItem: function (selectorID){
           var el = document.getElementById(selectorID);
           el.parentNode.removeChild(el);         
       },
       
       clearFields: function() {
           fields = document.querySelectorAll(DOMStrings.inputDescription + ', ' + DOMStrings.inputValue);

           
           fieldsArr = Array.prototype.slice.call(fields);
           
           fieldsArr.forEach(function(current, index, ) {
               current.value = "";
           });
           
           fieldsArr[0].focus();  // First Field is description
       },
       
       displayBudget: function(obj) {
//         console.log(obj)
           document.querySelector(DOMStrings.budgetLabel).textContent 
               = obj.budget;  
           document.querySelector(DOMStrings.incomeLabel).textContent 
               = obj.totalInc;   
           document.querySelector(DOMStrings.expensesLabel).textContent =      obj.totalExp;
           if (obj.percentage > 0) {
                document.querySelector(DOMStrings.percentageLabel).textContent = obj.percentage + '%';
           } else {
                document.querySelector(DOMStrings.percentageLabel).textContent = '---';
           }
       },
       
       getDOMStrings: function() {
           return DOMStrings;
       }   
  
   };
                    
})();

// Global App Controller
var controller = (function(budgetCtrl, UICtrl) {
    
    var setupEventListeners = function() {
    
        var DOM = UICtrl.getDOMStrings()
        document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem);
    
        document.addEventListener('keypress',function(event) {
            if(event.keyCode === 13 || event.which === 13) {
                ctrlAddItem();
            }
        });  
        
        document.querySelector(DOM.container).addEventListener('click', ctrlDeleteItem);
    };
    
    var updatePercentages = function() {
        
        //1. Calculate Percentages
        budgetCtrl.calculatePercentages();

        //2. Read percentages for the budget controller
         var percentages = budgetCtrl.getPercentages();

        //3. update the UI with the new percentages
        console.log(percentages);
    };
    
    var updateBudget = function() {
        // 1. Calculate the Budget  
        budgetCtrl.calculateBudget();

        // 2. Return the Budget
        var budget = budgetCtrl.getBudget();
        
        // 3. Display Budget on the UI   
        UICtrl.displayBudget(budget);
    };
 
    var ctrlAddItem = function() {
        // Variables
        var input, newItem;

        // 1. Get the field Input Data
        input = UICtrl.getInput();
        
        if(input.description !== "" && !isNaN(input.value) && input.value > 0) {

            // 2. Add item to the budgetController 
            newItem = budgetCtrl.addItem(input.type,      input.description, input.value);
            
            // 3. Add the item to the UI
            UICtrl.addListItem(newItem, input.type);    

            // 4. Clear the Fields
            UICtrl.clearFields();

            // 5. Calculate and Update Budget

            updateBudget();
            
            // 6. Calculate and Update Percentages
            updatePercentages();
        }   
    };
    
    var ctrlDeleteItem = function(event) {
        var itemID, splitID, type, ID;
        itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;
        if (itemID) {   // If itemID not defined - will be False
             
            //inc-1  - will return a array:  ["inc","1"]
            splitID = itemID.split('-');
            type = splitID[0];
            ID = parseInt(splitID[1]);
            
            //1. Delete from the data structure
            budgetCtrl.deleteItem(type, ID)
            
            //2. Delete item from the UI
            UICtrl.deleteListItem(itemID)
            
            //3. Update and show the new budget
            updateBudget();                
            
            //4. Calculate and Update Percentages
            updatePercentages();
        }
     };
    
    return {
        init: function() {
            console.log('Program is Initialized!')
            UICtrl.displayBudget( { // Create Object in-place
                budget: 0,
                totalInc: 0,
                totalExp: 0,
                percentage: -1
                });
            setupEventListeners();
        }
    }  
    
})(budgetController, UIController);

controller.init();

