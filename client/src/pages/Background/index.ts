/// <reference types="chrome"/>
import { API_BASE_URL } from '../../config';

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'INITIATE_AUTH') {
    fetch(`${API_BASE_URL}/auth/${message.service}/authorize`)
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          window.location.href = data.authUrl;
        } else {
          sendResponse({ success: false, error: data.error });
        }
      })
      .catch(error => {
        sendResponse({ success: false, error: error.message });
      });
    return true;
  }
}); 