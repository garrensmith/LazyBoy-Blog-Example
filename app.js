var Model = require('lazyboy');
/**
 * Module dependencies.
 */

var express = require('express');

var app = module.exports = express.createServer();

// Configuration

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(require('stylus').middleware({ src: __dirname + '/public' }));
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));

  Model.create_connection('lz-blog');
  Model.load('models');
});

app.configure('development', function(){
  Post = Model('Post');
  
  var author = Author.create({name: "Garren"});

  /*Post.create({title: "Test1", content: "My 1st blog post", date: Date.now(), author: author, comments:[]}).save();
  Post.create({title: "Test2", content: "My 2nd blog post", date: Date.now(), author: author,comments:[]}).save();
  Post.create({title: "Test3", content: "My 3rd blog post", date: Date.now(), author: author,comments:[]}).save();*/


  app.use(express.errorHandler({ dumpExceptions: true, showStack: true })); 
});

app.configure('production', function(){
  app.use(express.errorHandler()); 
});

// Routes

app.get('/', function(req, res){
  var Post = Model('Post');

  Post.all(function (err, posts) {
    res.render('index', {
      posts: posts
    });
  });
});

app.get('/post/:url', function (req, res) {
 var Post = Model('Post');
 Post.where("url",req.params.url, function (err, posts) {
     res.render('post', {post: posts[0]});
 });
});

app.post('/post/:id/comment', function (req, res) {
  console.log("received");
  Post.find(req.params.id, function (err, post) {
    if (err) throw err;
    console.dir(req.body);
    var Comment = Model('Comment');
    post.comments.push(Comment.create(req.body));
    post.save(function (err, saved_doc) {
      if (err) return res.send("failed to save");

      res.send("comment saved");
    });

  });

});

app.listen(3000);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
