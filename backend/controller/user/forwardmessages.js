import executeWithRetry from "../../services/dbretry.js"
import db from '../../db.js'
import { getIo } from "../../services/socket.js"

export const forwardMessage = async (req, res) => {
   try {
      const senderId = req.user.id
      const { messageIds, targetChatids = [] } = req.body

      if (!messageIds?.length) {
         return res.status(400).json({ message: "messageIds required" })
      }
      if (!targetChatids.length) {
         return res.status(400).json({ message: "No target chat specified" })
      }

      // ✅ fetch original messages — table: messages
      const placeholders = messageIds.map(() => '?').join(',')
      const [messages] = await executeWithRetry(db,
         `SELECT * FROM messages WHERE id IN (${placeholders})`,
         [...messageIds]
      );

      if (!messages.length) {
         return res.status(404).json({ message: "Message not found" })
      }

      // ✅ verify sender is member of all target chats — table: chat_members
      const uniquechatid = [...new Set(targetChatids)]
      for (const chatid of uniquechatid) {
         const [membership] = await executeWithRetry(db,
            `SELECT id FROM chat_members WHERE chat_id = ? AND user_id = ? AND deleted_at IS NULL`,
            [chatid, senderId]
         );
         if (!membership.length) {
            return res.status(403).json({ message: `you are not a member of chat ${chatid}` })
         }
      }

      const io = getIo()
      const forwardedMessages = []

      for (const chatid of uniquechatid) {
         for (const msg of messages) {
            // ✅ correct columns: content, image_url; forwarded_from tracks original
            const [result] = await executeWithRetry(db,
               `INSERT INTO messages (chat_id, sender_id, content, image_url, forwarded_from) VALUES (?,?,?,?,?)`,
               [chatid, senderId, msg.content, msg.image_url, msg.id]
            )

            const newmessage = {
               id: result.insertId,
               chat_id: chatid,
               sender_id: senderId,
               content: msg.content,
               image_url: msg.image_url,
               forwarded_from: msg.id,
               reply_to: null,
               sent_at: new Date()
            }

            io.to(`chat:${chatid}`).emit("newMessage", newmessage)  // ✅ matches frontend
            forwardedMessages.push(newmessage)
         }
      }

      res.json({ success: true, data: forwardedMessages });

   } catch (error) {
      console.error('error in forwardmessage:', error.message);
      res.status(500).json({ message: error.message || "failed to forward message" })
   }
}