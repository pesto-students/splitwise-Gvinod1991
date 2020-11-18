import Store from './modules/Store';
import ExpenseStore from './modules/ExpenseStore';
import UI from './modules/Ui';
import '../addExpenses.html';

const expenseFormSelector = document.querySelector('#expense-form');
const splitTypeSelector = document.querySelector('#split-type');
const showSplitResultSelector = document.querySelector('#split-result');
const showSplitResultLabelSelector = document.querySelector('#split-result-label');
const groupMembersSelector = document.querySelector('#group-members');
const expenseAmountSelector = document.querySelector('#expense-amount');
class AddExpense {
  static saveExpense({ description, expenseAmount, splitType, expenseSplit }) {
    const { id } = Store.getLoggedInUser();
    const expenseData = {
      description,
      expenseAmount,
      splitType,
      userId: id,
      expenseSplit,
    };
    return ExpenseStore.saveExpense(expenseData);
  }

  static prepareExpenseDataToSave({ expenseAmount, groupMembers, splitType, splitAmountOrPercentOfMembers }) {
    const loggedInUser = Store.getLoggedInUser();
    let memberWiseExpense = [];
    if (splitType === 'equally') {
      const updatedGroupMembers = [...groupMembers, loggedInUser.id];
      memberWiseExpense = this.getSplitEqualAmountOfMembers(updatedGroupMembers, expenseAmount);
    }
    if (splitType === 'exact') {
      memberWiseExpense = this.getSplitExactAmountOfMembers(splitAmountOrPercentOfMembers, expenseAmount);
    }
    if (splitType === 'percent') {
      memberWiseExpense = this.getSplitPercentAmountOfMembers(splitAmountOrPercentOfMembers, expenseAmount);
    }
    return memberWiseExpense;
  }

  static getSplitEqualAmountOfMembers(groupMembers, expenseAmount) {
    const numberOfMembers = groupMembers.length;
    const expenseAmountForMember = parseFloat(Number(parseFloat(expenseAmount / numberOfMembers)).toFixed(2));
    let adjustedMemberAmount;
    /** Checking whether split amount sum is equals to expense amount
      or not ,If not adjusted amount added to first member in the groupMembers list
    */
    if (expenseAmountForMember * numberOfMembers !== expenseAmount) {
      adjustedMemberAmount = expenseAmountForMember + expenseAmount - (expenseAmountForMember * numberOfMembers);
      adjustedMemberAmount = Math.round((adjustedMemberAmount + Number.EPSILON) * 100) / 100;
    }
    const splitExpenseAmountByMember = groupMembers.map((member, index) => {
      return {
        userId: member, amount: index === 0 && adjustedMemberAmount
          ? adjustedMemberAmount : expenseAmountForMember
      };
    });
    return splitExpenseAmountByMember;
  }
  static getSplitExactAmountOfMembers(splitAmountOrPercentOfMembers, expenseAmount) {
    const totalAmountOfMembers = splitAmountOrPercentOfMembers.reduce((acc, { userId, amountOrPercent }) => acc += parseFloat(amountOrPercent), 0);
    if (totalAmountOfMembers === expenseAmount) {
      const updatedSplitAmountOfMembers = splitAmountOrPercentOfMembers.map(({ userId, amountOrPercent }) => {
        return { userId, amount: parseFloat(amountOrPercent) };
      });
      return updatedSplitAmountOfMembers;
    }
    return false;
  }
  static getSplitPercentAmountOfMembers(splitAmountOrPercentOfMembers, expenseAmount) {
    const totalAmountOfMembers = splitAmountOrPercentOfMembers.reduce((acc, { userId, amountOrPercent }) => {
      let amount = (parseFloat(amountOrPercent) * expenseAmount) / 100;
      return acc += parseFloat(amount);
    }, 0);
    if (totalAmountOfMembers === expenseAmount) {
      const updatedSplitAmountOfMembers = splitAmountOrPercentOfMembers.map(({ userId, amountOrPercent }) => {
        const amount = (parseFloat(amountOrPercent) * expenseAmount) / 100;
        return { userId, amount };
      });
      return updatedSplitAmountOfMembers;
    }
    return false;
  }
  static setOptionsToMemberSelect() {
    const groupMembers = document.querySelector('#group-members');
    const users = Store.getUsers();
    const loggedInUser = Store.getLoggedInUser();
    const members = users.filter(user => user.id !== loggedInUser.id);
    members.map(({ name, id }) => {
      const newOption = document.createElement('option');
      const optionText = document.createTextNode(name);
      newOption.appendChild(optionText);
      // and option value
      newOption.setAttribute('value', id);
      groupMembers && groupMembers.appendChild(newOption);
    });
  }
  static showSplitResult(splitType, groupMembers, showSplitResultSelector, showSplitResultLabelSelector) {
    const users = Store.getUsers();
    const loggedInUser = Store.getLoggedInUser();
    let splitAmountInputs;
    if (splitType === 'exact') {
      splitAmountInputs = groupMembers.map((id) => {
        const [{ name }] = users.filter(user => user.id === id);
        return `
          <div class="row">
            <div class="col-md-6">
            Expense Share for ${name}
            </div>
            <input  placeholder="Expense Amount for ${name}" class="col-md-6 form-control" id="${id}-expense-amount" type="number" />
            <p id="error-${id}-expense-amount"class="text-danger"></p>
          </div>`;
      });
    }
    else if (splitType === 'percent') {
      const updatedGroupMembers = [...groupMembers, loggedInUser.id];
      splitAmountInputs = updatedGroupMembers.map((id) => {
        const [{ name }] = users.filter(user => user.id === id);
        const nameText = loggedInUser.id === id ? "You" : name;
        return `
          <div class="row">
            <div class="col-md-6">
            Expense amount percent for ${name}
            </div>
            <input placeholder="Expense amount percent for ${nameText}" class="col-md-6 form-control" id="${id}-percent-amount" type="number" />
            <p id="error-${id}-expense-percent" class="text-danger"></p>
          </div>`;
      });
    }
    showSplitResultLabelSelector.innerText = `You paid and split ${splitType.toUpperCase()}`;
    if (splitAmountInputs) {
      showSplitResultSelector.innerHTML = splitAmountInputs;
    }
  }
}
function resetSplitResults() {
  showSplitResultSelector.innerHTML = "";
  showSplitResultLabelSelector.innerText = 'You paid and split EQUALLY';
  splitTypeSelector.value = 'equally';
}

