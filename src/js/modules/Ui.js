// UI class : Handle UI tasks
class UI {
  static showAlert(selector, message) {
    document.querySelector(`#${selector}`).style.display = 'block';
    document.querySelector(`#${selector}`).innerText = message;
    setTimeout(() => {
      document.querySelector(`#${selector}`).style.display = 'none';
      document.querySelector(`#${selector}`).innerText = '';
    }, 3000);
  }
}

export default UI;
