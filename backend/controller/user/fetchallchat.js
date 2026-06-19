import db from "../../db.js";
import { executeWithRetry } from "../../services/dbretry.js";

export const getchat = async (req, res) => {
    const userid = req.user.id;

    try {

        const [chats] = await executeWithRetry(db, `
            SELECT
                c.id,
                c.type,
                c.name,

                CASE
                    WHEN c.type = 'private' THEN (
                        SELECT u.name
                        FROM chat_members cm2
                        JOIN users u ON u.id = cm2.user_id
                        WHERE cm2.chat_id = c.id
                        AND cm2.user_id != ?
                        LIMIT 1
                    )
                    ELSE NULL
                END AS otherusername,

                CASE
                    WHEN c.type = 'private' THEN (
                        SELECT u.id
                        FROM chat_members cm2
                        JOIN users u ON u.id = cm2.user_id
                        WHERE cm2.chat_id = c.id
                        AND cm2.user_id != ?
                        LIMIT 1
                    )
                    ELSE NULL
                END AS otheruserid,
               
                CASE
                    WHEN c.type = 'group' THEN (
                        SELECT GROUP_CONCAT(u.id) 
                        FROM chat_members cm2   
                        JOIN users u ON u.id = cm2.user_id
                        WHERE cm2.chat_id = c.id
                        AND cm2.user_id != ?
                    )
                    ELSE NULL
                END AS groupmembers,
                
                CASE
    WHEN c.type = 'group' THEN (
        SELECT GROUP_CONCAT(u.name)
        FROM chat_members cm2   
        JOIN users u ON u.id = cm2.user_id
        WHERE cm2.chat_id = c.id
        AND cm2.user_id != ?
    )
    ELSE NULL
END AS groupmembernames
                    

            FROM chat c

            JOIN chat_members cm
                ON c.id = cm.chat_id

            WHERE cm.user_id = ?
            AND cm.deleted_at IS NULL

            ORDER BY c.id DESC
        `, [userid, userid, userid,userid,userid]);

        res.status(200).json({
            message: "Chats fetched successfully",
            data: chats
        });

    } catch (error) {
        console.log(error);

        res.status(500).json({
            message: error.message
        });
    }
};
//First JOIN creates all chat-member rows, second LEFT JOIN fetches other members excluding the logged-in user, third JOIN fetches their details, and finally WHERE filters everything to only the logged-in user’s chats.

//  first join  we are joining all the loggesin user with the chart table to get all the charts of the logged in user 
//second left join is used to get the other user of the chart if there is any and we are using left join because there can be group chat in that case there will be no other user and we don't want to lose those charts
 // second left join is used to get all the charts of the logged in user and also get the other user of the chart if there is any
//third join is used to get the details of the other user