import db from '../../db.js'
import cloudinary from '../../services/cloudinary.js'
import { io, server } from '../../server.js'

export const sendmessage = async (req, res) => {

   const senderid = req.user.id;
   const{chatid} = req.params;
   //reply_to is the message id to which the new message is replying, it can be null if its not a reply
   const { text, image, reply_to = null } = req.body;



      // check membership
      const [membership] = await db.execute(
         `SELECT 1 FROM chat_member WHERE chat_id = ? AND user_id = ?`,
         [chatid, senderid]
      );

      if (membership.length === 0) {
         return res.status(403).json({
            message: "you are not a member of this chat"
         });
      }

      // upload image
      let imageurl = null;

      if (image) {
         const uploadresponse = await cloudinary.uploader.upload(image);
         imageurl = uploadresponse.secure_url;
      }

      // insert message
      const [result] = await db.execute(
         `INSERT INTO messages
         (chat_id, sender_id, content, image_url, reply_to)
         VALUES (?, ?, ?, ?, ?)`,
         [chatid, senderid, text, imageurl, reply_to]
      );

      // build response message (no extra query)
      const message = {
         id: result.insertId,
         chat_id: chatid,
         sender_id: senderid,
         content: text,
         image_url: imageurl,
         reply_to,
         createdAt: new Date()
      };

      // socket emit (standard format)
      io.to(`chat:${chatid}`).emit("newMessage", message);

      res.status(201).json({
         success: true,
         data: message
      });

   
};