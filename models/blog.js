var Model = require('lazyboy');

var Comment = Model.define('Comment',{ username: String
                       , msg: String });

Author = Model.define('Author', {name: String});

var Post = Model.define('Post',{title:String
                    , content: String
                    , date: Date
                    , url: String
                    //, author: {hasOne: Author}
                    //, comments: {hasMany: Comment}
                    });

// TODO: make this beforeCreate once that has been implemented
Post.beforeSave(function( post) {
  post.url = post.title.split(" ").join("-");
  
});
