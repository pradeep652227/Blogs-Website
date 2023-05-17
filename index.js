const express = require("express");
const app = express();

const port = 3000;

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

const alert=require('alert');
/*mongoose require and connect*/
const mongoose=require('mongoose');
mongoose.connect("mongodb+srv://ps652227:pardeep978@cluster0.wdvs1nn.mongodb.net/blog-website");

const blogSchema=new mongoose.Schema({//Schema defined
  title:{type:String, unique:true},
  blogContent:String
});
const Blog=new mongoose.model("blog",blogSchema);//model created

/*Add blogs*/
app.post("/",(req,res)=>{
    let postTitle=req.body.postTitle;
    postTitle=postTitle.charAt(0).toUpperCase() + postTitle.slice(1);//1st letter capitalised
    console.log(postTitle);
    let postContent=req.body.postContent;

    Blog.create({//new blog post
      title:postTitle,
      blogContent:postContent
    })
    .then(result=>{
      console.log("Blog post added with title= "+result.title);
      res.redirect("/");
    })
    .catch(err=>{
      console.log("Error in creating the blog post= "+err);
      alert("Error in creating the blog post= "+err);
    });
})
/*get requests*/

app.get("/posts/:postID",(req,res)=>{//custom blog page
   let title=req.params.postID;
   console.log("Title in custom route is "+title);
   title=title.toLowerCase();
   let idx=0,flag=0;
   Blog.find({})//get all the blogs
       .then(result=>{
        if(result){//there is at-least 01 blog
          for(idx;idx<result.length;idx++){
            let blog=result[idx];
            let blogTitle=blog.title.toLowerCase();
            if(title==blogTitle){
              flag=1;
              break;
            }
          }
          if(flag==1)//render the custom blog page
          res.render("post",{post:result[idx]});
          else{
            console.log("No such blog post exists");
            alert("No such blog post exists for title= "+title);
            res.redirect("/");
          }
        }else{//no blogs are there 
          console.log("No blog posts are there");
          alert("Sorry, there are no blog posts in our database. Your query- "+title);
          res.redirect("/");
        }
       })
       .catch(err=>{
        console.log("Error in retrieving the blogs for your query. Error="+err);
        alert("Error in retrieving the blogs in finding the blog"+err);
       });
});

app.get("/compose",(req,res)=>{
    res.render("compose");
})
app.get("/contact-us",(req,res)=>{
    res.render("contact");
});
app.get("/about-us", (req, res) => {
  res.render("about");
});
app.get("/", (req, res) => {
  Blog.find({})//get all the blogs
      .then(result=>{
        console.log("blogs are:- "+result.title);
        if(result){//there are elements
          res.render("home",{blogs:result});
        }else{
          res.render("home",{blogs:[]});
        }
      })
      .catch(err=>{
        console.log("Error in retrieving the blogs "+err);
        alert("Error in retrieving the blogs "+err);
      });
});
/*Listening on selected port*/
app.listen(process.env.PORT || port, () => {
  console.log("Server is up and running");
});
