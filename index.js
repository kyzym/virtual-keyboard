const container = document.createElement('div');
container.classList.add('container');

const textarea = document.createElement('textarea');
textarea.classList.add('textarea');

const keyboardContainer = document.createElement('div');
keyboardContainer.classList.add('keyboard');

container.appendChild(textarea);
container.appendChild(keyboardContainer);

document.body.appendChild(container);
