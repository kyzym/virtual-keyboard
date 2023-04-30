# Virtual Keyboard

A simple, lightweight virtual keyboard application built with vanilla JavaScript, HTML, and CSS. This virtual keyboard supports both English (en_US) and Russian (ru_RU) layouts and offers seamless switching between the two languages.

## Features

- Supports English (en_US) and Russian (ru_RU) keyboard layouts.
- Real-time language switching using Alt + Shift.
- Responsive design for various screen sizes.
- Caps Lock and Shift key support for character case modification.
- Functional keys, such as Backspace, Delete, Enter, and Tab.
- Custom favicon support.

## Usage

1. Clone the repository or download the source files.
2. Open the `index.html` file in a web browser.
3. Click or tap on the virtual keys or use your physical keyboard to interact with the input area.

## Keyboard Shortcuts

- Alt + Shift: Switch between English and Russian keyboard layouts.
- Caps Lock: Toggle character case for letter keys.
- Shift: Modify the character case for letter keys and change the symbols for changeable keys.

## Customization

To add a new language or keyboard layout, modify the `keyLayout.json` file located in the `assets` directory. Add a new object to the `languages` array with the desired key layout and update the language-switching logic in the application code accordingly.

## Contributing

Contributions are welcome! Please feel free to submit issues or pull requests to help improve the application.

## License

This project is open-source and available under the MIT License.
