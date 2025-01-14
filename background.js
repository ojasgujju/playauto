// background.js
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    try {
      if (message.type === 'ACTION_RECORDED') {
        // Handle message
        sendResponse({success: true});
      }
    } catch (err) {
      console.error('Error handling message:', err);
      sendResponse({success: false, error: err.message});
    }
    return true; // Keep message channel open for async response
  });
  