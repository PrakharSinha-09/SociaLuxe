import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import User from "../models/User.js"

/* Register User */
export const register=async (req,res)=>{
    try{

        const {
            firstName,
            lastName,
            email,
            password,
            picturePath,
            friends,
            location,
            occupation
        }=req.body
    
        //Creating Salt For Encrypting Password
        const salt=await bcrypt.genSalt()
        const passwordHash=await bcrypt.hash(password,salt)
    
        const newUser=new User({
            firstName,
            lastName,
            email,
            password:passwordHash,
            picturePath,
            friends,
            location,
            occupation,
            viewedProfile: Math.floor(Math.random()*10000),
            impressions : Math.floor(Math.random()*10000)
        })
        const savedUser=await newUser.save()
        res.status(201).json(savedUser)                       //sending it back so that frontend can receive this response.
    }

    catch(err){
        res.status(500).json({error: err.message})            //will return the error which is returned by mongodb, if in case any error occurs
    }
}

/*Logging In */
export const login=async(req,res)=>{
    try{
        const {email,password}=req.body
        const user=await User.findOne({email: email})                    //if email exist as provided by the user front end, it will load all the data regarding that person in the user varaible

        if(!user)
        {
            res.status(400).json({msg:"User Doesn't Exist!"})
        }

        //Password Matching, will be done if the user with given email exist obviously!
        const isMatch=await bcrypt.compare(password,user.password)       //ofCourse, same salt will be going to be used 
        if(!isMatch)
        {
            res.status(400).json({msg:"Invalid Credentials!"})
        }

        const token=jwt.sign({ id:user._id }, process.env.JWT_SECRET)
        delete user.password                                              //this is important, so that password doesn't goto frontend
        res.status(200).json()

    }
    catch(err){
        res.status(500).json({error: err.message})                        //will return the error which is returned by mongodb, if in case any error occurs
    }
}