// This is hack to get whole localStorage from extension scope
var storage = {};
var ext_options = {};

chrome.extension.sendRequest({method: "getLocalStorage"}, function(response) {
  storage = response.data;
  ext_options = {
    autoexpand: storage['options-autoexpand']
  };
});

(function() {

  if (! $("body").hasClass("loggedin")) {
    return;
  }

  // Get current user username
  var username = $("#header-bottom-right .user a").text();

  // Check to see if current user logged in
  if (! username) {
    return;
  }

  // We are on individual post comments page
  if ($("body").hasClass('comments-page')) {

    // We are interested only in http(s):// links for now
    if (! $(".entry a.title").attr('href').match(/^http/)) {
      return;
    }

    var el = $(".content .linklisting .thing");
    var post = new PostView({ 
      comments_el: $(".content .commentarea .sitetable"),
      vote_user:   username,
      el:          el 
    });

  }

  // We are on page listing many posts without comments (top, new, etc)
  if ($("body").hasClass('listing-page')) {

    $(".linklisting > .thing").each(function() {
      // We are interested only in http(s):// links for now
      if (! $("a.title", this).attr('href').match(/^http/)) {
        return;
      }

      var post = new PostView({ 
        vote_user:   username,
        el:          this 
      });
    });
  }

})();
