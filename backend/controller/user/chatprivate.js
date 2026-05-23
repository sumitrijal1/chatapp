const db = require('../../db')
//create chat between two users

exports.privatechat = async(req,res)=>{
    const senderid = req.user.id
    const receiverid = req.params.id
     
    //check if a private chat already exists between the two users
    const [existingchat] = await db.execute(`SELECT c.id
    FROM chat c
    JOIN chat_members cm ON c.id = cm.chat_id
    WHERE c.type = "private"
    GROUP BY c.id
    HAVING 
   
    AND SUM(cm.user_id IN (?, ?)) = 2;`,[senderid,receiverid]); // check if both sender and receiver are part of the chat   

    if(existingchat.length > 0){
        return res.status(200).json({
            message:"chat already exists",
            chatId: existingchat[0].id
        })
    }
    

   //creating the private chat
   const [chatresult] = await db.execute('insert into chat(type) values(?)',[ 'private' ])

   const chatid = chatresult.insertId;
   await db.execute('insert into chat_members(chat_id,user_id) values (?,?),(?,?)',[chatid,senderid,chatid,receiverid]);
    res.status(201).json({
   data:{
      id:chatid,
      type:"private",
      otheruserid:receiverid,
      otherusername:user.name
   }
})

   


}
