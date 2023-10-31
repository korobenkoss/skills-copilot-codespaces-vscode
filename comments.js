// Create web server

// Import modules
var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var Comment = require('./models/comment');

// Create web server
var app = express();

// Connect to MongoDB
mongoose.connect('mongodb://localhost/comment');

// Configure app
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(__dirname + '/public'));

// Configure router
var router = express.Router();

// Middleware
router.use(function(req, res, next) {
  console.log('Something is happening.');
  next();
});

// Test route
router.get('/', function(req, res) {
  res.json({ message: 'Welcome to the comment api!' });
});

// Comments route
router.route('/comments')

  // Create a comment
  .post(function(req, res) {
    var comment = new Comment();
    comment.name = req.body.name;
    comment.body = req.body.body;
    comment.save(function(err) {
      if (err)
        res.send(err);
      res.json({ message: 'Comment created!' });
    });
  })

  // Get all comments
  .get(function(req, res) {
    Comment.find(function(err, comments) {
      if (err)
        res.send(err);
      res.json(comments);
    });
  });

// Single comment route
router.route('/comments/:comment_id')

  // Get the comment with that id
  .get(function(req, res) {
    Comment.findById(req.params.comment_id, function(err, comment) {
      if (err)
        res.send(err);
      res.json(comment);
    });
  })

  // Update the comment with that id
  .put(function(req, res) {
    Comment.findById(req.params.comment_id, function(err, comment) {
      if (err)
        res.send(err);
      comment.name = req.body.name;
      comment.body = req.body.body;
      comment.save(function(err) {
        if (err)
          res.send(err);
        res.json({ message: 'Comment updated!' });
      });
    });
  })

  // Delete the comment with that id
  .delete(function(req, res) {
    Comment.remove({
      _id: req.params.comment_id
    }, function(err, comment) {
      if (err)
        res.send(err);
      res.json({ message: 'Successfully deleted' });
    });
  });

// Register routes
app.use('/api