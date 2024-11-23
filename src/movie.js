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
export default router