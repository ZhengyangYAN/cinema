import express from 'express'
import multer from 'multer'
import fs from 'fs/promises'
import Router from 'express'
import client from "./db.js"
const router = Router();
const form = multer();

router.post("/create",async function(req,res){
    form.none
    console.log(req.body)
})
export default router