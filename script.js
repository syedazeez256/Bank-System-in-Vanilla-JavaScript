'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

/////////////////////////////////////////////////
// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
  ],
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2020-07-26T17:01:17.194Z',
    '2020-07-28T23:36:17.929Z',
    '2020-08-01T10:51:36.790Z',
  ],
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
  ],
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2020-07-26T17:01:17.194Z',
    '2020-07-28T23:36:17.929Z',
    '2020-08-01T10:51:36.790Z',
  ],
};
const accounts = [account1, account2, account3, account4];

/////////////////////////////////////////////////
// Elements
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

const formatMovementDates = function (date, locale) {
  const clacDaysPassed = (date1, date2) =>
    Math.round(Math.abs(date2 - date1) / (1000 * 60 * 60 * 24));
  const daysPassed = clacDaysPassed(new Date(), date);
  if (daysPassed === 0) return 'Today';
  if (daysPassed === 1) return 'Yesterday';
  if (daysPassed <= 7) return `${daysPassed} days ago `;
  else {
    // const day = `${date.getDay()}`.padStart(2, 0);
    // const mon = `${date.getMonth() + 1}`.padStart(2, 0);
    // const year = date.getFullYear();
    // return `${day}/${mon}/${year}`;
    return Intl.DateTimeFormat(locale).format(date);
  }
};
const displayMovements = function (acc, sort = false) {
  containerMovements.innerHTML = '';
  const movs = sort
    ? acc.movements.slice().sort((a, b) => a - b)
    : acc.movements;

  movs.forEach((mov, i) => {
    const type = mov > 0 ? 'deposit' : 'withdrawal';

    const date = new Date(acc.movementsDates[i]);
    const displayDate = formatMovementDates(date, acc.locale);
    // formatMovementDates(acc);

    ///// putting form in html ///////
    const html = `
    <div class="movements__row">
          <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
    <div class="movements__date">${displayDate}</div>

          <div class="movements__value">${mov.toFixed(2)}</div>
        </div>`;
    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

// Displaying summary
const calcDisplaySummary = function (acc) {
  const incomes = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = `${incomes.toFixed(2)}`;
  const outcomes = acc.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = `${Math.abs(outcomes).toFixed(2)}`;
  const interest = acc.movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * acc.interestRate) / 100)
    .filter((int, i, arr) => {
      return int >= 1;
    })
    .reduce((acc, int) => acc + int, 0);
  labelSumInterest.textContent = `${Math.abs(interest).toFixed(2)}`;
};

// Displaying balance
const calcDisplayBalance = function (bal) {
  const balance = bal.movements.reduce((acc, val) => acc + val, 0);
  bal.balance = balance;
  labelBalance.textContent = `${bal.balance.toFixed(2)} EUR`;
};

const user = 'Syed Abdul Aziz';

const createUserName = function (accs) {
  accs.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(name => name[0])
      .join('');
  });
};

createUserName(accounts);
// console.log(accounts);

const updateUI = function (currentAccount) {
  displayMovements(currentAccount);
  calcDisplayBalance(currentAccount);
  calcDisplaySummary(currentAccount);
};

let currentAccount, logoutTimer;

// Fake Data Show
// currentAccount = account1;
// updateUI(currentAccount);
// containerApp.style.opacity = 100;

const LogoutTimer = function () {
  const tick = function () {
    const min = String(Math.trunc(timer / 60)).padStart(2, 0);
    const sec = String(timer % 60).padStart(2, 0);

    labelTimer.textContent = `${min}:${sec}`;

    if (timer === 0) {
      clearInterval(logoutTimer);
      labelWelcome.textContent = 'Login to get started';
      containerApp.style.opacity = 0;
    }
    timer--;
  };

  let timer = 180;
  tick();
  const logoutTimer = setInterval(tick, 1000);
  return logoutTimer;
};

// Login Functionality

