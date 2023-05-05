const express = require("express");
const app = express();

const port = 3000;

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

/*post requests*/
let titlesArray=[];
let postContentArray=[];
app.post("/",(req,res)=>{
    let postTitle=req.body.postTitle;
    let postContent=req.body.postContent;
    titlesArray.push(postTitle);
    postContentArray.push(postContent);

    res.render("home",{titles:titlesArray,posts:postContentArray});
})
/*get requests*/

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
  res.render("home",{titles:titlesArray,posts:postContentArray});
});
/*Listening on selected port*/
app.listen(process.env.PORT || port, () => {
  console.log("Server is up and running");
});
