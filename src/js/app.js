// Import modules
import Store from './modules/Store';
import ExpenseStore from './modules/ExpenseStore';
import '../app.html';

const profileDetailSelector = document.querySelector('#profile-details');
const showBalanceSelector = document.querySelector('#show-balance');
const showBalancesSelector = document.querySelector('#show-balances');
const appGroupMembers = document.querySelector('#app-group-members');
const tableBody = document.querySelector('#table-body');

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
  static setOptionsToMemberSelect() {
    const groupMembers = document.querySelector('#app-group-members');
    const users = Store.getUsers();
    const loggedInUser = Store.getLoggedInUser();
    users.map(({ name, id }) => {
      const nameText = loggedInUser.id === id ? 'You' : name;
      const newOption = document.createElement('option');
      const optionText = document.createTextNode(nameText);
      newOption.appendChild(optionText);
      // and option value
      newOption.setAttribute('value', id);
      groupMembers && groupMembers.appendChild(newOption);
    });
  }
  static showSingleMemberBalance(user) {
    const allExpenses = ExpenseStore.getAllExpenses();
    let paidByUser = allExpenses.reduce((acc, expense) => {
      const { userId, expenseSplit, splitType, expenseAmount } = expense;
      if (userId === user) {
        expenseSplit.map(({ userId, amount }) => {
          if (userId !== user && splitType !== 'exact') {
            acc += parseFloat(amount);
          }
        });
        if (splitType === 'exact') {
          acc += parseFloat(expenseAmount);
          console.log(acc);
        }
      }
      return acc;
    }, 0);
    let expenseByUser = allExpenses.reduce((acc, expense) => {
      const { userId, expenseSplit } = expense;
      expenseSplit.map(({ userId, amount }) => {
        if (userId === user) {
          acc += parseFloat(amount);
        }
      });
      return acc;
    }, 0);
    paidByUser = Math.round(paidByUser);
    expenseByUser = Math.round(expenseByUser);
    if (paidByUser === expenseByUser) {
      return "No balance";
    }
    else if (paidByUser > expenseByUser) {
      const users = Store.getUsers();
      const [requestedUser] = users.filter((currentUser) => currentUser.id === user);
      console.log(requestedUser);
      const filteredUsers = users.filter((currentUser) => currentUser.id !== user);
      const expenses = filteredUsers.map((currentUser) => {
        const amount = allExpenses.reduce((acc, expense) => {
          const { userId, expenseSplit } = expense;
          if (userId === user) {
            expenseSplit.map(({ userId, amount }) => {
              if (userId === currentUser.id) {
                acc += parseFloat(amount);
              }
            });
          }
          return acc;
        }, 0);
        return { paidBy: requestedUser.name, oweBy: currentUser.name, amount }
      })
      return expenses;
    }
  }
  static showAllBalances() {

  }
}

// App page loads
window.addEventListener('load', () => {
  App.showLoggedInUser();
  App.setOptionsToMemberSelect();
});

showBalanceSelector && showBalanceSelector.addEventListener('click', () => {
  const selectedMember = appGroupMembers.value;
  if (selectedMember !== "") {
    const balances = App.showSingleMemberBalance(selectedMember);
    balances.map((balanceItem) => {
      const row = document.createElement("TR");
      row.innerHTML = `
      <td>${balanceItem.oweBy}</td>
      <td>owes</td>
      <td>${balanceItem.paidBy}</td>
      <td>${balanceItem.amount}</td>`
      tableBody.appendChild(row);
    });
  }
});
