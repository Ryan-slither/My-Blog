import express from "express";
import bodyParser from "body-parser";
import { dirname } from "path";
import { fileURLToPath } from "url";
import db from "./database.js";

const __dirname = dirname(fileURLToPath(import.meta.url));

let blogs = [];
let editID = NaN;
const app = express();
const port = 3000;
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", (req, res) => {
    db.all("SELECT * FROM blogs", (err, rows) => {
        if (err) {
            console.log(err);
            throw err;
        } else {
            blogs.splice(0, blogs.length);
            rows.forEach(row => {
                blogs.push({ [row.title]: row.content, blogId: row.id });
            });
            console.log("Loading Blogs");
            console.log(blogs);
            res.render("index.ejs", {
                homeSelected : true,
                editId: editID,
                blogList : blogs
            });
        }
    });
})

app.get("/Delete/:id", (req, res) => {
    const deleteId = parseInt(req.params.id);
    console.log(deleteId);
    blogs.forEach(blog => {
        if (blog.blogId === deleteId) {
            db.run("DELETE FROM blogs WHERE id = (?)", [deleteId]);
        }
    })
    res.redirect("/");
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
    db.run("UPDATE blogs SET title = ?, content = ? WHERE id = ?", [req.body["editTitle"], req.body["editContent"], editID]);
    editID = NaN;
    res.redirect("/");
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
        db.run("INSERT INTO blogs (title, content) VALUES (?, ?)", [req.body["title"], req.body["content"]], (err) => {
            if (err) {
                console.log(err);
                throw err;
            } else {
                console.log("Blog Inserted");
            }
        });
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