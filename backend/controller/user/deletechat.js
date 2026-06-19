import db from '../../db.js'
import { executeWithRetry } from '../../services/dbretry.js'

export const deletechatforme = async(req,res)=>{
    const userid = req.user.id
    const {chatid} =req.params

    try {
        //check membership of user in chat
        const [membership] = await executeWithRetry(db, `select  * from chat_members where chat_id =? and user_id=?`,[chatid,userid])
    if(membership.length === 0){
        return res.status(403).json({
            message:"you are not a member of this chat"
        })
    }   
    //delete the chat for the user
    const [row] = await executeWithRetry(db, `update chat_members set deleted_at = NOW() where chat_id =? and user_id =?`,[chatid,userid])
    
    if(row.affectedRows === 0){
        return res.status(404).json({
            message:"chat not found"
        })
    }
     res.status(200).json({
        message:"chat deleted for you successfully"

     })
    } catch(error) {
        console.error('Error in deletechatforme:', error.message)
        res.status(500).json({
            message: error.message || "Failed to delete chat"
        })
    }
}

