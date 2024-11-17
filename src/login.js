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
router.post("/register",async function(req,res){
  form.none
  var check = null
  try{
    check = await client.db("Cinema").collection("users").findOne({
        "username":req.body.username
      })
  }
  catch (err){
    res.status(401).json({
      "status":"fail",
      "message":"Error, try again later"
    })
    return
  }
  if(check){
    res.status(401).json({
      "status":"fail",
      "message":"Username has existed, Please try others."
    })
    return
  }
  var result = new Object()
  try{
    result = await client.db("Cinema").collection("users").insertOne({
      "username":req.body.username,
      "password":req.body.encryptedPassword,
      "email":req.body.email,
      "gender":req.body.gender,
      "birthday":req.body.birthday,
      "role":"user"
    })
  }
  catch(err){
    res.status(401).json({
      "status":"fail",
      "message":"Error, try again later"
    })
    return
  }
  
  if(result.acknowledged){
    res.json({
      "status":"success",
      "user":{
        "username":req.body.username,
        "role":"user"
      }
    })
  }
  else{
    res.status(401).json({
      "status":"fail",
      "message":"Error, try again later"
    })
  }
})
export default router