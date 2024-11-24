import express from 'express'
import multer from 'multer'
import fs from 'fs/promises'
import Router from 'express'
import client from "./db.js"
const router = Router();
import {ObjectId} from 'mongodb'

const form = multer();

router.post("/", async function(req,res){
    form.none
    try{
        const seats = JSON.parse(req.body.seats)
        client.db("Cinema").collection("transactions").insertOne({
            user:"",
            title: req.body.title,
            timeslot: req.body.timeslot,
            ticketNo: req.body.ticketNo,
            seats: seats
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