// --- Model ---
const Model = {
  isActive: false,
  keyboardLayout: null,
  dvorakToColemak: {
    "'": "q",
    ",": "w",
    ".": "f",
    p: "p",
    y: "g",
    f: "j",
    g: "l",
    c: "u",
    r: "y",
    l: ";",
    a: "a",
    o: "r",
    e: "s",
    u: "t",
    i: "d",
    d: "h",
    h: "n",
    t: "e",
    n: "i",
    ";": "z",
    q: "x",
    j: "c",
    k: "v",
    x: "b",
    b: "k",
    m: "m",
    s: "o",
    "-": "'",
    "/": "[",
    "=": "]",
    "[": "-",
    "]": "=",
    w: ",",
    v: ".",
    z: "/",
  },
  qwertyToColemak: {
    q: "q",
    w: "w",
    e: "f",
    r: "p",
    t: "g",
    y: "j",
    u: "l",
    i: "u",
    o: "y",
    p: ";",
    "[": "[",
    "]": "]",
    a: "a",
    s: "r",
    d: "s",
    f: "t",
    g: "d",
    h: "h",
    j: "n",
    k: "e",
    l: "i",
    ";": "o",
    "'": "'",
    z: "z",
    x: "x",
    c: "c",
    v: "v",
    b: "b",
    n: "k",
    m: "m",
    ",": ",",
    ".": ".",
    "/": "/",
  },
  // Set the keyboard layout based on user preference
  // "dvorak" or "qwerty"
  setLayout(layout) {
    this.keyboardLayout =
      layout === "dvorak" ? this.dvorakToColemak : this.qwertyToColemak;
  },
  // Set the active state and save it to storage
  // This will also update the checkbox in the popup
  setActive(active) {
    this.isActive = active;
    chrome.storage.sync.set({ isActive: active });
  },
  // Load the state from storage
  // This will also set the initial layout based on user preference
  load() {
    chrome.storage.sync.get(["isActive", "layout"], (data) => {
      this.isActive = !!data.isActive;
      this.setLayout(data.layout === "dvorak" ? "dvorak" : "qwerty");
      View.updateHighlight();
    });
  },
};

// --- View ---
const View = {
  currentOverlay: null,
  handleFocus(event) {
    if (Model.isActive) {
      event.target.style.borderColor = "red";
    }
  },
  handleBlur(event) {
    if (Model.isActive) {
      event.target.style.borderColor = "";
    }
  },
  updateHighlight() {
    if (
      Model.isActive &&
      document.activeElement &&
      (document.activeElement.tagName === "INPUT" ||
        document.activeElement.tagName === "TEXTAREA" ||
        document.activeElement.isContentEditable)
    ) {
      document.activeElement.style.borderColor = "red";
    }
  },
  showToggleMessage(message) {
    if (this.currentOverlay) {
      clearTimeout(this.currentOverlay.fadeTimeout);
      document.body.removeChild(this.currentOverlay);
    }
    const overlay = document.createElement("div");
    overlay.textContent = message;
    overlay.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background-color: rgba(0, 0, 0, 0.7);
      color: white;
      padding: 10px 20px;
      border-radius: 5px;
      font-size: 24px;
      font-weight: bold;
      opacity: 0;
      transition: opacity 0.5s;
      z-index: 10000;
    `;
    document.body.appendChild(overlay);
    this.currentOverlay = overlay;
    setTimeout(() => {
      overlay.style.opacity = 1;
    }, 10);
    overlay.fadeTimeout = setTimeout(() => {
      overlay.style.opacity = 0;
      setTimeout(() => {
        if (this.currentOverlay === overlay) {
          document.body.removeChild(overlay);
          this.currentOverlay = null;
        }
      }, 500);
    }, 2500);
  },
};

// --- Controller / Main logic ---
function dvorakToColemakConversion(event) {
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

function toggleFeature(event) {
  if (event.ctrlKey && event.key === "l") {
    event.preventDefault();
    Model.setActive(!Model.isActive);
    View.showToggleMessage(Model.isActive ? "COLEMAK ON" : "COLEMAK OFF");
    document.querySelectorAll("input, textarea").forEach((input) => {
      if (Model.isActive) {
        input.addEventListener("focus", View.handleFocus);
        input.addEventListener("blur", View.handleBlur);
        input.style.borderColor = "";
        if (input === document.activeElement) {
          input.style.borderColor = "red";
        }
      } else {
        input.removeEventListener("focus", View.handleFocus);
        input.removeEventListener("blur", View.handleBlur);
        input.style.borderColor = "";
      }
    });
    chrome.runtime.sendMessage({
      action: "updateCheckbox",
      isActive: Model.isActive,
    });
  }
}

// Listen for messages
chrome.runtime.onMessage.addListener((message) => {
  if (message.action === "toggleFeature") {
    Model.setActive(!Model.isActive);
    View.showToggleMessage(Model.isActive ? "COLEMAK ON" : "COLEMAK OFF");
  }
  if (message.action === "setLayout") {
    Model.setLayout(message.layout);
  }
});

// On load
Model.load();

document.addEventListener("keydown", toggleFeature);
document.addEventListener("keydown", dvorakToColemakConversion);

document.querySelectorAll("input, textarea").forEach((input) => {
  input.addEventListener("focus", View.handleFocus);
  input.addEventListener("blur", View.handleBlur);
});
