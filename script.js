document.body.classList.toggle('light-mode');  
let operandA = '';
let operandB = '';
let operator = '';
let operatorBtn = null;
let startNewNumber = false;

const screen = document.querySelector('#screen');
const clearBtn = document.querySelector('#clear');
const backspaceBtn = document.querySelector('#backspace');
const numberBtns = document.querySelectorAll(".number");
const operatorBtns = document.querySelectorAll(".operator");
const equalsBtn = document.querySelector('#equals');
const signBtn = document.querySelector('#sign');
const decimalBtn = document.querySelector('#decimal');
const toggleModeBtn = document.querySelector('#modeToggle');

clearBtn.addEventListener('click', clear);
backspaceBtn.addEventListener('click', backspace);
signBtn.addEventListener('click', changeSign);
equalsBtn.addEventListener('click', evaluate);
decimalBtn.addEventListener('click', appendDecimal);
toggleModeBtn.addEventListener('change', toggleMode);
document.addEventListener('keydown', convertKey);
numberBtns.forEach((btn) =>
    btn.addEventListener('click', () => updateScreen(btn.textContent))
);
operatorBtns.forEach((btn) => 
    btn.addEventListener('click', function() {
        setOperator(btn.textContent, this);
    })
);


function add(a, b) {
    return a + b;
}
function subtract(a, b) {
    return a - b;
}
function multiply(a, b) {
    return a*b;
}
function divide(a, b) {
    return a/b;
}

// Calls math operation functions
function operate(operator, x, y) {
    switch(operator) {
        case '+':
            result = add(x, y);
            break;
        case '-':
            result = subtract(x, y);
            break;
        case 'x':
        case '*':
            result = multiply(x, y);
            break;
        case '÷':
        case '/':
            result = divide(x, y);
            break;
    }
    return result;
}

// Sets operator & updates operands. If there is already an operator and two operands 
// previously set, calculate the result before setting new operator and operand.
function setOperator(newOperator, button) {
    updateOperands();
    if (operatorBtn) {
        operatorBtn.classList.remove('active');
    }
    operatorBtn = button;
    operatorBtn.classList.add('active');
    startNewNumber = true;
    if (operandA && operandB && operator) {
        operandB = operate(operator, operandA, operandB);
        updateScreen(operandB);
        operator = newOperator;
    }
    else if (operandA && operandB && !operator) {
        operandAP = '';
        operator = newOperator;
    }
    else if (!operandA && operandB) {
        operator = newOperator;
    }
}

// Updates screen
function updateScreen(x) {
    if (operatorBtn) {
            operatorBtn.classList.remove('active');
    }
    if (screen.textContent === "0" || screen.textContent === "-0" || startNewNumber === true) {
        if (screen.textContent === "-0") {
            screen.textContent = -x;
        }
        else {
            screen.textContent = x;
        }
        clearBtn.textContent = 'C';
        startNewNumber = false;
    }
    else if (screen.textContent.length < 13) {
        screen.textContent += x;
    }
}

// Updates the two operand variables
function updateOperands() {
    if (!operandB) {
        operandB = parseFloat(screen.textContent);
    }
    else {
        operandA = operandB;
        operandB = parseFloat(screen.textContent);
    }
}

// Clears the screen and sets it to 0. If the screen number is already 0,
// clears all data, including operand and operator variables. 
function clear() {
    if (operatorBtn) {
        operatorBtn.classList.remove('active');
    }
    if (screen.textContent === '0') {
        operandA = '';
        operandB = '';
        operator = '';
        operatorBtn = null;
    }
    else {
        screen.textContent = '0';
    }
    clearBtn.textContent = 'AC'
    
}

// Add or remove negative sign from the screen number.
function changeSign() {
    if (startNewNumber) {
        screen.textContent = '0';
    }
    if (screen.textContent[0] === '-') {
            screen.textContent = screen.textContent.substring(1);
        }
    else {
        screen.textContent = '-' + screen.textContent;
    }

}

// Removes the last number from the display number.
function backspace() {
    if (startNewNumber) {
        screen.textContent = '0';
    }
    else if (screen.textContent) {
        if (screen.textContent.length === 1) {
            screen.textContent = '0';
        }
        else {
            screen.textContent = screen.textContent.slice(0, -1);
        }
        
    }
}

// Rounds numbers to fit the screen.
function roundToFit(x) {
    if (x.toString.length < 13) {
        return x;
    }
    else {
        decimalLength = 12 - Math.round(x);
        return x.toFixed(decimalLength);
    }
}

// Trigged when equals button is clicked, evaluates the 
// current expression based on current operator and operands.
function evaluate() {
    if (operatorBtn) {
            operatorBtn.classList.remove('active');
    }
    updateOperands();
    if (operator && operandA && operandB) {
        result = operate(operator, operandA, operandB);
        operandA = '';
        operandB = result;
        operator = '';
        screen.textContent = result;
        startNewNumber = true;
    }
}

// Toggles between light and dark mode.
function toggleMode() {
    document.body.classList.toggle('light-mode');  
}

// Appends decimal to screen, first checking if there's already a decimal.
function appendDecimal() {
    if (!screen.textContent.includes('.')) {
        updateScreen('.');
    }
}

// Converts keyboard inputs into calculator actions
function convertKey(event) {
    if ((event.key >= 0 && event.key <= 9)) {
        updateScreen(event.key);
    }
    else if (event.key === '.') {
        appendDecimal();
    }
    else if (event.key === '-' && screen.textContent === '0') {
        changeSign();
    }
    else if (event.key === 'x' || event.key === '*') {
        setOperator(event.key, document.querySelector('#multiply'));
    }
    else if (event.key === '/') {
        setOperator(event.key, document.querySelector('#divide'));
    }
    else if (event.key === '+') {
        setOperator(event.key, document.querySelector('#add'));
    }
    else if (event.key === '-') {
        setOperator(event.key, document.querySelector('#subtract'));
    }
    else if (event.key === '=' || event.key === "Enter") {
        evaluate();
    }
    else if (event.key === "Backspace" || event.key === "Delete") {
        if (screen.textContent.length === 1) {
            clear();
        }
        else {
            backspace();
        }
    }
}