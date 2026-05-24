import db from '../../db.js'

export const creategroupchat = async(req,res)=>{
    const userid = req.user.id
    //here receiverid is an array of user ids that will be added to the group chat
    const{name,receiverId} = req.body 
    //check if the group chat name is provided
    if(!name){
        return res.status(400).json({
            message:"please provide a name for the group chat"
        })
    }
    //check if receiverid is provided
    //array.isarray is used to check if the receiverid is an array of user ids
    if(!receiverId || !Array.isArray(receiverId)){
        return res.status(400).json({
            message:"please provide a list of users for the group chat"
        })
    }
    const [chatresult ]= await db.execute('insert into chat (type,name) values(?,?) ',['group',name])
    const chatid = chatresult.insertId 
    const chatname = name

    //now we have the chatid of the newly created group chat and we have the list of user ids that will be added to the group chat

    const values  = receiverId.map(id=>[chatid,id]);
    values.push([chatid,userid])
    await db.execute('insert into chat_members(chat_id,user_id) values ?',[values]);

   res.status(201).json({
   data:{
      id:chatid,
      type:"group",
      name:chatname
   }
})
}






 //if we donot want to make the group wit existing user than we can do but basically in real world same user with differeent group can exist so we are not checking for that
    //but the code is written like this if we want to check for that
//     const members = [senderId, ...otherUserIds];

// // ⚠️ important: remove duplicates + sort
// const uniqueMembers = [...new Set(members)].sort((a, b) => a - b);

// // create placeholders (?, ?, ?, ...)
// const placeholders = uniqueMembers.map(() => '?').join(',');

// const [existingChat] = await db.execute(
//   `
//   SELECT cm.chat_id
//   FROM chat_members cm
//   JOIN chat c ON c.id = cm.chat_id
//   WHERE c.type = 'group'
//   GROUP BY cm.chat_id
//   HAVING 
//     COUNT(DISTINCT cm.user_id) = ?
//     AND (
//       SELECT COUNT(*) 
//       FROM chat_members cm2 
//       WHERE cm2.chat_id = cm.chat_id
//     ) = ?
//   `,
//   [...uniqueMembers, uniqueMembers.length, uniqueMembers.length]
// );
//we can write c.id or cm.chatid both will work because we are joining the chat table with chat_members table and both tables have id column but to avoid confusion we can write c.id