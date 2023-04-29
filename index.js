/* eslint-disable import/extensions */
import keyLayout from './js/keyLayout.js';

const container = document.createElement('div');
container.classList.add('container');

const keyboardContainer = document.createElement('div');
keyboardContainer.classList.add('keyboard');

const textArea = document.createElement('textarea');
textArea.classList.add('text-input');
document.body.insertBefore(textArea, document.getElementById('keyboard'));

let currentLanguage = localStorage.getItem('language') || 'en';
let isShiftPressed = false;
let isCapsLockPressed = false;
let isAltPressed = false;

const preventDefaultForSpecialKeys = (event) => {
  const specialKeys = [
    'ShiftLeft',
    'ShiftRight',
    'ControlLeft',
    'ControlRight',
    'AltLeft',
    'AltRight',
    'CapsLock',
    'Tab',
    'ArrowUp',
    'ArrowDown',
    'ArrowLeft',
    'ArrowRight',
    'Delete',
  ];

  if (specialKeys.includes(event.code)) {
    event.preventDefault();
  }
};

const syncLanguageWithSystem = () => {
  const systemLanguage = navigator.language.startsWith('ru') ? 'ru' : 'en';
  if (systemLanguage !== currentLanguage) {
    toggleLanguage();
  }
};

const initListeners = () => {
  document.getElementById('keyboard').addEventListener('click', (event) => {
    if (event.target.classList.contains('key')) {
      handleKeyPress(event, true);
    }
  });

  document.addEventListener('keydown', (event) => {
    preventDefaultForSpecialKeys(event);
    if (event.code === 'AltLeft' || event.code === 'AltRight') {
      isAltPressed = true;
    }
    if (isAltPressed && event.shiftKey) {
      toggleLanguage();
    }
    if (keyHandlers[event.code]) {
      keyHandlers[event.code]();
    } else {
      handleKeyPress(event);
    }
    if (event.code === 'ShiftLeft' || event.code === 'ShiftRight') {
      toggleShift(true);
    }
  });

  document.addEventListener('keyup', (event) => {
    if (event.code === 'AltLeft' || event.code === 'AltRight') {
      isAltPressed = false;
    }
    if (event.code === 'ShiftLeft' || event.code === 'ShiftRight') {
      toggleShift(false);
    }
  });

  document.addEventListener('DOMContentLoaded', syncLanguageWithSystem);
};

const updateKeyTextContent = (keyElement, keyObj) => {
  const lang = currentLanguage + (isShiftPressed ? 'Shift' : '');
  const char = keyObj[lang];
  keyElement.textContent =
    isCapsLockPressed && char.match(/[a-zа-я]/i) ? char.toUpperCase() : char;
};

const createKey = (keyObj) => {
  const keyElement = document.createElement('button');
  keyElement.setAttribute('type', 'button');
  keyElement.classList.add('key');
  keyElement.dataset.code = keyObj.code;
  keyElement.dataset.key = keyObj[currentLanguage];
  updateKeyTextContent(keyElement, keyObj);
  return keyElement;
};

const updateKeys = () => {
  keyLayout.flat().forEach((keyObj) => {
    const keyElement = document.querySelector(
      `.key[data-code="${keyObj.code}"]`
    );
    if (keyElement) {
      updateKeyTextContent(keyElement, keyObj);
    }
  });
};

const toggleLanguage = () => {
  currentLanguage = currentLanguage === 'en' ? 'ru' : 'en';
  localStorage.setItem('language', currentLanguage);
  updateKeys();
};

const toggleShift = (isPressed) => {
  if (isShiftPressed !== isPressed) {
    isShiftPressed = isPressed;
    updateKeys();
  }
};

const toggleCapsLock = () => {
  isCapsLockPressed = !isCapsLockPressed;
  updateKeys();
};

const handleKeyPress = (event, isVirtual = false) => {
  const code =
    event instanceof KeyboardEvent ? event.code : event.target.dataset.code;
  const keyObj = keyLayout.flat().find((key) => key.code === code);

  if (keyObj) {
    const lang = currentLanguage + (isShiftPressed ? 'Shift' : '');
    const char = keyObj[lang];

    if (char.length === 1 || isVirtual) {
      textArea.setRangeText(
        char,
        textArea.selectionStart,
        textArea.selectionEnd,
        'end'
      );
    }
  }
};

const keyHandlers = {
  CapsLock: toggleCapsLock,
  Tab: () => {
    textArea.setRangeText(
      '\t',
      textArea.selectionStart,
      textArea.selectionEnd,
      'end'
    );
  },
  Delete: () => {
    if (textArea.selectionStart !== textArea.selectionEnd) {
      textArea.setRangeText(
        '',
        textArea.selectionStart,
        textArea.selectionEnd,
        'end'
      );
    } else if (textArea.selectionStart < textArea.value.length) {
      textArea.setRangeText(
        '',
        textArea.selectionStart,
        textArea.selectionStart + 1,
        'end'
      );
    }
  },
};

const initKeys = () => {
  keyLayout.forEach((row) => {
    const rowElement = document.createElement('div');
    rowElement.classList.add('row');
    row.forEach((keyObj) => {
      const keyElement = createKey(keyObj);
      rowElement.appendChild(keyElement);
    });
    keyboardContainer.appendChild(rowElement);
  });

  container.appendChild(keyboardContainer);
  document.body.appendChild(container);
};

initKeys();
initListeners();
