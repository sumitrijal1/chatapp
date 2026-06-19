import db from '../../db.js'
import { executeWithRetry } from '../../services/dbretry.js'

export const deletemessageforme = async (req,res)=>{
    const userid = req.user.id 
    const {messageid} = req.params

    try {
    //check if the message exists and belongs to the user
    const [message]= await executeWithRetry(db, `select * from messages where id =? `,[messageid])
    if(message.length === 0){
        return res.status(404).json({
            message:"message not found"
        })
    }   

    const resultmessage = message[0]
        //check membership of the user in the chat
        const [ membership] = await executeWithRetry(db, `select * from chat_member where chat_id = ? and user_id =?`,[resultmessage.chat_id,userid])

     if(membership.length === 0){
        return res.status(403).json({
            message:"you are not a member of this chat"
        })
    }
    //prevent duplicate deletion
    const [existingdelete] = await executeWithRetry(db, `select * from messages_deletes where message_id =? and user_id =?`,[messageid,userid])
    if(existingdelete.length > 0){
        return res.status(400).json({   
            message:"you have already deleted this message"
        })
    }       



    //delete the message for the user
    await executeWithRetry(db, 'insert into messages_deletes(message_id,user_id) values (?,?)',[messageid,userid])
    

    res.status(200).json({
        message:"message deleted for you successfully",
        

    })
    } catch (error) {
        console.error('Error in deletemessageforme:', error.message);
        res.status(500).json({ message: error.message || "Failed to delete message" });
    }
}

export const deleteforeveryone = async (req, res) => {
    const userid = req.user.id;
    const { messageid } = req.params;

    try {
    // check message exists and user is sender
    const [message] = await executeWithRetry(db,
        `SELECT * FROM messages WHERE id = ? AND sender_id = ?`,
        [messageid, userid]
    );

    if (message.length === 0) {
        return res.status(404).json({
            message: "message not found or you are not the sender"
        });
    }

    const msg = message[0];

    // optional: prevent double delete
    if (msg.deleted_at) {
        return res.status(400).json({
            message: "message already deleted for everyone"
        });
    }

    // delete for everyone (soft delete)
    await executeWithRetry(db,
        `UPDATE messages SET deleted_at = NOW() WHERE id = ?`,
        [messageid]
    );

    res.status(200).json({
        message: "message deleted for everyone successfully"
    });
    } catch (error) {
        console.error('Error in deleteforeveryone:', error.message);
        res.status(500).json({ message: error.message || "Failed to delete message" });
    }
};

export const undodelteforeveryone = async (req, res) => {
    const userid = req.user.id;
    const { messageid } = req.params;

    try {
    const [message] = await executeWithRetry(db,
        `SELECT * FROM messages WHERE id = ? AND sender_id = ?`,
        [messageid, userid]
    );

    if (message.length === 0) {
        return res.status(404).json({
            message: "message not found or you are not the sender"
        });
    }

    const msg = message[0];

    if (!msg.deleted_at) {
        return res.status(400).json({
            message: "message is not deleted"
        });
    }
  // restore the message by setting deleted_at to NULL
// only restore if it was previously deleted
    const [result] = await executeWithRetry(db,
        `UPDATE messages SET deleted_at = NULL WHERE id = ? AND deleted_at IS NOT NULL`,
        [messageid]
    );
  // check if any row was updated
    if (result.affectedRows === 0) {
        return res.status(400).json({
            message: "failed to restore message"
        });
    }

    res.status(200).json({
        message: "message restored for everyone successfully"
    });
    } catch (error) {
        console.error('Error in undodelteforeveryone:', error.message);
        res.status(500).json({ message: error.message || "Failed to restore message" });
    }
};