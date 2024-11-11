import express from "express"
import session from "express-session"
import client from "./db.js"
const app = express()
const path = "static"
app.use(
    session({
        secret:"EIE4432_project",
        resave:false,
        saveUninitialized:false,
        cookie:{httpOnly:true, masAge:60000}
    })
)
app.use(express.json())
app.use(express.urlencoded({
    extended:false
}));
app.use('/',express.static(path),async function(req,res){
    const result = await client.db("Cinema").collection("users").findOne({
        "username":"21104095d"
    })
    console.log(result)
}) // Use static files in /static
app.use('/images',express.static("images"))
app.listen(8080)