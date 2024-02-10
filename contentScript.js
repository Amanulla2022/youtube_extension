(() => {
  // for accessing YT controls
  let youtubeRightControls, youtubePlayer;
  // for accessing YT Player ;
  let currentVideo = " ";
  // Listen to that messages that are coming from background.js
  chrome.runtime.onMessage.addListener((obj) => {
    const { type, videoId } = obj;

    if (type === "NEW") {
      currentVideo = videoId;
      // console.log(videoId);
      newVideoLoaded();
    }
  });

  // adding bookmark button to YouTube video
  const newVideoLoaded = async () => {
    // Bookmark Button
    const bookmarkBtnExists =
      document.getElementsByClassName("bookmark-btn")[0];

    // hiding miniplayer for my extension video
    const miniPlayer = document.getElementsByClassName(
      "ytp-miniplayer-button"
    )[0];

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
      // bookmarkBtn.addEventListener("click", addNewBookmarkEventHandler);
    }
  };
  newVideoLoaded();
})();
