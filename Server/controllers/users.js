import User from "../models/User.js"

/*Read */
export const getUser=async(req,res)=>{
    try{
        const {id}=req.params
        const user=await User.findById(id)
        res.status(200).json(user)
    }

    catch(err){
        res.status(400).json({msg: err.message})
    }
}


export const getUserFriends=async(req,res)=>{
    try{
        const {id}=req.params
        const user=await User.findById(id)
    
        const friends=await Promise.all(                                    //why Promise.all, because here is the case of iteables, we have to use Promise.all to resolve them all.
            user.friends.map((id)=>User.findById(id))
        )
    
        const formattedFriends=friends.map(                                //formatting it, so that @ front-end it becomes pretty easy to understand! 
            ({_id, firstName, lastName, occupation, location, picturePath})=>{
                return {_id, firstName, lastName, occupation, location, picturePath}
            }
        )
    
        res.status(200).json(formattedFriends)
    }
    catch(err){
        res.status(400).json({msg: err.message})
    }
}

/*Update */
export const addRemoveFriend=async(req,res)=>{
    try{
        const {id, friendId}=req.params
        const user=await User.findById(id)                            //will get the user
        const friend=await User.findById(friendId)                    //will get the friend

        if(user.friends.includes(friendId)){
            user.friends=user.friends.filter((id)=>id!==friendId)
            friend.friends=friend.friends.filter((id)=>id!==id)
        }
        else{
            user.friends.push(friendId)
            friend.friends.push(id)
        }

        await user.save()
        await friend.save()

        const friends=await Promise.all(                                    
            user.friends.map((id)=>User.findById(id))
        )
        
        const formattedFriends=friends.map(                              
            ({_id, firstName, lastName, occupation, location, picturePath})=>{
                return {_id, firstName, lastName, occupation, location, picturePath}
            }
        )
        res.status(200).json(formattedFriends)

    }
    catch(err){
        res.status(400).json({msg: err.message})
    }
}