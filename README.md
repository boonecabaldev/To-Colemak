<!-- README.md for To-Colemak Extension -->

# To-Colemak Browser Extension

A browser extension designed to convert keyboard input to the Colemak layout directly within web pages, particularly useful in environments where system-level keyboard layout changes are restricted.

## Features

- Converts QWERTY (and potentially Dvorak in future versions) input to Colemak.
- Activates via extension popup or `Ctrl+L` shortcut.
- Visually indicates active input fields with a red border when enabled.
- Works within text input fields and textareas on web pages.

## Why Use It?

Ideal for situations where you cannot change the operating system's keyboard layout, such as on shared computers, public terminals, or corporate machines with strict IT policies, allowing Colemak users to type comfortably in their preferred layout within the browser.

## Installation (For Development/Unpacked)

To install and test the extension from the source code, you need to load it as an "unpacked extension" in a Chromium-based browser (like Chrome, Brave, or Edge).

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/boonecabaldev/To-Colemak.git
    cd To-Colemak
    ```
2.  **Open your browser's Extensions page:**
    *   Chrome/Brave: Navigate to `chrome://extensions`
    *   Edge: Navigate to `edge://extensions`
3.  **Enable Developer Mode:** Toggle the "Developer mode" switch (usually in the top-right corner).
4.  **Click "Load unpacked":** A button will appear after enabling Developer Mode.
5.  **Select the extension directory:** Navigate to and select the `To-Colemak` folder you cloned.

The extension should now be installed and active in your browser.

## Usage

1.  Click the "To-Colemak" extension icon in your browser toolbar.
2.  In the popup, check the "Enable Key Conversion" box.
3.  Alternatively, use the shortcut `Ctrl+L` to toggle the extension on/off.
4.  Click into any text input field or textarea on a webpage.
5.  When the extension is active, the input field will have a red border, and your typing will be converted to Colemak.

## Project Structure

The project follows a basic Model-View-Controller (MVC) pattern within the context of a browser extension:

-   `src/model.js`: Manages the extension's state (active/inactive) and keyboard layout mappings.
-   `src/view.js`: Handles UI updates, like highlighting input fields and showing messages.
-   `src/controller.js` / `src/content.js`: Contains the core logic for intercepting key presses and coordinating between the Model and View.
-   `src/background.js`: Handles background tasks and shortcut listeners.
-   `src/popup.html` / `src/popup.js`: The UI and logic for the extension's popup menu.
-   `manifest.json`: Defines the extension's properties, permissions, and scripts.

## Development and Testing

The project includes unit tests using Jest.

1.  **Install dependencies:**
    ```bash
    npm install
    ```
    (Ensure you have Node.js and npm installed, potentially via Conda as mentioned in the article).
2.  **Run tests:**
    ```bash
    npm test
    ```
    or
    ```bash
    npx jest --verbose
    ```

## Contributing

This project is a work in progress. Contributions are welcome! Please feel free to open issues or submit pull requests.

## License

[Specify your license here, e.g., MIT]

---

*Developed by [Your Name/Handle]*