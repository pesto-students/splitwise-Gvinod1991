import '../signup.html';
import '../app.html';

import { isEmailValid, isPhoneNumberValid } from './utils/validations';

//User class :Represent the User
class User {
  constructor(name, emailId, phoneNumber, password) {
    this.name = name;
    this.emailId = emailId;
    this.phoneNumber = phoneNumber;
    this.password = password;
  }
}

// Store class :Handle the storage
class Store {
  static getUsers() {
    let users = window.localStorage.getItem('users');
    if (users !== null) {
      users = JSON.parse(users);
    } else {
      users = [];
    }
    return users;
  }
  static saveUser(newUser) {
    let users = this.getUsers();
    //Check if user already exists
    const [userExists] = users.filter(user => user.emailId === newUser.emailId);
    if (!userExists) {
      newUser['id'] = `u${users.length + 1}`;
      users.push(newUser);
      window.localStorage.setItem("users", JSON.stringify(users));
      return true;
    }
    return false;
  }
  static authenticateUser(emailId, password) {
    let users = this.getUsers();
    //Check if user already exists
    const [userExists] = users.filter(user => user.emailId === emailId && user.password === password);
    if (userExists) {
      return true;
    }
    return false;
  }
}

// UI class : Handle UI tasks
class UI {

  static showAlert(selector, message) {
    document.querySelector(`#${selector}`).style.display = 'block';
    document.querySelector(`#${selector}`).innerText = message;
    setTimeout(() => {
      document.querySelector(`#${selector}`).style.display = 'none';
      document.querySelector(`#${selector}`).innerText = "";
    }, 3000);
  }
}

/* Events */
//Event:create new User  
document.querySelector("#signup-form") && document.querySelector("#signup-form").addEventListener('submit', (e) => {
  //prevent the default behaviour of the submit btn
  e.preventDefault();

  let name = document.querySelector('#name').value;
  let emailId = document.querySelector('#emailId').value;
  let phoneNumber = document.querySelector('#phoneNumber').value;
  let password = document.querySelector('#password').value;
  //Add validation here 
  name = name !== "" ? name : false;
  emailId = emailId !== '' ? emailId : false;
  phoneNumber = phoneNumber !== '' ? phoneNumber : false;
  password = password !== '' ? password : false;

  if (!name && !emailId && !phoneNumber && !password) {
    UI.showAlert('error-message', 'Please fill in all fields!');
  } else {
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

//Login event
document.querySelector("#login-form") && document.querySelector("#login-form").addEventListener('submit', (e) => {
  //prevent the default behaviour of the submit btn
  e.preventDefault();
  let emailId = document.querySelector('#emailId').value;
  let password = document.querySelector('#password').value;
  //Add validation here 
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
