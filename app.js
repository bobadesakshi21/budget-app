//BUDGET CONTROLLER keeps track of all the income and expenses

var budgetConroller = (function(){
          var Expense = function(id, description, value){
                  this.id = id;
                  this.description = description;
                  this.value = value;
                  this.percentage = -1;
          }

          Expense.prototype.calcPercentage = function(totalInc) {
              if(totalInc > 0){
                this.percentage = Math.round((this.value / totalInc) * 100);
              }else{
                  this.percentage = -1;
              }
          }

          Expense.prototype.getPercentage = function() {
              return this.percentage;
          }

          var Income = function(id, description, value){
                  this.id = id;
                  this.description = description;
                  this.value = value;
          }

          var calculateTotal = function(type){
                var sum = 0;
                data.allItems[type].forEach(function(current){
                     sum += current.value;
                });
                data.totals[type] = sum;
            
          }

          var data = {
              allItems:{
                  inc:[],
                  exp:[]
              },
              totals:{
                  inc: 0,
                  exp: 0
              },
              budget: 0,
              percentage: -1
          }

          return{
            addItem: function(type, description, value){

                var newItem,ID;

                //Creating new id
                if(data.allItems[type].length > 0){
                    ID = data.allItems[type][data.allItems[type].length-1].id + 1;
                }else{
                    ID = 0;
                }

                //Creating new item
                if(type === 'exp'){
                    newItem = new Expense(ID, description, value);
                }else{
                    newItem = new Income(ID, description, value);
                }
                   
                //adding item to the array depending on 'inc' and 'exp'
                data.allItems[type].push(newItem);

                //Return newly created item
                return newItem;
            },

            deleteItem: function(type, id){
                var ids, index;

                ids = data.allItems[type].map(function(current) {
                        return current.id;
                });

                index = ids.indexOf(id);
                
                if(index !== -1){
                    data.allItems[type].splice(index, 1);
                }

            },

            calculateBudget: function(){

                //1.Calculate Total Income And Expenses
                  calculateTotal('inc');
                  calculateTotal('exp');

                //2.Calculate Budget 
                data.budget = data.totals.inc - data.totals.exp;

                //3.calculate percentage
                if(data.totals.inc > 0){
                  data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
                }else{
                    data.percentage = -1;
                }
            },

            getBudget: function(){
                  return{
                      budget: data.budget,
                      totalInc: data.totals.inc,
                      totalExp: data.totals.exp,
                      percentage: data.percentage
                  }
            },

            calculatePercentage: function(){
                data.allItems.exp.forEach(function(current) {
                    current.calcPercentage(data.totals.inc);
                });
            },

            getPercentagesOfExp: function(){
                var allPerc = data.allItems.exp.map(function(current){
                    return current.getPercentage();
                });
                return allPerc;
            },

            testing: function(){
                console.log(data);
            }
          }



})();