btnLogin.addEventListener('click', function (e) {
  e.preventDefault();
  currentAccount = accounts.find(
    user => user.username === inputLoginUsername.value
  );
  if (currentAccount?.pin === +inputLoginPin.value) {
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(' ')[0]
    }`;
    containerApp.style.opacity = 100;
  }
  if (logoutTimer) clearInterval(logoutTimer);
  logoutTimer = LogoutTimer();
  // const locale = navigator.language;

  const date = new Date();
  const options = {
    hour: 'numeric',
    minute: 'numeric',
    day: 'numeric',
    month: 'numeric',
    year: 'numeric',
    // weekday: 'long',
  };

  labelDate.textContent = new Intl.DateTimeFormat(
    currentAccount.locale,
    options
  ).format(date);
  // const date = new Date();
  // const day = `${date.getDay()}`.padStart(2, 0);
  // const mon = `${date.getMonth() + 1}`.padStart(2, 0);
  // const year = date.getFullYear();
  // const min = `${date.getMinutes()}`.padStart(2, 0);
  // const hours = `${date.getHours()}`.padStart(2, 0);
  // labelDate.textContent = `${day}/${mon}/${year}, ${hours}/${min}`;

  inputLoginUsername.value = inputLoginPin.value = '';
  inputLoginPin.blur();
  updateUI(currentAccount);
});

// Transfering Amount
btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const recieverAcc = accounts.find(
    user => user.username === inputTransferTo.value
  );
  const amount = +inputTransferAmount.value;
  inputTransferAmount.value = inputTransferTo.value = '';
  if (
    amount > 0 &&
    recieverAcc &&
    amount <= currentAccount.balance &&
    recieverAcc?.username !== currentAccount.username
  ) {
    // console.log('Transfer Valid');
    currentAccount.movements.push(-amount);
    recieverAcc.movements.push(amount);

    // add date
    currentAccount.movementsDates.push(new Date().toISOString());
    recieverAcc.movementsDates.push(new Date().toISOString());
    // Update UI
    updateUI(currentAccount);

    // Resetting a timer
    clearInterval(logoutTimer);
    logoutTimer = LogoutTimer();
  }
});

btnClose.addEventListener('click', function (e) {
  e.preventDefault();

  if (
    inputCloseUsername.value === currentAccount.username &&
    +inputClosePin.value === currentAccount.pin
  ) {
    const index = accounts.findIndex(
      acc => acc.username === currentAccount.username
    );

    console.log(index);

    const c = accounts.splice(index, 1);
    console.log(c);
    containerApp.style.opacity = 0;
  }
  inputCloseUsername.value = inputClosePin.value = '';
});

btnLoan.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Math.floor(inputLoanAmount.value);
  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {
    currentAccount.movements.push(amount);
  }
  currentAccount.movementsDates.push(new Date().toISOString());
  setTimeout(() => {
    updateUI(currentAccount);
    inputLoanAmount.value = '';
  }, 2500);
  clearInterval(logoutTimer);
  logoutTimer = LogoutTimer();
});
let sorted = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  displayMovements(currentAccount.movements, !sorted);
  sorted = !sorted;
});

labelBalance.addEventListener('click', function () {
  const movementsUI = Array.from(document.querySelectorAll('.movements_value'));
  console.log(movementsUI);
});

// Extra Work
const movements = [200, 450, -400, 700, -750, 250, -500];

const bankdeposit1000 = accounts
  .flatMap(acc => acc.movements)
  // .reduce((account, acc) => (acc >= 1000 ? account + 1 : account), 0);
  .reduce((account, acc) => (acc >= 1000 ? ++account : account), 0);

console.log(bankdeposit1000);

const sum = accounts
  .flatMap(acc => acc.movements)
  .reduce(
    (sum, cur) => {
      // cur > 0 ? (sum.deposit += cur) : (sum.withdraw += cur);
      sum[cur > 0 ? 'deposit' : 'withdraw'] += cur;
      return sum;
    },
    { deposit: 0, withdraw: 0 }
  );
console.log(sum);

const converTitleCase = function (title) {
  const captalize = str => str[0].toUpperCase() + str.slice(1);
  const exception = ['a', 'and', 'is', 'in'];
  const converted = title
    .toLowerCase()
    .split(' ')
    .map(el => (exception.includes(el) ? el : captalize(el)))
    .join(' ');
  return converted;
};

console.log(converTitleCase('this is a title case And here is ME'));
console.log(converTitleCase('this is another TITLE Case and I liKE applE'));
console.log(converTitleCase('ANOTher title Case IN THis SCetioN'));
// const eurtousd = 1.1;
// const totalDepositUSD = movements
//   .filter(mov => mov > 0)
//   .map(mov => mov * eurtousd)
//   .reduce((acc, val) => acc + val);
// console.log(totalDepositUSD);
// const ar = [1, 2, 3, 4, 5];
// ar.splice(2, 1);
// console.log(ar);

// Some Every and includes method
// console.log(movements);

// console.log(movements.includes(-400));
// console.log(movements.some(acc => acc === -400));
// console.log(movements.every(acc => acc === -400));

// const arr = [1, 2, [3, [4]], 5, [6, 7], 8];
// console.log(arr.flat());

// console.log(arr.flat(3));

// const overAllBal = accounts
//   .map(mov => mov.movements)
//   .flat()
//   .reduce((acc, mov) => acc + mov);
// console.log(overAllBal);
// const overAllBal2 = accounts
//   .flatMap(mov => mov.movements)
//   .reduce((acc, mov) => acc + mov);
// console.log(overAllBal2);

const ingredients = ['olives', 'spanich'];
const timer = setTimeout(
  (ing1, ing2) => console.log(`Order Pizza with ${ing1} and ${ing2}`),
  4000,
  // 'spanich',
  // 'olives'
  ...ingredients
);
console.log('Waiting');
if (ingredients.includes('olives')) clearTimeout(timer);

setInterval(() => {
  const now = new Date();
  // console.log(now);
}, 1000);
