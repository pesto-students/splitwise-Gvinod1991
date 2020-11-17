import Store from './modules/Store';
import ExpenseStore from './modules/ExpenseStore';
import UI from './modules/Ui';
import '../addExpenses.html';

const expenseFormSelector = document.querySelector('#expense-form');

class AddExpense {
  static saveExpense(description, groupMembers, expenseAmount, splitType) {
    const { id } = Store.getLoggedInUser();
    const expenseSplit = this.prepareExpenseDataToSave(expenseAmount, groupMembers, splitType);
    const expenseData = {
      description,
      expenseAmount,
      splitType,
      userId: id,
      expenseSplit,
    };
    return ExpenseStore.saveExpense(expenseData);
  }

  static prepareExpenseDataToSave(expenseAmount, groupMembers, splitType) {
    const loggedInUser = Store.getLoggedInUser();
    let memberWiseExpense = [];
    if (splitType === 'equally') {
      const updatedGroupMembers = [...groupMembers, loggedInUser.id];
      memberWiseExpense = this.getSplitAmountOfMembers(updatedGroupMembers, expenseAmount);
    }
    return memberWiseExpense;
  }

  static getSplitAmountOfMembers(groupMembers, expenseAmount) {
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
      return { userId: member, amount: index === 0 && adjustedMemberAmount
        ? adjustedMemberAmount : expenseAmountForMember };
    });
    return splitExpenseAmountByMember;
  }
}
expenseFormSelector && expenseFormSelector.addEventListener('submit', (e) => {
  //prevent the default behaviour of the submit btn
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
  if (description && selectedGroupMembers && expenseAmount && splitType) {
    if (AddExpense.saveExpense(description, selectedGroupMembers, expenseAmount, splitType)) {
      UI.showAlert('success-message', 'Expense amount split and saved successfully!');
      expenseFormSelector.reset();
    }
    else {
      UI.showAlert('error-message', 'Expense split failed!');
    }
  }
});
