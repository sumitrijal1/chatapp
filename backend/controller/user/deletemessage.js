const db = require('../../db')

exports.deletemessageforme = async (req,res)=>{
    const userid = req.user.id 
    const {messageid} = req.params

    //check if the message exists and belongs to the user
    const [message]= await db.execute(`select * from messages where id =? `,[messageid])
    if(message.length === 0){
        return res.status(404).json({
            message:"message not found"
        })
    }   

    const resultmessage = message[0]
        //check membership of the user in the chat
        const [ membership] = await db.execute(`select * from chat_member where chat_id = ? and user_id =?`,[resultmessage.chat_id,userid])

     if(membership.length === 0){
        return res.status(403).json({
            message:"you are not a member of this chat"
        })
    }
    //prevent duplicate deletion
    const [existingdelete] = await db.execute(`select * from messages_deletes where message_id =? and user_id =?`,[messageid,userid])
    if(existingdelete.length > 0){
        return res.status(400).json({   
            message:"you have already deleted this message"
        })
    }       



    //delete the message for the user
    await db.execute('insert into messages_deletes(message_id,user_id) values (?,?)',[messageid,userid])
    

    res.status(200).json({
        message:"message deleted for you successfully",
        

    })
}

exports.deleteforeveryone = async (req, res) => {
    const userid = req.user.id;
    const { messageid } = req.params;

    // check message exists and user is sender
    const [message] = await db.execute(
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
    await db.execute(
        `UPDATE messages SET deleted_at = NOW() WHERE id = ?`,
        [messageid]
    );

    res.status(200).json({
        message: "message deleted for everyone successfully"
    });
};

exports.undodelteforeveryone = async (req, res) => {
    const userid = req.user.id;
    const { messageid } = req.params;

    const [message] = await db.execute(
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
    const [result] = await db.execute(
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
};