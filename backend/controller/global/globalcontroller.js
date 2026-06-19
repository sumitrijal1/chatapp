 import db from '../../db.js'
import { executeWithRetry } from '../../services/dbretry.js'

export const getallusers = async(req,res)=>{
    const userid= req.user.id
    const [users] = await executeWithRetry(db, 'SELECT id,name,email FROM users WHERE id != ?',[userid])
     
    if(users.length >0){
        res.status(200).json({
            message:'users retrieved successfully',
            data:users
        })
    }
}

