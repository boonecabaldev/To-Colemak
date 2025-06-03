
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
