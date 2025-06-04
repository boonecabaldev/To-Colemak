document.addEventListener("DOMContentLoaded", function () {
  // Set initial state of checkbox from storage, default to false
  chrome.storage.sync.get("isActive", function (data) {
    document.getElementById("toggleActive").checked = !!data.isActive;
  });

  // Handle checkbox toggle
  document
    .getElementById("toggleActive")
    .addEventListener("change", function () {
      // Send message to content script to toggle feature (same as Ctrl+L)
      chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        chrome.tabs.sendMessage(
          tabs[0].id,
          { action: "toggleFeature" },
          function (response) {
            // Ignore errors if no content script is present
            if (chrome.runtime.lastError) {
              // Optionally log: console.warn(chrome.runtime.lastError.message);
            }
          }
        );
      });
    });

  // Handle layout select
  document
    .getElementById("layoutSelect")
    .addEventListener("change", function () {
      chrome.storage.sync.set({ layout: this.value });
      chrome.tabs.query(
        { active: true, currentWindow: true },
        function (tabs) {
          chrome.tabs.sendMessage(
            tabs[0].id,
            { action: "setLayout", layout: this.value },
            function (response) {
              if (chrome.runtime.lastError) {
                // Optionally log: console.warn(chrome.runtime.lastError.message);
              }
            }
          );
        }.bind(this)
      );
    });

  // Set dropdown to saved value
  chrome.storage.sync.get("layout", function (data) {
    if (data.layout) {
      document.getElementById("layoutSelect").value = data.layout;
    }
  });

  // Ensure isActive is set to false by default if not present
  chrome.storage.sync.get("isActive", function (data) {
    if (typeof data.isActive === "undefined") {
      chrome.storage.sync.set({ isActive: false });
    }
  });
});

chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  if (message.action === "updateCheckbox") {
    document.getElementById("toggleActive").checked = !!message.isActive;
  }
});
