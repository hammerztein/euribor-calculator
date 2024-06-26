// DOM Variables
const form = document.querySelector('#euribor-calculator');
const calculateBtn = form.querySelector('button');

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
		return parseFloat(input.value);
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

calculateBtn.addEventListener('click', () => {
	addAllValidationClasses();
});
