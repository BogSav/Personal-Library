'use strict';

module.exports = function (app) {
  let mongoose = require('mongoose');

  mongoose.connect(
    process.env["MONGO_URI"],
    { useNewUrlParser: true, useUnifiedTopology: true}
  );

  const bookSchema = new mongoose.Schema({
    comments : [String],
    title : String,
    commentcount: Number
  });

  let Book = mongoose.model('Book', bookSchema);

  app.route('/api/books')
    .get(function (req, res){
      Book.find({}, (err, data) => {
        if(err)
          return console.error(err);
        return res.json(data);
      });
    })
    
    .post(function (req, res){
      let title = req.body.title;
      if(title == null || title == "")
        return res.send("missing required field title");
      let document = Book({
        title : title,
        comments : [],
        commentcount : 0
      });
      document.save((err, data) => {
        if(err)
          return console.error(err);
        return res.json(data);
      });
    })
    
    .delete(function(req, res){
      Book.deleteMany({}, (err, data) => {
        if(err)
          return console.error(err);
        return res.send('complete delete successful');
      });
    });



  app.route('/api/books/:id')
    .get(function (req, res){
      let bookid = req.params.id;
      Book.findById(bookid, (err, book) => {
        if(err || !book)
          return res.send("no book exists");
        return res.json(book);
      });
    })
    
    .post(function(req, res){
      let bookid = req.params.id;
      let comment = req.body.comment;
      if(comment == null || comment == "")
        return res.send('missing required field comment');
      Book.findById(bookid, (err, book) => {
        if(err || !book)
          return res.send('no book exists');
        book.comments.push(comment);
        book.commentcount++;
        book.save((err, data) => {
          if(err)
            return console.error(err);
          return res.json(data);
        });
      });
    })
    
    .delete(function(req, res){
      let bookid = req.params.id;
      Book.findByIdAndRemove(bookid, {useFindAndModify : false}, (err, data) => {
        if(err || !data)
          return res.send("no book exists");
        return res.send("delete successful");
      });
    });
  
};
