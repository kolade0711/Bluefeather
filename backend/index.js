import express from "express";
import bodyParser from "body-parser";

const app = express();
const port = 3000;

app.use(express.static('public'));
app.set('view engine', 'ejs'); //every res.render, send, sendFile files would automatically be checked with the .ejs ectension
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", function(req, res){
  res.render("index");
});

var posts = [];   //array of journal titles and contents

app.get("/search", (req, res) => {
  const query = req.query.q.toLowerCase();

  const matchedPosts = posts.filter(post =>
    post.title.toLowerCase().includes(query) ||
    post.content.toLowerCase().includes(query)
  );

  res.render("search-results", {query, matchedPosts });
});

app.get("/write", (req, res) => {
  res.render("write")
});

var currentID = 1;

app.post("/submit", (req, res) => {
//when upload is clicked, do the next instructions 
  const newPost = {
    title: req.body.title,
    content: req.body.content,
    id: currentID++,
  };


  posts.push(newPost); 
  res.redirect("/posts");

});

app.get("/posts", (req, res) => {
    res.render("posts", {posts });

});

app.get("/posts/:id", (req, res) =>{
  var post = posts.find(p => p.id == req.params.id);
  if (!post) {
    res.send("Post not found");
  }res.render("view", {post });
  
});

app.post("/posts/:id/delete", (req, res) => {
  posts = posts.filter(p => p.id != req.params.id);
  res.redirect("/posts");
});

app.get("/posts/:id/edit", (req, res) => {
  const post = posts.find(p => p.id == req.params.id);
  if (!post){
    res.send("Post not found");
  }
  res.render("write", {post });
});

app.post("/posts/:id/update", (req, res) => {
  const { title, content } = req.body;
  const post = posts.find(p => p.id == req.params.id);
  if (post) {
    post.title = title;
    post.content = content;
  }
  res.redirect("/posts/" + req.params.id);
});


app.listen(port, () =>{
  console.log(`Server running on port ${port}`);
});

