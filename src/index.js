import express from "express"
import session from "express-session"

import routerLogin from "./login.js"
import routerManagement from "./management.js"
import routerMovie from "./movie.js"
import routerTransaction from "./payment.js"

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
app.get("/",function(req,res){
    res.redirect("/dashboard.html")
})
app.use('/images',express.static("images"))
app.use('/m',express.static("management"))
app.use('/',express.static(path)) // Use static files in /static
app.use('/auth',routerLogin)
app.use('/backend',routerManagement)
app.use('/movie',routerMovie)
app.use('/payment',routerTransaction)
app.listen(8080)