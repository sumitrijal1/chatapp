import db from '../../db.js'
import { executeWithRetry } from '../../services/dbretry.js'

export const getmessage = async(req,res)=>{
    const userid = req.user.id
    const {chatid} = req.params;
    try{

    //check membership of the user in the chat
    const [membership] = await executeWithRetry(db, `select * from chat_members where  chat_id=? and user_id=?`,[chatid,userid])

    if(membership.length === 0){
        return res.status(403).json({
            message:"you are not a member of this chat"
        })
    }   
    //fetch messages of the chat
     // fetch messages with BOTH delete rules
     const [message] = await executeWithRetry(db, 
        `
        SELECT 
            m.*,
            CASE 
                WHEN m.forwarded_from IS NOT NULL THEN 1 
                ELSE 0 
            END AS is_forwarded
        FROM messages m
        LEFT JOIN message_deletes md
            ON m.id = md.message_id
            AND md.user_id = ?
        WHERE m.chat_id = ?
        AND md.message_id IS NULL
        ORDER BY m.sent_at ASC
        `,
        [userid, chatid]
    );
    //instead of using case end its equivalent is is_forwarded = (message.forwarded_from !== null) ? 1 : 0;since sql donot use terninary operatior condition? value1:value2 so we use case end for that purpose
     res.status(200).json({
        message:"messages fetched successfully",
        data:message
     })
    }catch(error){
        console.log(error);
        res.status(500).json({
            message:error.message
        })
    }
}
// Always fetch in backend → send through socket
// Never fetch in frontend after socket event