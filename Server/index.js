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
import authRoutes from "./routes/auth.js"
import userRoutes from "./routes/users.js"
import postRoutes from "./routes/posts.js"
import exp from "constants";
import { register } from "./controllers/auth.js"
import { createPost } from "./controllers/posts.js"
import { verifyToken } from "./middleware/auth.js";
import User from "./models/User.js";
import Post from "./models/Post.js";
import {users,posts} from "./data/index.js"

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


 /*Routes With Files */
 //As We Are Well Aware, that first argument is the endpoint, second arg is the middleware, and last argument is the function which will tell what to do when endpoint is hit...functionality would be that, it ould save the registered user in the database
 app.post("/auth/register",upload.single("picture"),register)
 app.post("/posts",verifyToken,upload.single("picture"),createPost)

 /*Routes */
 
 app.use("/auth",authRoutes)
 app.use("/users",userRoutes)
 app.use("/posts",postRoutes)
 
 /*MONGOOSE SETUP */
 const PORT=process.env.PORT || 6001
 mongoose.connect('mongodb+srv://PrakharSinha_09:9N7G8F66Q3ResvN9@cluster0.fvyw7bu.mongodb.net/?retryWrites=true&w=majority',{
    useNewUrlParser:true,
    useUnifiedTopology:true
 }).then(()=>{
    app.listen(PORT,()=>console.log(`Server Port : ${PORT}`))

    /*Add data one time */
   //  User.insertMany(users)
   //  Post.insertMany(posts)
 }).catch((error)=>{
    console.log(`${error} did not connect`)
 })