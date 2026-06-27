 import db from '../../db.js'
import { executeWithRetry } from '../../services/dbretry.js'
import { getIo } from '../../services/socket.js'

export const getallusers = async(req,res)=>{
    const userid= req.user.id
    console.log("logged in userid:", userid) 
    const [users] = await executeWithRetry(db, 'SELECT id,name,email FROM users WHERE id != ?',[userid])
     console.log("users returned:", users)
    
    if(users.length >0){
        res.status(200).json({
            message:'users retrieved successfully',
            data:users
        })
    }

}

