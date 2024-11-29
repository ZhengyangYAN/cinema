//YAN Zhengyang 21104095d, ZHOU Yutong 22098552d
import express from 'express'
import multer from 'multer'
import fs from 'fs/promises'
import Router from 'express'
import client from "./db.js"
const router = Router();
import {ObjectId} from 'mongodb'

const form = multer();

async function getUnavailable(name){
    try{
        const data = await client.db("Cinema").collection("seats").findOne({
            name: name
        })
        return (data.unavailable)
    }
    catch(err){
        return false
    }
}
router.post("/", async function(req,res){
    form.none
    if(!req.session.userStatus.user.username){
        res.status(401).json({
            "message":"Login status expired, please login again."
        })
    }
    const username = req.session.userStatus.user.username
    const data = await getUnavailable(req.body.name)
    const selected = JSON.parse(req.body.seatIndex)
    for(let i in selected){
        if(!data.includes(selected[i])) data.push(selected[i])
    }
    try{
        await client.db("Cinema").collection("seats").updateOne(
            {
                name: req.body.name
            },
            {
                "$set":{unavailable:data}
            }
        )
    }
    catch(err){
        res.status(401).json({
            "message":"Error, Please try again."
        })
    }
    try{
        await client.db("Cinema").collection("transactions").insertOne({
            orderNum : req.body.orderNum,
            title: req.body.title,
            seatIndex: JSON.parse(req.body.seatIndex),
            venue: req.body.venue,
            timeslot: req.body.timeslot,
            name: req.body.name,
            fname: req.body.fname,
            email: req.body.email,
            address: req.body.address,
            city: req.body.city,
            seatInfo: JSON.parse(req.body.seatInfo),
            state :req.body.state,
            zip:req.body.zip,
            totalPrice: req.body.totalPrice,
            status:"paied",
            time:Date.now(),
            userId : req.session.userStatus.user.id,
            username:username
        })
        res.json({
            "status":"success"
        })
    }
    catch(err){
        res.status(401).json({
            "message":"Error, Please try again."
        })        
    }
    
})
router.post("/history", async function(req, res){
    try{
        const history = await client.db("Cinema").collection("transactions").find(
            {userId:req.body.id}
        ).toArray()
        res.json(history)
    }
    catch(err){
        res.status(401).json({
            "message":"Error, Please try again."
        })
    }
})
router.get("/all-history", async function(req, res){
    try{
        const history = await client.db("Cinema").collection("transactions").find(
        ).toArray()
        res.json(history)
    }
    catch(err){
        res.status(401).json({
            "message":"Error, Please try again."
        })
    }
})
export default router