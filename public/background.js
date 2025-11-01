// Load Plugin on Click
chrome.action.onClicked.addListener(() => {
  chrome.tabs.create({ url: chrome.runtime.getURL("index.html") });
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "capture") {
    chrome.tabs.captureVisibleTab(null, { format: "png" }, (image) => {
      if (chrome.runtime.lastError) {
        console.error("Capture failed:", chrome.runtime.lastError.message);
        sendResponse({ success: false });
        return;
      }

      console.log("✅ Image captured successfully!");
      sendResponse({ success: true, image });
    });
    return true; // keep the sendResponse open for async use
  }
});
