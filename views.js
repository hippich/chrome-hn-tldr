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
    var url_title = $("a.title", el).text();
    var url_href = $("a.title", el).attr('href');
    var url_id = el.attr("data-fullname");
   
    var m = new Post({ 
      id: url_id,
      url: url_href,
      url_title: url_title
    });

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

    // Hook model change events
    _.bindAll(this, 'render');
    this.model.bind('change', this.render);
  },

  render: function() {
    this.$el.find('.top-tldr').html( 
      markdown.toHTML(this.model.get('sorted_tldrs')[0].title)
    );
  },

  events: {
    //'click .it-is-tldr': 'do_tldr'
  }

});



