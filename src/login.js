//YAN Zhengyang 21104095d, ZHOU Yutong 22098552d
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
router.post("/login",async function(req,res){
    form.none
    var result = new Object()
    req.session.logged = false
    req.session.save()
    try{
      result = await client.db("Cinema").collection("users").findOne({
              "username":req.body.username,
              "password":req.body.encryptedPassword
          })
    }
    catch(err){
      res.status(401).json({
        "status":"fail",
        "message":"Error, try again later"
      })
      return
    }
    if(result){
      const userStatus = {
        "status":"success",
        "user":{
          "username":result.username,
          "role":result.role,
          "avatarUrl":result.avatarUrl,
          "birthday":result.birthday,
          "gender":result.gender,
          "email":result.email,
          "nickname":result.nickname,
          "id":result._id
        }
      }
      req.session.logged = true
      req.session.userStatus = userStatus
      req.session.loginTime = Date.now()
      req.session.save()
      res.json(userStatus)
    }
    else{
        res.status(401).json({
            "status":"failed",
            "message":"Incorrect username or password."
        })
    }
})

function uploadFile(req, res, next){
    
  var upload = form.single("avatar")
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
                  req.body.avatar = req.file.path
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
router.post("/update",uploadFile,async function(req,res){
  
  try{
    await client.db("Cinema").collection("users").updateOne({
        "_id" : ObjectId.createFromHexString(req.body.id)
      },{
        "$set":{
          "username":req.body.username,
          "role": req.body?.role ?? "user",
          "gender": req.body.gender,
          "nickname": req.body.nickname,
          "email": req.body.email,
          "avatarUrl": req.body?.avatar ?? req.body.currentAvatar
        }
      })
      
      res.json({
        status:"success"
      })
      req.session.destroy()
  }
  catch (err){
    console.log(err)
    res.status(401).json({
      "status":"fail",
      "message":"Error, try again later"
    })
  }
})
router.post("/manage-user",uploadFile,async function(req,res){
  
  try{
    await client.db("Cinema").collection("users").updateOne({
        "_id" : ObjectId.createFromHexString(req.body.id)
      },{
        "$set":{
          "username":req.body.username,
          "role": req.body?.role ?? "user",
          "gender": req.body.gender,
          "nickname": req.body.nickname,
          "email": req.body.email,
          "avatarUrl": req.body?.avatar ?? req.body.currentAvatar
        }
      })
      
      res.json({
        status:"success"
      })
  }
  catch (err){
    res.status(401).json({
      "status":"fail",
      "message":"Error, try again later"
    })
  }
})
router.post("/register",uploadFile,async function(req,res){
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
      "role":"user",
      "nickname":req.body.nickname,
      "avatarUrl":req.body.avatar
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

router.get("/me",async function(req,res){
  if(req.session.logged){
    res.json(req.session.userStatus)
  }
  else{
    res.status(401).json({
      status:"fail",
      message:"User is not logged in."
    })
  }
})
router.get("/logout",async function(req,res){
  req.session.destroy()
  res.end()
})
router.post("/password",async function(req,res){
  try{
    await client.db("Cinema").collection("users").updateOne(
      {username:req.body.username},
    {"$set":{password:req.body.encryptedPassword}})
    req.session.destroy()
    res.end()
  }
  catch(err){
    res.status(401).json({
      status:"fail",
      message:"Error, please try again."
    })
  }
  
})
router.post("/user", async function(req, res){
  try{
    const data = await client.db("Cinema").collection("users").findOne({
      _id : ObjectId.createFromHexString(req.body.id)
    })
    res.json(data)
  }
  catch(err){
    res.status(401).json({
      status:"fail",
      message:"Error, please try again."
    })
  }
})
export default router