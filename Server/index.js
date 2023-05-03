import express from "express";              //Since we have written "type":"module" in our package.json we don't need to use require keyword we can go for import.
import bodyParser from "body-parser";
const {urlencoded}=bodyParser
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv"
import multer from "multer";
import helmet from "helmet"
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from "url";
import exp from "constants";

/*CONFIGURATIONS */
const __filename=fileURLToPath(import.meta.url)
const __dirname=path.dirname(__filename)
dotenv.config()

const app=express()
app.use(express.json())
app.use(helmet())
app.use(helmet.crossOriginResourcePolicy({policy:'cross-origin'}))
app.use(morgan("common"))
app.use(bodyParser.json({limit:"30mb",extended:true}))
app.use(urlencoded({limit:"30mb",extended:true}))
app.use(cors())
app.use("/assets",express.static(path.join(__dirname,'public/assets')))


 /*File Storage SourceCode is coming from ->   https://www.npmjs.com/package/multer 
 Why To DO It ?Because The disk storage engine gives you full control on storing files to disk. 
 Whenever Someone Uploads any file onto our website, it will go to the provided destination with the provided filename
 Note: Multer will not append any file extension for you, your function should return a filename complete with an file extension. */
 const storage=multer.diskStorage({
    destination:function(req,file,cb){
        cb(null,"public/assets")
    },
    filename:function(req,file,cb){
        cb(null,file.originalname )
    }
 })
 const upload = multer({ storage: storage })          //This will help us to save the file, anytime we are going to upload the file, we are gonna use this variable


 /*MONGOOSE SETUP */
 const PORT=process.env.PORT || 6001
 mongoose.connect(process.env.MONGO_URL,{
    useNewUrlParser:true,
    useUnifiedTopology:true
 }).then(()=>{
    app.listen(PORT,()=>console.log(`Server Port : ${PORT}`))
 }).catch((error)=>{
    console.log(`${error} did not connect`)
 })