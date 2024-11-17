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


async function validate_user(username, password) {
    try {
      if (!username || !password) return false;
      const users = client.db('lab5db').collection('users');
      const user = await users.findOne({ username, password });
      if (user) {
        return user;
      } else {
        return false;
      }
    } catch (err) {
      console.error('Unable to fetch from database!');
    }
  }
  
  async function update_user(username, password, role, enabled) {
    try {
      const users = client.db('lab5db').collection('users');
      const update = await users.updateOne(
        { username },
        { $set: { username, password, role, enabled } },
        { upsert: true }
      );
      if (update.upsertedCount === 0) {
        console.log('Added 0 user');
      } else {
        console.log('Added 1 user');
      }
      return true;
    } catch (err) {
      console.error('Unable to update the database!');
    }
  }
  
  async function fetch_user(username) {
    try {
      const users = client.db('lab5db').collection('users');
      const user = await users.findOne({ username });
      return user;
    } catch (err) {
      console.error('Unable to fetch from database!');
    }
  }
  
  async function username_exist(username) {
    try {
      const users = client.db('lab5db').collection('users');
      if ((await fetch_user(username)) == null) return false;
      return true;
    } catch (err) {
      console.error('Unable to fetch from database!');
    }
  }

router.post("/register",async function(req,res){
    form.none
    let username = req.body.username;
    let password = req.body.password;
    let role = req.body.role;

  console.log(users);
  if (!username || !password) {
    return res.status(400).json({
      status: 'failed',
      message: 'Missing fields',
    });
  } else if (username.length < 3) {
    return res.status(400).json({
      status: 'failed',
      message: 'Username must be at least 3 characters',
    });
  } else if (username_exist(username)) {
    return res.status(400).json({
      status: 'failed',
      message: `Username '${username}' already exists`,
    });
  } else if (password.length < 8) {
    return res.status(400).json({
      status: 'failed',
      message: 'Password must be at least 8 characters',
    });
  } else {
    if (await update_user(username, password, role))
      return res.json({
        status: 'success',
        user: {
          username: username,
          role: role,
        },
      });
    else
      return res.status(500).json({
        status: 'failed',
        message: 'Account created but unable to save into the database',
      });
  }
})

export default router