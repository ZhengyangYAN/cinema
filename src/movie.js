//YAN Zhengyang 21104095d, ZHOU Yutong 22098552d
import express from 'express'
import multer from 'multer'
import fs from 'fs/promises'
import Router from 'express'
import client from "./db.js"
import {ObjectId} from 'mongodb'
const router = Router();

router.get("/all-movies",async function(req, res){
    var movies
    try{
        movies = await client.db("Cinema").collection("movies").find({ title: { $exists: true } }).toArray()

        res.json(movies)
    }
    catch(err){
        console.log(err)
        res.status(404).json({
            "message":"error please try again"
        })
    }
})
router.post("/movie-detail",async function(req, res){
    var movie
    try{
       
        movie = await client.db("Cinema").collection("movies").findOne({ "_id": ObjectId.createFromHexString(req.body.id)})
        res.json(movie)
    }
    catch(err){
        console.log(err)
        res.status(404).json({
            "message":"Error, please try again"
        })
    }
})
async function getUnavailable(name){
    try{
        var data = await client.db("Cinema").collection("seats").findOne({
            name: name
        })
        
        if(data === null){
            await client.db("Cinema").collection("seats").insertOne({
                name: name,
                unavailable:[]
            })
            data = await client.db("Cinema").collection("seats").findOne({
                name: name
            })
        }
        return (data.unavailable)
    }
    catch(err){
    
        return false
    }
}

router.post("/seat-availability",async function(req,res){
    const data = await getUnavailable(req.body.name)
    
    if(data === false){
        res.status(401).json({
            "message":"Error, Please try again."
        })
    }
    else{
        res.json(data)
    }
})


export default router