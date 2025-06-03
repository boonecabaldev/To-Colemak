document.getElementById("toggle").addEventListener("click", () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id, { action: "toggleConversion" });
    });
  });
  
  document.getElementById('layoutSelect').addEventListener('change', function() {
    chrome.storage.sync.set({ layout: this.value });
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
      chrome.tabs.sendMessage(tabs[0].id, { action: "setLayout", layout: this.value });
    }.bind(this));
  });
  
  // On popup load, set dropdown to saved value
  chrome.storage.sync.get('layout', function(data) {
    if (data.layout) {
      document.getElementById('layoutSelect').value = data.layout;
    }
  });
