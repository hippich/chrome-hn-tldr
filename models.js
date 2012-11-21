Comment = Backbone.Model.extend({
  defaults: {
    comment: "",
    tldrs: 0
  },
  initialize: function() {
  },
  tldr_inc: function(m) {
    this.set( 'tldrs', this.get('tldrs') + 1 );
  }
});

/* Post = Backbone.RelationalModel.extend({
  relations: [{
    type: Backbone.HasMany,
    key: 'comments',
    relatedModel: 'Comment',
    collectionType: 'CommentCollection',
  }],
  initialize: function() {
    this.on("change:tldrs", function() {
    });
  }
}); */

