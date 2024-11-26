import express from 'express'
import multer from 'multer'
import fs from 'fs/promises'
import Router from 'express'
import client from "./db.js"
const router = Router();
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
          "nickname":result.nickname
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
        try{
            req.body.avatar = req.file.path
            next()
        }
        catch (err){
            console.log(req.body)
            res.status(401).json({
                "status":"error",
                "message":"No image uploaded."
            })
        }
      }
  })
}

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
export default router