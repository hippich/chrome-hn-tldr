CommentView = Backbone.View.extend({
  initialize: function() {
    var comment_el   = this.$el;
    var comment_id = comment_el.attr("data-fullname");
    var comment_user = comment_el.find(".tagline .author").eq(0).text();

    // Get and clean comment html
    var comment_html = comment_el.find(".usertext-body").eq(0).html();

    // RelationModel will throw a error if model with duplicate id is added.
    // Just skip it in this case.
    try {
      this.model = new Comment({
        id: comment_id,
        comment: comment_html,
        comment_id: comment_id,
        username: comment_user,
        vote_user: this.options.vote_user,
        votes: 0
      });
    }
    catch (err) {
      return;
    }

    // Add 'tl;dr' button
    $(".buttons", comment_el).eq(0).append("<li><a href='#' class='it-is-tldr' alt='It is tl;dr'><span class='tldr-count'></span><span class='tldr-title'>tl;dr</span></a></li>");

    // Render it!
    this.render();

    // Hook model change events
    _.bindAll(this, 'render');
    this.model.bind('change:tldrs', this.render);

    return true;
  },

  render: function() {
    if (this.model.get('tldrs') > 0) {
      this.$el.find('.tldr-count').eq(0).text( this.model.get('tldrs') + ' ' );
    }
    else {
      this.$el.find('.tldr-count').eq(0).text('');
    }
  },

  events: {
    'click .it-is-tldr:first': 'do_tldr'
  },

  do_tldr: function(e) {
    e.preventDefault();

    // This will trigger call to server to vote for comment and optionaly create whole URL and tldr for it.
    this.model.save();
  }
});

PostView = Backbone.View.extend({
  initialize: function() {
    var el = this.$el;

    el.find("p.tagline").after("<div class='usertext-body'><div class='md top-tldr' /></div>");
    el.find("p.title .domain").before(" <span class='top-tldr-switch'><a href='#'></a></span> ");

    var url_title = $("a.title", el).text();
    var url_href = $("a.title", el).attr('href');
    var url_id = el.attr("data-fullname");
   
    var m = new Post({ 
      id: url_id,
      url: url_href,
      url_title: url_title
    });


    // Hook model change events
    _.bindAll(this, 'render');
    m.bind('change', this.render);

    m.fetch();

    if (this.options.comments_el) {
      var post = this;

      $(".thing", this.options.comments_el).each(function() {
        var comment = new CommentView({ 
          el: $(this),
          vote_user: post.options.vote_user 
        });

        if (comment.model) {
          m.get('comments').add(comment.model);
        }
      });
    }

    this.model = m;
  },

  render: function() {
    var top_tldr = this.model.get('sorted_tldrs')[0].title;
    var id = this.model.get('id');

    if (top_tldr) {

      var hide = false;
      if (storage['switch-' + id] == 'hide' || (! storage['switch-' + id] && ext_options.autoexpand == 'no')) {
        hide = true;
      }

      if (hide) {
        this.$el.find('.top-tldr').hide();
        this.$el.find('.top-tldr-switch a').text("+ show tl;dr");
      }
      else {
        this.$el.find('.top-tldr').show();
        this.$el.find('.top-tldr-switch a').text("- hide tl;dr");
      }

      this.$el.find('.top-tldr').html( 
        markdown.toHTML(top_tldr)
      );
    }
  },

  events: {
    'click .top-tldr-switch a': 'switch_top_tldr'
  },

  switch_top_tldr: function(e) {
    e.preventDefault();

    if ($(".top-tldr", this.$el).is(":visible")) {
      // Hide it
      $(".top-tldr", this.$el).slideUp();
      $('.top-tldr-switch a', this.$el).text("+ show tl;dr");
      chrome.extension.sendRequest({method: "saveSwitch", id: this.model.id, status: 'hide'});
    }
    else {
      // Show it
      $(".top-tldr", this.$el).slideDown();
      $('.top-tldr-switch a', this.$el).text("- hide tl;dr");
      chrome.extension.sendRequest({method: "saveSwitch", id: this.model.id, status: 'show'});
    }
  }

});



