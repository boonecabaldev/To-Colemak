# Changing Keyboard Layouts - Let's Build a Browser Extension

### Introduction

Some people have to use computers with restricted privileges. For instance, you may not be able to install anything, or perhaps you're unable to access the settings to change your keyboard layout to Colemak. In this article, I'm going to share a browser extension I'm developing that allows you to switch from your current layout (qwerty or Dvorak) to Colemak.

## Prerequisites

This article assumes the reader has a basic understanding of HTML/CSS/JavaScript and a very rough understanding of building browser extensions. Here are some articles I recommend checking out:

- Basic HTML/CSS/JS article
- Dude's browser extension article
- My last browser extension article

## This is how it works

1. Click the extension icon.
2. Check the Enable Key Conversion checkbox.
3. Click on any text element
4. Notice the red border and conversion of keys to the Coleman layout

## Using the Model View Controller (MVC) Architecture

I plan on unit testing from the outset; therefore, I divide the code in a way that makes it easy to test. This is where MVC comes in. I divided my code logically into `model.js`, `view.js`, and `controller.js`. Clean separation of responsibilities.

Here is the project structure:

```markdown
📂 doc
  📄 article.md
  📄 article2.md
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

>**NOTE**: the code at the end of model view controller files lets you export.

## Building Unit Tests

Let's take a look at our unit tests.

### Setting Up The Development Environment

Here is the process I used to get my environment set up for unit testing:

1. Installed microconda.
2. Used `conda` to install `npm`.
3. Used `npm` to install `jest`.

### Running the Tests

```javascript
// model tests

// view tests
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
