import db from "../../db.js";
import { executeWithRetry } from "../../services/dbretry.js";
import { getIo } from '../../services/socket.js'

export const forwardMessage = async (req, res) => {
   try {
   const senderId = req.user.id;

   const {
      messageIds,
      targetUserIds = [],
      targetGroupChatIds = []
   } = req.body;

  

      // =========================================
      // 1. FETCH ORIGINAL MESSAGES
      // =========================================

      const [messages] = await executeWithRetry(db,
         `
         SELECT *
         FROM message
         WHERE id IN (?)
         `,
         [messageIds]
      );

      // all chats where messages will be forwarded
      const finalChatIds = [];

      // =========================================
      // 2. HANDLE PRIVATE CHATS
      // =========================================
      // 
      for (const targetUserId of targetUserIds) {

         // -------------------------------------
         // CHECK EXISTING PRIVATE CHAT
         // -------------------------------------

         const [existingChats] = await executeWithRetry(db,
            `
            SELECT c.id
            FROM chat c

            JOIN chat_member cm1
               ON c.id = cm1.chat_id

            JOIN chat_member cm2
               ON c.id = cm2.chat_id

            WHERE c.type = 'private'
            AND cm1.user_id = ?
            AND cm2.user_id = ?
            `,
            [senderId, targetUserId]
         );

         let chatId;

         // -------------------------------------
         // CHAT EXISTS
         // -------------------------------------

         if (existingChats.length > 0) {

            chatId = existingChats[0].id;

         } else {

            // ----------------------------------
            // CREATE NEW PRIVATE CHAT
            // ----------------------------------

            const [chatResult] = await executeWithRetry(db,
               `
               INSERT INTO chat(type)
               VALUES ('private')
               `
            );

            chatId = chatResult.insertId;

            // add members

            await executeWithRetry(db,
               `
               INSERT INTO chat_member(chat_id, user_id)
               VALUES (?, ?), (?, ?)
               `,
               [
                  chatId,
                  senderId,
                  chatId,
                  targetUserId
               ]
            );
         }

         finalChatIds.push(chatId);
      }

      // =========================================
      // 3. ADD GROUP CHATS
      // =========================================

      finalChatIds.push(...targetGroupChatIds);

      // remove duplicates
      const uniqueChatIds = [...new Set(finalChatIds)];

      // =========================================
      // 4. FORWARD MESSAGES
      // =========================================

      for (const chatId of uniqueChatIds) {

         for (const msg of messages) {

            const [result] = await executeWithRetry(db,
               `
               INSERT INTO message
               (
                  chat_id,
                  sender_id,
                  text,
                  image,
                  forwarded_from
               )
               VALUES (?, ?, ?, ?, ?)
               `,
               [
                  chatId,
                  senderId,
                  msg.text,
                  msg.image,
                  msg.id
               ]
            );

            const newMessage = {
               id: result.insertId,
               chat_id: chatId,
               sender_id: senderId,
               text: msg.text,
               image: msg.image,
               forwarded_from: msg.id
            };

            // realtime event
            const io = getIo()
            io.to(`chat:${chatId}`).emit(
               "new_message",
               newMessage
            );
         }
      }

      // =========================================
      // RESPONSE
      // =========================================

      res.json({
         success: true
      });
   } catch (error) {
        console.error('Error in forwardMessage:', error.message);
        res.status(500).json({ message: error.message || "Failed to forward message" });
   }
};