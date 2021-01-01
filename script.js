
// Access to the DOM elements.
let digButtons = document.querySelectorAll(".digButtons");
let funcButtons = document.querySelectorAll(".funcButtons");
let displayTop = document.querySelector("#display-top");
let displayBot = document.querySelector("#display-bottom");


// Variables
let curr = ''; // first operand current entering
let prev = ''; // previous operand entered
let hasDot = 0; // has a decimal point or not
let op = 'na'; // records the previous operation
const maximum_bottom_display_length = 19;

function add(a, b) {
	return +a + +b;
}

function subtract(a, b) {
	return +a - +b;
}

function multiply(a, b) {
	return +a * +b;
}

function divide(a, b) {
	return +a / +b;
}

// Converts an id of an operation to a corresponding symbol
function convertToSymbol(op) {
	if (op == 'add') return '+';
	else if (op == 'subtract') return '-';
	else if (op == 'multiply') return '*';
	else return '/';
}

// Converts an id of an operation to a corresponding function
function convertToFunc(op) {
	if (op == 'add') return add;
	else if (op == 'subtract') return subtract;
	else if (op == 'multiply') return multiply;
	else return divide;
}

// Resolves a math expression
function resolveExpression(a, op, b) {
	
	let func = convertToFunc(op);
	
	let result = Math.round(func(a, b)*1000)/1000;
	if (result.toString().length >= maximum_bottom_display_length) {
		result = result.toExponential(3);
	}
	return result;
}

// When clicking on number buttons (digits)
digButtons.forEach((button) => {
	button.addEventListener('click', (e) => {
		console.log(curr);
		if (curr.length >= maximum_bottom_display_length) return;
		
		if (e.target.id != 'dot') {
			curr += e.target.id.slice(1);
		// preventing a number to have two (or more) decimal points
		} else if (!hasDot && curr.length != 0) {
			curr += '.';
			hasDot = 1;
		}
		displayBot.textContent = curr;
	});
});

// When clicking on functional buttons
funcButtons.forEach((button) => {
	button.addEventListener('click', (e) => {
		let type = e.target.id;
		
		switch (type) {
			case "AC":
				prev = '';
				curr = '';
				hasDot = 0;
				op = 'na';
				displayBot.textContent = '';
				displayTop.textContent = '';
				break;
			case "backspace":
				curr = displayBot.textContent.slice(0, displayBot.textContent.length-1);
				displayBot.textContent = curr;
				break;
			case "equals":
				if (op == 'equals') break;
				if (prev.length == 0 || curr.length == 0) break;
				// handle each possible operations
				let result = resolveExpression(prev, op, curr);
				prev = prev + ' ' + convertToSymbol(op) + ' ' + curr + ' = ';
				curr = result;
				if (result == 'Infinity') displayBot.textContent = "Divided by 0";
				else if (isNaN(result)) displayBot.textContent = "Math Error";
				else displayBot.textContent = result;
				displayTop.textContent = prev;
				op = type;
				hasDot = 0;
				break;
			default:
				// Either +, -, *, or /
				
				// If no previous operation unprocessed.
				if (op == 'na') {
					if (op == 'equals') break;
					if (curr.length == 0) break;
					op = type;
					prev = curr;
					curr = '';
					displayBot.textContent = curr;
					displayTop.textContent = prev + ' ' + convertToSymbol(op);
				} else if (op == 'equals') {
					prev = curr;
					curr = '';
					displayBot.textContent = curr;
					op = type;
					displayTop.textContent = prev + ' ' + convertToSymbol(op);
				} else {
					// there is an operation waiting to be processed
					// process that operation first and update prev to the result
					if (curr.length == 0) {
						let topContent = displayTop.textContent;
						displayTop.textContent = topContent.slice(0, topContent.length-1) + convertToSymbol(type);
						op = type;
					} else {
						prev = resolveExpression(prev, op, curr);
						curr = '';
						displayBot.textContent = curr;
						op = type;
						displayTop.textContent = prev + ' ' + convertToSymbol(op);
					}
					
					
				}
				hasDot = 0;
		}
	});
});



// max 20 digits