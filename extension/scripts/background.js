function checkUrl (url) {
  return url.match(/http?:\/\/turntable\.fm\/([\w-]+)/);
}
function showIcon (tabId, changeInfo, tab) {
  if (changeInfo.status == 'complete' && checkUrl(tab.url)) {
    chrome.pageAction.show(tabId);
  }
}
chrome.tabs.onUpdated.addListener(showIcon);