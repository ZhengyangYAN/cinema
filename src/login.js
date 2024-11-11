import express from 'express'
import multer from 'multer'
import fs from 'fs/promises'
import Router from 'express'
import client from "./db.js"
const router = Router();
const form = multer();

router.post("/login",async function(req,res){
    form.none
    const result = await client.db("Cinema").collection("users").findOne({
        "username":req.body.username,
        "password":req.body.encryptedPassword
    })
    if(result){
        res.json({
            "status":"success",
            "username":result.username
        })
    }
    else{
        res.status(401).json({
            "status":"failed",
            "message":"Incorrect username or password."
        })
    }
})

export default router