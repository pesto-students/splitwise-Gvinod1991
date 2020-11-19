// Import modules
import Store from './modules/Store';
import ExpenseStore from './modules/ExpenseStore';
import '../app.html';

const profileDetailSelector = document.querySelector('#profile-details');
const showBalanceSelector = document.querySelector('#show-balance');
const showBalancesSelector = document.querySelector('#show-balances');
const appGroupMembers = document.querySelector('#app-group-members');
const tableBody = document.querySelector('#table-body');
const logoutSelector= document.querySelector('#logout');
class App {
  static showLoggedInUser() {
    const loggedInUser = Store.getLoggedInUser();
    if(loggedInUser){
      this.displayLoggedUser(loggedInUser);
    }
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
      const optionText = document.createTextNode(`${nameText}(${id})`);
      newOption.appendChild(optionText);
      // and option value
      newOption.setAttribute('value', id);
      groupMembers && groupMembers.appendChild(newOption);
    });
  }
  static showSingleMemberBalance(user) {
    const allBalances=this.showAllBalances();
    if(allBalances){
      return allBalances.filter((balanceItem)=>balanceItem.oweById===user || balanceItem.paidByUserId === user);
    }
    return false;
  }

  static showAllBalances() {
    const users = Store.getUsers();
    const allExpenses = ExpenseStore.getAllExpenses();
    const expenses = users.map((currentUser) => {
      const requestedUser = currentUser;
      let requestedUserExpenses=[];
      allExpenses.map((expense) => {
        const { userId, expenseSplit } = expense;
        const [userWhoPaid] = users.filter((currentUser) => currentUser.id === userId);
        const [requestedUserExpense]=expenseSplit.filter(({ userId }) => userId === requestedUser.id && userId !== userWhoPaid.id);
        const [userWhoPaidExists] = requestedUserExpenses.filter((expense)=> expense.paidByUserId===userWhoPaid.id);
        const expenseAmount=requestedUserExpense ? parseFloat(requestedUserExpense.amount) : 0;
        if(userWhoPaidExists){
          requestedUserExpenses=requestedUserExpenses.map((expense) => {
            expense.amount+=expenseAmount;
            return expense;
          });
        }else{
          if(expenseAmount > 0){
            requestedUserExpenses.push({paidByUserId:userWhoPaid.id,paidBy: userWhoPaid.name,oweBy: requestedUser.name,oweById:requestedUser.id,amount:expenseAmount});
          }
        }
      });
      return requestedUserExpenses;
    });
    const flattenExpenses=expenses.flat();
    const paidByUsers=flattenExpenses.reduce((acc,expense)=> {
      if(!acc.includes(expense.paidByUserId)){acc.push(expense.paidByUserId)}
      return acc;
    },[]);
    const cycleOweData = paidByUsers.map((user)=>{
      return flattenExpenses.filter((expense)=>expense.oweById===user);
    });
    const cycleOweDataFlatten=cycleOweData.flat();
    cycleOweDataFlatten.map((filterRecord)=>{
      flattenExpenses.splice(flattenExpenses.findIndex((item)=>
      filterRecord.paidByUserId===item.paidByUserId && 
      filterRecord.paidBy===item.paidBy && 
      filterRecord.oweById===item.oweById && 
      filterRecord.oweBy===item.oweBy && 
      filterRecord.amount===item.amount),1);
    });
    const cycleOweMergedList=[];
    cycleOweDataFlatten.map((data)=>{
      const [cycleOweMergedData]=cycleOweMergedList.filter((item)=>item.paidByUserId===data.paidByUserId && item.oweById===data.oweById);
      if(!cycleOweMergedData){
        const [filteredCycleOweDataFlatten]=cycleOweDataFlatten.filter((item)=>item.paidByUserId===data.oweById && item.oweById===data.paidByUserId);
        filteredCycleOweDataFlatten.amount -= data.amount;
        cycleOweMergedList.push(filteredCycleOweDataFlatten);
      };
    });
    cycleOweMergedList.map((cycleMergedData)=> {
        const {oweById,paidBy,oweBy,paidByUserId,amount}=cycleMergedData;
        if( amount < 0){
          return {paidByUserId:oweById,paidBy:oweBy,oweById:paidByUserId,oweBy:paidBy,amount:Math.abs(amount)}
        }
        return cycleMergedData;
    });
    const finalExpensesBalances=[...flattenExpenses,...cycleOweMergedList];
    const [checkAllFlattenExpenses]= finalExpensesBalances.filter((expenseItem)=>Object.keys(expenseItem).length !== 0);
    if(checkAllFlattenExpenses){
      return finalExpensesBalances
    }
    return false;
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
    tableBody.innerHTML="";
    if(balances){
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
    else{
      const row = document.createElement("TR");
      row.innerHTML = `
      <td>No Balance</td>`;
      tableBody.appendChild(row);
    }
  }
});

showBalancesSelector && showBalancesSelector.addEventListener('click', () => {
    const balances = App.showAllBalances();
    tableBody.innerHTML="";
    if(balances){
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
    else{
      const row = document.createElement("TR");
      row.innerHTML = `
      <td>No Balances</td>`;
      tableBody.appendChild(row);
    }
});
logoutSelector && logoutSelector.addEventListener('click',()=>{
  if(Store.logout()){
    window.location.assign('/index.html');
  }
})