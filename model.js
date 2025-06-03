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
