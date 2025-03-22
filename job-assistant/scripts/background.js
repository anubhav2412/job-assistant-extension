chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "showNotification") {
      console.log("Received message:", message);
      chrome.notifications.create({
        type: "basic",
        iconUrl: chrome.runtime.getURL("icons/notification.png"), // Ensure this path exists
        title: message.title || "Job Assistant",
        message: message.message || "A job was found.",
        priority: 2
      }, (notificationId) => {
        if (chrome.runtime.lastError) {
          console.error("Notification error:", chrome.runtime.lastError.message);
        } else {
          console.log("Notification created with ID:", notificationId);
        }
      });
    }
  });