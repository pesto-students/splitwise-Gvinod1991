// Import modules
import Store from './modules/Store';
import User from './modules/User';
import UI from './modules/Ui';

// Import html files
import '../signup.html';

// Utilities imports
import { isEmailValid, isPhoneNumberValid } from './utils/validations';

// Import js files for each page
import './app';
import './addExpenses';

/* Events */
// Event:create new User
const signupFormSelector = document.querySelector('#signup-form');
const loginFormSelector = document.querySelector('#login-form');

signupFormSelector && signupFormSelector.addEventListener('submit', (e) => {
  // prevent the default behaviour of the submit btn
  e.preventDefault();

  let name = document.querySelector('#name').value;
  let emailId = document.querySelector('#emailId').value;
  let phoneNumber = document.querySelector('#phoneNumber').value;
  let password = document.querySelector('#password').value;
  // Add validation here
  name = name !== '' ? name : false;
  emailId = emailId !== '' && isEmailValid(emailId) ? emailId : false;
  phoneNumber = phoneNumber !== '' && isPhoneNumberValid(phoneNumber) ? phoneNumber : false;
  password = password !== '' ? password : false;
  if (!name) {
    UI.showAlert('name-error', 'Name id required!',5000);
  }
  if (!emailId) {
    UI.showAlert('email-error', 'Valid email id required!',5000);
  }
  if (!phoneNumber) {
    UI.showAlert('phoneNumber-error', 'Valid phone number id required!',5000);
  }
  if (!password) {
    UI.showAlert('password-error', 'Password is required!',5000);
  }
  if (name && emailId && phoneNumber && password) {
    const user = new User(name, emailId, phoneNumber, password);
    if (Store.saveUser(user)) {
      UI.showAlert('success-message', 'Signup successful!');
      document.querySelector('#signup-form').reset();
      window.location.assign('./index.html');
    } else {
      UI.showAlert('error-message', 'Email already exist,Try to login with your credentials');
    }
  }
});

// Login event
loginFormSelector && loginFormSelector.addEventListener('submit', (e) => {
  // prevent the default behaviour of the submit btn
  e.preventDefault();
  let emailId = document.querySelector('#emailId').value;
  let password = document.querySelector('#password').value;
  // Add validation here
  emailId = emailId !== '' && isEmailValid(emailId) ? emailId : false;
  password = password !== '' ? password : false;
  if (!emailId) {
    UI.showAlert('email-error', 'Valid email id required!');
  }
  if (!password) {
    UI.showAlert('password-error', 'Password is required!');
  }
  if (emailId && password) {
    if (Store.authenticateUser(emailId, password)) {
      UI.showAlert('success-message', 'Login successful!');
      document.querySelector('#login-form').reset();
      window.location.assign('./app.html');
    } else {
      UI.showAlert('error-message', 'Incorrect credentials!,Try again');
    }
  }
});
