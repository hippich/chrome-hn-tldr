(function() {

  // Do some class assignments for easier page styling
  $("a[href^='vote?for']").parent('center').parent('td').addClass('voting-controls'); 

  // Get current user username
  var username = $(".pagetop a[href^='user?id=']").text();

  // Check to see if current user logged in
  if (! username) {
    return;
  }

  // We are on individual post comments page
  if ($(".title:has(a)").length == 1) {

    // We are interested only in http(s):// links for now
    if (! $(".title > a:first").attr('href').match(/^http/)) {
      return;
    }

    var el = $(".title > a:first").parent();
    var post = new PostView({ 
      comments_el: el.parents('td').eq(0).find('table:eq(1) > tbody').eq(0),
      vote_user:   username,
      el:          el 
    });

  }

  // We are on page listing many posts without comments (top, new, etc)
  if ($(".title:has(a)").length > 1) {

    $(".title:has(a[href^='http'])").each(function() {
      var el = $(this);

      try {
        var post = new PostView({ 
          vote_user:   username,
          el:          el 
        });
      } catch (e) {}
    });
  }

})();
