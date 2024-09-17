import express from "express";
import bodyParser from "body-parser";
import { dirname } from "path";
import { fileURLToPath } from "url";
import { title } from "process";
const __dirname = dirname(fileURLToPath(import.meta.url));

const app = express();
const port = 3000;
var blogs = [];
var editID = NaN;
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", (req, res) => {
    res.render("index.ejs", {
        homeSelected : true,
        editId: editID,
        blogList : blogs
    });
    console.log(blogs);
})

app.get("/Delete/:id", (req, res) => {
    const blogID = req.params.id;
    console.log(blogID);
    console.log(editID);
    if (blogID < editID) {
        editID = editID - 1;
    }
    blogs.splice(blogID, 1);
    res.render("index.ejs", {
        editId: editID,
        blogList : blogs,
        homeSelected : true
    })
})

app.get("/Edit/:id", (req, res) => {
    editID = req.params.id;
    res.render("index.ejs", {
        homeSelected : true,
        editId: editID,
        blogList : blogs
    });
})

app.post("/Save", (req, res) => {
    var changedBlog = {};
    changedBlog[req.body["editTitle"]] = req.body["editContent"];
    blogs[editID] = changedBlog;
    res.render("index.ejs", {
        homeSelected : true,
        blogList : blogs
    });
    editID = NaN;
})

app.get("/Create", (req, res) => {
    res.render("create.ejs", {
        createSelected : true
    });
})

app.post("/Create/Submit", (req, res) => {
    if (req.body.button === "createButton") {
        var newBlog = {};
        newBlog[req.body["title"]] = req.body["content"];
        blogs.push(newBlog);
        console.log("Created");
    } else if (req.body.button === "clearButton") {
        req.body["title"] = "";
        req.body["content"] = "";
        console.log("Cleared");
    }
    res.redirect("/Create");
})

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
  });