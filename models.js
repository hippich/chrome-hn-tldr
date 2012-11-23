var hntldrbase = 'http://api.hntldr.com';

Comment = Backbone.RelationalModel.extend({
  defaults: {
    comment: "",
    comment_id: 0,
    tldrs: 0
  },

  initialize: function() {
  },

  url: function() { 
    return hntldrbase + '/hnapi/vote';
  },

  // override backbone synch to force a jsonp call
  sync: function(method, model, options) {
    model.set('url', model.get('post').get('url'));
    model.set('url_title', model.get('post').get('url_title'));

    data = model.toJSON();
    delete data.post;

    // Default JSON-request options.
    var params = _.extend({
      data:        data,
      type:         'POST',
      url:          model.url(),
      processData:  true
    }, options);

    // Make the request.
    return $.ajax(params);
  },

  parse: function(response) {
    // parse can be invoked for fetch and save, in case of save it can be undefined so check before using 
    if (response) {
      if (response.status == 'success' ) {
        return { tldrs: response.votes };
      } 
    }
  }

});

Post = Backbone.RelationalModel.extend({
  relations: [{
    type: 'HasMany',
    key: 'comments',
    relatedModel: 'Comment',
    reverseRelation: {
      key: 'post'
    }
  }],

  initialize: function() {
  },

  url: function() { 
    return hntldrbase + '/hnapi/post';
  },

  // override backbone synch to force a jsonp call
  sync: function(method, model, options) {
    // Default JSON-request options.
    var params = _.extend({
      data:        model.toJSON(),
      type:        'POST',
      url:         model.url(),
      processData: true
    }, options);

    var success = options.success;

    params.success = function(response, status, xhr) {

      // There are some votes available already. Add these to comments
      if (response) {
        if (response.hn_tldr) {
          _.each(response.hn_tldr, function(v, k) {
            var comment = model.get('comments').get(k);

            if (comment) {
             comment.set('tldrs', response.tldr[v].votes);
            }
          });
        }        

        model.set('sorted_tldrs', response.sorted_tldrs);
      } 

      if (success) {
        success(model, response);
      }
    };

    // Make the request.
    return $.ajax(params);
  },

  parse: function(response) {
  }
});

