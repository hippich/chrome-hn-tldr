CommentView = Backbone.View.extend({
  initialize: function() {
    var comment_el   = this.$el;
    var comment_id;
    var comment_link = comment_el.find("a:contains('link')").eq(0);

    if (comment_link.length > 0) {
      comment_id = comment_link.attr('href').replace(/.+id=(\d+)/, "$1");
    }

    var comment_user = comment_el.find("a[href^='user?id=']").text();

    // Get and clean comment html
    var comment_html = comment_el.find(".comment").clone();
    comment_html.find("p:last").remove();
    comment_html = comment_html.html();

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
    $("p:last font", comment_el).append(" | <a href='#' class='it-is-tldr' alt='It is tl;dr'><span class='tldr-count'></span><span class='tldr-title'>tl;dr</span></a> ");

    // Render it!
    this.render();

    // Hook model change events
    _.bindAll(this, 'render');
    this.model.bind('change:tldrs', this.render);

    return true;
  },

  render: function() {
    if (this.model.get('tldrs') > 0) {
      this.$el.find('.tldr-count').text( this.model.get('tldrs') + ' ' );
    }
    else {
      this.$el.find('.tldr-count').text('');
    }
  },

  events: {
    'click .it-is-tldr': 'do_tldr'
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

    el.append("<div class='top-tldr' />");
    var url_title = $("a", el).text();
    var url_href = $("a", el).attr('href');
    var url_id;
   
    if (this.options.comments_el) {
      url_id = el.parents('tbody').eq(0).find('tr:eq(1) a[href^="item?id="]').attr('href').replace(/.+id=(\d+)/, "$1");
    }
    else {
      url_id = el.parents('tr').eq(0).next().find('a[href^="item?id="]').attr('href').replace(/.+id=(\d+)/, "$1");
    }

    var m = new Post({ 
      id: url_id,
      url: url_href,
      url_title: url_title
    });

    m.fetch();

    if (this.options.comments_el) {
      var post = this;

      $("tr td.default", this.options.comments_el).each(function() {
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

    // Render it!
    //this.render();

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



