$(function() {
  _.each(['autoexpand'], function(id) {
    var v = localStorage['options-' + id ];

    if (v == 'yes') {
      $(".tldr-options input#" + id).attr("checked", "checked");
    }
    else if (v == 'no') {
      $(".tldr-options input#" + id).removeAttr("checked");
    }

    $(".tldr-options input#" + id).parent().click(function() {
      if ($('input', this).attr('checked')) {
        localStorage['options-' + id ] = "yes";
      }
      else {
        localStorage['options-' + id ] = "no";
      }
    });
  });
});