var UIController = (function(){
    
    var DOMstrings = {
          inputType: '.add__type',
          inputDescription: '.add__description',
          inputValue: '.add__value',
          inputBtn: '.add__btn',
          incomeContainer: '.income__list',
          expensesContainer: '.expenses__list',
          budgetLable: '.budget__value',
          incomeLable: '.budget__income--value',
          expenseLable: '.budget__expenses--value',
          percentage: '.budget__expenses--percentage',
          container: '.container',
          expensesPercLable: '.item__percentage',
          dateLable: '.budget__title--month'
    };

    var nodeListForEach = function(list, callback) {
        for(var i=0; i<list.length; i++) {
            callback(list[i],i);
        }
    }

    return {
        getInput: function(){
            return{
                type: document.querySelector(DOMstrings.inputType).value,
                description: document.querySelector(DOMstrings.inputDescription).value,
                value: parseFloat(document.querySelector(DOMstrings.inputValue).value)
            }
        },

        addItemInList: function(obj, type){
            var html, newHtml, element;

            //Create html String with Placeholder text
            if(type === 'inc'){
                //element = document.querySelector(DOMstrings.incomeContainer);
                element = DOMstrings.incomeContainer;

                html = '<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            }else{
                //element = document.querySelector(DOMstrings.expensesContainer);
                element = DOMstrings.expensesContainer;

                 html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            }

            //Replace Placeholder text with actual data
            newHtml = html.replace('%id%', obj.id);
            newHtml = newHtml.replace('%description%', obj.description);
            newHtml = newHtml.replace('%value%', obj.value);
            
            //insert the html into the dom
            document.querySelector(element).insertAdjacentHTML('beforeend',newHtml);
            
        },

        deleteItemFromList: function(selectorId) {
             var element = document.getElementById(selectorId);
             element.parentNode.removeChild(element);
        },

        clearFields: function(){
            var fields, fieldArray;

            fields = document.querySelectorAll(DOMstrings.inputDescription + ', ' + DOMstrings.inputValue);

            fieldArray = Array.prototype.slice.call(fields);
            fieldArray.forEach(function(current, index, array){
                current.value = '';
            })
            fieldArray[0].focus();   
        },

        displayBudget: function(obj){
            document.querySelector(DOMstrings.budgetLable).textContent = obj.budget;
            document.querySelector(DOMstrings.incomeLable).textContent = obj.totalInc;
            document.querySelector(DOMstrings.expenseLable).textContent = obj.totalExp;

            if(obj.percentage > 0){
                document.querySelector(DOMstrings.percentage).textContent = obj.percentage + '%';
            }else{
                document.querySelector(DOMstrings.percentage).textContent = '---';
            }
        },

        displayPercentages: function(percentages) {
            var fields = document.querySelectorAll(DOMstrings.expensesPercLable);

            nodeListForEach(fields,function(current,index) {
                if(percentages[index] > 0){
                    current.textContent = percentages[index] + '%';   
                }else{
                    current.textContent = '---';
                }
            });
        },

        displayMonth: function() {
            var now, year, month, monthArray;
            
            monthArray = ['January','February','March','April','May','June','July','August','September','October','November','December'];

            now = new Date();
            year = now.getFullYear();
            month = now.getMonth();

            document.querySelector(DOMstrings.dateLable).textContent = monthArray[month] + ' ' + year;

        },

        changedType: function() {

            var fields = document.querySelectorAll(
                DOMstrings.inputType + ',' + 
                DOMstrings.inputDescription + ',' + 
                DOMstrings.inputValue
            );
            nodeListForEach(fields,function(current) {
                current.classList.toggle('red-focus');
            });

            document.querySelector(DOMstrings.inputBtn).classList.toggle('red');
        },

        getDOM: function(){
            return DOMstrings;
        }
    }

})();

var Controller = (function(budgetCtrl, UICtrl){

    var setUpEventListeners = function(){
        DOM = UICtrl.getDOM(); 
        
        document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem);

        document.addEventListener('keypress', function(event){
           
             if(event.keyCode === 13){
                 ctrlAddItem();
             }
             
        document.querySelector(DOM.container).addEventListener('click', ctrlDeleteItem);
        });

        document.querySelector(DOM.inputType).addEventListener('change', UICtrl.changedType);
    }

    var updateBudget = function() {
        
        //1.Calculate the budget
        budgetCtrl.calculateBudget();

        //2.Return the budget
        var budget = budgetCtrl.getBudget();

        //3.Display the budget to UI
        UICtrl.displayBudget(budget);
    }

    var updatePercentages = function() {
         
          //1.Calculate Percentages
          budgetCtrl.calculatePercentage();

         //2.Read Percentages from budget controller
         var percentages = budgetCtrl.getPercentagesOfExp();

         //3.Update the UI with the new percentage
         UICtrl.displayPercentages(percentages);
    }

    var ctrlAddItem = function(){
           
        var input, addItem;
        

        //1.Get the data from input fields field
        input = UIController.getInput();
              
        if(input.description !== '' && !isNaN(input.value) && input.value > 0 )
        {
                //2.Add the item to the budgetConroller
                newItem = budgetCtrl.addItem(input.type, input.description, input.value);
                
                //3.Add the item to the UIController
                UICtrl.addItemInList(newItem, input.type);

                //4.Clear the input fields
                UICtrl.clearFields();

                //5.calculate And Update Budget
                updateBudget();

                //calculate and update percentage
                updatePercentages();
        }     
      }

      var ctrlDeleteItem = function(event) {
          var itemId, splitId, type, ID;

          itemId = event.target.parentNode.parentNode.parentNode.parentNode.id;
          
          if(itemId){
            splitId = itemId.split('-');
            type = splitId[0];
            ID = parseInt(splitId[1]);

            //1.Delete the item from the data structure
            budgetCtrl.deleteItem(type, ID);
            
            //2.Delete the item from the UI
            UICtrl.deleteItemFromList(itemId);

            //3.Update and show the new budget
            updateBudget();

            //4.Calculate and update percentages
            updatePercentages();
          }
      }

      return{
          init: function(){
              console.log('init function is called');
              setUpEventListeners();
              UICtrl.displayBudget({
                budget: 0,
                totalInc: 0,
                totalExp: 0,
                percentage: -1
            });
            UICtrl.displayMonth();
          }
      }

})(budgetConroller, UIController);

Controller.init();