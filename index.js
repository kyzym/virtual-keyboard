const leftShift = 'ShiftLeft';
const rightShift = 'ShiftRight';

let currentLanguage = localStorage.getItem('lang')
  ? localStorage.getItem('lang')
  : 'ru_RU';
localStorage.setItem('lang', currentLanguage);

const inputArea = document.createElement('textarea');
inputArea.cols = 110;
inputArea.wrap = '\n';
document.body.append(inputArea);
setInterval(() => {
  inputArea.focus();
}, 0);

const virtualKeyboard = document.createElement('div');
virtualKeyboard.className = 'keyboard';
document.body.append(virtualKeyboard);

let capsLockActive = false;

const activeKeys = {};
let keysDisplayed;

async function fetchKeyboardData() {
  try {
    const keyLayoutPath = 'assets/keyLayout.json';
    const response = await fetch(keyLayoutPath);
    const { languages } = await response.json();
    return languages;
  } catch (error) {
    throw new Error(error.message);
  }
}

function createKeyElement({ category, code, value }) {
  const newKeyElement = document.createElement('div');
  newKeyElement.className = category;
  newKeyElement.id = code;
  newKeyElement.innerHTML = value;
  virtualKeyboard.append(newKeyElement);
  return newKeyElement;
}

function addKeyListeners(newKeyElement) {
  newKeyElement.addEventListener('mousedown', () => {
    const { id } = newKeyElement;
    if (id === leftShift || id === rightShift) {
      inputArea.dispatchEvent(
        new KeyboardEvent('keydown', {
          key: activeKeys[id].value,
          code: id,
          shiftKey: true,
        })
      );
    } else if (
      activeKeys[id].category === 'functional' ||
      activeKeys[id].category === 'spacing'
    ) {
      inputArea.dispatchEvent(
        new KeyboardEvent('keydown', {
          key: activeKeys[id].value,
          code: id,
        })
      );
    } else {
      inputArea.dispatchEvent(new KeyboardEvent('keydown', { code: id }));
    }
  });
  newKeyElement.addEventListener('mouseup', () => {
    const { id } = newKeyElement;
    if (id === leftShift || rightShift) {
      inputArea.dispatchEvent(
        new KeyboardEvent('keyup', {
          key: 'Shift',
          code: id,
          shiftKey: false,
        })
      );
    } else if (activeKeys[id].category === 'functional') {
      inputArea.dispatchEvent(
        new KeyboardEvent('keyup', {
          key: activeKeys[id].value,
          code: id,
        })
      );
    } else {
      inputArea.dispatchEvent(new KeyboardEvent('keyup', { code: id }));
    }
  });
}

function updateActiveKeys(language, shift = false) {
  fetchKeyboardData().then((result) => {
    result[language].forEach((key) => {
      let keyElement = document.getElementById(key.code);
      if (!keyElement) {
        keyElement = createKeyElement(key);
        addKeyListeners(keyElement);
        keysDisplayed = [...document.querySelectorAll('.keyboard div')];
      } else {
        keyElement.innerHTML = key.value;
        if (shift) toggleShift(true, capsLockActive);
        else if (capsLockActive) toggleCapsLock(capsLockActive);
      }

      activeKeys[key.code] = key;
    });
  });
}

updateActiveKeys(currentLanguage);

inputArea.addEventListener('keydown', (e) => {
  const keyElement = document.getElementById(
    e.code === '' ? `${e.key}Right` : e.code
  );
  if (keyElement) {
    keyElement.classList.add('active');
  } else return false;

  switch (e.code) {
    case 'CapsLock':
      capsLockActive = !capsLockActive;
      toggleCapsLock(capsLockActive, e.shiftKey);
      break;
    case 'ShiftLeft':
    case 'ShiftRight':
      toggleShift(e.shiftKey, capsLockActive);
      break;
    case 'Backspace':
      performBackspace(e);
      break;
    case 'Delete':
      performDelete(e);
      break;
    default:
      if (
        activeKeys[e.code].category === 'letter' ||
        activeKeys[e.code].category === 'changeable' ||
        activeKeys[e.code].category === 'spacing'
      ) {
        substituteCharacter(
          activeKeys[e.code].category === 'spacing'
            ? e.code === 'Enter'
              ? '\n'
              : e.code === 'Tab'
              ? '\t'
              : ''
            : document.getElementById(e.code).textContent,
          e
        );
      } else if (e.key === 'Alt' || e.key === 'Control') {
        handleControlAlt(e);
      }
  }
});

