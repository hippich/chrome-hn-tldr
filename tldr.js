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
  if ($(".title a").length == 1) {

    // We are interested only in http(s):// links for now
    if (! $(".title a").attr('href').match(/^http/)) {
      return;
    }

    var el = $(".title a").parent();
    var post = new PostView({ 
      comments_el: el.parents('td').eq(0).find('table:eq(1) > tbody').eq(0),
      vote_user:   username,
      el:          el 
    });

  }

  // We are on page listing many posts without comments (top, new, etc)
  if ($(".title a").length > 1) {

    $(".title a").each(function() {
      // We are interested only in http(s):// links for now
      if (! $(this).attr('href').match(/^http/)) {
        return;
      }

      var el = $(this).parent();
      var post = new PostView({ 
        vote_user:   username,
        el:          el 
      });
    });
  }

})();
