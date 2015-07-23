/*
  A calculator app allowing user to perform basic Math operations.
    User Story: As a user, I can add, subtract, multiply and divide two numbers.
    Bonus User Story: I can clear the input field with a clear button.
    Bonus User Story: I can keep chaining mathematical operations together until
    I hit the clear button, and the calculator will tell me the correct output.
*/


// jQuery
$(document).ready(function() {

  // Catch user input
  $('#0').on('click', function() {
    calculator.calcInput(0);
  });
  $('#00').on('click', function() {
    var count = 2;
    do {
      calculator.calcInput(0);
      count--;
    } while (count > 0);
  });
  $('#000').on('click', function() {
    var count = 3;
    do {
      calculator.calcInput(0);
      count--;
    } while (count > 0);
  });
  $('#1').on('click', function() {
    calculator.calcInput(1);
  });
  $('#2').on('click', function() {
    calculator.calcInput(2);
  });
  $('#3').on('click', function() {
    calculator.calcInput(3);
  });
  $('#4').on('click', function() {
    calculator.calcInput(4);
  });
  $('#5').on('click', function() {
    calculator.calcInput(5);
  });
  $('#6').on('click', function() {
    calculator.calcInput(6);
  });
  $('#7').on('click', function() {
    calculator.calcInput(7);
  });
  $('#8').on('click', function() {
    calculator.calcInput(8);
  });
  $('#9').on('click', function() {
    calculator.calcInput(9);
  });
  $('#dot').on('click', function() {
    calculator.calcInput('.');
  });

  $('#add').on('click', function() {
    calculator.setOperation('add');
  });

  $('#subtract').on('click', function() {
    calculator.setOperation('subtract');
  });

  $('#multiply').on('click', function() {
    calculator.setOperation('multiply');
  });

  $('#divide').on('click', function() {
    calculator.setOperation('divide');
  });

  $('#ac').on('click', function() {
    calculator.reset();
    $('#display').text('0');
    $('#history').text('0');
  });

  $('#save').on('click', function() {
    if (calculator.getCalculationHistory() !== '') {
      $('#saved-results').append('<li>' + calculator.getCalculationHistory() + '</li>');
    }
  });

  $('#clear-history').on('click', function() {
    $('#saved-results').empty();
  });

  $('#total').on('click', function() {
    calculator.setOperation('=');
    $('#display').text(calculator.getResultForDisplay());
    $('#history').text(calculator.getCalculationHistory());
  });

});


/*****
 / Calculator class.
*****/
var Calculator = function() {
  this.reset();
};

/*****
 / Take digit input from the user and store it in objects with
 / two arrays, one for numbers and one for fractional part of the
 / number after the decimal separator (.). (num - Number or String).
*****/
Calculator.prototype.calcInput = function(num) {
  // reset the calculator if operation complete
  if (this.operationComplete) {
    this.reset();
  }

  // set the float flag to true
  if (num === '.') {
    this.float = true;
  } else {
    // if the operand was not used (first input) assign to number1 object
    if (this.operationCounter < 1) {
      // if dot was used assign to decimal array
      if (this.float) {
        this.number1.fractions.push(num);
        // else assign to numbers array
      } else {
        this.number1.numbers.push(num);
      }
      $('#display').text(this.getNumberForDisplay(this.number1));
      // operant was used, assign to number2 object
    } else {
      if (this.float) {
        this.number2.fractions.push(num);
      } else {
        this.number2.numbers.push(num);
      }
      $('#display').text(this.getNumberForDisplay(this.number2));
    }
  }
};

/*****
 / Take input from the operand buttons and set the current operation.
 / Also call the updateTotal() function (operation - String)
*****/
Calculator.prototype.setOperation = function(operation) {
  // for any chained operations
  this.updateTotal(operation);
  this.operationCounter++;
  if (operation === '=') {
    this.currentOperation = null;
  } else {
    this.currentOperation = operation;
  }
  $('#display').text(this.getResultForDisplay());
  $('#history').text(this.getCalculationHistory());
};

/*****
 / Update the results if operations are chained.
*****/
Calculator.prototype.updateTotal = function(operation) {
  // if current operation is chained
  if (this.operationCounter > 0) {
    // Number storage object copy to keep the value of input number for history and
    // fix a reverse bug in the history display
    var numberTemp = JSON.parse(JSON.stringify(this.number2));
    // update the results
    this.getTotal();
    // get the number to display in history
    this.updateCalculationHistory(this.getNumberForDisplay(numberTemp), operation, this.getResultForDisplay());
    // clear number objects for future chain operations
    this.resetNumberObjects();
  } else {
    this.updateCalculationHistory(this.getNumberForDisplay(this.number1), operation, this.getResultForDisplay());
  }
  this.float = false;
};

/*****
 / Reset the number storage object
*****/
Calculator.prototype.resetNumberObjects = function() {
  this.number1 = {
    'numbers': [],
    'fractions': []
  };
  this.number2 = {
    'numbers': [],
    'fractions': []
  };
};

/*****
 / Add two numbers (num1 - Number, num2 - Number)
*****/
Calculator.prototype.add = function(num1, num2) {
  return num1 + num2;
};

