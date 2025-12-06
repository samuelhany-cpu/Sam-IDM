// Browser extension background script
chrome.downloads.onCreated.addListener((downloadItem) => {
  // Prevent the default browser download
  chrome.downloads.cancel(downloadItem.id);
  
  // Send to Sam Download Manager
  fetch('http://localhost:8765/add-download', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      url: downloadItem.url,
      filename: downloadItem.filename,
      referrer: downloadItem.referrer
    })
  }).then(() => {
    // Show notification
    chrome.notifications.create({
      type: 'basic',
      iconUrl: 'icons/icon48.png',
      title: 'Download Intercepted',
      message: 'File sent to Sam Download Manager'
    });
  }).catch(() => {
    // If app is not running, allow browser download
    chrome.downloads.resume(downloadItem.id);
  });
});

// Listen for manual trigger
chrome.action.onClicked.addListener(() => {
  // Open the app
  fetch('http://localhost:8765/open-app', {
    method: 'POST'
  });
});
