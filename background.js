// Listen for installation
chrome.runtime.onInstalled.addListener(() => {
  console.log("Interactive Sprite Character extension installed");
});

// Listen for extension icon click
chrome.action.onClicked.addListener((tab) => {
  // Check if the URL is injectable (not chrome://, chrome-extension://, etc.)
  if (!tab.url.startsWith('chrome://') && 
      !tab.url.startsWith('chrome-extension://') && 
      !tab.url.startsWith('devtools://') &&
      !tab.url.startsWith('edge://') &&
      !tab.url.startsWith('about:')) {
    
    // Use scripting API to inject the content script directly
    chrome.scripting.executeScript({
      target: {tabId: tab.id},
      files: ['content.js']
    }).then(() => {
      console.log("Content script injected successfully");
    }).catch(error => {
      console.error("Error injecting content script:", error);
    });
  } else {
    console.log("Cannot inject script into this page. Try a regular webpage instead.");
    // Open a new regular webpage instead
    chrome.tabs.create({
      url: "https://www.google.com"
    });
  }
}); 