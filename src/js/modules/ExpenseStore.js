// ExpenseStore class :Handle the expenses storage
class ExpenseStore {
  static getAllExpenses() {
    let expenses = window.localStorage.getItem('expenses');
    if (expenses !== null) {
      expenses = JSON.parse(expenses);
    } else {
      expenses = [];
    }
    return expenses;
  }
  static saveExpense(newExpense) {
    let expenses = this.getAllExpenses();
    expenses.push(newExpense);
    try{
      window.localStorage.setItem("expenses", JSON.stringify(expenses))
    }catch(err){
      return false;
    }
    return true;
  }
}

export default ExpenseStore;