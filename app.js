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