inputArea.addEventListener('keyup', (e) => {
  if (!document.getElementById(`${e.code === '' ? `${e.key}Right` : e.code}`)) {
    return false;
  }
  setTimeout(() => {
    document
      .getElementById(`${e.code === '' ? `${e.key}Right` : e.code}`)
      .classList.remove('active');
  }, 300);
  if (e.key === 'Shift') toggleShift(e.shiftKey, capsLockActive);
});

function substituteCharacter(newChar, e) {
  const startPosition = e.target.selectionStart;
  const endPosition = e.target.selectionEnd;
  const oldValue = e.target.value;

  const newValue =
    oldValue.slice(0, startPosition) + newChar + oldValue.slice(endPosition);
  e.target.value = newValue;

  e.target.selectionStart = startPosition + 1;
  e.target.selectionEnd = e.target.selectionStart;

  e.preventDefault();
}

function toggleCapsLock(caps, shift = false) {
  keysDisplayed.forEach((key) => {
    if (activeKeys[key.id].category === 'letter') {
      if (caps) {
        key.innerHTML = shift
          ? key.innerHTML.toLowerCase()
          : key.innerHTML.toUpperCase();
      } else if (!caps) {
        key.innerHTML = shift
          ? key.innerHTML.toUpperCase()
          : key.innerHTML.toLowerCase();
      }
    }
  });
}

function toggleShift(shift, caps) {
  keysDisplayed.forEach((key) => {
    if (activeKeys[key.id].category === 'letter' && caps) {
      key.innerHTML = shift
        ? key.innerHTML.toLowerCase()
        : key.innerHTML.toUpperCase();
    } else if (activeKeys[key.id].category === 'letter' && !caps) {
      key.innerHTML = shift
        ? key.innerHTML.toUpperCase()
        : key.innerHTML.toLowerCase();
    }
    if (activeKeys[key.id].category === 'changeable') {
      key.innerHTML = shift
        ? activeKeys[key.id].altValue
        : activeKeys[key.id].value;
    }
  });
}

function handleControlAlt(e) {
  if (e.shiftKey && e.altKey) {
    currentLanguage = currentLanguage === 'ru_RU' ? 'en_US' : 'ru_RU';
    localStorage.setItem('lang', currentLanguage);
    updateActiveKeys(currentLanguage, e.shiftKey);
  }

  e.preventDefault();
}

function performBackspace(e) {
  const startPosition = e.target.selectionStart;
  const endPosition = e.target.selectionEnd;
  const oldValue = e.target.value;

  const newValue =
    oldValue.slice(
      0,
      startPosition === endPosition ? startPosition - 1 : startPosition
    ) + oldValue.slice(endPosition);
  e.target.value = newValue;

  e.target.selectionStart =
    startPosition === endPosition ? startPosition - 1 : startPosition;
  e.target.selectionEnd = e.target.selectionStart;

  e.preventDefault();
}

function performDelete(e) {
  const startPosition = e.target.selectionStart;
  const endPosition = e.target.selectionEnd;
  const oldValue = e.target.value;

  if (!(oldValue.length > endPosition)) return false;

  const newValue =
    oldValue.slice(0, startPosition) + oldValue.slice(endPosition + 1);
  e.target.value = newValue;

  e.target.selectionStart = startPosition;
  e.target.selectionEnd = e.target.selectionStart;

  e.preventDefault();
}
