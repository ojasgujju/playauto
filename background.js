// background.js
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === 'ACTION_RECORDED') {
    console.log('Action recorded:', request.action);
    // Handle the recorded action here
    sendResponse({ status: 'ok' });
  }
  return true; // Keep message channel open for async response
});
