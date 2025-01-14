chrome.storage.local.set({
  'darkmodeFlag': 0
});
chrome.runtime.onMessage.addListener(
  function(request, sender,sendResponse) {
    if (request.type === 'captureScreenshot') {
      const imageData = request.image;
      const caption = `Just solved a GeeksforGeeks problem: ${request.problemTitle}. Check out my solution on GitHub! #GeeksforGeeks`;

      
      (async () => {
        try {
            const result = await postToTwitter(imageData, caption);
            sendResponse({ success: true, data: result });
        } catch (error) {
            sendResponse({ success: false, error: error.message });
        }
    })();

          sendResponse({status: true}); // Indicates an async response
  }
      if (request.type == 'getUserSolution') {
        chrome.scripting.executeScript({
          target: {tabId: sender.tab.id},
          files: ['scripts/extractCode.js'],
          world: 'MAIN',
        });
        sendResponse({status: true});
      }

      if ( request.type == 'deleteNode' ) {
        chrome.scripting.executeScript({
          target: {tabId: sender.tab.id},
          files: ['scripts/nodeDeletion.js'],
          world: 'MAIN',
        });
        sendResponse({status: true});
      }

      if (request && request.removeCurrentTab === true && request.AuthenticationSuccessful === true) {
        chrome.storage.local.set({ githubUsername: request.githubUsername }, () => {});
        chrome.storage.local.set({ githubAccessToken: request.accessToken }, () => {});
        chrome.storage.local.set({ pipeFlag: false }, () => {});
        const indexURL = chrome.runtime.getURL('index.html');
        chrome.tabs.create({ url: indexURL, active: true });
      }

      else if (request && request.removeCurrentTab === true && request.AuthenticationSuccessful === false) {
        console.log('Couldn\'t Authenticate your GitHub Account. Please try again later!');
      }
  }
);

const postToTwitter = async (image, caption) => {
  try {
      // First, upload the media
      const mediaUploadResponse = await fetch('https://upload.twitter.com/1.1/media/upload.json', {
          method: 'POST',
          headers: {
              'Authorization': 'AAAAAAAAAAAAAAAAAAAAAHVRyAEAAAAAUelhdZEo71NFC8FWDHf%2FgdYIDbk%3DHuokBdYBEmmXYIYylBtuZVueP5xpPT1nnXKgEME9FNJr6TLQes',
              'Content-Type': 'multipart/form-data'
          },
          body: (() => {
              const formData = new FormData();
              // Convert base64 image to blob
              const imageBlob =  fetch(image).then(r => r.blob());
              formData.append('media', imageBlob);
              return formData;
          })()
      });

      if (!mediaUploadResponse.ok) {
          throw new Error('Failed to upload media');
      }

      const mediaData = await mediaUploadResponse.json();

      // Then create the tweet with the media
      const tweetResponse = await fetch('https://api.twitter.com/2/tweets', {
          method: 'POST',
          headers: {
              'Authorization': 'AAAAAAAAAAAAAAAAAAAAAHVRyAEAAAAAUelhdZEo71NFC8FWDHf%2FgdYIDbk%3DHuokBdYBEmmXYIYylBtuZVueP5xpPT1nnXKgEME9FNJr6TLQes',
              'Content-Type': 'application/json'
          },
          body: JSON.stringify({
              text: caption,
              media: {
                  media_ids: [mediaData.media_id_string]
              }
          })
      });

      if (!tweetResponse.ok) {
          throw new Error('Failed to create tweet');
      }

      return await tweetResponse.json();
  } catch (error) {
      console.error('Twitter API Error:', error);
      throw error;
  }
};