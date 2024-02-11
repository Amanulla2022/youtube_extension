import { getCurrentTabURL } from "./utils.js";

// adding a new book mark row to the popup
const addNewBookmark = () => {};

const viewBookmarks = (currentBookmarks = []) => {
  const bookmarksElement = document.getElementById("bookmarks");
  bookmarksElement.innerHTML = "";

  if (currentBookmarks.length >= 1) {
    for (let i = 0; i < currentBookmarks.length; i++) {
      const bookmark = currentBookmarks[i];
      addNewBookmark(bookmarksElement, bookmark);
    }
  } else {
    bookmarksElement.innerHTML = ' <i class="row">No bookmarks to show</i> ';
  }
};

document.addEventListener("DOMContentLoaded", async () => {
  // console.log("Loaded go ahead!!!");

  const activeTab = await getCurrentTabURL();
  const queryParameters = activeTab.url.split("?")[1];
  const urlParameters = new URLSearchParams(queryParameters);

  const currentVideo = urlParameters.get("v");

  // If for YouTube video page
  if (activeTab.url.includes("youtube.com/watch") && currentVideo) {
    // get any current video bookmark from current storage
    // we are taking currentVideo as a key
    chrome.storage.sync.get([currentVideo], (data) => {
      const currentVideoBookMmarks = data[currentVideo]
        ? JSON.parse(data[currentVideo])
        : [];

      // to view Bookmarks
      viewBookmarks(currentVideoBookMmarks);
    });
    // Else for other than youtube page
  } else {
    const container = document.getElementsByClassName("container")[0];
    container.innerHTML =
      '<div class="title"> This is not a youtube video page. <img class="not-yt-image" src="images/ye-nahi-chalega.png" alt="dummy image" /></div>';
  }
});
