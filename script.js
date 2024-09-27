'use strict';

//----------------Data----------------//
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

const currencies = new Map([
	['USD', 'United States dollar'],
	['EUR', 'Euro'],
	['GBP', 'Pound sterling'],
]);

//----------------HTML Elements----------------//
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

//----------------Functions----------------//
containerApp.style.opacity = 0;
const displayMovements = function(movements, sort = false) {
	containerMovements.innerHTML = '';
	const movs = sort ? movements.slice().sort((a, b) => a - b) : movements;
	movs.forEach(function(mov, i) {
		const type = mov < 0 ? 'withdrawal' : 'deposit';
		const html = `
		<div class="movements__row">
          <div class="movements__type movements__type--${type}">${i + 1}. ${type}</div>
          <div class="movements__value">${mov}€</div>
        </div>
		`;
		containerMovements.insertAdjacentHTML('afterbegin', html);
	});
};

const euroToUsd = 1.1;
const movementsUsd = movements.map(mov => mov * euroToUsd);
const movementsDescription = movements.map((mov, i) =>
	`Movement ${i + 1}: You ${mov > 0 ? 'deposited' : 'withdrew'} ${Math.abs(mov)}`
);

const createUsernames = function(accounts)
{
	accounts.forEach(account => {
	account.username = account.owner
		.toLowerCase()
		.split(' ')
		.map(name => name[0])
		.join('')});
};

createUsernames(accounts);

const withdrawals = movements.filter(function(mov) {
	return (mov < 0);
});

const balance = movements.reduce((acc, curr) => acc + curr, 0);

// --Display balance on website-- //
const calcAndDisplayBalance = function (movements) {
	const balance = movements.reduce((acc, curr) => acc + curr, 0);
	labelBalance.textContent = `${balance}€`;
}

const maxValue = movements.reduce((acc, mov) => acc > mov ? acc : mov, movements[0]);

const calcDisplaySummary = function (account)
{
	const income = account.movements
		.filter(mov => mov > 0)
		.reduce((acc, mov) => acc + mov, 0);
	labelSumIn.textContent = `${income}€`;

	const out = account.movements
		.filter(mov => mov < 0)
		.reduce((acc, mov) => acc + mov, 0);
	labelSumOut.textContent = `${Math.abs(out)}€`;
	
	const interest = account.movements
		.filter(mov => mov > 0)
		.map(mov => (mov * account.interestRate) / 100)
		.filter((int, i, arr) => {
			return int >= 1;
		})
		.reduce((acc, mov) => acc + mov, 0);
	labelSumInterest.textContent = `${interest}€`;
};

//----------------Event Listeners----------------//
let currentAccount;
btnLogin.addEventListener('click', function(e) {
	e.preventDefault(); 
	console.log('LOGIN');
	const username = inputLoginUsername.value;
	const pin = inputLoginPin.value;
	currentAccount = accounts.find(acc => acc.username === username)
	if (currentAccount?.pin === Number(pin))
	{
		containerApp.style.opacity = 100;
		displayMovements(currentAccount.movements);
		calcAndDisplayBalance(currentAccount.movements);
		calcDisplaySummary(currentAccount);
	}
	inputLoginUsername.value = '';
	inputLoginPin.value = '';
	inputLoginPin.blur();
	
});

btnTransfer.addEventListener('click', function(e) {
	e.preventDefault();
	const amount = Number(inputTransferAmount.value);
	const transferTo = accounts.find(acc => acc.username === inputTransferTo.value);
	if (amount > 0
		&& amount <= Number(labelBalance.textContent.slice(0, -1))
		&& transferTo != undefined
		&& transferTo.username != currentAccount.username)
	{
		currentAccount.movements.push(-amount);
		transferTo.movements.push(amount);
		displayMovements(currentAccount.movements);
		calcAndDisplayBalance(currentAccount.movements);
		calcDisplaySummary(currentAccount);
		inputTransferTo.value = inputTransferAmount.value = '';
	}
	else {
		inputTransferTo.value = inputTransferAmount.value = '';
		alert('Incorrect account or amount!');
	}
});

btnClose.addEventListener('click', function(e) {
	e.preventDefault();
	if (inputCloseUsername.value === currentAccount.username
		&& Number(inputClosePin.value) === currentAccount.pin)
		{
		const index = accounts.findIndex(acc => acc.username === currentAccount.username);
		accounts.splice(index, 1);
		containerApp.style.opacity = 0;
	}
});

btnLoan.addEventListener('click', function(e) {
	e.preventDefault();
	const amount = Number(inputLoanAmount.value);
	if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {
		currentAccount.movements.push(amount);
		displayMovements(currentAccount.movements);
		calcAndDisplayBalance(currentAccount.movements);
		calcDisplaySummary(currentAccount);
	}
	inputLoanAmount.value = '';
})

// const compareNr = (a, b) => a - b;
// const compareNr = (a, b) => {
// 	if (a > b) return 1;
// 	if (a < b) return -1;	
// };

let sorted = false;

btnSort.addEventListener('click', function(e) {
	e.preventDefault();
	displayMovements(currentAccount.movements, !sorted);
	sorted = !sorted;
});

labelBalance.addEventListener('click', function () {
	const movementsUi = Array.from(document.querySelectorAll('.movements__value'), el => Number(el.textContent.replace('€', '')));
	console.log(movementsUi);
});

// const bankDeposits = accounts
// 	.flatMap(acc => acc.movements)
// 	.filter(mov => mov > 0)
// 	.reduce((acc, curr) => acc + curr, 0);
	
// const sums = accounts
// 	.flatMap(acc => acc.movements)
// 	.reduce(
// 		(sums, curr) => {
// 		// curr > 0 ? sums.deposits += curr : sums.withdrawals += curr;
// 		sums[curr > 0 ? 'deposits' : 'withdrawals'] += curr;
// 		return (sums);
// 	},
// 	{deposits: 0, withdrawals: 0}
// );
