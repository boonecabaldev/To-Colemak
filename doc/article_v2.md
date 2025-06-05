# Changing Keyboard Layouts - Let's Build a Browser Extension

### Introduction

Ever found yourself on a computer where you can't change the system-wide keyboard layout? Perhaps it's a shared machine, or IT policies restrict access to system settings. If you're a Colemak user, this can be frustrating. In this article, I'll guide you through "To-Colemak," a browser extension I'm developing that allows you to seamlessly switch your typing from QWERTY or Dvorak to Colemak directly within your browser.

You can find the project repository [here](https://github.com/boonecabaldev/To-Colemak/tree/dev).

## Prerequisites

This article assumes you have a foundational understanding of HTML, CSS, and JavaScript, along with a general idea of how browser extensions work. If you're new to these concepts, here are some excellent resources to get you started:

- [HTML & CSS: Your Gateway to Building Stunning Websites](https://dev.to/techcrafted/html-css-your-gateway-to-building-stunning-websites-2hff)
- [Browser Extension - Extension architecture](https://dev.to/qmenoret/browser-extension-extension-architecture-13m1)
- [How to Rapidly Build Browser Extensions With AI](https://dev.to/boonecabal/how-to-rapidly-build-browser-extensions-with-ai-1ml6) (An article I wrote that you might find helpful!)

## This is how it works

The core idea is simple: activate the extension via its popup menu (by clicking the extension icon) or by using the `Ctrl+L` shortcut. Once active, any text you type into input fields or textareas on a webpage will be converted to the Colemak layout.

Here's a typical use case:

1.  Click the extension icon to open the popup.

    ![Image](https://i.imgur.com/tNEPqx4.png)

2.  Check the "Enable Key Conversion" checkbox.

    ![Image](https://i.imgur.com/no6ekJC.png)

3.  Click on any text input field on a webpage.

    ![Image](https://i.imgur.com/KJ1Z7zS.png)

Now, notice the red border around the active input field; when you type, you'll be using the Colemak layout!

> **NOTE**: This extension is a work in progress, and earlier versions might not work perfectly on all types of text elements.

## Project Structure

Here's the directory structure I've adopted for this project:


```markdown
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
📄 11.4.1
📄 jest
📄 manifest.json
📄 package-lock.json
📄 package.json
📄 test
```

## Using the Model-View-Controller (MVC) Architecture

I prefer to build unit tests alongside the application logic. Adopting the Model-View-Controller (MVC) pattern helps achieve a clean separation of concerns, making the code more modular and testable. Here's how it's applied:

-   **Model (`model.js`):** Manages the extension's state (e.g., whether conversion is active, the selected source layout like QWERTY or Dvorak) and holds the core data, such as the keyboard layout mappings.
-   **View (`view.js`):** Responsible for all DOM manipulations. This includes highlighting the active input field with a red border and displaying overlay messages when the extension's state changes.
-   **Controller (`controller.js`, `content.js`):** Acts as the intermediary between the Model and the View. It listens for user interactions (like key presses) and browser events, processes them (often using logic or data from the Model), and instructs the View to update the UI accordingly.

The primary key conversion logic is handled within the `convertToColemak` function, typically part of the controller layer:

```javascript
function convertToColemak(event) {
  // Only convert if the extension is active and no modifier keys (Ctrl, Alt, Meta) are pressed.
  if (!Model.isActive || event.ctrlKey || event.altKey || event.metaKey) return;

  const colemakKey = Model.keyboardLayout[event.key]; // Get the Colemak equivalent from the Model's mapping.

  if (colemakKey) {
    event.preventDefault(); // Prevent the original key from being typed.
    let inputElement = event.target;
    let handled = false;

    // Traverse up the DOM to find a suitable input field or contentEditable element.
    while (inputElement) {
      if (inputElement.isContentEditable) {
        // For contentEditable elements, use execCommand to insert text.
        document.execCommand("insertText", false, colemakKey);
        handled = true;
        break;
      } else if (inputElement.tagName === "INPUT" || inputElement.tagName === "TEXTAREA") {
        // For standard input fields and textareas, manually insert the text.
        const start = inputElement.selectionStart;
        const end = inputElement.selectionEnd;
        const value = inputElement.value;
        inputElement.value = value.slice(0, start) + colemakKey + value.slice(end);
        // Move the cursor to after the inserted character.
        inputElement.setSelectionRange(start + colemakKey.length, start + colemakKey.length);
        handled = true;
        break;
      }
      inputElement = inputElement.parentNode;
    }

    // Fallback if no specific input field was handled (less common).
    if (!handled) {
      document.execCommand("insertText", false, colemakKey);
    }
  }
}
```

 The rest of the project's code can be explored in the [repo](https://github.com/boonecabaldev/To-Colemak/tree/dev). I utilized GitHub Copilot extensively for generating boilerplate and assisting with various code segments.

>**NOTE**: For insights into leveraging AI for extension development, check out my article: How to Rapidly Build Browser Extensions With AI.

## Building and Running Unit Tests

Unit testing is crucial for ensuring the extension's reliability. I chose Jest as the testing framework.

## Setting Up The Development Environment

Setting up the testing environment, especially on Windows, required a few specific steps. I used Conda for managing Node.js versions:

1. Installed Miniconda (or Anaconda) if not already present.
2. Opened the Anaconda Prompt (or your preferred terminal configured for Conda).
3. Created a new Conda environment and installed `Node.js` (which includes `npm`):

```shell
conda create -n to-colemak-env nodejs
conda activate to-colemak-env
```

4. Navigated to the project directory and installed Jest as a development dependency:

```shell
npm install --save-dev jest
```

## Writing and Running the Tests

Tests are organized by component:

* `tests/model.test.js`: Contains tests for the `Model` class, verifying state management and layout settings.
* `tests/view.test.js`: Includes more complex tests for the `View` class, ensuring the UI updates correctly based on the `Model`'s state. These often involve simulating DOM interactions.

Here's an example test from `view.test.js` that checks if the input field border is styled correctly based on the extension's active state:

```javascript
  test("handleFocus does not set borderColor if Model is inactive", () => {
    Model.isActive = false; // Set the model to inactive
    const input = document.createElement("input"); // Create a mock input element
    View.handleFocus({ target: input }); // Call the function under test
    expect(input.style.borderColor).toBe(""); // Assert that the border color was not changed
  });
```

This test ensures that `View.handleFocus` only applies a border color when `Model.isActive` is true.

>**NOTE:** The current test suite provides basic coverage and can be expanded to include more edge cases.

To run the tests, execute the following command in your terminal (from the project root, with the Conda environment activated):

```shell
npm test
```

Or, for more detailed output:

```shell
npx jest --verbose
```

You should see output similar to this, indicating passing tests:

```shell
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

## Installing the Extension for Development

To install and test the "To-Colemak" extension during development, you'll load it as an "unpacked extension" in a Chromium-based browser (like Google Chrome, Brave, or Microsoft Edge).

1. **Open your Chromium-based browser**.
2. **Navigate** to the extensions page:
    * In Chrome or Brave: Type `chrome://extensions` into the address bar and press Enter.
    * In Edge: Type `edge://extensions` into the address bar and press Enter.
3. **Enable Developer Mode**: Look for a toggle switch labeled "Developer mode" (usually in the top-right corner of the page) and turn it on.
4. **Load Unpacked**: Once Developer Mode is enabled, a "Load unpacked" button will appear. Click it.
5. **Select Extension Folder**: In the file dialog that opens, navigate to the root directory of your "To-Colemak" extension (the folder containing the `manifest.json` file) and select it.
6. The extension should now be installed and active. You'll see its card appear on the extensions page. You might want to pin it to your browser's toolbar for easy access by clicking the puzzle piece icon (Extensions) and then the pin icon next to "To-Colemak."

## Testing the Extension Manually

After installing the extension, perform these manual checks:

1. Verify that the overlay message ("Colemak Conversion Enabled/Disabled") appears correctly when you toggle the extension using the popup or the `Ctrl+L` shortcut.
2. Confirm that the border of a focused textbox is highlighted in red when the extension is active and returns to normal when inactive or when focus is lost.
3. Test the core functionality: ensure that typing in QWERTY (or Dvorak, if selected) into a text field correctly converts the input to Colemak when the extension is active.

## Conclusion

In this article, we've journeyed through the development of "To-Colemak," a browser extension designed to bring the Colemak keyboard layout to environments where system-level changes are restricted. We explored its core functionality, the Model-View-Controller architecture structuring its code, the process of setting up a Jest testing environment, and how to load and test the extension during development.

This "To-Colemak" extension demonstrates a practical solution to a common challenge, leveraging browser capabilities to enhance user experience. Whether you're a Colemak enthusiast, a budding extension developer, or simply curious about how such tools are built, I hope this guide has been insightful.

Feel free to explore the project repository, try out the extension, and perhaps even contribute to its ongoing development. Happy typing!