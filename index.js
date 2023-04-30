const iconLink = document.createElement('link');
iconLink.rel = 'icon';
iconLink.href = 'assets/keyboard-key.png';
document.head.appendChild(iconLink);

const currentLanguage = localStorage.getItem('lang')
  ? localStorage.getItem('lang')
  : 'ru_RU';
localStorage.setItem('lang', currentLanguage);

const inputArea = document.createElement('textarea');
inputArea.cols = 100;
inputArea.rows = 10;
inputArea.wrap = '\n';
document.body.append(inputArea);
setInterval(() => {
  inputArea.focus();
}, 0);

const virtualKeyboard = document.createElement('div');
virtualKeyboard.className = 'keyboard';
document.body.append(virtualKeyboard);

async function fetchKeyboardData() {
  const keyLayoutPath = 'assets/keyLayout.json';
  const response = await fetch(keyLayoutPath);
  const data = await response.json();
  return data;
}

function createKeyElement(key) {
  const newKeyElement = document.createElement('div');
  newKeyElement.className = key.category;
  newKeyElement.id = key.code;
  newKeyElement.innerHTML = key.value;
  virtualKeyboard.append(newKeyElement);
}

function renderKeyboard(language) {
  fetchKeyboardData().then((result) => {
    const keyboardData = result.languages[language];
    keyboardData.forEach(createKeyElement);
  });
}

renderKeyboard(currentLanguage);
