import express from "express"
import session from "express-session"

import routerLogin from "./login.js"
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
app.use('/images',express.static("images"))
app.use('/',express.static(path)) // Use static files in /static
app.use('/auth',routerLogin)

app.listen(8080)