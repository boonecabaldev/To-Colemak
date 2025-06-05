# Changing Keyboard Layouts - Let's Build a Browser Extension

## Introduction

Imagine sitting at a shared computer, your fingers poised to type in Colemak, only to realize the system is locked to QWERTY. Frustrating, right? For Colemak users, who enjoy its ergonomic benefits, this is a common hurdle in environments with strict IT policies. Enter "To-Colemak," a browser extension I'm developing to let you switch from QWERTY or Dvorak to Colemak directly in your browser, no system changes needed.

In this article, I'll guide you through building "To-Colemak," from its core functionality to its Model-View-Controller (MVC) architecture, testing setup, and installation. The repository is available [here](https://github.com/boonecabaldev/To-Colemak/tree/dev). Whether you're a Colemak enthusiast or a curious developer, let's create a tool to make typing a breeze!

## Prerequisites

This article assumes a basic understanding of HTML, CSS, and JavaScript, along with a general idea of how browser extensions work. If you're new to these, check out these resources:

- [HTML & CSS: Your Gateway to Building Stunning Websites](https://dev.to/techcrafted/html-css-your-gateway-to-building-stunning-websites-2hff)
- [Browser Extension - Extension Architecture](https://dev.to/qmenoret/browser-extension-extension-architecture-13m1)
- [How to Rapidly Build Browser Extensions With AI](https://dev.to/boonecabal/how-to-rapidly-build-browser-extensions-with-ai-1ml6) (An article I wrote that you might find helpful!)

## How It Works

The core idea is simple: activate the extension via its popup menu (by clicking the extension icon) or the `Ctrl+L` shortcut. Once active, text typed into input fields or textareas on a webpage converts to the Colemak layout.

Here's a typical use case:

1. Click the extension icon to open the popup.

   ![Screenshot of To-Colemak extension popup with 'Enable Key Conversion' option](https://i.imgur.com/tNEPqx4.png)

2. Check the "Enable Key Conversion" checkbox.

   ![Screenshot of To-Colemak popup with 'Enable Key Conversion' checked](https://i.imgur.com/no6ekJC.png)

3. Click any text input field on a webpage.

   ![Screenshot of a text input field with a red border indicating active Colemak conversion](https://i.imgur.com/KJ1Z7zS.png)

Notice the red border around the active input field; when you type, you're using the Colemak layout!

> **Note**: This extension is a work in progress. Earlier versions may not fully support elements like contenteditable divs, iframes, or inputs in shadow DOM. Future versions may use MutationObservers or postMessage to address these challenges.

## Project Structure

Here's the directory structure for the project:

```
📂 doc
  📄 article.md
  📄 README.md
📂 icons
  📄 keyboard128.png
  📄 keyboard16.png
  📄 keyboard24.png
  📄 keyboard32.png
  📄 keyboard64.png
📂 src
  📄 background.js
  📄 content.js
  📄 controller.js
  📄 model.js
  📄 popup.html
  📄 popup.js
  📄 view.js
📂 tests
  📄 model.test.js
  📄 view.test.js
📄 .gitignore
📄 .hintrc
📄 manifest.json
📄 package-lock.json
📄 package.json
```

> **Note**: The `11.4.1`, `jest`, and `test` entries in the original structure were removed as they seemed to be placeholders or unrelated to the project.

## Using the Model-View-Controller (MVC) Architecture

The extension uses the Model-View-Controller (MVC) pattern for a clean separation of concerns, making the code modular and testable:

- **Model (`model.js`)**: Manages the extension's state (e.g., whether conversion is active, the source layout like QWERTY or Dvorak) and stores keyboard layout mappings.
- **View (`view.js`)**: Handles DOM manipulations, such as highlighting active input fields with a red border or displaying overlay messages for state changes.
- **Controller (`controller.js`, `content.js`)**: Acts as the intermediary, listening for user interactions (e.g., key presses) or browser events, processing them with Model data, and updating the View.

For example, when the user toggles the extension via the popup (View), the Controller updates the Model's `isActive` state and saves it to storage. The View then listens for this change and adds a red border to the active input field.

The key conversion logic lies in the `convertToColemak` function in the Controller:

```javascript
function convertToColemak(event) {
  // Skip conversion if extension is inactive or modifier keys are pressed
  if (!Model.isActive || event.ctrlKey || event.altKey || event.metaKey) return;

  // Map the pressed key to its Colemak equivalent
  const colemakKey = Model.keyboardLayout[event.key];
  if (!colemakKey) return; // Exit if no mapping exists

  event.preventDefault(); // Prevent default keypress behavior
  let inputElement = event.target;
  let handled = false;

  // Traverse DOM to find input or contentEditable element
  while (inputElement) {
    if (inputElement.isContentEditable) {
      // Insert text into contentEditable elements
      document.execCommand("insertText", false, colemakKey);
      handled = true;
      break;
    } else if (inputElement.tagName === "INPUT" || inputElement.tagName === "TEXTAREA") {
      // Insert text into standard input or textarea
      const start = inputElement.selectionStart;
      const end = inputElement.selectionEnd;
      inputElement.value = inputElement.value.slice(0, start) + colemakKey + inputElement.value.slice(end);
      inputElement.setSelectionRange(start + colemakKey.length, start + colemakKey.length);
      handled = true;
      break;
    }
    inputElement = inputElement.parentNode;
  }

  // Fallback: insert text if no specific input was found
  if (!handled) {
    document.execCommand("insertText", false, colemakKey);
  }
}
```

This function:
1. Checks if the extension is active and no modifier keys (Ctrl, Alt, Meta) are pressed.
2. Maps the pressed key to its Colemak equivalent using the Model's keyboard layout.
3. Prevents the original keypress and inserts the Colemak key into the active input field or contenteditable element.
4. Updates the cursor position for smooth typing.

> **Note**: `document.execCommand` is deprecated. Future versions may explore the Clipboard API or `InputEvent` for better compatibility. For more details, check the [repository](https://github.com/boonecabaldev/To-Colemak/tree/dev).

## Building and Running Unit Tests

Unit testing ensures the extension's reliability. I chose Jest for its simplicity, built-in mocking, and widespread use in JavaScript projects.

### Setting Up the Development Environment

To set up the testing environment (example for Windows using Conda):

1. Install Miniconda (or Anaconda) if not already present.
2. Open the Anaconda Prompt (or a Conda-configured terminal).
3. Create a new Conda environment with Node.js:

```shell
conda create -n to-colemak-env nodejs
conda activate to-colemak-env
```

4. Navigate to the project directory and install Jest:

```shell
npm install --save-dev jest
```

> **Note**: Non-Windows users can use `nvm` or a direct Node.js installation instead of Conda.

### Writing and Running Tests

Tests are organized by component:
- `tests/model.test.js`: Verifies state management and layout settings in the Model.
- `tests/view.test.js`: Tests UI updates, such as border styling, by simulating DOM interactions with mock elements (e.g., `document.createElement("input")`).

Here's an example test from `view.test.js`:

```javascript
test("handleFocus does not set borderColor if Model is inactive", () => {
  Model.isActive = false; // Set the model to inactive
  const input = document.createElement("input"); // Create a mock input element
  View.handleFocus({ target: input }); // Call the function under test
  expect(input.style.borderColor).toBe(""); // Assert that the border color was not changed
});
```

This test ensures `View.handleFocus` only applies a border color when `Model.isActive` is true.

To run the tests (from the project root with the Conda environment activated):

```shell
npm test
```

For detailed output:

```shell
npx jest --verbose
```

Expected output:

```
(to-colemak-env) C:\Users\unity1\dev\To-Colemak>npx jest --verbose
 PASS  tests/model.test.js
  Model
    √ setLayout sets QWERTY mapping (6 ms)
    √ setLayout sets Dvorak mapping
    √ setActive updates isActive and persists (2 ms)
    √ load sets state from storage (1 ms)

 PASS  tests/view.test.js
  View
    √ handleFocus sets borderColor to red if active (10 ms)
    √ handleBlur resets borderColor if active (1 ms)
    √ updateHighlight highlights active input (3 ms)
    √ showToggleMessage creates and removes overlay (22 ms)
    √ handleFocus does not set borderColor if Model is inactive (1 ms)
    √ typing in textbox converts keys to Colemak when Model.isActive is true (5 ms)

Test Suites: 2 passed, 2 total
Tests:       10 passed, 10 total
Snapshots:   0 total
Time:        1.035 s, estimated 4 s
Ran all test suites.
```

> **Note**: The test suite provides basic coverage. Future tests could cover edge cases like special characters or complex DOM structures.

## Installing the Extension for Development

To test "To-Colemak" during development, load it as an unpacked extension in a Chromium-based browser (e.g., Chrome, Brave, Edge):

1. Open your browser.
2. Navigate to the extensions page:
   - Chrome/Brave: `chrome://extensions`
   - Edge: `edge://extensions`
3. Enable "Developer mode" (top-right toggle).
4. Click "Load unpacked" and select the project folder ( Hawkins the `manifest.json` file).
5. Pin the extension to the toolbar for easy access (via the puzzle piece icon).

> **Note**: This extension is designed for Chromium-based browsers. Firefox support is planned for a future release.

## Testing the Extension Manually

After installation, verify:
1. The overlay message ("Colemak Conversion Enabled/Disabled") appears when toggling the extension via the popup or `Ctrl+L`.
2. The focused textbox border is highlighted red when active and resets when inactive or focus is lost.
3. Typing in QWERTY (or Dvorak, if selected) converts to Colemak in text fields when active.

## Conclusion

We've explored "To-Colemak," a browser extension that brings the Colemak keyboard layout to environments where system-level changes are restricted. By leveraging the MVC architecture, robust unit tests, and browser capabilities, it empowers users to type comfortably in challenging settings. Whether you're a Colemak enthusiast or a budding developer, I hope this guide inspires you to build your own extensions.

Explore the [repository](https://github.com/boonecabaldev/To-Colemak/tree/dev), try the extension, or contribute by tackling tasks like improving shadow DOM support or adding new layouts in the [GitHub issues](https://github.com/boonecabaldev/To-Colemak/issues). Happy typing!