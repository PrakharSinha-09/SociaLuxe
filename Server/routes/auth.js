import express from "express";
import { login } from "../controllers/auth.js"

const router=express.Router()

router.post("/login",login)             //this will interpreted as auth/login rather than just /login because inside index.js we have done app.use("/auth",authRoutes), which will tell that in any of the routes like /login , auth needs to be in prefix!

export default router