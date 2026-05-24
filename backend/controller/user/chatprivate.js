import db from '../../db.js'
//create chat between two users

export const privatechat = async(req,res)=>{
    const senderid = req.user.id
    const receiverId = req.params.receiverId
     
    //check if a private chat already exists between the two users
    const [existingchat] = await db.execute(`SELECT c.id
    FROM chat c
    JOIN chat_members cm ON c.id = cm.chat_id
    WHERE c.type = "private"
    GROUP BY c.id
    HAVING   
    COUNT(cm.user_id) = 2 AND
     SUM(cm.user_id IN (?, ?)) = 2;`,[senderid,receiverId]); // check if both sender and receiver are part of the chat   

    if(existingchat.length > 0){
        return res.status(200).json({
            message:"chat already exists",
            chatId: existingchat[0].id
        })
    }
    const [users] = await db.execute(
   'SELECT id,name FROM users WHERE id=?',
   [receiverId]
)

const user = users[0]

   //creating the private chat
   const [chatresult] = await db.execute('insert into chat(type) values(?)',[ 'private' ])

   const chatid = chatresult.insertId;
   await db.execute('insert into chat_members(chat_id,user_id) values (?,?),(?,?)',[chatid,senderid,chatid,receiverId]);
    res.status(201).json({
   data:{
      id:chatid,
      type:"private",
      otheruserid:receiverId,
      otherusername:user.name
   }
})

   


}
