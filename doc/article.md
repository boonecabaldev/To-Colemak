# Changing Keyboard Layouts - Let's Build a Browser Extension

### Introduction

Some people have to use computers with restricted privileges. For instance, you may not be able to install anything, or perhaps you're unable to access the settings to change your keyboard layout to Colemak. In this article, I'm going to share a browser extension I'm developing that allows you to switch from your current layout (qwerty or Dvorak) to Colemak.

You can find the repository [here](https://github.com/boonecabaldev/To-Colemak/tree/dev).

## Prerequisites

This article assumes the reader has a basic understanding of HTML/CSS/JavaScript and a very rough understanding of building browser extensions. Here are some articles I recommend checking out:

- Basic HTML/CSS/JS article
- Dude's browser extension article
- My last browser extension article

## This is how it works

1. Click the extension icon.
2. Check the Enable Key Conversion checkbox..
3. Click on any text element.
4. Notice the red border and conversion of keys to the colemak layout.

## Project Structure

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

I plan on unit testing from the outset; therefore, I divide the code in a way that makes it easy to test. This is where MVC comes in. I divided my code logically into `model.js`, `view.js`, and `controller.js`. Clean separation of responsibilities.

The `Model` class manages the conversion of the keystrokes to colemakw and the `View` class manages keeping the view updated based on the state of the `Model`. The heavy lifting is done in the `controller.js` in a function called `convertToColemak`, which converts the incoming key presses and inserts colemak-converted keys inte the textbox.

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

>**NOTE**: the code at the end of model view controller files lets you export.

## Building Unit Tests

Let's take a look at our unit tests.

### Setting Up The Development Environment

Here is the process I used to get my environment set up for unit testing:

1. Installed microconda.
2. Used `conda` to install `npm`.
3. Used `npm` to install `jest`.

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

Once built, you can run your test files using `npm test`.

```text
$ npm test

> test
> jest --verbose

 PASS  tests/model.test.js
  Model
    √ setLayout sets QWERTY mapping (9 ms)                                                                                                                            
    √ setLayout sets Dvorak mapping (1 ms)                                                                                                                            
    √ setActive updates isActive and persists (2 ms)                                                                                                                  
    √ load sets state from storage (1 ms)                                                                                                                             
                                                                                                                                                                      
 PASS  tests/view.test.js
  View
    √ handleFocus sets borderColor to red if active (15 ms)
    √ handleBlur resets borderColor if active (1 ms)
    √ updateHighlight highlights active input (7 ms)
    √ showToggleMessage creates and removes overlay (49 ms)
    √ handleFocus does not set borderColor if Model.isActive is false (1 ms)
    √ typing in textbox converts keys to Colemak when Model.isActive is true (6 ms)

Test Suites: 2 passed, 2 total
Tests:       10 passed, 10 total
Snapshots:   0 total
Time:        9.073 s
Ran all test suites.
```

These are very basic and don't cover all cases. It could take a while to perfect these.

I run the tests with `npm test` or `npx jest`

## Installing the Extension

[Instructions]

## Testing the Extension

When you run the extension, test it for the following:

1. Shows overlay message when you activate extension.
2. Uextbox border appears when the extension is active.
3. Conversion from qwerty and Dvorak works.
