// DOM Variables
const form = document.querySelector('#euribor-calculator');
const calculateBtn = form.querySelector('button');
const paymentDifferenceInput = form.querySelector('#current-payment');

function addValidationClass(event) {
	// Get either target event or element from argument
	const input = event.target || event;
	if (!checkValidationClass(input)) {
		input.classList.add('validate');
	}
}

function addAllValidationClasses() {
	const formInputs = form.querySelectorAll('.form-input input');
	formInputs.forEach((input) => {
		addValidationClass(input);
	});
}

// Check if input already has validation class applied
function checkValidationClass(element) {
	if (!element.classList.contains('validate')) {
		return false;
	} else {
		return true;
	}
}

// Get all input field values
function gatherFormData() {
	const formData = {};
	const formInputs = form.querySelectorAll('.form-input input');
	formInputs.forEach((input) => {
		formData[input['name']] = validateInput(input);
	});
	return formData;
}

// Validate inputs
function validateInput(input) {
	// In case of empty field return 0 so calculation would return 0
	if (input.value === '') return 0;
	// In case of number parse as float allowing decimal places
	if (input['type'] === 'number') {
		return Number(input.value);
	} else {
		// In case of date return a formatted date
		return formatDate(new Date(input.value));
	}
}

// Format date
function formatDate(date) {
	return {
		day: date.getDate(),
		month: date.getMonth(),
		year: date.getFullYear(),
	};
}

// Calculate month difference between today and repayment date
function calcMonthDifference(date) {
	const today = new Date();
	const monthlyDifference =
		date.month - today.getMonth() + 12 * (date.year - today.getFullYear());
	/*
		If repayment day is earlier than todays date
		subtract 1 since we payed for current month
	*/
	if (date.day <= today.getDate()) {
		return monthlyDifference - 1;
	} else {
		return monthlyDifference;
	}
}

// Calculate monthly payments
function calcMonthlyPayment() {
	const data = gatherFormData();
	const remainingMonths = calcMonthDifference(data.date);
	const totalInterest = data.interest + data.euribor;
	// Convert the annual total interest rate to a monthly nominal interest rate (decimal form)
	const nominalInterest = totalInterest / 12 / 100;
	// Calculate the monthly payment using the EMI formula:
	const monthlyPayment =
		(data.loan * nominalInterest * (1 + nominalInterest) ** remainingMonths) /
		((1 + nominalInterest) ** remainingMonths - 1);
	return parseFloat(monthlyPayment.toFixed(2));
}

// Update output
function updateMonthlyOutput() {
	const monthlyPayment = calcMonthlyPayment();
	const displayContainer = form.querySelector('.output');
	displayContainer.classList.remove('hidden');
	const monthlyDisplay = displayContainer.querySelector('.result output');
	monthlyDisplay.textContent = monthlyPayment;
	// If user has filled current payment input, recalculate the new payment
	if (paymentDifferenceInput.value !== '') {
		updateNewMonthlyOutput(paymentDifferenceInput);
	}
}

// Update differences between monthly payments in output
function calcPaymentDifference(event) {
	const currentPayment = event.target || event;
	const currentPaymentNumber = Number(currentPayment.value);
	const newPayment = form.querySelector('.result output').textContent;
	if (currentPaymentNumber > 0) {
		return parseFloat(currentPaymentNumber - newPayment).toFixed(2);
	} else {
		return;
	}
}

// Update new monthly payment display
function updateNewMonthlyOutput(event) {
	const newMonthlyPayment = calcPaymentDifference(event);
	const newMonthlyDisplay = form.querySelector('#new-payment');
	newMonthlyDisplay.textContent = newMonthlyPayment;
}

// Form blur event delegation via capture
form.addEventListener(
	'blur',
	(event) => {
		if (event.target.matches('.form-input input')) {
			addValidationClass(event);
		}
	},
	{ capture: true },
);

// Form submit event
form.addEventListener('submit', (e) => {
	e.preventDefault();
	updateMonthlyOutput();
});

// Calculate button event
calculateBtn.addEventListener('click', () => {
	addAllValidationClasses();
});

// Payment difference event
paymentDifferenceInput.addEventListener('input', updateNewMonthlyOutput);
