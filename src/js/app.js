// Import modules
import Store from './modules/Store';
import '../app.html';

const profileDetailSelector = document.querySelector('#profile-details');
class App {
  static showLoggedInUser() {
    const loggedInUser = Store.getLoggedInUser();
    // No logged in user found then redirect to login page
    if (!loggedInUser) {
      window.location.assign('/index.html');
    }
    this.displayLoggedUser(loggedInUser);
  }

  static displayLoggedUser(loggedInUser) {
    if (profileDetailSelector) {
      profileDetailSelector.innerHTML = `<div>
        <h2>${loggedInUser.name}</h2>
        <h5>${loggedInUser.emailId}</h5>
      </div>`;
    }
  }
}

// App page loads
window.addEventListener('load', () => {
  App.showLoggedInUser();
});
