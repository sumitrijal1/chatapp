import executeWithRetry from "../../services/dbretry.js"
import db from '../../db.js'
import { getIo } from "../../services/socket"


export const forwardMessage = async(req,res)=>{
   try {
      const senderId = req.user.id 
      const{
         messageIds,
         targetChatids =[]
      }= req.body 
      //validation

      if(!messageIds?.length){
         return res.status(400).json({
            message:"messageIds required"
         })
      }
      if(!targetChatids.length){
         return res.status(400).json({
            message:"No target chat specified"
         })
      }
      //fetch original message
      const placeholders = messageIds.map(()=>'?').json(',')
      const [messages] = await executeWithRetry(db,`SELECT * FROM message WHERE id IN (${placeholders}) `,[...messageIds]);

      if(!messages.length){
         return res.status(404).json({message:"Message not found"})
      }
      
      //verify sender is member of all chat
      
      const uniquechatid =[...new Set(targetChatids)]
      for(const chatid of uniquechatid){
         const [membership] = await executeWithRetry(db,`SELECT id FROM chat_member WHERE chat_id = ? AND user_id =?`,[chatid,senderId]);

         if(!membership.length){
            return res.status(403).json({
               message:`you are not a member of chat ${chatid}`
            })
         }
      }

      const io =getIo()
      for(const chatid of uniquechatid){
         for(const msg of messages){
            const [result] = await executeWithRetry(db,
               `INSERT INTO message (chat_id,sender_id,text,image,forwarded_from) VALUES(?,?,?,?,?)`,[chatid,senderId,msg.text,msg.image,msg.id]
            )
            const newmessage = {
         id:result.insertId,
         chat_id :chatid,
         sender_id:senderId ,
         text:msg.text,
         image:msg.image,
         forwarded_from:msg.id
         
      }
      io.to(`chat:${chatid}`).emit("new_message",newmessage)
         }
      }
      res.json({success:true});
      

   } catch (error) {
      console.error('error in forwardmessage:',error.message);
      res.status(500).json({message:error.message || "failed to forward message"})
   }
}