(() => {
  // for accessing YT controls
  let youtubeRightControls;
  // for accessing YT Player ;
  let youtubePlayer;
  let currentVideo = " ";
  let currentVideoBookmarks = [];

  // Listen to that messages that are coming from background.js
  chrome.runtime.onMessage.addListener((obj, sender, response) => {
    const { type, value, videoId } = obj;

    if (type === "NEW") {
      currentVideo = videoId;
      // console.log(videoId);
      newVideoLoaded();
    }
  });

  // fetch the bookmarks using promise
  // we are checking our current video is exist in bookmark or in the storage else return empty array
  const fetchBookMark = () => {
    return new Promise((resolve) => {
      chrome.storage.sync.get([currentVideo], (obj) => {
        resolve(obj[currentVideo] ? JSON.parse(obj[currentVideo]) : []);
      });
    });
  };

  // adding bookmark button to YouTube video
  const newVideoLoaded = async () => {
    // Bookmark Button
    const bookmarkBtnExists =
      document.getElementsByClassName("bookmark-btn")[0];

    // hiding miniplayer for my extension video
    const miniPlayer = document.getElementsByClassName(
      "ytp-miniplayer-button"
    )[0];

    currentVideoBookmarks = await fetchBookMark();
    if (!bookmarkBtnExists) {
      const bookmarkBtn = document.createElement("img");
      bookmarkBtn.src = chrome.runtime.getURL("images/bookmark.png");
      bookmarkBtn.className = "ytp-button" + "bookmark-btn";
      bookmarkBtn.title = "Click This For TimeStamp";
      bookmarkBtn.style.height = "32px";
      bookmarkBtn.style.marginBottom = "8px";
      // hiding miniplayer
      miniPlayer.style.display = "none";

      youtubeRightControls =
        document.getElementsByClassName("ytp-right-controls")[0];
      youtubePlayer = document.getElementsByClassName("video-stream")[0];

      youtubeRightControls.appendChild(bookmarkBtn);
      bookmarkBtn.addEventListener("click", addNewBookMarkEventHandler);
    }
  };

  const addNewBookMarkEventHandler = async () => {
    // currentTime is give current Time
    const currentTime = youtubePlayer.currentTime;
    const newBookmark = {
      time: currentTime,
      desc: `Bookmark at ${getTime(currentTime)}`,
    };

    currentVideoBookmarks = await fetchBookMark();
    // set sync with chrome storage
    chrome.storage.sync.set({
      [currentVideo]: JSON.stringify(
        [...currentVideoBookmarks, newBookmark].sort((a, b) => a.time - b.time)
      ),
    });
    // console.log(newBookmark);
  };
})();

// Get the time
const getTime = (time) => {
  let date = new Date(0);
  date.setSeconds(time);

  return date.toISOString(), substr(11, 8);
};
