# Changing Keyboard Layouts - Let's Build a Browser Extension

### Introduction

Some people have to use computers with restricted privileges. For instance, you may not be able to install anything, or perhaps you're unable to access the settings to change your keyboard layout to Colemak. In this article, I'm going to share a browser extension I'm developing that allows you to switch from your current layout (qwerty or Dvorak) to Colemak.

You can find the repository [here](https://github.com/boonecabaldev/To-Colemak/tree/dev).

## Prerequisites

This article assumes the reader has a basic understanding of HTML/CSS/JavaScript and a very rough understanding of building browser extensions. Here are some articles I recommend checking out:

- [HTML & CSS: Your Gateway to Building Stunning Websites](https://dev.to/techcrafted/html-css-your-gateway-to-building-stunning-websites-2hff)
- [Browser Extension - Extension architecture](https://dev.to/qmenoret/browser-extension-extension-architecture-13m1)
- [How to Rapidly Build Browser Extensions With AI](https://dev.to/boonecabal/how-to-rapidly-build-browser-extensions-with-ai-1ml6)

## This is how it works

The basic idea is that you activate the extension either via the popcp menu (clicking the icon) or using the shortcut `Ctrl+L`, and then any typing you do in a textbox on the webpayt will use the colemak layout.

Here is the basic use case of using the extension.

1. Click the extension icon.

    ![Image](https://i.imgur.com/tNEPqx4.png)

2. Check the Enable Key Conversion checkbox.

    ![Image](https://i.imgur.com/no6ekJC.png)

3. Click on any text element.

    ![Image](https://i.imgur.com/KJ1Z7zS.png)

Now, notice the red border; when you type, you will be using the colemak layout!

>**NOTE**: The earliest version of this extension does not work on all text elements. Please keep in mind this is a work in progress.

## Choosing a Project Structure

Here is the project directory structure I used in my project:

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

## Using the Model View Controller (MVC) Architecture

I always build my unit tests along side my business login; therefore, I divide the code in a way that makes it easy to test. This is where MVC comes in. I divided my code logically into `model.js`, `view.js`, and `controller.js`, which creates a clean separation of responsibilities.

The `Model` class manages the conversion of the keystrokes to colemak, and the `View` class manages keeping the view updated based on the state of the `Model`. The heavy lifting is done in the `controller.js` in a function called `convertToColemak`, which converts the incoming key presses and inserts colemak-converted keys inte the textbox.

```javascript
function convertToColemak(event) {
  if (!Model.isActive || event.ctrlKey || event.altKey || event.metaKey) return;
  const colemakKey = Model.keyboardLayout[event.key];
  if (colemakKey) {
    event.preventDefault();
    let input = event.target;
    let handled = false;
    while (input) {
      if (input.isContentEditable) {
        document.execCommand("insertText", false, colemakKey);
        handled = true;
        break;
      } else if (input.tagName === "INPUT" || input.tagName === "TEXTAREA") {
        const start = input.selectionStart;
        const newValue =
          input.value.slice(0, start) +
          colemakKey +
          input.value.slice(input.selectionEnd);
        input.value = newValue;
        input.setSelectionRange(start + 1, start + 1);
        handled = true;
        break;
      }
      input = input.parentNode;
    }
    if (!handled) {
      document.execCommand("insertText", false, colemakKey);
    }
  }
}
```

[Here](https://github.com/boonecabaldev/To-Colemak/tree/dev) is the rest of the code for the project. I used *GitHub CoPilot* to generate pretty much everything else.

>**NOTE:** I recommend checking out my article *[How to Rapidly Build Browser Extensions With AI](https://dev.to/boonecabal/how-to-rapidly-build-browser-extensions-with-ai-1ml6)* for an example of building browser extensions purely through AI prompt writing.

## Building Unit Tests

Now, let's move on to the unit tests.

Before I could create my unit tests, I had us install `jest` on my computer. The irritating challenge I faced was doing it on Windows.

### Setting Up The Development Environment

Here is the process I used to get my environment set up for unit testing:

1. Installed [Microconda](https://www.anaconda.com/docs/getting-started/miniconda/main) from Windows installer.

2. **From Anaconda Prompt (not VS Code Git Bash Terminal)** used `conda` to install `npm` in new `conda` virtual environment.

  ```bash
  conda create -n venv nodejs
  ```

3. Used `npm` to install `jest`.

  ```bash
  npm install --save-dev jest
  ```

### Running the Tests

The tests in `model.test.js` that test the `Model` class to basic tests of each method. The tests in `view.test.js` that test the `View` class are more complex, as they need to confirm the UI is updated depending on the state of the `Model`.

Here is an example of a test in `view.test.js`:

```javascript
  test("handleFocus does not set borderColor if Model is inactive", () => {
    Model.isActive = false;
    const input = document.createElement("input");
    View.handleFocus({ target: input });
    expect(input.style.borderColor).toBe("");
  });
```

As you can see from this `View` test, the `handleFocus` function only sets a border color if the extension is active. The test needs to confirm this.

>**NOTE**: These are very basic and don't cover all cases.

## Running the Tests

Once built, you can run your test files using `npx jest --verbose`.

```shell
(venv) C:\Users\unity1\dev\To-Colemak>npx jest --verbose
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

## Installing the Extension

Now, we want to install and test the extension by using it. Here are the instructions on how to install a browser extension for each browser.

**Google Chrome / Brave / Microsoft Edge (Chromium-based Browsers):**

1.  **Open your browser.**
2.  **Go to the Web Store:**
    * For Chrome/Brave: Navigate to the Chrome Web Store (chrome.google.com/webstore).
    * For Edge: Navigate to the Microsoft Edge Add-ons store (microsoftedge.microsoft.com/addons).
3.  **Search for the Extension:** Use the search bar in the store to find the extension you want to install.
4.  **Select the Extension:** Click on the extension's listing in the search results.
5.  **Add to Browser:** Click the "Add to Chrome" (or "Add to Brave," "Get") button.
6.  **Confirm Installation:** A pop-up will appear, showing the permissions the extension requires. Review them carefully and click "Add extension" to confirm.
7.  **Pin (Optional):** After installation, a puzzle piece icon (Extensions button) will usually appear in your browser's toolbar. Click it, find the newly installed extension, and click the pin icon next to it to make it visible on your toolbar.

**Mozilla Firefox:**

1.  **Open Firefox.**
2.  **Go to the Add-ons Store:** Navigate to Firefox Browser ADD-ONS (addons.mozilla.org).
3.  **Search for the Extension:** Use the search bar to find the extension.
4.  **Select the Extension:** Click on the extension's listing.
5.  **Add to Firefox:** Click the "Add to Firefox" button.
6.  **Confirm Installation:** A pop-up will appear showing the permissions. Review them and click "Add."
7.  **Enable (Optional):** You might be asked if you want to allow the extension to run in Private Windows. Choose your preference and click "Okay, Got It." The extension icon should appear in your Firefox toolbar.

**Apple Safari:**

1.  **Open Safari.**
2.  **Access Extensions Preferences:**
    * Go to the Safari menu in the top left corner of your screen.
    * Select "Safari Extensions..." This will open the App Store to the Safari Extensions section.
3.  **Find the Extension:** Browse or search for the extension you want. Safari extensions are typically standalone apps from the App Store.
4.  **Install the Extension App:** Click "Get" or "Buy" (if it's a paid extension) to download the extension application.
5.  **Enable in Safari Preferences:**
    * Once installed, go to `Safari > Settings` (or `Preferences` on older macOS versions).
    * Click on the "Extensions" tab.
    * Find the newly installed extension in the list and check the box next to its name to enable it.
6.  **Configure (Optional):** Some extensions might have a separate application you need to open to configure its settings.

## Testing the Extension

When you run the extension, confirm the extension does the following:

1. Shows overlay message when you activate extension.
2. Border of textbox with focus is highlighted red when extension is active.
3. Conversion to colemak works. Optionally test using both QWERTY and Dvorak.

## Conclusion

In this article, we've walked through the development of a browser extension designed to bring the Colemak keyboard layout to environments where system-level changes are restricted. We explored the core functionality, the MVC architecture that structures the code, and the process of setting up a testing environment with Jest.

This "To-Colemak" extension demonstrates a practical solution to a common problem, leveraging browser capabilities to enhance user experience. Whether you're a Colemak enthusiast, a budding extension developer, or just curious about how such tools are built, I hope this guide has been insightful.

Feel free to explore the [project repository](https://github.com/boonecabaldev/To-Colemak/tree/dev), try out the extension, and perhaps even contribute to its ongoing development. Happy typing!
