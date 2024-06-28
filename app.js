// DOM Variables
const form = document.querySelector('#euribor-calculator');
const calculateBtn = form.querySelector('button');
const paymentDifferenceInput = form.querySelector('#current-payment');
// Date picker input
const datePicker = new Pikaday({
	field: form.querySelector('#date'),
	toString: formatDisplayDate,
	parse: parseDate,
	minDate: setMinMaxDate()[0],
	maxDate: setMinMaxDate[1],
	yearRange: [
		setMinMaxDate()[0].getFullYear(),
		setMinMaxDate()[1].getFullYear(),
	],
	defaultDate: setMinMaxDate()[0],
});

// Set minimum date for the datepicker
function setMinMaxDate() {
	const today = new Date();
	const minimumDate = new Date();
	minimumDate.setMonth(today.getMonth() + 6);
	const maximumDate = new Date();
	maximumDate.setFullYear(today.getFullYear() + 60);
	return [minimumDate, maximumDate];
}

// Function to format a display date as DD-MM-YYYY
function formatDisplayDate(date) {
	const day = String(date.getDate()).padStart(2, '0');
	const month = String(date.getMonth() + 1).padStart(2, '0');
	const year = date.getFullYear();
	return `${day}-${month}-${year}`;
}

// Function to parse a date string in DD-MM-YYYY format
function parseDate(dateString) {
	const parts = dateString.split('-');
	if (parts.length !== 3) return null; // Invalid date format
	const day = parseInt(parts[0], 10);
	const month = parseInt(parts[1], 10) - 1;
	const year = parseInt(parts[2], 10);
	if (isNaN(day) || isNaN(month) || isNaN(year)) return null; // Invalid date parts
	return new Date(year, month, day);
}

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
		formData[input['name']] = input.value;
	});
	return formData;
}

// Validate inputs
function validateInput(formData) {
	// Destructure object
	const { loan, interest, euribor, date } = formData;
	if (loan <= 0 || isNaN(loan) || !loan) {
		return false;
	}
	if (interest < 0 || isNaN(interest) || !interest) {
		return false;
	}
	if (euribor < 0 || isNaN(euribor) || !euribor) {
		return false;
	}
	if (!parseDate(date) || !date) {
		return false;
	}
	return true;
}

// Calculate month difference between today and repayment date
function calcMonthDifference(date) {
	const today = new Date();
	date = new Date(date);
	return (
		date.getMonth() -
		today.getMonth() +
		12 * (date.getFullYear() - today.getFullYear())
	);
}

// Calculate monthly payments
function calcMonthlyPayment(formData) {
	// Destructure object
	const { loan, interest, euribor, date } = formData;
	const remainingMonths = calcMonthDifference(parseDate(date));
	const totalInterest = Number(interest) + Number(euribor);
	// Convert the annual total interest rate to a monthly nominal interest rate (decimal form)
	const nominalInterest = totalInterest / 12 / 100;
	// Calculate the monthly payment using the EMI formula:
	const monthlyPayment =
		(loan * nominalInterest * (1 + nominalInterest) ** remainingMonths) /
		((1 + nominalInterest) ** remainingMonths - 1);
	return parseFloat(monthlyPayment.toFixed(2));
}

// Update output
function updateMonthlyOutput() {
	const formData = gatherFormData();
	if (!validateInput(formData)) return;
	const monthlyPayment = calcMonthlyPayment(formData);
	const displayContainer = form.querySelector('.output');
	const monthlyDisplay = displayContainer.querySelector('.result output');
	monthlyDisplay.textContent = monthlyPayment;
	paymentDifferenceInput.removeAttribute('disabled');
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
