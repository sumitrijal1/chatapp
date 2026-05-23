const db = require("../../db");
const { io } = require("../../server");

exports.forwardMessage = async (req, res) => {

   const senderId = req.user.id;

   const {
      messageIds,
      targetUserIds = [],
      targetGroupChatIds = []
   } = req.body;

  

      // =========================================
      // 1. FETCH ORIGINAL MESSAGES
      // =========================================

      const [messages] = await db.execute(
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

         const [existingChats] = await db.execute(
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

            const [chatResult] = await db.execute(
               `
               INSERT INTO chat(type)
               VALUES ('private')
               `
            );

            chatId = chatResult.insertId;

            // add members

            await db.execute(
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

            const [result] = await db.execute(
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

  
};