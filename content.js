let isActive = false;
let currentOverlay = null; // Track the current overlay

const dvorakToColemak = {
  "'": "q", ",": "w", ".": "f", "p": "p", "y": "g",
  "f": "j", "g": "l", "c": "u", "r": "y", "l": ";",
  "a": "a", "o": "r", "e": "s", "u": "t", "i": "d",
  "d": "h", "h": "n", "t": "e", "n": "i", ";": "z",
  "q": "x", "j": "c", "k": "v", "x": "b", "b": "k",
  "m": "m", "s": "o", "-": "'", "/": "[", "=": "]",
  "[": "-", "]": "=", "w": ",", "v": ".", "z": "/"
};

// QWERTY to Colemak key mapping
const qwertyToColemak = {
  "q": "q", "w": "w", "e": "f", "r": "p", "t": "g",
  "y": "j", "u": "l", "i": "u", "o": "y", "p": ";",
  "[": "[", "]": "]", "a": "a", "s": "r", "d": "s",
  "f": "t", "g": "d", "h": "h", "j": "n", "k": "e",
  "l": "i", ";": "o", "'": "'", "z": "z", "x": "x",
  "c": "c", "v": "v", "b": "b", "n": "k", "m": "m",
  ",": ",", ".": ".", "/": "/"
};

let keyboardLayout = qwertyToColemak; // Default to Dvorak to Colemak mapping

// Handle focus & blur
function handleFocus(event) {
  if (isActive) {
    event.target.style.borderColor = 'red';
    //event.target.style.backgroundColor = 'lightyellow';
  }
}
function handleBlur(event) {
  if (isActive) {
    event.target.style.borderColor = '';
    //event.target.style.backgroundColor = '';
  }
}

// Convert Dvorak to Colemak
function dvorakToColemakConversion(event) {
  if (!isActive || event.ctrlKey || event.altKey || event.metaKey) return;

  const colemakKey = keyboardLayout[event.key];
  if (colemakKey) {
    event.preventDefault();
    let input = event.target;
    let handled = false; // Flag to track if we've handled the conversion

    // Try to find the actual input element
    while (input) {
      if (input.isContentEditable) {
        document.execCommand("insertText", false, colemakKey);
        handled = true;
        break;
      } else if (input.tagName === "INPUT" || input.tagName === "TEXTAREA") {
        const start = input.selectionStart;
        const newValue = input.value.slice(0, start) + colemakKey + input.value.slice(input.selectionEnd);
        input.value = newValue;
        input.setSelectionRange(start + 1, start + 1);
        handled = true;
        break;
      }
      input = input.parentNode; // Move up the DOM tree
    }

    if (!handled) {
      document.execCommand("insertText", false, colemakKey);
    }
  }
}

// Show toggle message
function showToggleMessage(message) {
  // If there's an existing overlay, remove it
  if (currentOverlay) {
    clearTimeout(currentOverlay.fadeTimeout); // Clear any pending fadeout
    document.body.removeChild(currentOverlay);
  }

  const overlay = document.createElement('div');
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
  currentOverlay = overlay; // Store the current overlay

  // Fade in
  setTimeout(() => {
    overlay.style.opacity = 1;
  }, 10);

  // Fade out
  overlay.fadeTimeout = setTimeout(() => { // Store the timeout ID
    overlay.style.opacity = 0;
    setTimeout(() => {
      if (currentOverlay === overlay) { // Only remove if it's still the current one
        document.body.removeChild(overlay);
        currentOverlay = null;
      }
    }, 500); // Wait for fade out
  }, 2500); // Total display time
}

// Toggle with Ctrl + L
function toggleFeature(event) {
  if (event.ctrlKey && event.key === "l") {
    event.preventDefault();
    isActive = !isActive;
    console.log(`Dvorak-to-Colemak & Highlighting: ${isActive ? "ON" : "OFF"}`);

    showToggleMessage(isActive ? "COLEMAK ON" : "COLEMAK OFF");

    // Update input styles based on isActive
    document.querySelectorAll('input, textarea').forEach(input => {
      if (isActive) {
        input.addEventListener('focus', handleFocus);
        input.addEventListener('blur', handleBlur);
        input.style.borderColor = '';
        input.style.backgroundColor = '';
        if (input === document.activeElement) {
          input.style.borderColor = 'red';
          //input.style.backgroundColor = 'lightyellow';
        }
      } else {
        input.removeEventListener('focus', handleFocus);
        input.removeEventListener('blur', handleBlur);
        input.style.borderColor = '';
        //input.style.backgroundColor = '';
      }
    });
  }
}

// Listen for messages from `background.js`
chrome.runtime.onMessage.addListener((message) => {
  if (message.action === "showDialog") {
    alert("Dialog Placeholder: You can add UI here.");
  }
});

document.addEventListener('keydown', toggleFeature);
document.addEventListener('keydown', dvorakToColemakConversion);

// Apply initial event listeners
document.querySelectorAll('input, textarea').forEach(input => {
  input.addEventListener('focus', handleFocus);
  input.addEventListener('blur', handleBlur);
});
