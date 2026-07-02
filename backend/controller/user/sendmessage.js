import db from '../../db.js'
import { executeWithRetry } from '../../services/dbretry.js'
import cloudinary from '../../services/cloudinary.js'
import { getIo } from '../../services/socket.js'

export const sendmessage = async (req, res) => {
   try {
   const senderid = req.user.id;
   const{chatid} = req.params;
   //reply_to is the message id to which the new message is replying, it can be null if its not a reply
   const { text =null, image =null, reply_to = null } = req.body;



      // check membership
      const [membership] = await executeWithRetry(db,
         `SELECT 1 FROM chat_members WHERE chat_id = ? AND user_id = ?`,
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
      const [result] = await executeWithRetry(db,
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
         sent_at: new Date(),
         
      };

      // socket emit (standard format)
      const io=getIo()
      io.to(`chat:${chatid}`).emit("newMessage", message);

      res.status(201).json({
         success: true,
         data: message
      });
    } catch (error) {
        console.error('Error in sendmessage:', error.message);
        res.status(500).json({ message: error.message || "Failed to send message" });
    }
};

// Socket = "live" को necessary condition हो, तर sufficient होइन। Socket ले data ल्याउँछ (यो बिना live हुँदैन, तपाईंले page 
//    refresh गर्नुपर्ने हुन्थ्यो वा polling चलाउनु पर्ने हुन्थ्यो)। तर UI मा त्यो data देखिनको लागि कुनै न कुनै reactive state system (Redux को useSelector,
//        वा React को useState) 
// चाहिन्छ जसले "state फेरियो, अब re-render गर" भन्ने काम गर्छ। दुबै मिलेर मात्र "live update" बन्छ — कुनै एउटाले मात्र गर्दैन।