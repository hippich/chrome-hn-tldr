(function() {
  var username = $(".pagetop a[href^='user?id=']").text();

  // Check to see if current user logged in
  if (! username) {
    return;
  }

  // Check to see if user currently on comments page
  if ($(".title a").length != 1) {
    return;
  }

  var title = $(".title a").text();
  var href = $(".title a").attr('href');

  // Make sure title and href is available on this page.
  if (!title || !href) {
    return;
  }

  $("body > center > table > tbody > tr:eq(2) > td > table:eq(1) > tbody > tr td.default").each(function() {
    var comment = new CommentView({ el: $(this) });
  });

})();
