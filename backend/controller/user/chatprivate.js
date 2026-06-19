import db from '../../db.js'
import { executeWithRetry } from '../../services/dbretry.js'
//create chat between two users

export const privatechat = async(req,res)=>{
    const senderid = req.user.id
    const receiverId = req.params.receiverId
     
    try {
    //check if a private chat already exists between the two users
    const [existingchat] = await executeWithRetry(db, `SELECT c.id
    FROM chat c
    JOIN chat_members cm ON c.id = cm.chat_id
    WHERE c.type = "private"     
    GROUP BY c.id
    HAVING   
     COUNT(cm.user_id) = 2 AND
     SUM(cm.user_id IN (?, ?)) = 2;`, [senderid,receiverId]); // check if both sender and receiver are part of the chat   

   if(existingchat.length > 0){
    await executeWithRetry(db, `
        UPDATE chat_members 
        SET deleted_at = NULL 
        WHERE chat_id = ? AND user_id = ?
    `, [existingchat[0].id, senderid]);

    // fetch the other user's name too
    const [users] = await executeWithRetry(db, 'SELECT id, name FROM users WHERE id=?', [receiverId])
    const user = users[0]

    return res.status(200).json({
        data: {                          // ✅ same shape as new chat
            id: existingchat[0].id,
            type: "private",
            otheruserid: receiverId,
            otherusername: user.name
        }
    })
}
    const [users] = await executeWithRetry(db,
   'SELECT id,name FROM users WHERE id=?',
   [receiverId]
)

const user = users[0]

   //creating the private chat
   const [chatresult] = await executeWithRetry(db, 'insert into chat(type) values(?)',[ 'private' ])

   const chatid = chatresult.insertId;
   await executeWithRetry(db, 'insert into chat_members(chat_id,user_id) values (?,?),(?,?)',[chatid,senderid,chatid,receiverId]);
    res.status(201).json({
   data:{
      id:chatid,
      type:"private",
      otheruserid:receiverId,
      otherusername:user.name
   }
})
    } catch (error) {
        console.error('Error in privatechat:', error.message);
        res.status(500).json({ message: error.message || "Failed to create chat" });
    }
}