/*****
 / Subtract two numbers (num1 - Number, num2 - Number)
*****/
Calculator.prototype.subtract = function(num1, num2) {
  return num1 - num2;
};

/*****
 / Multiply two numbers (num1 - Number, num2 - Number)
*****/
Calculator.prototype.multiply = function(num1, num2) {
  return num1 * num2;
};

/*****
 / Divide two numbers (num1 - Number, num2 - Number)
*****/
Calculator.prototype.divide = function(num1, num2) {
  return num1 / num2;
};

/*****
 / Get the result of the current operation by calling totalHelper()
 / function with corresponding operation function, and number storage
 / objects as arguments.
*****/
Calculator.prototype.getTotal = function() {
  if (this.currentOperation === 'add') {
    this.result = this.totalHelper(this.add, this.number1, this.number2);
    this.resetNumberObjects();
  } else if (this.currentOperation === 'subtract') {
    this.result = this.totalHelper(this.subtract, this.number1, this.number2);
    this.resetNumberObjects();
  } else if (this.currentOperation === 'multiply') {
    this.result = this.totalHelper(this.multiply, this.number1, this.number2);
    this.resetNumberObjects();
  } else if (this.currentOperation === 'divide') {
    this.result = this.totalHelper(this.divide, this.number1, this.number2);
    this.resetNumberObjects();
  } else if (this.currentOperation === null) {
    this.result = this.getNumberForDisplay(this.number1);
    this.resetNumberObjects();
  } else {
    alert('Error, this operation is not valid.');
  }
};

/*****
 / Helper function to be called by getTotal(). If result is not null (chained
 / operation) use total as the first operand and num2 as a second operand of
 / operation, else (first operation - not chained) use num1 and num2 objects
 / as operands. (operation - function(), num1 - object, num2 - object).
*****/
Calculator.prototype.totalHelper = function(operation, num1, num2) {
  if (this.result) {
    return operation(this.result, this.getNumber(num2));
  } else {
    return operation(this.getNumber(num1), this.getNumber(num2));
  }
};

/*****
 / Set all the calculator properties to initial values.
*****/
Calculator.prototype.reset = function() {
  this.result = null; // Number
  this.number1 = {
    'numbers': [],
    'fractions': []
  }; // Object
  this.number2 = {
    'numbers': [],
    'fractions': []
  }; // Object
  this.currentOperation = null; // String
  this.operationCounter = 0; // Number
  this.float = false; // Boolean
  this.operationHistory = '';
  this.operationComplete = false; // Boolean
};

/*****
 / Convert a number storage object into a number. Iterate over the fractions
 / array and numbers array and convert the digits into correspoinding decimal
 / value. Return the result (int or float).
*****/
Calculator.prototype.getNumber = function(numObject) {
  var result = null;

  // for each decimal
  var fractions = numObject.fractions;
  fractions.forEach(function(currentValue, index, array) {
    result = result + (currentValue / Math.pow(10, index + 1));
  });

  // for each number (reversed order)
  var numbers = numObject.numbers;
  numbers.reverse();
  numbers.forEach(function(currentValue, index, array) {
    if (index === 0) {
      result = result + currentValue;
    } else {
      result = result + (currentValue * Math.pow(10, index));
    }
  });
  return result;
};

/*****
 / Return the result of last operation.
*****/
Calculator.prototype.getResultForDisplay = function() {
  return this.result;
};

/*****
 / Convert number storage object into a string.
*****/
Calculator.prototype.getNumberForDisplay = function(numObject) {
  var numberToDisplay = '';

  // for each number
  numObject.numbers.forEach(function(currentValue, index, array) {
    numberToDisplay = numberToDisplay + currentValue;
  });

  // for each fraction
  if (Number.isInteger(numObject.fractions[0])) {
    numberToDisplay = numberToDisplay + '.';
    numObject.fractions.forEach(function(currentValue, index, array) {
      numberToDisplay = numberToDisplay + currentValue;
    });
  }
  return numberToDisplay;
};

/*****
 / Update operationHistory property by appending a string representation of
 / user input. Operand names are converted to mathematical symbols.
*****/
Calculator.prototype.updateCalculationHistory = function(numberStr, operandStr, resultStr) {
  var operands = {
    "add": '+',
    "subtract": '-',
    "multiply": 'x',
    "divide": '/',
    "=": '='
  };
  if (operandStr === '=' && this.currentOperation === null) {
    this.operationHistory = this.operationHistory + ' ' + numberStr + ' = ' + numberStr + ' This is not a valid operation, please start again';
    console.log('resultStr ' + resultStr);
  } else if (operandStr === '=') {
    this.operationHistory = this.operationHistory + ' ' + numberStr + ' ' + operands[operandStr] + ' ' + resultStr;
    this.operationComplete = true;
  } else {
    this.operationHistory = this.operationHistory + ' ' + numberStr + ' ' + operands[operandStr];
  }
};

/*****
 / Return the operationHistory property (String).
*****/
Calculator.prototype.getCalculationHistory = function() {
  return this.operationHistory;
};

// Create an instance of the calculator
var calculator = new Calculator();
