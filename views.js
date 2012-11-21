CommentView = Backbone.View.extend({
  initialize: function() {
    var comment_el = this.$el;
    var comment_html = comment_el.find(".comment").html();

    this.model = new Comment({
      comment: comment_html
    });

    // Add 'tl;dr' button
    $("p:last font", comment_el).append(" | <a href='#' class='it-is-tldr' style='color: black; text-style: none !important; background: #ff6600; padding: 1px 2px; border-radius: 3px' alt='It is tl;dr'><span class='tldr-count'></span><span class='tldr-title'>tl;dr</span></a> ");

    // Render it!
    this.render();

    // Hook model change events
    _.bindAll(this, 'render');
    this.model.bind('change:tldrs', this.render);
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
    this.model.tldr_inc();
  }
});


