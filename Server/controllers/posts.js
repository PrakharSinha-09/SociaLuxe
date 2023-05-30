import Post from "../models/Post.js"
import User from "../models/User.js"

export const createPost=async(req,res)=>{
    try {
        const {userId, description, picturePath}=req.body
        const user=await User.findById(userId)

        const newPost=new Post({
            userId,
            firstName: user.firstName,
            lastName: user.lastName,
            location: user.location,
            description,
            userPicturePath: user.picturePath,
            picturePath,
            likes: {},
            comments:[]   
        })
        // const savedPost=await newPost.save()
        // res.status(201).json(savedPost)

        await newPost.save()
        const post=await Post.find()                                //will contain all the post
        res.status(201).json(post)

    }
    catch (err) {
        res.status(409).json({msg: err.message})
    }
}

/*Reading */                         
export const getFeedPosts=async (req,res)=>{                        //this end-point is like the news-feed which will have sort of every feed
    try{
        const post=await Post.find()
        res.status(200).json(post)
    }
    catch (err) {
        res.status(404).json({msg: err.message})
    }
}

export const getUserPosts=async (req,res)=>{   
    try{
        const { userId }=req.params
        const post=await Post.find({ userId })                     //this will only send those data to the variable named post which has a userId associated as provided from the font-end
        res.status(200).json(post)
    }
    catch(err)
    {
        res.status(404).json({msg: err.message})
    }
}

/*Update */
export const likePost=async (req,res)=>{
    try{
        const { id }=req.params
        const { userId }=req.body 
        const post=await Post.findById(id)
        const isLiked=post.likes.get(userId)                        //in likes, we are goona check, if the userID exists or not, if it exists means that post has been liked by that particular user
    
        if(isLiked){
            post.likes.delete(userId)
        }
    
        else{
            post.likes.set(userId,true)
        }
    
        const updatedPost=await Post.findByIdAndUpdate(
            id,
            { likes:post.likes },
            { new : true}                                           //will build the new object
        )
    
        res.status(200).json(updatedPost)
    }
    catch(err)
    {
        res.status(404).json({msg: err.message})
    }
}