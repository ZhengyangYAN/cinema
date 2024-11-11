import dotenv from "dotenv"
dotenv.config()
process.env.CONNECTION_STR = "mongodb+srv://heisen:jKl2ZvJCO7gDRpYM@cluster0.zc7ly8d.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"

if(!process.env.CONNECTION_STR){
    console.log("CONNECTION_STR is not defined")
    process.exit(1)
}

export default {
    CONNECTION_STR: process.env.CONNECTION_STR
}