//Create select box options dynamically
window.addEventListener('load', () => {
  AddExpense.setOptionsToMemberSelect();
});

splitTypeSelector && splitTypeSelector.addEventListener('change', (e) => {
  const selectedSplitType = e.target.value;
  const groupMembers = document.querySelector('#group-members');
  let selectedGroupMembers = [...groupMembers.options].filter(option => option.selected).map(option => option.value);
  if (selectedGroupMembers.length === 0) {
    UI.showAlert('error-group-members', 'Choose friends from the list!');
  } else {
    AddExpense.showSplitResult(selectedSplitType, selectedGroupMembers, showSplitResultSelector, showSplitResultLabelSelector);
  }
});
expenseAmountSelector && expenseAmountSelector.addEventListener('change', () => {
  resetSplitResults();
});
groupMembersSelector && groupMembersSelector.addEventListener('change', () => {
  resetSplitResults();
});
expenseFormSelector && expenseFormSelector.addEventListener('submit', (e) => {
  //prevent the defaAddExpense.setOptionsToMemberSelect();ult behaviour of the submit btn
  e.preventDefault();
  //Getting the values from inputs
  let description = document.querySelector('#description').value;
  let groupMembers = document.querySelector('#group-members');
  let selectedGroupMembers = [...groupMembers.options].filter(option => option.selected).map(option => option.value);
  let expenseAmount = document.querySelector('#expense-amount').value;
  let splitType = document.querySelector('#split-type').value;
  description = description !== '' ? description : false;
  selectedGroupMembers = selectedGroupMembers.length > 0 ? selectedGroupMembers : false;
  expenseAmount = !Number.isNaN(parseFloat(expenseAmount)) ? parseFloat(expenseAmount) : false;
  splitType = splitType !== '' ? splitType : false;

  // Get the share amount and percent when split type is exact or percent
  let splitAmountOrPercentOfMembers;
  if (splitType === 'exact') {
    splitAmountOrPercentOfMembers = selectedGroupMembers.map((member) => {
      return { userId: member, amountOrPercent: document.querySelector(`#${member}-expense-amount`).value }
    });
  }
  else if (splitType === 'percent') {
    const loggedInUser = Store.getLoggedInUser();
    const updatedGroupMembers = [...selectedGroupMembers, loggedInUser.id];
    splitAmountOrPercentOfMembers = updatedGroupMembers.map((member) => {
      return { userId: member, amountOrPercent: document.querySelector(`#${member}-percent-amount`).value }
    });
  }
  //Validations
  let validationsOfSplitAmountOrPercentOfMember;
  if (splitAmountOrPercentOfMembers) {
    validationsOfSplitAmountOrPercentOfMember = splitAmountOrPercentOfMembers.map(({ userId, amountOrPercent }) => {
      let selector, message;
      if (amountOrPercent === "" || amountOrPercent <= 0) {
        if (splitType === 'exact') {
          selector = `error-${userId}-expense-amount`;
          message = "Expense share amount should not be negative or empty!"
        } else if (splitType === 'percent') {
          selector = `error-${userId}-expense-percent`;
          message = "Expense share percent should not be negative or empty!"
        }
      }
      return { selector, message };
    });
  }
  if (validationsOfSplitAmountOrPercentOfMember) {
    validationsOfSplitAmountOrPercentOfMember.map(({ selector, message }) => {
      if (selector && message) {
        UI.showAlert(selector, message);
      }
    });
  }
  if (!description) {
    UI.showAlert('error-description', 'Expense description is required!');
  }
  if (!selectedGroupMembers) {
    UI.showAlert('error-group-members', 'Choose friends from the list!');
  }
  if (!expenseAmount) {
    UI.showAlert('error-expense-amount', 'Expense amount is required!');
  }
  if (!splitType) {
    UI.showAlert('error-split-type', 'Expense split type is required!');
  }
  if (description && selectedGroupMembers && expenseAmount && splitType && splitAmountOrPercentOfMembers) {
    const expenseDataArgumentObject = {
      expenseAmount,
      groupMembers: selectedGroupMembers,
      splitType,
      splitAmountOrPercentOfMembers
    }
    const expenseSplit = AddExpense.prepareExpenseDataToSave(expenseDataArgumentObject);
    if (!expenseSplit) {
      if (splitType === 'exact') {
        const message = 'Share amount for each members should match with expense amount!';
        UI.showAlert('error-message', message, 5000);
      }
      if (splitType === 'percent') {

        const message = 'Share percentage of amount for each members should match with expense amount!';
        UI.showAlert('error-message', message, 5000)
      }
      return;
    }
    const data = {
      description,
      selectedGroupMembers,
      expenseAmount,
      splitType,
      expenseSplit
    }
    if (AddExpense.saveExpense(data)) {
      UI.showAlert('success-message', 'Expense amount split and saved successfully!');
      expenseFormSelector.reset();
      resetSplitResults();
    }
    else {
      UI.showAlert('error-message', 'Expense split failed!');
    }
  }
});
