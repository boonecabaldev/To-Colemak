chrome.action.onClicked.addListener((tab) => {
    chrome.windows.getCurrent((window) => {
      const position = {
        top: window.top + 50,
        left: window.left + window.width - 450
      };
      chrome.tabs.sendMessage(tab.id, { action: "showDialog", position: position });
    });
  });
  