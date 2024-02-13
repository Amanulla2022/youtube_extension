import { getCurrentTabURL } from "./utils.js";

// adding a new book mark row to the popup
const addNewBookmark = (bookmarksElement, bookmark) => {
  const bookmarkTitleElement = document.createElement("div");
  const newBookmarkElement = document.createElement("div");

  // control elements
  const controlsElement = document.createElement("div");

  bookmarkTitleElement.textContent = bookmark.desc;
  bookmarkTitleElement.className = "bookmark-title";

  controlsElement.className = "bookmark-controls";

  // unique ID for individual bookmark
  newBookmarkElement.id = `bookmark-${bookmark.time}`;
  newBookmarkElement.className = "bookmark";
  newBookmarkElement.setAttribute("timestamp", bookmark.time);

  setBookmarkAttributes("play", onPlay, controlsElement);
  setBookmarkAttributes("delete", onDelete, controlsElement);

  newBookmarkElement.appendChild(bookmarkTitleElement);
  newBookmarkElement.appendChild(controlsElement);
  bookmarksElement.appendChild(newBookmarkElement);
};

const viewBookmarks = (currentBookmarks = []) => {
  const bookmarksElement = document.getElementById("bookmarks");
  bookmarksElement.innerHTML = "";

  if (currentBookmarks.length >= 1) {
    for (let i = 0; i < currentBookmarks.length; i++) {
      const bookmark = currentBookmarks[i];
      addNewBookmark(bookmarksElement, bookmark);
    }
  } else {
    bookmarksElement.innerHTML =
      ' <i class="row">Ab sahi page pe aagaya Bhai :)</i> ';
  }
};

const setBookmarkAttributes = (src, eventListener, controlParentElement) => {
  const controlElement = document.createElement("img");
  controlElement.src = `images/${src}.png`;
  controlElement.title = src;
  controlElement.addEventListener("click", eventListener);
  controlParentElement.appendChild(controlElement);
};

const onPlay = async (event) => {
  const bookmarkTime =
    event.target.parentNode.parentNode.getAttribute("timestamp");

  const activeTab = await getCurrentTabURL();

  chrome.tabs.sendMessage(activeTab.id, {
    type: "PLAY",
    value: bookmarkTime,
  });
};

const onDelete = async (event) => {
  const bookmarkTime =
    event.target.parentNode.parentNode.getAttribute("timestamp");
  const activeTab = await getCurrentTabURL();

  const bookmarkElementToDlete = document.getElementById(
    `bookmark-${bookmarkTime}`
  );

  bookmarkElementToDlete.parentNode.removeChild(bookmarkElementToDlete);

  chrome.tabs.sendMessage(
    activeTab.id,
    {
      type: "DELETE",
      value: bookmarkTime,
    },
    viewBookmarks
  );
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
      '<div class="title"><p> Ye youtube page nahi hai bhai chalaja :)</p> <img class="not-yt-image" src="images/ye-nahi-chalega.png" alt="dummy image" /></div>';
  }
});
