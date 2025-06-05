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
document.addEventListener("keydown", convertToColemak);

document.querySelectorAll("input, textarea").forEach((input) => {
  input.addEventListener("focus", View.handleFocus);
  input.addEventListener("blur", View.handleBlur);
});

// For Node/testing
if (typeof require !== "undefined") {
  var { convertToColemak, toggleFeature } = require("./controller.js");
}
