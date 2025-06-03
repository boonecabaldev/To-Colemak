
# Building a Flashy Chrome Extension—With GitHub Copilot as My Pair Programmer

Recently, I set out to build a Chrome extension that converts keyboard input from QWERTY or Dvorak to Colemak, complete with a slick popup UI, real-time toggling, and visual feedback. To accelerate development and ensure code quality, I collaborated with GitHub Copilot as my AI programming assistant. Here’s how Copilot helped me move from idea to working, tested extension—fast.

## Basic Features

Let's look at the steps you take in order to use this extension to activate the colemak keyboard layout.

First, type something into a textbox. It should work normally.

![Click inside of textbox](https://i.imgur.com/DHG1biz.png)

Next, click on the To-Colemak extension icon, and then check the Enable Key Conversion checkbox.

![Click the keyboard icon](https://i.imgur.com/VWIUAeS.png)

Finally, click back onto the textbox. You will notice it is highlighted.

![Check the Enable Key Conversion checkbox](https://i.imgur.com/KJ1Z7zS.png)

Now when you type, you will be using the colemak layout!

Alternatively, you can use the keyboard shortcut `Ctrl+L` to toggle the extension on and off.

## Work Flow

I wanted to build a plugin with the following requirements:

- Uses simple MVC.
- Jest unit tests for both model and view.
- Add one feature at a time; adhere to the GitHub workflow: `main` -> `dev` -> `new-feat-1`, `new-feat-2`, etc.
- Finish in one day.

## From Idea to Architecture

I started with a rough idea and some feature goals. Copilot helped me quickly scaffold the project, suggesting a clean separation of concerns with `model.js` for state and mapping logic, `view.js` for UI feedback, and `content.js` for the controller logic. For example, when I asked Copilot how to share variables between files in a Chrome extension, it generated this manifest snippet:

```json
"content_scripts": [
  {
    "matches": ["<all_urls>"],
    "js": ["model.js", "view.js", "content.js"]
  }
]
```

This ensured my Model and View objects were available globally, solving a classic Chrome extension pain point.

## Solving Real Problems With Real Code

Whenever I hit a roadblock, Copilot was there with practical code. For instance, when I wanted to let users toggle the key conversion feature from the popup or with `Ctrl+L`, Copilot generated this event handler:

```javascript
document.getElementById('toggleActive').addEventListener('change', function () {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        chrome.tabs.sendMessage(
            tabs[0].id,
            { action: "toggleFeature" }
        );
    });
});
```

And when I needed to keep the popup’s checkbox in sync with keyboard toggling, Copilot suggested a message listener:

```javascript
chrome.runtime.onMessage.addListener(function(message) {
    if (message.action === "updateCheckbox") {
        document.getElementById('toggleActive').checked = !!message.isActive;
    }
});
```

## Bulk Git Commands—No Problem

Copilot wasn’t just helpful with JavaScript. When I needed to manage branches efficiently, it provided clear, bulk git command sequences. For example, to merge a feature branch and clean up:

```sh
git checkout dev
git merge new-feat-3
git push origin dev

git branch -d new-feat-3
git push origin --delete new-feat-3
```

This let me focus on coding, not searching for the right git incantations.

## Testing, the Easy Way

I wanted to ensure my Model and View logic was robust, so I asked Copilot for unit test examples. It generated Jest tests for both, including how to mock Chrome’s storage API and the DOM:

```javascript
test('setActive updates isActive and persists', () => {
    Model.setActive(true);
    expect(Model.isActive).toBe(true);
    expect(global.chrome.storage.sync.set).toHaveBeenCalledWith({ isActive: true });
});
```

And for the View:

```javascript
test('handleFocus sets borderColor to red if active', () => {
    const input = document.createElement('input');
    View.handleFocus({ target: input });
    expect(input.style.borderColor).toBe('red');
});
```

## Conclusion

With Copilot’s help, I was able to:

- Architect my extension cleanly
- Solve Chrome extension quirks quickly
- Write robust, tested code
- Manage git branches efficiently

If you want to build something fast, with fewer headaches and more confidence, I highly recommend pairing with GitHub Copilot. It’s like having an expert on call, 24/7.
