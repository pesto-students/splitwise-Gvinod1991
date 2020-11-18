// Store class :Handle the user storage
class Store {
  static getUsers() {
    let users = window.localStorage.getItem('users');
    if (users !== null) {
      users = JSON.parse(users);
    } else {
      users = [{ name: "Test user", emailId: "test@test.com", phoneNumber: "1234567890", password: "test123", id: "u1" }];
    }
    return users;
  }
  static saveUser(newUser) {
    const users = this.getUsers();
    const newUserToBeSaved = newUser;
    // Check if user already exists
    const [userExists] = users.filter((user) => user.emailId === newUser.emailId);
    if (!userExists) {
      newUserToBeSaved['id'] = `u${users.length + 1}`;
      users.push(newUserToBeSaved);
      window.localStorage.setItem('users', JSON.stringify(users));
      return true;
    }
    return false;
  }

  static authenticateUser(emailId, password) {
    const users = this.getUsers();
    // Check if user already exists
    const [userExists] = users.filter((user) => user.emailId === emailId
      && user.password === password);
    if (userExists) {
      // Save loggedin user into localstorage
      window.localStorage.setItem('loggedInUser', JSON.stringify(userExists));
      return true;
    }
    return false;
  }

  static getLoggedInUser() {
    const loggedInUser = window.localStorage.getItem('loggedInUser')
      ? JSON.parse(window.localStorage.getItem('loggedInUser')) : false;
    if (loggedInUser) {
      return loggedInUser;
    }
    return false;
  }

  static logout() {
    try {
      window.localStorage.removeItem('loggedInUser');
    } catch (err) {
      return false;
    }
    return true;
  }
}

export default Store;
