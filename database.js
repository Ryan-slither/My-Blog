import sqlite3 from "sqlite3";

const DBSOURCE = "db.sqlite";

const db = new sqlite3.Database(DBSOURCE, (err) => {
    if (err) {
        console.log(err);
        throw err;
    } else {
        console.log("Connected");
        db.run(`CREATE TABLE blogs (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT,
            content TEXT    
        )`, (err) => {
            if (err) {
                console.log("Database Already Created");
            } else {
                console.log("Database Created");
            }
        })
    }
})

export default db;