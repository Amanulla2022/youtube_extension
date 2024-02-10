/* 
    Here listen to any updates in our tab system and
    find the most recent tab or current tab and see if its
    YouTube Page or other page
 */

// Listner for tabs [we have used tabs in permission]
chrome.tabs.onUpdated.addListener(async (tabId, tab) => {
  // Checking that the tab url is of youtube or not
  if (tab.url && tab.url.includes("youtube.com/watch")) {
    // unique id for each parameter
    const queryParameters = tab.url.split("?")[0];
    // URLSearchParams its a interface to work with URL
    const urlParameters = new URLSearchParams(queryParameters);
    // console.log(urlParameters);
    chrome.tabs.sendMessage(tabId, {
      // type of the event
      type: "NEW",
      //   id of video
      videoId: urlParameters.get("v"),
    });
  }
});
