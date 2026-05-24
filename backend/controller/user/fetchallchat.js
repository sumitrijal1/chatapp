import db from '../../db.js'
// backend — fix function name and query
export const getchat = async(req, res) => {
    const userid = req.user.id
    try {
        const [chats] = await db.execute(`
            SELECT 
                c.id, 
                c.type, 
                c.name,
                u.id AS otheruserid,
                u.name AS otherusername
            FROM chat c                                        -- ✅ 'chat' not 'chats'
            JOIN chat_members cm ON c.id = cm.chat_id         -- ✅ 'chat_id'
            LEFT JOIN chat_members cm2 ON c.id = cm2.chat_id  -- ✅ 'chat_id'
                AND cm2.user_id != ?                          -- ✅ 'user_id'
            LEFT JOIN users u ON cm2.user_id = u.id           -- ✅ 'user_id'
            WHERE cm.user_id = ?                              -- ✅ 'user_id'
            AND cm.deleted_at IS NULL
        `, [userid, userid])

        console.log("chats:", chats)
        res.status(200).json({
            message: "chats retrieved successfully",
            data: chats
        })
    } catch(error) {
        console.log("error:", error.message)
        res.status(500).json({ message: error.message })
    }
}
//First JOIN creates all chat-member rows, second LEFT JOIN fetches other members excluding the logged-in user, third JOIN fetches their details, and finally WHERE filters everything to only the logged-in user’s chats.

//  first join  we are joining all the loggesin user with the chart table to get all the charts of the logged in user 
//second left join is used to get the other user of the chart if there is any and we are using left join because there can be group chat in that case there will be no other user and we don't want to lose those charts
 // second left join is used to get all the charts of the logged in user and also get the other user of the chart if there is any
//third join is used to get the details of the other user