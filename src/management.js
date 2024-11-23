import express from 'express'
import multer from 'multer'
import fs from 'fs/promises'
import Router from 'express'
import client from "./db.js"
const router = Router();
import {ObjectId} from 'mongodb'
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'images/')
    },
    filename: function (req, file, cb) {
      var singfileArray = file.originalname.split('.');
      var fileExtension = singfileArray[singfileArray.length - 1];
      cb(null, singfileArray[0] + '-' + Date.now() + "." + fileExtension);
      console.log(file);
    }
})
const form = multer({
    storage:storage
});
router.post("/create",uploadFile,async function(req,res){
    form.none
    try{
        const slots = JSON.parse(req.body.slots)
        client.db("Cinema").collection("movies").insertOne({
            poster:req.body.poster,
            slots:slots,
            description:req.body.description,
            grade: Number(req.body.grade),
            title: req.body.title,
            duration: Number(req.body.duration),
            release: req.body.release,
            price:Number(req.body.price),
            genres: req.body.genres
        })
        res.json({
            "message":"success created."
        })
    }
    catch (err){
        res.status(404).json({
            "message":err
        })
    }

})
router.post("/manage-movie",uploadFile, async function(req,res){
    form.none
    const slots = JSON.parse(req.body.slots)
    try{
        await client.db("Cinema").collection("movies").updateOne(
            {"_id":  ObjectId.createFromHexString(req.body.id)},
            { 
                "$set":{
                    poster:req.body.isImg == '1' ? req.body.poster : req.body.imgUrl,
                    slots:slots,
                    description:req.body.description,
                    grade: Number(req.body.grade),
                    title: req.body.title,
                    duration: Number(req.body.duration),
                    release: req.body.release,
                    price:Number(req.body.price),
                    genres: req.body.genres
                }
            }
        )

        res.json({
            "status":"success",
            "message":"success update."
        })
    }
    catch(err){
        console.log(err)
        res.status(404).json({
            "message":err
        })
    }
})
function uploadFile(req, res, next){
    
    var upload = form.single("poster")
    upload(req,res, function(err){
        if(err){
            res.status(401).json({})
        }
        else{
            if(req.body.isImg == '0'){
                next()
            }
            else{
                try{
                    req.body.poster = req.file.path
                    next()
                }
                catch (err){
                    console.log(req.body)
                    if(req.body.isImg == '0'){
                        next()
                    }
                    res.status(401).json({
                        "status":"error",
                        "message":"No image uploaded."
                    })
                }
            }
        }
    })
}
export default router