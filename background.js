chrome.extension.onRequest.addListener(
  function(request, sender, sendResponse) {
    if (request.method == "getLocalStorage") {
      sendResponse({ data: localStorage });
    }
    if (request.method == "saveSwitch") {
      localStorage['switch-' + request.id] = request.status;
    }
  }
);
