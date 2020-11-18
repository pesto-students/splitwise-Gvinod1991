// UI class : Handle UI tasks
class UI {
  static showAlert(selector, message, delay = 3000) {
    document.querySelector(`#${selector}`).style.display = 'block';
    document.querySelector(`#${selector}`).innerText = message;
    setTimeout(() => {
      document.querySelector(`#${selector}`).style.display = 'none';
      document.querySelector(`#${selector}`).innerText = '';
    }, delay);
  }
}

export default UI;
